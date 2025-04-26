"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { Asset } from "@prisma/client";
import { AssetIcon } from "./AssetIcon";
import { AssetActions } from "./AssetActions";

type AssetRowProps = {
	asset: Asset & { type: "stock" | "crypto" };
	walletId: string;
};

export function AssetRow({ asset, walletId }: AssetRowProps) {
	// Calculate profit/loss values
	const totalValue = asset.quantity * asset.currentPrice;
	const totalCost = asset.quantity * asset.purchasePrice;
	const profitLoss = totalValue - totalCost;
	const profitLossPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

	return (
		<TableRow>
			<TableCell>
				<div className="flex items-center gap-2">
					<AssetIcon symbol={asset.symbol} />
					<div>
						<div className="font-bold">{asset.symbol}</div>
						<div className="text-xs text-gray-500">{asset.name}</div>
					</div>
				</div>
			</TableCell>
			<TableCell>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</TableCell>
			<TableCell className="text-right">{asset.quantity.toString().replace(".", ",")}</TableCell>
			<TableCell className="text-right font-medium">{asset.purchasePrice >= 1000 ? formatCurrency(asset.purchasePrice).replace(",", "") : formatCurrency(asset.purchasePrice)}</TableCell>
			<TableCell className="text-right font-medium">{asset.currentPrice >= 1000 ? formatCurrency(asset.currentPrice).replace(",", "") : formatCurrency(asset.currentPrice)}</TableCell>
			<TableCell className="text-right font-medium">
				<div className={`${profitLoss > 0 ? "text-green-600" : profitLoss < 0 ? "text-red-600" : ""}`}>
					{formatCurrency(profitLoss)}
					<div className="text-xs">({profitLossPercentage.toFixed(2)}%)</div>
				</div>
			</TableCell>
			<TableCell className="text-right">
				<AssetActions asset={asset} walletId={walletId} />
			</TableCell>
		</TableRow>
	);
}
