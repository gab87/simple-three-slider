import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSliderNavigation } from '../src/Hooks/useSliderNavigation';

describe('useSliderNavigation', () => {
  const DEFAULT_PARAMS = {
    totalItems: 5,
    autoPlay: false,
    autoPlayInterval: 3000,
  };

  it('starts at index 0', () => {
    const { result } = renderHook(() => useSliderNavigation(DEFAULT_PARAMS));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hasPrev).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });

  it('navigates to next slide', () => {
    const { result } = renderHook(() => useSliderNavigation(DEFAULT_PARAMS));

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.hasPrev).toBe(true);
    expect(result.current.lastDirection).toBe('right');
  });

  it('navigates to previous slide', () => {
    const { result } = renderHook(() => useSliderNavigation(DEFAULT_PARAMS));

    act(() => {
      result.current.goToNext();
    });
    act(() => {
      result.current.goToPrev();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.lastDirection).toBe('left');
  });

  it('does not navigate before first slide', () => {
    const { result } = renderHook(() => useSliderNavigation(DEFAULT_PARAMS));

    act(() => {
      result.current.goToPrev();
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('does not navigate past last slide', () => {
    const params = { ...DEFAULT_PARAMS, totalItems: 2 };
    const { result } = renderHook(() => useSliderNavigation(params));

    act(() => {
      result.current.goToNext();
    });
    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.hasNext).toBe(false);
  });

  it('calls onSlideChange callback', () => {
    const onSlideChange = vi.fn();
    const params = { ...DEFAULT_PARAMS, onSlideChange };
    const { result } = renderHook(() => useSliderNavigation(params));

    act(() => {
      result.current.goToNext();
    });

    expect(onSlideChange).toHaveBeenCalledWith(1);
  });

  it('handles autoPlay with interval', () => {
    vi.useFakeTimers();
    const onSlideChange = vi.fn();
    const params = {
      ...DEFAULT_PARAMS,
      autoPlay: true,
      autoPlayInterval: 1000,
      onSlideChange,
    };

    renderHook(() => useSliderNavigation(params));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onSlideChange).toHaveBeenCalledWith(1);

    vi.useRealTimers();
  });
});
