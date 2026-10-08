import type React from 'react';
import { useWebMcpTools } from './useWebMcpTools';

/**
 * Headless, like SEOHead: it registers the site's WebMCP tools on mount and renders
 * nothing, so the page's output is byte-for-byte what it was before.
 */
export const WebMcpTools: React.FC = () => {
  useWebMcpTools();
  return null;
};

export default WebMcpTools;
