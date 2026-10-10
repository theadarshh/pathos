import React, { useState } from 'react';
import { PATHS } from '../../data/careerPaths.js';
import { matchScore, matchLabel, pathReasons } from '../../utils/scoring.js';
import { useCareerKnowledge } from '../../hooks/useCareerKnowledge.js';
import './universe.css';

export default function CareerUniverse({ profile, paths, selectedPath, onSelectPath, onExplore, onSeeSkillGap }) {
  const [hovered, setHovered] = useState(null);
  // V2.1: optional, API-sourced role description. Falls back to showing
  // nothing extra if the backend is unavailable -- see the hook's doc.
  const { descriptions } = useCareerKnowledge();
  const cx = 450, cy = 260, R = 190;

  const nodes = paths.map((p, i) => {
    const angle = (i / paths.length) * 2 * Math.PI - Math.PI / 2;
    return {
      label: p,
      x: cx + Math.cos(angle) * R,
      y: cy + Math.sin(angle) * R,
      score: matchScore(p, profile.skills),
    };
  });

  const active = hovered || selectedPath;
  const path = PATHS[selectedPath];
  const score = matchScore(selectedPath, profile.skills);
  const reasons = pathReasons(selectedPath, profile.skills);

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">CAREER UNIVERSE</div>
        <h2>Map your possible paths</h2>
        <p>Your current role sits at the center. Click any path to explore the transition.</p>
      </div>

      <div className="card">
        <svg id="universeSvg" viewBox="0 0 900 520" role="img" aria-label="Career path constellation">
          <defs>
            <radialGradient id="gradCenter">
              <stop offset="0%" stopColor="var(--violet)" />
              <stop offset="100%" stopColor="var(--blue)" />
            </radialGradient>
          </defs>
          <g>
            {nodes.map((n) => {
              const strength = n.score / 100;
              return (
                <line
                  key={n.label}
                  x1={cx} y1={cy} x2={n.x} y2={n.y}
                  stroke={`rgba(91,140,255,${0.15 + strength * 0.4})`}
                  strokeWidth={1 + strength * 2.2}
                />
              );
            })}
          </g>
          <g>
            <g className="node center" transform={`translate(${cx},${cy})`}>
              <circle r="34" fill="url(#gradCenter)" />
              <text textAnchor="middle" y="50">{profile.role}</text>
            </g>
            {nodes.map((n) => (
              <g
                key={n.label}
                className={`node ${active && active !== n.label ? 'dim' : ''}`}
                transform={`translate(${n.x},${n.y})`}
                onClick={() => onSelectPath(n.label)}
                onMouseEnter={() => setHovered(n.label)}
                onMouseLeave={() => setHovered(null)}
                tabIndex={0}
                role="button"
                aria-label={`View ${n.label} career path, ${n.score}% match`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectPath(n.label); }}
              >
                <circle r="22" fill="rgba(20,26,40,.9)" stroke="rgba(76,141,255,.55)" strokeWidth="1.5" />
                <text textAnchor="middle" y="38">{n.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {selectedPath && path && (
        <div className="path-detail card">
          <div className="eyebrow">{selectedPath.toUpperCase()}</div>
          <span className="match-badge">{matchLabel(score)} · {score}%</span>
          {descriptions[selectedPath] && (
            <p className="path-description">{descriptions[selectedPath]}</p>
          )}
          <div style={{ marginTop: 14 }}>
            <b style={{ fontSize: 14 }}>Why this path fits</b>
            <ul className="check-list">
              {reasons.map((r) => <li key={r}>✓ {r}</li>)}
            </ul>
          </div>
          <div className="grid2">
            <div>
              <b className="label-sm">SKILLS ALREADY AVAILABLE</b>
              <div className="skill-pill-row" style={{ marginTop: 8 }}>
                {path.core.filter((s) => profile.skills.includes(s)).map((s) => (
                  <span className="pill done" key={s}>{s}</span>
                )) || <span className="pill">—</span>}
                {path.core.filter((s) => profile.skills.includes(s)).length === 0 && <span className="pill">—</span>}
              </div>
            </div>
            <div>
              <b className="label-sm">SKILLS TO BUILD NEXT</b>
              <div className="skill-pill-row" style={{ marginTop: 8 }}>
                {path.next.filter((s) => !profile.skills.includes(s)).map((s) => (
                  <span className="pill next" key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 6 }}>
            <b className="label-sm">SKILLS TO BUILD LATER</b>
            <div className="skill-pill-row" style={{ marginTop: 8 }}>
              {path.later.map((s) => <span className="pill later" key={s}>{s}</span>)}
            </div>
          </div>
          <div className="path-detail-actions">
            <button className="btn-primary" onClick={onExplore}>
              EXPLORE THIS PATH →
            </button>
            {onSeeSkillGap && (
              <button className="btn-ghost" onClick={onSeeSkillGap}>
                SEE SKILL GAP
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
