import React, { useState, useEffect } from 'react';
import { SKILL_GROUPS } from '../../data/skills.js';
import { categorizedSkills, categoryCompletion } from '../../utils/skillGap.js';
import './skillgap.css';

const STATE_LABEL = { COMPLETE: '✓ complete', RECOMMENDED: 'recommended', LATER: 'later' };
const STATE_CLASS = { COMPLETE: 'state-done', RECOMMENDED: 'state-rec', LATER: 'state-later' };

export default function SkillGap({ profile, targetPath, highlightSkill }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!highlightSkill) return;
    const group = Object.entries(SKILL_GROUPS).find(([, list]) => list.includes(highlightSkill));
    if (group) setOpen(group[0]);
  }, [highlightSkill]);

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">SKILL GAP VISUALIZER</div>
        <h2>Where you stand, by category</h2>
        <p>Tap a category to see what's complete, recommended, or for later — relative to {targetPath || 'your profile'}.</p>
      </div>

      <div className="orbit-grid">
        {Object.keys(SKILL_GROUPS).map((cat) => {
          const { done, total } = categoryCompletion(cat, profile.skills);
          const items = categorizedSkills(cat, profile.skills, targetPath);
          const isOpen = open === cat;
          return (
            <div className="cat-block" key={cat}>
              <button className="cat-btn" onClick={() => setOpen(isOpen ? null : cat)} aria-expanded={isOpen}>
                <div className="cat-orbit" aria-hidden="true">
                  <svg viewBox="0 0 60 60" width="46" height="46">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="5" />
                    <circle
                      cx="30" cy="30" r="26" fill="none" stroke="var(--blue)" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - (total ? done / total : 0))}
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                </div>
                <span>
                  <b>{cat}</b>
                  <small>{done}/{total} complete</small>
                </span>
              </button>
              <div className={`cat-detail ${isOpen ? 'open' : ''}`}>
                {items.map(({ skill, state }) => (
                  <div className={`gap-item ${skill === highlightSkill ? 'highlighted' : ''}`} key={skill}>
                    <span>{skill}</span>
                    <span className={STATE_CLASS[state]}>{STATE_LABEL[state]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
