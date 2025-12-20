"use client";

import { Form } from "@/shared/components/client-dynamic-form";
import { useCreateOrganization } from "../lib/use-create-organization";
import { CreateOrganizationFormFields } from "./create-organization-form-fields";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";
import { CreateOrganizationData } from "../lib/types";

export const CreateOrganization = () => {
	const { methods, mutationFn, onSuccess } = useCreateOrganization();

	return (
		<Card className="w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Создание организации</CardTitle>
				<CardDescription>
					Заполните информацию о вашей организации
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form<CreateOrganizationData>
					methods={methods}
					btnTitle="Создать организацию"
					mutationFn={mutationFn}
					onSuccess={onSuccess}
					successMsg="Организация успешно создана"
					errorMsg="Ошибка при создании организации"
				>
					<CreateOrganizationFormFields />
				</Form>
			</CardContent>
		</Card>
	);
};
