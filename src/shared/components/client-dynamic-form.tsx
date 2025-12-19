"use client";

import { useMutation } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import {
	type FieldValues,
	FormProvider,
	type Path,
	type SubmitHandler,
	type UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CheckCircle2, Loader, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { type ErrorResponse } from "@/api/index";

type FormProps<T extends FieldValues> = {
	children: ReactNode;
	btnTitle: string;
	formId?: string;
	className?: string;
	methods: UseFormReturn<T>;
	mutationFn: (data: T) => Promise<void | undefined>;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onSettled?: () => void;
	disabled?: boolean;
	successMsg?: string;
	errorMsg?: string;
	hasButton?: boolean;
};

export function Form<T extends FieldValues>({
	children,
	methods,
	btnTitle,
	className,
	mutationFn,
	formId,
	onSuccess,
	onError,
	onSettled,
	disabled,
	successMsg,
	errorMsg,
}: FormProps<T>) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const { reset, setError } = methods;

	const { mutateAsync, isPending } = useMutation<void, ErrorResponse | Error, T>({
		mutationFn: mutationFn,
		onMutate: () => {
			setErrorMessage(null);
		},
		onSuccess: () => {
			onSuccess?.();
			setErrorMessage(null);
			if (successMsg) {
				setSuccessMessage(successMsg);
			}
			reset();
		},
		onError: (error) => {
			// Check if error is ErrorResponse with validation errors
			if ("ok" in error && !error.ok && error.validation) {
				Object.entries(error.validation).forEach(([fieldName, fieldErrors]) => {
					if (fieldErrors && fieldErrors.length > 0) {
						setError(fieldName as Path<T>, {
							message: fieldErrors[0],
						});
					}
				});
				// Set general error message from validation response
				if (error.message) {
					setErrorMessage(error.message);
				}
			} else {
				// Regular error handling
				setErrorMessage(error.message);
			}

			if (errorMsg) {
				setErrorMessage(errorMsg);
			}

			onError?.(error as Error);
		},
		onSettled: () => {
			onSettled?.();
		},
	});

	const onSubmit: SubmitHandler<T> = async (data) => {
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(
				([_, value]) => value !== "" && value !== undefined,
			),
		) as T;
		console.log("Form onSubmit - filtered data:", filteredData);
		await mutateAsync(filteredData);
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
				className={cn(
					"flex flex-col gap-4 w-full max-w-sm",
					isPending &&
						"opacity-50 pointer-events-none [&_button]:opacity-50 [&_button]:pointer-events-none",
					className,
				)}
				id={formId}
			>
				{children}

				{successMessage && (
					<Alert className="bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-900">
						<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
						<AlertDescription className="text-green-800">
							{successMessage}
						</AlertDescription>
					</Alert>
				)}

				{errorMessage && (
					<Alert variant="error">
						<XCircle className="h-4 w-4" />
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				)}
				<Button
					disabled={disabled}
					type="submit"
					onClick={() => onSubmit}
					className={className}
				>
					{isPending ? (
						<Loader className="ml-2 animate-spin" size={16} />
					) : (
						<span>{btnTitle}</span>
					)}
				</Button>
			</form>
		</FormProvider>
	);
}
