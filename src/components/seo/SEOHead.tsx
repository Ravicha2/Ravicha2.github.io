import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta, generateJsonLdForRoute } from '../../utils/seo';

export const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);

    // Update document title
    document.title = meta.title;

    // Update or create meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    // Update or create canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', meta.canonicalUrl);

    // Update OpenGraph tags
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) ogUrlTag.setAttribute('content', meta.canonicalUrl);

    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', meta.title);

    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', meta.description);

    // Update Twitter tags
    let twTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twTitleTag) twTitleTag.setAttribute('content', meta.title);

    let twDescTag = document.querySelector('meta[name="twitter:description"]');
    if (twDescTag) twDescTag.setAttribute('content', meta.description);

    // Dynamic JSON-LD injection
    const jsonLdData = generateJsonLdForRoute(location.pathname);
    let jsonLdScript = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'dynamic-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLdData, null, 2);
  }, [location.pathname]);

  return null;
};

export default SEOHead;
