import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<section className=" relative  bg-dark-secondary">
			<div className="container flex h-svh flex-col text-primary justify-center items-center">
				<div className=" mb-7 text-3xl">Opps! We couldn’t find that page...</div>
				<h1 className="text-8xl font-bold mb-8 md:mb-14">404</h1>
				<Button className="w-[200px]">
					<Link href="/" title="Go back to Home">
						Home Page
					</Link>
				</Button>
			</div>
		</section>
	);
}
