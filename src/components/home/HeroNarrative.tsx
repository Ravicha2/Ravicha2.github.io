import type React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { TransitionLink } from '../common/TransitionLink';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" r="2" />
  </svg>
);

export const HeroNarrative: React.FC = () => {
  return (
    <section aria-labelledby="hero-title" className="space-y-6 pt-2 pb-6">
      {/* Heading and Thesis */}
      <div className="space-y-3">
        {/* <div className="flex items-center gap-2 text-xs font-mono text-text-muted tracking-wider uppercase">
          <span>{profile.name}</span>
          <span>·</span>
          <span className="text-accent-solid font-semibold">{profile.title}</span>
        </div> */}

        <h1
          id="hero-title"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] text-balance max-w-2xl"
        >
          I like building Agentic Software.
        </h1>
      </div>

      {/* Core Systems Narrative
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl text-pretty">
        Building fault-tolerant multi-agent pipelines, GraphRAG memory systems, and distributed data engines. Master of IT candidate at UNSW Sydney.
      </p> */}

      {/* Action Links & Social Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <TransitionLink
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md bg-accent-solid text-white dark:text-zinc-950 hover:bg-opacity-90 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas shadow-sm"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </TransitionLink>

        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Palm's GitHub profile (opens in a new tab)"
        >
          <GithubIcon className="w-4 h-4" />
          <span>GitHub</span>
        </a>

        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Palm's LinkedIn profile (opens in a new tab)"
        >
          <LinkedinIcon className="w-4 h-4" />
          <span>LinkedIn</span>
        </a>

        <a
          href={profile.links.email}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Send email to Palm"
        >
          <Mail className="w-4 h-4 text-accent-solid" aria-hidden="true" />
          <span>Email</span>
        </a>
      </div>
    </section>
  );
};

export default HeroNarrative;
