import React, { useState } from 'react';
import { PATHS, PATH_NAMES } from '../../data/careerPaths.js';
import { matchScore, transitionComplexity } from '../../utils/scoring.js';
import './compare.css';

const DEFAULT_SELECTION = ['DevOps Engineer', 'Cloud Engineer', 'AI Engineer'];

export default function ComparePaths({ profile }) {
  const [selected, setSelected] = useState(DEFAULT_SELECTION);

  function toggle(name) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((x) => x !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  }

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">COMPARE CAREER PATHS</div>
        <h2>Weigh your options side by side</h2>
        <p>
          Pick up to three paths. Alignment and complexity are calculated from your actual skills —
          this is a qualitative estimate, not a salary or employment guarantee.
        </p>
      </div>

      <div className="role-toggle">
        {PATH_NAMES.map((name) => (
          <button
            key={name}
            className={`chip ${selected.includes(name) ? 'sel' : ''}`}
            onClick={() => toggle(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="cmp-grid">
        {selected.map((name) => {
          const path = PATHS[name];
          const score = matchScore(name, profile.skills);
          const complexity = transitionComplexity(name, profile.skills);
          const nextSkill = path.next.find((s) => !profile.skills.includes(s)) || path.next[0];
          const have = path.core.filter((s) => profile.skills.includes(s));
          return (
            <div className="cmp-col card" key={name}>
              <h3>{name}</h3>
              <div className="cmp-row">
                <small>SKILL ALIGNMENT</small>
                {score}% — {score >= 70 ? 'High alignment' : score >= 40 ? 'Moderate alignment' : 'Requires foundation'}
              </div>
              <div className="cmp-row">
                <small>LEARNING GAP</small>
                {complexity.gap} core skill{complexity.gap === 1 ? '' : 's'} to build
              </div>
              <div className="cmp-row">
                <small>TRANSITION COMPLEXITY</small>
                {complexity.label}
              </div>
              <div className="cmp-row">
                <small>RELEVANT EXISTING SKILLS</small>
                {have.join(', ') || '—'}
              </div>
              <div className="cmp-row">
                <small>RECOMMENDED NEXT SKILL</small>
                {nextSkill}
              </div>
              <div className="cmp-row" style={{ border: 'none' }}>
                <small>SUGGESTED FIRST PROJECT</small>
                {path.firstProject}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
