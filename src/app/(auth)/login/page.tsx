import Link from "next/link";
import AuthForm from "./_components/ui/auth-form";

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center ">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
							Sign up
						</Link>
					</p>
				</div>

				<AuthForm />
			</div>
		</div>
	);
}
