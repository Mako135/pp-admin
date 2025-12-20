"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLocations } from "../lib/locations-api";
import { organizationStore } from "@/shared/lib/organization-store";
import {
  UnifiedTable,
  UnifiedTableColumn,
} from "@/shared/components/unified-table";
import type { Location } from "../lib/locations-api";
import { Button } from "@/shared/ui/button";
import { CreateLocationDialog } from "./create-location-dialog";

export function LocationsList() {
  const orgId = organizationStore((s) => s.selectedOrganizationId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: locationsResponse,
    isPending,
    error,
  } = useQuery({
    queryKey: ["locations", orgId],
    queryFn: () => getLocations(orgId!),
    enabled: !!orgId,
  });

  const locations = Array.isArray(locationsResponse)
    ? locationsResponse
    : //@ts-ignore
      locationsResponse?.data || [];

  if (isPending) {
    return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">Ошибка загрузки локаций</div>
    );
  }

  const columns: UnifiedTableColumn<Location>[] = [
    {
      key: "address",
      label: "Адрес",
      className: "font-medium w-1/4 truncate",
    },
    {
      key: "latitude",
      label: "Широта",
      render: (value: number) => value.toFixed(6),
    },
    {
      key: "longitude",
      label: "Долгота",
      render: (value: number) => value.toFixed(6),
    },
    {
      key: "id",
      label: "ID",
    },
    {
      key: "created_at",
      label: "Дата создания",
      render: (value: string) => new Date(value).toLocaleDateString("ru-RU"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Локации</h2>
        <Button onClick={() => setIsCreateOpen(true)} disabled={isPending}>
          Создать локацию
        </Button>
      </div>

      <UnifiedTable<Location>
        title="Локации"
        columns={columns}
        data={locations}
        emptyMessage="Локаций не найдено"
      />

      <CreateLocationDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
