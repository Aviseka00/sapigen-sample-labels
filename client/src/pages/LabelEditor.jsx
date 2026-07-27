import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import AppShell from '../components/AppShell';
import SampleLabel from '../components/SampleLabel';
import CustomLabel from '../components/CustomLabel';
import PrintSheet from '../components/PrintSheet';

const emptyStandard = {
  labelType: 'standard',
  template: null,
  templateName: 'Standard Sapigen',
  templateSnapshot: null,
  customValues: {},
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
  const [params] = useSearchParams();
  const { api } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(emptyStandard);
  const [templates, setTemplates] = useState([]);
  const [labelId, setLabelId] = useState(id || null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  useEffect(() => {
    api('/templates')
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, [api]);

  useEffect(() => {
    if (id) {
      api(`/labels/${id}`)
        .then((label) => {
          setData(label);
          setLabelId(label._id);
        })
        .catch((err) => setError(err.message));
      return;
    }

    const type = params.get('type') === 'custom' ? 'custom' : 'standard';
    const templateId = params.get('template');

    if (type === 'custom' && templateId) {
      api(`/templates/${templateId}`)
        .then((tpl) => {
          const customValues = {};
          (tpl.cells || []).forEach((cell) => {
            if (cell.isInput) customValues[cell.key] = '';
          });
          setData({
            ...emptyStandard,
            labelType: 'custom',
            template: tpl._id,
            templateName: tpl.name,
            templateSnapshot: tpl,
            customValues,
            paperSize: tpl.paperSize || 'A4',
            labelsPerPage: tpl.labelsPerPage || 4,
            sampleDate: new Date().toLocaleDateString('en-GB'),
          });
        })
        .catch((err) => setError(err.message));
    } else {
      setData({
        ...emptyStandard,
        sampleDate: new Date().toLocaleDateString('en-GB'),
      });
    }
  }, [id, api, params]);

  async function applyTemplate(templateId) {
    if (!templateId || templateId === 'standard') {
      setData({
        ...emptyStandard,
        sampleDate: new Date().toLocaleDateString('en-GB'),
        paperSize: data.paperSize,
        labelsPerPage: data.labelsPerPage,
        quantity: data.quantity,
      });
      return;
    }
    try {
      const tpl = await api(`/templates/${templateId}`);
      const customValues = {};
      (tpl.cells || []).forEach((cell) => {
        if (cell.isInput) customValues[cell.key] = '';
      });
      setData({
        ...emptyStandard,
        labelType: 'custom',
        template: tpl._id,
        templateName: tpl.name,
        templateSnapshot: tpl,
        customValues,
        paperSize: tpl.paperSize || data.paperSize,
        labelsPerPage: tpl.labelsPerPage || data.labelsPerPage,
        quantity: data.quantity,
        sampleDate: new Date().toLocaleDateString('en-GB'),
      });
    } catch (err) {
      setError(err.message);
    }
  }

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

  const isCustom = data.labelType === 'custom' && data.templateSnapshot;

  return (
    <AppShell>
      <div className="editor-layout">
        <aside className="editor-side panel">
          <div className="panel-head">
            <h2>{labelId ? 'Edit label' : 'New sample label'}</h2>
            <Link to="/">Back</Link>
          </div>

          <p className="side-note">
            Use the standard Sapigen format, or pick one of your saved custom templates.
          </p>

          {!id && (
            <label>
              Label format
              <select
                value={isCustom ? data.template : 'standard'}
                onChange={(e) => applyTemplate(e.target.value)}
              >
                <option value="standard">Standard Sapigen format</option>
                {templates.map((tpl) => (
                  <option key={tpl._id} value={tpl._id}>
                    {tpl.name} ({tpl.rows}×{tpl.columns})
                  </option>
                ))}
              </select>
            </label>
          )}

          {isCustom && (
            <p className="format-badge">
              Template: <strong>{data.templateName}</strong> · {data.templateSnapshot.rows}×
              {data.templateSnapshot.columns} · {data.templateSnapshot.widthMm}×
              {data.templateSnapshot.heightMm} mm
            </p>
          )}

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

          <Link className="side-link" to="/templates/new">
            Create a new custom template →
          </Link>

          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error">{error}</div>}
        </aside>

        <section className="editor-canvas">
          <div className="canvas-frame">
            {isCustom ? (
              <CustomLabel
                template={data.templateSnapshot}
                values={data.customValues || {}}
                editable
                onChangeValues={(customValues) => setData({ ...data, customValues })}
              />
            ) : (
              <SampleLabel data={data} editable onChange={setData} />
            )}
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
