import { apiRequest } from "@/api";
import type { CreateQuestData, QuestListItem } from "./types";

export const getQuests = async (organizationId: number) => {
	return apiRequest<QuestListItem[]>(
		"get",
		`/organizations/${organizationId}/quests`
	);
};

export const getQuestById = async (organizationId: number, questId: number) => {
	return apiRequest<QuestListItem>(
		"get",
		`/organizations/${organizationId}/quests/${questId}`
	);
};

export const createQuest = async (
	organizationId: number,
	data: CreateQuestData
) => {
	return apiRequest<QuestListItem>(
		"post",
		`/organizations/${organizationId}/quests`,
		data
	);
};

export const updateQuest = async (
	organizationId: number,
	questId: number,
	data: Partial<CreateQuestData>
) => {
	return apiRequest<QuestListItem>(
		"put",
		`/organizations/${organizationId}/quests/${questId}`,
		data
	);
};

export const deleteQuest = async (organizationId: number, questId: number) => {
	return apiRequest<void>(
		"delete",
		`/organizations/${organizationId}/quests/${questId}`
	);
};
