import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DataWave() {
  const ref = useRef<THREE.Points>(null);
  const count = 10000;
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const index = (i * 100 + j) * 3;
        p[index] = (i - 50) * 0.4; // x
        p[index + 1] = 0; // y 
        p[index + 2] = (j - 50) * 0.4; // z
      }
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const posAttribute = ref.current.geometry.attributes.position;
    const posArray = posAttribute.array as Float32Array;
    
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        const index = (i * 100 + j) * 3;
        const x = posArray[index];
        const z = posArray[index + 2];
        // Calculate y based on sine waves for a fluid topological effect
        posArray[index + 1] = Math.sin(x * 0.3 + time * 0.5) * Math.cos(z * 0.3 + time * 0.5) * 1.5;
      }
    }
    posAttribute.needsUpdate = true;
    
    // Smoothly tilt and rotate based on mouse position
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, (state.pointer.x * 0.3), 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 1.2 + (state.pointer.y * 0.3), 0.05);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00FF41"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
      <Canvas camera={{ position: [0, 2, 8], fov: 75 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#050505', 3, 12]} />
        <DataWave />
      </Canvas>
    </div>
  );
}
