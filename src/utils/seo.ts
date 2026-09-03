import { profile } from '../data/profile';
import { projects, getProjectBySlug } from '../data/projects';
import { publications } from '../data/experience';

export interface RouteMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'profile' | 'article';
}

export function getRouteMeta(pathname: string): RouteMeta {
  const baseUrl = 'https://ravicha2.github.io';

  if (pathname === '/') {
    return {
      title: 'Palm Suksawasdi | Portfolio & Systems Engineering',
      description: profile.headline,
      canonicalUrl: `${baseUrl}/`,
      ogType: 'profile',
    };
  }

  if (pathname === '/projects') {
    return {
      title: 'Projects & Case Studies | Palm Suksawasdi',
      description: 'Curated engineering case studies in Agentic AI, GraphRAG, and Distributed Systems.',
      canonicalUrl: `${baseUrl}/projects`,
      ogType: 'website',
    };
  }

  if (pathname.startsWith('/projects/')) {
    const slug = pathname.replace('/projects/', '');
    const project = getProjectBySlug(slug);
    if (project) {
      return {
        title: `${project.title} | Palm Suksawasdi`,
        description: project.summary,
        canonicalUrl: `${baseUrl}/projects/${slug}`,
        ogType: 'article',
      };
    }
  }

  if (pathname === '/experience') {
    return {
      title: 'Engineering Experience & Timeline | Palm Suksawasdi',
      description: 'Career journey, systems engineering background, education at UNSW and Chulalongkorn, and publications.',
      canonicalUrl: `${baseUrl}/experience`,
      ogType: 'profile',
    };
  }

  return {
    title: 'Palm Suksawasdi | Portfolio & Systems Engineering',
    description: profile.headline,
    canonicalUrl: `${baseUrl}${pathname}`,
    ogType: 'website',
  };
}

export function generateJsonLdForRoute(pathname: string): Record<string, any> {
  const baseUrl = 'https://ravicha2.github.io';
  const personEntity = {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: `${profile.preferredName} (${profile.fullName.split(' ')[0]}) ${profile.fullName.split(' ').slice(1).join(' ')}`,
    alternateName: profile.name,
    jobTitle: profile.title,
    description: profile.headline,
    url: `${baseUrl}/`,
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

  if (pathname === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'ProfilePage',
          '@id': `${baseUrl}/#profilepage`,
          url: `${baseUrl}/`,
          name: 'Palm Suksawasdi | Portfolio & Systems Engineering',
          mainEntity: { '@id': `${baseUrl}/#person` },
        },
      ],
    };
  }

  if (pathname === '/projects') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'CollectionPage',
          '@id': `${baseUrl}/projects#collection`,
          url: `${baseUrl}/projects`,
          name: 'Projects & Case Studies | Palm Suksawasdi',
          description: 'Engineering case studies covering Agentic AI, GraphRAG, Distributed Systems, and Robotics.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((p, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: p.title,
              url: `${baseUrl}/projects/${p.slug}`,
              description: p.summary,
            })),
          },
        },
      ],
    };
  }

  if (pathname.startsWith('/projects/')) {
    const slug = pathname.replace('/projects/', '');
    const project = getProjectBySlug(slug);

    if (project) {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          personEntity,
          {
            '@type': 'SoftwareSourceCode',
            '@id': `${baseUrl}/projects/${slug}#software`,
            name: project.title,
            description: project.summary,
            url: `${baseUrl}/projects/${slug}`,
            codeRepository: project.links.github || undefined,
            programmingLanguage: project.tags.filter((t) =>
              ['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'SQL', 'Cypher'].includes(t)
            ),
            runtimePlatform: project.tags.join(', '),
            author: { '@id': `${baseUrl}/#person` },
          },
        ],
      };
    }
  }

  if (pathname === '/experience') {
    const pub = publications[0];
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'AboutPage',
          '@id': `${baseUrl}/experience#about`,
          url: `${baseUrl}/experience`,
          name: 'Engineering Experience & Timeline | Palm Suksawasdi',
          description: 'Career journey, systems engineering background, education at UNSW, and publications.',
          mainEntity: { '@id': `${baseUrl}/#person` },
        },
        ...(pub
          ? [
              {
                '@type': 'ScholarlyArticle',
                '@id': `${baseUrl}/experience#publication-${pub.id}`,
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
