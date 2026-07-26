import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import SapigenLogo from '../components/SapigenLogo';

export default function LoginPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password, displayName);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-backdrop" aria-hidden="true" />
      <div className="login-card">
        <div className="login-brand">
          <SapigenLogo className="login-logo" />
          <div>
            <h1>Sapigen Biologix</h1>
            <p>Sample Label Studio</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className="login-sub">
            Sign in to create, save, and print batch sample labels.
          </p>

          {mode === 'register' && (
            <label>
              Display name
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          )}

          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          className="mode-toggle"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already registered? Sign in'}
        </button>
      </div>
    </div>
  );
}
