import { sessionIcs } from '@/lib/keep-session';

export const dynamic = 'force-static';

/** The calendar file behind "Add to calendar" on /keep/thanks. */
export function GET() {
  return new Response(sessionIcs(), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': 'attachment; filename="the-person-they-keep.ics"',
    },
  });
}
