import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChannelStrip } from '../../src/components/bench/ChannelStrip';
import { Capture } from '../../src/components/bench/Capture';

afterEach(() => vi.restoreAllMocks());

const wrap = (node: React.ReactNode) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {node}
    </MemoryRouter>
  );

describe('The verdict reaches assistive tech', () => {
  it('says the tier in the strip link’s own name', () => {
    wrap(<ChannelStrip />);
    const shepherd = screen.getByRole('link', { name: /Shepherd/ });
    expect(shepherd).toHaveAccessibleName(/in progress/i);

    // A settled channel says so too — the word is not decoration, it is the state.
    expect(screen.getByRole('link', { name: /NL2REGEX/ })).toHaveAccessibleName(/settled/i);
  });
});

describe('The capture frame', () => {
  it('renders its preload hint without a console error on React 18', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    wrap(<Capture src="/x.webp" alt="a mark" source="a source" width={100} height={50} priority />);
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole('img')).toHaveAttribute('fetchpriority', 'high');
  });
});
