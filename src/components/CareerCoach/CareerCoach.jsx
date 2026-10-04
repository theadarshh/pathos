import React, { useState, useEffect } from 'react';
import { getCareerAdvice } from '../../utils/careerCoach.js';
import './coach.css';

export default function CareerCoach({ profile, open: openProp, onOpen, onClose, onAdvice }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = openProp ?? localOpen;
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState(() => getCareerAdvice('', profile));

  useEffect(() => {
    const next = getCareerAdvice(question, profile);
    setAdvice(next);
    onAdvice?.(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ask() {
    const next = getCareerAdvice(question, profile);
    setAdvice(next);
    onAdvice?.(next);
  }

  function openPanel() {
    setLocalOpen(true);
    onOpen?.();
  }

  function closePanel() {
    setLocalOpen(false);
    onClose?.();
  }

  return (
    <>
      <button className="coach-launch" onClick={openPanel}>ASK PATHOS ✦</button>
      <div className={`coach-panel ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="PathOS Intelligence" aria-hidden={!open}>
        <button className="coach-close" onClick={closePanel} aria-label="Close PathOS Intelligence">✕</button>
        <h3 className="coach-title">PathOS Intelligence</h3>
        <span className="coach-ex">e.g. "Should I explore Cloud or AI next?"</span>
        <input
          className="coach-q"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Ask about your career path..."
        />
        <div className="coach-ans">
          <div className="coach-sec"><small>RECOMMENDATION</small><p><b>Explore {advice.targetPath}</b></p></div>
          <div className="coach-sec"><small>WHY</small><p>{advice.why}</p></div>
          <div className="coach-sec"><small>WHAT YOU ALREADY HAVE</small><p>{advice.have}</p></div>
          <div className="coach-sec"><small>WHAT TO LEARN NEXT</small><p>{advice.next}</p></div>
          <div className="coach-sec"><small>FIRST ACTION</small><p>{advice.action}</p></div>
          <p className="coach-live-note">↳ {advice.targetPath} is now highlighted in Universe · {advice.next} is highlighted in Skill Gap</p>
        </div>
      </div>
    </>
  );
}
