import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import { AI_PLAN_EVENT as EVENT, eventDateLong, eventTimeRange } from '@/lib/event';

type Props = { name: string; secureSeatUrl: string };

const value = { color: '#0f172a', fontSize: '15px', lineHeight: '24px', margin: '0 0 16px 0' };

/**
 * Sent to an approved person the moment the form approves them.
 *
 * The form has already sent them to the deposit page. This is the same link in
 * their inbox, for the person who closed the tab, got pulled into a meeting,
 * or wants to pay from a different device. It says the seat is not held until
 * the deposit clears, because that is the one thing they need to know.
 */
export default function AiPlanHoldYourSeatEmail({ name, secureSeatUrl }: Props) {
  const firstName = name.trim().split(/\s+/)[0] || name.trim();

  return (
    <Html>
      <Head />
      <Preview>{`You are through. One step left to secure your seat on ${eventDateLong()}.`}</Preview>
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
            {`${firstName}, you are through.`}
          </Heading>

          <Text style={value}>
            {`There is a seat for you at ${EVENT.name}: ${eventDateLong()}, ${eventTimeRange()}, in ${EVENT.city}.`}
          </Text>

          <Text style={value}>
            {`One step left. The seat is secured with a fully refundable AED ${EVENT.depositAed}, which comes back to you in the room on the day. It exists so the ${EVENT.capacity} seats go to people who are coming, nothing more. Your seat is not secured until this is done.`}
          </Text>

          <Button
            href={secureSeatUrl}
            style={{
              background: '#5b3fe4',
              borderRadius: '999px',
              color: '#ffffff',
              display: 'inline-block',
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 24px',
              margin: '4px 0 20px 0',
            }}
          >
            {`Secure my seat with AED ${EVENT.depositAed}`}
          </Button>

          <Text style={{ ...value, color: '#6b7280', fontSize: '13px', lineHeight: '20px' }}>
            {'If the button does not work, this is the link: '}
            <Link href={secureSeatUrl} style={{ color: '#5b3fe4' }}>
              {secureSeatUrl}
            </Link>
          </Text>

          <Text style={value}>
            {'The room is in Downtown Dubai. Once the hold is in, I will send you the exact address the week before, with the link to your decision record and one short pre-session form. The form closes 48 hours before the session.'}
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
