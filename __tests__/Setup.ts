import '@testing-library/jest-dom';

class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    canvas: document.createElement('canvas'),
    clearRect: () => {},
    drawImage: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    resetTransform: () => {},
    isPointInPath: () => false,
    isPointInStroke: () => false,
    measureText: () => ({ width: 0 }),
    fillRect: () => {},
    strokeRect: () => {},
    fillText: () => {},
    strokeText: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    clip: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    arc: () => {},
    arcTo: () => {},
    rect: () => {},
    fill: () => {},
    stroke: () => {},
    save: () => {},
    restore: () => {},
    scale: () => {},
    rotate: () => {},
    translate: () => {},
    transform: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    createRadialGradient: () => ({
      addColorStop: () => {},
    }),
    createPattern: () => null,
  }),
});
