import { Profile } from './types';

/**
 * The discipline, stated once. This is the noun phrase the homepage title, meta
 * description and h1 all carry, so no surface can name a different field. It is the
 * honest short form of `title` below, and it is what the rest of the site — llms.txt
 * and the Person JSON-LD's `knowsAbout` — already said while the homepage title
 * still said "Portfolio & Systems Engineering".
 */
const DISCIPLINE = 'Applied AI Engineering';

export const profile: Profile = {
  // The surname is "Suksawasdi Na Ayuthaya", not "Suksawasdi" — the shorter form
  // used to sit here and in nine hand-written titles across the site, which is how
  // it stayed wrong in some of them. It is stated once, here.
  name: 'Ravicha Suksawasdi Na Ayuthaya',
  preferredName: 'Palm',
  // Matches the jobTitle in index.html's JSON-LD. Two titles for the same person
  // is one claim too many.
  title: 'Applied AI & Backend Systems Engineer',
  discipline: DISCIPLINE,
  headline: `${DISCIPLINE} — fault-tolerant multi-agent pipelines, GraphRAG memory systems, and distributed data engines.`,
  status: 'Master of IT at UNSW Sydney (WAM 83 / Distinction, graduating Dec 2026) · Open to full-time Applied AI & Backend Systems roles.',
  location: 'Sydney, Australia',
  email: 'palm.ravicha@outlook.com',
  links: {
    github: 'https://github.com/Ravicha2',
    linkedin: 'https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/',
    email: 'mailto:palm.ravicha@outlook.com',
    website: 'https://ravicha2.github.io/',
  },
  narrative: {
    origin:
      'Originally trained in Automotive Design & Manufacturing Engineering at Chulalongkorn University. During an IoT exchange at IMT Atlantique in France right when modern LLMs took off, saw the potential of combining software intelligence with systems engineering and made a decisive pivot to Computer Science.',
    systemsMindset:
      'Coming from physical engineering (where stress limits, fluid routing, and failure modes are absolute), Palm treats non-deterministic AI models as components within deterministic, constraint-aware software systems—enforcing explicit state machines, schema validation, graph-based verification, and automatic failure recovery.',
    appliedAi:
      'Currently completing a Master of Information Technology at UNSW Sydney (Distinction, WAM 83) while conducting research on GraphRAG architectural compliance tools and building open-source agent tooling.',
    target:
      'Graduating December 2026; actively seeking full-time roles in Applied AI, Agentic Systems, and Backend Infrastructure.',
    paragraphs: [
      'My name is Palm, and I originally studied Automotive Engineering at Chulalongkorn University. During an IoT exchange at IMT Atlantique in France right around the time GPT took off, I experienced a paradigm shift in how computational intelligence could transform physical and digital workflows, sparking my decisive pivot to Computer Science.',
      'Coming from physical systems engineering—where structural stress limits, fluid dynamics, and failure modes are absolute—I treat non-deterministic LLMs and AI models as untrusted components inside deterministic software architecture. Rather than relying on fragile single prompts, I engineer fault-tolerant multi-agent orchestrations, graph-based compliance verifiers, schema-safe pipelines, and durable execution state machines.',
      'Now completing my Master of Information Technology at UNSW Sydney (WAM 83, Distinction average), I focus deeply on Applied AI and distributed backend infrastructure. Through research at UNSW and engineering internships at Tendor and NodesNow, I have designed and shipped durable event-driven ingestion engines with Inngest and GraphRAG knowledge engines with Neo4j and pgvector.',
    ],
  },
  summary:
    'Master of IT student at UNSW (WAM 83, graduating Dec 2026). Focusing on agentic AI and backend systems. IEEE-published research, hands-on experience shipping multi-agent pipelines, graph databases, and event-driven architectures across internship and research contexts.',
};

export default profile;
