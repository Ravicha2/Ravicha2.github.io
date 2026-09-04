import type React from 'react';
import { useState, useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { TransitionLink } from '../common/TransitionLink';

const heroImg = '/assets/Hero.jpeg';

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

// Token chunks for generative AI streaming effect
const HEADLINE_TOKENS = ['I', ' li','ke', ' bu', 'il', 'd', 'ing', ' A', 'gen', 'tic', ' Soft', 'wa', 're', '.'];

export const HeroNarrative: React.FC = () => {
  const [displayedTokens, setDisplayedTokens] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Immediate render if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayedTokens(HEADLINE_TOKENS);
      setIsComplete(true);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < HEADLINE_TOKENS.length) {
        const nextToken = HEADLINE_TOKENS[currentIndex];
        setDisplayedTokens((prev) => [...prev, nextToken]);
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <section aria-labelledby="hero-title" className="space-y-6 pt-2 pb-6">
      <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
        {/* Left: Text & Actions */}
        <div className="flex-1 space-y-4 max-w-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted tracking-wider uppercase">
              <span>{profile.name}</span>
              <span>·</span>
              <span className="text-accent-solid font-semibold">{profile.title}</span>
            </div>

            <h1
              id="hero-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.12] min-h-[2.5rem] sm:min-h-[3.25rem]"
            >
              {displayedTokens.map((token, index) => (
                <span
                  key={index}
                  className={`transition-colors duration-150 ${
                    index === displayedTokens.length - 1 && !isComplete
                      ? 'text-accent-solid'
                      : 'text-text-primary'
                  }`}
                >
                  {token}
                </span>
              ))}
              {!isComplete && (
                <span
                  className="inline-block w-2.5 sm:w-3 h-6 sm:h-8 bg-accent-solid ml-1 align-middle animate-pulse"
                  aria-hidden="true"
                />
              )}
            </h1>
          </div>

          {/* Systems Narrative */}
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed text-pretty">
            Building fault-tolerant multi-agent pipelines, GraphRAG memory systems, and distributed data engines. Master of IT candidate at UNSW Sydney.
          </p>

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
        </div>

        {/* Right: Hero Image */}
        <div className="flex-shrink-0 self-center md:self-auto">
          <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border border-border-subtle bg-surface shadow-sm hover:border-border-strong transition-all duration-300">
            <img
              src={heroImg}
              alt="Palm Suksawasdi"
              className="w-full h-full object-cover object-center hover:scale-[1.03] transition-transform duration-300"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNarrative;
