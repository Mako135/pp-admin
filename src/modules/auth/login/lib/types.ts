import z from "zod";

export const LoginSchema = z.object({
	username: z.string().min(1, "Введите имя пользователя"),
	password: z.string().min(1, "Введите пароль"),
});

export type LoginData = z.infer<typeof LoginSchema>;
