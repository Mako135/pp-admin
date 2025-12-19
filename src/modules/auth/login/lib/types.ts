import z from "zod";

export const LoginSchema = z.object({
	username: z
		.string()
		.email("Введите корректный email")
		.min(1, "Введите email"),
	password: z.string().min(1, "Введите пароль"),
});

export type LoginData = z.infer<typeof LoginSchema>;
