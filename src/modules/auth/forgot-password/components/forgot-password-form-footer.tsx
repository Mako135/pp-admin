import Link from "next/link";

export const ForgotPasswordFormFooter = () => {
	return (
		<div className="text-sm text-center text-gray-500 w-full">
			Вспомнили пароль?{" "}
			<Link href="/auth/login" className="text-primary hover:underline">
				Войти
			</Link>
		</div>
	);
};
