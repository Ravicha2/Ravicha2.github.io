import type React from 'react';
import { Mail, ArrowRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';

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
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const HeroNarrative: React.FC = () => {
  return (
    <section aria-labelledby="hero-title" className="space-y-8">
      {/* Header & Status Badge */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div
            data-testid="status-badge"
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-full bg-accent-badge-bg text-accent-badge-text border border-border-subtle"
          >
            <span className="w-2 h-2 rounded-full bg-accent-solid" aria-hidden="true" />
            <span>Open to full-time roles (graduating Dec 2026)</span>
          </div>
          <span className="text-xs font-mono text-text-muted">{profile.location}</span>
        </div>

        <div className="space-y-1">
          <h1 id="hero-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            {profile.name}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-text-secondary">
            {profile.title}
          </p>
        </div>

        <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
          {profile.headline}
        </p>
      </div>

      {/* Automotive to AI: Engineering Philosophy Narrative Card */}
      <div className="bg-surface border border-border-subtle rounded-lg p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          <Cpu className="w-4 h-4 text-accent-solid" aria-hidden="true" />
          <span>The Engineering Pivot · Automotive to AI</span>
        </div>

        <div className="space-y-3 text-sm sm:text-base text-text-secondary leading-relaxed">
          <p>
            Originally trained in <strong className="text-text-primary font-semibold">Automotive Design & Manufacturing Engineering</strong> at Chulalongkorn University, I spent years designing physical structures where material stress limits, fluid dynamics, and catastrophic failure modes were absolute.
          </p>
          <p>
            During an IoT exchange at <strong className="text-text-primary font-semibold">IMT Atlantique</strong> in France right as modern LLMs took off, I witnessed how software intelligence could revolutionize engineered systems. That pivotal moment sparked my decisive transition to Computer Science and Applied AI.
          </p>
          <p>
            Today, I bring that physical engineering rigor to AI: treating non-deterministic models as <span className="text-text-primary font-medium">untrusted components</span> within deterministic software architecture. Rather than relying on fragile single-prompt scripts, I engineer fault-tolerant multi-agent orchestrations, graph-based compliance verifiers, schema-safe distributed pipelines, and durable execution state machines.
          </p>
        </div>
      </div>

      {/* Action Links & Social Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Palm's GitHub profile (opens in a new tab)"
        >
          <GithubIcon className="w-4 h-4" />
          <span>GitHub</span>
        </a>

        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Palm's LinkedIn profile (opens in a new tab)"
        >
          <LinkedinIcon className="w-4 h-4" />
          <span>LinkedIn</span>
        </a>

        <a
          href={profile.links.email}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          aria-label="Send email to Palm"
        >
          <Mail className="w-4 h-4" aria-hidden="true" />
          <span>Email</span>
        </a>

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-accent-solid text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default HeroNarrative;
