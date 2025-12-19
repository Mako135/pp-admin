"use client";

import { Form } from "@/shared/components/client-dynamic-form";
import { useLogin } from "./lib/use-login";
import { LoginFormFooter } from "./components/login-form-footer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useFormContext } from "react-hook-form";
import Link from "next/link";

const LoginFormFields = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<>
			<Field>
				<FieldLabel>Email</FieldLabel>
				<div className="w-full">
					<Input
						{...register("username")}
						type="email"
						placeholder="example@mail.com"
					/>
					{errors.username && (
						<span className="text-sm text-red-500 mt-1">
							{errors?.username.message as string}
						</span>
					)}
				</div>
			</Field>

			<Field className="relative">
				<FieldLabel>Пароль</FieldLabel>
				<div className="absolute top-0 right-0 text-sm hover:underline">
					<Link href="/auth/forgot-password">Забыли пароль?</Link>
				</div>
				<div  className="w-full"	>
					<Input
						{...register("password")}
						placeholder="Введите пароль"
						type="password"
					/>
					{errors.password && (
						<span className="text-sm text-red-500 mt-1">
							{errors?.password.message as string} 
						</span>
					)}
				</div>
			</Field>
		</>
	);
};

export const LoginPage = () => {
	const { methods, mutationFn, onSuccess } = useLogin();

	return (
		<Card className="w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Вход в систему</CardTitle>
				<CardDescription>Войдите в свой аккаунт</CardDescription>
			</CardHeader>
			<CardContent>
				<Form
					methods={methods}
					mutationFn={mutationFn}
					onSuccess={onSuccess}
					btnTitle="Войти"
					successMsg="Вы успешно вошли в систему"
				>
					<LoginFormFields />
					<LoginFormFooter />
				</Form>
			</CardContent>
		</Card>
	);
};
