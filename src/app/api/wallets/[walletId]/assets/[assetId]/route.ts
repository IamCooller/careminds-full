import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Schema for asset validation
const assetSchema = z.object({
	type: z.enum(["stock", "crypto"]),
	symbol: z.string().min(1, "Symbol is required"),
	name: z.string().min(1, "Name is required"),
	quantity: z.number().positive("Quantity must be positive"),
	purchasePrice: z.number().positive("Purchase price must be positive"),
	currentPrice: z.number().positive("Current price must be positive"),
});

// Function to verify wallet ownership
async function verifyWalletOwnership(walletId: string, userId: string) {
	const wallet = await prisma.wallet.findFirst({
		where: {
			id: walletId,
			userId: userId,
		},
	});

	return wallet;
}

// Update asset
export async function PATCH(req: NextRequest, context: { params: Promise<{ walletId: string; assetId: string }> }) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get IDs from the params
		const { walletId, assetId } = await context.params;

		// Verify wallet ownership
		const wallet = await verifyWalletOwnership(walletId, session.user.id);
		if (!wallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		// Check if the asset exists and belongs to the wallet
		const existingAsset = await prisma.asset.findFirst({
			where: {
				id: assetId,
				walletId: walletId,
			},
		});

		if (!existingAsset) {
			return NextResponse.json({ error: "Asset not found" }, { status: 404 });
		}

		// Parse the request body
		const body = await req.json();

		// Validate the request body
		const result = assetSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
		}

		// Update the asset
		const updatedAsset = await prisma.asset.update({
			where: {
				id: assetId,
			},
			data: {
				type: result.data.type,
				symbol: result.data.symbol,
				name: result.data.name,
				quantity: result.data.quantity,
				purchasePrice: result.data.purchasePrice,
				currentPrice: result.data.currentPrice,
			},
		});

		return NextResponse.json(updatedAsset);
	} catch (error) {
		console.error("Error updating asset:", error);
		return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
	}
}

// Delete asset
export async function DELETE(req: NextRequest, context: { params: Promise<{ walletId: string; assetId: string }> }) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user || !session.user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get IDs from the params
		const { walletId, assetId } = await context.params;

		// Verify wallet ownership
		const wallet = await verifyWalletOwnership(walletId, session.user.id);
		if (!wallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		// Check if the asset exists and belongs to the wallet
		const existingAsset = await prisma.asset.findFirst({
			where: {
				id: assetId,
				walletId: walletId,
			},
		});

		if (!existingAsset) {
			return NextResponse.json({ error: "Asset not found" }, { status: 404 });
		}

		// Delete the asset
		await prisma.asset.delete({
			where: {
				id: assetId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting asset:", error);
		return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
	}
}
