import { DELIVERY_PHASES } from '@/lib/training';

/**
 * "How a workshop runs" — the before / during / after model.
 *
 * Reuses the .process-rail / .process-node primitives from the home page
 * process band so the three-step rhythm reads the same across the site.
 * Server component; the home page version animates, this one does not, because
 * a service page should not pay client JS for a three-item list.
 */
export default function DeliveryPhases() {
  return (
    <section className="bg-bg-base px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow eyebrow-accent">How it runs</div>
        <h2 className="section-title mt-3 max-w-2xl">What a Traq workshop actually looks like</h2>
        <p className="section-sub mt-4">
          The session in the middle is the part people picture. The two either side are the part
          that decides whether any of it is still happening in three months.
        </p>

        <div className="relative mt-11 sm:mt-14">
          <div className="process-rail" aria-hidden="true" />
          <ol className="relative grid grid-cols-1 gap-9 sm:grid-cols-3 sm:gap-8">
            {DELIVERY_PHASES.map((phase) => (
              <li key={phase.step} className="flex flex-col items-start sm:items-center sm:text-center">
                <span className="process-node" aria-hidden="true">
                  {phase.step}
                </span>
                <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-ink sm:text-[18px]">
                  {phase.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft [text-wrap:pretty] sm:text-[15px]">
                  {phase.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
