import React from "react";
import { WalletList } from "../ui/WalletList";
import { AssetList } from "../ui/AssetList";
import { WalletWithStats } from "@/types";

export function PortfolioDisplay({ portfolio, walletId }: { portfolio: WalletWithStats[]; walletId: string }) {
	// Find the selected wallet in the portfolio
	const selectedWallet = portfolio.find((w) => w.id === walletId);

	// Get the assets from the selected wallet
	const displayAssets = selectedWallet?.assets || [];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-4 bg-white">
			{/* Wallets Section */}
			<WalletList portfolio={portfolio} selectedWalletId={walletId} />

			{/* Assets Section */}
			<AssetList displayAssets={displayAssets} walletId={walletId} />
		</div>
	);
}
