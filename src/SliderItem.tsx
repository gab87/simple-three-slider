import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SliderItemProps } from './Types';

const FALLBACK_COLOR = '#222222';
const ZOOM_SCALE = 1.15;
const LERP_SPEED = 0.08;
const GRAYSCALE_LERP_SPEED = 0.06;

const GRAYSCALE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GRAYSCALE_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uGrayscale;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 gray = vec3(luminance);
    gl_FragColor = vec4(mix(color.rgb, gray, uGrayscale), color.a);
  }
`;

/**
 * Renders a single slide as a textured 3D plane with grayscale and zoom effects.
 * Grayscale is animated via shader uniform; zoom via mesh scale with UV clamping.
 * @param props - Slide item properties including texture, positioning, and effects
 * @returns A Three.js group containing the slide mesh
 */
export function SliderItem({
  texture,
  positionX,
  width,
  height,
  isHovered,
  grayscale,
  zoomed,
}: SliderItemProps): React.JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const grayscaleRef = useRef(grayscale ? 1 : 0);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uGrayscale: { value: grayscale ? 1 : 0 },
    }),
    [],
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const targetGray = grayscale && !isHovered ? 1 : 0;
    grayscaleRef.current = THREE.MathUtils.lerp(
      grayscaleRef.current,
      targetGray,
      GRAYSCALE_LERP_SPEED,
    );
    uniforms.uGrayscale.value = grayscaleRef.current;

    if (zoomed) {
      const targetScale = isHovered ? ZOOM_SCALE : 1;
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        targetScale,
        LERP_SPEED,
      );
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        targetScale,
        LERP_SPEED,
      );
    }
  });

  if (texture) {
    uniforms.uTexture.value = texture;
  }

  return (
    <group position={[positionX, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        {texture ? (
          <shaderMaterial
            vertexShader={GRAYSCALE_VERTEX_SHADER}
            fragmentShader={GRAYSCALE_FRAGMENT_SHADER}
            uniforms={uniforms}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial color={FALLBACK_COLOR} />
        )}
      </mesh>
    </group>
  );
}
