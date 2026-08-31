import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listApplications, listPreps } from '@/lib/intake/applications';
import { AI_PLAN_EVENT as EVENT, eventDateLong, seatsLine } from '@/lib/event';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { absolute: 'Applications · The 2027 AI Plan session' },
  robots: { index: false, follow: false },
};

/**
 * A read-only list of applications, newest first.
 *
 * Deliberately unsophisticated: a shared secret in the query string, checked
 * against INTERNAL_APPLICATIONS_TOKEN, and a table. It exists so applications
 * can be read without digging through an inbox, not to manage them. Confirmed,
 * waitlisted and declined are still decided and sent by hand.
 *
 * A missing or wrong key renders the 404, not a login prompt: an unlisted page
 * that answers "wrong password" is a page that advertises it is worth guessing.
 */

const CELL = 'px-4 py-3 align-top text-[13.5px] leading-relaxed text-ink-soft';
const HEAD =
  'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-ink-faint';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', {
    timeZone: 'Asia/Dubai',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function InternalApplicationsPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const expected = process.env.INTERNAL_APPLICATIONS_TOKEN;
  if (!expected || searchParams.key !== expected) notFound();

  const [applications, preps] = await Promise.all([listApplications(), listPreps()]);

  // Who has sent their pre-session task, by the address they used. Matching on
  // email rather than name because a name can be typed two ways and an address
  // usually is not.
  const preppedEmails = new Set(preps.map((p) => p.email.trim().toLowerCase()));

  return (
    <section className="px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <div className="eyebrow eyebrow-accent">Internal</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
          2027 AI Plan session applications
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          {`${eventDateLong()}. ${applications.length} ${applications.length === 1 ? 'application' : 'applications'}, newest first. Read only. Confirm, waitlist and decline by email as usual.`}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: 'Applications', v: String(applications.length) },
            { k: 'Seats', v: seatsLine() },
            { k: 'Prep tasks in', v: `${preps.length} of ${EVENT.capacity}` },
            { k: 'Deposit', v: `AED ${EVENT.depositAed}` },
          ].map((row) => (
            <div key={row.k} className="rounded-2xl border border-border-subtle bg-white p-4 shadow-card">
              <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
                {row.k}
              </dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
          {'The seat count is the number set in src/lib/event.ts, which is what the public page shows. It is not derived from anything here: confirmed means you have confirmed it and the deposit has cleared in Stripe, which only you can know.'}
        </p>

        {applications.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-border-subtle bg-bg-subtle px-5 py-8 text-center text-[14px] text-ink-faint">
            Nothing yet. Applications appear here the moment one is submitted.
          </p>
        ) : (
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border-subtle bg-white shadow-card">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="border-b border-border-subtle bg-bg-subtle">
                <tr>
                  <th className={HEAD}>Submitted</th>
                  <th className={HEAD}>Name</th>
                  <th className={HEAD}>Role</th>
                  <th className={HEAD}>Company</th>
                  <th className={HEAD}>Size</th>
                  <th className={HEAD}>Email</th>
                  <th className={HEAD}>Most repetitive work</th>
                  <th className={HEAD}>Pays for AI</th>
                  <th className={HEAD}>Leads strategy</th>
                  <th className={HEAD}>Role in that</th>
                  <th className={HEAD}>Full session</th>
                  <th className={HEAD}>Prep in</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id} className="border-b border-border-subtle last:border-0">
                    <td className={`${CELL} whitespace-nowrap`}>{formatDate(a.submittedAt)}</td>
                    <td className={`${CELL} font-semibold text-ink`}>{a.name}</td>
                    <td className={CELL}>{a.role}</td>
                    <td className={CELL}>{a.company}</td>
                    <td className={`${CELL} whitespace-nowrap`}>{a.companySize}</td>
                    <td className={CELL}>
                      <a
                        href={`mailto:${a.email}`}
                        className="text-traq-purple underline underline-offset-4"
                      >
                        {a.email}
                      </a>
                    </td>
                    <td className={`${CELL} min-w-[320px]`}>{a.repetitiveWork}</td>
                    <td className={CELL}>{a.paysForAiTools}</td>
                    <td className={CELL}>{a.leadsAiStrategy}</td>
                    <td className={`${CELL} min-w-[200px]`}>{a.strategyRole}</td>
                    <td className={CELL}>{a.canAttendFullSession ? 'Yes' : 'No'}</td>
                    <td className={CELL}>
                      {preppedEmails.has(a.email.trim().toLowerCase()) ? 'Yes' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-ink">Pre-session tasks</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {preps.length === 0
            ? 'None yet. These arrive from confirmed attendees once their seat is secured.'
            : `${preps.length} in, newest first. This is the material for the table exercise.`}
        </p>

        {preps.length > 0 ? (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border-subtle bg-white shadow-card">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="border-b border-border-subtle bg-bg-subtle">
                <tr>
                  <th className={HEAD}>Sent</th>
                  <th className={HEAD}>Name</th>
                  <th className={HEAD}>Company</th>
                  <th className={HEAD}>The workflow</th>
                  <th className={HEAD}>Hours/week</th>
                  <th className={HEAD}>People</th>
                  <th className={HEAD}>Anything else</th>
                </tr>
              </thead>
              <tbody>
                {preps.map((p) => (
                  <tr key={p.id} className="border-b border-border-subtle last:border-0">
                    <td className={`${CELL} whitespace-nowrap`}>{formatDate(p.submittedAt)}</td>
                    <td className={`${CELL} font-semibold text-ink`}>{p.name}</td>
                    <td className={CELL}>{p.company}</td>
                    <td className={`${CELL} min-w-[320px]`}>{p.workflow}</td>
                    <td className={CELL}>{p.hoursPerWeek}</td>
                    <td className={CELL}>{p.peopleInvolved}</td>
                    <td className={`${CELL} min-w-[200px]`}>{p.anythingElse ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
