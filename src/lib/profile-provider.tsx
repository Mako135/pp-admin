"use client";

import { CreateOrganization } from "@/modules/dashboard/shared/components/create-organization";
import { useProfile } from "@/modules/dashboard/shared/lib/queries";
import { organizationStore } from "@/shared/lib/organization-store";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = organizationStore();
  const { data, isPending, error } = useProfile();

  useEffect(() => {
    // @ts-ignore
    if (data?.data.organizations.length) {
      //@ts-ignore
      const firstOrg = data.data.organizations[0];
      console.log("Setting selected organization ID to:", firstOrg.id);
      store.setSelectedOrganizationId(firstOrg.id);
    }
  }, [data]);

  if (isPending) {
    return (
      <main className="px-4 mx-auto h-screen grid items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
      </main>
    );
  }

  if (error) {
    return <div>Error loading profile</div>;
  }

  // @ts-ignore
  if (data.data.organizations.length === 0) {
    return (
      <main className="px-4 mx-auto h-screen grid items-center justify-center">
        <CreateOrganization />
      </main>
    );
  }

  return <>{children}</>;
};
