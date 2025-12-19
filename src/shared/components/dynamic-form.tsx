"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import type { FormConfig } from "../lib/form-schema";

interface DynamicFormProps {
	config: FormConfig;
	action: (prevState: unknown, formData: FormData) => Promise<any>;
	initialData?: Record<string, string>;
	hiddenFields?: Record<string, string>;
	onSuccess?: () => void;
	footer?: React.ReactNode;
	className?: string;
	redirectUrl?: string;
}

export function DynamicForm({
	config,
	action,
	initialData,
	hiddenFields,
	onSuccess,
	footer,
	className,
	redirectUrl,
}: DynamicFormProps) {
	const [state, formAction, pending] = useActionState(action, null);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			if (redirectUrl) {
				router.push(redirectUrl);
			} else if (onSuccess) {
				onSuccess();
			}
		}
	}, [state?.success, onSuccess, redirectUrl, router]);

	return (
		<Card className={cn("w-sm", className)}>
			<CardHeader>
				<CardTitle className="text-2xl">{config.title}</CardTitle>
				{config.description && (
					<CardDescription>{config.description}</CardDescription>
				)}
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					{hiddenFields &&
						Object.entries(hiddenFields).map(([key, value]) => (
							<input key={key} type="hidden" name={key} value={value} />
						))}

					{config.fields.map((field) => (
						<Field key={field.name} className="relative">
							{field.link && (
								<div className="absolute top-0 right-0 text-sm hover:underline">
									<Link href={field.link.href}>{field.link.label}</Link>
								</div>
							)}
							<FieldLabel>{field.label}</FieldLabel>
							{field.type === "textarea" ? (
								<Textarea
									id={field.name}
									name={field.name}
									placeholder={field.placeholder}
									defaultValue={initialData?.[field.name]}
									disabled={pending}
									className="resize-none"
									rows={4}
								/>
							) : (
								<Input
									id={field.name}
									name={field.name}
									type={field.type}
									placeholder={field.placeholder}
									defaultValue={initialData?.[field.name]}
									disabled={pending}
								/>
							)}
							{state?.errors?.[field.name] && (
								<p className="text-sm font-medium text-destructive">
									{state.errors[field.name][0]}
								</p>
							)}
						</Field>
					))}

					{state?.success && (
						<Alert className="bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-900">
							<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
							<AlertDescription className="text-green-800">
								{state.message || config.successMessage}
							</AlertDescription>
						</Alert>
					)}

					{state?.error && (
						<Alert variant="error">
							<XCircle className="h-4 w-4" />
							<AlertDescription>{state.error}</AlertDescription>
						</Alert>
					)}

					<Button type="submit" className="w-full" disabled={pending}>
						{pending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Отправка...
							</>
						) : (
							config.submitLabel
						)}
					</Button>
				</form>
			</CardContent>
			{footer && <CardFooter>{footer}</CardFooter>}
		</Card>
	);
}
