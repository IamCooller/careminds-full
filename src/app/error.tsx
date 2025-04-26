"use client";

import React from "react";
import Boundary from "@/components/ui/boundary";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	React.useEffect(() => {
		console.error("logging error:", error);
	}, [error]);

	return (
		<Boundary labels={["./error.tsx"]} color="pink">
			<div className="space-y-4">
				<h2 className="text-lg font-bold">Error</h2>
				<p className="text-sm">{error?.message}</p>
				<div>
					<button className="button" onClick={() => reset()}>
						Try Again
					</button>
				</div>
			</div>
		</Boundary>
	);
}
