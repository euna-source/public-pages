import { collectedTime } from './collected-time.js';
// 카드·기준·설정의 순수 함수. DOM·저장소를 모른다. 시험은 여기를 겨눈다.
export const KINDS = ['product', 'image', 'video', 'stock', 'text', 'other'];
export const ENTRIES = ['share', 'capture', 'folder', 'ticker', 'web', 'mac_pet', 'cli'];
export const VERDICTS = ['like', 'no', 'unknown'];
export const DEFAULT_SETTINGS = Object.freeze({ jev_threshold: 0.8, api_base: null, reveal_seconds: 2 });

export const KIND_LABEL = { product: '상품', image: '이미지', video: '영상', stock: '종목', text: '글', other: '기타' };
export const ENTRY_LABEL = { share: '공유', capture: '캡처', folder: '폴더', ticker: '종목', web: '웹', mac_pet: '맥 펫', cli: 'CLI' };
export const VERDICT_LABEL = { like: 'O', no: 'X', unknown: '모름' };
export const VERDICT_WORD = { like: '좋아요', no: '아니요', unknown: '모름' };

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|heic|heif|avif|bmp|svg)$/i;
const VIDEO_HOST = /(^|\.)(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com)$/i;
const TICKER_KR = /^\d{6}$/;
const TICKER_US = /^[A-Z]{1,5}(\.[A-Z]{1,2})?$/;

