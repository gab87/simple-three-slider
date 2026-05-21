import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SliderItem } from './SliderItem';
import { RippleEffect, RippleEffectImpl } from './Shaders/RippleEffect';
import { useRippleEffect } from './Hooks/useRippleEffect';
import { useSlideHover } from './Hooks/useSlideHover';
import {
  SlideDirection,
  DEFAULT_RIPPLE_INTENSITY,
  DEFAULT_RIPPLE_SPEED,
  PORTRAIT_ASPECT_RATIO,
  DEFAULT_GAP,
} from './Types';

const LERP_FACTOR = 0.08;
const DRAG_LERP_FACTOR = 0.45;
const FRICTION = 0.92;
const SNAP_VELOCITY_THRESHOLD = 0.3;
const INERTIA_SCALE = 15;
const CAMERA_Z = 2;
const CAMERA_FOV = 50;

interface SliderSceneProps {
  textures: (THREE.Texture | null)[];
  currentIndex: number;
  lastDirection: SlideDirection | null;
  rippleIntensity: number;
  rippleSpeed: number;
  grayscale: boolean;
  zoomed: boolean;
  gap: number;
  containerWidth: number;
  containerHeight: number;
  /** Shared ref: drag offset in pixels (from useFreeHand) */
  dragOffsetRef: React.MutableRefObject<number>;
  /** Shared ref: release velocity in px/ms */
  velocityRef: React.MutableRefObject<number>;
  /** Shared ref: whether user is currently dragging */
  isDraggingRef: React.MutableRefObject<boolean>;
  /** Callback when inertia settles — snaps to nearest index */
  onSnapToIndex: (index: number) => void;
}

/**
 * Converts a pixel value to Three.js world units based on camera and viewport.
 * @param params - Object with px value, viewport width in px, and visible width in world units
 * @returns World unit equivalent of the pixel value
 */
function pxToWorld({ px, viewportPx, visibleWidth }: { px: number; viewportPx: number; visibleWidth: number }): number {
  return (px / viewportPx) * visibleWidth;
}

/**
 * Internal Three.js scene containing slide items, camera animation, and ripple post-processing.
 * Supports grayscale/zoom hover effects and configurable gap.
 * @param props - Scene configuration including textures, navigation state, and effect parameters
 * @returns R3F scene with textured slides and post-processing effects
 */
export function SliderScene({
  textures,
  currentIndex,
  lastDirection,
  rippleIntensity = DEFAULT_RIPPLE_INTENSITY,
  rippleSpeed = DEFAULT_RIPPLE_SPEED,
  grayscale,
  zoomed,
  gap = DEFAULT_GAP,
  containerWidth,
  dragOffsetRef,
  velocityRef,
  isDraggingRef,
  onSnapToIndex,
}: SliderSceneProps): React.JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<RippleEffectImpl>(null);
  const prevIndexRef = useRef(currentIndex);

  const { size } = useThree();

  const { planeWidth, planeHeight, slideStep } = useMemo(() => {
    const fovRad = (CAMERA_FOV * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * CAMERA_Z;
    const visibleWidth = visibleHeight * (size.width / size.height);

    const pH = visibleHeight * 0.85;
    const pW = pH * PORTRAIT_ASPECT_RATIO;

    const gW = pxToWorld({ px: gap, viewportPx: containerWidth, visibleWidth });
    const step = pW + gW;

    return { planeWidth: pW, planeHeight: pH, slideStep: step };
  }, [size.width, size.height, gap, containerWidth]);

  const { hoveredIndex, onSlidePointerEnter, onSlidePointerLeave } = useSlideHover();

  const { triggerRipple, intensityRef, directionRef, timeRef } = useRippleEffect({
    intensity: rippleIntensity,
    speed: rippleSpeed,
  });

  useEffect(() => {
    if (prevIndexRef.current !== currentIndex && lastDirection) {
      triggerRipple(lastDirection);
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex, lastDirection, triggerRipple]);

  const inertiaOffsetRef = useRef(0);
  const settlingRef = useRef(false);
  const dragRippleFiredRef = useRef(false);

  useFrame(() => {
    if (!groupRef.current) return;

    const baseX = -currentIndex * slideStep;

    if (isDraggingRef.current) {
      const fovRad = (CAMERA_FOV * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(fovRad / 2) * CAMERA_Z;
      const visibleWidth = visibleHeight * (size.width / size.height);
      const dragWorld = (dragOffsetRef.current / containerWidth) * visibleWidth;

      const RIPPLE_DRAG_THRESHOLD = 5;
      if (!dragRippleFiredRef.current && Math.abs(dragOffsetRef.current) > RIPPLE_DRAG_THRESHOLD) {
        const direction: SlideDirection = dragOffsetRef.current < 0 ? 'right' : 'left';
        triggerRipple(direction);
        dragRippleFiredRef.current = true;
      }

      const targetX = baseX + dragWorld;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        DRAG_LERP_FACTOR,
      );
      inertiaOffsetRef.current = dragWorld;
      settlingRef.current = false;
    } else if (Math.abs(velocityRef.current) > SNAP_VELOCITY_THRESHOLD) {
      dragRippleFiredRef.current = false;
      settlingRef.current = true;
      velocityRef.current *= FRICTION;

      const fovRad = (CAMERA_FOV * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(fovRad / 2) * CAMERA_Z;
      const visibleWidth = visibleHeight * (size.width / size.height);
      inertiaOffsetRef.current += (velocityRef.current * INERTIA_SCALE / containerWidth) * visibleWidth;

      const targetX = baseX + inertiaOffsetRef.current;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        DRAG_LERP_FACTOR,
      );
    } else if (settlingRef.current) {
      dragRippleFiredRef.current = false;
      settlingRef.current = false;
      velocityRef.current = 0;

      const currentWorldX = groupRef.current.position.x;
      const nearestIndex = Math.round(-currentWorldX / slideStep);
      const clamped = Math.max(0, Math.min(nearestIndex, textures.length - 1));

      inertiaOffsetRef.current = 0;
      dragOffsetRef.current = 0;
      onSnapToIndex(clamped);
    } else {
      inertiaOffsetRef.current = 0;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        baseX,
        LERP_FACTOR,
      );
    }

    if (rippleRef.current) {
      rippleRef.current.intensity = intensityRef.current;
      rippleRef.current.direction = directionRef.current;
      rippleRef.current.time = timeRef.current;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {textures.map((texture, index) => (
          <group
            key={index}
            onPointerEnter={onSlidePointerEnter(index)}
            onPointerLeave={onSlidePointerLeave}
          >
            <SliderItem
              texture={texture}
              positionX={index * slideStep}
              width={planeWidth}
              height={planeHeight}
              isHovered={hoveredIndex === index}
              grayscale={grayscale}
              zoomed={zoomed}
            />
          </group>
        ))}
      </group>
      <EffectComposer>
        <RippleEffect
          ref={rippleRef}
          intensityRef={intensityRef}
          directionRef={directionRef}
          timeRef={timeRef}
        />
      </EffectComposer>
    </>
  );
}
