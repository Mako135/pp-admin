"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/api";
import { LoginSchema, type LoginData } from "./types";
import { authStore } from "@/shared/lib/auth-store";

export const useLogin = () => {
	const store = authStore();
	const router = useRouter();
	const methods = useForm<LoginData>({
		resolver: zodResolver(LoginSchema),
		mode: "onBlur",
	});

	const mutationFn = async (data: LoginData) => {
		const newFormData = new FormData();
		newFormData.append("username", data.username);
		newFormData.append("password", data.password);

		const response = await apiRequest<void>(
			"post",
			"/auth/admin/login",
			newFormData,
			"auth",
		);

		if (!response.ok) {
			throw response;
		}

		const token = await fetch("/api/token/");
		const tokenData = await token.json();

		if (tokenData?.access_token) {
			store.setToken(tokenData.access_token);
		}
	};

	const onSuccess = () => {
		router.push("/dashboard");
	};

	return {
		methods,
		mutationFn,
		onSuccess,
	};
};
