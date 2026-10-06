import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './styles/index.css';

const container = document.getElementById('root')!;

const app = (
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// A prerendered page (scripts/prerender.mjs) already holds the real markup, so adopt
// it instead of throwing it away and rendering again. Anything else gets a fresh
// mount: `vite dev` serves the bare template, and GitHub Pages' 404 redirect rewrites
// an unknown URL to /?/that-url, so the served file would describe a different route
// than the one being mounted — hydrating that only makes React discard the tree.
const prerendered = document
  .querySelector('meta[name="prerendered-route"]')
  ?.getAttribute('content');
const here = window.location.pathname.replace(/\/$/, '') || '/';

if (prerendered === here) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
