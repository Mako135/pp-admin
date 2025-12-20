"use client";

import { create } from "zustand";

interface OrganizationStore {
	selectedOrganizationId: number | null;
	setSelectedOrganizationId: (id: number | null) => void;
	clearSelectedOrganization: () => void;
}

export const organizationStore = create<OrganizationStore>((set) => ({
	selectedOrganizationId: null,
	setSelectedOrganizationId: (id) => set({ selectedOrganizationId: id }),
	clearSelectedOrganization: () => set({ selectedOrganizationId: null }),
}));
