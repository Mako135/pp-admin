import { authStore } from "@/shared/lib/auth-store";
import { refreshToken } from "./token";

export const CORE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_URLS = {
	core: CORE_URL,
	auth: CORE_URL,
} as const;

export type ApiClientType = keyof typeof API_URLS;

interface FetchClientOptions extends RequestInit {
	timeout?: number;
	_retry?: boolean;
}

async function getGlobalToken(): Promise<string | null> {
	const store = authStore();

	if (store.token) {
		return store.token;
	}

	if (store.tokenPromise) {
		return store.tokenPromise;
	}

	const promise = _fetchToken();
	store.setTokenPromise(promise);
	return promise;
}

async function _fetchToken(): Promise<string | null> {
	const store = authStore();

	try {
		if (typeof window === "undefined") {
			// На сервере получаем токен из cookies
			const { cookies } = await import("next/headers");
			const token = (await cookies()).get("access_token_cookie")?.value || null;
			store.setToken(token);
			return token;
		}

		// На клиенте делаем запрос к API роуту
		const res = await fetch("/api/token");
		const data = await res.json();
		const token = typeof data === "string" ? data : data?.access || null;
		store.setToken(token);
		return token;
	} catch {
		return null;
	} finally {
		store.setTokenPromise(null);
	}
}

async function handleGlobalTokenRefresh(): Promise<string | null> {
	const store = authStore();

	// Если уже идет refresh, возвращаем существующий Promise
	if (store.refreshPromise) {
		return store.refreshPromise;
	}

	const promise = (async () => {
		try {
			store.setToken(null);
			store.setTokenPromise(null);

			const { access } = await refreshToken();
			if (access) {
				store.setToken(access);
				return access;
			}
			return null;
		} catch {
			return null;
		} finally {
			store.setRefreshPromise(null);
		}
	})();

	store.setRefreshPromise(promise);
	return promise;
}

export const clearAllTokens = () => {
	const store = authStore();
	store.clearAllTokens();
};
class FetchClient {
	private baseURL: string;
	private timeout: number;
	private defaultHeaders: HeadersInit;
	private skipAuth: boolean;

	constructor(
		apiType: ApiClientType = "core",
		timeout = 10000,
		serverHeaders?: Record<string, string>,
		skipAuth = false,
	) {
		this.baseURL = API_URLS[apiType] || "";
		this.timeout = timeout;
		this.skipAuth = skipAuth || apiType === "auth";
		this.defaultHeaders = {
			"Accept-Language": "ru",
			...serverHeaders,
		};
	}

	private async fetchWithTimeout(
		url: string,
		options: RequestInit = {},
	): Promise<Response> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), this.timeout);

		try {
			// В серверном окружении (Node.js/Bun) добавляем агент для игнорирования SSL ошибок если указано
			if (
				typeof window === "undefined" &&
				process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0"
			) {
				// В Bun это работает через переменную окружения NODE_TLS_REJECT_UNAUTHORIZED
				console.warn("[FetchClient] SSL verification is disabled");
			}

			const response = await fetch(url, {
				...options,
				signal: controller.signal,
			});
			clearTimeout(id);
			return response;
		} catch (error) {
			clearTimeout(id);
			throw error;
		}
	}

	async request<T>(
		endpoint: string,
		options: FetchClientOptions = {},
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		const headers = new Headers(this.defaultHeaders);

		if (options.headers) {
			const customHeaders = new Headers(options.headers);
			customHeaders.forEach((value, key) => {
				headers.set(key, value);
			});
		}

		if (options.body && !headers.has("Content-Type")) {
			if (options.body instanceof FormData) {
				// Для FormData не устанавливаем Content-Type, браузер сам добавит с boundary
			} else if (options.body instanceof Blob) {
				headers.set(
					"Content-Type",
					options.body.type || "application/octet-stream",
				);
			} else if (options.body instanceof URLSearchParams) {
				headers.set("Content-Type", "application/x-www-form-urlencoded");
			} else if (typeof options.body === "string") {
				try {
					JSON.parse(options.body);
					headers.set("Content-Type", "application/json");
				} catch {
					headers.set("Content-Type", "text/plain");
				}
			} else {
				headers.set("Content-Type", "application/json");
			}
		}

		if (!this.skipAuth && !headers.has("Authorization")) {
			if (typeof window === "undefined") {
				const { cookies } = await import("next/headers");
				const token =
					(await cookies()).get("access_token_cookie")?.value || null;
				if (token) {
					headers.set("Authorization", `Bearer ${token}`);
				}
			} else {
				let token = await getGlobalToken();

				if (!token) {
					token = await handleGlobalTokenRefresh();
				}

				if (token) {
					headers.set("Authorization", `Bearer ${token}`);
				}
			}
		}

		let response = await this.fetchWithTimeout(url, {
			...options,
			credentials: "include",
			headers,
		});

		if (!this.skipAuth && response.status === 401 && !options._retry) {
			options._retry = true;

			const newToken = await handleGlobalTokenRefresh();
			if (newToken) {
				headers.set("Authorization", `Bearer ${newToken}`);

				const newHeaders = new Headers(headers);

				response = await this.fetchWithTimeout(url, {
					...options,
					credentials: "include",
					headers: newHeaders,
				});
			}
		}

		if (!response.ok) {
			const contentType = response.headers.get("content-type") ?? "";
			let parsedBody: unknown = null;
			try {
				if (contentType.includes("application/json")) {
					parsedBody = await response.json();
				} else {
					parsedBody = await response.text();
				}
			} catch {
				parsedBody = null;
			}

			throw {
				isFetchClientError: true,
				response: {
					status: response.status,
					data: parsedBody,
					headers: response.headers,
				},
				request: null,
			};
		}

		// Для 204 No Content и других пустых ответов
		if (
			response.status === 204 ||
			response.headers.get("content-length") === "0"
		) {
			return {} as T;
		}

		const contentType = response.headers.get("content-type");

		if (contentType?.includes("application/json")) {
			return response.json();
		}
		if (contentType?.includes("text/")) {
			return response.text() as unknown as T;
		}
		if (
			contentType?.includes("application/octet-stream") ||
			contentType?.includes("image/") ||
			contentType?.includes("video/")
		) {
			return response.blob() as unknown as T;
		}

		return response as T;
	}
}

export const createApiClient = (
	apiType: ApiClientType = "core",
	timeOut = 10000,
	serverHeaders?: Record<string, string>,
): FetchClient => {
	return new FetchClient(apiType, timeOut, serverHeaders);
};
