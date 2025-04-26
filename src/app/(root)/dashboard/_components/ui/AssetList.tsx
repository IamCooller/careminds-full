import { Asset } from "@prisma/client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AssetRow } from "./AssetRow";

type AssetListProps = {
	displayAssets: Array<Asset & { type: "stock" | "crypto" }>;
	walletId: string;
};

export function AssetList({ displayAssets, walletId }: AssetListProps) {
	return (
		<div className="flex flex-col gap-2">
			<p className="text-xl font-medium text-black mb-2">Assets</p>
			<div className="border border-gray-200 rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-100/30">
							<TableHead>Asset</TableHead>
							<TableHead>Type</TableHead>
							<TableHead className="text-right">Quantity</TableHead>
							<TableHead className="text-right">Purchase Price</TableHead>
							<TableHead className="text-right">Current Price</TableHead>
							<TableHead className="text-right">Profit/Loss</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{displayAssets.map((asset) => (
							<AssetRow key={asset.id} asset={asset} walletId={walletId} />
						))}
						{displayAssets.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-4 text-gray-500">
									No assets found for this wallet
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex justify-center items-center mt-auto">
				<Link href={`?wallet=${walletId}&showAssetModal=true`} className={cn(buttonVariants({ variant: "default" }))}>
					Add Asset
				</Link>
			</div>
		</div>
	);
}
