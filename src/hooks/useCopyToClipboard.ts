import { useCallback, useEffect, useRef, useState } from 'react';

export type CopyState = 'idle' | 'copied' | 'error';

/**
 * Copy text, reporting success only once `writeText` has actually resolved.
 * A rejected write (insecure context, denied permission) surfaces as 'error'
 * rather than a false 'copied'.
 */
export const useCopyToClipboard = (resetMs = 2000) => {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setState('copied');
      } catch {
        setState('error');
      }
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState('idle'), resetMs);
    },
    [resetMs]
  );

  return { state, copy };
};

export default useCopyToClipboard;
