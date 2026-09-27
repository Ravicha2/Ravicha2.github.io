import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/App';
import { projects } from '../../src/data/projects';

const BASE_ROUTES = ['/', '/projects', '/projects/shepherd', '/experience', '/nope-404', '/foo/bar'];

describe('App Component Routing', () => {
  it('renders overview home route by default', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders projects route when navigated to /projects', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/projects']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders experience route when navigated to /experience', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/experience']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // GitHub Pages redirects every unresolvable path back into this SPA, so an
  // unmatched route is reachable from any stale deep link, not just in dev.
  it.each(BASE_ROUTES)(
    'renders exactly one h1 on %s',
    (route) => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[route]}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    }
  );

  // "Works and and Educations" shipped as a live section heading. A doubled word is
  // never intentional prose here, so every heading is checked at render time rather
  // than grepped out of the source, where the text may be composed from a prop.
  it.each([...BASE_ROUTES, ...projects.map((p) => `/projects/${p.slug}`)])(
    'writes every heading on %s without a doubled word',
    (route) => {
      const { container } = render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[route]}>
          <App />
        </MemoryRouter>
      );

      const headings = container.querySelectorAll('h1, h2, h3');
      expect(headings.length).toBeGreaterThan(0);
      headings.forEach((heading) => {
        const text = heading.textContent ?? '';
        const doubled = text.match(/\b(\w+)\s+\1\b/i);
        expect(doubled, `${route}: heading reads "${text}"`).toBeNull();
      });
    }
  );

  it.each(['/nope-404', '/foo/bar'])('renders a real not-found page on %s', (route) => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );

    const main = screen.getByRole('main');
    expect(main.textContent?.trim().length ?? 0).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();

    // A way back that is not the browser's back button.
    expect(screen.getByRole('link', { name: /back to overview/i })).toHaveAttribute('href', '/');
  });
});
