import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useReducedMotion } from '../../src/accessibility/useReducedMotion';

describe('useReducedMotion Hook', () => {
  let listeners: Array<(event: { matches: boolean }) => void> = [];

  beforeEach(() => {
    listeners = [];
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, callback: (e: { matches: boolean }) => void) => {
        if (event === 'change') listeners.push(callback);
      }),
      removeEventListener: vi.fn((_event: string, callback: (e: { matches: boolean }) => void) => {
        listeners = listeners.filter((l) => l !== callback);
      }),
    })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('reacts dynamically to changes in matchMedia', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((listener) => listener({ matches: true }));
    });

    expect(result.current).toBe(true);
  });

  it('returns true if prefers-reduced-motion matches initially', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, callback: (e: { matches: boolean }) => void) => {
        if (event === 'change') listeners.push(callback);
      }),
      removeEventListener: vi.fn((_event: string, callback: (e: { matches: boolean }) => void) => {
        listeners = listeners.filter((l) => l !== callback);
      }),
    })));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
