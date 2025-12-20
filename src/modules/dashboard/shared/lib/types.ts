import z from "zod";

export const CreateOrganizationSchema = z.object({
	company_name: z
		.string()
		.min(3, "Название должно содержать минимум 3 символа")
		.max(255, "Название не должно превышать 255 символов"),
});

export type CreateOrganizationData = z.infer<typeof CreateOrganizationSchema>;

export type Profile = {
	id: number;
	email: string;
	status: string;
	created_at: string;
	parent_id: number;
	password_changed_at: string;
	organizations: Organization[];
	total_active_quests: number;
	total_completed_quests: number;
};

export type Organization = {
	company_name: string;
	id: number;
	owner_id: number;
	created_at: string;
	financial_balance: number;
	tags: Tag[];
};

export type Tag = {
	id: number;
	name: string;
};
