
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const THEME = {
  blue: "#3B82F6",
  gold: "#F59E0B",
  red: "#EF4444",
  cyan: "#22D3EE"
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const Scene3D: React.FC<{ slideIndex: number; slideCount: number }> = ({ slideIndex, slideCount }) => {
  const points = useRef<THREE.Points>(null!);
  const count = isMobile ? 1500 : 4000;
  const { mouse } = useThree();
  const activeRef = useRef(true);

  // Stop animation if tab is hidden
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
      const r = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = r * Math.cos(phi);

      box[i * 3] = (Math.random() - 0.5) * 12;
      box[i * 3 + 1] = (Math.random() - 0.5) * 12;
      box[i * 3 + 2] = (Math.random() - 0.5) * 4;

      plane[i * 3] = (Math.random() - 0.5) * 25;
      plane[i * 3 + 1] = (Math.random() - 0.5) * 15;
      plane[i * 3 + 2] = -5;

      colors[i*3] = 1; colors[i*3+1] = 1; colors[i*3+2] = 1;
    }
    return { sphere, box, plane, colors };
  }, [count]);

  useFrame((state) => {
    // Safety check: ensure component is visible and ref is initialized
    if (!activeRef.current || !points.current || !points.current.geometry) return;

    const time = state.clock.getElapsedTime();
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    const cols = points.current.geometry.attributes.color.array as Float32Array;
    
    let formation;
    if (slideIndex === 0 || slideIndex === slideCount - 1) formation = formations.sphere;
    else if (slideIndex > 0 && slideIndex < 4) formation = formations.box;
    else formation = formations.plane;

    const targetColor = new THREE.Color();
    if (slideIndex < 2) targetColor.set(THEME.blue);
    else if (slideIndex >= 3 && slideIndex <= 5) targetColor.set(THEME.red);
    else targetColor.set(THEME.cyan);

    // Optimized lerp loop
    const step = isMobile ? 0.04 : 0.08;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += (formation[i3] - pos[i3]) * step;
      pos[i3+1] += (formation[i3+1] - pos[i3+1]) * step;
      pos[i3+2] += (formation[i3+2] - pos[i3+2]) * step;

      if (!isMobile) {
        cols[i3] += (targetColor.r - cols[i3]) * 0.02;
        cols[i3+1] += (targetColor.g - cols[i3+1]) * 0.02;
        cols[i3+2] += (targetColor.b - cols[i3+2]) * 0.02;
      }
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    if (!isMobile) points.current.geometry.attributes.color.needsUpdate = true;
    
    state.camera.position.x += (mouse.x * 1.5 - state.camera.position.x) * 0.05;
    state.camera.position.y += (mouse.y * 1.5 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);

    points.current.rotation.y = time * 0.02;
  });

  return (
    <>
      <Stars radius={120} depth={40} count={isMobile ? 1000 : 2500} factor={4} saturation={0} fade speed={0.5} />
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={formations.sphere} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={formations.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={isMobile ? 0.05 : 0.035} vertexColors transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
};
