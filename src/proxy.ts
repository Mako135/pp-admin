import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isSecurePath = (path: string) => {
	const securePath = "/dashboard";
	return path.startsWith(securePath);
};

export async function proxy(req: NextRequest) {
	// const { pathname } = req.nextUrl;
	// const refreshToken = req.cookies.get("refresh_token_cookie")?.value;
	// const hasAuth = !!refreshToken;

	// console.log("Proxy middleware:", { pathname, hasAuth });

	// if (!isSecurePath(pathname) && !hasAuth) {
	// 	return NextResponse.next();
	// }

	// if (!isSecurePath(pathname) && hasAuth) {
	// 	return NextResponse.redirect(new URL("/dashboard", req.url));
	// }

	// if (isSecurePath(pathname) && !hasAuth) {
	// 	return NextResponse.redirect(new URL("/auth/login", req.url));
	// }

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
