import { apiRequest } from "@/api";
import type { Organization, Profile } from "./types";

export const getOrganization = async () => {
	return apiRequest<Organization[]>("get", "/organization/info");
};

export const getProfile = async () => {
	return apiRequest<Profile>("get", "/auth/admin/users/me");
};
