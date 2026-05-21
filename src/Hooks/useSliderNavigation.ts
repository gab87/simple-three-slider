import { useState, useCallback, useEffect, useRef } from 'react';
import { SlideDirection } from '../Types';

interface UseSliderNavigationParams {
  /** Total number of slides */
  totalItems: number;
  /** Enable infinite loop navigation */
  infinite: boolean;
  /** Enable automatic slide advancement */
  auto: boolean;
  /** Auto-play interval in milliseconds */
  delay: number;
  /** Callback fired when active slide changes */
  onSlideChange?: (index: number) => void;
}

interface UseSliderNavigationReturn {
  /** Current active slide index */
  currentIndex: number;
  /** Navigate to the previous slide */
  goToPrev: () => void;
  /** Navigate to the next slide */
  goToNext: () => void;
  /** Navigate to a specific slide index */
  goToIndex: (index: number) => void;
  /** Whether there is a previous slide */
  hasPrev: boolean;
  /** Whether there is a next slide */
  hasNext: boolean;
  /** Direction of the last slide transition */
  lastDirection: SlideDirection | null;
}

/**
 * Manages slider navigation state, auto-play logic, infinite loop, and slide direction tracking.
 * @param params - Configuration for navigation behavior
 * @returns Navigation state and control functions
 */
export function useSliderNavigation({
  totalItems,
  infinite,
  auto,
  delay,
  onSlideChange,
}: UseSliderNavigationParams): UseSliderNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<SlideDirection | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasPrev = infinite || currentIndex > 0;
  const hasNext = infinite || currentIndex < totalItems - 1;

  /**
   * Normalizes an index to [0, totalItems) range.
   * @param index - Potentially unbounded index
   * @returns Normalized index within valid range
   */
  const normalize = useCallback(
    (index: number) => ((index % totalItems) + totalItems) % totalItems,
    [totalItems],
  );

  /**
   * Navigates to the previous slide. Unbounded decrement if infinite.
   */
  const goToPrev = useCallback(() => {
    if (!hasPrev) return;

    setLastDirection('left');
    setCurrentIndex((prev) => {
      const next = infinite ? prev - 1 : prev - 1;
      onSlideChange?.(normalize(next));
      return next;
    });
  }, [hasPrev, infinite, onSlideChange, normalize]);

  /**
   * Navigates to the next slide. Unbounded increment if infinite.
   */
  const goToNext = useCallback(() => {
    if (!hasNext) return;

    setLastDirection('right');
    setCurrentIndex((prev) => {
      const next = infinite ? prev + 1 : prev + 1;
      onSlideChange?.(normalize(next));
      return next;
    });
  }, [hasNext, infinite, onSlideChange, normalize]);

  /**
   * Navigates to a specific slide index.
   * @param index - Target slide index (unbounded if infinite)
   */
  const goToIndex = useCallback(
    (index: number) => {
      const target = infinite ? index : Math.max(0, Math.min(index, totalItems - 1));
      setLastDirection(target > currentIndex ? 'right' : 'left');
      setCurrentIndex(target);
      onSlideChange?.(normalize(target));
    },
    [currentIndex, totalItems, infinite, onSlideChange, normalize],
  );

  useEffect(() => {
    if (!auto || totalItems <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        setLastDirection('right');
        onSlideChange?.(normalize(next));
        return next;
      });
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [auto, delay, totalItems, onSlideChange]);

  return {
    currentIndex,
    goToPrev,
    goToNext,
    goToIndex,
    hasPrev,
    hasNext,
    lastDirection,
  };
}
