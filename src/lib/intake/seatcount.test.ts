/**
 * The seat arithmetic, pinned down. Run with
 * `node --test src/lib/intake/seatcount.test.ts`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countPaidSessions,
  matchPaymentLink,
  seatsLine,
  seatsRemaining,
  signUpOpen,
} from './seatcount.ts';

const paid = (refunded = false) => ({
  payment_status: 'paid',
  payment_intent: { latest_charge: { refunded } },
});

test('a completed, paid session is one seat', () => {
  assert.equal(countPaidSessions([paid(), paid(), paid()]), 3);
});

test('a refunded payment gives its seat back', () => {
  assert.equal(countPaidSessions([paid(), paid(true), paid()]), 2);
});

test('an unpaid or abandoned session is not a seat', () => {
  assert.equal(
    countPaidSessions([paid(), { payment_status: 'unpaid' }, { payment_status: 'no_payment_required' }]),
    1,
  );
});

test('a session whose charge was not expanded still counts as paid', () => {
  // Stripe returns ids as strings when the expand is missing. Counting it as a
  // seat is the safe direction: a phantom free seat is what the cap exists to stop.
  assert.equal(countPaidSessions([{ payment_status: 'paid', payment_intent: 'pi_123' }]), 1);
  assert.equal(countPaidSessions([{ payment_status: 'paid', payment_intent: { latest_charge: 'ch_1' } }]), 1);
});

test('remaining never goes below zero, and is unknown when taken is unknown', () => {
  assert.equal(seatsRemaining(15, 0), 15);
  assert.equal(seatsRemaining(15, 15), 0);
  assert.equal(seatsRemaining(15, 17), 0);
  assert.equal(seatsRemaining(15, null), null);
});

test('the public line says what is true at each stage', () => {
  assert.equal(seatsLine(15, null), '15 seats');
  assert.equal(seatsLine(15, 15), '15 seats, all still open');
  assert.equal(seatsLine(15, 9), '9 of 15 seats left');
  assert.equal(seatsLine(15, 1), '1 of 15 seats left');
  assert.equal(seatsLine(15, 0), 'Room full');
});

test('sign-up stays open while seats are unknown, closes at zero, and closes by hand', () => {
  assert.equal(signUpOpen(true, null), true);
  assert.equal(signUpOpen(true, 3), true);
  assert.equal(signUpOpen(true, 0), false);
  assert.equal(signUpOpen(false, 3), false);
});

test('the payment link is found by its public URL, ignoring query strings and trailing slashes', () => {
  const links = [
    { id: 'plink_a', url: 'https://buy.stripe.com/aaa' },
    { id: 'plink_b', url: 'https://buy.stripe.com/bbb' },
  ];
  assert.equal(matchPaymentLink(links, 'https://buy.stripe.com/bbb'), 'plink_b');
  assert.equal(matchPaymentLink(links, 'https://buy.stripe.com/bbb/?prefilled_email=x'), 'plink_b');
  assert.equal(matchPaymentLink(links, 'https://buy.stripe.com/zzz'), null);
});
