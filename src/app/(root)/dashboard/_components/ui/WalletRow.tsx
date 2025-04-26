"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { WalletActions } from "./WalletActions";

type WalletRowProps = {
	wallet: {
		id: string;
		name: string;
		currentAmount: number; // Current balance
		spentAmount: number; // Spent amount
		profitLoss: number; // Profit/Loss
	};
	index: number;
	isSelected: boolean;
};

export function WalletRow({ wallet, index, isSelected }: WalletRowProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleRowClick = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("wallet", wallet.id);
		replace(`${pathname}?${params.toString()}`);
	};

	return (
		<TableRow key={index} className={`cursor-pointer font-medium hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`} onClick={handleRowClick}>
			<TableCell className="">
				<div className="flex items-center justify-between">
					<span>{wallet.name}</span>
					<WalletActions walletId={wallet.id} walletName={wallet.name} />
				</div>
			</TableCell>
			<TableCell className="text-right">{formatCurrency(wallet.currentAmount)}</TableCell>
			<TableCell className="text-right">{formatCurrency(wallet.spentAmount)}</TableCell>
			<TableCell className={`text-right ${wallet.profitLoss > 0 ? "text-green-600" : wallet.profitLoss < 0 ? "text-red-600" : ""}`}>
				{formatCurrency(wallet.profitLoss)}
				{wallet.profitLoss !== 0 && <span className="ml-1 text-xs">({((wallet.profitLoss / wallet.spentAmount) * 100).toFixed(2)}%)</span>}
			</TableCell>
		</TableRow>
	);
}
