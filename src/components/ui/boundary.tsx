import clsx from "clsx";
import React from "react";

const Label = ({ children, animateRerendering, color }: { children: React.ReactNode; animateRerendering?: boolean; color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange" }) => {
	return (
		<div
			className={clsx("rounded-full px-1.5 border shadow-[0_0_1px_3px_black]", {
				"bg-gray-800 text-gray-300": color === "default",
				"bg-pink-500 text-white": color === "pink",
				"bg-blue-500 text-white": color === "blue",
				"bg-cyan-500 text-white": color === "cyan",
				"bg-violet-500 text-violet-100": color === "violet",
				"bg-orange-500 text-white": color === "orange",
				"animate-[highlight_1s_ease-in-out_1]": animateRerendering,
			})}
		>
			{children}
		</div>
	);
};
const Boundary = ({
	children,
	labels = ["children"],
	size = "default",
	color = "default",
	animateRerendering = true,
}: {
	children: React.ReactNode;
	labels?: string[];
	size?: "small" | "default";
	color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange";
	animateRerendering?: boolean;
}) => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-black/40">
			<div
				className={clsx("relative  rounded-lg border max-w-xl m-auto border-dashed bg-white", {
					"p-3 lg:p-5": size === "small",
					"p-4 lg:p-9": size === "default",
					"border-gray-700": color === "default",
					"border-pink-500": color === "pink",
					"border-blue-500": color === "blue",
					"border-cyan-500": color === "cyan",
					"border-violet-500": color === "violet",
					"border-orange-500": color === "orange",
					"text-pink-500 animate-[rerender_1s_ease-in-out_1]": animateRerendering,
				})}
			>
				<div
					className={clsx("absolute -top-2.5 text-blue-dark flex gap-x-1 text-[9px] uppercase leading-4 tracking-widest", {
						"left-3 lg:left-5": size === "small",
						"left-4 lg:left-9": size === "default",
					})}
				>
					{labels.map((label) => {
						return (
							<Label key={label} color={color} animateRerendering={animateRerendering}>
								{label}
							</Label>
						);
					})}
				</div>

				{children}
			</div>
		</div>
	);
};

export default Boundary;
