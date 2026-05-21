import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationButtons } from '../src/NavigationButtons';

describe('NavigationButtons', () => {
  it('renders prev and next buttons', () => {
    render(
      <NavigationButtons
        onPrev={vi.fn()}
        onNext={vi.fn()}
        hasPrev={true}
        hasNext={true}
      />,
    );

    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('calls onPrev when prev button is clicked', () => {
    const onPrev = vi.fn();
    render(
      <NavigationButtons
        onPrev={onPrev}
        onNext={vi.fn()}
        hasPrev={true}
        hasNext={true}
      />,
    );

    fireEvent.click(screen.getByLabelText('Previous slide'));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when next button is clicked', () => {
    const onNext = vi.fn();
    render(
      <NavigationButtons
        onPrev={vi.fn()}
        onNext={onNext}
        hasPrev={true}
        hasNext={true}
      />,
    );

    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('disables prev button when hasPrev is false', () => {
    render(
      <NavigationButtons
        onPrev={vi.fn()}
        onNext={vi.fn()}
        hasPrev={false}
        hasNext={true}
      />,
    );

    const prevButton = screen.getByLabelText('Previous slide');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button when hasNext is false', () => {
    render(
      <NavigationButtons
        onPrev={vi.fn()}
        onNext={vi.fn()}
        hasPrev={true}
        hasNext={false}
      />,
    );

    const nextButton = screen.getByLabelText('Next slide');
    expect(nextButton).toBeDisabled();
  });
});
