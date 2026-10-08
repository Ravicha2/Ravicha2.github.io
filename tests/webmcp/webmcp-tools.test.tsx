import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsView } from '../../src/views/ProjectsView';
import { projects, getProjectBySlug } from '../../src/data/projects';
import { profile } from '../../src/data/profile';
import { SITE, canonicalUrlFor } from '../../src/utils/seo';
import {
  webMcpTools,
  searchProjects,
  formatSearchResults,
  projectDetail,
  describeSite,
} from '../../src/webmcp/tools';
import { installWebMcpTools, modelContextOf, registerWebMcpTools } from '../../src/webmcp/register';
import { WebMcpTools } from '../../src/webmcp/WebMcpTools';
import type {
  ModelContext,
  ModelContextRegisterToolOptions,
  ModelContextTool,
  RegisteredTool,
} from '../../src/webmcp/types';

type Schema = {
  type: string;
  properties: Record<string, unknown>;
  required?: string[];
};

const toolNamed = (name: string): ModelContextTool => {
  const tool = webMcpTools.find((t) => t.name === name);
  if (!tool) throw new Error(`no tool named ${name}`);
  return tool;
};

const signal = () => new AbortController().signal;

/** A spec-shaped stand-in for a browser's ModelContext, recording what it was handed. */
function stubModelContext(): {
  registered: Array<{ tool: ModelContextTool; options?: ModelContextRegisterToolOptions }>;
} {
  const registered: Array<{ tool: ModelContextTool; options?: ModelContextRegisterToolOptions }> = [];
  const modelContext: ModelContext = {
    registerTool: async (tool, options) => {
      registered.push({ tool, options });
      return undefined;
    },
    getTools: async (): Promise<RegisteredTool[]> =>
      registered.map(({ tool }) => ({
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      })),
  };
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    writable: true,
    value: modelContext,
  });
  return { registered };
}

function clearModelContext(): void {
  Reflect.deleteProperty(document, 'modelContext');
}

afterEach(clearModelContext);

describe('WebMCP tool descriptors', () => {
  it('declares exactly the three read-only tools', () => {
    expect(webMcpTools.map((t) => t.name).sort()).toEqual([
      'describe-site',
      'get-project',
      'search-projects',
    ]);
  });

  it('gives every tool a typed schema, an execute, and the read-only annotations', () => {
    for (const tool of webMcpTools) {
      expect(tool.name, `${tool.name}: name`).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(tool.description.trim().length, `${tool.name}: description`).toBeGreaterThan(20);
      expect(typeof tool.execute, `${tool.name}: execute`).toBe('function');

      const schema = tool.inputSchema as Schema;
      expect(schema.type, `${tool.name}: inputSchema.type`).toBe('object');
      expect(schema.properties, `${tool.name}: inputSchema.properties`).toBeDefined();

      expect(tool.annotations?.readOnlyHint, `${tool.name}: readOnlyHint`).toBe(true);
      expect(tool.annotations?.untrustedContentHint, `${tool.name}: untrustedContentHint`).toBe(
        false,
      );
    }
  });

  it('requires the inputs each handler reads, and none for describe-site', () => {
    expect((toolNamed('search-projects').inputSchema as Schema).required).toEqual(['q']);
    expect((toolNamed('get-project').inputSchema as Schema).required).toEqual(['slug']);
    expect((toolNamed('describe-site').inputSchema as Schema).required).toBeUndefined();
  });

  it('returns a text content block from every execute', async () => {
    const results = await Promise.all([
      toolNamed('search-projects').execute({ q: 'graphrag' }),
      toolNamed('get-project').execute({ slug: 'shepherd' }),
      toolNamed('describe-site').execute({}),
    ]);

    for (const result of results) {
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text.length).toBeGreaterThan(20);
    }
  });
});

