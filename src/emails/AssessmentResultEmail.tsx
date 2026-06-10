import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { AssessmentIntake, ReadinessBand } from '@/lib/intake/types';

type Props = { intake: AssessmentIntake; maxScore?: number };

const SITE = 'https://traqcollective.com';

// Band copy mirrors the on-screen result in AssessmentForm so the emailed plan
// matches what the lead just saw. Kept here so the email is self-contained.
const BAND_COPY: Record<
  ReadinessBand,
  { blurb: string; steps: string[]; guideHref: string; guideLabel: string }
> = {
  Early: {
    blurb:
      'You are early, and that is fine. The tools are new to your team and nothing is wired in yet. The fastest wins come from picking one workflow and training a small group on it well.',
    steps: [
      'Pick one team and one task that eats hours every week.',
      'Get that group two to three hands-on sessions on their real work.',
      'Write three simple rules for what is safe to put into AI tools.',
      'Name one person to own adoption, even part-time, so it does not stall.',
    ],
    guideHref: '/insights/how-to-get-your-team-using-ai',
    guideLabel: 'How to get your team using AI',
  },
  Building: {
    blurb:
      'You are building. Some people use AI, you have a sense of where it helps, and leadership is interested. The gap now is consistency: turning a few early adopters into regular use across the team.',
    steps: [
      'Run role-specific training so each team learns AI on their own tasks.',
      'Turn your best use cases into shared, repeatable workflows.',
      'Set clear guardrails everyone follows, not just a few informal rules.',
      'Start measuring hours saved so the wins are visible to leadership.',
    ],
    guideHref: '/insights/ai-readiness-checklist',
    guideLabel: 'The AI readiness checklist',
  },
  Ready: {
    blurb:
      'You are ready. Tools are in place, your team is confident, and leadership backs it. The work now is depth and governance: scaling what works, embedding AI into more workflows, and keeping it safe as you grow.',
    steps: [
      'Scale your proven workflows to more teams and tasks.',
      'Embed AI into the tools you already use, with guardrails built in.',
      'Set a cadence to review adoption, impact and what to build next.',
      'Look at agentic workflows for the repetitive work that runs itself.',
    ],
    guideHref: '/insights/how-agentic-workflows-work',
    guideLabel: 'How agentic workflows work',
  },
};

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };

export default function AssessmentResultEmail({ intake, maxScore = 27 }: Props) {
  const copy = BAND_COPY[intake.band];
  return (
    <Html>
      <Head />
      <Preview>{`Your AI readiness result: ${intake.band} (${intake.score} of ${maxScore})`}</Preview>
      <Body
        style={{
          background: '#f5f5f7',
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          padding: '24px',
        }}
      >
        <Container
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '560px',
          }}
        >
          <Heading style={{ color: '#0f172a', fontSize: '22px', fontWeight: 600, margin: '0 0 14px 0' }}>
            Thanks, {intake.firstName}.
          </Heading>
          <Text style={{ ...value, margin: '0 0 18px 0' }}>
            Here is your AI readiness result and a short plan built around where you scored.
          </Text>

          <Section
            style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '12px',
              padding: '18px 20px',
              margin: '0 0 22px 0',
            }}
          >
            <Text style={{ ...label, margin: '0 0 6px 0' }}>Your band</Text>
            <Text style={{ color: '#5B3FE4', fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>
              {intake.band}
            </Text>
            <Text style={{ ...value, margin: 0, color: '#6b7280', fontSize: '13px' }}>
              Score {intake.score} of {maxScore}
            </Text>
          </Section>

          <Text style={value}>{copy.blurb}</Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...label, margin: '0 0 10px 0' }}>Your next steps</Text>
          {copy.steps.map((step, i) => (
            <Text key={i} style={{ ...value, margin: '0 0 8px 0' }}>
              • {step}
            </Text>
          ))}

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...label, margin: '0 0 10px 0' }}>Where you scored</Text>
          {intake.answers.map((a, i) => (
            <Text key={i} style={{ ...value, margin: '0 0 6px 0', fontSize: '13px' }}>
              {a.answer} <span style={{ color: '#6b7280' }}>({a.score}/3)</span>
            </Text>
          ))}

          <Hr style={{ borderColor: '#e5e7eb', margin: '22px 0 18px 0' }} />

          <Text style={{ ...value, margin: '0 0 14px 0' }}>
            Want a steer on where to start? Read{' '}
            <Link href={`${SITE}${copy.guideHref}`} style={{ color: '#5B3FE4', fontWeight: 600 }}>
              {copy.guideLabel}
            </Link>
            , or book a free call and we will look at your result together.
          </Text>

          <Button
            href={`${SITE}/book`}
            style={{
              background: '#5B3FE4',
              borderRadius: '999px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 28px',
              textDecoration: 'none',
            }}
          >
            Book a free call
          </Button>

          <Hr style={{ borderColor: '#e5e7eb', margin: '22px 0 18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px', margin: 0 }}>
            Traq Collective
            <br />
            hello@traqcollective.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
