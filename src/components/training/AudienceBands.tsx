import { AUDIENCE_BANDS, TRAINING_TRACKS } from '@/lib/training';

/** Look up a track name from its slug so the band cards never drift out of sync. */
function trackName(slug: string): string {
  return TRAINING_TRACKS.find((t) => t.slug === slug)?.name ?? slug;
}

/**
 * "Who we train" — the catalogue split by seniority rather than by tool.
 *
 * The three bands ask genuinely different questions (approve it / teach it /
 * use it), so they get different rooms. Each band links down to the tracks it
 * normally starts with, which also gives the anchor list a second entry point.
 * Server component, no client JS.
 */
export default function AudienceBands() {
  return (
    <section className="bg-bg-subtle px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow eyebrow-accent">Who we train</div>
        <h2 className="section-title mt-3 max-w-2xl">Three rooms, three different problems</h2>
        <p className="section-sub mt-4">
          The board question and the shop-floor question are not the same question. We split the
          catalogue by who is in the room, then pick the track from there.
        </p>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:mt-11 sm:gap-6 lg:grid-cols-3">
          {AUDIENCE_BANDS.map((band) => (
            <article key={band.label} className="note-card flex flex-col">
              <h3 className="text-[18px] font-semibold leading-snug tracking-tight text-ink sm:text-xl">
                {band.label}
              </h3>
              <p className="mt-1.5 text-[13px] font-medium text-traq-purple">{band.who}</p>

              <p className="mt-3.5 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
                {band.problem}
              </p>

              <div className="mt-auto pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  Usually starts with
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {band.tracks.map((slug) => (
                    <li key={slug}>
                      <a
                        href={`#${slug}`}
                        className="text-[14px] font-semibold text-traq-purple underline-offset-4 transition-colors hover:text-traq-purple-ink hover:underline"
                      >
                        {trackName(slug)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
