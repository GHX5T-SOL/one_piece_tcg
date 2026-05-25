import React from 'react';
import {Canvas} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';

const CardMesh: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const x = (index - 2.5) * 1.35;
  const y = Math.sin((frame + index * 19) / 42) * 0.22;
  const z = -2.2 - index * 0.12;
  const hue = index % 3 === 0 ? '#12c7b8' : index % 3 === 1 ? '#f2c14e' : '#e54b4b';
  const materialProps = {
    color: hue,
    roughness: 0.32,
    metalness: 0.82,
    emissive: hue,
    emissiveIntensity: 0.12,
  } as Record<string, unknown>;
  return (
    <mesh
      position={[x, y, z]}
      rotation={[0.18 + Math.sin(frame / 90 + index) * 0.08, frame / 160 + index * 0.18, -0.08 + index * 0.025]}
    >
      <boxGeometry args={[0.82, 1.16, 0.035]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};

export const ThreeCardField: React.FC<{opacity?: number}> = ({opacity = 0.26}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <div className="three-field" style={{opacity, width, height}}>
      <Canvas
        gl={{preserveDrawingBuffer: true, antialias: true}}
        camera={{position: [0, 0.35, 3.8], fov: 46}}
      >
        <ambientLight intensity={0.65} />
        <pointLight position={[2.5, 3, 4]} intensity={2.2} color="#f2c14e" />
        <pointLight position={[-3, -1, 3]} intensity={1.35} color="#12c7b8" />
        {Array.from({length: 6}).map((_, index) => (
          <CardMesh key={index} index={index} frame={frame} />
        ))}
      </Canvas>
    </div>
  );
};
