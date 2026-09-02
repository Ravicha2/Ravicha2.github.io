import {
  WorkExperience,
  EducationItem,
  PublicationItem,
  AccoladeItem,
  SkillCategory,
  ExperienceData,
} from './types';

export const workExperience: WorkExperience[] = [
  {
    id: 'tendor',
    company: 'Tendor',
    role: 'Software Engineer Intern',
    location: 'Sydney, Australia',
    period: 'Jul 2026 - Present',
    startDate: '2026-07',
    endDate: 'Present',
    isCurrent: true,
    description: [
      'Built a Google ADK pipeline that extracts and classifies complex procurement documents for downstream agents.',
      'Built a Documenso signing service exposed to agents via Model Context Protocol (MCP) tools.',
      'Designed automated validation steps ensuring deterministic metadata schemas before downstream agent handoff.',
    ],
    highlights: [
      'Google ADK procurement extraction',
      'Documenso MCP tool integration',
    ],
    tags: ['Google ADK', 'MCP', 'Documenso', 'TypeScript', 'Node.js', 'AI Agents'],
  },
  {
    id: 'nodesnow',
    company: 'NodesNow LLC',
    role: 'Backend Engineer Intern',
    location: 'Bangkok, Thailand',
    period: 'Dec 2025 - Feb 2026',
    startDate: '2025-12',
    endDate: '2026-02',
    isCurrent: false,
    description: [
      'Engineered a fault-tolerant AI agent orchestration system using Inngest to manage document ingestion workflows, handling automated retries and fan-in/fan-out concurrency, eliminating manual failure intervention.',
      'Persisted ingested data into pgvector and Neo4j to support downstream RAG features.',
      'Containerized the full stack (backend services, Inngest server, and databases), enabling reproducible local development and smooth infrastructure migration.',
      'Implemented end-to-end with NestJS (backend) and React (frontend).',
    ],
    highlights: [
      'Fault-tolerant Inngest orchestration',
      'Dual pgvector + Neo4j storage',
      'Full-stack containerization',
    ],
    tags: ['Inngest', 'NestJS', 'Neo4j', 'pgvector', 'PostgreSQL', 'Docker', 'React', 'TypeScript'],
    link: 'https://github.com/Ravicha2/document-ingestion-agent',
  },
  {
    id: '3d-technical-design',
    company: '3D Technical Design',
    role: 'District Heating Designer',
    location: 'Bangkok, Thailand',
    period: 'Aug 2023 - Jan 2025',
    startDate: '2023-08',
    endDate: '2025-01',
    isCurrent: false,
    description: [
      'Designed 2D and 3D route arrangements with stress calculations for heat distribution across 10+ UK sites.',
      'Identified operational hazards for contractors in construction and handover phases.',
      'Mentored an intern and colleagues on construction design workflows and structural CAD modeling.',
    ],
    highlights: [
      'Stress calculations across 10+ UK sites',
      'Structural hazard mitigation',
      'Technical mentorship',
    ],
    tags: ['Civil 3D', 'sisKMR', 'Stress Calculations', 'CAD', 'Systems Engineering'],
  },
  {
    id: 'jardine-schindler',
    company: 'Jardine Schindler Group',
    role: 'Systems Engineering Intern',
    location: 'Bangkok, Thailand',
    period: 'Jun 2022 - Aug 2022',
    startDate: '2022-06',
    endDate: '2022-08',
    isCurrent: false,
    description: [
      'Conducted electromechanical systems engineering analysis for vertical transportation and elevator systems.',
      'Inspected installation tolerances, safety compliance standards, and mechanical sensor systems across commercial facilities.',
      'Collaborated with senior field engineers on preventative maintenance protocols and diagnostic workflows.',
    ],
    highlights: [
      'Electromechanical systems analysis',
      'Safety and tolerance verification',
    ],
    tags: ['Electromechanical Systems', 'Safety Standards', 'Sensors', 'Diagnostics'],
  },
];

