import Link from "next/link";

export const LoginFormFooter = () => {
  return (
    <div className="text-sm text-center text-gray-500 w-full">
      Еще нет аккаунта?{" "}
      <Link href="/auth/register" className="text-primary hover:underline">
        Зарегистрироваться
      </Link>
    </div>
  );
};
