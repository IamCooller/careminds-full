import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Schema for wallet validation
const walletSchema = z.object({
	name: z.string().min(1, "Wallet name is required"),
});

// Update wallet
export async function PATCH(req: NextRequest, { params }: { params: { walletId: string } }) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the wallet ID from the params
		const walletId = params.walletId;

		// Check if the wallet exists and belongs to the user
		const existingWallet = await prisma.wallet.findFirst({
			where: {
				id: walletId,
				userId: session.user.id,
			},
		});

		if (!existingWallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		// Parse the request body
		const body = await req.json();

		// Validate the request body
		const result = walletSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
		}

		// Update the wallet
		const updatedWallet = await prisma.wallet.update({
			where: {
				id: walletId,
			},
			data: {
				name: result.data.name,
			},
		});

		return NextResponse.json(updatedWallet);
	} catch (error) {
		console.error("Error updating wallet:", error);
		return NextResponse.json({ error: "Failed to update wallet" }, { status: 500 });
	}
}

// Delete wallet
export async function DELETE(req: NextRequest, { params }: { params: { walletId: string } }) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the wallet ID from the params
		const walletId = params.walletId;

		// Check if the wallet exists and belongs to the user
		const existingWallet = await prisma.wallet.findFirst({
			where: {
				id: walletId,
				userId: session.user.id,
			},
		});

		if (!existingWallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		// Delete all assets in the wallet first (cascading delete not working with MongoDB adapter)
		await prisma.asset.deleteMany({
			where: {
				walletId: walletId,
			},
		});

		// Delete the wallet
		await prisma.wallet.delete({
			where: {
				id: walletId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting wallet:", error);
		return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 });
	}
}
