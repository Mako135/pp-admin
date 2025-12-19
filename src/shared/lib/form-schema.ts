import { z } from "zod";

// Базовые типы для JSON конфигурации формы
export type FieldType = "text" | "email" | "password" | "tel" | "textarea";

export interface FormFieldConfig {
	name: string;
	label: string;
	type: FieldType;
	placeholder?: string;
	validation: {
		required?: string;
		minLength?: { value: number; message: string };
		maxLength?: { value: number; message: string };
		pattern?: { value: string; message: string };
		email?: string;
		custom?: (value: string) => string | undefined;
	};
	link?: {
		href: string;
		label: string;
	};
}

export interface FormConfig {
	id: string;
	title: string;
	description?: string;
	fields: FormFieldConfig[];
	submitLabel: string;
	successMessage: string;
}

// Функция для создания Zod схемы из JSON конфигурации
export function createZodSchemaFromConfig(config: FormConfig) {
	const schemaShape: Record<string, z.ZodString> = {};

	config.fields.forEach((field) => {
		let fieldSchema = z.string();

		if (field.validation.required) {
			fieldSchema = fieldSchema.min(1, field.validation.required);
		} else {
			fieldSchema = fieldSchema.optional() as unknown as z.ZodString;
		}

		if (field.validation.minLength) {
			fieldSchema = fieldSchema.min(
				field.validation.minLength.value,
				field.validation.minLength.message,
			);
		}

		if (field.validation.maxLength) {
			fieldSchema = fieldSchema.max(
				field.validation.maxLength.value,
				field.validation.maxLength.message,
			);
		}

		if (field.validation.email) {
			fieldSchema = fieldSchema.email(field.validation.email);
		}

		if (field.validation.pattern) {
			fieldSchema = fieldSchema.regex(
				new RegExp(field.validation.pattern.value),
				field.validation.pattern.message,
			);
		}

		schemaShape[field.name] = fieldSchema;
	});

	return z.object(schemaShape);
}
