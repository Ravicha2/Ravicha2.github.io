import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/App';

describe('App Component Routing', () => {
  it('renders overview home route by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders projects route when navigated to /projects', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders experience route when navigated to /experience', () => {
    render(
      <MemoryRouter initialEntries={['/experience']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
