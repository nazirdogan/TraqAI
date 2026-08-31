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
import type { StoredPrep } from '@/lib/intake/applications';

type Props = { prep: StoredPrep };

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Section>
      <Text style={label}>{name}</Text>
      <Text style={value}>{children}</Text>
    </Section>
  );
}

/**
 * One attendee's pre-session task, as it needs to be read: the workflow first,
 * then the two numbers that decide where it lands on the board, then whatever
 * else they thought was worth saying. This is table material, so it is laid out
 * to be skimmed the night before rather than filed.
 */
export default function AiPlanPrepEmail({ prep }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`Pre-session task: ${prep.name}, ${prep.company}`}</Preview>
      <Body
        style={{
          background: '#f5f5f7',
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          padding: '24px',
        }}
      >
        <Container
          style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '640px' }}
        >
          <Heading style={{ color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 6px 0' }}>
            Pre-session task
          </Heading>
          <Text style={{ ...value, color: '#6b7280', fontSize: '13px', margin: '0 0 18px 0' }}>
            {new Date(prep.submittedAt).toUTCString()}
          </Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 0 18px 0' }} />

          <Field name="Who">{`${prep.name}, ${prep.company}`}</Field>
          <Field name="Email">{prep.email}</Field>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Field name="The workflow">{prep.workflow}</Field>
          <Field name="Hours a week it costs">{prep.hoursPerWeek}</Field>
          <Field name="People who touch it">{prep.peopleInvolved}</Field>
          {prep.anythingElse ? <Field name="Anything else">{prep.anythingElse}</Field> : null}

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px', margin: 0 }}>
            {`Submitted via traqcollective.com/ai-plan-session/prep. Reference ${prep.id}. This is table material for the session: they have been told it will be used live.`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
