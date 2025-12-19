import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const token = req.cookies.get("access_token_cookie")?.value;

	if (!token) {
		return NextResponse.json(null, { status: 200 });
	}

	return NextResponse.json(token, { status: 200 });
}
