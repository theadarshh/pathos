import React, { useState, useRef, useEffect } from 'react';
import { PATHS } from '../../data/careerPaths.js';
import { matchScore } from '../../utils/scoring.js';
import './whatif.css';

const SIMULATABLE_SKILLS = [
  'AWS', 'Docker', 'Kubernetes', 'Python', 'Terraform',
  'Generative AI', 'RAG', 'AI Agents', 'SQL', 'ETL Pipelines', 'Cloud Security', 'IAM',
];

// Causal sequence: entering the skill -> forming connections -> landscape
// resolves. A reduced-motion viewer still gets the final state, just without
// the staged delay (see the prefers-reduced-motion check below).
const STAGE_COPY = {
  entering: (skill) => `${skill} enters the simulated profile.`,
  connecting: () => 'Forming connections…',
};

export default function WhatIfSimulator({ profile }) {
  const [simulated, setSimulated] = useState([]);
  const [stage, setStage] = useState('resolved');
  const [justAdded, setJustAdded] = useState(null);
  const timers = useRef([]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  function toggle(skill) {
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const removing = simulated.includes(skill);
    clearTimers();

    if (removing) {
      setSimulated((prev) => prev.filter((s) => s !== skill));
      setStage('resolved');
      return;
    }

    setJustAdded(skill);
    if (reduced) {
      setSimulated((prev) => [...prev, skill]);
      setStage('resolved');
      setJustAdded(null);
      return;
    }

    setStage('entering');
    timers.current.push(
      setTimeout(() => {
        setSimulated((prev) => [...prev, skill]);
        setStage('connecting');
        timers.current.push(
          setTimeout(() => {
            setStage('resolved');
            setJustAdded(null);
          }, 500)
        );
      }, 350)
    );
  }

  const impacted = Object.entries(PATHS)
    .map(([name, path]) => ({
      name,
      before: matchScore(name, profile.skills),
      after: matchScore(name, profile.skills, simulated),
    }))
    .sort((a, b) => b.after - a.after)
    .slice(0, 5);

  const strengthened = impacted.filter((p) => p.after > p.before);

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">WHAT-IF SIMULATOR</div>
        <h2>What if I learn...?</h2>
        <p>Select a skill to see how it changes your possible career paths — simulated skills don't affect your saved profile.</p>
      </div>

      <div className="wi-legend">
        <span><i className="dot dot-current" /> Current skills</span>
        <span><i className="dot dot-sim" /> Simulated skills</span>
      </div>

      <div className="wi-chip-row">
        {SIMULATABLE_SKILLS.map((s) => {
          const owned = profile.skills.includes(s);
          return (
            <button
              key={s}
              className={`chip ${simulated.includes(s) ? 'sel' : ''} ${owned ? 'owned' : ''} ${justAdded === s ? 'wi-entering' : ''}`}
              onClick={() => !owned && toggle(s)}
              disabled={owned}
              title={owned ? 'Already in your current skills' : undefined}
            >
              {s}{owned ? ' ✓' : ''}
            </button>
          );
        })}
      </div>

      <div className={`impact-box ${stage !== 'resolved' ? 'wi-processing' : ''}`} aria-live="polite">
        {stage === 'entering'
          ? STAGE_COPY.entering(justAdded)
          : stage === 'connecting'
          ? STAGE_COPY.connecting()
          : simulated.length === 0
          ? 'Select a skill above to simulate its impact.'
          : strengthened.length
          ? `Adding ${simulated.join(', ')} strengthens: ${strengthened.map((p) => p.name).join(', ')}.`
          : `${simulated.join(', ')} doesn't change your core matches much — try Docker or Kubernetes.`}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <svg viewBox="0 0 900 340" style={{ width: '100%', height: 300 }}>
          {impacted.map((p, i) => {
            const y = 40 + i * 58;
            const bw = p.before * 4.4;
            const aw = p.after * 4.4;
            return (
              <g key={p.name}>
                <text x="0" y={y - 8} fill="var(--text-secondary)" fontSize="12" fontFamily="Space Grotesk">{p.name}</text>
                <rect x="0" y={y} width="440" height="10" fill="rgba(255,255,255,.06)" rx="5" />
                <rect x="0" y={y} width={bw} height="10" fill="var(--blue)" rx="5" opacity="0.55" />
                {aw > bw && stage === 'resolved' && (
                  <rect x="0" y={y} width={aw} height="10" fill="var(--violet)" rx="5">
                    <animate attributeName="width" from={bw} to={aw} dur="0.6s" fill="freeze" />
                  </rect>
                )}
                <text x={Math.max(bw, stage === 'resolved' ? aw : bw) + 10} y={y + 9} fill="var(--text)" fontSize="11">
                  {stage === 'resolved' ? p.after : p.before}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
