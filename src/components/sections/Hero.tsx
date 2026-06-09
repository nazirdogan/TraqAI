'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

type AvatarTone = 'v' | 'g' | 'a' | 'r' | 'b';
const AVATAR_BG: Record<AvatarTone, string> = {
  v: 'linear-gradient(135deg,#7c63f0,#b7a7ff)',
  g: 'linear-gradient(135deg,#34d399,#10b981)',
  a: 'linear-gradient(135deg,#f5c542,#f59e0b)',
  r: 'linear-gradient(135deg,#f76e72,#ef4444)',
  b: 'linear-gradient(135deg,#60a5fa,#2563eb)',
};

function Avatar({ initials, tone = 'v' }: { initials: string; tone?: AvatarTone }) {
  return (
    <span className="sr-avatar" style={{ background: AVATAR_BG[tone] }}>
      {initials}
    </span>
  );
}

type Stage = { key: 'new' | 'qual' | 'prop' | 'close'; label: string; count: number; value: string; hue: string };
type Deal = { co: string; amt: string; score: number; tag: string; tone: AvatarTone; i: string; note: string; flag?: boolean };

const STAGES: Stage[] = [
  { key: 'new', label: 'New · AI-scored', count: 24, value: '$318k', hue: '#60a5fa' },
  { key: 'qual', label: 'Qualified', count: 12, value: '$486k', hue: '#7c63f0' },
  { key: 'prop', label: 'Proposal', count: 7, value: '$612k', hue: '#f5c542' },
  { key: 'close', label: 'Closing', count: 4, value: '$940k', hue: '#34d399' },
];

const DEALS: Record<Stage['key'], Deal[]> = {
  new: [
    { co: 'Meridian Freight', amt: '$42,500', score: 92, tag: 'Logistics', tone: 'v', i: 'MF', note: 'Inbound via contact form · auto-routed' },
    { co: 'Halcyon Studios', amt: '$18,200', score: 74, tag: 'Agency', tone: 'b', i: 'HS', note: 'WhatsApp · qualifying thread' },
  ],
  qual: [
    { co: 'Northwind ERP', amt: '$128,000', score: 88, tag: 'Manufacturing', tone: 'g', i: 'NW', note: 'Demo booked · Fri 14:00' },
    { co: 'Verity Legal', amt: '$64,800', score: 81, tag: 'Professional', tone: 'a', i: 'VL', note: 'Discovery call completed' },
  ],
  prop: [
    { co: 'Crestline Bank', amt: '$210,000', score: 95, tag: 'Financial', tone: 'r', i: 'CB', note: 'Proposal v3 · awaiting legal', flag: true },
  ],
  close: [
    { co: 'Apex Dynamics', amt: '$340,000', score: 98, tag: 'Enterprise', tone: 'v', i: 'AD', note: 'Verbal — contract out for e-sign' },
  ],
};

