import React from "react";
import { Sphere, Environment } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";

import * as THREE from "three";

const Background = () => {
	return (
		<>
			<Environment
				resolution={256}
				background
			>
				<Sphere
					scale={[100, 100, 100]}
					rotation-y={Math.PI / 2}
				>
					<LayerMaterial
						color={"#ffffff"}
						side={THREE.BackSide}
					>
						<Gradient
							colorA={"#357ca1"}
							colorB={"#ffffff"}
							axes="y"
							start={0}
							end={-0.5}
						/>
					</LayerMaterial>
				</Sphere>
			</Environment>
		</>
	);
};

export default Background;
