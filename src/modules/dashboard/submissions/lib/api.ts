import { apiRequest } from "@/api";
import { Submission } from "./types";
import { organizationStore } from "@/shared/lib/organization-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const getSubmissions = async (organizationId: number) => {
  return apiRequest<Submission[]>(
    "get",
    `/organizations/${organizationId}/submissions`
  );
};

export const approveSubmission = async (
  organizationId: number,
  submissionId: number
) => {
  return apiRequest<Submission>(
    "post",
    `/organizations/${organizationId}/submissions/${submissionId}/approve`
  );
};

export const rejectSubmission = async (
  organizationId: number,
  submissionId: number
) => {
  return apiRequest<Submission>(
    "post",
    `/organizations/${organizationId}/submissions/${submissionId}/reject`
  );
};

export const useSubmissions = () => {
  const orgId = organizationStore.getState().selectedOrganizationId;
  return useQuery({
    queryKey: ["submissions", orgId],
    queryFn: () => getSubmissions(orgId!),
    enabled: !!orgId,
  });
};

export const useApproveSubmission = () => {
  const queryClient = useQueryClient();
  const orgId = organizationStore.getState().selectedOrganizationId;

  return useMutation({
    mutationFn: (submissionId: number) =>
      approveSubmission(orgId!, submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", orgId] });
    },
  });
};

export const useRejectSubmission = () => {
  const queryClient = useQueryClient();
  const orgId = organizationStore.getState().selectedOrganizationId;

  return useMutation({
    mutationFn: (submissionId: number) =>
      rejectSubmission(orgId!, submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", orgId] });
    },
  });
};
