import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import AppShell from '../components/AppShell';

export default function ArchivePage() {
  const { api, user } = useAuth();
  const [params, setParams] = useSearchParams();
  const selectedDate = params.get('date') || '';
  const [folders, setFolders] = useState([]);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/labels/folders')
      .then(setFolders)
      .catch((err) => setError(err.message));
  }, [api]);

  useEffect(() => {
    const query = selectedDate ? `?folderDate=${encodeURIComponent(selectedDate)}` : '';
    api(`/labels${query}`)
      .then(setLabels)
      .catch((err) => setError(err.message));
  }, [api, selectedDate]);

  return (
    <AppShell>
      <div className="panel-head page-head">
        <div>
          <p className="eyebrow">Archive</p>
          <h1>Labels by date & user</h1>
          <p className="lede">
            Stored under <em>{user.username}</em>
            {selectedDate ? ` · folder ${selectedDate}` : ' · all dates'}
          </p>
        </div>
        <Link className="btn btn-primary" to="/create">
          New label
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="archive-layout">
        <aside className="panel">
          <h2>Date folders</h2>
          <button
            type="button"
            className={`folder-chip ${!selectedDate ? 'active' : ''}`}
            onClick={() => setParams({})}
          >
            All labels
          </button>
          <ul className="folder-list">
            {folders.map((f) => (
              <li key={f.date}>
                <button
                  type="button"
                  className={`folder-chip ${selectedDate === f.date ? 'active' : ''}`}
                  onClick={() => setParams({ date: f.date })}
                >
                  <strong>{f.date}</strong>
                  <span>{f.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="panel">
          <h2>{selectedDate || 'All'} · {labels.length} label{labels.length === 1 ? '' : 's'}</h2>
          {labels.length === 0 ? (
            <p className="empty">No labels in this folder.</p>
          ) : (
            <div className="archive-table-wrap">
              <table className="archive-table">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Format</th>
                    <th>Batch / detail</th>
                    <th>Status</th>
                    <th>User</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.labelType === 'custom'
                          ? item.templateName || 'Custom'
                          : item.productName || '—'}
                      </td>
                      <td>{item.labelType === 'custom' ? 'Custom' : 'Standard'}</td>
                      <td>
                        {item.labelType === 'custom'
                          ? `${item.templateSnapshot?.rows || '—'}×${item.templateSnapshot?.columns || '—'}`
                          : item.batchNumber || '—'}
                      </td>
                      <td>
                        <span className={`status-pill status-${item.status}`}>{item.status}</span>
                      </td>
                      <td>{item.username}</td>
                      <td>
                        <Link to={`/edit/${item._id}`}>Open</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
