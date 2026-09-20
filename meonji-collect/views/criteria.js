import { h, clear, toast, field } from '../lib/ui.js';
import { newCriteria, reviseCriteria } from '../lib/model.js';
import { tasteProfile, PREFERENCE_ID } from '../lib/taste-profile.js';

const DRAFTS = new WeakMap();

export function mountCriteria(root, ctx) {
  let list = [], destroyed = false, saving = false, dirty = DRAFTS.has(ctx), refreshVersion = 0;
  const input = h('textarea', { class: 'input preference-input', rows: 4, maxlength: 300,
    placeholder: '어떤 것이 좋고, 어떤 것이 마음에 걸리는지 자유롭게 적어 주세요.' });
  input.value = DRAFTS.get(ctx) || '';
  input.addEventListener('input', () => { dirty = true; DRAFTS.set(ctx, input.value); });
  const save = h('button', { type: 'submit', class: 'btn primary' }, '기준 저장');
  const feedback = h('p', { class: 'hint', role: 'status' });
  const result = h('div', { class: 'taste-result' });
  const legacy = h('details', { class: 'legacy-criteria', hidden: true });
  const form = h('form', { class: 'preference-form', onSubmit: async e => {
    e.preventDefault(); if (saving) return;
    const text = input.value.trim();
    if (!text) { feedback.textContent = '기준을 한 줄 적어 주세요. 판정은 기준 없이도 할 수 있어요.'; return; }
    saving = true; save.disabled = true; input.disabled = true;
    try {
      // 다른 화면·탭에서 추가한 기존 기준과 사람의 제외 규칙을 보존한다.
      const latest = await ctx.adapter.listCriteria();
      const prev = latest.find(c => c.id === PREFERENCE_ID);
      const next = prev ? reviseCriteria(prev, { axis: text }, { what: '내 기준 수정' })
        : newCriteria({ axis: text, history: [{ at: new Date().toISOString(), what: '내 기준 작성', why: '', evidence_ids: [] }] }, { id: PREFERENCE_ID });
      list = await ctx.adapter.putCriteria([next, ...latest.filter(c => c.id !== PREFERENCE_ID)]);
      dirty = false; DRAFTS.delete(ctx); feedback.textContent = '저장했어요. 앞으로의 판정에 참고할게요.';
      ctx.emit('cards:changed', { source: 'criteria' });
      await refresh();
    } catch (err) { feedback.textContent = err.message || '저장하지 못했어요. 적은 내용은 남아 있어요.'; }
    finally { saving = false; save.disabled = false; input.disabled = false; }
  } }, field('내 기준', input), h('p', { class: 'hint' }, '정리된 항목을 채울 필요 없이, 내 말로 한 번에 적어요.'), save, feedback);
  const wrap = h('section', { class: 'view criteria' }, h('h1', { class: 'view-title' }, '기준'), form, result, legacy);
  root.append(wrap);

  async function refresh() {
    const version = ++refreshVersion;
    try {
      const [criteria, cards] = await Promise.all([ctx.adapter.listCriteria(), ctx.adapter.list({ limit: 100000 })]);
      if (destroyed || version !== refreshVersion) return;
      list = criteria;
      if (!dirty && !saving) input.value = list.find(c => c.id === PREFERENCE_ID)?.axis || '';
      renderProfile(tasteProfile(cards));
      const old = list.filter(c => c.id !== PREFERENCE_ID);
      clear(legacy); legacy.hidden = !old.length;
      if (old.length) legacy.append(h('summary', null, `이전에 적은 기준 ${old.length}개`), h('p', { class: 'hint' }, '기존 기준과 직접 적은 제외 규칙은 보존되어 함께 사용돼요.'),
        ...old.map(c => h('div', { class: 'legacy-criterion' }, h('p', null, c.axis), c.exclude_rules?.length ? h('p', { class: 'small' }, `무조건 제외: ${c.exclude_rules.join(' / ')}`) : null)));
    } catch (err) { if (!destroyed) toast(err.message || '불러오지 못했어요'); }
  }
  function renderProfile(profile) {
    clear(result);
    const ready = profile.axes.filter(a => a.score !== null);
    const strongest = ready.filter(a => a.score >= 67).sort((a,b) => b.score - a.score);
    const summary = strongest.length ? `지금까지 고른 카드에서는 ${strongest.slice(0,2).map(a=>a.label).join('·')} 단서가 있는 것에 O를 더 주었어요.`
      : profile.judged ? '판정은 쌓이고 있어요. 아직 뚜렷한 선호 방향을 말하기에는 근거가 부족해요.' : '카드에 O/X를 남기면 나의 취향 분포가 나타나요.';
    result.append(h('h2', null, '나의 감각지수'), h('p', { class: 'taste-summary' }, summary),
      h('p', { class: 'hint' }, `내가 판정한 카드 ${profile.judged}개 · 축과 연결된 카드 ${profile.matched}개`), radar(profile.axes),
      h('p', { class: 'hint' }, '각 축의 값은 관련 카드에 준 O 비율이에요. 축마다 3개 이상 판정해야 값을 표시해요. 미평가는 0점이 아니에요.'),
      h('div', { class: 'taste-axes' }, profile.axes.map(a => h('details', { class: 'taste-axis' },
        h('summary', null, h('span', null, a.label), h('strong', null, a.score === null ? '미평가' : `${a.score}%`), h('span', { class: 'hint' }, `O ${a.likes} · X ${a.no}`)),
        a.evidence.length ? h('ul', null, a.evidence.map(c => h('li', null, h('span', { class: 'taste-verdict' }, c.verdict === 'like' ? 'O' : 'X'), ' ', c.title, h('span', { class: 'hint' }, ` · 단서: ${c.terms.join(', ')}`), c.reason ? h('p', { class: 'small' }, `내 이유: ${c.reason}`) : null))) : h('p', { class: 'hint' }, '이 축과 연결할 판정이 아직 없어요.')))),
      h('details', { class: 'taste-method' }, h('summary', null, '어떻게 읽으면 되나요?'), h('p', { class: 'small' }, '상품명·본문·꼬리표의 텍스트 단서로 분류한 초기 관찰이에요. 한 카드는 여러 축에 포함될 수 있어요. 자동 판정, 모름, 기준 입력문은 점수에 넣지 않아요. 이미지 분석이나 성격·감각 능력의 등급은 아니며, 각 축을 펼치면 연결 근거를 확인할 수 있어요.'), h('p', { class: 'hint' }, `아직 축에 연결하지 못한 판정 ${profile.unmatched}개`)));
  }
  const off = ctx.on('cards:changed', () => { if (!saving) refresh(); });
  refresh();
  return { destroy() { destroyed = true; off(); wrap.remove(); } };
}