export const education: EducationItem[] = [
  {
    id: 'unsw',
    degree: 'Master of Information Technology',
    field: 'Computer Science & AI',
    institution: 'UNSW Sydney',
    location: 'Sydney, Australia',
    period: 'Feb 2025 - Dec 2026 (Expected)',
    grade: 'WAM 83 (Distinction average)',
    details: [
      'Distinction average (WAM 83).',
      'Relevant coursework in Advanced Algorithms, Artificial Intelligence, Distributed Systems, and Software Construction.',
      'Conducting research in GraphRAG memory management and architectural compliance for intelligent coding agents.',
    ],
  },
  {
    id: 'imt-atlantique',
    degree: 'Exchange Study - Master of Science in Information Technology',
    field: 'Architecture and Engineering in IoT',
    institution: 'IMT Atlantique',
    location: 'Rennes, France',
    period: 'Sep 2022 - Jan 2023',
    details: [
      'Specialisation in Architecture and Engineering in IoT.',
      'Key turning point sparking the transition from physical automotive engineering to computer science and applied AI.',
      'Studied distributed systems, networking protocols, embedded Linux, and sensor networks.',
    ],
  },
  {
    id: 'chulalongkorn',
    degree: 'Bachelor of Automotive Design and Manufacturing Engineering',
    field: 'Automotive & Mechanical Systems Engineering',
    institution: 'Chulalongkorn University',
    location: 'Bangkok, Thailand',
    period: 'Aug 2019 - Aug 2023',
    details: [
      'Comprehensive physical systems engineering curriculum: Mechanical Engineering, Electrical Engineering, and Project Management.',
      'Undergraduate thesis research on 6-DOF robotic probe tracking for medical ultrasonography training (published at IEEE TENCON 2023).',
    ],
  },
];

export const publications: PublicationItem[] = [
  {
    id: 'tencon-2023',
    title: 'Position Accuracy of a 6-DOF Passive Robotic Arm for Ultrasonography Training',
    conference: 'IEEE Region 10 Technical Conference (TENCON 2023)',
    year: 2023,
    date: 'Nov 2023',
    role: 'Co-author & Presenter',
    authors: ['Ravicha Suksawasdi Na Ayuthaya', 'Ronnapee Chaichaowarat'],
    description: [
      'Presented an ultrasound probe tracking system (position and orientation) to foster sonography training, implemented in C and MATLAB.',
      'Conducted experimental trials demonstrating sub-millimeter position accuracy and real-time spatial orientation tracking.',
    ],
    advisor: 'Assoc. Prof. Ronnapee Chaichaowarat, PhD',
    link: 'https://ieeexplore.ieee.org/document/10349000',
  },
];

export const accolades: AccoladeItem[] = [
  {
    id: 'hack2heal',
    title: "Founder's Choice Award Winner",
    organization: 'Hack2Heal Hackathon',
    date: '2025',
    description:
      "Awarded Founder's Choice Award for developing and deploying a community mental health peer-support web platform (heal.a2a.ing).",
    link: 'https://heal.a2a.ing',
  },
  {
    id: 'unsw-leadership',
    title: 'Leadership Foundation Program',
    organization: 'UNSW Sydney',
    date: 'May 2025',
    description:
      'Selected for a 3-day intensive workshop covering collaborative leadership, DEI in technical workplaces, and high-impact communication.',
  },
  {
    id: 'unsw-pdp',
    title: 'Professional Development Program',
    organization: 'UNSW Sydney',
    date: 'Sep 2025',
    description:
      '3-day intensive training in professional communication, personal branding, and industry networking.',
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++', 'C', 'Bash', 'HTML/CSS'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      'FastAPI',
      'NestJS',
      'React',
      'Google ADK',
      'LangGraph',
      'Inngest',
      'Celery',
      'Django',
      'PySpark',
      'TensorFlow',
      'Keras',
    ],
  },
  {
    category: 'Data & Databases',
    skills: ['PostgreSQL', 'Neo4j', 'Apache AGE', 'pgvector', 'Redis', 'Apache Spark', 'Hadoop'],
  },
  {
    category: 'Cloud, DevOps & Protocols',
    skills: [
      'Docker',
      'Docker Compose',
      'AWS (S3, EC2)',
      'Vercel',
      'Supabase',
      'Git',
      'GitHub Actions',
      'uv',
      'uvx',
      'MCP (Model Context Protocol)',
    ],
  },
];

export const experience: ExperienceData = {
  work: workExperience,
  education,
  publications,
  accolades,
  skills: skillCategories,
};

export default experience;
