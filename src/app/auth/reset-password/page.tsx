import { redirect } from "next/navigation";
import { resetPasswordAction } from "@/modules/auth/lib/auth-actions";
import { resetPasswordFormConfig } from "@/modules/auth/lib/auth-form-configs";
import { DynamicForm } from "@/shared/components/dynamic-form";

interface PageProps {
	searchParams: Promise<{ token?: string; uid?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { token, uid } = params;

	if (!token || !uid) {
		redirect("/auth/login");
	}

	return (
		<DynamicForm
			config={resetPasswordFormConfig}
			action={resetPasswordAction}
			hiddenFields={{
				token,
				uid,
			}}
		/>
	);
}
