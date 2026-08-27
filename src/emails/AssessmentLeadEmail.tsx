import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { AssessmentIntake } from '@/lib/intake/types';

type Props = { intake: AssessmentIntake; maxScore?: number };

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };
const heading = { color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 18px 0' };

export default function AssessmentLeadEmail({ intake, maxScore = 27 }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`AI Readiness lead: ${intake.firstName} @ ${intake.company} - ${intake.band}`}</Preview>
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
            maxWidth: '640px',
          }}
        >
          <Heading style={heading}>AI Readiness assessment lead</Heading>
          <Text style={value}>
            <strong>{intake.firstName}</strong> from <strong>{intake.company}</strong> scored{' '}
            <strong>
              {intake.score} of {maxScore}
            </strong>{' '}
            &mdash; band <strong>{intake.band}</strong>.
          </Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Section>
            <Text style={label}>Email</Text>
            <Text style={value}>{intake.email}</Text>

            <Text style={label}>Band</Text>
            <Text style={value}>{intake.band}</Text>

            <Text style={label}>Score</Text>
            <Text style={value}>
              {intake.score} / {maxScore}
            </Text>

            {intake.budget ? (
              <>
                <Text style={label}>Budget</Text>
                <Text style={value}>{intake.budget}</Text>
              </>
            ) : null}

            {intake.source ? (
              <>
                <Text style={label}>Source</Text>
                <Text style={value}>{intake.source}</Text>
              </>
            ) : null}

            {intake.attribution ? (
              <>
                <Text style={label}>Attribution</Text>
                <Text style={value}>{intake.attribution}</Text>
              </>
            ) : null}
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...label, margin: '0 0 10px 0' }}>Answers</Text>
          {intake.answers.map((a, i) => (
            <Section key={i} style={{ margin: '0 0 12px 0' }}>
              <Text style={{ ...label, margin: '0 0 2px 0', textTransform: 'none', fontSize: '12px' }}>
                {a.question}
              </Text>
              <Text style={{ ...value, margin: 0 }}>
                {a.answer} <span style={{ color: '#6b7280' }}>({a.score}/3)</span>
              </Text>
            </Section>
          ))}

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px' }}>
            Submitted via the AI readiness assessment. This is a warm lead who has just told you
            exactly where they stand. Reply to this email to reach them directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
