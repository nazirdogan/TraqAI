import { TRUSTED_PLATFORMS } from '@/lib/constants';

export default function TrustedBy() {
  // Two identical groups feed the seamless marquee (see .marquee-group in
  // globals.css): the -50% loop lands copy 2 exactly where copy 1 began.
  return (
    <section className="relative bg-bg-base py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
          We train your team on the tools you already use.
        </p>

        <div className="mt-7 overflow-hidden">
          <div className="marquee-track">
            {[0, 1].map((group) => (
              <div className="marquee-group" key={group} aria-hidden={group === 1}>
                {TRUSTED_PLATFORMS.map((platform) => (
                  <div
                    key={`${group}-${platform.name}`}
                    className="flex flex-none items-center gap-3 rounded-full border border-border-subtle bg-white px-5 py-2.5 text-sm text-ink-soft"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: platform.dot }}
                      aria-hidden="true"
                    />
                    {platform.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
