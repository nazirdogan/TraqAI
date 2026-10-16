/** Share card for /keep: the title and date on the brand purple. */
import { ImageResponse } from 'next/og';
import { DATE_LABEL, SESSION_TITLE } from '@/lib/keep-session';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#5B3FE4',
          padding: '72px 80px',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.85 }}>
          Live on Zoom
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.03em' }}>
            {SESSION_TITLE}
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 40 }}>{DATE_LABEL}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>Traq Collective</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
