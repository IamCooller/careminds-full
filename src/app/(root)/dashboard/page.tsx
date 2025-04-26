import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateWalletStats } from "@/lib/calculations";
import Link from "next/link";
import { PortfolioDisplay } from "./_components/sections/PortfolioDisplay";
import { WalletModal } from "./_components/modals/WalletModal";
import { AssetModal } from "./_components/modals/AssetModal";
import { WalletWithStats } from "@/types";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
	const session = await auth();
	const { wallet, showWalletModal, showAssetModal, assetId } = await searchParams;
	// Check if user is authenticated
	if (!session || !session.user) {
		redirect("/login");
	}

	// Fetch all user wallets from the database
	const wallets = await prisma.wallet.findMany({
		where: {
			userId: session.user.id,
		},
		include: {
			assets: true,
		},
	});

	// Calculate statistics for each wallet
	const walletsWithStats: WalletWithStats[] = wallets.map((wallet) => {
		const stats = calculateWalletStats(wallet);
		return {
			...wallet,
			currentAmount: stats.totalValue,
			spentAmount: stats.totalCost,
			profitLoss: stats.totalProfitLoss,
			assets: wallet.assets.map((asset) => ({
				...asset,
				type: asset.type as "stock" | "crypto",
			})),
		};
	});

	// Get the selected wallet
	const walletId = Array.isArray(wallet) ? wallet[0] : wallet;
	const selectedWalletId = (walletId || (walletsWithStats.length > 0 ? walletsWithStats[0].id : "")) as string;
	const selectedWallet = walletsWithStats.find((w) => w.id === selectedWalletId);

	// Get the asset to edit if assetId is provided
	let assetToEdit;
	const assetIdStr = Array.isArray(assetId) ? assetId[0] : assetId;
	if (assetIdStr && selectedWallet) {
		assetToEdit = selectedWallet.assets.find((a) => a.id === assetIdStr);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8 flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-white">Welcome, {session.user.name || session.user.email}</h1>
					<p className="mt-2 text-gray-400">Here&apos;s an overview of your investment portfolios</p>
				</div>
				<div className="flex space-x-4">
					<WalletModal showModal={!!showWalletModal} walletToEdit={showWalletModal === "edit" && selectedWallet ? { id: selectedWallet.id, name: selectedWallet.name } : undefined} />
				</div>
			</div>

			{walletsWithStats.length === 0 ? (
				<div className="text-center py-12">
					<h3 className="text-lg font-medium text-white">No wallets yet</h3>
					<p className="mt-2 text-gray-400">Create your first wallet to start tracking your investments</p>
					<Link href="?showWalletModal=true">
						<button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Create Wallet
						</button>
					</Link>
				</div>
			) : (
				<section>
					<div className="container py-4">
						<div className="border border-gray-400 rounded-xl overflow-hidden">
							<div className="px-6 py-4 bg-[#1F2226] text-white text-2xl font-bold flex justify-between items-center">
								<span>Investment Portfolio</span>
							</div>
							<PortfolioDisplay portfolio={walletsWithStats} walletId={selectedWalletId} />
						</div>
					</div>
				</section>
			)}

			{selectedWalletId && <AssetModal showModal={!!showAssetModal} walletId={selectedWalletId} assetToEdit={assetToEdit} />}
		</div>
	);
}
