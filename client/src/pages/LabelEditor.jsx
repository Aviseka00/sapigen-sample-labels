import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth';
import AppShell from '../components/AppShell';
import SampleLabel from '../components/SampleLabel';
import PrintSheet from '../components/PrintSheet';

const emptyLabel = {
  productName: '',
  batchNumber: '',
  sampleStage: '',
  sampleDate: '',
  sampleQty: '',
  testName: '',
  sampleBy: '',
  checkedBy: '',
  paperSize: 'A4',
  labelsPerPage: 4,
  quantity: 4,
  status: 'draft',
};

export default function LabelEditor() {
  const { id } = useParams();
  const { api } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(emptyLabel);
  const [labelId, setLabelId] = useState(id || null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setData({
        ...emptyLabel,
        sampleDate: new Date().toLocaleDateString('en-GB'),
      });
      return;
    }
    api(`/labels/${id}`)
      .then((label) => {
        setData(label);
        setLabelId(label._id);
      })
      .catch((err) => setError(err.message));
  }, [id, api]);

  async function saveLabel(status = 'saved') {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const payload = { ...data, status };
      let saved;
      if (labelId) {
        saved = await api(`/labels/${labelId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        saved = await api('/labels', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setLabelId(saved._id);
        navigate(`/edit/${saved._id}`, { replace: true });
      }
      setData(saved);
      setMessage(status === 'printed' ? 'Marked as printed and filed.' : 'Label saved.');
      return saved;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveAndPrint() {
    try {
      await saveLabel('saved');
      setPrintOpen(true);
    } catch {
      /* error already set */
    }
  }

  async function handlePrinted() {
    try {
      if (!labelId) return;
      const updated = await api(`/labels/${labelId}/print`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setData(updated);
      setMessage('Label printed and stored in today’s folder.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppShell>
      <div className="editor-layout">
        <aside className="editor-side panel">
          <div className="panel-head">
            <h2>{labelId ? 'Edit label' : 'New sample label'}</h2>
            <Link to="/">Back</Link>
          </div>

          <p className="side-note">
            Fill the blank label on the right. Set paper size and how many labels you need on A4.
          </p>

          <div className="settings-grid">
            <label>
              Paper size
              <select
                value={data.paperSize}
                onChange={(e) => setData({ ...data, paperSize: e.target.value })}
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
              </select>
            </label>

            <label>
              Labels per page
              <select
                value={data.labelsPerPage}
                onChange={(e) =>
                  setData({ ...data, labelsPerPage: Number(e.target.value) })
                }
              >
                <option value={1}>1 (full page)</option>
                <option value={2}>2 (stacked)</option>
                <option value={4}>4 (2 × 2)</option>
                <option value={6}>6 (2 × 3)</option>
                <option value={8}>8 (2 × 4)</option>
              </select>
            </label>

            <label>
              Total labels to print
              <input
                type="number"
                min={1}
                max={100}
                value={data.quantity}
                onChange={(e) =>
                  setData({ ...data, quantity: Math.max(1, Number(e.target.value) || 1) })
                }
              />
            </label>
          </div>

          <div className="editor-actions">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={busy}
              onClick={() => saveLabel('saved')}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={handleSaveAndPrint}
            >
              Save & Print
            </button>
          </div>

          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error">{error}</div>}
        </aside>

        <section className="editor-canvas">
          <div className="canvas-frame">
            <SampleLabel data={data} editable onChange={setData} />
          </div>
          <p className="canvas-hint">Click any field on the label to enter details</p>
        </section>
      </div>

      <PrintSheet
        data={data}
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        onPrinted={handlePrinted}
      />
    </AppShell>
  );
}
