import { useProfile } from "../dashboard/shared/lib/queries";

export const index = () => {
	const { data, isPending, error } = useProfile();
	return <div>index</div>;
};