describe('query-to-project mapping', () => {
  it('maps a keyword to the project that owns it, best match first', () => {
    expect(searchProjects('regex')[0].slug).toBe('nl2regex');
    expect(searchProjects('graphrag')[0].slug).toBe('shepherd');
    expect(searchProjects('ultrasonography').map((p) => p.slug)).toContain(
      'robotic-arm-ultrasound',
    );
  });

  it('only ever returns projects that are actually published', () => {
    for (const hit of searchProjects('agent')) {
      expect(projects).toContain(hit);
    }
  });

  it('returns nothing for an empty query, and says so without throwing', () => {
    expect(searchProjects('   ')).toEqual([]);
    const answer = formatSearchResults('   ', []);
    expect(answer).toMatch(/no project matches/i);
    expect(answer).toContain('shepherd');
  });

  it('names the artifact that settles a hit, and says when nothing public does', () => {
    const settled = formatSearchResults('regex', searchProjects('regex'));
    expect(settled).toContain(getProjectBySlug('nl2regex')!.proof!.settles);
    expect(settled).toContain('github.com/Ravicha2/NL2REGEX/blob/');

    // Shepherd's benchmark has no public permalink, so the answer may not claim one.
    const carried = formatSearchResults('graphrag', searchProjects('graphrag'));
    expect(carried).toContain(getProjectBySlug('shepherd')!.proofLine!);
    expect(carried).toMatch(/without a public artifact/i);
  });

  it('answers a search hit with the same project the catalog renders', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProjectsView />
      </MemoryRouter>,
    );

    const [hit] = searchProjects('regex');
    const card = screen.getByTestId(`project-card-${hit.slug}`);
    expect(within(card).getByRole('link', { name: hit.title })).toBeInTheDocument();
    expect(formatSearchResults('regex', [hit])).toContain(hit.title);
  });
});

describe('get-project handler', () => {
  it('reads one project’s trade-offs and verification from the same data as its page', () => {
    const project = getProjectBySlug('nl2regex')!;
    const answer = projectDetail('nl2regex');

    for (const tradeOff of project.caseStudy!.whyBuiltThisWay.tradeOffs) {
      expect(answer).toContain(tradeOff.decision);
    }
    for (const check of project.caseStudy!.outcomes.verification) {
      expect(answer).toContain(check);
    }
    expect(answer).toContain(canonicalUrlFor('/projects/nl2regex'));
  });

  it('names the published slugs when asked for one that does not exist', () => {
    const answer = projectDetail('does-not-exist');
    expect(answer).toMatch(/no project is published/i);
    expect(answer).toContain('shepherd');
  });

  it('still answers for a supporting project that has no case study', () => {
    const answer = projectDetail('node-api');
    expect(answer).toContain(getProjectBySlug('node-api')!.title);
    expect(answer).toMatch(/no case study is published/i);
  });
});

describe('describe-site handler', () => {
  it('answers what the site publishes and where each document lives', () => {
    const answer = describeSite();
    expect(answer).toContain(profile.name);
    expect(answer).toContain(profile.title);

    expect(answer).toContain(canonicalUrlFor('/'));
    expect(answer).toContain(canonicalUrlFor('/projects'));
    expect(answer).toContain(canonicalUrlFor('/experience'));
    for (const project of projects) {
      expect(answer).toContain(canonicalUrlFor(`/projects/${project.slug}`));
    }

    expect(answer).toContain(`${SITE}/llms.txt`);
    expect(answer).toContain(`${SITE}/llms-full.txt`);
    expect(answer).toContain(`${SITE}/sitemap.xml`);
    expect(answer).toContain(`${SITE}/cv.pdf`);
  });
});

describe('feature detection', () => {
  it('finds no modelContext, registers nothing, and does not throw where the API is absent', () => {
    clearModelContext();
    expect(modelContextOf(document)).toBeUndefined();
    expect(installWebMcpTools(document)).toBeNull();
  });

  it('renders nothing and does not throw without modelContext', () => {
    clearModelContext();
    const { container } = render(<WebMcpTools />);
    expect(container).toBeEmptyDOMElement();
  });

  it('registers all three tools on a document that has modelContext', async () => {
    const { registered } = stubModelContext();
    const installed = installWebMcpTools(document);
    expect(installed).not.toBeNull();

    await installed!.settled;
    expect(registered.map((r) => r.tool.name).sort()).toEqual([
      'describe-site',
      'get-project',
      'search-projects',
    ]);
    for (const { tool, options } of registered) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
      expect(options?.signal).toBeInstanceOf(AbortSignal);
    }
  });

  it('lists the registered tools through getTools()', async () => {
    const { registered } = stubModelContext();
    const modelContext = modelContextOf(document)!;
    await registerWebMcpTools(modelContext, signal());
    expect(registered).toHaveLength(3);

    const listed = await modelContext.getTools();
    expect(listed.map((t) => t.name).sort()).toEqual([
      'describe-site',
      'get-project',
      'search-projects',
    ]);
  });

  it('unregisters on unmount by aborting the signal', async () => {
    const { registered } = stubModelContext();
    const { unmount } = render(<WebMcpTools />);

    await waitFor(() => expect(registered).toHaveLength(3));
    const signal = registered[0].options!.signal!;
    expect(signal.aborted).toBe(false);

    unmount();
    expect(signal.aborted).toBe(true);
  });
});
