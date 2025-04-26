import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { calculateWalletStats } from "@/lib/calculations";
import { z } from "zod";
import { auth } from "@/auth";

// Schema for wallet creation
const createWalletSchema = z.object({
	name: z.string().min(1, "Wallet name is required"),
});

export async function GET() {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the user ID from the session
		const userId = session.user.id;

		if (!userId) {
			return NextResponse.json({ error: "User ID not found" }, { status: 400 });
		}

		// Fetch all wallets for the user
		const wallets = await prisma.wallet.findMany({
			where: {
				userId: userId,
			},
			include: {
				assets: true,
			},
		});

		// Calculate stats for each wallet
		const walletsWithStats = wallets.map((wallet) => {
			const stats = calculateWalletStats(wallet);
			return {
				...wallet,
				stats,
			};
		});

		return NextResponse.json(walletsWithStats);
	} catch (error) {
		console.error("Error fetching wallets:", error);
		return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the user ID from the session
		const userId = session.user.id;

		if (!userId) {
			return NextResponse.json({ error: "User ID not found" }, { status: 400 });
		}

		// Parse the request body
		const body = await req.json();

		// Validate the request body
		const result = createWalletSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
		}

		// Create the wallet
		const wallet = await prisma.wallet.create({
			data: {
				name: result.data.name,
				userId: userId,
			},
		});

		return NextResponse.json(wallet, { status: 201 });
	} catch (error) {
		console.error("Error creating wallet:", error);
		return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
	}
}
