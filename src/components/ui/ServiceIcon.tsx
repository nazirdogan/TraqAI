/** Clean line icons per capability (no emoji). Inherits purple via currentColor.
 *  Shared by the home "How we help" section and the /services hub. */
export default function ServiceIcon({ slug }: { slug: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'h-6 w-6 text-traq-purple',
    'aria-hidden': true,
  };
  switch (slug) {
    case 'ai-training':
      // Mortarboard — training & workshops.
      return (
        <svg {...common}>
          <path d="M2 8.5 12 4l10 4.5-10 4.5z" />
          <path d="M6 10.7V15c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.3" />
          <path d="M22 8.5V13" />
        </svg>
      );
    case 'ai-consulting':
      // Compass — strategy & direction.
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.6 8.4-2 5.2-5.2 2 2-5.2z" />
        </svg>
      );
    case 'ai-implementation':
      // Sliders — wiring AI into existing tools.
      return (
        <svg {...common}>
          <path d="M4 8h16M4 16h16" />
          <circle cx="9" cy="8" r="2.1" />
          <circle cx="15" cy="16" r="2.1" />
        </svg>
      );
    case 'agentic-ai':
      // Connected nodes — autonomous, self-running systems.
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="18" r="2.2" />
          <circle cx="19" cy="18" r="2.2" />
          <path d="M12 7.2v3.3M11 11.5 6.5 16M13 11.5 17.5 16" />
        </svg>
      );
    default:
      return null;
  }
}
