import SapigenLogo from './SapigenLogo';

export default function CustomLabel({
  template,
  values = {},
  editable = false,
  onChangeValues,
  compact = false,
}) {
  if (!template) return null;

  const {
    rows,
    columns,
    cells = [],
    headerTitle,
    showLogo,
    widthMm = 90,
    heightMm = 60,
  } = template;

  function cellAt(r, c) {
    return cells[r * columns + c] || { writeup: '', isInput: true, key: `r${r}c${c}` };
  }

  function setValue(key, val) {
    onChangeValues?.({ ...values, [key]: val });
  }

  return (
    <div
      className={`custom-label ${compact ? 'custom-label--compact' : ''}`}
      style={{
        width: compact ? '100%' : `${widthMm}mm`,
        maxWidth: '100%',
        minHeight: compact ? undefined : `${Math.min(heightMm, 120)}mm`,
      }}
    >
      {(showLogo || headerTitle) && (
        <div className="custom-label-header">
          {showLogo && <SapigenLogo className="custom-label-logo" />}
          {headerTitle && <div className="custom-label-title">{headerTitle}</div>}
        </div>
      )}

      <div
        className="custom-label-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, minmax(${compact ? 28 : 40}px, auto))`,
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: columns }).map((__, c) => {
            const cell = cellAt(r, c);
            const key = cell.key || `r${r}c${c}`;
            return (
              <div
                key={key}
                className={`custom-cell ${cell.isInput ? 'custom-cell--input' : 'custom-cell--writeup'}`}
              >
                {cell.isInput ? (
                  editable ? (
                    <div className="custom-cell-stack">
                      {cell.writeup ? <span className="custom-cell-hint">{cell.writeup}</span> : null}
                      <input
                        className="custom-cell-input"
                        value={values[key] || ''}
                        onChange={(e) => setValue(key, e.target.value)}
                        placeholder={cell.writeup || ' '}
                      />
                    </div>
                  ) : (
                    <div className="custom-cell-stack">
                      {cell.writeup ? <span className="custom-cell-hint">{cell.writeup}</span> : null}
                      <span className="custom-cell-value">{values[key] || ''}</span>
                    </div>
                  )
                ) : (
                  <span className="custom-cell-writeup">{cell.writeup || ' '}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
