import React, { useRef, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { SliderScene } from './SliderScene';
import { NavigationButtons } from './NavigationButtons';
import { useSliderNavigation } from './Hooks/useSliderNavigation';
import { useImageTextures } from './Hooks/useImageTextures';
import { useFreeHand } from './Hooks/useFreeHand';
import { SliderControlsContext } from './SliderControlsContext';
import {
  SimpleThreeSliderProps,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_GAP,
  DEFAULT_DELAY,
  DEFAULT_RIPPLE_INTENSITY,
  DEFAULT_RIPPLE_SPEED,
} from './Types';

const CONTAINER_STYLE: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

const CAMERA_POSITION: [number, number, number] = [0, 0, 2];
const CAMERA_FOV = 50;

/**
 * A React + Three.js carousel slider with ripple distortion effect.
 * Renders portrait images (9:16) with WebGL, applying GLSL shaders for
 * ripple transitions, grayscale, and zoom hover effects.
 * @param props - Slider configuration including images, dimensions, and effect parameters
 * @returns The complete slider component with canvas and navigation overlay
 */
export function SimpleThreeSlider({
  images,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  gap = DEFAULT_GAP,
  navigation,
  grayscale = false,
  zoomed = false,
  freeHand = false,
  infinite = false,
  auto = false,
  delay = DEFAULT_DELAY,
  rippleIntensity = DEFAULT_RIPPLE_INTENSITY,
  rippleSpeed = DEFAULT_RIPPLE_SPEED,
  className,
  onSlideChange,
}: SimpleThreeSliderProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);

  const { currentIndex, goToPrev, goToNext, goToIndex, hasPrev, hasNext, lastDirection } =
    useSliderNavigation({
      totalItems: images.length,
      infinite,
      auto,
      delay,
      onSlideChange,
    });

  const { textures } = useImageTextures({ urls: images });

  const { onPointerDown, onPointerMove, onPointerUp } = useFreeHand({
    enabled: freeHand,
    dragOffsetRef,
    velocityRef,
    isDraggingRef,
  });

  const handleSnapToIndex = useCallback(
    (index: number) => {
      goToIndex(index);
    },
    [goToIndex],
  );

  const navigationContext = useMemo(
    () => ({
      goToPrev,
      goToNext,
      currentIndex,
      totalSlides: images.length,
      hasPrev,
      hasNext,
    }),
    [goToPrev, goToNext, currentIndex, images.length, hasPrev, hasNext],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (freeHand) onPointerDown(e);
    },
    [freeHand, onPointerDown],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (freeHand) onPointerMove(e);
    },
    [freeHand, onPointerMove],
  );

  const handlePointerUp = useCallback(() => {
    if (freeHand) onPointerUp();
  }, [freeHand, onPointerUp]);

  if (images.length === 0) {
    return <div className={className} style={{ width, height }} />;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...CONTAINER_STYLE,
        width: `${width}px`,
        height: `${height}px`,
        cursor: freeHand ? 'grab' : 'default',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
      >
        <SliderScene
          textures={textures.length > 0 ? textures : images.map(() => null)}
          currentIndex={currentIndex}
          lastDirection={lastDirection}
          rippleIntensity={rippleIntensity}
          rippleSpeed={rippleSpeed}
          grayscale={grayscale}
          zoomed={zoomed}
          gap={gap}
          containerWidth={width}
          containerHeight={height}
          infinite={infinite}
          dragOffsetRef={dragOffsetRef}
          velocityRef={velocityRef}
          isDraggingRef={isDraggingRef}
          onSnapToIndex={handleSnapToIndex}
        />
      </Canvas>
      <SliderControlsContext.Provider value={navigationContext}>
        {navigation || (
          <NavigationButtons
            onPrev={goToPrev}
            onNext={goToNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        )}
      </SliderControlsContext.Provider>
    </div>
  );
}