function radar(axes) {
  const ns = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs, text) => { const n = document.createElementNS(ns, tag); for (const [k,v] of Object.entries(attrs)) n.setAttribute(k, String(v)); if (text) n.textContent = text; return n; };
  const chart = node('svg', { viewBox: '0 0 360 300', class: 'taste-radar', role: 'img', 'aria-label': '여섯 축의 취향 분포. 미평가는 점 없이 표시하며, 수치와 근거는 아래 축별 항목에서 확인할 수 있습니다.' });
  const point = (i,r) => { const angle = -Math.PI/2 + i * Math.PI/3; return [180+Math.cos(angle)*r,150+Math.sin(angle)*r]; };
  for (const r of [25,50,75,100]) chart.append(node('polygon', { points: axes.map((_,i)=>point(i,r).join(',')).join(' '), class: 'radar-grid' }));
  axes.forEach((a,i) => { const [x,y]=point(i,100); chart.append(node('line',{x1:180,y1:150,x2:x,y2:y,class:'radar-grid'})); const [tx,ty]=point(i,126); chart.append(node('text',{x:tx,y:ty,'text-anchor':'middle','dominant-baseline':'middle',class:'radar-label'},a.label)); });
  // 미평가를 0으로 잇지 않는다. 모든 축이 평가됐을 때만 다각형을 닫는다.
  if (axes.every(a=>a.score!==null)) chart.append(node('polygon',{points:axes.map((a,i)=>point(i,a.score).join(',')).join(' '),class:'radar-value'}));
  axes.forEach((a,i)=>{if(a.score!==null){const [cx,cy]=point(i,a.score);chart.append(node('circle',{cx,cy,r:4,class:'radar-dot'}));}});
  return chart;
}
