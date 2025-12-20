"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogPopup } from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import type { QuestListItem, CreateQuestData } from "../lib/types";
import { Form } from "@/shared/components/client-dynamic-form";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { UnifiedTable, UnifiedTableColumn } from "@/shared/components/unified-table";

interface QuestsTableProps {
	quests: QuestListItem[];
	organizationId: number;
	onCreateQuest: (data: CreateQuestData) => void;
	isCreating: boolean;
	onUpdateQuest: (data: {
		questId: number;
		data: Partial<CreateQuestData>;
	}) => void;
	isUpdating: boolean;
	onDeleteQuest: (questId: number) => void;
	isDeleting: boolean;
	onRefresh: () => void;
}

export const QuestsTable = ({
	quests,
	onCreateQuest,
	isCreating,
	onUpdateQuest,
	isUpdating,
	onDeleteQuest,
	isDeleting,
}: QuestsTableProps) => {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedQuest, setSelectedQuest] = useState<QuestListItem | null>(
		null,
	);

	const createMethods = useForm<CreateQuestData>({
		defaultValues: {
			title: "",
			description: "",
			reward_amount: 0,
			budget: 0,
			end_date: "",
		},
	});

	const editMethods = useForm<CreateQuestData>({
		defaultValues: selectedQuest
			? {
					title: selectedQuest.title,
					description: selectedQuest.description,
					reward_amount: selectedQuest.reward_amount,
					budget: selectedQuest.budget,
					end_date: selectedQuest.end_date,
				}
			: {
					title: "",
					description: "",
					reward_amount: 0,
					budget: 0,
					end_date: "",
				},
	});

	const isLoading = isCreating || isUpdating || isDeleting;

	const handleCreate = (data: CreateQuestData) => {
		onCreateQuest(data);
		setIsCreateOpen(false);
		createMethods.reset();
	};

	const handleEdit = (data: CreateQuestData) => {
		if (!selectedQuest) return;
		onUpdateQuest({
			questId: selectedQuest.id,
			data,
		});
		setIsEditOpen(false);
		setSelectedQuest(null);
		editMethods.reset();
	};

	const handleDelete = () => {
		if (!selectedQuest) return;
		onDeleteQuest(selectedQuest.id);
		setIsDeleteOpen(false);
		setSelectedQuest(null);
	};

	const openEditDialog = (quest: QuestListItem) => {
		setSelectedQuest(quest);
		setIsEditOpen(true);
	};

	const openDeleteDialog = (quest: QuestListItem) => {
		setSelectedQuest(quest);
		setIsDeleteOpen(true);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "#10b981";
			case "completed":
				return "#3b82f6";
			case "pending":
				return "#f59e0b";
			default:
				return "#6b7280";
		}
	};

	const columns: UnifiedTableColumn<QuestListItem>[] = [
		{
			key: "title",
			label: "Название",
			className: "font-medium",
		},
		{
			key: "description",
			label: "Описание",
		},
		{
			key: "reward_amount",
			label: "Награда",
		},
		{
			key: "budget",
			label: "Бюджет",
		},
		{
			key: "spent_amount",
			label: "Потрачено",
		},
		{
			key: "completed_count",
			label: "Завершено",
		},
		{
			key: "end_date",
			label: "Дата окончания",
			render: (value: string) =>
				new Date(value).toLocaleDateString("ru-RU"),
		},
		{
			key: "status",
			label: "Статус",
			render: (value: string) => (
				<Badge
					variant={
						value === "active"
							? "default"
							: value === "completed"
								? "secondary"
								: "outline"
					}
				>
					{value === "active"
						? "Активен"
						: value === "completed"
							? "Завершен"
							: "На рассмотрении"}
				</Badge>
			),
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Квесты</h2>
				<Button onClick={() => setIsCreateOpen(true)} disabled={isLoading}>
					Создать квест
				</Button>
			</div>

			<UnifiedTable<QuestListItem>
				title="Квесты"
				columns={columns}
				data={quests}
				groupByKey="status"
				getGroupColor={getStatusColor}
				emptyMessage="Нет квестов. Создайте первый квест."
				renderActions={(quest) => (
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => openEditDialog(quest)}
							disabled={isLoading}
						>
							Редактировать
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => openDeleteDialog(quest)}
							disabled={isLoading}
						>
							Удалить
						</Button>
					</div>
				)}
			/>

			{/* Create Dialog */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogPopup showCloseButton={true}>
					<div className="p-6">
						<h3 className="text-lg font-medium mb-4">Создать новый квест</h3>
						<Form
							methods={createMethods}
							btnTitle="Создать квест"
							mutationFn={async (data) => {
								handleCreate(data);
							}}
							onSuccess={() => {
								setIsCreateOpen(false);
								createMethods.reset();
							}}
						>
							<Field>
								<FieldLabel>Название</FieldLabel>
								<Input
									{...createMethods.register("title")}
									placeholder="Название квеста"
								/>
							</Field>
							<Field>
								<FieldLabel>Описание</FieldLabel>
								<Textarea
									{...createMethods.register("description")}
									placeholder="Описание квеста"
									rows={3}
								/>
							</Field>
							<Field>
								<FieldLabel>Награда</FieldLabel>
								<Input
									type="number"
									{...createMethods.register("reward_amount", {
										valueAsNumber: true,
									})}
									placeholder="Сумма награды"
								/>
							</Field>
							<Field>
								<FieldLabel>Бюджет</FieldLabel>
								<Input
									type="number"
									{...createMethods.register("budget", {
										valueAsNumber: true,
									})}
									placeholder="Бюджет"
								/>
							</Field>
							<Field>
								<FieldLabel>Дата окончания</FieldLabel>
								<Input
									type="datetime-local"
									{...createMethods.register("end_date")}
								/>
							</Field>
						</Form>
					</div>
				</DialogPopup>
			</Dialog>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogPopup showCloseButton={true}>
					<div className="p-6">
						<h3 className="text-lg font-medium mb-4">Редактировать квест</h3>
						{selectedQuest && (
							<Form
								methods={editMethods}
								btnTitle="Сохранить изменения"
								mutationFn={async (data) => {
									handleEdit(data);
								}}
								onSuccess={() => {
									setIsEditOpen(false);
									setSelectedQuest(null);
									editMethods.reset();
								}}
							>
								<Field>
									<FieldLabel>Название</FieldLabel>
									<Input
										{...editMethods.register("title")}
										placeholder="Название квеста"
									/>
								</Field>
								<Field>
									<FieldLabel>Описание</FieldLabel>
									<Textarea
										{...editMethods.register("description")}
										placeholder="Описание квеста"
										rows={3}
									/>
								</Field>
								<Field>
									<FieldLabel>Награда</FieldLabel>
									<Input
										type="number"
										{...editMethods.register("reward_amount", {
											valueAsNumber: true,
										})}
										placeholder="Сумма награды"
									/>
								</Field>
								<Field>
									<FieldLabel>Бюджет</FieldLabel>
									<Input
										type="number"
										{...editMethods.register("budget", {
											valueAsNumber: true,
										})}
										placeholder="Бюджет"
									/>
								</Field>
								<Field>
									<FieldLabel>Дата окончания</FieldLabel>
									<Input
										type="datetime-local"
										{...editMethods.register("end_date")}
									/>
								</Field>
							</Form>
						)}
					</div>
				</DialogPopup>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogPopup showCloseButton={true}>
					<div className="p-6">
						<h3 className="text-lg font-medium mb-4">Удалить квест</h3>
						<p className="text-gray-600 mb-6">
							Вы уверены, что хотите удалить квест "{selectedQuest?.title}"? Это
							действие нельзя отменить.
						</p>
						<div className="flex gap-3 justify-end">
							<Button
								variant="outline"
								onClick={() => setIsDeleteOpen(false)}
								disabled={isDeleting}
							>
								Отмена
							</Button>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={isDeleting}
							>
								{isDeleting ? "Удаляю..." : "Удалить"}
							</Button>
						</div>
					</div>
				</DialogPopup>
			</Dialog>
		</div>
	);
};
