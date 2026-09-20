// 기준 카드: 읽기·편집. exclude_rules는 사람만 쓰는 칸. 편집 저장 때 what/why를 이력에 붙인다.
import { h, clear, toast, field, confirmDialog } from '../lib/ui.js';
import { newCriteria, reviseCriteria, fmtDate } from '../lib/model.js';
import { ulid } from '../lib/ulid.js';

const STATUS_LABEL = { hypothesis: '가설', verified: '확인됨', agreed: '합의됨' };

export function mountCriteria(root, ctx) {
  let list = [];
  let editing = null; // criteria object or null
  const body = h('div', { class: 'criteria-body' });
  const wrap = h('section', { class: 'view criteria' },
    h('div', { class: 'list-head' }, h('h1', { class: 'view-title' }, '기준'), h('button', { type: 'button', class: 'btn', onClick: () => { editing = newCriteria({}, { id: ulid() }); editing._new = true; render(); } }, '새 기준')),
    body);
  root.append(wrap);

  async function load() {
    try { list = await ctx.adapter.listCriteria(); } catch (e) { toast(e.message || '불러오지 못했어요'); list = []; }
    render();
  }

  function render() {
    clear(body);
    if (editing) { body.append(editor(editing)); return; }
    if (!list.length) { body.append(h('p', { class: 'empty' }, '기준이 아직 없어요. 한 줄로 시작해요.')); return; }
    for (const c of list) body.append(criteriaCard(c));
  }

  function criteriaCard(c) {
    return h('article', { class: 'crit' },
      h('div', { class: 'crit-head' }, h('span', { class: `badge status-${c.status}` }, STATUS_LABEL[c.status] || c.status), h('span', { class: 'muted small' }, `v${c.version} · ${fmtDate(c.updated_at)}`)),
      h('p', { class: 'crit-axis' }, c.axis || '(축 없음)'),
      exampleList('좋은 예', c.good_examples), exampleList('나쁜 예', c.bad_examples),
      c.tie_break ? h('p', { class: 'small' }, h('b', null, '갈릴 때: '), c.tie_break) : null,
      c.exclude_rules && c.exclude_rules.length ? h('p', { class: 'small' }, h('b', null, '무조건 제외: '), c.exclude_rules.join(' / ')) : null,
      c.history && c.history.length ? h('details', { class: 'small' }, h('summary', null, `이력 ${c.history.length}`), h('ul', null, c.history.slice().reverse().map((hh) => h('li', null, `${fmtDate(hh.at)} · ${hh.what}${hh.why ? ` — ${hh.why}` : ''}`)))) : null,
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onClick: () => { editing = c; render(); } }, '편집')));
  }

  function exampleList(label, arr) {
    if (!arr || !arr.length) return null;
    return h('div', { class: 'small' }, h('b', null, `${label}: `), arr.map((e) => e.text).filter(Boolean).join(' / '));
  }

  function editor(c) {
    const axis = h('input', { type: 'text', class: 'input', value: c.axis || '', placeholder: '행동 문장 한 줄. 예: 장식이 적고 색이 둘 이하인 것', maxlength: 200 });
    const good = h('textarea', { class: 'input', rows: 3, placeholder: '한 줄에 하나' }, (c.good_examples || []).map((e) => e.text).join('\n'));
    const bad = h('textarea', { class: 'input', rows: 3, placeholder: '한 줄에 하나' }, (c.bad_examples || []).map((e) => e.text).join('\n'));
    const tie = h('input', { type: 'text', class: 'input', value: c.tie_break || '', placeholder: '갈릴 때 어느 쪽?' });
    const excl = h('textarea', { class: 'input', rows: 2, placeholder: '한 줄에 하나. 사람만 쓰는 칸이에요.' }, (c.exclude_rules || []).join('\n'));
    const status = h('select', { class: 'input' }, ...Object.entries(STATUS_LABEL).map(([v, l]) => h('option', { value: v, selected: c.status === v }, l)));
    const what = h('input', { type: 'text', class: 'input', placeholder: c._new ? '처음 씀' : '무엇을 바꿨나', maxlength: 200 });
    const why = h('input', { type: 'text', class: 'input', placeholder: '왜', maxlength: 200 });
    const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
    const keepIds = (prev, texts) => texts.map((t) => { const found = (prev || []).find((e) => e.text === t); return { card_id: found ? found.card_id : null, text: t }; });

    const form = h('form', { class: 'crit-form', onSubmit: async (e) => {
      e.preventDefault();
      if (!axis.value.trim()) { toast('축 한 줄은 있어야 해요'); axis.focus(); return; }
      const changes = { axis: axis.value.trim(), good_examples: keepIds(c.good_examples, lines(good.value)), bad_examples: keepIds(c.bad_examples, lines(bad.value)), tie_break: tie.value.trim() || null, exclude_rules: lines(excl.value), status: status.value };
      let next;
      if (c._new) { next = { ...c, ...changes, version: 1, history: [{ at: new Date().toISOString(), what: what.value.trim() || '처음 씀', why: why.value.trim(), evidence_ids: [] }], updated_at: new Date().toISOString() }; delete next._new; }
      else next = reviseCriteria(c, changes, { what: what.value.trim() || '편집', why: why.value.trim() });
      const others = list.filter((x) => x.id !== c.id);
      try { list = await ctx.adapter.putCriteria([next, ...others]); editing = null; toast('저장했어요'); render(); }
      catch (err) { toast(err.message || '저장하지 못했어요'); }
    } },
      field('축', axis), field('좋은 예', good), field('나쁜 예', bad), field('갈릴 때', tie),
      field('무조건 제외', excl, 'Jev나 CLI는 이 칸을 건드리지 않아요.'),
      field('상태', status),
      h('fieldset', { class: 'hist-ask' }, h('legend', null, '이력에 남길 말'), field('무엇을', what), field('왜', why)),
      h('div', { class: 'detail-actions' },
        c._new ? null : h('button', { type: 'button', class: 'btn danger ghost', onClick: async () => { if (await confirmDialog('이 기준을 지울까요?')) { list = await ctx.adapter.putCriteria(list.filter((x) => x.id !== c.id)); editing = null; render(); } } }, '지우기'),
        h('button', { type: 'button', class: 'btn ghost', onClick: () => { editing = null; render(); } }, '취소'),
        h('button', { type: 'submit', class: 'btn primary' }, '저장')));
    return form;
  }

  load();
  return { destroy() { wrap.remove(); } };
}
