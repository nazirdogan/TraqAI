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
import type { StoredSignUp } from '@/lib/intake/applications';

type Props = { signUp: StoredSignUp };

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

const OUTCOME_LINE: Record<StoredSignUp['outcome'], { title: string; note: string }> = {
  approved: {
    title: 'Approved by the form',
    note: 'They have been sent to the deposit page and emailed the same link. Stripe will show whether the hold clears; nothing more to do unless it does not.',
  },
  declined_not_leadership: {
    title: 'Declined by the form: not leadership',
    note: 'They were told on screen that the room is for the people who own the decision, and asked to pass the page on. They were not emailed. If the rule is wrong about this person, reply to this email and send them the deposit link by hand.',
  },
  declined_competitor: {
    title: 'Declined by the form: our own line of work',
    note: 'They were told on screen, politely, and not emailed. No action unless you want to reach out.',
  },
};

/**
 * The sign-up, laid out to be read in one pass on a phone: what the form
 * decided at the top, who they are next, the context fields last. The decision
 * has already been made when this lands; the email exists so it can be checked
 * and, if needed, overridden.
 */
export default function AiPlanSignUpNotifyEmail({ signUp }: Props) {
  const submitted = new Date(signUp.submittedAt).toUTCString();
  const outcome = OUTCOME_LINE[signUp.outcome];

  return (
    <Html>
      <Head />
      <Preview>{`${outcome.title}: ${signUp.name}, ${signUp.company}`}</Preview>
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
          <Heading style={heading}>{outcome.title}</Heading>
          <Text style={{ ...value, color: '#6b7280', fontSize: '13px', margin: '0 0 18px 0' }}>
            {submitted}
          </Text>
          <Text style={{ ...value, margin: '0 0 18px 0' }}>{outcome.note}</Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 0 18px 0' }} />

          {/* Every field once, labelled, in the order they were asked. */}
          <Field name="Name">{signUp.name}</Field>
          <Field name="Position">{signUp.position}</Field>
          <Field name="Company">{signUp.company}</Field>
          <Field name="Company size">{signUp.companySize}</Field>
          <Field name="Email">{signUp.email}</Field>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Field name="Most repetitive thing the team does every day">
            {signUp.repetitiveWork}
          </Field>
          <Field name="Pays for ChatGPT, Copilot, Gemini or similar">
            {signUp.paysForAiTools}
          </Field>
          <Field name="Can attend the full session">
            {signUp.canAttendFullSession ? 'Yes, confirmed' : 'Not confirmed'}
          </Field>

          {signUp.click && Object.keys(signUp.click).length > 0 ? (
            <Field name="Click attribution">
              {Object.entries(signUp.click)
                .filter(([, v]) => Boolean(v))
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')}
            </Field>
          ) : null}

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px', margin: 0 }}>
            {`Submitted via traqcollective.com/ai-plan-session/sign-up. Reference ${signUp.id}, which is what arrives in Stripe as the payment's client reference. Reply to this email to reach them directly.`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
