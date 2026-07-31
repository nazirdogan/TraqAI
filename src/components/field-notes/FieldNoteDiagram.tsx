import type { FieldNoteBeforeAfter, FieldNoteDiagram, FieldNoteFlow } from '@/lib/content/field-notes';

/**
 * Field-note diagrams.
 *
 * Laid out as real elements rather than SVG on purpose. SVG <text> neither
 * wraps nor clips, so every label has to be measured by hand and any label that
 * outgrows its estimate silently spills out of its box. As HTML, a long label
 * wraps inside the card and overflow is structurally impossible, the text stays
 * selectable, and it reflows on a phone for free.
 *
 * It also means the labels are read as content. An AI engine can lift
 * "Map the process, pick two tasks, train on those, measure at day 30" out of
 * the page; it can read nothing at all out of a picture.
 *
 * Server component. No client JS.
 */

/** Screen readers get the sequence as a sentence; sighted readers get the layout. */
function flowSummary(flow: FieldNoteFlow): string {
  const steps = flow.steps.map((s, i) => `${i + 1}. ${s.label}, ${s.detail}`).join('. ');
  return `${flow.title}. ${steps}.`;
}

function beforeAfterSummary(d: FieldNoteBeforeAfter): string {
  const fmt = (n: number, unit?: string) => (unit ? `${n} ${unit}` : `${n}`);
  const rows = d.rows
    .map((r) => `${r.label}: ${fmt(r.before, r.unit)} before, ${fmt(r.after, r.unit)} after`)
    .join('. ');
  return `${d.title}. ${rows}. Before: ${d.beforeVerdict}. After: ${d.afterVerdict}.`;
}

function Flow({ diagram }: { diagram: FieldNoteFlow }) {
  return (
    <figure className="mt-8" role="group" aria-label={flowSummary(diagram)}>
      <ol className="grid list-none grid-cols-1 gap-x-4 gap-y-9 pt-4 min-[420px]:grid-cols-2 sm:gap-y-9 lg:grid-cols-4 lg:gap-4">
        {diagram.steps.map((step, index) => {
          const isLast = index === diagram.steps.length - 1;
          return (
            <li
              key={step.label}
              className={`relative min-w-0 rounded-[16px] px-4 pb-[18px] pt-[26px] ${
                isLast ? 'bg-traq-tint' : 'bg-bg-subtle'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute -top-[15px] left-4 grid h-[30px] w-[30px] place-items-center rounded-full bg-traq-purple text-[13px] font-bold leading-none text-white ${
                  isLast ? 'ring-[5px] ring-traq-tint' : ''
                }`}
              >
                {index + 1}
              </span>
              <p className="text-[15px] font-semibold leading-snug tracking-[-0.005em] text-ink">
                {step.label}
              </p>
              <p className="mt-[7px] text-[12.5px] leading-[1.45] text-ink-faint">{step.detail}</p>
            </li>
          );
        })}
      </ol>
      {diagram.caption ? (
        <figcaption className="mt-3 text-[12px] text-ink-faint">{diagram.caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** One row of a before/after panel: label, the quantity drawn, then the number. */
function Row({
  label,
  value,
  peak,
  unit,
  as,
  tone,
}: {
  label: string;
  value: number;
  /** The larger of before and after, so both panels share one scale. */
  peak: number;
  unit?: string;
  as: 'dots' | 'bar';
  tone: 'before' | 'after';
}) {
  const mark = tone === 'after' ? 'bg-traq-purple' : 'bg-border-strong';
  // A zero-width bar would read as a missing row, so keep a visible minimum.
  const width = peak > 0 ? Math.max((value / peak) * 100, 3) : 0;

  return (
    <div className="grid grid-cols-[minmax(62px,auto)_1fr_auto] items-center gap-3">
      <span className="text-[12.5px] text-ink-soft">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5">
        {as === 'dots' ? (
          Array.from({ length: value }, (_, i) => (
            <i key={i} className={`h-[9px] w-[9px] flex-none rounded-full ${mark}`} />
          ))
        ) : (
          <span className={`block h-[9px] rounded-full ${mark}`} style={{ width: `${width}%` }} />
        )}
      </span>
      <span className="whitespace-nowrap text-[16px] font-bold tabular-nums text-ink">
        {value}
        {unit ? <span className="ml-1 text-[13px] font-semibold">{unit}</span> : null}
      </span>
    </div>
  );
}

function BeforeAfter({ diagram }: { diagram: FieldNoteBeforeAfter }) {
  return (
    <figure className="mt-8" role="group" aria-label={beforeAfterSummary(diagram)}>
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <section className="min-w-0 rounded-[16px] border border-border-strong bg-bg-base px-5 pb-4 pt-[18px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Before</p>
          <div className="mt-3.5 flex flex-col gap-3">
            {diagram.rows.map((row) => (
              <Row
                key={row.label}
                label={row.label}
                value={row.before}
                peak={Math.max(row.before, row.after)}
                unit={row.unit}
                as={row.as}
                tone="before"
              />
            ))}
          </div>
          <p className="mt-4 text-[12px] text-signal-warn">{diagram.beforeVerdict}</p>
        </section>

        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-2 text-traq-purple lg:flex-col lg:gap-1"
        >
          <span className="whitespace-nowrap text-[11px] font-bold">Fix first</span>
          <span className="text-[20px] leading-none">&rarr;</span>
        </div>

        <section className="min-w-0 rounded-[16px] border border-traq-purple bg-traq-tint px-5 pb-4 pt-[18px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-traq-purple">After</p>
          <div className="mt-3.5 flex flex-col gap-3">
            {diagram.rows.map((row) => (
              <Row
                key={row.label}
                label={row.label}
                value={row.after}
                peak={Math.max(row.before, row.after)}
                unit={row.unit}
                as={row.as}
                tone="after"
              />
            ))}
          </div>
          <p className="mt-4 text-[12px] text-traq-purple-ink">{diagram.afterVerdict}</p>
        </section>
      </div>
      {diagram.caption ? (
        <figcaption className="mt-3 text-[12px] text-ink-faint">{diagram.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export default function FieldNoteDiagramBlock({ diagram }: { diagram: FieldNoteDiagram }) {
  if (diagram.type === 'flow') return <Flow diagram={diagram} />;
  return <BeforeAfter diagram={diagram} />;
}
