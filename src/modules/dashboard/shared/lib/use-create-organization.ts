"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/api";
import { CreateOrganizationSchema, type CreateOrganizationData } from "./types";
import { queryClient } from "@/lib/query-client";

export const useCreateOrganization = () => {
	const methods = useForm<CreateOrganizationData>({
		resolver: zodResolver(CreateOrganizationSchema),
		mode: "onBlur",
	});

	const mutationFn = async (data: CreateOrganizationData) => {
		const response = await apiRequest("post", "/organizations", data);

		if (!response.ok) {
			throw response;
		}
	};

	const onSuccess = async () => {
		await queryClient.refetchQueries({
			queryKey: ["profile"],
		});
	};

	return {
		methods,
		mutationFn,
		onSuccess,
	};
};
