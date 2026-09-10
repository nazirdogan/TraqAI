/**
 * The one rule that decides a seat, pinned down.
 *
 * Run with `node --test src/lib/intake/qualify.test.ts`. No test runner is
 * installed in this project, and this module has no imports, so Node's own
 * type stripping and test runner are enough to hold the rule still.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POSITIONS, decideSeat } from './qualify.ts';

test('the three leadership tiers are approved', () => {
  assert.equal(decideSeat('Founder, owner or partner'), 'approved');
  assert.equal(decideSeat('CEO, MD, GM or C-suite'), 'approved');
  assert.equal(decideSeat('Director or head of a function'), 'approved');
});

test('managers and specialists are declined as not leadership', () => {
  assert.equal(decideSeat('Manager or team lead'), 'declined_not_leadership');
  assert.equal(decideSeat('Specialist or individual contributor'), 'declined_not_leadership');
});

test('people in our own line of work are declined as competitors', () => {
  assert.equal(
    decideSeat('I work at an AI vendor, agency or consultancy'),
    'declined_competitor',
  );
});

test('every listed position has a decision, so a new tier cannot slip through undecided', () => {
  for (const p of POSITIONS) {
    assert.match(decideSeat(p), /^(approved|declined_not_leadership|declined_competitor)$/);
  }
});

test('the list is ordered most senior first, which is the order the pills render in', () => {
  assert.equal(POSITIONS[0], 'Founder, owner or partner');
  assert.equal(POSITIONS[POSITIONS.length - 1], 'I work at an AI vendor, agency or consultancy');
});
