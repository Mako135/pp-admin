"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000 * 10,
			gcTime: 30 * 1000,
			refetchOnWindowFocus: true,
			retry: 0,
		},
	},
});

type ProvidersProps = {
	children: ReactNode;
};

export const TanstackProviders = ({ children }: ProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};
