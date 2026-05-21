import { useRef, useCallback } from 'react';

const DRAG_THRESHOLD = 3;
const VELOCITY_SAMPLES = 5;

interface UseFreeHandParams {
  /** Whether freehand dragging is enabled */
  enabled: boolean;
  /** Shared ref for drag offset in pixels (read by SliderScene) */
  dragOffsetRef: React.MutableRefObject<number>;
  /** Shared ref for release velocity in px/ms (read by SliderScene) */
  velocityRef: React.MutableRefObject<number>;
  /** Shared ref for dragging state (read by SliderScene) */
  isDraggingRef: React.MutableRefObject<boolean>;
}

interface UseFreeHandReturn {
  /** Pointer down handler */
  onPointerDown: (e: React.PointerEvent) => void;
  /** Pointer move handler */
  onPointerMove: (e: React.PointerEvent) => void;
  /** Pointer up handler */
  onPointerUp: () => void;
}

/**
 * Manages pointer-based drag scrolling (freeHand mode) for the slider.
 * Updates shared refs in real-time so the render loop can track the cursor smoothly.
 * Computes release velocity for momentum/inertia after pointer up.
 * @param params - Configuration and shared refs for drag behavior
 * @returns Pointer event handlers
 */
export function useFreeHand({
  enabled,
  dragOffsetRef,
  velocityRef,
  isDraggingRef,
}: UseFreeHandParams): UseFreeHandReturn {
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const samplesRef = useRef<number[]>([]);
  const hasDraggedRef = useRef(false);

  /**
   * Handles pointer down to initiate drag.
   */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;

      isDraggingRef.current = true;
      velocityRef.current = 0;
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      lastXRef.current = e.clientX;
      lastTimeRef.current = performance.now();
      dragOffsetRef.current = 0;
      samplesRef.current = [];
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [enabled, isDraggingRef, velocityRef, dragOffsetRef],
  );

  /**
   * Handles pointer move to update drag offset and track velocity samples.
   */
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || !isDraggingRef.current) return;

      const now = performance.now();
      const deltaX = e.clientX - startXRef.current;
      const instantVelocity = (e.clientX - lastXRef.current) / Math.max(now - lastTimeRef.current, 1);

      if (Math.abs(deltaX) > DRAG_THRESHOLD) {
        hasDraggedRef.current = true;
      }

      dragOffsetRef.current = deltaX;

      samplesRef.current.push(instantVelocity);
      if (samplesRef.current.length > VELOCITY_SAMPLES) {
        samplesRef.current.shift();
      }

      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    },
    [enabled, isDraggingRef, dragOffsetRef],
  );

  /**
   * Handles pointer up — computes average velocity for inertia.
   */
  const onPointerUp = useCallback(() => {
    if (!enabled || !isDraggingRef.current) return;

    isDraggingRef.current = false;

    if (!hasDraggedRef.current) {
      dragOffsetRef.current = 0;
      velocityRef.current = 0;
      return;
    }

    const samples = samplesRef.current;
    const avgVelocity =
      samples.length > 0
        ? samples.reduce((sum, v) => sum + v, 0) / samples.length
        : 0;

    velocityRef.current = avgVelocity;
  }, [enabled, isDraggingRef, dragOffsetRef, velocityRef]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
