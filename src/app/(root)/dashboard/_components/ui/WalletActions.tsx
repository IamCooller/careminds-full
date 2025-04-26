"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type WalletActionsProps = {
	walletId: string;
	walletName: string;
};

export function WalletActions({ walletId, walletName }: WalletActionsProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		const params = new URLSearchParams(searchParams.toString());
		params.set("wallet", walletId);
		params.set("showWalletModal", "edit");
		router.replace(`${pathname}?${params.toString()}`);
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowDeleteDialog(true);
	};

	const handleConfirmDelete = async () => {
		try {
			const response = await fetch(`/api/wallets/${walletId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete wallet");
			}

			toast.success("Wallet deleted successfully");
			router.refresh();
		} catch (error) {
			console.error("Error deleting wallet:", error);
			toast.error("Failed to delete wallet");
		}
	};

	return (
		<>
			<div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
				<Button variant="ghost" size="icon" onClick={handleEdit} className="h-7 w-7">
					<Pencil className="h-3.5 w-3.5" />
				</Button>
				<Button variant="ghost" size="icon" onClick={handleDeleteClick} className="h-7 w-7">
					<Trash2 className="h-3.5 w-3.5" />
				</Button>
			</div>

			<ConfirmDialog
				isOpen={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
				onConfirm={handleConfirmDelete}
				title="Delete Wallet"
				description={`Are you sure you want to delete wallet "${walletName}"? This will also delete all assets in this wallet. This action cannot be undone.`}
				confirmText="Delete"
				cancelText="Cancel"
				destructive={true}
			/>
		</>
	);
}
