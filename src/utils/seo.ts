import { profile } from '../data/profile';
import { projects, getProjectBySlug } from '../data/projects';
import { publications } from '../data/experience';

export interface RouteMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'profile' | 'article';
}

export const SITE = 'https://ravicha2.github.io';

/** The name as it is written in a title. Declared once so the ten titles below cannot drift apart. */
const NAME = profile.name;

/**
 * The questions this domain can actually answer, and the answers the pages already
 * give. Emitted as FAQPage on the home route only: schema.org expects one FAQ page
 * per site, and every answer here is restated from a page that can be checked,
 * so the markup adds a route to the answer rather than a new claim.
 */
export const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: `Who is ${NAME}?`,
    answer: `${NAME} (known as ${profile.preferredName}) is an ${profile.title} based in ${profile.location}. ${profile.summary}`,
  },
  {
    question: `What is ${profile.preferredName} working on now?`,
    answer: `${profile.status} Current work covers GraphRAG architectural compliance, fault-tolerant multi-agent orchestration, and distributed data engines. ${profile.narrative.appliedAi}`,
  },
  {
    question: 'Which published artifacts back the claims on this site?',
    answer:
      'Each project page quotes the artifact that settles its headline figure and pins the quote to a repository and a commit, so the claim can be checked rather than taken on trust. Where a figure rests on work that is not public, the page says so beside the figure.',
  },
  {
    question: 'Is there a machine-readable API for this site?',
    answer: `Yes. An OpenAPI 3.1 document is published at ${SITE}/openapi.json, with one GET operation per document the origin serves and an operationId on every operation. The human-readable reference is at ${SITE}/docs/, and the agent dossiers are at ${SITE}/llms.txt and ${SITE}/llms-full.txt.`,
  },
  {
    question: 'How can an agent or a person get in touch?',
    answer: `By email at ${profile.email}. The contact page at ${SITE}/contact/ states what to expect back. There is no form on the site and no support queue behind it — the address reaches ${profile.preferredName} directly.`,
  },
  {
    question: 'Does this site collect any data about visitors?',
    answer:
      'No. There is no analytics script, no cookie, and no client-side storage. Requests reach GitHub Pages, which may keep ordinary server logs under its own privacy statement. The details are at ' +
      `${SITE}/privacy/.`,
  },
];

/**
 * Where a route sits in the site, as a BreadcrumbList. Every route here is one
 * step below the root and the root is the only ancestor a reader can name, so a
 * two-item trail is the honest one — inventing a middle level would describe
 * navigation the site does not have.
 */
