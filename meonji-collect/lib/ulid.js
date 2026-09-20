// ULID: 10자 시간(밀리초) + 16자 난수, Crockford Base32. 같은 밀리초면 난수를 1 올려 정렬을 지킨다.
const ENC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const TIME_LEN = 10;
const RAND_LEN = 16;

let lastTime = -1;
let lastRand = null;

function defaultRng(n) {
  const out = new Array(n);
  const c = globalThis.crypto;
  if (c && typeof c.getRandomValues === 'function') {
    const bytes = new Uint8Array(n);
    c.getRandomValues(bytes);
    for (let i = 0; i < n; i++) out[i] = bytes[i] & 31;
  } else {
    for (let i = 0; i < n; i++) out[i] = Math.floor(Math.random() * 32);
  }
  return out;
}

function encodeTime(ms) {
  let t = ms;
  const chars = new Array(TIME_LEN);
  for (let i = TIME_LEN - 1; i >= 0; i--) {
    chars[i] = ENC[t % 32];
    t = Math.floor(t / 32);
  }
  return chars.join('');
}

function increment(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 31) { digits[i] += 1; return digits; }
    digits[i] = 0;
  }
  return digits; // 넘치면 0으로 돌아간다(실질적으로 일어나지 않음)
}

export function ulid(now = Date.now(), rng = defaultRng) {
  let rand;
  if (now === lastTime && lastRand) {
    rand = increment(lastRand.slice());
  } else {
    rand = rng(RAND_LEN);
  }
  lastTime = now;
  lastRand = rand;
  return encodeTime(now) + rand.map((d) => ENC[d]).join('');
}

export function isUlid(s) {
  return typeof s === 'string' && s.length === 26 && /^[0-9A-HJKMNP-TV-Z]{26}$/.test(s);
}

export function ulidTime(id) {
  let t = 0;
  for (let i = 0; i < TIME_LEN; i++) t = t * 32 + ENC.indexOf(id[i]);
  return t;
}
