import { SKILL_GROUPS } from '../data/skills.js';
import { PATHS } from '../data/careerPaths.js';

/**
 * Derives COMPLETE / RECOMMENDED / LATER state for every skill in a
 * category, based on the user's current skills and (if chosen) their
 * selected target path. A skill the target path calls out as "next" is
 * RECOMMENDED even if it wouldn't otherwise be first in the list; a skill
 * the target path calls out as "later" is pushed to LATER.
 */
export function categorizedSkills(category, userSkills, targetPath) {
  const list = SKILL_GROUPS[category] || [];
  const path = targetPath ? PATHS[targetPath] : null;

  return list.map((skill) => {
    if (userSkills.includes(skill)) return { skill, state: 'COMPLETE' };
    if (path?.next.includes(skill)) return { skill, state: 'RECOMMENDED' };
    if (path?.later.includes(skill)) return { skill, state: 'LATER' };
    return { skill, state: 'LATER' };
  }).sort((a, b) => {
    const order = { COMPLETE: 0, RECOMMENDED: 1, LATER: 2 };
    return order[a.state] - order[b.state];
  });
}

export function categoryCompletion(category, userSkills) {
  const list = SKILL_GROUPS[category] || [];
  const done = list.filter((s) => userSkills.includes(s)).length;
  return { done, total: list.length };
}
