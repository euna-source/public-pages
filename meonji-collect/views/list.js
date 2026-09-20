// 목록: 칩 필터·검색·상세. Jev 표시는 사용자 판정이 있는 카드에서만(visibleGuess).
import { h, clear, svg, ICON, toast, chip, field, debounce, confirmDialog } from '../lib/ui.js';
import { KINDS, ENTRIES, KIND_LABEL, ENTRY_LABEL, VERDICT_LABEL, VERDICT_WORD, visibleGuess, isUrl, hostOf, fmtDate, normalizeTags } from '../lib/model.js';

export function mountList(root, ctx, { embedded = false } = {}) {
  const filter = { verdict: 'all', kind: '', entry: '', tag: '', q: '' };
  let cards = [];
  let openId = null;

  const search = h('input', { type: 'search', class: 'input', placeholder: '검색', autocomplete: 'off' });
  search.addEventListener('input', debounce(() => { filter.q = search.value.trim(); load(); }, 200));
  const chipsV = h('div', { class: 'chips' });
  const chipsK = h('div', { class: 'chips' });
  const chipsE = h('div', { class: 'chips' });
  const chipsT = h('div', { class: 'chips tags-chips' });
  const listEl = h('div', { class: 'card-list', role: 'list' });
  const detail = h('div', { class: 'detail', hidden: true });
  const wrap = h('section', { class: `view list${embedded ? ' embedded' : ''}` },
    h('div', { class: 'list-head' }, h('h1', { class: 'view-title' }, '목록'), search),
    h('div', { class: 'filters' }, chipsV, chipsK, chipsE, chipsT),
    listEl, detail);
  root.append(wrap);

  function renderChips() {
    clear(chipsV);
    for (const [v, label] of [['all', '전체'], ['null', '미판정'], ['like', 'O'], ['no', 'X'], ['unknown', '모름']]) chipsV.append(chip(label, { active: filter.verdict === v, onClick: () => { filter.verdict = v; load(); } }));
    clear(chipsK);
    for (const k of KINDS) chipsK.append(chip(KIND_LABEL[k], { active: filter.kind === k, onClick: () => { filter.kind = filter.kind === k ? '' : k; load(); } }));
    clear(chipsE);
    for (const e of ENTRIES) chipsE.append(chip(ENTRY_LABEL[e], { active: filter.entry === e, onClick: () => { filter.entry = filter.entry === e ? '' : e; load(); } }));
  }

  function renderTagChips(all) {
    clear(chipsT);
    const counts = new Map();
    for (const c of all) for (const t of c.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    for (const [t] of top) chipsT.append(chip(`#${t}`, { active: filter.tag === t, onClick: () => { filter.tag = filter.tag === t ? '' : t; load(); } }));
    chipsT.hidden = top.length === 0;
  }

  async function load() {
    renderChips();
    try {
      const q = { limit: 200 };
      if (filter.verdict !== 'all') q.verdict = filter.verdict;
      if (filter.kind) q.kind = filter.kind;
      if (filter.entry) q.entry = filter.entry;
      if (filter.tag) q.tag = filter.tag;
      if (filter.q) q.q = filter.q;
      cards = await ctx.adapter.list(q);
      if (!filter.tag) renderTagChips(cards);
    } catch (e) { toast(e.message || '불러오지 못했어요'); cards = []; }
    renderList();
    if (openId) { const c = cards.find((x) => x.id === openId); if (c) renderDetail(c); }
  }

  function renderList() {
    clear(listEl);
    if (!cards.length) { listEl.append(h('p', { class: 'empty' }, '여기엔 아직 없어요.')); return; }
    for (const c of cards) listEl.append(rowEl(c));
  }

  function rowEl(c) {
    const g = visibleGuess(c);
    const row = h('button', { type: 'button', class: `row-card${c.id === openId ? ' open' : ''}`, role: 'listitem', onClick: () => { openId = c.id; renderDetail(c); [...listEl.children].forEach((r) => r.classList.toggle('open', r === row)); } },
      h('span', { class: `mark ${c.verdict || 'none'}` }, c.verdict ? VERDICT_LABEL[c.verdict] : '·'),
      thumb(c),
      h('span', { class: 'row-main' },
        h('span', { class: 'row-title' }, c.title || c.note || c.source_url || '제목 없음'),
        h('span', { class: 'row-sub' }, KIND_LABEL[c.kind] || c.kind, ' · ', hostOf(c.source_url) || ENTRY_LABEL[c.entry] || '', ' · ', fmtDate(c.created_at))),
      c.verdict_by === 'jev' ? h('span', { class: 'badge jev', title: 'Jev가 자동으로 붙인 라벨' }, 'Jev') : g ? h('span', { class: `badge guess ${g.verdict === c.verdict ? 'same' : 'diff'}`, title: `Jev 추측 ${VERDICT_LABEL[g.verdict]} · 확신 ${Number(g.confidence).toFixed(2)}` }, g.verdict === c.verdict ? '=' : '≠') : null);
    return row;
  }

  function thumb(c) {
    const f = (c.files || []).find((x) => x.mime && x.mime.startsWith('image/'));
    if (f) { const img = h('img', { class: 'row-thumb', alt: '' }); ctx.adapter.fileUrl(f.key).then((u) => { if (u) img.src = u; }); return img; }
    if (c.kind === 'image' && c.source_url) return h('img', { class: 'row-thumb', alt: '', src: c.source_url, referrerpolicy: 'no-referrer', onError: (e) => { e.target.replaceWith(h('span', { class: 'row-thumb blank' })); } });
    return h('span', { class: `row-thumb blank k-${c.kind}` }, c.kind === 'stock' ? '₩' : '');
  }

  function renderDetail(c) {
    clear(detail);
    detail.hidden = false;
    const g = visibleGuess(c);
    const title = h('input', { type: 'text', class: 'input', value: c.title || '', placeholder: '제목' });
    const note = h('textarea', { class: 'input', rows: 2, placeholder: '메모' }, c.note || '');
    const reason = h('input', { type: 'text', class: 'input', value: c.reason || '', placeholder: '이유 한 줄' });
    const tags = h('input', { type: 'text', class: 'input', value: (c.tags || []).join(', '), placeholder: '꼬리표, 쉼표로' });
    const basis = h('select', { class: 'input' }, h('option', { value: '' }, '근거 없음'), h('option', { value: 'self', selected: c.basis === 'self' }, '직접 보고'), h('option', { value: 'other', selected: c.basis === 'other' }, '누가 좋다고 해서'));
    const who = h('input', { type: 'text', class: 'input', value: c.basis_who || '', placeholder: '누구', hidden: c.basis !== 'other' });
    basis.addEventListener('change', () => { who.hidden = basis.value !== 'other'; });

    const verdictRow = h('div', { class: 'verdict-row' },
      ...['no', 'unknown', 'like'].map((v) => h('button', { type: 'button', class: `judge small judge-${v}${c.verdict === v ? ' on' : ''}`, 'aria-pressed': c.verdict === v ? 'true' : 'false', onClick: () => patch({ verdict: v }, c.verdict_by === 'jev' ? '뒤집었어요' : '바꿨어요') }, VERDICT_LABEL[v])),
      c.verdict ? h('button', { type: 'button', class: 'btn ghost', onClick: () => patch({ verdict: null }, '판정을 지웠어요') }, '판정 지우기') : null);

    const filesEl = h('div', { class: 'detail-files' });
    for (const f of c.files || []) {
      const a = h('a', { class: 'file-link', target: '_blank', rel: 'noopener' }, f.mime && f.mime.startsWith('image/') ? h('img', { alt: '', class: 'detail-thumb' }) : h('span', null, f.key.split('/').pop()));
      ctx.adapter.fileUrl(f.key).then((u) => { if (u) { a.href = u; const img = a.querySelector('img'); if (img) img.src = u; } });
      filesEl.append(a);
    }

    async function patch(p, msg) {
      try {
        if (p.verdict != null && c.guess && !c.guess_revealed_at) p.guess_revealed_at = new Date().toISOString();
        const next = await ctx.adapter.update(c.id, p);
        Object.assign(c, next);
        ctx.emit('cards:changed', { id: c.id });
        if (msg) toast(msg);
        load();
      } catch (e) { toast(e.message || '저장하지 못했어요'); }
    }

    const form = h('form', { class: 'detail-form', onSubmit: (e) => { e.preventDefault(); patch({ title: title.value.trim() || null, note: note.value.trim() || null, reason: reason.value.trim() || null, tags: normalizeTags(tags.value), basis: basis.value || null, basis_who: basis.value === 'other' ? (who.value.trim() || null) : null }, '저장했어요'); } },
      h('div', { class: 'detail-head' },
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': '닫기', onClick: () => { detail.hidden = true; openId = null; renderList(); } }, svg(ICON.back, { size: 18 })),
        h('span', { class: 'detail-kind' }, KIND_LABEL[c.kind] || c.kind, ' · ', ENTRY_LABEL[c.entry] || c.entry, ' · ', fmtDate(c.created_at)),
        c.verdict_by === 'jev' ? h('span', { class: 'badge jev' }, 'Jev') : null),
      isUrl(c.source_url) ? h('a', { class: 'source', href: c.source_url, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.link, { size: 14 }), ' ', c.source_url) : null,
      filesEl,
      verdictRow,
      g ? h('p', { class: 'guess-line' }, `Jev 추측 ${VERDICT_LABEL[g.verdict]} · 확신 ${Number(g.confidence).toFixed(2)}${g.reason ? ` · ${g.reason}` : ''}`) : c.verdict_by === 'user' ? h('p', { class: 'guess-line muted' }, 'Jev 추측 없음') : null,
      c.verdict_at ? h('p', { class: 'muted small' }, `${c.verdict_by === 'jev' ? 'Jev' : '내'} 판정 ${fmtDate(c.verdict_at)}`) : null,
      field('제목', title), field('메모', note), field('이유', reason), field('근거', h('div', { class: 'row' }, basis, who)), field('꼬리표', tags),
      h('div', { class: 'detail-actions' },
        h('button', { type: 'button', class: 'btn danger ghost', onClick: async () => { if (await confirmDialog('이 카드를 지울까요?')) { await ctx.adapter.remove(c.id); detail.hidden = true; openId = null; ctx.emit('cards:changed', { id: c.id }); toast('지웠어요'); load(); } } }, svg(ICON.trash, { size: 16 }), ' 지우기'),
        h('button', { type: 'submit', class: 'btn primary' }, '저장')));
    detail.append(form);
    if (!embedded) detail.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  const off = ctx.on('cards:changed', () => load());
  load();
  return { reload: load, destroy() { off(); wrap.remove(); } };
}
