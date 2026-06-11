/**
 * CompareNotebook — a "field notes" comparison panel that replaces the plain
 * comparison tables on the service pages. Two columns inside one ruled,
 * graph-paper card: the left column is the unguided / alternative path (✗,
 * muted), the right column is the Traq way (✓, on-brand tint that pops). Reads
 * as a quick "what doesn't work vs what works" checklist.
 *
 * Server component — no client JS. `bad.items[i]` and `good.items[i]` are
 * authored as paired contrasts and listed in the same order.
 */
export type CompareColumn = { label: string; items: string[] };

type Props = {
  /** Small label above the heading. Defaults to "Compare". */
  eyebrow?: string;
  /** Section H2. */
  title: string;
  /** One-line intro under the heading. */
  intro?: string;
  /** Left column — the alternative path (rendered with ✗). */
  bad: CompareColumn;
  /** Right column — the Traq way (rendered with ✓). */
  good: CompareColumn;
};

function Cross({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="m4 12.5 5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompareNotebook({ eyebrow = 'Compare', title, intro, bad, good }: Props) {
  return (
    <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow eyebrow-accent">{eyebrow}</div>
        <h2 className="section-title mt-3">{title}</h2>
        {intro ? <p className="section-sub mt-4">{intro}</p> : null}

        {/* Notebook card */}
        <div className="relative mt-10 sm:mt-12">
          {/* spiral binding along the top edge */}
          <div
            className="absolute -top-2.5 left-8 right-8 z-10 flex justify-between"
            aria-hidden="true"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-5 w-1.5 rounded-full bg-traq-purple/25" />
            ))}
          </div>

          <div className="paper-grid overflow-hidden rounded-[24px] border border-border-subtle bg-white shadow-card">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* LEFT — what doesn't work */}
              <div className="border-b border-dashed border-border-subtle p-6 sm:border-b-0 sm:border-r sm:p-8">
                <span className="font-hand text-[18px] text-ink-faint">what doesn&rsquo;t work</span>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <Cross className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-[15px] font-semibold text-ink sm:text-base">{bad.label}</h3>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {bad.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Cross className="mt-0.5 h-4 w-4 flex-none text-rose-400" />
                      <span className="text-[13.5px] leading-relaxed text-ink-soft sm:text-[14.5px]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT — what works (tinted, pops) */}
              <div className="bg-traq-tint p-6 sm:p-8">
                <span className="font-hand text-[18px] text-traq-purple">what works</span>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-traq-purple text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-[15px] font-semibold text-ink sm:text-base">{good.label}</h3>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {good.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-traq-purple" />
                      <span className="text-[13.5px] leading-relaxed text-ink sm:text-[14.5px]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* hand-drawn footnote */}
          <span
            className="mt-3 block text-right font-hand text-[15px] text-traq-purple/70"
            aria-hidden="true"
          >
            ✎ same goal, very different outcome
          </span>
        </div>
      </div>
    </section>
  );
}
