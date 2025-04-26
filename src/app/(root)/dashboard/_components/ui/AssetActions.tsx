"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Asset } from "@prisma/client";

type AssetActionsProps = {
	asset: Asset & { type: "stock" | "crypto" };
	walletId: string;
};

export function AssetActions({ asset, walletId }: AssetActionsProps) {
	const router = useRouter();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleEdit = () => {
		router.push(`?wallet=${walletId}&showAssetModal=edit&assetId=${asset.id}`);
	};

	const handleDeleteClick = () => {
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		try {
			const response = await fetch(`/api/wallets/${walletId}/assets/${asset.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete asset");
			}

			toast.success("Asset deleted successfully");
			router.refresh();
		} catch (error) {
			console.error("Error deleting asset:", error);
			toast.error("Failed to delete asset");
		}
	};

	return (
		<>
			<div className="flex justify-end space-x-2">
				<Button variant="ghost" size="icon" onClick={handleEdit}>
					<Pencil className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" onClick={handleDeleteClick}>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>

			<ConfirmDialog
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onConfirm={handleConfirmDelete}
				title="Delete Asset"
				description={`Are you sure you want to delete ${asset.name} (${asset.symbol})? This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				destructive={true}
			/>
		</>
	);
}
