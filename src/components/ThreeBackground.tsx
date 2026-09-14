import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// GLSL Shaders for Fluid Liquid Effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Aspect ratio correction for pointer distance
    vec2 pointer = uPointer;
    pointer.x *= uResolution.x / uResolution.y;
    vec2 p_uv = uv;
    p_uv.x *= uResolution.x / uResolution.y;
    
    float dist = distance(p_uv, pointer);
    
    // Slow fluid flow field
    vec2 flow = vec2(
      snoise(uv * 2.0 + uTime * 0.05),
      snoise(uv * 2.0 + uTime * 0.06 + 10.0)
    );
    
    // Mouse influence (pushes fluid away)
    float mouseInfluence = smoothstep(0.4, 0.0, dist);
    vec2 mouseForce = (p_uv - pointer) * mouseInfluence * 0.4;
    
    // Distorted UVs
    vec2 distortedUv = uv + flow * 0.15 - mouseForce;
    
    // Layered noise for organic look
    float n1 = snoise(distortedUv * 2.5 - uTime * 0.1);
    float n2 = snoise(distortedUv * 5.0 + uTime * 0.05);
    
    float intensity = smoothstep(0.0, 1.0, n1 * 0.6 + n2 * 0.4 + 0.5);
    intensity += mouseInfluence * 0.3; // Light up near cursor
    
    // Colors
    vec3 colorBase = vec3(0.02, 0.02, 0.06); // Dark blue/black
    vec3 colorDeep = vec3(0.05, 0.1, 0.3); // Deep blue
    vec3 colorMid = vec3(0.4, 0.2, 0.8); // Purple
    vec3 colorHigh = vec3(0.0, 0.8, 1.0); // Cyan
    
    vec3 finalColor = mix(colorBase, colorDeep, smoothstep(0.1, 0.4, intensity));
    finalColor = mix(finalColor, colorMid, smoothstep(0.4, 0.7, intensity));
    finalColor = mix(finalColor, colorHigh, smoothstep(0.7, 1.0, intensity));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const FluidMaterial = shaderMaterial(
  {
    uTime: 0,
    uPointer: new THREE.Vector2(0.5, 0.5),
    uResolution: new THREE.Vector2(1, 1),
  },
  vertexShader,
  fragmentShader
);

extend({ FluidMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      fluidMaterial: any;
    }
  }
}

function FluidPlane() {
  const materialRef = useRef<any>();
  const { size, viewport } = useThree();
  
  // Convert mouse to normalized 0-1 coordinates for the shader
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      
      // Lerp mouse for smoothness
      materialRef.current.uPointer.lerp(mouse.current, 0.1);
      
      materialRef.current.uResolution.set(size.width, size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <fluidMaterial ref={materialRef} />
    </mesh>
  );
}

export function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 2]}>
        <FluidPlane />
      </Canvas>
    </div>
  );
}