function DashboardMock() {
  return (
    <div className="sr-dash">
      <div className="sr-dash__bar">
        <div className="sr-dash__lights">
          <span />
          <span />
          <span />
        </div>
        <div className="sr-dash__addr">
          crm.traqcollective.com / <span className="accent">pipeline · Q2</span>
        </div>
        <div className="sr-dash__right">
          <span className="live">Live · 12 agents</span>
        </div>
      </div>
      <div className="sr-dash__body">
        <aside className="sr-side">
          <div className="sr-side__user">
            <Avatar initials="EM" tone="v" />
            <div>
              <div className="sr-side__user-n">Elena Moreno</div>
              <div className="sr-side__user-r">Head of Revenue</div>
            </div>
          </div>
          <h5>Workspace</h5>
          <div className="sr-side__item">
            <span className="ic ic-home" />
            Dashboard
          </div>
          <div className="sr-side__item active">
            <span className="ic ic-pipe" />
            Pipeline<span className="count">47</span>
          </div>
          <div className="sr-side__item">
            <span className="ic ic-contacts" />
            Contacts<span className="count">2,418</span>
          </div>
          <div className="sr-side__item">
            <span className="ic ic-inbox" />
            Inbox<span className="count">9</span>
          </div>
          <div className="sr-side__item">
            <span className="ic ic-tasks" />
            Tasks<span className="count">14</span>
          </div>
          <div className="sr-side__item">
            <span className="ic ic-reports" />
            Reports
          </div>
          <h5>AI Assistants</h5>
          <div className="sr-side__item">
            <span className="ic ic-ai" />
            Lead scorer<span className="dotlive" />
          </div>
          <div className="sr-side__item">
            <span className="ic ic-ai" />
            Reply drafter<span className="dotlive" />
          </div>
          <div className="sr-side__item">
            <span className="ic ic-ai" />
            Meeting notes<span className="dotlive a" />
          </div>
          <h5>Teams</h5>
          <div className="sr-side__item">
            <span className="ic ic-team" />
            Sales EMEA
          </div>
          <div className="sr-side__item">
            <span className="ic ic-team" />
            Partnerships
          </div>
        </aside>

        <section className="sr-main">
          <div className="sr-main__head">
            <div className="sr-main__h">
              Pipeline <small>47 open deals · $2.36M weighted</small>
            </div>
            <div className="sr-main__toolbar">
              <div className="sr-searchbox">
                <span className="sr-search-ic">⌕</span>
                Search deals, contacts… <kbd>⌘K</kbd>
              </div>
              <div className="sr-main__tabs">
                <span>Board</span>
                <span className="active">Table</span>
                <span>Forecast</span>
              </div>
              <button type="button" className="sr-main__new">
                + New deal
              </button>
            </div>
          </div>
          <div className="sr-kpis">
            <div className="sr-kpi">
              <div className="sr-kpi__lbl">Pipeline value</div>
              <div className="sr-kpi__val">$2.36M</div>
              <div className="sr-kpi__delta up">▲ 12.4% WoW</div>
            </div>
            <div className="sr-kpi">
              <div className="sr-kpi__lbl">Won · MTD</div>
              <div className="sr-kpi__val">$584k</div>
              <div className="sr-kpi__delta up">▲ 8 deals</div>
            </div>
            <div className="sr-kpi">
              <div className="sr-kpi__lbl">Avg cycle</div>
              <div className="sr-kpi__val">18 d</div>
              <div className="sr-kpi__delta down">▼ 3.2 d</div>
            </div>
            <div className="sr-kpi">
              <div className="sr-kpi__lbl">Win rate</div>
              <div className="sr-kpi__val">34%</div>
              <div className="sr-kpi__delta up">▲ 4 pts</div>
            </div>
          </div>

          <div className="sr-board">
            {STAGES.map((s) => (
              <div className="sr-board__col" key={s.key}>
                <div className="sr-board__head">
                  <span className="sr-board__dot" style={{ background: s.hue }} />
                  <span className="sr-board__lbl">{s.label}</span>
                  <span className="sr-board__ct">{s.count}</span>
                </div>
                <div className="sr-board__val">{s.value}</div>
                <div className="sr-board__stack">
                  {DEALS[s.key].map((d, i) => (
                    <div className="sr-deal" key={i}>
                      <div className="sr-deal__top">
                        <Avatar initials={d.i} tone={d.tone} />
                        <div className="sr-deal__who">
                          <div className="sr-deal__co">
                            {d.co}
                            {d.flag && <span className="sr-flag">●</span>}
                          </div>
                          <div className="sr-deal__tag">{d.tag}</div>
                        </div>
                        <div className="sr-deal__score" title="AI fit score">
                          <svg width="26" height="26" viewBox="0 0 26 26">
                            <circle cx="13" cy="13" r="10" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" fill="none" />
                            <circle
                              cx="13"
                              cy="13"
                              r="10"
                              stroke={s.hue}
                              strokeWidth="2.5"
                              fill="none"
                              strokeDasharray={`${(d.score / 100) * 62.8} 62.8`}
                              strokeLinecap="round"
                              transform="rotate(-90 13 13)"
                            />
                          </svg>
                          <span>{d.score}</span>
                        </div>
                      </div>
                      <div className="sr-deal__amt">{d.amt}</div>
                      <div className="sr-deal__note">{d.note}</div>
                    </div>
                  ))}
                  {s.count > DEALS[s.key].length && (
                    <div className="sr-board__more">+ {s.count - DEALS[s.key].length} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile-only pipeline view */}
          <div className="sr-mboard" aria-hidden="true">
            <div className="sr-mhead">
              <div className="sr-mhead__l">
                <div className="sr-mhead__title">Pipeline</div>
                <div className="sr-mhead__meta">
                  47 open · <b>$2.36M</b> weighted
                </div>
              </div>
              <div className="sr-mhead__r">
                <span className="sr-mic" aria-hidden="true">
                  ⌕
                </span>
                <Avatar initials="EM" tone="v" />
              </div>
            </div>

            <div className="sr-mchips">
              {STAGES.map((s, i) => (
                <span className={`sr-mchip${i === 3 ? ' active' : ''}`} key={s.key}>
                  <span className="sr-mchip__dot" style={{ background: s.hue }} />
                  {s.label.split(' ')[0]}
                  <span className="sr-mchip__ct">{s.count}</span>
                </span>
              ))}
            </div>

            <div className="sr-mkpis">
              <div className="sr-mkpi">
                <div className="sr-mkpi__lbl">Pipeline</div>
                <div className="sr-mkpi__val">$2.36M</div>
                <div className="sr-mkpi__delta up">▲ 12.4%</div>
              </div>
              <div className="sr-mkpi">
                <div className="sr-mkpi__lbl">Won · MTD</div>
                <div className="sr-mkpi__val">$584k</div>
                <div className="sr-mkpi__delta up">▲ 8 deals</div>
              </div>
              <div className="sr-mkpi">
                <div className="sr-mkpi__lbl">Avg cycle</div>
                <div className="sr-mkpi__val">18 d</div>
                <div className="sr-mkpi__delta down">▼ 3.2 d</div>
              </div>
              <div className="sr-mkpi">
                <div className="sr-mkpi__lbl">Win rate</div>
                <div className="sr-mkpi__val">34%</div>
                <div className="sr-mkpi__delta up">▲ 4 pts</div>
              </div>
            </div>

            <div className="sr-mai">
              <div className="sr-mai__h">
                <span className="sr-mai__dot" />
                <strong>Traq AI</strong>
                <span className="sr-mai__tag">Suggestion</span>
              </div>
              <p>
                Crestline Bank hasn&apos;t replied in 4d. Draft a follow-up referencing their Q2
                compliance deadline?
              </p>
              <div className="sr-mai__btns">
                <button type="button" className="sr-mai__btn p">
                  Draft reply
                </button>
                <button type="button" className="sr-mai__btn g">
                  Dismiss
                </button>
              </div>
            </div>

            <div className="sr-mlist__h">
              <span>Top deals</span>
              <span className="sr-mlist__filter">All stages ▾</span>
            </div>
            <div className="sr-mlist">
              {[
                { stage: STAGES[3], deal: DEALS.close[0] },
                { stage: STAGES[2], deal: DEALS.prop[0] },
                { stage: STAGES[1], deal: DEALS.qual[0] },
              ].map(({ stage: s, deal: d }) => (
                <div className="sr-mdeal" key={s.key}>
                  <span className="sr-mdeal__bar" style={{ background: s.hue }} />
                  <Avatar initials={d.i} tone={d.tone} />
                  <div className="sr-mdeal__main">
                    <div className="sr-mdeal__co">
                      {d.co}
                      {d.flag && <span className="sr-flag">●</span>}
                    </div>
                    <div className="sr-mdeal__sub">
                      <span className="sr-mdeal__stage" style={{ color: s.hue }}>
                        {s.label.split(' ')[0]}
                      </span>
                      <span className="sr-mdeal__sep">·</span>
                      <span>Score {d.score}</span>
                    </div>
                  </div>
                  <div className="sr-mdeal__amt">{d.amt}</div>
                </div>
              ))}
            </div>

            <button type="button" className="sr-mnew">
              + New deal
            </button>
          </div>
        </section>

        <aside className="sr-act">
          <div className="sr-act__tabs">
            <span className="active">Activity</span>
            <span>
              AI <span className="sr-ai-badge">3</span>
            </span>
            <span>Tasks</span>
          </div>

          <div className="sr-ai-card">
            <div className="sr-ai-card__h">
              <span className="sr-ai-dot" />
              <strong>Traq AI · Suggestion</strong>
            </div>
            <p>Crestline Bank hasn&apos;t responded in 4 days. Draft a follow-up referencing their Q2 compliance deadline?</p>
            <div className="sr-ai-card__btns">
              <button type="button" className="sr-ai-btn p">
                Draft reply
              </button>
              <button type="button" className="sr-ai-btn g">
                Dismiss
              </button>
            </div>
          </div>

          <div className="sr-act__h">Live activity</div>
          <div className="sr-act__item">
            <Avatar initials="MF" tone="v" />
            <div className="sr-act__txt">
              <strong>Meridian Freight</strong>
              <span>
                Auto-scored <b>92</b> · routed to Elena
              </span>
            </div>
            <div className="sr-act__time">00:02</div>
          </div>
          <div className="sr-act__item">
            <Avatar initials="CB" tone="r" />
            <div className="sr-act__txt">
              <strong>Crestline Bank</strong>
              <span>Proposal v3 opened · 4 min</span>
            </div>
            <div className="sr-act__time">00:12</div>
          </div>
          <div className="sr-act__item">
            <Avatar initials="NW" tone="g" />
            <div className="sr-act__txt">
              <strong>Northwind ERP</strong>
              <span>Call booked — Fri 14:00</span>
            </div>
            <div className="sr-act__time">00:24</div>
          </div>
          <div className="sr-act__item">
            <Avatar initials="HS" tone="b" />
            <div className="sr-act__txt">
              <strong>Halcyon Studios</strong>
              <span>WhatsApp · AI-drafted reply</span>
            </div>
            <div className="sr-act__time">00:41</div>
          </div>
          <div className="sr-act__item">
            <Avatar initials="AD" tone="v" />
            <div className="sr-act__txt">
              <strong>Apex Dynamics</strong>
              <span>Contract e-signed ✓</span>
            </div>
            <div className="sr-act__time">01:04</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const title = titleRef.current;
    const card = cardRef.current;
    const bg = bgRef.current;
    if (!stage || !title || !card || !bg) return;

    let scheduled = false;
    const apply = () => {
      scheduled = false;
      // On mobile the sticky scroll-reveal is disabled in CSS — keep the
      // dashboard static and clear any previously-applied inline transforms.
      if (window.matchMedia('(max-width: 820px)').matches) {
        title.style.transform = '';
        card.style.transform = '';
        bg.style.opacity = '1';
        return;
      }
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const denom = Math.max(1, r.height - vh);
      const p = Math.max(0, Math.min(1, -r.top / denom));

      const rotate = 20 + (0 - 20) * p;
      const scale = 1.05 + (1 - 1.05) * p;
      const ty = 0 + (-100 - 0) * p;
      // Fade backgrounds from p=0.7 → p=1 so they don't snap when sticky releases.
      const bgOpacity = p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.3);

      title.style.transform = `translateY(${ty}px)`;
      card.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
      bg.style.opacity = String(bgOpacity);
    };

    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={stageRef} id="top" className="sr-stage">
      <div className="sr-stage__sticky">
        {/* Original Orbital backgrounds — fade out as stage releases */}
        <div
          ref={bgRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, opacity: 1, pointerEvents: 'none', zIndex: 0 }}
        >
          <div className="mesh-bg" aria-hidden="true" />
          <div className="grid-overlay" aria-hidden="true" />
          <div className="hero-bg-orbits" aria-hidden="true">
            <div className="hero-orb o4">
              <span className="orbit-dot" style={{ background: '#7c63f0', boxShadow: '0 0 12px #7c63f0' }} />
            </div>
            <div className="hero-orb o3">
              <span className="orbit-dot" />
            </div>
            <div className="hero-orb o2">
              <span className="orbit-dot" style={{ background: '#fff', boxShadow: '0 0 16px #fff' }} />
            </div>
            <div className="hero-orb o1">
              <span className="orbit-dot" style={{ background: '#34d399', boxShadow: '0 0 12px #34d399' }} />
            </div>
          </div>
          <div className="hero-glow" aria-hidden="true" />
        </div>

        <div
          ref={titleRef}
          style={{
            transform: 'translateY(0px)',
            willChange: 'transform',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <h1 className="sr-title">
            Wire AI into how your business
            <span className="accent">actually works.</span>
          </h1>
          <p className="sr-sub">
            Traq Collective designs, builds, and ships the AI systems, automations, and data pipelines
            that mid-market operators can actually run on.
          </p>

          <div className="mb-6 flex flex-col items-stretch justify-center gap-3 px-2 sm:mb-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5 sm:px-0">
            <Link
              href="/#contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-bg-base shadow-glow transition-all hover:-translate-y-px hover:bg-[#f0edff] hover:shadow-glow-strong active:scale-[0.98]"
            >
              Book a Free Call
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border-strong bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-traq-light hover:bg-white/[0.08]"
            >
              Explore Services
            </Link>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span className="sr-cue">
              Scroll <span className="sr-cue__arrow">↓</span>
            </span>
          </div>
        </div>
        <div
          ref={cardRef}
          className="sr-card-wrap sr-card-wrap--init"
          style={{
            position: 'relative',
            zIndex: 3,
          }}
        >
          <div className="sr-card">
            <div className="sr-card__screen">
              <DashboardMock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
