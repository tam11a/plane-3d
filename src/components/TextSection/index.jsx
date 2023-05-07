import { Text } from "@react-three/drei";
import React from "react";

const TextSection = ({ title, subtitle, ...props }) => {
	return (
		<group {...props}>
			{!!title && (
				<Text
					color={"#ffffff"}
					anchorX={"left"}
					anchorY={"bottom"}
					fontSize={0.3}
					maxWidth={2.5}
					lineHeight={1.6}
					font="./fonts/Ubuntu/Ubuntu-Bold.ttf"
				>
					{title}
				</Text>
			)}
			<Text
				color={"#ffffff"}
				anchorX={"left"}
				anchorY={"top"}
				fontSize={0.13}
				maxWidth={2.5}
				font="./fonts/Ubuntu/Ubuntu-Medium.ttf"
			>
				{subtitle}
			</Text>
		</group>
	);
};

export default TextSection;
