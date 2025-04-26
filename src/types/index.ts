import { Wallet } from "@prisma/client";

import { Asset } from "@prisma/client";

export type WalletWithStats = Wallet & {
	currentAmount: number;
	spentAmount: number;
	profitLoss: number;
	assets: Array<Asset & { type: "stock" | "crypto" }>;
};
