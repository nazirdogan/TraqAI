import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

type Props = { name: string };

const value = { color: '#0f172a', fontSize: '15px', lineHeight: '24px', margin: '0 0 16px 0' };

/**
 * Receipt only, deliberately.
 *
 * A seat is confirmed, waitlisted or declined by hand, in a separate email, so
 * this one must not read as an acceptance. It says the application arrived and
 * when to expect an answer, and stops there.
 */
export default function AiPlanSessionAckEmail({ name }: Props) {
  const firstName = name.trim().split(/\s+/)[0] || name.trim();

  return (
    <Html>
      <Head />
      <Preview>Your application for the 2027 AI Plan session has arrived.</Preview>
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
          <Heading
            style={{ color: '#0f172a', fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0' }}
          >
            {`Thanks, ${firstName}.`}
          </Heading>

          <Text style={value}>
            {'Thanks for applying to the 2027 AI Plan session. I read every application personally and will get back to you within a day or two either way.'}
          </Text>

          <Text style={value}>
            {'This email confirms I have your application, nothing more. Seats are limited, so I will write to you separately once I have been through it.'}
          </Text>

          <Text style={{ ...value, margin: '24px 0 0 0' }}>
            {'Nazir'}
            <br />
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {'Traq Collective, hello@traqcollective.com'}
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
