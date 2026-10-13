import test from 'node:test';
import assert from 'node:assert/strict';
import { choosePair, nextReaction } from '../src/reaction.js';
import { SPEC } from '../src/config.js';
import { readFile } from 'node:fs/promises';

test('native handoff JSON exactly matches the runnable configuration', async () => {
  const spec = JSON.parse(await readFile(new URL('../motion-spec.json', import.meta.url), 'utf8'));
  assert.deepEqual(SPEC, spec);
});

test('all 7,656 ordered draws contain exactly two distinct, intact emoji', () => {
  const pool = SPEC.emoji.pool, pairs = new Set();
  assert.equal(new Set(pool).size, 88);
  for (let first = 0; first < pool.length; first++) for (let second = 0; second < pool.length - 1; second++) {
    const draws = [(first + .5) / pool.length, (second + .5) / (pool.length - 1)];
    const pair = choosePair(pool, () => draws.shift());
    assert.equal(pair.length, 2);
    assert.notEqual(pair[0], pair[1]);
    pair.forEach(e => assert.ok(pool.includes(e)));
    pairs.add(JSON.stringify([...pair].sort()));
  }
  assert.equal(pairs.size, 3828);
});
test('invalid pools still return two distinct visible strings', () => {
  for (const pool of [[], ['✨'], ['👍', '👍'], ['', null, ' ', '❤️']]) {
    const pair = choosePair(pool);
    assert.equal(pair.length, 2); assert.notEqual(pair[0], pair[1]);
  }
});
test('one user stops at five, while three participants together stop at twelve', () => {
  let totalCount = 0;
  for (const expected of [5, 5, 2]) {
    let userCount = 0, accepted = 0;
    for (let i = 0; i < 7; i++) {
      const result = nextReaction({ userCount, totalCount });
      if (result.accepted) { userCount = result.userCount; totalCount = result.totalCount; accepted++; }
    }
    assert.equal(accepted, expected);
  }
  assert.equal(totalCount, 12);
});
test('own messages and corrupt state never change counts', () => {
  assert.equal(nextReaction({ own: true }).reason, 'own-message');
  for (const value of [NaN, -1, 1.5, '1']) assert.equal(nextReaction({ userCount: value, totalCount: 4 }).accepted, false);
  assert.equal(nextReaction({ userCount: 4, totalCount: 3 }).accepted, false);
});
