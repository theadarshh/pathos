import React from 'react';

const NAV_ITEMS = [
  { id: 'identity', label: 'Overview' },
  { id: 'universe', label: 'Career Universe' },
  { id: 'skillgap', label: 'Skill Gap' },
  { id: 'learnnext', label: 'Learn Next' },
  { id: 'compare', label: 'Compare Paths' },
  { id: 'roadmap', label: '90-Day Roadmap' },
  { id: 'whatif', label: 'What-If Simulator' },
  { id: 'project', label: 'Project Builder' },
];

export default function Navigation({ active, onChange, onRestart, onEditProfile }) {
  return (
    <nav className="side" aria-label="PathOS sections">
      <div className="brand">PathOS</div>
      <div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`navlink ${active === item.id ? 'on' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="side-foot">
        <button className="navlink" onClick={onEditProfile}>✎ Edit profile</button>
        <button className="navlink" onClick={onRestart}>↺ Restart profile</button>
      </div>
    </nav>
  );
}
