import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image, OrbitControls } from "@react-three/drei";
import { easing } from "maath";
import "./util";
function Model() {
  return (
    <Canvas className="" camera={{ position: [0, 0, 20], fov: 15 }}>
      <color attach="background" args={["white"]} />
      <Scene />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        autoRotate={true}
        autoRotateSpeed={7}
        minDistance={10}
        maxDistance={10}
        // Adjusted polar angles for better viewing experience:
        // maxPolarAngle: Allows viewing from slightly higher up (about 52 degrees from horizontal)
        // minPolarAngle: Allows viewing from slightly lower down (about 42 degrees from horizontal)
        // This range provides a good balance between seeing the cards' faces and maintaining
        // the carousel's visual coherence
        maxPolarAngle={Math.PI / 1.9}
        minPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}

function Scene() {
  const sceneRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;

    // Create a smooth, organic movement by combining different frequencies
    // Using sine waves for smooth oscillation
    // Small multipliers keep the movement subtle
    // Different frequencies create a more natural, non-repetitive feel
    const xRotation = Math.sin(time.current * 0.4) * 0.03; // Slow X axis wobble
    const yRotation = Math.cos(time.current * 0.3) * 0.02; // Even slower Y axis drift
    const zRotation = Math.sin(time.current * 0.2) * 0.01 + 0.15; // Very slow Z axis movement + base tilt

    // Apply the combined rotations for a fluid, continuous movement
    sceneRef.current.rotation.x = xRotation;
    sceneRef.current.rotation.y = yRotation;
    sceneRef.current.rotation.z = zRotation;
  });

  return (
    <group ref={sceneRef}>
      <Carousel />
    </group>
  );
}

function Carousel({ radius = 1.4, count = 5 }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={`../.../landingimgs/${i + 1}.jpg`}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

function Card({ url, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(
      ref.current.material,
      "radius",
      hovered ? 0.25 : 0.1,
      0.2,
      delta
    );
    easing.damp(ref.current.material, "zoom", hovered ? 1 : 1.5, 0.2, delta);
  });
  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

export default Model;
