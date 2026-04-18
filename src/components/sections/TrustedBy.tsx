import { TRUSTED_PLATFORMS } from '@/lib/constants';

export default function TrustedBy() {
  const doubled = [...TRUSTED_PLATFORMS, ...TRUSTED_PLATFORMS];

  return (
    <section className="relative py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
          Powered by
        </p>

        <div className="relative mt-7 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-base to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-base to-transparent"
            aria-hidden="true"
          />
          <div className="marquee-track gap-3">
            {doubled.map((platform, idx) => (
              <div
                key={`${platform.name}-${idx}`}
                className="flex flex-none items-center gap-3 rounded-full border border-border-subtle bg-white/[0.03] px-5 py-2.5 text-sm text-white/80"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: platform.dot,
                    boxShadow: `0 0 10px ${platform.dot}`,
                  }}
                  aria-hidden="true"
                />
                {platform.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
