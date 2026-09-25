import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactBlock } from '../../src/components/common/ContactBlock';
import { profile } from '../../src/data/profile';

const writeText = vi.fn();

beforeEach(() => {
  writeText.mockReset();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
});

describe('ContactBlock', () => {
  it('renders the address as visible text, with availability and location from profile', () => {
    render(<ContactBlock />);

    expect(screen.getByText(profile.email)).toBeInTheDocument();
    expect(screen.getByText(profile.status)).toBeInTheDocument();
    expect(screen.getByText(profile.location)).toBeInTheDocument();
  });

  it('does not introduce a status pill, badge, or dot', () => {
    const { container } = render(<ContactBlock />);

    // The spec permits one prose availability line and bans status chrome.
    // A badge would be a bordered inline-flex span adjacent to the status text.
    expect(container.querySelector('[role="status"]')).toBeNull();
    expect(screen.getByText(profile.status).tagName).toBe('P');
  });

  it('shows Copied only after writeText resolves', async () => {
    let resolveWrite!: () => void;
    writeText.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveWrite = resolve;
      })
    );
    render(<ContactBlock />);

    fireEvent.click(screen.getByRole('button'));
    // Still pending: must not claim success yet.
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();

    resolveWrite();
    expect(await screen.findByText('Copied')).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(profile.email);
  });

  it('surfaces a failure state instead of a false success', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    render(<ContactBlock />);

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Copy failed')).toBeInTheDocument();
    expect(screen.queryByText('Copied')).not.toBeInTheDocument();
  });
});
