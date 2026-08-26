/**
 * A single comparison table, rendered as a real <table>.
 *
 * Shared by /insights articles and /field-notes notes. Comparison content is
 * one of the formats AI search cites most, and a genuine table beats the same
 * information written as prose because the row and column labels survive
 * extraction. Both feeds render it identically so a "X vs Y" answer looks the
 * same whichever side of the site it came from.
 *
 * The first cell of every row is a <th scope="row">, so a screen reader (and a
 * parser) can tell the row label from the values.
 */
export type ComparisonTableData = {
  /** Heading above the table. */
  heading: string;
  /** Short supporting line under the heading. */
  intro?: string;
  /** Accessible caption describing the comparison. */
  caption: string;
  /** Column headers, row-label column first. */
  columns: string[];
  /** Each row: first cell is the row label, the rest are values. */
  rows: string[][];
};

export default function ComparisonTable({ table }: { table: ComparisonTableData }) {
  return (
    <div>
      <div className="eyebrow eyebrow-accent">Compare</div>
      <h2 className="section-title mt-3">{table.heading}</h2>
      {table.intro ? <p className="section-sub mt-4">{table.intro}</p> : null}

      <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
        <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
          <caption className="sr-only">{table.caption}</caption>
          <thead>
            <tr className="border-b border-border-subtle bg-bg-subtle">
              {table.columns.map((col) => (
                <th key={col} scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="border-b border-border-subtle align-top last:border-b-0">
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th
                      key={cell}
                      scope="row"
                      className="px-5 py-4 text-left font-semibold text-ink sm:px-6"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td key={cellIndex} className="px-5 py-4 text-ink-soft sm:px-6">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
