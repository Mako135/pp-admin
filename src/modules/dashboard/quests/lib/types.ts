import z from "zod";

export const CreateQuestSchema = z.object({
	title: z
		.string()
		.min(3, "Название должно содержать минимум 3 символа")
		.max(255, "Название не должно превышать 255 символов"),
	description: z.string().max(255, "Описание не должно превышать 255 символов"),
	reward_amount: z.number().min(0, "Награда не может быть отрицательной"),
	budget: z.number().min(0, "Бюджет не может быть отрицательной"),
	end_date: z.string(),
});

export type CreateQuestData = z.infer<typeof CreateQuestSchema>;

export type QuestListItem = {
	id: number;
	title: string;
	description: string;
	reward_amount: number;
	budget: number;
	status: string;
	organization_id: number;
	created_at: string;
	updated_at: string;
	end_date: string;
	completed_count: number;
	spent_amount: number;
};
