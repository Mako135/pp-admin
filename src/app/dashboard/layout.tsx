import { ProfileProvider } from "@/lib/profile-provider";
import { DashboardHeader } from "@/modules/dashboard/shared/components/header";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<ProfileProvider>
			<DashboardHeader />
			<main className="px-4 mx-auto max-w-7xl">
				{children}
			</main>
		</ProfileProvider>
	);
}
