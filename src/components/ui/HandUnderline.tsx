/**
 * A small hand-drawn underline stroke (the "marker scribble" under a heading).
 * Inherits colour via currentColor, so set text-traq-purple (or similar) on a
 * wrapper. Server component — pure SVG, no client JS.
 */
export default function HandUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8.4c34-3.6 70-4.2 110-2.1 26 1.4 51 .2 84-2.6"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
