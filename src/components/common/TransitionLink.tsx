import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useViewTransitionNavigate } from '../../hooks/useViewTransitionNavigate';

export interface TransitionLinkProps extends LinkProps {
  to: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  onClick,
  children,
  ...props
}) => {
  const navigateWithTransition = useViewTransitionNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }
    // Only intercept primary left clicks without modifier keys or custom target
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !props.target
    ) {
      e.preventDefault();
      navigateWithTransition(to);
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
