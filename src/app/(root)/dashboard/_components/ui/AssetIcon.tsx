"use client";

import React, { useState } from "react";
import Image from "next/image";

type AssetIconProps = {
	symbol: string;
	size?: number;
	className?: string;
};

export function AssetIcon({ symbol, size = 20, className = "" }: AssetIconProps) {
	const [imageError, setImageError] = useState(false);

	const getAssetIconPath = (symbol: string): string => {
		return `/icons/${symbol.toLowerCase()}.svg`;
	};

	const getFallbackText = (symbol: string): string => {
		// Get the first two letters of the symbol, uppercase
		return symbol.substring(0, 2).toUpperCase();
	};

	return (
		<div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${className}`}>
			{!imageError ? (
				<Image src={getAssetIconPath(symbol)} alt={`${symbol} icon`} width={size} height={size} className="object-contain" onError={() => setImageError(true)} />
			) : (
				<div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{getFallbackText(symbol)}</div>
			)}
		</div>
	);
}
