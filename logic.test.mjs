import { matchScore, readiness, relevantPaths, transitionComplexity, strengthSummary, pathReasons } from './src/utils/scoring.js';
import { buildRoadmap } from './src/utils/roadmap.js';
import { categorizedSkills, categoryCompletion } from './src/utils/skillGap.js';
import { getCareerAdvice } from './src/utils/careerCoach.js';
import { DEMO_PROFILE } from './src/data/demoProfile.js';
import { PATH_NAMES } from './src/data/careerPaths.js';

let pass = 0, fail = 0;
function check(label, cond) {
  if (cond) { pass++; } else { fail++; console.log('FAIL:', label); }
}

// --- Demo profile: readiness must NOT be hardcoded 72 for everyone ---
const demoReadiness = readiness(DEMO_PROFILE.skills, DEMO_PROFILE.experience);
check('demo readiness is a number 0-96', demoReadiness > 0 && demoReadiness <= 96);

const soloReadiness = readiness(['Git'], 0);
check('readiness differs for a thinner profile', soloReadiness !== demoReadiness);
console.log('demo readiness =', demoReadiness, '| thin profile readiness =', soloReadiness);

// --- Demo profile relevant paths should surface DevOps/Cloud/Platform per spec ---
const demoRelevant = relevantPaths(DEMO_PROFILE.skills);
console.log('demo relevant paths (ranked):', demoRelevant);
check('DevOps Engineer ranks in top 3 for demo profile', demoRelevant.slice(0, 3).includes('DevOps Engineer'));
check('Cloud Engineer ranks in top 4 for demo profile', demoRelevant.slice(0, 4).includes('Cloud Engineer'));

// --- Match scores differ across profiles (not static content) ---
const scoreDevOpsDemo = matchScore('DevOps Engineer', DEMO_PROFILE.skills);
const scoreDevOpsEmpty = matchScore('DevOps Engineer', []);
check('match score changes with skills', scoreDevOpsDemo !== scoreDevOpsEmpty);
console.log('DevOps match: demo =', scoreDevOpsDemo, ' empty =', scoreDevOpsEmpty);

// --- Every path has at least one non-empty "why" reason ---
PATH_NAMES.forEach((p) => {
  const reasons = pathReasons(p, DEMO_PROFILE.skills);
  check(`pathReasons(${p}) returns at least 1 reason`, reasons.length >= 1 && reasons.every((r) => r && r.length > 5));
});

// --- Transition complexity is deterministic and bounded ---
const complexity = transitionComplexity('DevOps Engineer', DEMO_PROFILE.skills);
check('transitionComplexity returns a valid label', ['Low', 'Moderate', 'High'].includes(complexity.label));

// --- Strength summary reflects actual skills, not a fixed value ---
const strength = strengthSummary(DEMO_PROFILE.skills);
check('strengthSummary returns current + emerging', !!strength.current && !!strength.emerging);
console.log('strength summary:', strength);

// --- Roadmap changes based on goal + existing skills (not the same for every profile) ---
const roadmapDevOps = buildRoadmap('Move Into DevOps', DEMO_PROFILE.skills);
const roadmapAI = buildRoadmap('Move Into AI', DEMO_PROFILE.skills);
check('roadmap has 3 phases', roadmapDevOps.phases.length === 3);
check('roadmap differs by goal', JSON.stringify(roadmapDevOps.phases) !== JSON.stringify(roadmapAI.phases));
// A skill the user already knows (Git) should not appear as a "to learn" roadmap skill
const allRoadmapSkills = roadmapDevOps.phases.flatMap((p) => p.skills);
check('roadmap excludes already-known skills', !allRoadmapSkills.includes('Git') || !DEMO_PROFILE.skills.includes('Git'));
console.log('DevOps roadmap phases:', roadmapDevOps.phases.map((p) => `${p.range}: ${p.title}`));

// --- Skill gap categorization: known skills are COMPLETE, not RECOMMENDED/LATER ---
const devGap = categorizedSkills('Development', DEMO_PROFILE.skills, 'DevOps Engineer');
const reactEntry = devGap.find((x) => x.skill === 'React');
check('known skill (React) is COMPLETE', reactEntry.state === 'COMPLETE');
const cloudCompletion = categoryCompletion('Cloud', DEMO_PROFILE.skills);
check('Cloud completion reflects AWS known (1/3)', cloudCompletion.done === 1 && cloudCompletion.total === 3);

// --- Career coach: different questions produce different target paths ---
const adviceCloud = getCareerAdvice('Should I explore Cloud next?', { ...DEMO_PROFILE, relevantPathsList: demoRelevant });
const adviceAI = getCareerAdvice('Should I explore AI next?', { ...DEMO_PROFILE, relevantPathsList: demoRelevant });
check('coach detects Cloud intent', adviceCloud.targetPath === 'Cloud Engineer');
check('coach detects AI intent', adviceAI.targetPath === 'AI Engineer');
check('coach responses differ per question', adviceCloud.next !== adviceAI.next || adviceCloud.targetPath !== adviceAI.targetPath);
check('coach response has all 4 required fields', ['why', 'have', 'next', 'action'].every((k) => !!adviceCloud[k]));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
