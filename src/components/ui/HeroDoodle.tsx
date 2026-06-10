import HandUnderline from '@/components/ui/HandUnderline';

/**
 * Decorative "field notes" notebook card for the right column of a page hero.
 * Subtle graph-paper texture + a few hand-written lines specific to the page,
 * so every sub-page gets an on-brand graphic without bespoke art per page.
 *
 * Server component (static). The one animated notebook lives in the home
 * "How we work" section (NotebookDoodle); this is its calm, static cousin.
 */

type Motif = {
  /** Small handwritten tab at the top of the page. */
  tab: string;
  /** 2–4 short hand-written lines. The last one gets a check. */
  lines: string[];
  /** A tiny thematic line-doodle drawn in the corner. */
  icon: 'notebook' | 'cap' | 'compass' | 'plug' | 'nodes' | 'pin' | 'people' | 'spark';
};

const MOTIFS: Record<string, Motif> = {
  notebook: {
    tab: 'field notes',
    lines: ["1. What's an agent?", '2. How to prompt Claude', '3. Wire it into your work'],
    icon: 'notebook',
  },
  training: {
    tab: 'workshop plan',
    lines: ['1. Learn the real work', '2. Hands-on with your tools', '3. Habits that actually stick'],
    icon: 'cap',
  },
  consulting: {
    tab: 'the plan',
    lines: ['1. Audit tools & workflows', '2. Find the biggest time-savers', '3. A roadmap you can act on'],
    icon: 'compass',
  },
  implementation: {
    tab: 'build notes',
    lines: ['1. Wire AI into your tools', '2. Guardrails for safe use', '3. The team adopts it'],
    icon: 'plug',
  },
  agentic: {
    tab: 'system sketch',
    lines: ['1. Map the workflow', '2. Build the agents', '3. It runs & improves itself'],
    icon: 'nodes',
  },
  uae: {
    tab: 'on the ground',
    lines: ['Dubai · Abu Dhabi · UAE', 'In-person workshops', 'Remote worldwide too'],
    icon: 'pin',
  },
  embedded: {
    tab: 'your AI partner',
    lines: ['Senior & hands-on', 'Embedded with your team', 'No junior on a markup'],
    icon: 'people',
  },
  services: {
    tab: 'what we do',
    lines: ['Training', 'Consulting & strategy', 'Implementation', 'Agentic AI'],
    icon: 'spark',
  },
  about: {
    tab: 'how we work',
    lines: ['Build it', 'Run it ourselves first', 'Train your team', 'Then make ourselves redundant'],
    icon: 'spark',
  },
  readiness: {
    tab: '2-minute check',
    lines: ['Where does your team stand?', 'Answer a few questions', 'Get your AI-readiness score'],
    icon: 'compass',
  },
};

function CornerIcon({ icon }: { icon: Motif['icon'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-5 w-5',
    'aria-hidden': true,
  };
  switch (icon) {
    case 'cap':
      return (
        <svg {...common}>
          <path d="M2 8.5 12 4l10 4.5-10 4.5z" />
          <path d="M6 10.7V15c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.3" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.6 8.4-2 5.2-5.2 2 2-5.2z" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...common}>
          <path d="M4 8h16M4 16h16" />
          <circle cx="9" cy="8" r="2.1" />
          <circle cx="15" cy="16" r="2.1" />
        </svg>
      );
    case 'nodes':
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="18" r="2.2" />
          <circle cx="19" cy="18" r="2.2" />
          <path d="M12 7.2v3.3M11 11.5 6.5 16M13 11.5 17.5 16" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      );
    case 'people':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <path d="M16 6.2a3 3 0 0 1 0 5.6M20.5 19a5.5 5.5 0 0 0-4-5.3" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      );
    case 'notebook':
    default:
      return (
        <svg {...common}>
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="M9 3.5v17M12 8h4M12 12h4" />
        </svg>
      );
  }
}

export default function HeroDoodle({ motif = 'notebook' }: { motif?: keyof typeof MOTIFS | string }) {
  const m = MOTIFS[motif] ?? MOTIFS.notebook;

  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
      {/* Soft tilt + paper card */}
      <div className="paper-grid relative rounded-[26px] border border-border-subtle bg-white p-6 shadow-card sm:p-7">
        {/* handwritten tab + corner doodle */}
        <div className="flex items-center justify-between">
          <span className="font-hand text-[19px] font-semibold text-traq-purple">{m.tab}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-traq-tint text-traq-purple">
            <CornerIcon icon={m.icon} />
          </span>
        </div>

        {/* ruled, "written" lines */}
        <ul className="mt-5 space-y-3.5">
          {m.lines.map((line, i) => {
            const last = i === m.lines.length - 1;
            return (
              <li key={line} className="border-b border-dashed border-border-subtle pb-3.5 last:border-0 last:pb-0">
                <span className="flex items-center gap-2.5">
                  {last ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-4 w-4 flex-none text-traq-purple"
                    >
                      <path
                        d="m4 12.5 5 5L20 6"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className="h-1.5 w-1.5 flex-none rounded-full bg-traq-purple/50"
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-hand text-[18px] leading-snug text-ink">{line}</span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* a little hand-drawn flourish */}
        <span className="pointer-events-none absolute -bottom-3 right-8 text-traq-purple/70" aria-hidden="true">
          <HandUnderline className="h-2.5 w-24" />
        </span>
      </div>

      {/* faint dotted "post-it" accent behind the card for depth */}
      <span
        className="pointer-events-none absolute -right-3 -top-3 -z-10 h-16 w-16 rounded-2xl border border-dashed border-traq-purple/25"
        aria-hidden="true"
      />
    </div>
  );
}
