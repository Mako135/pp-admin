"use server";

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

	// Здесь логика отправки email с ссылкой для сброса пароля
	await new Promise((resolve) => setTimeout(resolve, 1000));

	console.log("Forgot password data:", result.data);

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

	const token = formData.get("token") as string;
	const uuid = formData.get("uuid") as string;

	// Validate token and uuid presence
	if (!token || !uuid) {
		return {
			success: false,
			error: "Токен или UUID отсутствуют. Ссылка недействительна.",
		};
	}

	const data = {
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	};

	const result = schema.safeParse(data);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.flatten().fieldErrors,
		};
	}

	// Дополнительная проверка совпадения паролей
	if (data.password !== data.confirmPassword) {
		return {
			success: false,
			errors: {
				confirmPassword: ["Пароли не совпадают"],
			},
		};
	}

	await new Promise((resolve) => setTimeout(resolve, 1000));

	console.log("Reset password data:", { ...result.data, token, uuid });

	return {
		success: true,
		message: resetPasswordFormConfig.successMessage,
	};
}
