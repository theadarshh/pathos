// Base skill sequence to draw the 90-day roadmap from, keyed by goal.
// These are starting points only — utils/roadmap.js filters out skills the
// user already knows and reorders around their actual gap before rendering,
// so the roadmap show is never identical for two different profiles.
export const ROADMAP_SKILLS_BY_GOAL = {
  'Move Into DevOps': ['Linux', 'Docker', 'CI/CD', 'Kubernetes', 'Terraform'],
  'Move Into Cloud': ['Linux', 'Networking', 'AWS', 'Terraform', 'Cloud Security'],
  'Move Into AI': ['Python', 'Prompt Engineering', 'RAG', 'AI Agents'],
  'Move Into Data': ['SQL', 'Python', 'Data Modeling', 'ETL Pipelines', 'Spark'],
  'Switch My Role': ['Git', 'Linux', 'Docker', 'CI/CD'],
  'Better Career Growth': ['CI/CD', 'Docker', 'Kubernetes', 'Terraform'],
  'Explore New Technologies': ['Generative AI', 'Prompt Engineering', 'Docker', 'Kubernetes'],
  default: ['Linux', 'Docker', 'CI/CD', 'Kubernetes', 'Terraform'],
};
