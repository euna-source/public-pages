// 설정: 연결(API 주소·토큰은 localStorage), 임계값, 공개 시간, 내보내기/들여오기, 전부 지우기.
import { h, toast, field, confirmDialog } from '../lib/ui.js';
import { exportFilename } from '../lib/model.js';

export function mountSettings(root, ctx) {
  const conn = ctx.connection();
  const apiBase = h('input', { type: 'url', class: 'input', value: conn.api_base || '', placeholder: 'https://… (비우면 로컬 모드)', autocomplete: 'off', autocapitalize: 'off', spellcheck: false });
  const token = h('input', { type: 'password', class: 'input', value: conn.token || '', placeholder: 'Bearer 토큰', autocomplete: 'off' });
  const threshold = h('input', { type: 'number', class: 'input', min: 0, max: 1, step: 0.05, inputmode: 'decimal' });
  const reveal = h('input', { type: 'number', class: 'input', min: 0, max: 30, step: 0.5, inputmode: 'decimal' });
  const modeLine = h('p', { class: 'mode-line' });
  const queueLine = h('p', { class: 'muted small' });
  const importInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });

  async function refresh() {
    const s = await ctx.settings(true);
    threshold.value = s.jev_threshold;
    reveal.value = s.reveal_seconds;
    modeLine.textContent = ctx.adapter.mode === 'remote' ? `원격 모드 · ${ctx.adapter.base}` : '로컬 모드 · 이 브라우저에만 저장돼요';
    if (ctx.adapter.mode === 'remote' && ctx.adapter.pendingCount) {
      const n = await ctx.adapter.pendingCount();
      queueLine.textContent = n ? `보내지 못한 변경 ${n}건 · 온라인이 되면 순서대로 보내요` : '';
    } else queueLine.textContent = '';
  }

  importInput.addEventListener('change', async () => {
    const f = importInput.files[0]; importInput.value = '';
    if (!f) return;
    try {
      const json = JSON.parse(await f.text());
      const r = await ctx.adapter.import(json);
      await ctx.settings(true);
      ctx.emit('cards:changed', {});
      toast(`${r.imported ?? 0}건 들여왔어요`);
    } catch (e) { toast(e.message || '읽지 못했어요'); }
  });

  const form = h('form', { class: 'settings-form', onSubmit: async (e) => {
    e.preventDefault();
    const base = apiBase.value.trim().replace(/\/+$/, '');
    const tok = token.value.trim();
    const changedConn = base !== (conn.api_base || '') || tok !== (conn.token || '');
    try {
      if (changedConn) {
        await ctx.setConnection({ api_base: base || null, token: tok || null });
        Object.assign(conn, { api_base: base || null, token: tok || null });
      }
      await ctx.adapter.putSettings({ jev_threshold: Number(threshold.value), reveal_seconds: Number(reveal.value), api_base: base || null });
      await ctx.settings(true);
      ctx.emit('cards:changed', {});
      toast('저장했어요');
      refresh();
    } catch (err) { toast(err.message || '저장하지 못했어요'); }
  } },
    h('h2', { class: 'sub' }, '연결'),
    modeLine, queueLine,
    field('API 주소', apiBase, '비우면 이 기기 안에서만 돌아가요.'),
    field('토큰', token),
    h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn', onClick: async () => {
      const base = apiBase.value.trim().replace(/\/+$/, '');
      if (!base) { toast('주소가 비어 있어요'); return; }
      try { const r = await fetch(`${base}/api/health`, { headers: { Authorization: `Bearer ${token.value.trim()}` } }); toast(r.ok ? '연결돼요' : `실패 ${r.status}`); } catch { toast('닿지 않아요'); }
    } }, '연결 확인')),
    h('h2', { class: 'sub' }, 'Jev'),
    field('자동 라벨 임계값', threshold, '이 확신 이상이면 Jev가 라벨을 붙이고 덱에서 빠져요.'),
    field('추측 공개 시간(초)', reveal, '넘긴 뒤 Jev 추측을 보여 주는 시간.'),
    h('button', { type: 'submit', class: 'btn primary' }, '저장'),
    h('h2', { class: 'sub' }, '데이터'),
    h('div', { class: 'row wrap' },
      h('button', { type: 'button', class: 'btn', onClick: async () => {
        try {
          const bundle = await ctx.adapter.export();
          const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
          const a = h('a', { href: URL.createObjectURL(blob), download: exportFilename() });
          document.body.append(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 2000);
          toast(`카드 ${bundle.cards.length}장 내보냈어요`);
        } catch (e) { toast(e.message || '내보내지 못했어요'); }
      } }, '내보내기'),
      h('button', { type: 'button', class: 'btn', onClick: () => importInput.click() }, '들여오기'),
      importInput),
    h('p', { class: 'hint' }, '내보낸 파일은 CLI의 guess --file 이 읽고, 다시 들여오면 추측이 붙어요. 파일 바이트는 들어가지 않아요.'),
    h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn danger ghost', onClick: async () => {
      if (!(await confirmDialog(ctx.adapter.mode === 'remote' ? '이 기기의 캐시와 보내지 못한 변경을 지울까요? 서버 데이터는 남아요.' : '이 브라우저의 카드·기준·설정을 전부 지울까요?'))) return;
      try { await ctx.adapter.clearAll(); ctx.emit('cards:changed', {}); toast('지웠어요'); refresh(); } catch (e) { toast(e.message || '지우지 못했어요'); }
    } }, '데이터 전부 지우기')),
    h('p', { class: 'muted small' }, `버전 ${ctx.version}`));

  const wrap = h('section', { class: 'view settings' }, h('h1', { class: 'view-title' }, '설정'), form);
  root.append(wrap);
  refresh();
  return { destroy() { wrap.remove(); } };
}
