import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { SlideDirection, DEFAULT_RIPPLE_INTENSITY, DEFAULT_RIPPLE_SPEED } from '../Types';

interface UseRippleEffectParams {
  /** Maximum ripple intensity */
  intensity: number;
  /** Ripple decay speed factor */
  speed: number;
}

interface UseRippleEffectReturn {
  /** Trigger a ripple in the given direction */
  triggerRipple: (direction: SlideDirection) => void;
  /** Ref to current ripple intensity uniform */
  intensityRef: React.MutableRefObject<number>;
  /** Ref to current ripple direction uniform (-1 or 1) */
  directionRef: React.MutableRefObject<number>;
  /** Ref to elapsed time since last ripple trigger */
  timeRef: React.MutableRefObject<number>;
}

const DIRECTION_MAP: Record<SlideDirection, number> = {
  left: 1,
  right: -1,
};

/**
 * Manages ripple distortion state with frame-based decay animation.
 * The ripple triggers in the opposite direction of the slide movement.
 * @param params - Configuration for ripple intensity and speed
 * @returns Ripple trigger function and uniform refs for shader consumption
 */
export function useRippleEffect({
  intensity = DEFAULT_RIPPLE_INTENSITY,
  speed = DEFAULT_RIPPLE_SPEED,
}: UseRippleEffectParams): UseRippleEffectReturn {
  const intensityRef = useRef(0);
  const directionRef = useRef(0);
  const timeRef = useRef(0);
  const activeRef = useRef(false);

  /**
   * Triggers a ripple effect in the opposite direction of the slide.
   * @param direction - The direction of the slide ('left' or 'right')
   */
  const triggerRipple = useCallback(
    (direction: SlideDirection) => {
      intensityRef.current = intensity;
      directionRef.current = DIRECTION_MAP[direction];
      timeRef.current = 0;
      activeRef.current = true;
    },
    [intensity],
  );

  useFrame((_, delta) => {
    if (!activeRef.current) return;

    timeRef.current += delta;
    intensityRef.current = intensity * Math.exp(-timeRef.current * speed);

    const DECAY_THRESHOLD = 0.001;
    if (intensityRef.current < DECAY_THRESHOLD) {
      intensityRef.current = 0;
      activeRef.current = false;
    }
  });

  return {
    triggerRipple,
    intensityRef,
    directionRef,
    timeRef,
  };
}
