import { Input, type InputProps } from "../ui/input";

interface PasswordInputProps extends InputProps {}

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
	return (
		<div className="relative">
			<Input type="password" placeholder="Введите пароль" {...props} />
		</div>
	);
};
