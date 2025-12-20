"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuests, createQuest, updateQuest, deleteQuest } from "./api";
import type { CreateQuestData, QuestListItem } from "./types";
import { queryClient } from "@/lib/query-client";
import { toastManager } from "@/shared/ui/toast";

export const useQuests = (organizationId: number | null) => {
  // Fetch all quests

  const { data: quests = [], isLoading, error, refetch } =
    //@ts-ignore
    useQuery<{ data: QuestListItem[] }>({
      queryKey: ["quests", organizationId],
      queryFn: () =>
        organizationId ? getQuests(organizationId) : Promise.resolve([]),
      enabled: !!organizationId,
    });

  // Create quest mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateQuestData) =>
      organizationId ? createQuest(organizationId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quests", organizationId],
      });
    },
    onError: (error) => {
      toastManager.add({
        type: "error",
        title: "Ошибка создания задания",
      });
    },
  });

  // Update quest mutation
  const updateMutation = useMutation({
    mutationFn: ({
      questId,
      data,
    }: {
      questId: number;
      data: Partial<CreateQuestData>;
    }) =>
      organizationId
        ? updateQuest(organizationId, questId, data)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quests", organizationId],
      });
    },
  });

  // Delete quest mutation
  const deleteMutation = useMutation({
    mutationFn: (questId: number) =>
      organizationId ? deleteQuest(organizationId, questId) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quests", organizationId],
      });
    },
  });

  return {
    quests,
    isLoading,
    error,
    refetch,
    createQuest: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateQuest: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteQuest: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
