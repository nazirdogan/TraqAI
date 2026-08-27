import {
  FEATURED_TRACKS,
  ON_REQUEST_TRACKS,
  TRAINING_TOOLS,
  type TrainingTrack,
} from '@/lib/training';

const LEVEL_STYLES: Record<TrainingTrack['level'], string> = {
  Leadership: 'bg-traq-purple text-white',
  Core: 'bg-traq-tint text-traq-purple-ink',
  Advanced: 'border border-dashed border-traq-purple bg-white text-traq-purple-ink',
};

/**
 * The training catalogue: six named tracks, each expandable to its module list.
 *
 * The module detail uses native <details>/<summary> rather than React state on
 * purpose. It keeps the whole section a server component, ships no client JS,
 * and puts every module title and description in the DOM on first paint, so
 * search and AI crawlers read the full curriculum instead of an empty div. That
 * matters here: "what is actually in the course" is the question this page
 * exists to answer.
 */
export default function TrainingTracks() {
  return (
    <section id="tracks" className="paper-dots relative bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow eyebrow-accent">The catalogue</div>
        <h2 className="section-title mt-3 max-w-2xl">Six tracks. Pick the ones your team needs.</h2>
        <p className="section-sub mt-4">
          Every track is rebuilt around your work before we deliver it, so the modules below are the
          spine rather than the script. Open any track to see what is in it.
        </p>

        {/* Named tools, up front. Most providers in this market never say which
            products they actually teach, which is the first thing a buyer checks. */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span className="text-[13px] font-medium text-ink-faint">Tools we put hands on:</span>
          {TRAINING_TOOLS.map((tool) => (
            <span key={tool.name} className="chip">
              <span
                className="chip-dot h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: tool.dotColor }}
                aria-hidden="true"
              />
              {tool.name}
            </span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
          {FEATURED_TRACKS.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>

        {/* Still delivered, just not led with: four near-identical tool cards
            make the catalogue read as a list of logos rather than a choice. */}
        {ON_REQUEST_TRACKS.length > 0 ? (
          <div className="mt-10 rounded-2xl border border-border-subtle bg-bg-subtle px-6 py-5 sm:px-8">
            <p className="text-[10.5px] font-semibold uppercase tracking-widest text-ink-faint">
              Also delivered on request
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {ON_REQUEST_TRACKS.map((track) => (
                <li key={track.slug} className="text-[14.5px] leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">{track.name}</span>
                  {' — '}
                  {track.audience}. {track.format}.
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-9 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          Need something that is not here? Most engagements end up as a track built from scratch
          around one team&rsquo;s workflow.{' '}
          <a
            href="/book"
            className="font-semibold text-traq-purple underline-offset-4 hover:underline"
          >
            Tell us what the work is
          </a>{' '}
          and we will scope it.
        </p>
      </div>
    </section>
  );
}

function TrackCard({ track }: { track: TrainingTrack }) {
  return (
    <article
      id={track.slug}
      className="note-card flex scroll-mt-28 flex-col"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[19px] font-semibold leading-snug tracking-tight text-ink sm:text-xl">
          {track.name}
        </h3>
        <span
          className={`flex-none rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${LEVEL_STYLES[track.level]}`}
        >
          {track.level}
        </span>
      </div>

      <dl className="mt-3.5 space-y-1.5 text-[13.5px]">
        <div className="flex gap-2">
          <dt className="flex-none font-semibold text-ink">For</dt>
          <dd className="text-ink-soft">{track.audience}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="flex-none font-semibold text-ink">Format</dt>
          <dd className="text-ink-soft">{track.format}</dd>
        </div>
      </dl>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
        {track.summary}
      </p>

      <div className="mt-4 rounded-[14px] bg-traq-tint p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-traq-purple-ink">
          They leave with
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft sm:text-[14px]">
          {track.outcome}
        </p>
      </div>

      <details className="group mt-5 border-t border-border-subtle pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-traq-purple transition-colors hover:text-traq-purple-ink [&::-webkit-details-marker]:hidden">
          <span>
            <span className="group-open:hidden">See the {track.modules.length} modules</span>
            <span className="hidden group-open:inline">Hide the modules</span>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4 flex-none transition-transform duration-200 group-open:rotate-180"
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>

        <ol className="mt-4 space-y-3.5">
          {track.modules.map((module, i) => (
            <li key={module.title} className="flex gap-3">
              <span
                className="note-card__num flex-none pt-0.5 text-[13px]"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-[14px] font-semibold leading-snug text-ink">{module.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{module.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap gap-2">
          {track.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-border-subtle bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink-soft"
            >
              {tool}
            </span>
          ))}
        </div>
      </details>
    </article>
  );
}
