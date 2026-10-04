import { PATHS } from '../data/careerPaths.js';

// Deterministic project concept generator: target career + current skills +
// skill gap -> a concrete portfolio project brief. No randomness, nothing
// hardcoded per-user — everything derives from path/skill data.

const PROJECT_TITLES = {
  'DevOps Engineer': 'Containerized CI/CD Pipeline',
  'Cloud Engineer': 'Cloud-Deployed Reference App',
  'Platform Engineer': 'Self-Service Deployment Template',
  SRE: 'Service Reliability Dashboard',
  'AI Engineer': 'Retrieval-Augmented Assistant',
  'Solutions Architect': 'Scalable Reference Architecture',
  'Data Engineer': 'End-to-End ETL Pipeline',
  'Security Engineer': 'Cloud Environment Security Audit',
};

const ARCHITECTURE_BY_CATEGORY = {
  DevOps: ['Source Repo', 'CI Pipeline', 'Container Build', 'Deploy Target'],
  Cloud: ['Client', 'Cloud Entry Point', 'Compute / Service', 'Managed Data Store'],
  AI: ['Input / Query', 'Retrieval Layer', 'Model Call', 'Response'],
  Data: ['Source Data', 'Extract / Transform', 'Load', 'Warehouse / Store'],
  Security: ['Environment Scan', 'Findings', 'Hardening Pass', 'Verification'],
};

const PORTFOLIO_VALUE = {
  'Beginner-friendly': 'A clean, well-documented entry point — shows you can ship something real with the basics in place.',
  Intermediate: 'Demonstrates you can integrate several moving parts into one working system, not just follow a tutorial.',
  Advanced: 'Signals you can operate close to the edge of what you currently know, under real constraints.',
};

export function buildProject(targetPath, skills = []) {
  const path = PATHS[targetPath];
  if (!path) return null;

  const demonstrates = [...new Set([...path.core, ...path.next])];
  const missing = demonstrates.filter((s) => !skills.includes(s));
  const known = demonstrates.filter((s) => skills.includes(s));

  const difficulty = missing.length <= 1 ? 'Beginner-friendly' : missing.length <= 3 ? 'Intermediate' : 'Advanced';

  const milestones = [
    known.length
      ? `Start from what you already know: apply ${known[0]} to scaffold the project.`
      : `Scaffold the project structure and get a minimal version running.`,
    missing[0]
      ? `Bring in ${missing[0]} to cover the first real gap.`
      : `Harden the first working version against edge cases.`,
    missing[1]
      ? `Layer in ${missing[1]} once the core flow works end-to-end.`
      : `Add tests and monitoring around the core flow.`,
    `Package it: write a README explaining the architecture and what it demonstrates, then publish the repo.`,
  ];

  return {
    title: PROJECT_TITLES[targetPath] || `${targetPath} Portfolio Project`,
    difficulty,
    demonstrates,
    known,
    missing,
    milestones,
    summary: path.firstProject,
    architecture: ARCHITECTURE_BY_CATEGORY[path.category] || ARCHITECTURE_BY_CATEGORY.DevOps,
    portfolioValue: PORTFOLIO_VALUE[difficulty],
  };
}
