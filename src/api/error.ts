export type ValidationMap = Record<string, string[]>;

export type NormalizedError = {
	message: string;
	validation?: ValidationMap;
	status?: number;
};

/**
 * Normalize FastAPI/Pydantic style error payloads into a convenient structure.
 * Supports:
 * - HTTPException: { detail: "message" }
 * - Pydantic validation: { detail: [{ loc: [...], msg: string, type?: string }, ...] }
 * - Generic: { message?: string } | { error?: string } | string
 */
export function normalizeApiErrorPayload(
	payload: unknown,
	status?: number,
): NormalizedError {
	// If payload is already string
	if (typeof payload === "string") {
		return { message: payload, status };
	}

	if (!payload || typeof payload !== "object") {
		return { message: "API request failed", status };
	}

	const data = payload as Record<string, unknown>;

	// Common FastAPI/HTTPException: { detail: "..." }
	{
		const detail = (data as { detail?: unknown }).detail;
		if (typeof detail === "string") {
			return { message: detail, status };
		}
	}

	// Pydantic validation: { detail: [{ loc, msg, type }, ...] }
	{
		const detail = (data as { detail?: unknown }).detail;
		if (Array.isArray(detail)) {
			const validation: ValidationMap = {};

			for (const item of detail as Array<unknown>) {
				if (!item) continue;
				const obj = item as { msg?: unknown; message?: unknown; loc?: unknown };
				const msg: string =
					(typeof obj.msg === "string" ? obj.msg : undefined) ||
					(typeof obj.message === "string" ? obj.message : undefined) ||
					String(item);

				let path = "";
				if (Array.isArray(obj.loc)) {
					// FastAPI usually sends something like ["body", "field"] or ["body", "items", 0, "name"]
					const parts = (obj.loc as unknown[])
						.filter(
							(p: unknown) => p !== "body" && p !== "query" && p !== "path",
						)
						.map((p: unknown) =>
							typeof p === "number" ? String(p) : String(p),
						);

					// Join indexes with dot notation: items.0.name
					path = parts.join(".");
				} else if (typeof obj.loc === "string") {
					path = obj.loc;
				}

				// Fallback for empty path
				if (!path) path = "__all__"; // non-field specific

				if (!validation[path]) validation[path] = [];
				validation[path].push(msg);
			}

			const flatMessage = Object.entries(validation)
				.map(([k, v]) => `${k}: ${v.join(", ")}`)
				.join("; ");

			return { message: flatMessage || "Validation error", validation, status };
		}
	}

	// Other common shapes
	if (typeof (data as { message?: unknown }).message === "string") {
		return { message: (data as { message: string }).message, status };
	}
	if (typeof (data as { error?: unknown }).error === "string") {
		return { message: (data as { error: string }).error, status };
	}

	try {
		return { message: JSON.stringify(data), status };
	} catch {
		return { message: "API request failed", status };
	}
}

export function handleApiError(res?: any) {
	if (res && !res.ok) {
		if (res.validation) {
			return { success: false, errors: res.validation };
		}
		return { success: false, error: res.message };
	}
	return null;
}
