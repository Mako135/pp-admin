import { DynamicForm } from "@/shared/components/dynamic-form";
import { registerAction } from "../lib/auth-actions";
import { registerFormConfig } from "../lib/auth-form-configs";
import { RegisterFormFooter } from "./components/register-form-footer";

export const RegisterPage = () => {
  return (
    <DynamicForm
      config={registerFormConfig}
      action={registerAction}
      footer={<RegisterFormFooter />}
    />
  );
};
