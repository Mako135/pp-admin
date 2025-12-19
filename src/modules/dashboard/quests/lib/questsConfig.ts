import type { FormConfig } from "@/shared/lib/form-schema";

export const questsConfig: FormConfig = {
	id: "quests",
	title: "Создайде свой квест",
	description: "Создайте новый квест для пользователей",
	submitLabel: "Создать",
	successMessage: "Вы успешно создали квест",
	fields: [
		{
			name: "title",
			label: "Название квеста",
			type: "text",
			placeholder: "Введите название квеста",
			validation: {
				required: "Название квеста обязательно",
			},
		},
		{
			name: "description",
			label: "Описание квеста",
			type: "textarea",
			validation: {
				required: "Описание квеста обязательно",
				minLength: {
					value: 6,
					message: "Описание квеста должно содержать минимум 6 символов",
				},
			},
		},
        {
            name: "reward_amount",
            label: "Количество награды",
            type: "number",
            placeholder: "Введите количество награды",
            validation: {
                required: "Количество награды обязательно",
                minLength: {
                    value: 1,
                    message: "Количество награды должно быть не менее 1",
                },
            },
        },
        {
            name: "budget",
            label: "Бюджет квеста",
            type: "number",
            placeholder: "Введите бюджет квеста",
            validation: {
                required: "Бюджет квеста обязателен",   
                minLength: {
                    value: 1,
                    message: "Бюджет квеста должен быть не менее 1",
                },
            },
        },
        {
            name: "end_date",
            label: "Дата окончания квеста",
            type: "date",
            placeholder: "Введите дату окончания квеста",
            validation: {
                required: "Дата окончания квеста обязательна",   
            },
        }
	],
};
