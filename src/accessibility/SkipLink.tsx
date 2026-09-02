import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-zinc-50 focus:border focus:border-zinc-700 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-solid focus:ring-offset-2 focus:ring-offset-canvas"
    >
      {label}
    </a>
  );
};
