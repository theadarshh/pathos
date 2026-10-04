import { PATHS } from '../data/careerPaths.js';

/**
 * Match score for a single career path, 0-100.
 *
 * Algorithm (deterministic, no randomness):
 *   score = round( (coreSkillsUserHas / totalCoreSkillsForPath) * 100 )
 * with a floor of 20 so a path with zero overlap still reads as a
 * "stretch" option rather than a hard zero. `extraSkills` (used by the
 * What-If simulator) are merged in as if the user already had them, so the
 * same function drives both the real profile and simulated projections.
 */
export function matchScore(pathName, userSkills, extraSkills = []) {
  const path = PATHS[pathName];
  if (!path) return 0;
  const owned = new Set([...userSkills, ...extraSkills]);
  const have = path.core.filter((s) => owned.has(s)).length;
  const raw = Math.round((have / path.core.length) * 100);
  return Math.max(raw, have > 0 ? raw : 20);
}

/**
 * Career readiness, 0-96 (capped just under 100 — there is always more to
 * learn, so the model never claims full mastery).
 *
 * Algorithm:
 *   base       = 40
 *   + 6 points per distinct skill selected (skill breadth)
 *   + 1.5 points per year of experience, capped at 10 years (15 pts max)
 * This is a simple weighted-sum heuristic, not a statistical model — it is
 * intentionally transparent so the number is explainable to the user.
 */
export function readiness(skills, experience) {
  const base = 40 + skills.length * 6 + Math.min(experience || 0, 10) * 1.5;
  return Math.min(96, Math.round(base));
}

/** Ranks every path by match score against the user's current skills. */
export function relevantPaths(skills, limit = 6) {
  return Object.keys(PATHS)
    .sort((a, b) => matchScore(b, skills) - matchScore(a, skills))
    .slice(0, limit);
}

/** Human label for a match score band. */
export function matchLabel(score) {
  if (score >= 70) return 'STRONG MATCH';
  if (score >= 40) return 'GOOD MATCH';
  return 'STRETCH MATCH';
}

/**
 * Transition complexity for the Compare view: based on how many of the
 * path's near-term ("next") skills the user is still missing.
 *   0-1 missing  -> Low
 *   2-3 missing  -> Moderate
 *   4+ missing   -> High
 */
export function transitionComplexity(pathName, skills) {
  const path = PATHS[pathName];
  const gap = path.next.filter((s) => !skills.includes(s)).length;
  if (gap <= 1) return { label: 'Low', gap };
  if (gap <= 3) return { label: 'Moderate', gap };
  return { label: 'High', gap };
}

/** Picks the most relevant "why this fits" reason from the path's bank. */
export function pathReasons(pathName, skills) {
  const path = PATHS[pathName];
  const reasons = [];
  path.core.forEach((s) => {
    if (skills.includes(s) && path.reasonBank[s]) reasons.push(path.reasonBank[s]);
  });
  if (reasons.length === 0) reasons.push(path.reasonBank.default);
  if (reasons.length < 2) reasons.push(path.reasonBank.default);
  return [...new Set(reasons)].slice(0, 3);
}

/** Category-level strength summary used on the Career Identity screen. */
export function strengthSummary(skills) {
  const counts = {};
  Object.entries(PATHS).forEach(([, path]) => {
    const owned = path.core.filter((s) => skills.includes(s)).length;
    counts[path.category] = (counts[path.category] || 0) + owned;
  });
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const current = ranked[0]?.[1] > 0 ? ranked[0][0] : 'Development';
  const emerging = ranked[1]?.[0] || 'Cloud';
  return { current, emerging };
}
