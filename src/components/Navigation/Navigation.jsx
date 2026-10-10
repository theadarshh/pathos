import React, { useState } from 'react';

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

const STATUS_LABEL = {
  offline: 'Offline (local only)',
  saving: 'Saving…',
  saved: 'Saved',
  failed: 'Failed to save',
};

function SyncBadge({ syncStatus }) {
  const label = STATUS_LABEL[syncStatus] || STATUS_LABEL.offline;
  return <div className={`sync-badge sync-${syncStatus}`}>{label}</div>;
}

// Minimal, non-blocking auth affordance: collapsed to a single line until
// the person asks to sign in. No new screen, no onboarding redesign --
// this lives entirely inside the side-foot V1 already had.
function AuthControl({ authed, authEmail, onLogin, onRegister, onLogout }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (authed) {
    return (
      <div className="auth-control">
        <div className="auth-status">{authEmail ? `Signed in as ${authEmail}` : 'Signed in'}</div>
        <button className="navlink" onClick={onLogout}>⎋ Sign out</button>
      </div>
    );
  }

  if (!open) {
    return (
      <button className="navlink" onClick={() => setOpen(true)}>
        ⇥ Sign in to sync
      </button>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister(email, password);
      }
      setOpen(false);
      setPassword('');
    } catch (err) {
      setError(err.offline ? 'Backend unreachable.' : err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-control" onSubmit={submit}>
      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${mode === 'login' ? 'on' : ''}`}
          onClick={() => setMode('login')}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`auth-tab ${mode === 'register' ? 'on' : ''}`}
          onClick={() => setMode('register')}
        >
          Create account
        </button>
      </div>
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      {error && <div className="auth-error">{error}</div>}
      <button className="navlink auth-submit" type="submit" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
      </button>
      <button type="button" className="navlink" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

export default function Navigation({
  active,
  onChange,
  onRestart,
  onEditProfile,
  syncStatus,
  authed,
  authEmail,
  onLogin,
  onRegister,
  onLogout,
}) {
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
        {syncStatus && <SyncBadge syncStatus={syncStatus} />}
        <AuthControl
          authed={authed}
          authEmail={authEmail}
          onLogin={onLogin}
          onRegister={onRegister}
          onLogout={onLogout}
        />
      </div>
    </nav>
  );
}
