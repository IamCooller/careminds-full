import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// Schema for asset creation and validation
const assetSchema = z.object({
	type: z.enum(["stock", "crypto"]),
	symbol: z.string().min(1, "Symbol is required"),
	name: z.string().min(1, "Name is required"),
	quantity: z.number().positive("Quantity must be positive"),
	purchasePrice: z.number().positive("Purchase price must be positive"),
	currentPrice: z.number().positive("Current price must be positive"),
});

export async function GET(req: NextRequest, context: { params: Promise<{ walletId: string }> }) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the wallet ID from the params
		const params = await context.params;
		const walletId = params.walletId;

		// Check if the wallet exists and belongs to the user
		const wallet = await prisma.wallet.findFirst({
			where: {
				id: walletId,
				userId: session.user.id,
			},
		});

		if (!wallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		// Get all assets for the wallet
		const assets = await prisma.asset.findMany({
			where: {
				walletId: walletId,
			},
		});

		return NextResponse.json(assets);
	} catch (error) {
		console.error("Error fetching assets:", error);
		return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
	}
}

export async function POST(req: NextRequest, context: { params: Promise<{ walletId: string }> }) {
	try {
		// Get the authenticated user
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the wallet ID from the params
		const params = await context.params;
		const walletId = params.walletId;

		// Check if the wallet exists and belongs to the user
		const wallet = await prisma.wallet.findFirst({
			where: {
				id: walletId,
				userId: session.user.id,
			},
		});

		if (!wallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		// Parse the request body
		const body = await req.json();

		// Validate the request body
		const result = assetSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
		}

		// Create the asset
		const asset = await prisma.asset.create({
			data: {
				type: result.data.type,
				symbol: result.data.symbol,
				name: result.data.name,
				quantity: result.data.quantity,
				purchasePrice: result.data.purchasePrice,
				currentPrice: result.data.currentPrice,
				walletId: walletId,
			},
		});

		return NextResponse.json(asset, { status: 201 });
	} catch (error) {
		console.error("Error creating asset:", error);
		return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
	}
}
