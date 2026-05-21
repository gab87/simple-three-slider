import { createContext, useContext } from 'react';
import { SliderNavigationContext } from './Types';

const SliderControlsContext = createContext<SliderNavigationContext | null>(null);

/**
 * Hook to access slider navigation controls from a custom navigation component.
 * Must be used inside a component rendered as the `navigation` prop of SimpleThreeSlider.
 * @returns The slider navigation context with controls and state
 */
export function useSliderControls(): SliderNavigationContext {
  const context = useContext(SliderControlsContext);
  if (!context) {
    throw new Error('useSliderControls must be used within SimpleThreeSlider navigation');
  }
  return context;
}

export { SliderControlsContext };
