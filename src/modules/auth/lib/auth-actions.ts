"use server";

import { cookies } from "next/headers";
import { apiRequest } from "@/api";
import { handleApiError } from "@/api/error";
import { createZodSchemaFromConfig } from "@/shared/lib/form-schema";
import {
	forgotPasswordFormConfig,
	loginFormConfig,
	registerFormConfig,
	resetPasswordFormConfig,
} from "./auth-form-configs";

// Login Action
export async function loginAction(prevState: unknown, formData: FormData) {
	const schema = createZodSchemaFromConfig(loginFormConfig);

	const data = {
		username: formData.get("username"),
		password: formData.get("password"),
	};

	const result = schema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		};
	}

	const newFormData = new FormData();
	newFormData.append("username", result.data.username);
	newFormData.append("password", result.data.password);

	const res = await apiRequest<void>(
		"post",
		"/auth/admin/login",
		newFormData,
		"auth",
	);

	//  if (res.ok && res.data) {
	//     const cookieStore = await cookies();

	//     const accessToken = res.data.access || res.data.access_token;
	//     const refreshToken = res.data.refresh || res.data.refresh_token;

	//     if (accessToken) {
	//         cookieStore.set("access_token", accessToken, {
	//             httpOnly: true,
	//             secure: process.env.NODE_ENV === "production",
	//             sameSite: "lax",
	//             path: "/",
	//             maxAge: 60 * 60 * 24, // 24 часа или ваше значение
	//         });
	//     }

	//     if (refreshToken) {
	//         cookieStore.set("refresh_token", refreshToken, {
	//             httpOnly: true,
	//             secure: process.env.NODE_ENV === "production",
	//             sameSite: "lax",
	//             path: "/",
	//             maxAge: 60 * 60 * 24 * 7, // 7 дней или ваше значение
	//         });
	//     }
	// }

	const errorResult = handleApiError(res);
	if (errorResult) return errorResult;

	return {
		success: true,
		message: loginFormConfig.successMessage,
	};
}

// Register Action
export async function registerAction(prevState: unknown, formData: FormData) {
	const schema = createZodSchemaFromConfig(registerFormConfig);
	console.log(formData);
	const data = {
		email: formData.get("email"),
		password: formData.get("password"),
	};

	const result = schema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		};
	}

	const res = await apiRequest<void>(
		"post",
		"/auth/admin/register",
		result.data,
		"auth",
	);

	const errorResult = handleApiError(res);
	if (errorResult) return errorResult;

	return {
		success: true,
		message: loginFormConfig.successMessage,
	};
}

// Forgot Password Action
export async function forgotPasswordAction(
	prevState: unknown,
	formData: FormData,
) {
	const schema = createZodSchemaFromConfig(forgotPasswordFormConfig);

	const data = {
		email: formData.get("email"),
	};

	const result = schema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		};
	}

	const res = await apiRequest<void>(
		"post",
		"/auth/admin/reset-password",
		result.data,
		"auth",
	);

	const errorResult = handleApiError(res);
	if (errorResult) return errorResult;

	return {
		success: true,
		message: forgotPasswordFormConfig.successMessage,
	};
}

// Reset Password Action
export async function resetPasswordAction(
	prevState: unknown,
	formData: FormData,
) {
	const schema = createZodSchemaFromConfig(resetPasswordFormConfig);

	const token = formData.get("token");
	const uid = formData.get("uid");

	// Validate token and uuid presence
	if (!token || !uid) {
		return {
			success: false,
			error: "Токен или UUID отсутствуют. Ссылка недействительна.",
		};
	}

	const data = {
		new_password: formData.get("new_password"),
		confirm_password: formData.get("confirm_password"),
	};

	const result = schema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		};
	}

	// Дополнительная проверка совпадения паролей
	if (data.new_password !== data.confirm_password) {
		return {
			success: false,
			errors: {
				confirm_password: ["Пароли не совпадают"],
			},
		};
	}

	const finalData = {
		token,
		uid,
		new_password: result.data.new_password,
		confirm_password: result.data.confirm_password,
	};

	const res = await apiRequest<void>(
		"post",
		"/auth/admin/reset-password-confirm",
		finalData,
		"auth",
	);

	const errorResult = handleApiError(res);
	if (errorResult) return errorResult;

	return {
		success: true,
		message: resetPasswordFormConfig.successMessage,
	};
}
