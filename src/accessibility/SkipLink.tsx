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
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-text-primary focus:border focus:border-border-strong focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-solid focus:ring-offset-2 focus:ring-offset-canvas"
    >
      {label}
    </a>
  );
};
