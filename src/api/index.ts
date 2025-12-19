import { type ApiClientType, createApiClient } from "@/api/config";
import { normalizeApiErrorPayload } from "@/api/error";

type Ok<T> = { ok: true; data: T };
export type ErrorResponse = {
	ok: false;
	message: string;
	validation?: Record<string, string[]>;
	status?: number;
};
type ApiResult<T> = Ok<T> | ErrorResponse;

const getClient = (client: ApiClientType = "core") => {
	return createApiClient(client);
};

/**
 * Performs an API request using the specified HTTP method.
 *
 * @template T - The expected return type of the API request
 * @param {("get"|"post"|"patch"|"delete"|"put")} method - The HTTP method to use for the request
 * @param {string} url - The URL endpoint for the request
 * @param {*} [data] - Optional data to send with the request
 * @param {ApiClientType} [apiClient] - Optional API client key
 * @returns {Promise<T>} Resolves with the response data cast to type T
 * @throws {Error} Throws processed error if the request fails
 */
export const apiRequest = async <T>(
	method: "get" | "post" | "patch" | "delete" | "put" = "get",
	url: string,
	data?: unknown,
	apiClient?: ApiClientType,
): Promise<ApiResult<T>> => {
	const finalUrl = url.replace(/^\/+/, ""); // Remove leading slashes to avoid double slashes in URL
	try {
		const client = getClient(apiClient);

		const options: RequestInit = {
			method: method.toUpperCase(),
		};

		if (data !== undefined && data !== null) {
			if (
				data instanceof FormData ||
				data instanceof Blob ||
				data instanceof ArrayBuffer ||
				data instanceof URLSearchParams ||
				typeof data === "string"
			) {
				options.body = data;
			} else {
				options.body = JSON.stringify(data);
			}
		}

		const response = await client.request<T>(finalUrl, options);

		console.log("API request successful:", { response });

		return { ok: true, data: response };
	} catch (error) {
		console.log("API request error:", error);
		if ("isFetchClientError" in (error as object)) {
			const fetchError = error as {
				response?: { status?: number; data?: unknown; headers?: Headers };
			};

			const status = fetchError.response?.status;
			const data = fetchError.response?.data;
			const normalized = normalizeApiErrorPayload(data, status);

			return {
				ok: false,
				message: normalized.message,
				validation: normalized.validation,
				status: normalized.status,
			};
		}

		return { ok: false, message: (error as Error).message || "Unknown error" };
	}
};
