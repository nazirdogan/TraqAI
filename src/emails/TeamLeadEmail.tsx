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
import type { ChatMessage } from '@/lib/intake/types';
import type { LeadProfile } from '@/lib/intake/types';

type Props = {
  profile: LeadProfile;
  transcript: ChatMessage[];
};

const label = { color: '#6b7280', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0 0 4px 0' };
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };
const heading = { color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 18px 0' };

export default function TeamLeadEmail({ profile, transcript }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`New lead: ${profile.firstName} ${profile.lastName} @ ${profile.company} — ${profile.problemTag}`}</Preview>
      <Body style={{ background: '#f5f5f7', fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: '24px' }}>
        <Container style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '640px' }}>
          <Heading style={heading}>New qualified lead</Heading>
          <Text style={value}>
            <strong>
              {profile.firstName} {profile.lastName}
            </strong>
            {profile.role ? <> — {profile.role}</> : null} at{' '}
            <strong>{profile.company}</strong> ({profile.industry})
          </Text>
          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Section>
            <Text style={label}>Email</Text>
            <Text style={value}>{profile.email}</Text>

            <Text style={label}>Core problem</Text>
            <Text style={value}>{profile.problem}</Text>

            {profile.painPoints && profile.painPoints.length > 0 ? (
              <>
                <Text style={label}>Pain points</Text>
                <Text style={value}>
                  {profile.painPoints.map((p, i) => (
                    <span key={i}>
                      • {p}
                      <br />
                    </span>
                  ))}
                </Text>
              </>
            ) : null}

            <Text style={label}>Desired outcome</Text>
            <Text style={value}>{profile.desiredOutcome}</Text>

            <Text style={label}>Services of interest</Text>
            <Text style={value}>
              {profile.servicesOfInterest.length === 0 ? '—' : profile.servicesOfInterest.join(', ')}
            </Text>

            <Text style={label}>Timeline</Text>
            <Text style={value}>{profile.timeline}</Text>

            <Text style={label}>Budget band</Text>
            <Text style={value}>{profile.budgetBand}</Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...label, margin: '0 0 10px 0' }}>Full transcript</Text>
          {transcript.map((m, i) => (
            <Section key={i} style={{ margin: '0 0 10px 0' }}>
              <Text style={{ ...label, margin: '0 0 2px 0', color: m.role === 'assistant' ? '#5B3FE4' : '#0f172a' }}>
                {m.role === 'assistant' ? 'Traq AI' : `${profile.firstName}`}
              </Text>
              <Text style={{ ...value, margin: 0, whiteSpace: 'pre-wrap' }}>{m.content}</Text>
            </Section>
          ))}
        </Container>
      </Body>
    </Html>
  );
}
