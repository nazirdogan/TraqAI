/**
 * The rules that decide which touches become lead-sheet rows, pinned down.
 *
 * Run with `node --test src/lib/intake/touch.test.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyContactLink,
  isPlausibleGclid,
  isSameSiteOrigin,
  isTouchKind,
  shouldRecordTouch,
} from './touch.ts';

const REAL_GCLID =
  'CjwKCAjwoaLWBhAWEiwAnyituyrbzYbmFnsyGrkbURWIC9jZArPuAnQlz_WwmgbAqpi9NgQkuYJZsxoCWfgQAvD_BwE';

test('phone links are phone taps, however they are written', () => {
  assert.equal(classifyContactLink('tel:+971508687196'), 'phone_click');
  assert.equal(classifyContactLink('  TEL:+971 50 868 7196 '), 'phone_click');
});

test('every WhatsApp link shape is a WhatsApp tap', () => {
  assert.equal(classifyContactLink('https://wa.me/971508687196'), 'whatsapp_click');
  assert.equal(classifyContactLink('https://api.whatsapp.com/send?phone=971508687196'), 'whatsapp_click');
  assert.equal(classifyContactLink('https://web.whatsapp.com/send?phone=971508687196'), 'whatsapp_click');
  assert.equal(classifyContactLink('whatsapp://send?phone=971508687196'), 'whatsapp_click');
});

test('ordinary links are not contact taps', () => {
  assert.equal(classifyContactLink('/book'), null);
  assert.equal(classifyContactLink('mailto:hello@traqcollective.com'), null);
  assert.equal(classifyContactLink('https://www.linkedin.com/company/traq'), null);
  assert.equal(classifyContactLink('https://example.com/wa.me/123'), null);
  assert.equal(classifyContactLink(''), null);
  assert.equal(classifyContactLink(null), null);
});

test('a real gclid passes and junk does not', () => {
  assert.equal(isPlausibleGclid(REAL_GCLID), true);
  assert.equal(isPlausibleGclid('short'), false);
  assert.equal(isPlausibleGclid('has spaces in it but is long enough'), false);
  assert.equal(isPlausibleGclid('<script>alert(1)</script>xxxxxxxxxxxx'), false);
  assert.equal(isPlausibleGclid(''), false);
  assert.equal(isPlausibleGclid(undefined), false);
});

test('a booking is always recorded, with or without a click', () => {
  assert.equal(shouldRecordTouch('calendly_booking', undefined), true);
  assert.equal(shouldRecordTouch('calendly_booking', {}), true);
  assert.equal(shouldRecordTouch('calendly_booking', { gclid: REAL_GCLID }), true);
});

test('a phone or WhatsApp tap is recorded only when it carries attribution', () => {
  assert.equal(shouldRecordTouch('phone_click', { gclid: REAL_GCLID }), true);
  assert.equal(shouldRecordTouch('whatsapp_click', { utmSource: 'linkedin' }), true);
  assert.equal(shouldRecordTouch('phone_click', {}), false);
  assert.equal(shouldRecordTouch('phone_click', undefined), false);
  assert.equal(shouldRecordTouch('whatsapp_click', { gclid: 'junk' }), false);
  assert.equal(shouldRecordTouch('phone_click', { utmSource: '   ' }), false);
});

test('only the three touch kinds are accepted', () => {
  assert.equal(isTouchKind('calendly_booking'), true);
  assert.equal(isTouchKind('phone_click'), true);
  assert.equal(isTouchKind('whatsapp_click'), true);
  assert.equal(isTouchKind('assessment'), false);
  assert.equal(isTouchKind(42), false);
});

test('our own pages pass the origin check and other sites do not', () => {
  assert.equal(isSameSiteOrigin('https://traqcollective.com', 'traqcollective.com'), true);
  assert.equal(isSameSiteOrigin('https://www.traqcollective.com', 'traqcollective.com'), true);
  assert.equal(isSameSiteOrigin('https://traqcollective.com', 'www.traqcollective.com'), true);
  assert.equal(isSameSiteOrigin('http://localhost:3000', 'localhost:3000'), true);
  assert.equal(isSameSiteOrigin('https://evil.example', 'traqcollective.com'), false);
  assert.equal(isSameSiteOrigin('https://traqcollective.com.evil.example', 'traqcollective.com'), false);
  assert.equal(isSameSiteOrigin(null, 'traqcollective.com'), false);
  assert.equal(isSameSiteOrigin('not a url', 'traqcollective.com'), false);
});

test('a full referer URL is checked by its host', () => {
  assert.equal(isSameSiteOrigin('https://traqcollective.com/book?x=1', 'traqcollective.com'), true);
  assert.equal(isSameSiteOrigin('https://evil.example/book', 'traqcollective.com'), false);
});
