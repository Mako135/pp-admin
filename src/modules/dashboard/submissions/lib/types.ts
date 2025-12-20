export type Submission = {
	id: number;
	quest_id: number;
	user_id: number;
	location_id: number;
	submitted_at: string;
	status: "pending" | "approved" | "rejected";
};
