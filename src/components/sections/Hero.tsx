'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { TRUSTED_PLATFORMS } from '@/lib/constants';

const LEFT_NODES = [
  { y: 60, label: 'OpenAI', color: '#10A37F' },
  { y: 130, label: 'Anthropic', color: '#D97757' },
  { y: 200, label: 'Azure', color: '#0078D4' },
  { y: 270, label: 'Google AI', color: '#F59E0B' },
];

const RIGHT_NODES = [
  { y: 80, label: 'CRM' },
  { y: 160, label: 'ERP' },
  { y: 240, label: 'Data' },
];

// Balanced symmetric margins of ~60px on a 1100-wide viewBox
const CX1 = 90;
const CX2 = 920;
const HUB_X = 565;
const HUB_Y = 180;

function HeroWire() {
  const wireRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = wireRef.current;
    if (!svg) return;
    const paths = svg.querySelectorAll<SVGPathElement>('.wire-path');
    const pulses = svg.querySelectorAll<SVGCircleElement>('.wire-pulse');
    let raf = 0;
    const trackers: Array<{ t: number; speed: number; total: number; path: SVGPathElement; pulse: SVGCircleElement }> = [];

    pulses.forEach((p, i) => {
      const path = paths[i];
      if (!path) return;
      trackers.push({
        t: Math.random(),
        speed: 0.0025 + Math.random() * 0.0015,
        total: path.getTotalLength(),
        path,
        pulse: p,
      });
    });

    const tick = () => {
      trackers.forEach((tr) => {
        tr.t += tr.speed;
        if (tr.t > 1) tr.t = 0;
        const pt = tr.path.getPointAtLength(tr.total * tr.t);
        tr.pulse.setAttribute('cx', String(pt.x));
        tr.pulse.setAttribute('cy', String(pt.y));
        tr.pulse.setAttribute('opacity', tr.t < 0.05 || tr.t > 0.95 ? '0.1' : '0.95');
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const paths: string[] = [];
  LEFT_NODES.forEach((l) => {
    paths.push(
      `M ${CX1 + 90} ${l.y + 20} C ${HUB_X - 120} ${l.y + 20}, ${HUB_X - 120} ${HUB_Y}, ${HUB_X - 20} ${HUB_Y}`,
    );
  });
  RIGHT_NODES.forEach((r) => {
    paths.push(
      `M ${HUB_X + 20} ${HUB_Y} C ${HUB_X + 120} ${HUB_Y}, ${CX2 - 80} ${r.y + 20}, ${CX2 - 20} ${r.y + 20}`,
    );
  });

  return (
    <div className="hero-wire" aria-hidden="true">
      <svg ref={wireRef} viewBox="0 0 1100 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hubGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c63f0" />
            <stop offset="100%" stopColor="#2a1d7a" />
          </linearGradient>
          <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((d, i) => (
          <path key={i} d={d} className="wire-path" />
        ))}
        {paths.map((_, i) => (
          <circle key={`p${i}`} r="3" className="wire-pulse" />
        ))}

        {LEFT_NODES.map((l, i) => (
          <g key={`l${i}`}>
            <rect x={CX1 - 30} y={l.y} width="180" height="40" rx="12" className="wire-node" />
            <circle cx={CX1 - 10} cy={l.y + 20} r="4" fill={l.color} opacity="0.9" />
            <text x={CX1} y={l.y + 25} className="wire-node-lab">
              {l.label}
            </text>
          </g>
        ))}

        <circle cx={HUB_X} cy={HUB_Y} r="38" fill="url(#hubGrad)" filter="url(#hubGlow)" opacity="0.95" />
        <circle cx={HUB_X} cy={HUB_Y} r="38" fill="none" stroke="rgba(255,255,255,0.3)" />
        <circle cx={HUB_X} cy={HUB_Y} r="50" fill="none" stroke="rgba(124,99,240,0.3)" strokeDasharray="3 6" />
        <text
          x={HUB_X}
          y={HUB_Y + 5}
          textAnchor="middle"
          fill="#fff"
          fontSize="13"
          fontWeight="700"
          letterSpacing="0.06em"
        >
          TRAQ
        </text>

        {RIGHT_NODES.map((r, i) => (
          <g key={`r${i}`}>
            <rect x={CX2 - 30} y={r.y} width="150" height="40" rx="12" className="wire-node" />
            <text x={CX2 - 10} y={r.y + 25} className="wire-node-lab">
              {r.label}
            </text>
            <circle cx={CX2 + 110} cy={r.y + 20} r="4" fill="#7c63f0" opacity="0.9" />
          </g>
        ))}

        <text
          x={CX1 + 60}
          y={30}
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.2em"
        >
          AI LAYER
        </text>
        <text
          x={HUB_X}
          y={30}
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.2em"
        >
          TRAQ
        </text>
        <text
          x={CX2 + 45}
          y={30}
          textAnchor="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.2em"
        >
          YOUR STACK
        </text>
      </svg>
    </div>
  );
}

export default function Hero() {
  const trustedLoop = [...TRUSTED_PLATFORMS, ...TRUSTED_PLATFORMS, ...TRUSTED_PLATFORMS];

  return (
    <section
      id="top"
      className="relative isolate min-h-screen overflow-hidden px-5 pb-24 pt-36 sm:px-8 sm:pt-40"
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

      {/* Floating metric cards */}
      <div className="hero-float tl">
        <div className="float-card">
          <div className="float-label">Pilot delivery</div>
          <div className="float-value">1–3 weeks</div>
        </div>
      </div>
      <div className="hero-float tr">
        <div className="float-card">
          <div className="float-row">
            <span className="float-icon">⚙️</span>
            <div>
              <div className="float-label" style={{ margin: 0 }}>
                Automations
              </div>
              <div className="float-value">+340 active</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-float bl">
        <div className="float-card">
          <div className="float-row">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <div>
              <div className="float-label" style={{ margin: 0 }}>
                Live pipeline
              </div>
              <div className="float-value" style={{ fontSize: 15 }}>
                99.98% uptime
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-float br">
        <div className="float-card">
          <div className="float-label">Avg time saved</div>
          <div className="float-value" style={{ color: '#b7a7ff' }}>
            40%+
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div className="hero-kicker">
          <span className="hero-kicker-badge">NEW</span>
          <span>AI · Automation · Data · Digital presence</span>
        </div>

        <h1 className="hero-title mt-10">
          <span className="line">We wire AI into</span>
          <span className="line">how your business</span>
          <span className="line accent">actually works.</span>
        </h1>

        <p className="hero-sub">
          A delivery team — not a consultancy. We design, build and ship the AI systems,
          automations and sites that make your operation run on rails.
        </p>

        <div className="hero-actions mt-10 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-bg-base shadow-glow transition-all hover:-translate-y-px hover:bg-[#f0edff] hover:shadow-glow-strong active:scale-[0.98]"
          >
            Book a Free Call
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Link>
          <Link
            href="/#services"
            className="inline-flex items-center gap-2.5 rounded-full border border-border-strong bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-traq-light hover:bg-white/[0.08]"
          >
            Explore Services
          </Link>
        </div>

        <HeroWire />

        <div className="hero-trusted">
          <div className="hero-trusted-label">Powered by leading AI</div>
          <div className="trusted-row">
            <div className="trusted-track-orbital">
              {trustedLoop.map((t, i) => (
                <div key={`${t.name}-${i}`} className="trusted-item">
                  <span
                    className="trusted-dot"
                    style={{ background: t.dot, boxShadow: `0 0 10px ${t.dot}` }}
                  />
                  {t.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-cue">
          <div className="hero-cue-mouse" />
        </div>
      </div>
    </section>
  );
}