export function isUrl(s) {
  if (typeof s !== 'string') return false;
  try {
    const u = new URL(s.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// 붙여넣은 문자열로 kind를 추정한다. 판단은 가볍게, 틀리면 사용자가 칩으로 바꾼다.
export function inferKind(input) {
  const s = (input || '').trim();
  if (!s) return 'other';
  if (isUrl(s)) {
    const u = new URL(s);
    if (VIDEO_HOST.test(u.hostname)) return 'video';
    if (IMAGE_EXT.test(u.pathname)) return 'image';
    return 'product';
  }
  if (TICKER_KR.test(s) || TICKER_US.test(s)) return 'stock';
  return 'text';
}

export function inferEntry(kind, hasFiles) {
  if (kind === 'stock') return 'ticker';
  if (hasFiles) return 'capture';
  return 'web';
}

export function needsJudgment(card, threshold = DEFAULT_SETTINGS.jev_threshold) {
  if (!card || card.deleted) return false;
  if (card.verdict != null) return false;
  const g = card.guess;
  if (!g) return true;
  return !(typeof g.confidence === 'number' && g.confidence >= threshold);
}

function byCreatedAsc(a, b) {
  if (a.created_at !== b.created_at) return a.created_at < b.created_at ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

// 덱에 올릴 카드: 판정이 없고 (추측이 없거나 확신이 임계값 미만), 오래된 순.
export function deckCards(cards, threshold) {
  return (cards || []).filter((c) => needsJudgment(c, threshold)).sort(byCreatedAsc);
}

// 원칙 1: 사용자 판정 전에는 guess를 뷰 모델에 아예 넣지 않는다.
export function deckCardView(card) {
  const { guess, ...rest } = card;
  const judged = card.verdict != null && card.verdict_by === 'user';
  const view = { ...rest, judged };
  if (judged) view.guess = guess ?? null;
  return view;
}

// 목록·상세에서 보여 줄 guess. 판정 없는 카드는 null.
export function visibleGuess(card) {
  if (!card || card.verdict == null || card.verdict_by !== 'user') return null;
  return card.guess ?? null;
}

// 넘긴 뒤 띠에 띄우는 문장. 판정이 없거나 추측이 없으면 null.
export function revealText(card) {
  const g = visibleGuess(card);
  if (!g) return null;
  const agree = g.verdict === card.verdict;
  const conf = typeof g.confidence === 'number' ? g.confidence.toFixed(2) : '?';
  const mark = VERDICT_LABEL[g.verdict] || g.verdict;
  return `Jev는 ${mark}로 봤어요(확신 ${conf})${agree ? ' · 같아요' : card.verdict === 'unknown' ? '' : ' · 달라요'}`;
}

export function newCard(partial = {}, { id, now } = {}) {
  const at = now || new Date().toISOString();
  const source_url = partial.source_url ? String(partial.source_url).trim() : null;
  const kind = partial.kind || inferKind(source_url || partial.title || partial.note || '');
  return {
    id: id || partial.id || null,
    created_at: partial.created_at || at,
    updated_at: at,
    kind,
    entry: partial.entry || inferEntry(kind, (partial.files || []).length > 0),
    source_url,
    title: partial.title ? String(partial.title).trim() || null : null,
    note: partial.note ? String(partial.note) : null,
    files: partial.files ? partial.files.slice() : [],
    tags: normalizeTags(partial.tags),
    verdict: null,
    verdict_by: null,
    verdict_at: null,
    reason: null,
    basis: null,
    basis_who: null,
    guess: null,
    guess_revealed_at: null,
    criteria_version: null,
    domain: 'personal',
    deleted: false,
  };
}

export function normalizeTags(tags) {
  if (!tags) return [];
  const arr = Array.isArray(tags) ? tags : String(tags).split(/[,\s]+/);
  const seen = new Set();
  const out = [];
  for (const t of arr) {
    const v = String(t).trim().replace(/^#/, '');
    if (v && !seen.has(v)) { seen.add(v); out.push(v); }
  }
  return out;
}

const PATCHABLE = ['verdict', 'reason', 'basis', 'basis_who', 'tags', 'title', 'note', 'guess_revealed_at', 'kind', 'entry', 'source_url', 'files', 'deleted'];

// PATCH 규칙: verdict를 보내면 verdict_by='user', verdict_at=now. verdict=null이면 판정을 지운다(되돌리기).
export function applyPatch(card, patch, now = new Date().toISOString()) {
  const next = { ...card };
  for (const k of PATCHABLE) {
    if (!(k in patch)) continue;
    next[k] = k === 'tags' ? normalizeTags(patch[k]) : patch[k];
  }
  if ('verdict' in patch) {
    if (patch.verdict == null) {
      next.verdict = null; next.verdict_by = null; next.verdict_at = null;
    } else {
      if (!VERDICTS.includes(patch.verdict)) throw new Error('bad verdict');
      next.verdict_by = 'user';
      next.verdict_at = now;
    }
  }
  next.updated_at = now;
  return next;
}

// 사용자 판정은 보존하고, 자동 라벨만 현재 추측·임계값으로 재평가한다.
export function applyAutoLabel(card, threshold = DEFAULT_SETTINGS.jev_threshold, now = new Date().toISOString()) {
  if (card.verdict != null && card.verdict_by !== 'jev') return card;
  const g = card.guess;
  const confident = g && ['like', 'no'].includes(g.verdict) && Number.isFinite(g.confidence) && g.confidence >= threshold;
  if (confident) {
    if (card.verdict_by === 'jev' && card.verdict === g.verdict) return card;
    return { ...card, verdict: g.verdict, verdict_by: 'jev', verdict_at: now, updated_at: now };
  }
  if (card.verdict_by === 'jev') return { ...card, verdict: null, verdict_by: null, verdict_at: null, updated_at: now };
  return card;
}

export function applyGuess(card, guess, threshold = DEFAULT_SETTINGS.jev_threshold, now = new Date().toISOString()) {
  const next = applyAutoLabel({ ...card, guess: guess ? { ...guess, at: guess.at || now } : null,
    criteria_version: guess?.criteria_version ?? card.criteria_version, updated_at: now }, threshold, now);
  return { card: next, auto_labeled: next.verdict_by === 'jev' };
}

// id 충돌은 updated_at이 최신인 쪽.
export function mergeById(existing, incoming) {
  const map = new Map();
  for (const c of existing || []) if (c && c.id) map.set(c.id, c);
  let changed = 0;
  for (const c of incoming || []) {
    if (!c || !c.id) continue;
    const cur = map.get(c.id);
    if (!cur || String(c.updated_at || '') >= String(cur.updated_at || '')) {
      if (!cur || cur.updated_at !== c.updated_at || JSON.stringify(cur) !== JSON.stringify(c)) changed++;
      map.set(c.id, c);
    }
  }
  return { list: [...map.values()], changed };
}

// GET /api/cards 의 질의와 같은 필터. 로컬 어댑터가 쓴다.
export function filterCards(cards, q = {}, threshold = DEFAULT_SETTINGS.jev_threshold) {
  let out = (cards || []).filter((c) => c && !c.deleted);
  if (q.needs_judgment) out = out.filter((c) => needsJudgment(c, threshold));
  if (q.verdict !== undefined && q.verdict !== '' && q.verdict !== 'all') {
    out = q.verdict === 'null' || q.verdict === null ? out.filter((c) => c.verdict == null) : out.filter((c) => c.verdict === q.verdict);
  }
  if (q.verdict_by) out = out.filter((c) => c.verdict_by === q.verdict_by);
  if (q.kind) out = out.filter((c) => c.kind === q.kind);
  if (q.entry) out = out.filter((c) => c.entry === q.entry);
  if (q.tag) out = out.filter((c) => (c.tags || []).includes(q.tag));
  if (q.since) out = out.filter((c) => String(c.updated_at) >= String(q.since));
  if (q.q) {
    const needle = String(q.q).toLowerCase();
    out = out.filter((c) => [c.title, c.note, c.source_url, c.reason, ...(c.tags || [])].some((v) => v && String(v).toLowerCase().includes(needle)));
  }
  out.sort(q.needs_judgment ? byCreatedAsc : (a, b) => -byCreatedAsc(a, b));
  if (q.limit) out = out.slice(0, Number(q.limit));
  return out;
}

export function newCriteria(partial = {}, { id, now } = {}) {
  const at = now || new Date().toISOString();
  return {
    id: id || partial.id || null,
    domain: 'personal',
    axis: partial.axis || '',
    good_examples: partial.good_examples || [],
    bad_examples: partial.bad_examples || [],
    tie_break: partial.tie_break ?? null,
    exclude_rules: partial.exclude_rules || [],
    status: partial.status || 'hypothesis',
    version: partial.version || 1,
    history: partial.history || [],
    updated_at: at,
  };
}

// 편집 저장: what/why를 history에 붙이고 version을 올린다.
export function reviseCriteria(criteria, changes, { what, why, evidence_ids = [] }, now = new Date().toISOString()) {
  const next = { ...criteria, ...changes, updated_at: now };
  next.version = (criteria.version || 1) + 1;
  next.history = [...(criteria.history || []), { at: now, what: what || '편집', why: why || '', evidence_ids }];
  return next;
}

export function normalizeSettings(s) {
  const out = { ...DEFAULT_SETTINGS, ...(s || {}) };
  const t = Number(out.jev_threshold);
  out.jev_threshold = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : DEFAULT_SETTINGS.jev_threshold;
  const r = Number(out.reveal_seconds);
  out.reveal_seconds = Number.isFinite(r) ? Math.min(30, Math.max(0, r)) : DEFAULT_SETTINGS.reveal_seconds;
  out.api_base = out.api_base ? String(out.api_base).replace(/\/+$/, '') : null;
  return out;
}

// 해시 라우팅: "#/add?url=…&title=…" → { route: 'add', params: {url, title} }
export function parseHash(hash) {
  const raw = (hash || '').replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const params = {};
  for (const [k, v] of new URLSearchParams(qs)) params[k] = v;
  return { route: path.replace(/\/+$/, '') || 'deck', params };
}

export function exportBundle({ cards, criteria, settings }, now = new Date().toISOString()) {
  return { version: 1, exported_at: now, cards: cards || [], criteria: criteria || [], settings: settings || { ...DEFAULT_SETTINGS } };
}

export function exportFilename(now = new Date()) {
  const d = now instanceof Date ? now : new Date(now);
  const p = (n) => String(n).padStart(2, '0');
  return `meonji-collect-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`;
}

export function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
}

export function fmtDate(iso) {
  return collectedTime(iso)?.exact.split(' ')[0] || '';
}

// 기준 판본이 달라진 기계 추측은 폐기하고 다시 판정할 덱으로 돌린다.
export function invalidateStaleGuesses(cards, criteria, now = new Date().toISOString()) {
  const version = (criteria || []).filter((c) => !c.deleted).map((c) => c.updated_at || '').sort().slice(-1)[0] || null;
  return cards.map((c) => {
    if (c.deleted || c.verdict_by === 'user' || !c.guess || (c.guess.criteria_version || null) === version) return c;
    return applyAutoLabel({ ...c, guess: null, updated_at: now }, DEFAULT_SETTINGS.jev_threshold, now);
  });
}
