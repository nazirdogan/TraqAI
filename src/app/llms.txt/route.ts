import { SERVICES, COMPANY } from '@/lib/constants';
import { ARTICLES } from '@/lib/content/insights';
import { absoluteUrl } from '@/lib/seo/schema';

/**
 * /llms.txt — a clean, plain-text map of the most citable pages for AI crawlers
 * and answer engines (the llmstxt.org convention). Generated from the same
 * SERVICES constant and ARTICLES registry that drive the pages and JSON-LD, so
 * it never drifts out of sync. Served statically.
 */
export const dynamic = 'force-static';

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push('# Traq Collective');
  lines.push('');
  lines.push(
    '> Traq Collective is a UAE-based AI enablement partner that helps teams actually use the AI they already pay for: hands-on training, embedded consulting, implementation, and agentic infrastructure. Delivered in person across Dubai and Abu Dhabi, and remotely worldwide.',
  );
  lines.push('');
  lines.push(
    'We work as an embedded AI partner, not a deck-and-leave consultant or a black-box agency. We train your people on their real work, wire AI into the tools you already use, set light guardrails, and leave the capability in-house. Founder: Nazir Dogan.',
  );
  lines.push('');

  lines.push('## Services');
  for (const service of SERVICES) {
    lines.push(`- [${service.title}](${absoluteUrl(`/services/${service.slug}`)}): ${service.description}`);
  }
  lines.push('');

  lines.push('## Location and engagement');
  lines.push(
    `- [AI consulting and training in the UAE](${absoluteUrl('/ai-consulting-uae')}): In-person AI training and consulting for teams in Dubai and Abu Dhabi, delivered remotely worldwide.`,
  );
  lines.push(
    `- [Embedded AI partner](${absoluteUrl('/fractional-head-of-ai')}): Senior, part-time AI leadership delivered with your team, a better fit than a fractional Head of AI for most mid-market teams.`,
  );
  lines.push('');

  lines.push('## Insights (guides)');
  for (const article of ARTICLES) {
    lines.push(`- [${article.h1}](${absoluteUrl(`/insights/${article.slug}`)}): ${article.metaDescription}`);
  }
  lines.push('');

  lines.push('## Key pages');
  lines.push(
    `- [About Traq Collective](${absoluteUrl('/about')}): Founder-led AI enablement partner; founder Nazir Dogan.`,
  );
  lines.push(
    `- [Book a free AI strategy call](${absoluteUrl('/book')}): Find where AI saves your team the most time.`,
  );
  lines.push(
    `- [Free AI readiness assessment](${absoluteUrl('/ai-readiness')}): A scored, two-minute check of how ready your company is for AI.`,
  );
  lines.push(`- [FAQ](${absoluteUrl('/faq')}): Common questions about working with Traq Collective.`);
  lines.push('');

  lines.push('## Contact');
  lines.push(`- Email: ${COMPANY.email}`);
  lines.push(`- Phone: ${COMPANY.phone}`);
  lines.push(`- Location: ${COMPANY.location}`);
  lines.push('');

  return lines.join('\n');
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
