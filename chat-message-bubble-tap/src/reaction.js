import { SPEC } from './config.js?v=20261014b';

/** Each result contains two whole emoji strings, never UTF-16 fragments. */
export function choosePair(input = SPEC.emoji.pool, random = Math.random) {
  const pool = [...new Set(input.filter(x => typeof x === 'string' && x.trim()))];
  if (!pool.length) return ['👍', '✨'];
  if (pool.length === 1) return [pool[0], pool[0] === '✨' ? '👍' : '✨'];
  const first = Math.floor(random() * pool.length);
  let second = Math.floor(random() * (pool.length - 1));
  if (second >= first) second++;
  return [pool[first], pool[second]];
}

/** Pure demo rule. The production server must enforce these checks atomically. */
export function nextReaction({ own = false, userCount = 0, totalCount = 0 }, limits = SPEC.interaction) {
  if (![userCount, totalCount].every(Number.isInteger) || userCount < 0 || totalCount < userCount) {
    return { accepted: false, reason: 'invalid-state' };
  }
  if (own) return { accepted: false, reason: 'own-message' };
  if (totalCount >= limits.perMessageLimit) return { accepted: false, reason: 'message-limit' };
  if (userCount >= limits.perUserPerMessageLimit) return { accepted: false, reason: 'user-limit' };
  return { accepted: true, userCount: userCount + 1, totalCount: totalCount + 1 };
}
