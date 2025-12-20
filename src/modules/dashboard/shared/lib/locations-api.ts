import { apiRequest } from "@/api";

export type Location = {
  address: string;
  latitude: number;
  longitude: number;
  id: number;
  organization_id: number;
  created_at: string;
};

export const getLocations = async (organizationId: number) => {
  return apiRequest<Location[]>(
    "get",
    `/auth/admin/organizations/${organizationId}/locations`
  );
};

export const createLocation = async (
  organizationId: number,
  data: {
    address: string;
    latitude: number;
    longitude: number;
  }
) => {
  return apiRequest<Location>(
    "post",
    `/auth/admin/organizations/${organizationId}/locations`,
    data
  );
};
