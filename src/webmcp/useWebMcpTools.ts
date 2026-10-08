import { useEffect } from 'react';
import { installWebMcpTools } from './register';

/**
 * Registers the page's read-only WebMCP tools on mount, and unregisters them on unmount
 * by aborting the signal handed to `registerTool` — so a client-side route change or a
 * teardown cannot leave a stale tool behind. Does nothing where `document.modelContext`
 * is absent, which is most browsers today.
 */
export function useWebMcpTools(): void {
  useEffect(() => {
    const installed = installWebMcpTools(document);
    return () => installed?.abort();
  }, []);
}
