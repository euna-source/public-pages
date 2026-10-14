import { SPEC } from './config.js?v=20261014f';

/** Each result contains two whole emoji strings, never UTF-16 fragments. Entries in `exclude` are skipped while enough remain. */
export function choosePair(input = SPEC.emoji.pool, random = Math.random, exclude = []) {
  const valid = [...new Set(input.filter(x => typeof x === 'string' && x.trim()))];
  const rest = valid.filter(x => !exclude.includes(x));
  const pool = rest.length >= 2 ? rest : valid;
  if (!pool.length) return ['👍', '✨'];
  if (pool.length === 1) return [pool[0], pool[0] === '✨' ? '👍' : '✨'];
  const first = Math.floor(random() * pool.length);
  let second = Math.floor(random() * (pool.length - 1));
  if (second >= first) second++;
  return [pool[first], pool[second]];
}

/** Two kinds × three each, shuffled so the kinds mix while spawning. */
export function buildBurst(pair, perKind = SPEC.emoji.countPerKind, random = Math.random) {
  const out = pair.flatMap(glyph => Array(perKind).fill(glyph));
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

/** Pure demo rule. The production server must enforce these checks atomically. */
export function nextReaction({ own = false, userCount = 0, totalCount = 0 }, limits = SPEC.interaction) {
  if (![userCount, totalCount].every(Number.isInteger) || userCount < 0 || totalCount < userCount) {
    return { accepted: false, reason: 'invalid-state' };
  }
  if (own) return { accepted: false, reason: 'own-message' };
  // Past either limit the emoji still play; only the text growth and counts stop.
  if (totalCount >= limits.perMessageLimit) return { accepted: true, grow: false, reason: 'message-limit', userCount, totalCount };
  if (userCount >= limits.perUserPerMessageLimit) return { accepted: true, grow: false, reason: 'user-limit', userCount, totalCount };
  return { accepted: true, grow: true, userCount: userCount + 1, totalCount: totalCount + 1 };
}
