import {
	Float,
	Line,
	OrbitControls,
	PerspectiveCamera,
	Text,
	useScroll,
} from "@react-three/drei";
import React, { useMemo } from "react";
import Background from "../Background";
import { Airplane } from "../Airplane";
import { Cloud } from "../Cloud";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import TextSection from "../TextSection";

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008,
	CURVE_AHEAD_AIRPLANE = 0.02,
	AIRPLANE_MAX_ANGLE = 35,
	FRICTION_DISTANCE = 42;

const Experience = () => {
	const curvePoints = React.useMemo(
		() => [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 0, -CURVE_DISTANCE),
			new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
			new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
			new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
			new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
			new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
			new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
		],
		[]
	);

	const curve = React.useMemo(() => {
		return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
	}, []);

	// const linePoints = React.useMemo(() => {
	// 	return curve.getPoints(LINE_NB_POINTS);
	// }, [curve]);

	const shape = React.useMemo(() => {
		const shape = new THREE.Shape();
		shape.moveTo(0, -0.08);
		shape.lineTo(0, 0.08);

		return shape;
	}, [curve]);

	const cameraGroup = React.useRef();
	const cameraRail = React.useRef();

	const scroll = useScroll();

	const textSections = useMemo(() => {
		return [
			{
				cameraRailDist: -1,
				position: new THREE.Vector3(
					curvePoints[1].x - 3,
					curvePoints[1].y,
					curvePoints[1].z
				),
				title: `Hi, I'm Tam!`,
				subtitle: `I'm a Full-Stack Engineer. I'm a dedicated, hard-working team player with experience and excellent knowledge of cutting-edge up-to-date web engineering technologies like JavaScript, TypeScript, Python, C#, SQL, and NoSQL.`,
			},
			{
				cameraRailDist: 1.5,
				position: new THREE.Vector3(
					curvePoints[2].x + 1,
					curvePoints[2].y,
					curvePoints[2].z
				),
				title: `Stacks & Skills`,
				subtitle: `I spend most of the time in design, development, research and working with teams and companies from different regions a day. This made me skilled in various tools, languages, frameworks and stacks. I built softwares to launch in production using these skills. I build plugins, tools and packages for me and my teams. These are some stacks I usually work on,`,
			},
		];
	});

	useFrame((_state, delta) => {
		const scrollOffset = Math.max(0, scroll.offset);

		// LOOK TO CLOSE TEXT SECTIONS
		textSections.forEach((textSection) => {
			const distance = textSection.position.distanceTo(
				cameraGroup.current.position
			);

			if (distance < FRICTION_DISTANCE) {
				const targetCameraRailPosition = new THREE.Vector3(
					(1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
					0,
					0
				);
				cameraRail.current.position.lerp(targetCameraRailPosition, delta);
			}
		});

		const curPoint = curve.getPoint(scrollOffset);

		// Follow the curve points
		cameraGroup.current.position.lerp(curPoint, delta * 24);

		const lookAtPoint = curve.getPoint(
			Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
		);

		const currentLookAt = cameraGroup.current.getWorldDirection(
			new THREE.Vector3()
		);

		const targetLootAt = new THREE.Vector3()
			.subVectors(curPoint, lookAtPoint)
			.normalize();

		const lookAt = currentLookAt.lerp(targetLootAt, delta * 24);

		cameraGroup.current.lookAt(
			cameraGroup.current.position.clone().add(lookAt)
		);

		const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);
		const nonLerpLookAt = new THREE.Group();
		nonLerpLookAt.position.copy(curPoint);
		nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLootAt));

		tangent.applyAxisAngle(
			new THREE.Vector3(0, 1, 0),
			-nonLerpLookAt.rotation.y
		);

		let angle = Math.atan2(-tangent.z, tangent.x);
		angle = -Math.PI / 2 + angle;

		let angleDegrees = (angle * 180) / Math.PI;
		angleDegrees *= 2.4; // stronger angle

		if (angleDegrees < 0)
			angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
		if (angleDegrees > 0)
			angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);

		// SET BACK ANGLE
		angle = (angleDegrees * Math.PI) / 180;

		const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				airplane.current.rotation.x,
				airplane.current.rotation.y,
				angle
			)
		);

		airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
	});

	const airplane = React.useRef();

	return (
		<>
			<directionalLight
				position={[0, 3, 1]}
				intensity={0.1}
			/>
			{/* <OrbitControls enableZoom={false} /> */}
			<group ref={cameraGroup}>
				<Background />
				<group ref={cameraRail}>
					<PerspectiveCamera
						position={[0, 0, 5]}
						fov={30}
						makeDefault
					/>
				</group>
				{/* Floating Airplane */}
				<group ref={airplane}>
					<Float
						floatIntensity={1}
						speed={1.5}
						rotationIntensity={0.5}
					>
						<Airplane
							rotation-y={Math.PI / 2}
							scale={[0.2, 0.2, 0.2]}
							position-y={-0.1}
						/>
					</Float>
				</group>
			</group>

			{/* TEXT */}
			{textSections?.map((textSection, index) => (
				<TextSection
					{...textSection}
					key={index}
				/>
			))}

			{/* Line / Path to follow */}
			<group position-y={-2}>
				{/* <Line
					points={linePoints}
					color={"#ffffff"}
					opacity={0.7}
					transparent
					lineWidth={16}
				/> */}

				<mesh>
					<extrudeGeometry
						args={[
							shape,
							{
								steps: LINE_NB_POINTS,
								bevelEnabled: false,
								extrudePath: curve,
							},
						]}
					/>
					<meshStandardMaterial
						color={"#ffffff"}
						opacity={1}
						transparent
					/>
				</mesh>
			</group>

			{/* Clouds */}
			<Cloud
				opacity={0.5}
				scale={[0.3, 0.3, 0.3]}
				position={[-2, 1, -3]}
			/>
			<Cloud
				opacity={0.5}
				scale={[0.2, 0.3, 0.4]}
				position={[1.5, -0.5, -2]}
			/>
			<Cloud
				opacity={0.7}
				scale={[0.3, 0.3, 0.4]}
				position={[2, -0.2, -2]}
				rotation-y={Math.PI / 9}
			/>
		</>
	);
};

export default Experience;
