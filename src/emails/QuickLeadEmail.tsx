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

type Props = { intake: QuickIntake };

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };
const heading = { color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 18px 0' };

export default function QuickLeadEmail({ intake }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`Quick-form lead: ${intake.firstName} ${intake.lastName} @ ${intake.company}`}</Preview>
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
          <Heading style={heading}>Quick-form lead</Heading>
          <Text style={value}>
            <strong>
              {intake.firstName} {intake.lastName}
            </strong>{' '}
            from <strong>{intake.company}</strong>
          </Text>
          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Section>
            <Text style={label}>Email</Text>
            <Text style={value}>{intake.email}</Text>

            <Text style={label}>What they&rsquo;re trying to solve</Text>
            <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{intake.problem}</Text>

            <Text style={label}>Services of interest</Text>
            <Text style={value}>{intake.servicesOfInterest.join(', ')}</Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px' }}>
            Submitted via the quick form. Ping the lead within the hour. They were told to
            expect it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
