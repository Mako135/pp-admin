"use client";

import { useProfile } from "@/modules/dashboard/shared/lib/queries";
import { DashboardOverview } from "@/modules/dashboard/shared/components/dashboard-overview";
import { LocationsList } from "@/modules/dashboard/shared/components/locations-list";
import { Quests } from "@/modules/dashboard/quests";
import { SubmissionsTable } from "@/modules/dashboard/submissions/components/submissions-table";

export default function page() {
  const { data, isPending, error } = useProfile();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Дашборд</h1>
        <DashboardOverview />
      </div>
      
      <div>
        <LocationsList />
      </div>

      <div>
        <Quests />
      </div>

      <div>
        <SubmissionsTable />
      </div>
    </div>
  );
}
