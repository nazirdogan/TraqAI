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
import type { LeadProfile } from '@/lib/intake/types';

type Props = {
  profile: LeadProfile;
  callbackWindow?: string;
};

const label = { color: '#6b7280', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0 0 4px 0' };
const value = { color: '#0f172a', fontSize: '14px', lineHeight: '22px', margin: '0 0 14px 0' };

export default function LeadConfirmationEmail({ profile, callbackWindow = 'within the next hour' }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out to Traq Collective. Here&rsquo;s what we heard.</Preview>
      <Body style={{ background: '#f5f5f7', fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: '24px' }}>
        <Container style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '560px' }}>
          <Heading style={{ color: '#0f172a', fontSize: '22px', fontWeight: 600, margin: '0 0 14px 0' }}>
            Thanks, {profile.firstName}.
          </Heading>
          <Text style={{ ...value, margin: '0 0 18px 0' }}>
            A Traq Collective specialist will call or email you {callbackWindow}. Here&rsquo;s a quick recap of what we captured. Reply to this email if any of it looks off.
          </Text>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Section>
            <Text style={label}>Who</Text>
            <Text style={value}>
              {profile.firstName} {profile.lastName}
              {profile.role ? `, ${profile.role}` : ''} at {profile.company}
            </Text>

            <Text style={label}>Problem</Text>
            <Text style={value}>{profile.problem}</Text>

            <Text style={label}>What &ldquo;done&rdquo; looks like</Text>
            <Text style={value}>{profile.desiredOutcome}</Text>

            <Text style={label}>Timeline &middot; Budget band</Text>
            <Text style={value}>
              {profile.timeline} &middot; {profile.budgetBand}
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '18px 0' }} />

          <Text style={{ ...value, color: '#6b7280' }}>
            Traq Collective<br />
            hello@traqcollective.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
