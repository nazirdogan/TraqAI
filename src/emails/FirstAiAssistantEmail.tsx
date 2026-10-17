import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Text } from '@react-email/components';

export type EmailBlock =
  | { kind: 'p'; text: string }
  | { kind: 'button'; label: string; href: string }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'small'; text: string };

type Props = {
  preview: string;
  heading: string;
  blocks: EmailBlock[];
  /** The small purple line above the heading. */
  kicker?: string;
};

const p = { color: '#141414', fontSize: '15px', lineHeight: '24px', margin: '0 0 14px 0' };

/**
 * One template for every "Your First AI Assistant" email: confirmation,
 * reminders, the "we're live" nudge and the follow-ups. The content lives in
 * lib/first-ai-assistant-emails.ts so the copy can change without touching
 * markup.
 */
export default function FirstAiAssistantEmail({ preview, heading, blocks, kicker = 'Traq Collective · Your First AI Assistant' }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ background: '#f5f5f7', fontFamily: 'Inter, system-ui, sans-serif', margin: 0, padding: '24px' }}>
        <Container style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', maxWidth: '560px' }}>
          <Text style={{ color: '#5b3fe4', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
            {kicker}
          </Text>
          <Heading style={{ color: '#141414', fontSize: '22px', fontWeight: 650, lineHeight: '30px', margin: '0 0 18px 0' }}>{heading}</Heading>
          {blocks.map((b, i) => {
            if (b.kind === 'p') return <Text key={i} style={p}>{b.text}</Text>;
            if (b.kind === 'small') return <Text key={i} style={{ ...p, color: '#6b6b6b', fontSize: '13px', lineHeight: '20px' }}>{b.text}</Text>;
            if (b.kind === 'list')
              return (
                <Text key={i} style={p}>
                  {b.items.map((it, j) => (
                    <span key={j} style={{ display: 'block', margin: '0 0 6px 0' }}>{`• ${it}`}</span>
                  ))}
                </Text>
              );
            if (b.kind === 'link')
              return (
                <Text key={i} style={p}>
                  <Link href={b.href} style={{ color: '#5b3fe4', fontWeight: 600 }}>{b.label}</Link>
                </Text>
              );
            return (
              <Button
                key={i}
                href={b.href}
                style={{ background: '#5b3fe4', borderRadius: '999px', color: '#ffffff', display: 'inline-block', fontSize: '15px', fontWeight: 600, margin: '6px 0 18px 0', padding: '13px 26px' }}
              >
                {b.label}
              </Button>
            );
          })}
          <Hr style={{ borderColor: '#ececec', margin: '22px 0 14px 0' }} />
          <Text style={{ color: '#6b6b6b', fontSize: '12px', lineHeight: '18px', margin: 0 }}>
            {'Naz, Traq Collective L.L.C-FZ, Dubai. You are getting this because you signed up or booked at traqcollective.com. Reply to this email with any question, or reply "stop" and you will not hear from us again.'}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
