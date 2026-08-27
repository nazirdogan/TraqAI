import { TRAINING_FORMATS } from '@/lib/training';

/**
 * Formats, group sizes and logistics.
 *
 * Every provider in this market hides pricing behind a call, but almost none
 * publish the shape of the thing you are buying either, which is the question
 * a buyer actually has first. Formats and group sizes are on the page; the
 * number stays in the conversation. Table markup is real (caption + th scope)
 * so the comparison is extractable rather than a styled grid of divs.
 */
export default function FormatTable() {
  return (
    <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow eyebrow-accent">Formats</div>
        <h2 className="section-title mt-3 max-w-2xl">How long it takes and how many can attend</h2>
        <p className="section-sub mt-4">
          Any track runs in any of these formats. Most teams start with one workshop, then roll the
          rest out over a few weeks once they have seen it land.
        </p>

        <div className="mt-8 overflow-x-auto rounded-[20px] border border-border-subtle bg-white shadow-card">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px] sm:text-[15px]">
            <caption className="sr-only">
              Traq Collective AI training formats, session lengths, group sizes and what each format
              suits
            </caption>
            <thead>
              <tr className="border-b border-border-subtle bg-bg-subtle">
                <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                  Format
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                  Length
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                  Group size
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-ink sm:px-6">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_FORMATS.map((f) => (
                <tr key={f.name} className="border-b border-border-subtle last:border-0">
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-semibold text-traq-purple sm:px-6"
                  >
                    {f.name}
                  </th>
                  <td className="px-5 py-4 text-ink-soft sm:px-6">{f.length}</td>
                  <td className="px-5 py-4 text-ink-soft sm:px-6">{f.group}</td>
                  <td className="px-5 py-4 text-ink-soft sm:px-6">{f.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              In person
            </dt>
            <dd className="mt-2 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
              Dubai, Abu Dhabi and across the UAE, at your office or a venue we arrange.
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Remote
            </dt>
            <dd className="mt-2 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
              Worldwide, live rather than recorded, with the same hands-on format.
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Lead time
            </dt>
            <dd className="mt-2 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
              Typically two to three weeks, because the prep before the session is real work.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
