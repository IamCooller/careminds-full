import LoadingSpinner from "@/components/ui/LoadingSpinner";
import React from "react";

const Loading = () => {
	return (
		<div className="flex justify-center items-center h-screen">
			<LoadingSpinner />
		</div>
	);
};

export default Loading;
