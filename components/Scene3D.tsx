
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const THEME = {
  blue: "#3B82F6",
  red: "#EF4444",
  cyan: "#22D3EE"
};

export const Scene3D: React.FC<{ slideIndex: number; slideCount: number }> = ({ slideIndex, slideCount }) => {
  const points = useRef<THREE.Points>(null!);
  const count = 3000;
  const { mouse } = useThree();
  const activeRef = useRef(true);

  useEffect(() => {
    const handleVisibility = () => { activeRef.current = !document.hidden; };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const formations = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const box = new Float32Array(count * 3);
    const plane = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = r * Math.cos(phi);

      box[i * 3] = (Math.random() - 0.5) * 15;
      box[i * 3 + 1] = (Math.random() - 0.5) * 15;
      box[i * 3 + 2] = (Math.random() - 0.5) * 6;

      plane[i * 3] = (Math.random() - 0.5) * 30;
      plane[i * 3 + 1] = (Math.random() - 0.5) * 20;
      plane[i * 3 + 2] = -5;

      colors[i*3] = 1; colors[i*3+1] = 1; colors[i*3+2] = 1;
    }
    return { sphere, box, plane, colors };
  }, [count]);

  useFrame((state) => {
    if (!activeRef.current || !points.current) return;

    const time = state.clock.getElapsedTime();
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    const cols = points.current.geometry.attributes.color.array as Float32Array;
    
    let formation;
    if (slideIndex === 0 || slideIndex === slideCount - 1) formation = formations.sphere;
    else if (slideIndex > 0 && slideIndex < 5) formation = formations.box;
    else formation = formations.plane;

    const targetColor = new THREE.Color();
    if (slideIndex < 3) targetColor.set(THEME.blue);
    else if (slideIndex >= 3 && slideIndex <= 6) targetColor.set(THEME.red);
    else targetColor.set(THEME.cyan);

    const step = 0.05;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += (formation[i3] - pos[i3]) * step;
      pos[i3+1] += (formation[i3+1] - pos[i3+1]) * step;
      pos[i3+2] += (formation[i3+2] - pos[i3+2]) * step;

      cols[i3] += (targetColor.r - cols[i3]) * 0.02;
      cols[i3+1] += (targetColor.g - cols[i3+1]) * 0.02;
      cols[i3+2] += (targetColor.b - cols[i3+2]) * 0.02;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
    
    state.camera.position.x += (mouse.x * 2 - state.camera.position.x) * 0.03;
    state.camera.position.y += (mouse.y * 2 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);

    points.current.rotation.y = time * 0.03;
  });

  return (
    <>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={formations.sphere} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={formations.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
};
