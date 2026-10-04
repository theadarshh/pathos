import React, { useEffect, useRef, useState } from 'react';
import './commandpalette.css';

export default function CommandPalette({ onNavigate, onAsk, onEditProfile, onRestart }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: 'identity', label: 'Open Overview', group: 'NAVIGATE', run: () => onNavigate('identity') },
    { id: 'universe', label: 'Explore Universe', group: 'NAVIGATE', run: () => onNavigate('universe') },
    { id: 'skillgap', label: 'Skill Gap', group: 'NAVIGATE', run: () => onNavigate('skillgap') },
    { id: 'learnnext', label: "What's Next", group: 'NAVIGATE', run: () => onNavigate('learnnext') },
    { id: 'compare', label: 'Compare Paths', group: 'NAVIGATE', run: () => onNavigate('compare') },
    { id: 'roadmap', label: '90-Day Journey', group: 'NAVIGATE', run: () => onNavigate('roadmap') },
    { id: 'whatif', label: 'What-If', group: 'NAVIGATE', run: () => onNavigate('whatif') },
    { id: 'project', label: 'Project Builder', group: 'NAVIGATE', run: () => onNavigate('project') },
    { id: 'ask', label: 'Ask PathOS', group: 'ACTIONS', run: onAsk },
    { id: 'edit', label: 'Edit Profile', group: 'ACTIONS', run: onEditProfile },
    { id: 'restart', label: 'Restart', group: 'ACTIONS', run: onRestart },
  ];

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[active];
        if (cmd) { cmd.run(); setOpen(false); setQuery(''); setActive(0); }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, active]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;

  const groups = ['NAVIGATE', 'ACTIONS'];

  return (
    <div className="cmdk-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="cmdk-input-row">
          <svg className="cmdk-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="cmdk-input"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder="Type a command…"
            aria-label="Command search"
          />
          <span className="cmdk-hint">ESC</span>
        </div>
        <div className="cmdk-list">
          {groups.map((group) => {
            const items = filtered.filter((c) => c.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="cmdk-group">
                <div className="cmdk-group-label">{group}</div>
                {items.map((c) => {
                  const idx = filtered.indexOf(c);
                  return (
                    <button
                      key={c.id}
                      className={`cmdk-item ${idx === active ? 'active' : ''}`}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => { c.run(); setOpen(false); }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="cmdk-empty">No matching command.</div>}
        </div>
      </div>
    </div>
  );
}
