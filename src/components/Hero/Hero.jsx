import React, { useRef, useEffect } from 'react';
import './hero.css';

const LABELS = [
  'Software Developer', 'Test Engineer', 'Cloud Engineer', 'DevOps Engineer', 'SRE',
  'Platform Engineer', 'AI Engineer', 'System Administrator', 'Network Engineer', 'App Support',
];

export default function Hero({ onStart, onLoadDemo }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, nodes, raf;
    const mouse = { x: -999, y: -999 };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      nodes = LABELS.map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 2 + Math.random() * 1.5,
      })).map((n, i) => ({ ...n, label: LABELS[i] }));
    }
    resize();
    window.addEventListener('resize', resize);

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() {
      mouse.x = -999;
      mouse.y = -999;
    }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    function frame() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach((n) => {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
          if (d < 140) {
            n.x -= dx * 0.003;
            n.y -= dy * 0.003;
          }
        }
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 230) {
            ctx.strokeStyle = `rgba(91,140,255,${(1 - d / 230) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 140;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 4 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? '#7fa6ff' : 'rgba(91,140,255,.55)';
        ctx.shadowColor = '#5b8cff';
        ctx.shadowBlur = near ? 14 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
        if (near) {
          ctx.font = '12px Space Grotesk';
          ctx.fillStyle = '#f5f7fa';
          ctx.fillText(n.label, n.x + 10, n.y - 10);
        }
      });
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <div className="hero-inner">
        <div className="eyebrow disp hero-fade" style={{ animationDelay: '.1s' }}>PATHOS</div>
        <h1 className="hero-fade" style={{ animationDelay: '.25s' }}>
          Explore what's<br />next.
        </h1>
        <p className="hero-fade" style={{ animationDelay: '.45s' }}>
          An interactive career intelligence experience that turns your experience, skills and ambitions into a visual map of possible futures.
        </p>
        <div className="hero-fade hero-actions" style={{ animationDelay: '.6s' }}>
          <button className="cta" onClick={onStart}>ENTER PATHOS →</button>
          <button className="btn-ghost" onClick={onLoadDemo}>Load demo profile</button>
        </div>
      </div>
    </section>
  );
}
