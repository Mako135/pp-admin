import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/api";
import { handleApiError } from "@/api/error";
import type { LoginData } from "./types";

export const useLogin = () => {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: async (data: LoginData) => {
			const newFormData = new FormData();
			newFormData.append("username", data.username);
			newFormData.append("password", data.password);
			const response = await apiRequest<void>(
				"post",
				"/auth/admin/login",
				newFormData,
				"auth",
			);

			const errorResult = handleApiError(response);
			if (errorResult) setError(errorResult.error);
		},
		onSuccess: () => {
			router.push("/dashboard");
			setError(null);
		},
	});

	return {
		login: mutateAsync,
		isPending,
		error,
	};
};
