# simple-three-slider

A React + Three.js carousel slider with ripple distortion effect powered by custom GLSL shaders.

When navigating between slides, a ripple distortion propagates across the canvas in the opposite direction of the slide transition, creating a visually engaging WebGL effect.

## Features

- **React components as slides** — Pass any React node as a slide item
- **Ripple distortion effect** — Custom GLSL post-processing shader with configurable intensity and speed
- **Navigation controls** — Built-in prev/next buttons with accessibility support
- **Auto-play** — Optional automatic slide advancement with configurable interval
- **Fully typed** — Written in TypeScript with exported type definitions
- **Lightweight** — Tree-shakeable ESM and CJS builds

## Installation

```bash
npm install simple-three-slider
```

### Peer Dependencies

You need to install these peer dependencies in your project:

```bash
npm install react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing
```

## Quick Start

```tsx
import { SimpleThreeSlider } from 'simple-three-slider';

function App() {
  const slides = [
    <div style={{ padding: '40px', background: '#e74c3c', color: '#fff' }}>
      <h2>Slide 1</h2>
      <p>Any React content works here</p>
    </div>,
    <div style={{ padding: '40px', background: '#3498db', color: '#fff' }}>
      <h2>Slide 2</h2>
      <p>Including interactive elements</p>
    </div>,
    <div style={{ padding: '40px', background: '#2ecc71', color: '#fff' }}>
      <h2>Slide 3</h2>
      <button onClick={() => alert('Clicked!')}>Click me</button>
    </div>,
  ];

  return (
    <SimpleThreeSlider
      items={slides}
      width={800}
      height={450}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ReactNode[]` | **required** | List of React components to display as slides |
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `450` | Canvas height in pixels |
| `autoPlay` | `boolean` | `false` | Enable automatic slide advancement |
| `autoPlayInterval` | `number` | `3000` | Auto-play interval in milliseconds |
| `rippleIntensity` | `number` | `0.3` | Ripple distortion intensity (0 to 1) |
| `rippleSpeed` | `number` | `2.0` | Ripple decay speed factor |
| `className` | `string` | — | CSS class name for the container |
| `onSlideChange` | `(index: number) => void` | — | Callback fired when active slide changes |

## Examples

### Auto-Play Slider

```tsx
<SimpleThreeSlider
  items={slides}
  autoPlay
  autoPlayInterval={2000}
  onSlideChange={(index) => console.log(`Slide ${index}`)}
/>
```

### High Ripple Effect

```tsx
<SimpleThreeSlider
  items={slides}
  rippleIntensity={0.8}
  rippleSpeed={1.0}
/>
```

### Custom Sized

```tsx
<SimpleThreeSlider
  items={slides}
  width={1024}
  height={768}
  className="my-slider"
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
