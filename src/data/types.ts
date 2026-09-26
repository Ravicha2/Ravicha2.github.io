export interface ProfileLinks {
  github: string;
  linkedin: string;
  email: string;
  website: string;
}

export interface ProfileNarrative {
  origin: string;
  systemsMindset: string;
  appliedAi: string;
  target: string;
  paragraphs: string[];
}

export interface Profile {
  name: string;
  preferredName: string;
  fullName: string;
  title: string;
  headline: string;
  status: string;
  location: string;
  email: string;
  links: ProfileLinks;
  narrative: ProfileNarrative;
  summary: string;
}

export type ProjectCategory =
  | 'agentic-ai'
  | 'distributed-systems'
  | 'graph-rag'
  | 'robotics'
  | 'full-stack';

export interface CategoryOption {
  id: ProjectCategory | 'all';
  label: string;
}

export interface CaseStudyTradeOff {
  decision: string;
  rationale: string;
  vsAlternative?: string;
}

export interface CaseStudyIntuition {
  spark: string;
  naiveFailureMode: string;
  summary: string;
}

export interface CaseStudyProblem {
  edgeCases: string[];
  constraints: string[];
  summary: string;
}

export interface CaseStudyArchitecture {
  architecturalInsight: string;
  tradeOffs: CaseStudyTradeOff[];
  guardrails?: string[];
  summary: string;
}

export interface CaseStudyOutcomes {
  verification: string[];
  impact: string[];
  takeaway: string;
  summary: string;
}

export interface CaseStudyContent {
  intuition: CaseStudyIntuition;
  problemEncountered: CaseStudyProblem;
  whyBuiltThisWay: CaseStudyArchitecture;
  outcomes: CaseStudyOutcomes;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  pypi?: string;
  paper?: string;
  docs?: string;
}

/**
 * How a claim is settled. The shape of the rendered artifact follows the kind:
 * a `table` is a real table, a `trace` is an ordered run of lines, a `capture`
 * is a verbatim excerpt of the mechanism itself.
 */
export type ProofKind = 'table' | 'trace' | 'capture';

/**
 * Bytes quoted from a public repository, pinned to the commit they were read at.
 * `commit` is a SHA and never a branch: a link to `main` at `#L41` drifts the
 * moment the file changes, so the reference stops resolving to what it claims.
 */
export interface ProofArtifact {
  kind: ProofKind;
  /** `owner/name` */
  repo: string;
  commit: string;
  path: string;
  /** inclusive, 1-based, in the pinned blob */
  from: number;
  to: number;
  /** the claim this artifact settles */
  settles: string;
  /** the quoted bytes, verbatim */
  quote: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  featured: boolean;
  role: string;
  timeline: string;
  tags: string[];
  links: ProjectLinks;
  // `value` is the measurement (a figure, count, rate, or verifiable state); `label` names
  // what was measured. A category name belongs in the label, never the value.
  metrics?: { value: string; label: string }[];
  summary: string;
  caseStudy?: CaseStudyContent;
  /** The artifact that settles this project's headline claim. Flagship tier only. */
  proof?: ProofArtifact;
  /** One monochrome line of real output, carried by the catalog's flagship tier. */
  proofLine?: string;
  image?: string;
  /** What the image shows, when it is not a capture of the repository. */
  imageAlt?: string;
  imageCaption?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string[];
  highlights?: string[];
  tags: string[];
  link?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  location: string;
  period: string;
  grade?: string;
  details: string[];
}

export interface PublicationItem {
  id: string;
  title: string;
  conference: string;
  year: number;
  date: string;
  role: string;
  authors: string[];
  description: string[];
  advisor?: string;
  link?: string;
  image?: string;
  imageCaption?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface AccoladeItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  link?: string;
  image?: string;
  imageCaption?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceData {
  work: WorkExperience[];
  education: EducationItem[];
  publications: PublicationItem[];
  accolades: AccoladeItem[];
  skills: SkillCategory[];
}
