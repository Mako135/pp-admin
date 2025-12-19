import { CORE_URL } from "./config";

export type RefreshTokenI = {
	access: string;
};

export const refreshToken = async (): Promise<RefreshTokenI> => {
	try {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		if (typeof window === "undefined") {
			const { cookies } = await import("next/headers");
			const refreshCookie = (await cookies()).get("refresh_token")?.value;
			if (refreshCookie) {
				headers.Cookie = `refresh_token=${refreshCookie}`;
			}
		}

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}auth/admin/refresh/`,
			{
				method: "POST",
				credentials: "include",
				headers,
			},
		);

		if (!response.ok) {
			throw new Error("Failed to refresh token");
		}

		const { access } = (await response.json()) as RefreshTokenI;
		return { access };
	} catch (error) {
		// Очищаем cookies через API
		await fetch(`${CORE_URL}auth/logout/`, {
			method: "POST",
			credentials: "include",
		});
		if (typeof window !== "undefined") {
			window.location.href = "/auth/login";
		}
		throw error;
	}
};
