"use server";

import { createZodSchemaFromConfig } from "@/shared/lib/form-schema";
import { questsConfig } from "./questsConfig";

export async function createQuest(prev: unknown, formData: FormData) {
	const schema = createZodSchemaFromConfig(questsConfig);

	const data = {
		username: formData.get("username"),
		password: formData.get("password"),
	};

    const result = schema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    
}
