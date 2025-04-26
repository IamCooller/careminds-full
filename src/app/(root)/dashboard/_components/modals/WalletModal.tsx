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

// Create validation schema for wallet
const formSchema = z.object({
	name: z.string().min(2, { message: "Wallet name must be at least 2 characters" }),
});

interface WalletModalProps {
	showModal: boolean;
	walletToEdit?: { id: string; name: string };
}

export function WalletModal({ showModal, walletToEdit }: WalletModalProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const isEditMode = !!walletToEdit;

	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: walletToEdit?.name || "",
		},
	});

	// Update form when wallet data changes
	useEffect(() => {
		if (walletToEdit) {
			form.reset({ name: walletToEdit.name });
		} else {
			form.reset({ name: "" });
		}
	}, [walletToEdit, form]);

	// Form submission handler
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		setError(null);

		try {
			const url = isEditMode ? `/api/wallets/${walletToEdit.id}` : "/api/wallets";
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
				throw new Error(data.error || `Failed to ${isEditMode ? "update" : "create"} wallet`);
			}

			const result = await response.json();

			toast.success(`Wallet ${isEditMode ? "updated" : "created"} successfully!`);
			form.reset();
			// Close modal and refresh page
			if (showModal) {
				router.push(window.location.pathname);
			}
			router.refresh();

			// If we created a new wallet, select it
			if (!isEditMode && result?.id) {
				router.push(`?wallet=${result.id}`);
			}
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
			<div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-medium">{isEditMode ? "Edit Wallet" : "Create New Wallet"}</h3>
						<Button variant="ghost" size="sm" onClick={() => router.push(`?${walletToEdit ? `wallet=${walletToEdit.id}` : ""}`)} className="h-8 w-8 p-0">
							<span className="sr-only">Close</span>
							<span className="text-xl">×</span>
						</Button>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Wallet Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter wallet name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{error && <div className="text-red-500 text-sm">{error}</div>}

							<div className="flex justify-end space-x-4">
								<Button type="button" variant="outline" onClick={() => router.push(`?${walletToEdit ? `wallet=${walletToEdit.id}` : ""}`)}>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{isEditMode ? "Updating..." : "Creating..."}
										</>
									) : isEditMode ? (
										"Update Wallet"
									) : (
										"Create Wallet"
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
