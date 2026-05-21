import { ReactNode } from 'react';
import type { Texture } from 'three';

export interface SimpleThreeSliderProps {
  /** Array of image URLs to display (must be 9:16 portrait ratio) */
  images: string[];
  /** Canvas width in pixels */
  width?: number;
  /** Canvas height in pixels */
  height?: number;
  /** Gap between slides in pixels */
  gap?: number;
  /** Custom navigation component (receives context via SliderControlsContext) */
  navigation?: ReactNode;
  /** Apply grayscale filter to slides (removed on hover) */
  grayscale?: boolean;
  /** Enable zoom animation on hover (crops within slide bounds) */
  zoomed?: boolean;
  /** Enable drag-to-scroll with cursor */
  freeHand?: boolean;
  /** Enable infinite loop */
  infinite?: boolean;
  /** Enable automatic slide advancement */
  auto?: boolean;
  /** Auto-play interval in milliseconds */
  delay?: number;
  /** Ripple distortion intensity (0 to 1) */
  rippleIntensity?: number;
  /** Ripple decay speed factor */
  rippleSpeed?: number;
  /** CSS class name for the container */
  className?: string;
  /** Callback fired when active slide changes */
  onSlideChange?: (index: number) => void;
}

export interface SliderItemProps {
  /** Three.js texture loaded from image URL */
  texture: Texture | null;
  /** Horizontal position offset */
  positionX: number;
  /** Width of the slide plane */
  width: number;
  /** Height of the slide plane */
  height: number;
  /** Whether this slide is currently hovered */
  isHovered: boolean;
  /** Whether grayscale effect is enabled */
  grayscale: boolean;
  /** Whether zoom effect is enabled */
  zoomed: boolean;
}

export interface SliderNavigationContext {
  /** Navigate to the previous slide */
  goToPrev: () => void;
  /** Navigate to the next slide */
  goToNext: () => void;
  /** Current active slide index */
  currentIndex: number;
  /** Total number of slides */
  totalSlides: number;
  /** Whether there is a previous slide available */
  hasPrev: boolean;
  /** Whether there is a next slide available */
  hasNext: boolean;
}

export interface NavigationButtonsProps {
  /** Handler for previous slide action */
  onPrev: () => void;
  /** Handler for next slide action */
  onNext: () => void;
  /** Whether the previous button is disabled */
  hasPrev: boolean;
  /** Whether the next button is disabled */
  hasNext: boolean;
}

export interface RippleUniforms {
  /** Current ripple intensity (decaying over time) */
  intensity: number;
  /** Direction of the ripple: -1 (left) or 1 (right) */
  direction: number;
  /** Elapsed time since ripple trigger */
  time: number;
}

export type SlideDirection = 'left' | 'right';

export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 450;
export const DEFAULT_GAP = 24;
export const DEFAULT_DELAY = 3000;
export const DEFAULT_RIPPLE_INTENSITY = 0.5;
export const DEFAULT_RIPPLE_SPEED = 1.5;
export const PORTRAIT_ASPECT_RATIO = 9 / 16;
