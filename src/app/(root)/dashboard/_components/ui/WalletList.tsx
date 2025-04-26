import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WalletWithStats } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { WalletRow } from "./WalletRow";

export function WalletList({ portfolio, selectedWalletId }: { portfolio: WalletWithStats[]; selectedWalletId?: string }) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-xl font-medium text-black mb-2">Wallets</p>
			<div className="border border-gray-200 rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-100/30">
							<TableHead>Name</TableHead>
							<TableHead className="text-right">Current Balance</TableHead>
							<TableHead className="text-right">Spent Amount</TableHead>
							<TableHead className="text-right">Profit/Loss</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{portfolio.map((wallet, index) => (
							<WalletRow key={wallet.id} wallet={wallet} index={index} isSelected={selectedWalletId === wallet.id} />
						))}
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-center items-center">
				{" "}
				<Link href="?showWalletModal=true" className={cn(buttonVariants({ variant: "default" }), "")}>
					Create Wallet
				</Link>
			</div>
		</div>
	);
}
