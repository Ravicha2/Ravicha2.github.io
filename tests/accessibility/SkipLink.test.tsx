import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkipLink } from '../../src/accessibility/SkipLink';

describe('SkipLink Component', () => {
  it('renders an accessible anchor pointing to #main-content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('is visually hidden by default with sr-only class and visible on focus', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link.className).toContain('sr-only');
    expect(link.className).toContain('focus:not-sr-only');
  });

  it('supports custom targetId and label', () => {
    render(<SkipLink targetId="article-body" label="Skip to article" />);
    const link = screen.getByRole('link', { name: /skip to article/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#article-body');
  });
});