const breadcrumb = (path: string, name: string) => ({
  '@type': 'BreadcrumbList',
  '@id': `${SITE}${path === '/' ? '' : path}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Overview', item: canonicalUrlFor('/') },
    ...(path === '/'
      ? []
      : [{ '@type': 'ListItem', position: 2, name, item: canonicalUrlFor(path) }]),
  ],
});

/**
 * GitHub Pages serves a directory-backed route at its trailing-slash URL and 301s the
 * bare one, so a browser sitting on /projects holds `/projects/`. The router and the
 * build both carry the bare form. The two have to reach the same meta: while they did
 * not, every deep route matched no branch here and canonicalised itself to the home
 * page under the title "Page not found" — the opposite of what prerendering was for.
 */
const normalize = (pathname: string): string => {
  const bare = pathname.replace(/\/+$/, '');
  return bare === '' ? '/' : bare;
};

/** The URL a route is actually served at. Bare directory routes 301, so state the served form. */
export const canonicalUrlFor = (route: string): string =>
  route === '/' ? `${SITE}/` : `${SITE}${route}/`;

export function getRouteMeta(pathname: string): RouteMeta {
  const path = normalize(pathname);

  if (path === '/') {
    return {
      title: `${NAME} | Portfolio & Systems Engineering`,
      description: profile.headline,
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'profile',
    };
  }

  if (path === '/projects') {
    return {
      title: `Projects & Case Studies | ${NAME}`,
      description: 'Curated engineering case studies in Agentic AI, GraphRAG, and Distributed Systems.',
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'website',
    };
  }

  if (path.startsWith('/projects/')) {
    const slug = path.replace('/projects/', '');
    const project = getProjectBySlug(slug);
    if (project) {
      return {
        title: `${project.title} | ${NAME}`,
        description: project.summary,
        canonicalUrl: canonicalUrlFor(`/projects/${slug}`),
        ogType: 'article',
      };
    }
  }

  if (path === '/experience') {
    return {
      title: `Engineering Experience & Timeline | ${NAME}`,
      description: 'Career journey, systems engineering background, education at UNSW and Chulalongkorn, and publications.',
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'profile',
    };
  }

  // The trust anchors and the machine surface. Each has its own title and its
  // own description, because a crawler or an agent that fetches two of them
  // should not be told they are the same page.
  if (path === '/about') {
    return {
      title: `About ${profile.preferredName} | ${NAME}`,
      description: `Who ${NAME} is, where the systems engineering came from, and how the claims on this site are kept checkable.`,
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'profile',
    };
  }

  if (path === '/contact') {
    return {
      title: `Contact | ${NAME}`,
      description: `How to reach ${NAME} (${profile.preferredName}) — the inbox that is read, and what to expect back.`,
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'website',
    };
  }

  if (path === '/privacy') {
    return {
      title: `Privacy | ${NAME}`,
      description: 'What this site collects (nothing), which third parties see the request, and what is true for agents reading it.',
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'website',
    };
  }

  if (path === '/developers') {
    return {
      title: `Developer portal | ${NAME}`,
      description: 'The machine-readable surface of this site: quickstart, authentication, sandbox, and the full endpoint table.',
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'website',
    };
  }

  if (path === '/docs') {
    return {
      title: `API reference | ${NAME}`,
      description: `The operations in the published OpenAPI 3.1 document for ${SITE}, with the media type each one really returns.`,
      canonicalUrl: canonicalUrlFor(path),
      ogType: 'website',
    };
  }

  // Nothing matched: an unknown path, or a slug that resolves to no project. The
  // page renders a not-found view, so canonicalising it to its own URL tells a
  // crawler to index a dead end as itself. Point at the root instead — the URL
  // that does exist and does describe this person.
  return {
    title: `Page not found | ${NAME}`,
    description: profile.headline,
    canonicalUrl: `${SITE}/`,
    ogType: 'website',
  };
}

export function generateJsonLdForRoute(pathname: string): Record<string, any> {
  const path = normalize(pathname);

  const personEntity = {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: NAME,
    // The nickname, so a tool that knows this person as "Palm" — LinkedIn, PyPI, the
    // IEEE paper — lands on the same entity as one that knows them as "Ravicha".
    alternateName: profile.preferredName,
    jobTitle: profile.title,
    description: profile.headline,
    url: canonicalUrlFor("/"),
    email: profile.email,
    sameAs: [
      profile.links.github,
      profile.links.linkedin,
      'https://pypi.org/project/lit-review-council/',
      'https://ieeexplore.ieee.org/document/10349000',
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'UNSW Sydney',
        url: 'https://www.unsw.edu.au/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Chulalongkorn University',
        url: 'https://www.chula.ac.th/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'IMT Atlantique',
        url: 'https://www.imt-atlantique.fr/',
      },
    ],
    knowsAbout: [
      'Applied AI',
      'Multi-Agent Systems',
      'Model Context Protocol',
      'GraphRAG',
      'Distributed Systems',
      'PySpark',
      'Neo4j',
      'Inngest',
      'FastAPI',
      'NestJS',
    ],
  };

  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'ProfilePage',
          '@id': `${SITE}/#profilepage`,
          url: canonicalUrlFor("/"),
          name: getRouteMeta('/').title,
          mainEntity: { '@id': `${SITE}/#person` },
        },
        // What can actually be commissioned. Kept to the three things the site
        // can stand behind — the two open-source engines and the MCP server —
        // rather than listing every catalogue row as an offering.
        {
          '@type': 'Service',
          '@id': `${SITE}/#service`,
          name: 'Applied AI and backend systems engineering',
          serviceType: 'Applied AI, agentic systems and backend infrastructure engineering',
          description: profile.headline,
          provider: { '@id': `${SITE}/#person` },
          areaServed: { '@type': 'Place', name: profile.location },
          availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: canonicalUrlFor('/contact'),
            availableLanguage: 'en',
          },
        },
        // Real questions with real answers, taken from what the pages already
        // say. Every answer is checkable against a page on this site, which is
        // the only reason a FAQPage is worth emitting at all.
        {
          '@type': 'FAQPage',
          '@id': `${SITE}/#faq`,
          url: canonicalUrlFor('/'),
          mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        },
        breadcrumb('/', 'Overview'),
      ],
    };
  }

  if (path === '/projects') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'CollectionPage',
          '@id': `${SITE}/projects#collection`,
          url: canonicalUrlFor("/projects"),
          name: getRouteMeta('/projects').title,
          description: 'Engineering case studies covering Agentic AI, GraphRAG, Distributed Systems, and Robotics.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((p, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: p.title,
              url: canonicalUrlFor(`/projects/${p.slug}`),
              description: p.summary,
            })),
          },
        },
        breadcrumb('/projects', 'Projects'),
      ],
    };
  }

  if (path.startsWith('/projects/')) {
    const slug = path.replace('/projects/', '');
    const project = getProjectBySlug(slug);

    if (project) {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          personEntity,
          {
            '@type': 'SoftwareSourceCode',
            '@id': `${SITE}/projects/${slug}#software`,
            name: project.title,
            description: project.summary,
            url: canonicalUrlFor(`/projects/${slug}`),
            codeRepository: project.links.github || undefined,
            programmingLanguage: project.tags.filter((t) =>
              ['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'SQL', 'Cypher'].includes(t)
            ),
            runtimePlatform: project.tags.join(', '),
            author: { '@id': `${SITE}/#person` },
          },
          breadcrumb(`/projects/${slug}`, project.title),
        ],
      };
    }
  }

  if (path === '/experience') {
    const pub = publications[0];
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'AboutPage',
          '@id': `${SITE}/experience#about`,
          url: canonicalUrlFor("/experience"),
          name: getRouteMeta('/experience').title,
          description: 'Career journey, systems engineering background, education at UNSW, and publications.',
          mainEntity: { '@id': `${SITE}/#person` },
        },
        ...(pub
          ? [
              {
                '@type': 'ScholarlyArticle',
                '@id': `${SITE}/experience#publication-${pub.id}`,
                name: pub.title,
                headline: pub.title,
                url: pub.link,
                datePublished: pub.date,
                author: pub.authors.map((authorName) => ({
                  '@type': 'Person',
                  name: authorName,
                })),
                publisher: {
                  '@type': 'Organization',
                  name: 'IEEE',
                },
              },
            ]
          : []),
        breadcrumb('/experience', 'Experience'),
      ],
    };
  }

  // The new pages. Each is a real page with real prose, so each gets its own
  // mainEntity node rather than falling through to the bare person graph — an
  // agent that fetches /privacy/ and finds only a Person would be told nothing
  // about the page it just read.
  const pageNode = ((): Record<string, any> | null => {
    if (path === '/about') {
      return {
        '@type': 'AboutPage',
        '@id': `${SITE}/about#about`,
        url: canonicalUrlFor('/about'),
        name: getRouteMeta('/about').title,
        description: getRouteMeta('/about').description,
        mainEntity: { '@id': `${SITE}/#person` },
      };
    }
    if (path === '/contact') {
      return {
        '@type': 'ContactPage',
        '@id': `${SITE}/contact#contact`,
        url: canonicalUrlFor('/contact'),
        name: getRouteMeta('/contact').title,
        description: getRouteMeta('/contact').description,
        mainEntity: { '@id': `${SITE}/#person` },
      };
    }
    if (path === '/privacy') {
      return {
        '@type': 'WebPage',
        '@id': `${SITE}/privacy#privacy`,
        url: canonicalUrlFor('/privacy'),
        name: getRouteMeta('/privacy').title,
        description: getRouteMeta('/privacy').description,
        about: { '@id': `${SITE}/#person` },
        audience: { '@type': 'Audience', audienceType: 'Visitors and automated agents' },
      };
    }
    if (path === '/developers') {
      return {
        '@type': 'WebPage',
        '@id': `${SITE}/developers#developers`,
        url: canonicalUrlFor('/developers'),
        name: getRouteMeta('/developers').title,
        description: getRouteMeta('/developers').description,
        about: [
          { '@type': 'WebAPI', name: 'Portfolio Agent API', documentation: canonicalUrlFor('/docs') },
        ],
      };
    }
    if (path === '/docs') {
      return {
        '@type': 'WebPage',
        '@id': `${SITE}/docs#docs`,
        url: canonicalUrlFor('/docs'),
        name: getRouteMeta('/docs').title,
        description: getRouteMeta('/docs').description,
        about: [
          { '@type': 'WebAPI', name: 'Portfolio Agent API', documentation: `${SITE}/openapi.json` },
        ],
      };
    }
    return null;
  })();

  if (pageNode) {
    return {
      '@context': 'https://schema.org',
      '@graph': [personEntity, pageNode, breadcrumb(path, getRouteMeta(path).title.split(' | ')[0])],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [personEntity],
  };
}
