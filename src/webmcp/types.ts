/**
 * The slice of the W3C WebMCP draft (https://webmachinelearning.github.io/webmcp/) this
 * site uses, copied from the draft's IDL rather than from memory. `document.modelContext`
 * is not in TypeScript's DOM lib — and, more to the point, is absent from most browsers,
 * because the Chrome origin trial covers a narrow version range — so the shape lives here
 * and every read of it is feature-detected (src/webmcp/register.ts) instead of assumed.
 */

/** `dictionary ToolAnnotations` — every member defaults to `false`. */
export interface ToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

/** A `content` block in a tool result. This site only ever produces text. */
export interface TextContent {
  type: 'text';
  text: string;
}

/** What `execute` resolves to: `{ content: [{ type: 'text', text }] }`. */
export interface ToolResponse {
  content: TextContent[];
}

/** `callback ToolExecuteCallback = Promise<any> (object inputObject, ToolExecuteCallbackOptions options)`. */
export interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema: object;
  execute: (input: Record<string, unknown>) => Promise<ToolResponse>;
  annotations?: ToolAnnotations;
}

/** `dictionary ModelContextRegisterToolOptions`. */
export interface ModelContextRegisterToolOptions {
  exposedTo?: string[];
  /** "An AbortSignal that unregisters the tool when aborted." */
  signal?: AbortSignal;
}

/** `dictionary RegisteredTool` — what `getTools()` resolves to. */
export interface RegisteredTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  annotations?: ToolAnnotations;
}

/** The methods this site calls on the draft's `ModelContext` (itself an `EventTarget`). */
export interface ModelContext {
  /** Rejects if a tool of the same name is already registered, or the schema is invalid. */
  registerTool(
    tool: ModelContextTool,
    options?: ModelContextRegisterToolOptions,
  ): Promise<undefined>;
  getTools(options?: { fromOrigins?: string[] }): Promise<RegisteredTool[]>;
}
