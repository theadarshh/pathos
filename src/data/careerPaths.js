// Each path lists the "core" skills used for match scoring, the skills to
// build "next" (near-term) and "later" (later-stage), a category used for
// strength grouping, and a bank of reasons the coach/detail panel can pull
// from depending on which skills the user actually has.
export const PATHS = {
  'DevOps Engineer': {
    category: 'DevOps',
    core: ['Git', 'AWS', 'Docker', 'CI/CD'],
    next: ['Linux', 'Docker', 'CI/CD'],
    later: ['Kubernetes', 'Terraform'],
    firstProject: 'Containerize an app and wire up a CI/CD pipeline for it.',
    reasonBank: {
      Git: 'Git familiarity is core to CI/CD pipelines and release automation.',
      AWS: 'Cloud exposure maps directly onto DevOps tooling and deployment targets.',
      Docker: 'Existing container experience is the foundation of most DevOps workflows.',
      default: 'Hands-on development experience translates directly to automation and scripting.',
    },
  },
  'Cloud Engineer': {
    category: 'Cloud',
    core: ['AWS', 'Networking', 'Linux'],
    next: ['Linux', 'Networking', 'Terraform'],
    later: ['Kubernetes', 'Cloud Security'],
    firstProject: 'Deploy a small app on AWS using core managed services.',
    reasonBank: {
      AWS: 'Existing AWS knowledge is the direct foundation of this path.',
      Networking: 'Networking fundamentals are central to designing cloud environments.',
      default: 'Systems thinking from development or support work transfers well to cloud infrastructure.',
    },
  },
  'Platform Engineer': {
    category: 'DevOps',
    core: ['Docker', 'Kubernetes', 'Terraform'],
    next: ['Docker', 'Kubernetes', 'CI/CD'],
    later: ['Terraform', 'Cloud Security'],
    firstProject: 'Build a self-service deployment template for a sample app.',
    reasonBank: {
      Docker: 'Container experience is the entry point into platform engineering.',
      AWS: 'Cloud plus development experience is the ideal base for platform work.',
      default: 'A systems-ownership mindset fits platform engineering well.',
    },
  },
  SRE: {
    category: 'DevOps',
    core: ['Linux', 'CI/CD', 'Networking'],
    next: ['Linux', 'Docker', 'Kubernetes'],
    later: ['Terraform', 'Observability'],
    firstProject: 'Set up monitoring and alerting for an existing service.',
    reasonBank: {
      Linux: 'Strong Linux fundamentals are essential for reliability engineering.',
      default: 'A debugging mindset from development carries over directly to SRE work.',
    },
  },
  'AI Engineer': {
    category: 'AI',
    core: ['Python', 'Generative AI'],
    next: ['Python', 'Prompt Engineering', 'RAG'],
    later: ['AI Agents', 'MLOps'],
    firstProject: 'Build a small RAG-powered assistant over a document set.',
    reasonBank: {
      Python: 'Python experience is the most direct on-ramp into applied AI work.',
      JavaScript: 'Strong engineering fundamentals from JS/React ease the move into applied AI.',
      default: 'Curiosity toward new technology fits AI engineering, which moves quickly.',
    },
  },
  'Solutions Architect': {
    category: 'Cloud',
    core: ['AWS', 'Networking', 'Cloud Security'],
    next: ['Terraform', 'Cloud Security', 'Networking'],
    later: ['Multi-cloud design'],
    firstProject: 'Design and diagram a scalable architecture for a sample product.',
    reasonBank: {
      AWS: 'Cloud platform knowledge is directly applicable to architecture decisions.',
      default: 'A full-stack view of systems supports architectural thinking.',
    },
  },
  'Data Engineer': {
    category: 'Data',
    core: ['Python', 'SQL', 'ETL Pipelines'],
    next: ['SQL', 'Data Modeling', 'ETL Pipelines'],
    later: ['Spark', 'Cloud Security'],
    firstProject: 'Build an ETL pipeline that pulls, cleans, and loads a public dataset into a warehouse.',
    reasonBank: {
      Python: 'Python is the most common language for building data pipelines.',
      SQL: 'SQL fluency is the foundation of almost all data engineering work.',
      default: 'Comfort with structured, logical problem-solving transfers well to data engineering.',
    },
  },
  'Security Engineer': {
    category: 'Security',
    core: ['Networking', 'Linux', 'Cloud Security'],
    next: ['Linux', 'IAM', 'Cloud Security'],
    later: ['Threat Modeling'],
    firstProject: 'Audit a sample cloud environment and document IAM and network hardening fixes.',
    reasonBank: {
      Networking: 'Networking fundamentals underpin most security analysis.',
      Linux: 'Linux fluency is essential for hands-on security and hardening work.',
      default: 'An attention to detail and systems thinking fits security work well.',
    },
  },
};

export const PATH_NAMES = Object.keys(PATHS);
