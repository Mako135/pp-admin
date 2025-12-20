"use client";

import { useQuests } from "./lib/use-quests";
import { Spinner } from "@/shared/ui/spinner";
import { organizationStore } from "@/shared/lib/organization-store";
import { QuestsTable } from "./components/quests-table";

export const Quests = () => {
  const organizationId = organizationStore(
    (state) => state.selectedOrganizationId
  );

  console.log("Selected Organization ID in Quests:", organizationId);

  const {
    quests,
    isLoading,
    createQuest,
    isCreating,
    updateQuest,
    isUpdating,
    deleteQuest,
    isDeleting,
    refetch,
  } = useQuests(organizationId);

  console.log(quests)

  if (!organizationId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Пожалуйста, выберите организацию
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <QuestsTable
      //@ts-ignore

      quests={quests.data}
      organizationId={organizationId}
      onCreateQuest={createQuest}
      isCreating={isCreating}
      onUpdateQuest={updateQuest}
      isUpdating={isUpdating}
      onDeleteQuest={deleteQuest}
      isDeleting={isDeleting}
      onRefresh={refetch}
    />
  );
};
