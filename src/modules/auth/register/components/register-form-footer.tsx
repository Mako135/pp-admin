import Link from "next/link";

export const RegisterFormFooter = () => {
  return (
    <div className="text-sm text-center text-gray-500 w-full">
      Уже есть аккаунт?{" "}
      <Link href="/auth/login" className="text-primary hover:underline">
        Войти
      </Link>
    </div>
  );
};
