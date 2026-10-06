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
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [personEntity],
  };
}
