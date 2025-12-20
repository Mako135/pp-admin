"use client";

import { useProfile } from "../lib/queries";
import { useQuery } from "@tanstack/react-query";
import { organizationStore } from "@/shared/lib/organization-store";
import { useQuests } from "../../quests/lib/use-quests";
import { useSubmissions } from "../../submissions/lib/api";
import { getLocations } from "../lib/locations-api";
import { MapPin, Trophy, FileCheck, Tag } from "lucide-react";

export function DashboardOverview() {
  const orgId = organizationStore((s) => s.selectedOrganizationId);
  const { data: profile, isPending: profileLoading } = useProfile();
  const { quests: questsResponse, isLoading: questsLoading } = useQuests(orgId);
  const { data: submissionsResponse, isPending: submissionsLoading } =
    useSubmissions();

  const { data: locationsResponse, isPending: locationsLoading } = useQuery({
    queryKey: ["locations", orgId],
    queryFn: () => getLocations(orgId!),
    enabled: !!orgId,
  });

  const isLoading =
    profileLoading || questsLoading || submissionsLoading || locationsLoading;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  const quests = Array.isArray(questsResponse)
    ? questsResponse
    : //@ts-ignore
      questsResponse?.data || [];
  const submissions = Array.isArray(submissionsResponse)
    ? submissionsResponse
    : //@ts-ignore
      submissionsResponse?.data || [];
  const locations = Array.isArray(locationsResponse)
    ? locationsResponse
    : //@ts-ignore
      locationsResponse?.data || [];

  const activeQuests = quests.filter((q: any) => q.status === "active").length;
  const pendingSubmissions = submissions.filter(
    (s: any) => s.status === "pending"
  ).length;
  //@ts-ignore
  const tags = profile?.organizations?.[0]?.tags || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">Locations</span>
        </div>
        <div className="text-3xl font-semibold">{locations.length}</div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Trophy className="h-4 w-4" />
          <span className="text-sm font-medium">Active Quests</span>
        </div>
        <div className="text-3xl font-semibold">{quests.length}</div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <FileCheck className="h-4 w-4" />
          <span className="text-sm font-medium">Pending</span>
        </div>
        <div className="text-3xl font-semibold">{pendingSubmissions}</div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Tag className="h-4 w-4" />
          <span className="text-sm font-medium">Tags</span>
        </div>
        <div className="text-3xl font-semibold">{tags.length}</div>
      </div>
    </div>
  );
}
