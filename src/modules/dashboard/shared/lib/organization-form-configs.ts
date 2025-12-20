import type { FormConfig } from "@/shared/lib/form-schema";

// Конфигурация формы создания организации
export const createOrganizationFormConfig: FormConfig = {
	id: "create-organization",
	title: "Создание организации",
	description: "Заполните информацию о вашей организации",
	submitLabel: "Создать организацию",
	successMessage: "Организация успешно создана",
	fields: [
		{
			name: "name",
			label: "Название организации",
			type: "text",
			placeholder: "Введите название организации",
			validation: {
				required: "Название организации обязательно",
				minLength: {
					value: 3,
					message: "Название должно содержать минимум 3 символа",
				},
				maxLength: {
					value: 255,
					message: "Название не должно превышать 255 символов",
				},
			},
		},
		{
			name: "email",
			label: "Email организации",
			type: "email",
			placeholder: "example@organization.com",
			validation: {
				required: "Email обязателен",
				email: "Введите корректный email",
			},
		},
		{
			name: "phone",
			label: "Телефон",
			type: "tel",
			placeholder: "+7 (999) 999-99-99",
			validation: {
				required: "Телефон обязателен",
				pattern: {
					value: "^[\\d\\s\\-\\+\\(\\)]+$",
					message: "Введите корректный номер телефона",
				},
			},
		},
		{
			name: "description",
			label: "Описание",
			type: "textarea",
			placeholder: "Опишите вашу организацию",
			validation: {
				maxLength: {
					value: 1000,
					message: "Описание не должно превышать 1000 символов",
				},
			},
		},
		{
			name: "website",
			label: "Сайт (опционально)",
			type: "text",
			placeholder: "https://example.com",
			validation: {
				maxLength: {
					value: 500,
					message: "URL не должен превышать 500 символов",
				},
			},
		},
	],
};
