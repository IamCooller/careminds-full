interface Asset {
	id: string;
	type: string;
	symbol: string;
	name: string;
	quantity: number;
	purchasePrice: number;
	currentPrice: number;
}

interface Wallet {
	id: string;
	name: string;
	assets: Asset[];
}

export function calculateAssetStats(asset: Asset) {
	const totalValue = asset.quantity * asset.currentPrice;
	const totalCost = asset.quantity * asset.purchasePrice;
	const profitLoss = totalValue - totalCost;
	const profitLossPercentage = (profitLoss / totalCost) * 100;

	return {
		totalValue,
		totalCost,
		profitLoss,
		profitLossPercentage,
	};
}

// This function calculates statistics for a wallet
export function calculateWalletStats(wallet: Wallet) {
	const assets = wallet.assets || [];

	// Calculate total value and total cost of all assets
	let totalValue = 0;
	let totalCost = 0;

	const assetStats = assets.map((asset: Asset) => {
		const assetValue = asset.quantity * asset.currentPrice;
		const assetCost = asset.quantity * asset.purchasePrice;
		const profitLoss = assetValue - assetCost;
		const profitLossPercentage = assetCost > 0 ? (profitLoss / assetCost) * 100 : 0;

		totalValue += assetValue;
		totalCost += assetCost;

		return {
			id: asset.id,
			symbol: asset.symbol,
			name: asset.name,
			totalValue: assetValue,
			totalCost: assetCost,
			profitLoss,
			profitLossPercentage,
		};
	});

	// Calculate total profit/loss
	const totalProfitLoss = totalValue - totalCost;
	const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

	return {
		totalValue,
		totalCost,
		totalProfitLoss,
		totalProfitLossPercentage,
		assetStats,
	};
}
