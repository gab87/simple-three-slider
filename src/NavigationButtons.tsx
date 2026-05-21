import React from 'react';
import { NavigationButtonsProps } from './Types';

const BUTTON_BASE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  fontSize: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s ease, background 0.2s ease',
  zIndex: 10,
  padding: 0,
};

const PREV_STYLE: React.CSSProperties = {
  ...BUTTON_BASE_STYLE,
  left: '12px',
};

const NEXT_STYLE: React.CSSProperties = {
  ...BUTTON_BASE_STYLE,
  right: '12px',
};

const DISABLED_OPACITY = 0.3;
const ENABLED_OPACITY = 1;

/**
 * Overlay navigation buttons (prev/next) positioned over the slider canvas.
 * @param props - Navigation button handlers and disabled states
 * @returns HTML overlay with prev and next arrow buttons
 */
export function NavigationButtons({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: NavigationButtonsProps): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous slide"
        style={{
          ...PREV_STYLE,
          opacity: hasPrev ? ENABLED_OPACITY : DISABLED_OPACITY,
          pointerEvents: hasPrev ? 'auto' : 'none',
        }}
      >
        &#8249;
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next slide"
        style={{
          ...NEXT_STYLE,
          opacity: hasNext ? ENABLED_OPACITY : DISABLED_OPACITY,
          pointerEvents: hasNext ? 'auto' : 'none',
        }}
      >
        &#8250;
      </button>
    </>
  );
}
