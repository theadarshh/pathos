// Skills grouped by category, in the order they're presented during onboarding
// and used to drive the Skill Gap visualizer.
export const SKILL_GROUPS = {
  Development: ['JavaScript', 'TypeScript', 'React', 'Java', 'Python', '.NET'],
  Cloud: ['AWS', 'Azure', 'GCP'],
  Infrastructure: ['Linux', 'Networking'],
  DevOps: ['Git', 'Docker', 'Jenkins', 'CI/CD', 'Kubernetes', 'Terraform'],
  AI: ['Generative AI', 'Prompt Engineering', 'RAG', 'AI Agents'],
  Data: ['SQL', 'Data Modeling', 'ETL Pipelines', 'Spark'],
  Security: ['Cloud Security', 'IAM', 'Threat Modeling'],
};

export const ALL_SKILLS = Object.values(SKILL_GROUPS).flat();

// Short explanations shown when a user taps a skill in Learn Next / What-If.
export const SKILL_BLURBS = {
  Linux: 'Core OS skills for managing servers and containers reliably.',
  Docker: 'Package applications into portable containers — the DevOps building block.',
  'CI/CD': 'Automate build, test and deploy so releases become routine, not risky.',
  Kubernetes: 'Orchestrate containers at scale across clusters.',
  Terraform: 'Define infrastructure as code for repeatable, versioned environments.',
  Networking: 'Understand how services communicate — essential for cloud and ops roles.',
  AWS: 'The most widely used cloud platform; a strong entry point into cloud roles.',
  Azure: "Microsoft's cloud platform, common in enterprise environments.",
  GCP: "Google's cloud platform, strong in data and AI tooling.",
  'Cloud Security': 'Protect cloud workloads, identities and data at scale.',
  Python: 'A versatile language widely used across AI, automation and scripting.',
  'Prompt Engineering': 'Craft effective inputs to get reliable results from AI models.',
  RAG: 'Combine retrieval with generation to ground AI answers in real data.',
  'AI Agents': 'Build systems where AI models take multi-step autonomous actions.',
  MLOps: 'Operationalize machine learning models in production.',
  'Multi-cloud design': 'Architect systems that span more than one cloud provider.',
  Git: 'Track and collaborate on code changes — foundational for any engineering path.',
  Jenkins: 'A widely used automation server for build and deployment pipelines.',
  Observability: 'Monitor, log and trace systems to understand their real-time health.',
  SQL: 'Query and shape relational data — foundational for any data role.',
  'Data Modeling': 'Design how data is structured and related for reliable analysis.',
  'ETL Pipelines': 'Extract, transform and load data reliably between systems.',
  Spark: 'Process large-scale data across distributed clusters.',
  IAM: 'Manage identities and access so only the right people/systems reach a resource.',
  'Threat Modeling': 'Systematically find where a system is likely to be attacked, before it is.',
};

export function skillBlurb(skill) {
  return SKILL_BLURBS[skill] || 'A key skill for this transition.';
}
