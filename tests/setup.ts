import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom defines scrollTo but throws "Not implemented"; the view-transition hook calls it on
// navigate, so stub it to keep the test output free of jsdom noise.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', { writable: true, value: () => {} });
}
