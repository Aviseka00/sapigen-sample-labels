import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth';
import AppShell from '../components/AppShell';
import CustomLabel from '../components/CustomLabel';

const SIZE_PRESETS = [
  { id: 'small', label: 'Small (70×40 mm)', widthMm: 70, heightMm: 40 },
  { id: 'medium', label: 'Medium (90×60 mm)', widthMm: 90, heightMm: 60 },
  { id: 'large', label: 'Large (100×70 mm)', widthMm: 100, heightMm: 70 },
  { id: 'wide', label: 'Wide (140×50 mm)', widthMm: 140, heightMm: 50 },
];

function makeCells(rows, columns, existing = []) {
  const cells = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      const idx = r * columns + c;
      const prev = existing[idx] || {};
      cells.push({
        writeup: prev.writeup || '',
        isInput: prev.isInput !== undefined ? prev.isInput : c === columns - 1 || columns === 1,
        key: prev.key || `r${r}c${c}`,
      });
    }
  }
  return cells;
}

const blank = {
  name: '',
  description: '',
  rows: 4,
  columns: 2,
  widthMm: 90,
  heightMm: 60,
  headerTitle: '',
  showLogo: false,
  paperSize: 'A4',
  labelsPerPage: 4,
  cells: makeCells(4, 2),
};

export default function TemplateBuilder() {
  const { id } = useParams();
  const { api } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(blank);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(blank);
      return;
    }
    api(`/templates/${id}`)
      .then((tpl) => setData({ ...tpl, cells: makeCells(tpl.rows, tpl.columns, tpl.cells) }))
      .catch((err) => setError(err.message));
  }, [id, api]);

  const previewValues = useMemo(() => {
    const vals = {};
    data.cells.forEach((cell) => {
      if (cell.isInput) vals[cell.key] = '';
    });
    return vals;
  }, [data.cells]);

  function updateGrid(rows, columns) {
    setData((prev) => ({
      ...prev,
      rows,
      columns,
      cells: makeCells(rows, columns, prev.cells),
    }));
  }

  function updateCell(index, patch) {
    setData((prev) => {
      const cells = prev.cells.map((cell, i) => (i === index ? { ...cell, ...patch } : cell));
      return { ...prev, cells };
    });
  }

  function applyPreset(preset) {
    setData((prev) => ({ ...prev, widthMm: preset.widthMm, heightMm: preset.heightMm }));
  }

  async function saveTemplate() {
    if (!data.name.trim()) {
      setError('Please give your template a name.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description,
        rows: data.rows,
        columns: data.columns,
        widthMm: data.widthMm,
        heightMm: data.heightMm,
        headerTitle: data.headerTitle,
        showLogo: data.showLogo,
        cells: data.cells,
        paperSize: data.paperSize,
        labelsPerPage: data.labelsPerPage,
      };
      let saved;
      if (id) {
        saved = await api(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        saved = await api('/templates', { method: 'POST', body: JSON.stringify(payload) });
        navigate(`/templates/${saved._id}`, { replace: true });
      }
      setData({ ...saved, cells: makeCells(saved.rows, saved.columns, saved.cells) });
      setMessage('Template saved. You can use it when creating labels.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="editor-layout template-builder">
        <aside className="editor-side panel">
          <div className="panel-head">
            <h2>{id ? 'Edit template' : 'New custom template'}</h2>
            <Link to="/templates">Back</Link>
          </div>

          <p className="side-note">
            Set rows, columns, size, and writeups for each cell. Save it as your own reusable template.
          </p>

          <div className="settings-grid">
            <label>
              Template name
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="e.g. QC Stage Label"
              />
            </label>

            <label>
              Description
              <input
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Optional note"
              />
            </label>

            <label>
              Rows
              <input
                type="number"
                min={1}
                max={20}
                value={data.rows}
                onChange={(e) => updateGrid(Math.max(1, Number(e.target.value) || 1), data.columns)}
              />
            </label>

            <label>
              Columns
              <input
                type="number"
                min={1}
                max={8}
                value={data.columns}
                onChange={(e) => updateGrid(data.rows, Math.max(1, Number(e.target.value) || 1))}
              />
            </label>

            <label>
              Size preset
              <select
                defaultValue="medium"
                onChange={(e) => {
                  const preset = SIZE_PRESETS.find((p) => p.id === e.target.value);
                  if (preset) applyPreset(preset);
                }}
              >
                {SIZE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="size-pair">
              <label>
                Width (mm)
                <input
                  type="number"
                  min={30}
                  max={200}
                  value={data.widthMm}
                  onChange={(e) => setData({ ...data, widthMm: Number(e.target.value) || 90 })}
                />
              </label>
              <label>
                Height (mm)
                <input
                  type="number"
                  min={20}
                  max={280}
                  value={data.heightMm}
                  onChange={(e) => setData({ ...data, heightMm: Number(e.target.value) || 60 })}
                />
              </label>
            </div>

            <label>
              Header title
              <input
                value={data.headerTitle}
                onChange={(e) => setData({ ...data, headerTitle: e.target.value })}
                placeholder="Optional title on label"
              />
            </label>

            <label className="check-row">
              <input
                type="checkbox"
                checked={data.showLogo}
                onChange={(e) => setData({ ...data, showLogo: e.target.checked })}
              />
              Show Sapigen logo
            </label>
          </div>

          <div className="editor-actions">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={saveTemplate}>
              {busy ? 'Saving…' : 'Save template'}
            </button>
          </div>

          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error">{error}</div>}
        </aside>

        <section className="editor-canvas template-canvas">
          <div className="panel cell-editor">
            <h3>Cell writeups</h3>
            <p className="side-note">
              Writeup = fixed text on the label. Turn on “Input” for cells the user will fill later.
            </p>
            <div className="cell-editor-list">
              {data.cells.map((cell, index) => {
                const r = Math.floor(index / data.columns) + 1;
                const c = (index % data.columns) + 1;
                return (
                  <div key={cell.key} className="cell-editor-item">
                    <strong>
                      R{r}C{c}
                    </strong>
                    <input
                      value={cell.writeup}
                      onChange={(e) => updateCell(index, { writeup: e.target.value })}
                      placeholder="Writeup / field name"
                    />
                    <label className="check-row">
                      <input
                        type="checkbox"
                        checked={cell.isInput}
                        onChange={(e) => updateCell(index, { isInput: e.target.checked })}
                      />
                      Input
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="canvas-frame">
            <CustomLabel template={data} values={previewValues} />
          </div>
          <p className="canvas-hint">
            Preview · {data.rows}×{data.columns} · {data.widthMm}×{data.heightMm} mm
          </p>
        </section>
      </div>
    </AppShell>
  );
}
