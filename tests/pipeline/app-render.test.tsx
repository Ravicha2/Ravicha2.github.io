import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/App';

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
});
