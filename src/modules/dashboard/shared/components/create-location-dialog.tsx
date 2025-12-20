"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLocation } from "../lib/locations-api";
import { organizationStore } from "@/shared/lib/organization-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { MapPicker } from "./map-picker";

interface CreateLocationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLocationDialog({
  isOpen,
  onOpenChange,
}: CreateLocationDialogProps) {
  const orgId = organizationStore((s) => s.selectedOrganizationId);
  const queryClient = useQueryClient();

  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(true);

  const mutation = useMutation({
    mutationFn: (data: {
      address: string;
      latitude: number;
      longitude: number;
    }) => createLocation(orgId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations", orgId],
      });
      resetForm();
      onOpenChange(false);
    },
  });

  const handleMapSelect = (lat: number, lng: number, addr: string) => {
    setSelectedCoords({ lat, lng });
    setAddress(addr);
    setShowMap(false);
  };

  const handleCreate = () => {
    if (!selectedCoords || !address) return;

    mutation.mutate({
      address,
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
    });
  };

  const resetForm = () => {
    setSelectedCoords(null);
    setAddress("");
    setShowMap(true);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle>Создать локацию</DialogTitle>
          <DialogDescription>
            Выберите местоположение на карте для создания новой локации
          </DialogDescription>
        </DialogHeader>

        {mutation.error && (
          <Alert>
            <AlertDescription>
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Ошибка при создании локации"}
            </AlertDescription>
          </Alert>
        )}

        {showMap ? (
          <div className="space-y-4 ">
            <p className="text-sm text-muted-foreground">
              Нажмите на карту, чтобы выбрать местоположение
            </p>
            <MapPicker onLocationSelect={handleMapSelect} />
          </div>
        ) : (
          <div className="space-y-4 ">
            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес локации"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Широта</Label>
                <Input
                  id="latitude"
                  value={selectedCoords?.lat.toFixed(6) || ""}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="longitude">Долгота</Label>
                <Input
                  id="longitude"
                  value={selectedCoords?.lng.toFixed(6) || ""}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMap(true)}
                disabled={mutation.isPending}
              >
                Выбрать снова
              </Button>
              <Button
                onClick={handleCreate}
                disabled={mutation.isPending || !address}
              >
                {mutation.isPending ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
