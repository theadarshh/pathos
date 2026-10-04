import { PATHS } from '../data/careerPaths.js';
import { matchScore, pathReasons } from './scoring.js';
import { skillBlurb } from '../data/skills.js';

/**
 * Deterministic local Career Coach.
 *
 * This module is intentionally isolated from any UI code so it can be
 * swapped for a real API call later without touching components — the
 * only public entry point is `getCareerAdvice(question, profile)`, which
 * returns the same shape a hosted model would be prompted to return.
 *
 * To connect a real AI backend later:
 *   1. Keep the `getCareerAdvice(question, profile)` signature.
 *   2. Replace the body with a fetch() to your own backend (never call a
 *      model provider directly from client-side code, and never embed an
 *      API key in the frontend).
 *   3. Keep returning { targetPath, why, have, next, action } so the
 *      CareerCoach component needs no changes.
 */

const INTENT_KEYWORDS = {
  'Cloud Engineer': ['cloud', 'aws', 'azure', 'gcp'],
  'AI Engineer': ['ai', 'machine learning', 'ml', 'generative'],
  'DevOps Engineer': ['devops', 'automat', 'ci/cd', 'ci cd', 'pipeline'],
  'Platform Engineer': ['platform', 'kubernetes', 'k8s'],
  SRE: ['sre', 'reliability', 'on-call', 'oncall'],
  'Solutions Architect': ['architect', 'architecture'],
  'Data Engineer': ['data', 'etl', 'sql', 'pipeline data', 'spark'],
  'Security Engineer': ['security', 'iam', 'threat', 'harden'],
};

function detectTargetPath(question, fallback) {
  const q = question.toLowerCase();
  for (const [path, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((k) => q.includes(k))) return path;
  }
  return fallback;
}

export function getCareerAdvice(question, profile) {
  const { role, skills = [], selectedPath, relevantPathsList = [] } = profile;
  const fallback = selectedPath || relevantPathsList[0] || Object.keys(PATHS)[0];
  const targetPath = detectTargetPath(question || '', fallback);
  const path = PATHS[targetPath];

  const score = matchScore(targetPath, skills);
  const have = path.core.filter((s) => skills.includes(s));
  const nextSkill = path.next.find((s) => !skills.includes(s)) || path.next[0];
  const reasons = pathReasons(targetPath, skills);

  return {
    targetPath,
    score,
    why: reasons[0],
    have: have.length ? have.join(', ') : `${role || 'your current'} fundamentals`,
    next: nextSkill,
    action: `Spend your first week learning the basics of ${nextSkill} — ${skillBlurb(nextSkill).toLowerCase()} Then build one small hands-on exercise with it.`,
  };
}
