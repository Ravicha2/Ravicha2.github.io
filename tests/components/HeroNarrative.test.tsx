import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroNarrative } from '../../src/components/home/HeroNarrative';

describe('HeroNarrative', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const renderHero = () =>
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HeroNarrative />
      </MemoryRouter>
    );

  it('renders the full headline on first paint, with no streaming effect to wait for', () => {
    renderHero();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('I like building Agentic Software.');
    // No pending work may change the H1: advancing all timers must not alter it
    // and no layout-affecting element (typing cursor) exists inside it.
    const before = h1.innerHTML;
    vi.runAllTimers();
    expect(h1.innerHTML).toBe(before);
    expect(h1.querySelector('span')).toBeNull();
  });

  it('is not inside a live region', () => {
    renderHero();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.closest('[aria-live]')).toBeNull();
  });

  it('orders the claim before the portrait on mobile (flex-col, not flex-col-reverse)', () => {
    const { container } = renderHero();
    const row = container.querySelector('section > div');
    expect(row?.className).toContain('flex-col');
    expect(row?.className).not.toContain('flex-col-reverse');
    const text = row?.firstElementChild;
    expect(text?.querySelector('h1')).toBeTruthy();
  });
});
