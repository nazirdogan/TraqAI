import { BUILD, BUILD_NAME, FAA_NAME, FREE_SESSION_MINUTES, addMinutes, sessionById } from '@/lib/first-ai-assistant';

export const dynamic = 'force-dynamic';

function stamp(iso: string): string {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** A calendar file for one free session (?s=mon19) or the build (?s=build). */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('s');
  let title: string;
  let start: string;
  let end: string;
  let url: string;

  if (id === 'build') {
    title = BUILD_NAME;
    start = BUILD.startIso;
    end = BUILD.endIso;
    url = BUILD.meetUrl;
  } else {
    const s = sessionById(id);
    if (!s) return new Response('Not found', { status: 404 });
    title = `${FAA_NAME} (free live session)`;
    start = s.startIso;
    end = addMinutes(s.startIso, FREE_SESSION_MINUTES);
    url = s.meetUrl;
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Traq Collective//First AI Assistant//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}-${stamp(start)}@traqcollective.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:Join on Google Meet: ${url}`,
    `LOCATION:${url}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Starting in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new Response(ics, {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': `attachment; filename="${id}.ics"`,
    },
  });
}
