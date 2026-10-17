import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/keep/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public on purpose: answers only whether the Zoom and replay links have been
 * set in keep_settings. Never the links themselves, emails or buyer counts.
 */
export async function GET() {
  try {
    const s = await getSettings();
    return NextResponse.json(
      { zoomLinkSet: Boolean(s.zoom_url), replayLinkSet: Boolean(s.replay_url) },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
