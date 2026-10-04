import React, { useEffect, useRef, useState } from 'react';
import { readiness, strengthSummary } from '../../utils/scoring.js';
import './identity.css';

export default function CareerIdentity({ profile }) {
  const target = readiness(profile.skills, profile.experience);
  const { current, emerging } = strengthSummary(profile.skills);
  const [displayed, setDisplayed] = useState(0);
  const ringRef = useRef(null);
  const circumference = 2 * Math.PI * 64;

  useEffect(() => {
    setDisplayed(0);
    let n = 0;
    const iv = setInterval(() => {
      n += 2;
      if (n >= target) {
        n = target;
        clearInterval(iv);
      }
      setDisplayed(n);
    }, 20);
    return () => clearInterval(iv);
  }, [target]);

  const offset = circumference - (target / 100) * circumference;
  const opportunity = (profile.goal || '').replace('Move Into ', '') || 'Growth';

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">YOUR CAREER DNA</div>
        <h2>{profile.role}</h2>
        <p>
          {profile.experience} years experience &middot; goal: {profile.goal}
        </p>
      </div>

      <div className="card id-top">
        <div className="ring-wrap">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="64" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
            <circle
              ref={ringRef}
              cx="75"
              cy="75"
              r="64"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 75 75)"
              style={{ transition: 'stroke-dashoffset 1.1s ease' }}
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--blue)" />
                <stop offset="100%" stopColor="var(--violet)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ring-val">
            <b>{displayed}%</b>
            <span>READINESS</span>
          </div>
        </div>
        <div>
          <div className="id-role">{profile.role}</div>
          <div className="id-sub">
            Current strength: {current} &nbsp;•&nbsp; Emerging: {emerging}
          </div>
          <div className="id-tags">
            {profile.skills.map((s) => (
              <span className="tag" key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="strength-row">
        <div className="strength-box dev">
          <small>CURRENT STRENGTH</small>
          <div>{current}</div>
        </div>
        <div className="strength-box cloud">
          <small>EMERGING STRENGTH</small>
          <div>{emerging}</div>
        </div>
        <div className="strength-box gap">
          <small>OPPORTUNITY AREA</small>
          <div>{opportunity}</div>
        </div>
      </div>

      <p className="algo-note">
        Readiness is calculated from your skill count and years of experience — it's a transparent
        heuristic, not a guarantee: base 40 + 6 points per skill + 1.5 points per year (capped at
        10 years), capped at 96%.
      </p>
    </section>
  );
}
