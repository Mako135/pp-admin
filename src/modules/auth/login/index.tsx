import { DynamicForm } from "@/shared/components/dynamic-form";
import { loginAction } from "../lib/auth-actions";
import { loginFormConfig } from "../lib/auth-form-configs";
import { LoginFormFooter } from "./components/login-form-footer";

export const LoginPage = () => {
	return (
		<DynamicForm
			config={loginFormConfig}
			action={loginAction}
			footer={<LoginFormFooter />}
			redirectUrl="/dashboard"
		/>
	);
};
