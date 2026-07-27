import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import AppShell from '../components/AppShell';

export default function TemplatesPage() {
  const { api } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const list = await api('/templates');
      setTemplates(list);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [api]);

  async function remove(id) {
    if (!window.confirm('Delete this template?')) return;
    try {
      await api(`/templates/${id}`, { method: 'DELETE' });
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppShell>
      <div className="panel-head page-head">
        <div>
          <p className="eyebrow">Templates</p>
          <h1>Your label templates</h1>
          <p className="lede">
            Keep the standard Sapigen format, or build your own with custom rows, columns, size, and writeups.
          </p>
        </div>
        <Link className="btn btn-primary" to="/templates/new">
          New custom template
        </Link>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="dash-grid">
        <section className="panel template-card standard-card">
          <div className="panel-head">
            <h2>Standard Sapigen</h2>
            <span className="status-pill status-printed">Built-in</span>
          </div>
          <p className="side-note">
            Official sample label: Product Name, Batch Number, Sample Stage, Sample Date, Sample Qty,
            Test Name, Sample By / Checked By.
          </p>
          <Link className="btn btn-ghost" to="/create?type=standard">
            Use standard format
          </Link>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>My templates</h2>
            <span>{templates.length}</span>
          </div>
          {templates.length === 0 ? (
            <p className="empty">No custom templates yet. Create one with your own layout.</p>
          ) : (
            <ul className="label-list">
              {templates.map((tpl) => (
                <li key={tpl._id}>
                  <div className="template-row">
                    <Link to={`/create?type=custom&template=${tpl._id}`}>
                      <strong>{tpl.name}</strong>
                      <span>
                        {tpl.rows}×{tpl.columns} · {tpl.widthMm}×{tpl.heightMm} mm
                        {tpl.description ? ` · ${tpl.description}` : ''}
                      </span>
                    </Link>
                    <div className="template-actions">
                      <Link to={`/templates/${tpl._id}`}>Edit</Link>
                      <button type="button" className="linkish" onClick={() => remove(tpl._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
