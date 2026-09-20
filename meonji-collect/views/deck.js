// 덱: 카드 한 장, 스와이프·버튼·키보드. 넘기기 전엔 guess를 DOM에 넣지 않는다(deckCardView).
import { h, clear, svg, ICON, toast } from '../lib/ui.js';
import { deckCardView, revealText, KIND_LABEL, ENTRY_LABEL, hostOf, fmtDate, VERDICT_LABEL } from '../lib/model.js';

const SWIPE_VERDICT = { right: 'like', left: 'no', up: 'unknown' };

export function mountDeck(root, ctx, { compact = false } = {}) {
  let queue = [];        // 판정 대기 카드(원본, guess 포함이지만 렌더에는 안 씀)
  let undo = null;       // { card, prev }
  let busy = false;
  let destroyed = false;
  let revealTimer = null;
  let draftId = null;
  let loadVersion = 0;
  const drafts = new Map();

  const stack = h('div', { class: 'deck-stack', role: 'group', 'aria-label': '판정할 카드' });
  const stamp = h('div', { class: 'stamp', 'aria-hidden': 'true' });
  const reveal = h('div', { class: 'reveal', role: 'status', 'aria-live': 'polite' });
  const btnX = h('button', { type: 'button', class: 'judge judge-no', title: '아니요 (←)', 'aria-label': '아니요', onClick: () => judgeTop('no') }, svg(ICON.x, { size: 22, stroke: 2.2 }), h('span', null, 'X'));
  const btnU = h('button', { type: 'button', class: 'judge judge-unknown', title: '모름 (↑)', 'aria-label': '모름', onClick: () => judgeTop('unknown') }, h('span', null, '모름'));
  const btnO = h('button', { type: 'button', class: 'judge judge-like', title: '좋아요 (→)', 'aria-label': '좋아요', onClick: () => judgeTop('like') }, svg(ICON.o, { size: 22, stroke: 2.2 }), h('span', null, 'O'));
  const btnUndo = h('button', { type: 'button', class: 'judge judge-undo', title: '되돌리기 (U)', 'aria-label': '되돌리기', disabled: true, onClick: () => undoLast() }, svg(ICON.undo, { size: 18 }));
  const counter = h('span', { class: 'deck-count', 'aria-live': 'polite' });
  const bar = h('div', { class: 'deck-bar' }, btnX, btnU, btnO, btnUndo);
  const reason = h('input', { type: 'text', class: 'input', placeholder: '이유 한 줄 (선택)', 'aria-label': '이유 한 줄 (선택)', maxlength: 200, autocomplete: 'off' });
  const basis = h('select', { class: 'input', 'aria-label': '근거 (선택)' },
    h('option', { value: '' }, '근거 없음'), h('option', { value: 'self' }, '직접 보고'), h('option', { value: 'other' }, '누가 좋다고 해서'));
  const who = h('input', { type: 'text', class: 'input who', placeholder: '누구', 'aria-label': '누구', maxlength: 60, hidden: true });
  const basisDetails = h('details', { class: 'deck-basis' }, h('summary', null, '근거 (선택)'), h('div', { class: 'basis' }, basis, who));
  const notes = h('fieldset', { class: 'deck-notes', 'aria-label': '판정 메모 (선택)' }, reason, basisDetails);
  const readDraft = () => ({ reason: reason.value, basis: basis.value, who: who.value });
  const rememberDraft = () => { if (draftId) drafts.set(draftId, readDraft()); };
  reason.addEventListener('input', rememberDraft);
  who.addEventListener('input', rememberDraft);
  basis.addEventListener('change', () => { who.hidden = basis.value !== 'other'; rememberDraft(); });
  const wrap = h('section', { class: `deck${compact ? ' compact' : ''}` }, h('div', { class: 'deck-head' }, counter), stack, reveal, notes, bar);
  root.append(wrap);

  async function load() {
    if (busy || destroyed) return;
    const version = ++loadVersion;
    try {
      const settings = await ctx.settings();
      const cards = await ctx.adapter.list({ needs_judgment: 1, limit: 50 });
      if (destroyed || busy || version !== loadVersion) return;
      // 어댑터가 이미 걸렀지만, 원격 캐시가 섞일 수 있어 다시 한 번.
      queue = cards.filter((c) => c.verdict == null && (!c.guess || !(c.guess.confidence >= settings.jev_threshold)));
    } catch (e) {
      queue = [];
      toast(e.message || '불러오지 못했어요');
    }
    render();
  }

  function render() {
    if (destroyed) return;
    const card = queue[0];
    notes.hidden = !card;
    notes.disabled = busy;
    if ((card?.id || null) !== draftId) {
      draftId = card?.id || null;
      const draft = card ? (drafts.get(card.id) || { reason: card.reason || '', basis: card.basis || '', who: card.basis_who || '' }) : {};
      reason.value = draft.reason || ''; basis.value = draft.basis || ''; who.value = draft.who || '';
      who.hidden = basis.value !== 'other'; basisDetails.open = false;
    }
    clear(stack);
    if (queue.length === 0) {
      stack.append(h('div', { class: 'deck-empty' },
        h('p', null, '판정할 카드가 없어요.'),
        compact ? null : h('a', { href: '#/add', class: 'btn' }, '담으러 가기')));
      counter.textContent = '';
      bar.classList.add('idle');
      return;
    }
    bar.classList.remove('idle');
    counter.textContent = `${queue.length}장 남음`;
    if (queue[1]) stack.append(cardEl(queue[1], 'next'));
    const top = cardEl(queue[0], 'top');
    top.append(stamp);
    stack.append(top);
    attachDrag(top);
  }

  function cardEl(card, pos) {
    const v = deckCardView(card); // guess 없음
    if ('guess' in v && !v.judged) throw new Error('guess must not be rendered before verdict');
    const el = h('article', { class: `card ${pos} kind-${v.kind}`, dataset: { id: v.id }, tabindex: pos === 'top' ? '0' : null, 'aria-label': v.title || v.source_url || '카드' });
    const media = mediaEl(v);
    if (media) el.append(media);
    const host = v.source_url ? hostOf(v.source_url) : null;
    const meta = h('div', { class: 'card-meta' },
      h('span', { class: 'kind' }, KIND_LABEL[v.kind] || v.kind),
      host ? h('span', { class: 'host' }, host) : null,
      h('span', { class: 'when' }, fmtDate(v.created_at)));
    const title = v.kind === 'stock' && !v.title ? (v.note || v.source_url || '종목') : (v.title || v.note || v.source_url || '제목 없음');
    el.append(h('div', { class: 'card-body' },
      meta,
      h('h2', { class: 'card-title' }, title),
      v.note && v.title ? h('p', { class: 'card-note' }, v.note) : null,
      v.tags && v.tags.length ? h('div', { class: 'tags' }, v.tags.map((t) => h('span', { class: 'tag' }, t))) : null,
      h('span', { class: 'entry' }, ENTRY_LABEL[v.entry] || v.entry)));
    return el;
  }

  function mediaEl(v) {
    if (v.kind === 'stock') return h('div', { class: 'card-media ticker' }, h('span', null, v.title || v.note || v.source_url || ''));
    const f = (v.files || []).find((x) => x.mime && x.mime.startsWith('image/'));
    if (f) {
      const img = h('img', { class: 'card-media', alt: '', loading: 'lazy' });
      ctx.adapter.fileUrl(f.key).then((u) => { if (u) img.src = u; else img.remove(); });
      return img;
    }
    if (v.kind === 'image' && v.source_url) return h('img', { class: 'card-media', alt: '', src: v.source_url, referrerpolicy: 'no-referrer', onError: (e) => e.target.remove() });
    if (v.kind === 'video' && v.source_url) return h('div', { class: 'card-media placeholder video' }, svg('M5 4l14 8-14 8z', { size: 36 }));
    if (v.kind === 'text') return h('div', { class: 'card-media placeholder text' }, h('p', null, (v.note || v.title || '').slice(0, 280)));
    return h('div', { class: 'card-media placeholder' }, svg(ICON.link, { size: 30 }));
  }

  // ---- drag ----
  function attachDrag(el) {
    let start = null; let dx = 0; let dy = 0; let pid = null;
    const threshold = () => Math.min(120, Math.max(70, stack.clientWidth * 0.28));
    const onDown = (e) => {
      if (busy || e.button > 0) return;
      pid = e.pointerId; start = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(pid); el.classList.add('dragging');
    };
    const onMove = (e) => {
      if (!start || e.pointerId !== pid) return;
      dx = e.clientX - start.x; dy = e.clientY - start.y;
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.06}deg)`;
      showStamp(directionOf(dx, dy, threshold()), Math.min(1, Math.max(Math.abs(dx), -dy) / threshold()));
    };
    const onUp = (e) => {
      if (!start || e.pointerId !== pid) return;
      el.classList.remove('dragging');
      const dir = directionOf(dx, dy, threshold());
      start = null; pid = null;
      if (dir) { flyOut(el, dir); judgeTop(SWIPE_VERDICT[dir], { animated: true }); }
      else { el.style.transform = ''; showStamp(null, 0); }
      dx = dy = 0;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', () => {
      start = null; pid = null; dx = dy = 0;
      el.classList.remove('dragging'); el.style.transform = ''; showStamp(null, 0);
    });
  }

  function directionOf(dx, dy, t) {
    if (dy < -t && Math.abs(dx) < t) return 'up';
    if (dx > t) return 'right';
    if (dx < -t) return 'left';
    return null;
  }

  function showStamp(dir, strength) {
    stamp.className = `stamp${dir ? ` show ${dir}` : ''}`;
    stamp.style.opacity = dir ? String(0.35 + strength * 0.65) : '0';
    stamp.textContent = dir ? VERDICT_LABEL[SWIPE_VERDICT[dir]] : '';
  }

  function flyOut(el, dir) {
    const w = stack.clientWidth || 320;
    const x = dir === 'right' ? w * 1.4 : dir === 'left' ? -w * 1.4 : 0;
    const y = dir === 'up' ? -(stack.clientHeight || 400) * 1.2 : 40;
    el.classList.add('fly');
    el.style.transform = `translate(${x}px, ${y}px) rotate(${dir === 'up' ? 0 : x * 0.05}deg)`;
  }

  // ---- judge ----
  async function judgeTop(verdict, { animated = false } = {}) {
    if (busy || queue.length === 0) return;
    busy = true;
    notes.disabled = true;
    const draft = readDraft();
    const card = queue[0];
    const top = stack.querySelector('.card.top');
    if (!animated && top) { flyOut(top, verdict === 'like' ? 'right' : verdict === 'no' ? 'left' : 'up'); showStamp(verdict === 'like' ? 'right' : verdict === 'no' ? 'left' : 'up', 1); }
    const prev = { verdict: card.verdict, reason: card.reason, basis: card.basis, basis_who: card.basis_who, guess_revealed_at: card.guess_revealed_at };
    try {
      const updated = await ctx.adapter.update(card.id, { verdict, reason: draft.reason.trim() || null, basis: draft.basis || null, basis_who: draft.basis === 'other' ? (draft.who.trim() || null) : null });
      const judged = { ...card, ...updated, verdict };
      undo = { card: judged, prev, draft };
      btnUndo.disabled = false;
      queue.shift();
      await new Promise((r) => setTimeout(r, animated ? 220 : 260));
      if (destroyed) return;
      showStamp(null, 0);
      render();
      ctx.emit('cards:changed', { id: card.id, source: 'deck' });
      showReveal(judged);
    } catch (e) {
      toast(e.message || '저장하지 못했어요');
      render();
    } finally {
      busy = false;
      notes.disabled = false;
    }
  }

  async function showReveal(card) {
    clearTimeout(revealTimer);
    const text = revealText(card); // 판정 뒤에만 문장이 나온다
    if (!text) { reveal.classList.remove('show'); reveal.textContent = ''; return; }
    const settings = await ctx.settings();
    reveal.textContent = text;
    reveal.classList.add('show');
    revealTimer = setTimeout(() => { reveal.classList.remove('show'); }, Math.max(0.5, settings.reveal_seconds) * 1000);
    if (!card.guess_revealed_at) {
      const at = new Date().toISOString();
      ctx.adapter.update(card.id, { guess_revealed_at: at }).catch(() => {});
    }
  }

  async function undoLast() {
    if (!undo || busy) return;
    busy = true;
    notes.disabled = true;
    const { card, prev, draft } = undo;
    try {
      await ctx.adapter.update(card.id, { verdict: null, reason: prev.reason ?? null, basis: prev.basis ?? null, basis_who: prev.basis_who ?? null });
      undo = null; btnUndo.disabled = true;
      clearTimeout(revealTimer); reveal.classList.remove('show'); reveal.textContent = '';
      drafts.set(card.id, draft);
      queue.unshift({ ...card, ...prev, verdict: null, verdict_by: null, verdict_at: null });
      render();
      ctx.emit('cards:changed', { id: card.id, source: 'deck' });
      toast('되돌렸어요');
    } catch (e) { toast(e.message || '되돌리지 못했어요'); }
    finally { busy = false; notes.disabled = false; }
  }

  function onKey(e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); judgeTop('like'); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); judgeTop('no'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); judgeTop('unknown'); }
    else if (e.key === 'u' || e.key === 'U') { e.preventDefault(); undoLast(); }
  }
  document.addEventListener('keydown', onKey);
  const offChanged = ctx.on('cards:changed', (ev) => { if (!ev.detail || ev.detail.source !== 'deck') { if (!busy) load(); } });

  load();
  return {
    reload: load,
    destroy() {
      destroyed = true;
      document.removeEventListener('keydown', onKey);
      offChanged();
      clearTimeout(revealTimer);
      wrap.remove();
    },
  };
}
