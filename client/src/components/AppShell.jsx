import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth';
import SapigenLogo from './SapigenLogo';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <SapigenLogo className="brand-logo" />
          <div>
            <strong>Sapigen Biologix</strong>
            <span>Sample Labels</span>
          </div>
        </Link>

        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/create">Create</NavLink>
          <NavLink to="/templates">Templates</NavLink>
          <NavLink to="/archive">Archive</NavLink>
        </nav>

        <div className="user-chip">
          <span>{user?.displayName || user?.username}</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
