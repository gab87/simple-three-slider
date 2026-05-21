import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SimpleThreeSlider } from '../src/SimpleThreeSlider';
import { useSliderControls } from '../src/SliderControlsContext';

const PORTRAIT_IMAGES = [
  'https://picsum.photos/id/10/900/1600',
  'https://picsum.photos/id/20/900/1600',
  'https://picsum.photos/id/30/900/1600',
  'https://picsum.photos/id/40/900/1600',
  'https://picsum.photos/id/50/900/1600',
];

/**
 * Custom navigation component example using useSliderControls hook.
 * @returns Custom navigation UI for the slider
 */
function CustomNavigation(): React.JSX.Element {
  const { goToPrev, goToNext, currentIndex, totalSlides, hasPrev, hasNext } = useSliderControls();
  return (
    <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', alignItems: 'center' }}>
      <button onClick={goToPrev} disabled={!hasPrev} style={{ padding: '8px 16px', cursor: hasPrev ? 'pointer' : 'default' }}>Prev</button>
      <span style={{ color: '#fff', fontFamily: 'monospace' }}>{currentIndex + 1} / {totalSlides}</span>
      <button onClick={goToNext} disabled={!hasNext} style={{ padding: '8px 16px', cursor: hasNext ? 'pointer' : 'default' }}>Next</button>
    </div>
  );
}

const meta: Meta<typeof SimpleThreeSlider> = {
  title: 'Components/SimpleThreeSlider',
  component: SimpleThreeSlider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: { type: 'range', min: 400, max: 1200, step: 50 } },
    height: { control: { type: 'range', min: 300, max: 800, step: 50 } },
    gap: { control: { type: 'range', min: 0, max: 100, step: 4 } },
    grayscale: { control: 'boolean' },
    zoomed: { control: 'boolean' },
    freeHand: { control: 'boolean' },
    infinite: { control: 'boolean' },
    auto: { control: 'boolean' },
    delay: { control: { type: 'range', min: 1000, max: 10000, step: 500 } },
    rippleIntensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    rippleSpeed: { control: { type: 'range', min: 0.5, max: 5, step: 0.25 } },
  },
};

export default meta;
type Story = StoryObj<typeof SimpleThreeSlider>;

export const Default: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
  },
};

export const Grayscale: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    grayscale: true,
  },
};

export const ZoomOnHover: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    zoomed: true,
  },
};

export const FreeHandDrag: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    freeHand: true,
  },
};

export const InfiniteAutoPlay: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    infinite: true,
    auto: true,
    delay: 2500,
  },
};

export const CustomGap: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    gap: 48,
  },
};

export const WithCustomNavigation: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    navigation: <CustomNavigation />,
    infinite: true,
  },
};

export const AllEffects: Story = {
  args: {
    images: PORTRAIT_IMAGES,
    width: 800,
    height: 500,
    grayscale: true,
    zoomed: true,
    freeHand: true,
    infinite: true,
    rippleIntensity: 0.8,
  },
};
