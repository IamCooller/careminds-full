import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "process";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
export default {
	secret: env.AUTH_SECRET,
	debug: env.NODE_ENV === "development",
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "Sign in",
			id: "credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "example@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						email: String(credentials.email),
					},
				});

				if (!user || !(await bcrypt.compare(String(credentials.password), user.password!))) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					randomKey: "Hey cool",
				};
			},
		}),
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const publicPaths = ["/login", "/register", "/404"];
			const isPublicPath = publicPaths.some((path) => nextUrl.pathname.startsWith(path));

			// Redirect logged-in users away from public pages
			if (isPublicPath && isLoggedIn) {
				return Response.redirect(new URL("/dashboard", nextUrl.origin));
			}

			// Allow access to public paths for non-logged-in users
			if (isPublicPath) {
				return true;
			}

			// Require authentication for all other paths
			if (!isLoggedIn) {
				const redirectUrl = new URL("/login", nextUrl.origin);
				redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
				return Response.redirect(redirectUrl);
			}

			return true;
		},
		jwt: ({ token, user }) => {
			if (user) {
				interface UserWithId {
					id: string;
					randomKey: string;
				}
				const u = user as UserWithId;
				return {
					...token,
					id: u.id,
					randomKey: u.randomKey,
				};
			}
			return token;
		},
		session(params) {
			return {
				...params.session,
				user: {
					...params.session.user,
					id: params.token.id as string,
					randomKey: params.token.randomKey,
				},
			};
		},
	},
} satisfies NextAuthConfig;
