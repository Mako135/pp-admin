"use client";

import { useProfile } from "../lib/queries";
import { organizationStore } from "@/shared/lib/organization-store";
import { authStore } from "@/shared/lib/auth-store";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { ChevronDown, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogPopup } from "@/shared/ui/dialog";
import { clearAllTokens } from "@/api/config";
import { queryClient } from "@/lib/query-client";
import { apiRequest } from "@/api";

export const DashboardHeader = () => {
  const { data } = useProfile();
  const selectedOrgId = organizationStore(
    (state) => state.selectedOrganizationId
  );
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //@ts-ignore
  const profile = data?.data;
  const selectedOrganization = profile?.organizations.find(
    (org) => org.id === selectedOrgId
  );

  const handleLogout = async () => {
    await apiRequest<void>("post", "/auth/logout/");

    // 2. Очищаем всё
    clearAllTokens();
    localStorage.clear();

    // 3. Отменяем все активные запросы
    queryClient.cancelQueries();

    // 4. Удаляем все queries
    queryClient.removeQueries();

    // 5. Очищаем кэш мутаций
    queryClient.getMutationCache().clear();

    // 6. ПОЛНАЯ перезагрузка страницы
    window.location.href = "/auth/login";
  };

  const handleDeleteOrganization = async () => {
    try {
      // Здесь будет API запрос на удаление организации
      // await deleteOrganization(selectedOrgId);
      setIsDeleteOpen(false);
      organizationStore.getState().clearSelectedOrganization();
      // Перенаправить на создание организации или список
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-40 max-w-7xl mx-auto">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">PaidaPlus</div>

          {/* User Menu */}
          {profile && (
            <Popover>
              <PopoverTrigger>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{profile.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-0">
                <div>
                  {selectedOrganization && (
                    <>
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground">
                          Текущая организация
                        </p>
                        <p className="font-medium text-sm">
                          {selectedOrganization.company_name}
                        </p>
                      </div>
                      <Separator className="my-3" />
                    </>
                  )}

                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>

      {/* Delete Organization Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogPopup showCloseButton={true}>
          <div className="p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Удалить организацию</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Вы уверены, что хотите удалить организацию "
              {selectedOrganization?.company_name}"? Это действие нельзя
              отменить.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Отмена
              </Button>
              <Button variant="destructive" onClick={handleDeleteOrganization}>
                Удалить
              </Button>
            </div>
          </div>
        </DialogPopup>
      </Dialog>
    </>
  );
};
