import React, { useEffect, useRef, useState } from 'react';
import './building.css';

const LINES = [
  'ANALYZING EXPERIENCE...',
  'MAPPING CURRENT SKILLS...',
  'IDENTIFYING CAREER PATHS...',
  'CALCULATING SKILL GAPS...',
  'BUILDING YOUR CAREEROS...',
];
const STEP_MS = 480;

export default function BuildingSequence({ onComplete }) {
  const canvasRef = useRef(null);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, pts, raf;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: 26 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    function frame() {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 170) {
            ctx.strokeStyle = `rgba(155,123,255,${(1 - d / 170) * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(76,141,255,.6)';
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const timers = LINES.map((_, i) => setTimeout(() => setActiveLine(i), i * STEP_MS));
    const finish = setTimeout(onComplete, LINES.length * STEP_MS + 400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [onComplete]);

  return (
    <section className="building">
      <canvas ref={canvasRef} className="build-canvas" aria-hidden="true" />
      <div className="build-lines" role="status" aria-live="polite">
        {LINES.map((line, i) => (
          <div key={line} className={`build-line ${i === activeLine ? 'on' : i < activeLine ? 'done' : ''}`}>
            {line}
          </div>
        ))}
      </div>
    </section>
  );
}
