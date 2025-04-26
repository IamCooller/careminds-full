"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Create validation schema for asset
const formSchema = z.object({
	type: z.enum(["stock", "crypto"], {
		required_error: "Asset type is required",
	}),
	symbol: z.string().min(1, { message: "Symbol is required" }),
	name: z.string().min(1, { message: "Name is required" }),
	quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
	purchasePrice: z.coerce.number().positive({ message: "Purchase price must be positive" }),
	currentPrice: z.coerce.number().positive({ message: "Current price must be positive" }),
});

interface AssetModalProps {
	showModal: boolean;
	walletId: string;
	assetToEdit?: {
		id: string;
		type: "stock" | "crypto";
		symbol: string;
		name: string;
		quantity: number;
		purchasePrice: number;
		currentPrice: number;
	};
}

export function AssetModal({ showModal, walletId, assetToEdit }: AssetModalProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const isEditMode = !!assetToEdit;

	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: (assetToEdit?.type || "stock") as "stock" | "crypto",
			symbol: assetToEdit?.symbol || "",
			name: assetToEdit?.name || "",
			quantity: assetToEdit?.quantity || 0,
			purchasePrice: assetToEdit?.purchasePrice || 0,
			currentPrice: assetToEdit?.currentPrice || 0,
		},
	});

	// Update form when asset data changes
	useEffect(() => {
		if (assetToEdit) {
			form.reset({
				type: assetToEdit.type,
				symbol: assetToEdit.symbol,
				name: assetToEdit.name,
				quantity: assetToEdit.quantity,
				purchasePrice: assetToEdit.purchasePrice,
				currentPrice: assetToEdit.currentPrice,
			});
		} else {
			form.reset({
				type: "stock",
				symbol: "",
				name: "",
				quantity: 0,
				purchasePrice: 0,
				currentPrice: 0,
			});
		}
	}, [assetToEdit, form]);

	// Form submission handler
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setError(null);

		try {
			const url = isEditMode ? `/api/wallets/${walletId}/assets/${assetToEdit.id}` : `/api/wallets/${walletId}/assets`;
			const method = isEditMode ? "PATCH" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${isEditMode ? "update" : "create"} asset`);
			}

			toast.success(`Asset ${isEditMode ? "updated" : "created"} successfully!`);
			form.reset();
			// Close modal and refresh page
			router.push(`?wallet=${walletId}`);
			router.refresh();
		} catch (error) {
			console.error(`${isEditMode ? "Update" : "Create"} error:`, error);

			// Determine error text
			let errorMessage = "An error occurred. Please try again.";
			if (error instanceof Error) {
				errorMessage = error.message;
			}

			// Show error via toast
			toast.error(errorMessage);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	if (!showModal) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg max-w-xl w-full overflow-hidden">
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-medium">{isEditMode ? "Edit Asset" : "Add New Asset"}</h3>
						<Button variant="ghost" size="sm" onClick={() => router.push(`?wallet=${walletId}`)} className="h-8 w-8 p-0">
							<span className="sr-only">Close</span>
							<span className="text-xl">×</span>
						</Button>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Asset Type</FormLabel>
											<FormControl>
												<select
													className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
													{...field}
												>
													<option value="stock">Stock</option>
													<option value="crypto">Cryptocurrency</option>
												</select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="symbol"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Symbol</FormLabel>
											<FormControl>
												<Input placeholder="AAPL" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="Apple Inc." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="quantity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Quantity</FormLabel>
											<FormControl>
												<Input type="number" step="0.000001" min="0" placeholder="10" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="purchasePrice"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Purchase Price ($)</FormLabel>
											<FormControl>
												<Input type="number" step="0.01" min="0" placeholder="150.00" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="currentPrice"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Current Price ($)</FormLabel>
											<FormControl>
												<Input type="number" step="0.01" min="0" placeholder="155.00" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{error && <div className="text-red-500 text-sm">{error}</div>}

							<div className="flex justify-end space-x-4 pt-4">
								<Button type="button" variant="outline" onClick={() => router.push(`?wallet=${walletId}`)}>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{isEditMode ? "Updating..." : "Add Asset"}
										</>
									) : isEditMode ? (
										"Update Asset"
									) : (
										"Add Asset"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
