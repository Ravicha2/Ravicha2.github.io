import { webMcpTools } from './tools';
import type { ModelContext } from './types';

type DocumentWithModelContext = Document & { modelContext?: ModelContext };

/**
 * `document.modelContext` where the browser ships it, `undefined` everywhere else.
 * Feature-detected rather than assumed: the origin trial covers a narrow version range,
 * so most visitors load this page without it and must not see it assumed.
 */
export function modelContextOf(doc: Document = document): ModelContext | undefined {
  return (doc as DocumentWithModelContext).modelContext ?? undefined;
}

/** Registers every tool, each unregistering when `signal` aborts. */
export async function registerWebMcpTools(
  modelContext: ModelContext,
  signal?: AbortSignal,
): Promise<void> {
  await Promise.all(
    webMcpTools.map((tool) => modelContext.registerTool(tool, signal ? { signal } : undefined)),
  );
}

export interface InstalledTools {
  /** Aborts the registration signal, which unregisters every tool this install added. */
  abort: () => void;
  /** Settles once registration finishes, or immediately if there was nothing to register. */
  settled: Promise<void>;
}

/**
 * A second `registerTool` for a name that is still registered is rejected, and a React
 * StrictMode remount runs register → abort → register before the first async call has
 * settled. Chaining each install onto the previous one keeps the remount from losing the
 * tools. The reference is module-level and per-document, matching `document.modelContext`.
 */
let previous: Promise<void> = Promise.resolve();

/**
 * Registers this page's tools if the browser implements `document.modelContext`, and
 * returns a handle to unregister them. Returns `null` — and touches nothing — otherwise.
 */
export function installWebMcpTools(doc: Document = document): InstalledTools | null {
  const modelContext = modelContextOf(doc);
  if (!modelContext) return null;

  const controller = new AbortController();
  const settled = previous
    .then(async () => {
      if (controller.signal.aborted) return;
      await registerWebMcpTools(modelContext, controller.signal);
    })
    .catch(() => {
      // A registration that rejects (duplicate name, invalid schema, an abort racing the
      // call) must not surface as an unhandled rejection on a page most visitors load
      // without `modelContext` at all. The page behaves the same either way.
    });
  previous = settled;

  return { abort: () => controller.abort(), settled };
}
