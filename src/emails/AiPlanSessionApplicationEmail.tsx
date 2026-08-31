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
import type { StoredApplication } from '@/lib/intake/applications';

type Props = { application: StoredApplication };

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };
const heading = { color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 6px 0' };

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <Section>
      <Text style={label}>{name}</Text>
      <Text style={value}>{children}</Text>
    </Section>
  );
}

/**
 * The application, laid out to be read in one pass on a phone: who they are at
 * the top, the two answers that actually decide a seat in the middle, the
 * context fields last. Nothing is scored or ranked here. The screening is
 * Nazir's, done by hand, after this lands.
 */
export default function AiPlanSessionApplicationEmail({ application }: Props) {
  const submitted = new Date(application.submittedAt).toUTCString();

  return (
    <Html>
      <Head />
      <Preview>{`New application: ${application.name}, ${application.company}`}</Preview>
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
          <Heading style={heading}>2027 AI Plan session application</Heading>
          <Text style={{ ...value, color: '#6b7280', fontSize: '13px', margin: '0 0 18px 0' }}>
            {submitted}
          </Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 0 18px 0' }} />

          {/* Every field once, labelled, in the order they were asked. */}
          <Field name="Name">{application.name}</Field>
          <Field name="Role or job title">{application.role}</Field>
          <Field name="Company">{application.company}</Field>
          <Field name="Company size">{application.companySize}</Field>
          <Field name="Email">{application.email}</Field>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Field name="Most repetitive thing the team does every day">
            {application.repetitiveWork}
          </Field>
          <Field name="Pays for ChatGPT, Copilot, Gemini or similar">
            {application.paysForAiTools}
          </Field>
          <Field name="Leading, or closest to leading, the AI or operations strategy">
            {application.leadsAiStrategy}
          </Field>
          <Field name="Their role in that">{application.strategyRole}</Field>
          <Field name="Can attend the full session">
            {application.canAttendFullSession ? 'Yes, confirmed' : 'Not confirmed'}
          </Field>

          {application.click && Object.keys(application.click).length > 0 ? (
            <Field name="Click attribution">
              {Object.entries(application.click)
                .filter(([, v]) => Boolean(v))
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}
            </Field>
          ) : null}

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px', margin: 0 }}>
            {`Submitted via traqcollective.com/ai-plan-session/apply. Reference ${application.id}. Reply to this email to reach them directly. They have been told they will hear back within a day or two either way.`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
