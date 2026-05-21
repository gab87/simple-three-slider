# simple-three-slider

A React + Three.js carousel slider with ripple distortion effect powered by custom GLSL shaders. Renders portrait images (9:16) in a WebGL canvas with smooth transitions, grayscale/zoom hover effects, freehand drag scrolling, and infinite loop support.

## Features

- **Portrait images (9:16)** — Optimized for vertical content
- **Ripple distortion effect** — Custom GLSL post-processing shader on slide transitions and drag
- **Grayscale hover** — Shader-based grayscale filter removed on hover with smooth animation
- **Zoom hover** — Animated scale-up on hover with content cropping
- **FreeHand drag** — Smooth horizontal scroll with momentum/inertia physics
- **Infinite loop** — Seamless virtual loop with modular slide repositioning (no jump)
- **Auto-play** — Automatic slide advancement with configurable delay
- **Custom navigation** — Inject your own navigation component via React Context
- **Configurable gap** — Pixel-based spacing between slides
- **Fully typed** — Written in TypeScript with exported type definitions
- **Lightweight** — Tree-shakeable ESM and CJS builds

## Installation

```bash
npm install @_gmdev/simple-three-slider
```

### Peer Dependencies

```bash
npm install react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing
```

## Quick Start

```tsx
import { SimpleThreeSlider } from '@_gmdev/simple-three-slider';

const images = [
  'https://picsum.photos/id/10/900/1600',
  'https://picsum.photos/id/20/900/1600',
  'https://picsum.photos/id/30/900/1600',
  'https://picsum.photos/id/40/900/1600',
];

function App() {
  return (
    <SimpleThreeSlider
      images={images}
      width={800}
      height={500}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | **required** | Array of image URLs (must be 9:16 portrait ratio) |
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `450` | Canvas height in pixels |
| `gap` | `number` | `24` | Gap between slides in pixels |
| `navigation` | `ReactNode` | built-in | Custom navigation component |
| `grayscale` | `boolean` | `false` | Apply grayscale filter (removed on hover) |
| `zoomed` | `boolean` | `false` | Enable zoom animation on hover |
| `freeHand` | `boolean` | `false` | Enable drag-to-scroll with momentum |
| `infinite` | `boolean` | `false` | Enable seamless infinite loop |
| `auto` | `boolean` | `false` | Enable automatic slide advancement |
| `delay` | `number` | `3000` | Auto-play interval in milliseconds |
| `rippleIntensity` | `number` | `0.5` | Ripple distortion intensity (0 to 1) |
| `rippleSpeed` | `number` | `1.5` | Ripple decay speed factor |
| `className` | `string` | — | CSS class name for the container |
| `onSlideChange` | `(index: number) => void` | — | Callback fired when active slide changes |

## Examples

### Grayscale + Zoom on Hover

```tsx
<SimpleThreeSlider
  images={images}
  grayscale
  zoomed
/>
```

### Infinite Auto-Play

```tsx
<SimpleThreeSlider
  images={images}
  infinite
  auto
  delay={2500}
/>
```

### FreeHand Drag

```tsx
<SimpleThreeSlider
  images={images}
  freeHand
  infinite
/>
```

### Custom Navigation

```tsx
import { SimpleThreeSlider, useSliderControls } from '@_gmdev/simple-three-slider';

function MyNavigation() {
  const { goToPrev, goToNext, currentIndex, totalSlides, hasPrev, hasNext } = useSliderControls();

  return (
    <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
      <button onClick={goToPrev} disabled={!hasPrev}>Prev</button>
      <span>{currentIndex + 1} / {totalSlides}</span>
      <button onClick={goToNext} disabled={!hasNext}>Next</button>
    </div>
  );
}

function App() {
  return (
    <SimpleThreeSlider
      images={images}
      navigation={<MyNavigation />}
      infinite
    />
  );
}
```

### Custom Gap

```tsx
<SimpleThreeSlider
  images={images}
  gap={48}
/>
```

## Development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Run tests
npm test

# Build the package
npm run build

# Type check
npm run lint
```

## License

[MIT](./LICENSE)
