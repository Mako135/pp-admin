"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Dialog, DialogPopup } from "@/shared/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import {
  useSubmissions,
  useApproveSubmission,
  useRejectSubmission,
} from "../lib/api";
import { organizationStore } from "@/shared/lib/organization-store";
import {
  UnifiedTable,
  UnifiedTableColumn,
} from "@/shared/components/unified-table";
import type { Submission } from "../lib/types";

export function SubmissionsTable() {
  const organizationId = organizationStore(
    (state) => state.selectedOrganizationId
  );
  const { data, isPending, error } = useSubmissions();
  const { mutate: approve, isPending: isApproving } = useApproveSubmission();
  const { mutate: reject, isPending: isRejecting } = useRejectSubmission();

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  //@ts-ignore
  const submissions = Array.isArray(data) ? data : data?.data || [];
  const isLoading = isApproving || isRejecting;

  const handleApprove = (submissionId: number) => {
    approve(submissionId);
  };

  const handleReject = () => {
    if (selectedSubmission) {
      reject(selectedSubmission.id);
      setIsRejectOpen(false);
      setSelectedSubmission(null);
    }
  };

  const openRejectDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setIsRejectOpen(true);
  };

  if (!organizationId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Пожалуйста, выберите организацию
      </div>
    );
  }

  if (isPending) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Ошибка при загрузке сабмишенов
      </div>
    );
  }

  const columns: UnifiedTableColumn<Submission>[] = [
    {
      key: "quest_id",
      label: "Квест",
    },
    {
      key: "user_id",
      label: "Пользователь",
      render: (value: number) => `#${value}`,
    },
    {
      key: "location_id",
      label: "Локация",
    },
    {
      key: "submitted_at",
      label: "Дата отправки",
      render: (value: string) => new Date(value).toLocaleDateString("ru-RU"),
    },
    {
      key: "status",
      label: "Статус",
      render: (value: string) => (
        <Badge
          variant={
            value === "pending"
              ? "outline"
              : value === "approved"
              ? "default"
              : "destructive"
          }
        >
          {value === "pending"
            ? "На рассмотрении"
            : value === "approved"
            ? "Одобрен"
            : "Отклонен"}
        </Badge>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <>
      <UnifiedTable<Submission>
        title="Сабмишены"
        columns={columns}
        data={submissions}
        groupByKey="status"
        groupByLabel="Статус"
        getGroupColor={getStatusColor}
        emptyMessage="Сабмишенов не найдено"
        renderActions={(submission) =>
          submission.status === "pending" ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApprove(submission.id)}
                disabled={isLoading}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Одобрить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openRejectDialog(submission)}
                disabled={isLoading}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" />
                Отклонить
              </Button>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Рассмотрено</span>
          )
        }
      />

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogPopup showCloseButton={true}>
          <div className="p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Отклонить сабмишен</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Вы уверены, что хотите отклонить этот сабмишен? Это действие
              нельзя отменить.
            </p>
            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setIsRejectOpen(false)}
                disabled={isRejecting}
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Отклоняю..." : "Отклонить"}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </Dialog>
    </>
  );
}
