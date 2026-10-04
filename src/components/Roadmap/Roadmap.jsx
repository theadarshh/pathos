import React, { useEffect, useRef, useState } from 'react';
import { buildRoadmap } from '../../utils/roadmap.js';
import './roadmap.css';

export default function Roadmap({ profile }) {
  const { phases, nextMilestone } = buildRoadmap(profile.goal, profile.skills);
  const trackRef = useRef(null);
  const [fillHeight, setFillHeight] = useState(0);
  const [activeDots, setActiveDots] = useState([]);

  useEffect(() => {
    function onScroll() {
      const track = trackRef.current;
      if (!track) return;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      const visible = Math.min(total, Math.max(0, vh * 0.75 - r.top));
      const pct = Math.max(0, Math.min(1, total ? visible / total : 0));
      setFillHeight(pct * total);
      const dots = track.querySelectorAll('.rm-dot');
      const on = [];
      dots.forEach((d, i) => {
        if (d.offsetTop <= pct * total) on.push(i);
      });
      setActiveDots(on);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [phases]);

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">90-DAY JOURNEY</div>
        <h2>Your path to {profile.goal}</h2>
        <p>YOU ARE HERE — scroll to see the journey unfold.</p>
      </div>

      <div className="rm-daymarkers" aria-hidden="true">
        <span>DAY 01</span><i /><span>DAY 30</span><i className="rm-day-mid" /><span>DAY 60</span><i /><span>DAY 90</span>
      </div>

      <div className="rm-track" ref={trackRef}>
        <div className="rm-fill" style={{ height: fillHeight }} />
        {phases.map((phase, i) => (
          <div className="rm-phase" key={phase.range}>
            <div className={`rm-dot ${activeDots.includes(i) ? 'on' : ''}`}>{i + 1}</div>
            <small>{phase.range}</small>
            <span className="rm-identity">{phase.identity}</span>
            <h4>{phase.title}</h4>
            <p>{phase.milestone}</p>
            <p className="rm-task">{phase.task}</p>
          </div>
        ))}
        <div className="rm-phase">
          <div className={`rm-dot ${activeDots.includes(phases.length) ? 'on' : ''}`}>★</div>
          <small>NEXT MILESTONE</small>
          <h4>{nextMilestone}</h4>
          <p>Stronger foundation for new opportunities.</p>
        </div>
      </div>
    </section>
  );
}
