import { ROADMAP_SKILLS_BY_GOAL } from '../data/roadmap.js';

/**
 * Builds a personalized 3-phase, 90-day roadmap.
 *
 * Steps:
 *  1. Start from the base skill sequence for the user's goal.
 *  2. Drop any skill the user already has — the roadmap only ever asks
 *     them to learn something new.
 *  3. Split what's left into three phases of up to two skills each
 *     (Day 1-30, 31-60, 61-90). If the user already knows most of the
 *     base sequence, later phases lean on a portfolio project instead of
 *     padding with irrelevant skills.
 */
const PHASE_IDENTITY = ['FOUNDATION', 'BUILD', 'PROVE'];

const PHASE_TASK = [
  (skills) => (skills.length ? `Work through focused, hands-on practice with ${skills.join(' and ')}.` : 'Reinforce your current foundation through deliberate practice.'),
  (skills) => (skills.length ? `Apply ${skills.join(' and ')} to a real workflow, tool, or automation.` : 'Apply your existing skills to a real workflow or automation.'),
  () => 'Package the work into a public repo with a README that explains what it demonstrates.',
];

export function buildRoadmap(goal, skills) {
  const base = ROADMAP_SKILLS_BY_GOAL[goal] || ROADMAP_SKILLS_BY_GOAL.default;
  const gap = base.filter((s) => !skills.includes(s));

  const phaseSkills = [gap.slice(0, 2), gap.slice(2, 4), gap.slice(4, 6)];

  const milestones = [
    'Build stronger foundational skills through focused, hands-on practice.',
    'Apply new skills to a real workflow, tool, or automation.',
    'Ship a portfolio-ready project that demonstrates the full skill set.',
  ];

  const phases = phaseSkills.map((skillsForPhase, i) => {
    const label = i < 2 ? skillsForPhase.join(' + ') || 'Reinforce current skills' : (skillsForPhase.join(' + ') ? skillsForPhase.join(' + ') + ' + Portfolio Project' : 'Portfolio Project');
    return {
      range: `DAY ${i * 30 + 1}–${i * 30 + 30}`,
      identity: PHASE_IDENTITY[i],
      title: label,
      milestone: milestones[i],
      task: PHASE_TASK[i](skillsForPhase),
      skills: skillsForPhase,
    };
  });

  return {
    phases,
    nextMilestone: goal,
  };
}
