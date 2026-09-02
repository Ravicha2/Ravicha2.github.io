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
  video?: string;
  paper?: string;
  docs?: string;
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
  metrics?: string[];
  summary: string;
  caseStudy?: CaseStudyContent;
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
}

export interface AccoladeItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  link?: string;
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
