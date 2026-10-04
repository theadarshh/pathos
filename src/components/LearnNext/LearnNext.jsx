import React, { useState } from 'react';
import { PATHS } from '../../data/careerPaths.js';
import { skillBlurb } from '../../data/skills.js';
import './learnnext.css';

export default function LearnNext({ profile, targetPath }) {
  const [openIdx, setOpenIdx] = useState(null);
  const path = PATHS[targetPath];
  const chain = [...new Set([...path.next, ...path.later])];

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">WHAT SHOULD I LEARN NEXT?</div>
        <h2>Let's build the bridge</h2>
        <p>From <b>{profile.role}</b> to <b>{targetPath}</b>.</p>
      </div>

      <div className="card">
        <div className="path-chain">
          <div className="chain-node">
            <div className="chain-dot done" />
            <div className="chain-label">YOU — {profile.role}</div>
          </div>
          <div className="chain-line done" />
          {chain.map((skill, i) => {
            const known = profile.skills.includes(skill);
            const firstUnknownIdx = chain.findIndex((s) => !profile.skills.includes(s));
            const isNext = i === firstUnknownIdx;
            const state = known ? 'KNOWN' : isNext ? 'NEXT' : 'LATER';
            return (
              <React.Fragment key={skill}>
                <div className="chain-node">
                  <div className={`chain-dot ${known ? 'done' : isNext ? 'active' : ''}`} />
                  <button
                    className={`chain-label ${known ? 'done' : ''}`}
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    aria-expanded={openIdx === i}
                  >
                    {skill}
                    <span className={`chain-state chain-state-${state.toLowerCase()}`}>{state}</span>
                  </button>
                </div>
                <div className="chain-explain-wrap">
                  <div className={`chain-explain-inner ${openIdx === i ? 'open' : ''}`}>
                    <div className="chain-explain">{skillBlurb(skill)}</div>
                  </div>
                </div>
                <div className={`chain-line ${known ? 'done' : ''}`} />
              </React.Fragment>
            );
          })}
          <div className="chain-node">
            <div className="chain-dot" />
            <div className="chain-label chain-target">
              {targetPath.toUpperCase()}
              <span className="chain-state chain-state-target">TARGET</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
