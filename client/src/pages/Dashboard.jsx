import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import AppShell from '../components/AppShell';

export default function Dashboard() {
  const { api, user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/labels'), api('/labels/folders')])
      .then(([labels, folderList]) => {
        setRecent(labels.slice(0, 6));
        setFolders(folderList.slice(0, 5));
      })
      .catch((err) => setError(err.message));
  }, [api]);

  return (
    <AppShell>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Sample Label Studio</p>
          <h1>
            Hello, <em>{user.displayName || user.username}</em>
          </h1>
          <p className="lede">
            Create batch sample labels, set A4 layout, save to your date folder, then print.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/create">
              Create Sample Label
            </Link>
            <Link className="btn btn-ghost" to="/archive">
              View Archive
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <span>{recent.length}</span>
            <small>Recent labels</small>
          </div>
          <div>
            <span>{folders.length}</span>
            <small>Date folders</small>
          </div>
        </div>
      </section>

      {error && <div className="form-error">{error}</div>}

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head">
            <h2>Recent labels</h2>
            <Link to="/archive">See all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="empty">No labels yet. Create your first sample label.</p>
          ) : (
            <ul className="label-list">
              {recent.map((item) => (
                <li key={item._id}>
                  <Link to={`/edit/${item._id}`}>
                    <strong>{item.productName || 'Untitled product'}</strong>
                    <span>
                      {item.batchNumber || 'No batch'} · {item.folderDate} · {item.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Date folders</h2>
            <Link to="/archive">Browse</Link>
          </div>
          {folders.length === 0 ? (
            <p className="empty">Printed and saved labels appear here by date.</p>
          ) : (
            <ul className="folder-list">
              {folders.map((f) => (
                <li key={f.date}>
                  <Link to={`/archive?date=${f.date}`}>
                    <strong>{f.date}</strong>
                    <span>{f.count} label{f.count === 1 ? '' : 's'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
