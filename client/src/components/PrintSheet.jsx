import { useEffect, useMemo } from 'react';
import SampleLabel from './SampleLabel';
import CustomLabel from './CustomLabel';

/**
 * labelsPerPage presets for A4:
 * 1 = full page, 2 = half, 4 = 2x2, 6 = 2x3, 8 = 2x4
 */
export function getGrid(labelsPerPage) {
  const map = {
    1: { cols: 1, rows: 1 },
    2: { cols: 1, rows: 2 },
    4: { cols: 2, rows: 2 },
    6: { cols: 2, rows: 3 },
    8: { cols: 2, rows: 4 },
  };
  return map[labelsPerPage] || map[4];
}

export default function PrintSheet({ data, open, onClose, onPrinted }) {
  const quantity = Math.max(1, Number(data?.quantity) || 1);
  const perPage = Number(data?.labelsPerPage) || 4;
  const grid = getGrid(perPage);
  const isCustom = data?.labelType === 'custom' && data?.templateSnapshot;
  const pages = useMemo(() => {
    const total = quantity;
    const pageCount = Math.ceil(total / perPage);
    return Array.from({ length: pageCount }, (_, pageIndex) => {
      const start = pageIndex * perPage;
      const count = Math.min(perPage, total - start);
      return Array.from({ length: count }, (_, i) => start + i);
    });
  }, [quantity, perPage]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  async function handlePrint() {
    window.print();
    await onPrinted?.();
  }

  return (
    <div className="print-overlay no-print-hide">
      <div className="print-toolbar no-print">
        <div>
          <strong>Print preview</strong>
          <span>
            {data.paperSize || 'A4'} · {quantity} label{quantity > 1 ? 's' : ''} · {perPage}/page
            {isCustom ? ` · ${data.templateName}` : ' · Standard'}
          </span>
        </div>
        <div className="print-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            Print Labels
          </button>
        </div>
      </div>

      <div className="print-pages">
        {pages.map((slots, pageIndex) => (
          <section
            key={pageIndex}
            className="a4-page"
            style={{
              '--cols': grid.cols,
              '--rows': grid.rows,
            }}
          >
            {slots.map((slot) => (
              <div key={slot} className="a4-slot">
                {isCustom ? (
                  <CustomLabel
                    template={data.templateSnapshot}
                    values={data.customValues || {}}
                    compact={perPage >= 4}
                  />
                ) : (
                  <SampleLabel data={data} compact={perPage >= 4} />
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
