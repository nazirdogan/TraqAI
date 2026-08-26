/**
 * The shared 1200x630 share card.
 *
 * Served from route handlers at fixed URLs (/og/default, /og/workbook) rather
 * than through the `opengraph-image` file convention. The convention only
 * applies to the segment holding the file and to children that do not set their
 * own `openGraph`, and most routes here do set one, so 58 of 66 pages ended up
 * with no og:image at all. An explicit URL in baseMetadata reaches every page.
 *
 * ImageResponse only has the system sans unless font data is passed in, so the
 * card leans on scale, the brand purple and white space rather than a typeface
 * it cannot load.
 */
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

const PURPLE = '#5B3FE4';
const INK = '#141414';
const INK_SOFT = '#555555';

type CardProps = {
  /** Small uppercase label above the headline. Omit for no eyebrow. */
  eyebrow?: string;
  headline: string;
  /** Optional supporting line under the headline. */
  sub?: string;
  /** Right-hand text in the footer rule. */
  footerRight: string;
};

export function ogCard({ eyebrow, headline, sub, footerRight }: CardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', width: 132, height: 10, backgroundColor: PURPLE }} />
          {eyebrow ? (
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                letterSpacing: '0.14em',
                color: INK_SOFT,
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.08,
              letterSpacing: '-0.028em',
              color: INK,
              fontWeight: 700,
              maxWidth: 940,
            }}
          >
            {headline}
          </div>
          {sub ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 31,
                lineHeight: 1.4,
                color: INK_SOFT,
                maxWidth: 880,
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #ECECEC',
            paddingTop: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: PURPLE,
            }}
          >
            Traq Collective
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: INK_SOFT }}>{footerRight}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
