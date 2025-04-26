import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
const userSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	try {
		const { name, email, password } = userSchema.parse(await req.json());

		const hashed_password = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email: email.toLowerCase(),
				password: hashed_password,
			},
		});

		return NextResponse.json({
			user: {
				name: user.name,
				email: user.email,
			},
		});
	} catch (error: any) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					status: "error",
					message: "Validation failed",
					errors: error.errors,
				},
				{ status: 400 }
			);
		}

		if (error.code === "P2002") {
			return NextResponse.json(
				{
					status: "fail",
					message: "user with that email already exists",
				},
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{
				status: "error",
				message: error.message || "Internal Server Error",
			},
			{ status: 500 }
		);
	}
}
