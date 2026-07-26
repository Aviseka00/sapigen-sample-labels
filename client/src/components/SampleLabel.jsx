import SapigenLogo from './SapigenLogo';

const ROWS = [
  { key: 'productName', label: 'Product Name' },
  { key: 'batchNumber', label: 'Batch Number' },
  { key: 'sampleStage', label: 'Sample Stage' },
  { key: 'sampleDate', label: 'Sample Date' },
  { key: 'sampleQty', label: 'Sample Qty' },
  { key: 'testName', label: 'Test Name' },
];

export default function SampleLabel({ data, editable = false, onChange, compact = false }) {
  const value = (key) => data?.[key] || '';

  function handleField(key, val) {
    onChange?.({ ...data, [key]: val });
  }

  return (
    <div className={`sample-label ${compact ? 'sample-label--compact' : ''}`}>
      <table className="label-table">
        <tbody>
          <tr className="row-header">
            <td className="cell-logo">
              <SapigenLogo className="label-logo" />
            </td>
            <td className="cell-company" colSpan={3}>
              <div className="company-bar">Sapigen Biologix Pvt. Ltd</div>
            </td>
          </tr>

          {ROWS.map(({ key, label }) => (
            <tr key={key}>
              <td className="cell-label">
                <span className="field-chip">{label}</span>
              </td>
              <td className="cell-value" colSpan={3}>
                {editable ? (
                  <input
                    className="label-input"
                    value={value(key)}
                    onChange={(e) => handleField(key, e.target.value)}
                    placeholder=" "
                  />
                ) : (
                  <span className="value-text">{value(key)}</span>
                )}
              </td>
            </tr>
          ))}

          <tr className="row-footer">
            <td className="cell-label">
              <span className="field-chip">Sample By</span>
            </td>
            <td className="cell-value cell-half">
              {editable ? (
                <input
                  className="label-input"
                  value={value('sampleBy')}
                  onChange={(e) => handleField('sampleBy', e.target.value)}
                />
              ) : (
                <span className="value-text">{value('sampleBy')}</span>
              )}
            </td>
            <td className="cell-label cell-checked">
              <span className="field-chip field-chip--plain">Checked By</span>
            </td>
            <td className="cell-value cell-half">
              {editable ? (
                <input
                  className="label-input"
                  value={value('checkedBy')}
                  onChange={(e) => handleField('checkedBy', e.target.value)}
                />
              ) : (
                <span className="value-text">{value('checkedBy')}</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
