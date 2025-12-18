import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { apiRequest } from "@/api";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface PageProps {
	searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { token } = params;

	if (!token) {
		redirect("/auth/login");
	}

	const res = await apiRequest<void>(
		"post",
		"/auth/admin/activation",
		{
			token,
		},
		"auth",
	);

	if (!res.ok) {
		redirect("/auth/login");
	}

	return (
		<Alert className="bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-900">
			<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
			<AlertDescription className="text-green-800">
				Токен успешно верифицирован. Пожалуйста, введите новый пароль.
			</AlertDescription>
		</Alert>
	);
}
