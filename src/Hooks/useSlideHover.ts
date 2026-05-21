import { useState, useCallback } from 'react';
import { ThreeEvent } from '@react-three/fiber';

interface UseSlideHoverReturn {
  /** Index of the currently hovered slide, or null */
  hoveredIndex: number | null;
  /** Pointer enter handler for a slide mesh */
  onSlidePointerEnter: (index: number) => (e: ThreeEvent<PointerEvent>) => void;
  /** Pointer leave handler for a slide mesh */
  onSlidePointerLeave: () => void;
}

/**
 * Tracks which slide is currently hovered via Three.js pointer events.
 * @returns Hovered index and pointer event handlers
 */
export function useSlideHover(): UseSlideHoverReturn {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /**
   * Creates a pointer enter handler for a specific slide index.
   * @param index - The index of the slide
   * @returns Event handler function
   */
  const onSlidePointerEnter = useCallback(
    (index: number) => (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHoveredIndex(index);
    },
    [],
  );

  /**
   * Handles pointer leave from any slide.
   */
  const onSlidePointerLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return { hoveredIndex, onSlidePointerEnter, onSlidePointerLeave };
}
