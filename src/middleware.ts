import { NextRequest, NextResponse } from "next/server";

import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Skip middleware for API auth routes to prevent redirect loops
	if (path.startsWith("/api/auth")) {
		return NextResponse.next();
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
