"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function CoolObject3D() {
  return (
    // ⬇️ bigger, responsive: 200px on mobile, 240px on md+
    <div className="size-[200px] md:size-[240px]">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }} // pulled back a touch for the bigger mesh
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight intensity={1.2} position={[2, 3, 2]} />
        <directionalLight intensity={0.5} position={[-2, -1, -2]} />
        <SpinningIcosahedron />
        <Environment preset="city" environmentIntensity={0.25} />
      </Canvas>
    </div>
  );
}

function SpinningIcosahedron() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.9;
    ref.current.rotation.x += dt * 0.35;
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      {/* ⬇️ slightly larger geometry to fill the new canvas nicely */}
      <icosahedronGeometry args={[1.15, 0]} />
      <meshStandardMaterial
        color="#c7d2fe"      // indigo-200
        metalness={0.8}
        roughness={0.2}
        emissive="#f0abfc"   // fuchsia-300
        emissiveIntensity={0.07}
      />
    </mesh>
  );
}
