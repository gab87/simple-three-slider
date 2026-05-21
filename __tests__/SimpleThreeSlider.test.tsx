import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimpleThreeSlider } from '../src/SimpleThreeSlider';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="effect-composer">{children}</div>
  ),
}));

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
}));

vi.mock('../src/Shaders/RippleEffect', () => ({
  RippleEffect: React.forwardRef((_props: Record<string, unknown>, _ref: unknown) => (
    <div data-testid="ripple-effect" />
  )),
  RippleEffectImpl: class MockRippleEffectImpl {
    set intensity(_v: number) {}
    set direction(_v: number) {}
    set time(_v: number) {}
  },
}));

describe('SimpleThreeSlider', () => {
  const mockItems = [
    <div key="1">Slide 1</div>,
    <div key="2">Slide 2</div>,
    <div key="3">Slide 3</div>,
  ];

  it('renders without crashing', () => {
    const { container } = render(<SimpleThreeSlider items={mockItems} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders navigation buttons', () => {
    render(<SimpleThreeSlider items={mockItems} />);

    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('renders empty div when items array is empty', () => {
    const { container } = render(<SimpleThreeSlider items={[]} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.children).toHaveLength(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <SimpleThreeSlider items={mockItems} className="custom-slider" />,
    );

    expect(container.firstChild).toHaveClass('custom-slider');
  });

  it('applies custom width and height', () => {
    const { container } = render(
      <SimpleThreeSlider items={mockItems} width={1024} height={768} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('1024px');
    expect(wrapper.style.height).toBe('768px');
  });

  it('renders the R3F canvas', () => {
    render(<SimpleThreeSlider items={mockItems} />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
