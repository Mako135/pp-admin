"use client";

import { useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import type { CreateOrganizationData } from "../lib/types";

export const CreateOrganizationFormFields = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<CreateOrganizationData>();

	return (
		<Field>
			<FieldLabel>Название организации</FieldLabel>
			<div className="w-full">
				<Input
					{...register("company_name")}
					type="text"
					placeholder="Введите название организации"
				/>
				{errors.company_name && (
					<span className="text-sm text-red-500 mt-1">
						{errors?.company_name.message as string}
					</span>
				)}
			</div>
		</Field>
	);
};
