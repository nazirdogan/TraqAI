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

export type PreCallSubmission = {
  name: string;
  teamSize: string;
  aiRelationship: string;
  bottleneck: string;
  timeline: string;
  budget: string;
};

type Props = { data: PreCallSubmission };

const label = {
  color: '#6b7280',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 18px 0' };
const heading = { color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 6px 0' };
const sub = { color: '#6b7280', fontSize: '13px', margin: '0 0 20px 0' };

export default function PreCallLeadEmail({ data }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`Pre-call intake: ${data.name} — ${data.timeline} · ${data.budget}`}</Preview>
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
          <Heading style={heading}>Pre-call intake</Heading>
          <Text style={sub}>Submitted by {data.name} ahead of their call.</Text>
          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Section>
            <Text style={label}>Team size</Text>
            <Text style={value}>{data.teamSize}</Text>

            <Text style={label}>Current relationship with AI</Text>
            <Text style={value}>{data.aiRelationship}</Text>

            <Text style={label}>Biggest bottleneck right now</Text>
            <Text style={value}>{data.bottleneck}</Text>

            <Text style={label}>How quickly can they move</Text>
            <Text style={value}>{data.timeline}</Text>

            <Text style={label}>Monthly budget</Text>
            <Text style={value}>{data.budget}</Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280', fontSize: '12px' }}>
            Submitted via traqcollective.com/pre-call. Review before the call.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
