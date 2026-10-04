import React, { useState } from 'react';
import { ROLES, EXPERIENCE_LEVELS, GOALS } from '../../data/roles.js';
import { SKILL_GROUPS } from '../../data/skills.js';
import './onboarding.css';

const STEP_LABELS = ['01 — ROLE', '02 — EXPERIENCE', '03 — SKILLS', '04 — GOAL'];

export default function Onboarding({ onComplete, initial = null }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(initial?.role ?? null);
  const [experience, setExperience] = useState(initial?.experience ?? EXPERIENCE_LEVELS[2]);
  const [skills, setSkills] = useState(initial?.skills ?? []);
  const [goal, setGoal] = useState(initial?.goal ?? null);

  const canAdvance =
    (step === 0 && !!role) ||
    step === 1 ||
    (step === 2 && skills.length > 0) ||
    (step === 3 && !!goal);

  function toggleSkill(s) {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function next() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ role, experience, skills, goal });
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <section className="onboarding">
      <div className="ob-progress">
        {STEP_LABELS.map((l, i) => (
          <div key={l} className={`ob-step-lbl ${i < step ? 'done' : i === step ? 'now' : ''}`}>
            {l}
          </div>
        ))}
      </div>

      <div className="ob-body">
        {step === 0 && (
          <>
            <h2 className="ob-q">What do you do today?</h2>
            <div className="grid-cards">
              {ROLES.map((r) => (
                <button
                  key={r}
                  className={`pick ${role === r ? 'sel' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="ob-q">How long have you been in IT?</h2>
            <div className="exp-val">
              {experience}
              <span> years</span>
            </div>
            <div className="exp-track">
              <div
                className="exp-fill"
                style={{ width: `${(EXPERIENCE_LEVELS.indexOf(experience) / (EXPERIENCE_LEVELS.length - 1)) * 100}%` }}
              />
            </div>
            <div className="exp-ticks">
              {EXPERIENCE_LEVELS.map((v, i) => (
                <button
                  key={v}
                  aria-label={`${v} years`}
                  className={`exp-tick ${i <= EXPERIENCE_LEVELS.indexOf(experience) ? 'active' : ''}`}
                  onClick={() => setExperience(v)}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="ob-q">What do you already know?</h2>
            {Object.entries(SKILL_GROUPS).map(([group, list]) => (
              <div className="skill-group" key={group}>
                <h4>{group.toUpperCase()}</h4>
                <div className="chip-row">
                  {list.map((s) => (
                    <button
                      key={s}
                      className={`chip ${skills.includes(s) ? 'sel' : ''}`}
                      onClick={() => toggleSkill(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="ob-q">What do you want next?</h2>
            <div className="grid-cards">
              {GOALS.map((g) => (
                <button
                  key={g}
                  className={`pick ${goal === g ? 'sel' : ''}`}
                  onClick={() => setGoal(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="ob-nav">
        <button className="btn-ghost" style={{ visibility: step === 0 ? 'hidden' : 'visible' }} onClick={back}>
          ← Back
        </button>
        <button className="btn-primary" disabled={!canAdvance} onClick={next}>
          {step === 3 ? 'ENTER PATHOS' : 'Continue'}
        </button>
      </div>
    </section>
  );
}
