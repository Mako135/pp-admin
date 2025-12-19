import { DynamicForm } from "@/shared/components/dynamic-form";
import { forgotPasswordAction } from "../lib/auth-actions";
import { forgotPasswordFormConfig } from "../lib/auth-form-configs";
import { ForgotPasswordFormFooter } from "./components/forgot-password-form-footer";

export const ForgotPasswordPage = () => {
	return (
		<DynamicForm
			config={forgotPasswordFormConfig}
			action={forgotPasswordAction}
			footer={<ForgotPasswordFormFooter />}
		/>
	);
};
