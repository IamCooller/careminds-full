import { auth } from "@/auth";
import Link from "next/link";
import SignOut from "./sign-out";

export default async function Navbar() {
	const session = await auth();
	if (!session) {
		return null;
	}

	return (
		<nav className="bg-gray-900 shadow">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/dashboard" className="text-xl font-bold text-indigo-600">
								Careminds
							</Link>
						</div>
					</div>
					<div className="flex items-center">
						<div className="flex items-center space-x-4">
							<span className="text-sm text-white">{session.user?.name || session.user?.email}</span>
							<SignOut />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
