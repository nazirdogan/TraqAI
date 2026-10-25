import { sessionIcs } from '@/lib/build-ai-session';

export const dynamic = 'force-static';

/** The calendar file behind "Add to calendar" on /build-ai/thanks. */
export function GET() {
  return new Response(sessionIcs(), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': 'attachment; filename="build-ai-into-your-business.ics"',
    },
  });
}
