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
import type { QuickIntake } from '@/lib/intake/types';

type Props = { intake: QuickIntake; callbackWindow?: string };

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };

export default function QuickConfirmationEmail({
  intake,
  callbackWindow = 'within the next hour',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out to Traq Collective.</Preview>
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
            maxWidth: '520px',
          }}
        >
          <Heading style={{ color: '#0f172a', fontSize: '22px', fontWeight: 600, margin: '0 0 14px 0' }}>
            Thanks, {intake.firstName}.
          </Heading>
          <Text style={{ ...value, margin: '0 0 18px 0' }}>
            A Traq Collective specialist will be in touch {callbackWindow}. Here&rsquo;s a
            copy of what you sent — reply to this email if any detail needs correcting.
          </Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Section>
            <Text style={label}>What you&rsquo;re trying to solve</Text>
            <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{intake.problem}</Text>

            <Text style={label}>Services of interest</Text>
            <Text style={value}>{intake.servicesOfInterest.join(', ')}</Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280' }}>
            &mdash; Traq Collective
            <br />
            hello@traqcollective.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
