import type { FormConfig } from "@/shared/lib/form-schema";

// Конфигурация формы логина
export const loginFormConfig: FormConfig = {
	id: "login",
	title: "Вход в систему",
	description: "Войдите в свой аккаунт",
	submitLabel: "Войти",
	successMessage: "Вы успешно вошли в систему",
	fields: [
		{
			name: "username",
			label: "Email",
			type: "email",
			placeholder: "example@mail.com",
			validation: {
				required: "Email обязателен",
				email: "Введите корректный email",
			},
		},
		{
			name: "password",
			label: "Пароль",
			type: "password",
			validation: {
				required: "Пароль обязателен",
				minLength: {
					value: 6,
					message: "Пароль должен содержать минимум 6 символов",
				},
			},
			link: {
				href: "/auth/forgot-password",
				label: "Забыли пароль?",
			},
		},
	],
};

// Конфигурация формы регистрации
export const registerFormConfig: FormConfig = {
	id: "register",
	title: "Регистрация",
	description: "Создайте новый аккаунт",
	submitLabel: "Зарегистрироваться",
	successMessage:
		"Регистрация прошла успешно! Проверьте email для подтверждения",
	fields: [
		{
			name: "email",
			label: "Email",
			type: "email",
			placeholder: "example@mail.com",
			validation: {
				required: "Email обязателен",
				email: "Введите корректный email",
			},
		},
		{
			name: "password",
			label: "Пароль",
			type: "password",
			placeholder: "••••••••",
			validation: {
				required: "Пароль обязателен",
				minLength: {
					value: 8,
					message: "Пароль должен содержать минимум 8 символов",
				},
				pattern: {
					value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)",
					message: "Пароль должен содержать заглавные, строчные буквы и цифры",
				},
			},
		},
	],
};

// Конфигурация формы запроса нового пароля
export const forgotPasswordFormConfig: FormConfig = {
	id: "forgot-password",
	title: "Забыли пароль?",
	description: "Введите email для восстановления пароля",
	submitLabel: "Отправить ссылку",
	successMessage: "Ссылка для восстановления пароля отправлена на ваш email",
	fields: [
		{
			name: "email",
			label: "Email",
			type: "email",
			placeholder: "example@mail.com",
			validation: {
				required: "Email обязателен",
				email: "Введите корректный email",
			},
		},
	],
};

// Конфигурация формы сброса пароля
export const resetPasswordFormConfig: FormConfig = {
	id: "reset-password",
	title: "Сброс пароля",
	description: "Введите новый пароль",
	submitLabel: "Сбросить пароль",
	successMessage: "Пароль успешно изменен",
	fields: [
		{
			name: "new_password",
			label: "Новый пароль",
			type: "password",
			placeholder: "••••••••",
			validation: {
				required: "Пароль обязателен",
				minLength: {
					value: 8,
					message: "Пароль должен содержать минимум 8 символов",
				},
				pattern: {
					value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)",
					message: "Пароль должен содержать заглавные, строчные буквы и цифры",
				},
			},
		},
		{
			name: "confirm_password",
			label: "Подтвердите пароль",
			type: "password",
			placeholder: "••••••••",
			validation: {
				required: "Подтверждение пароля обязательно",
			},
		},
	],
};
