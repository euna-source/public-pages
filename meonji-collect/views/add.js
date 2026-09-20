// 담기: 링크 하나·파일 하나면 저장된다. 나머지는 전부 선택.
import { h, clear, svg, ICON, toast, chip, field } from '../lib/ui.js';
import { pendingCaptures, queueCapture, supportsNativeCapture } from '../lib/capture-requests.js';
import { inferKind, isUrl, KINDS, KIND_LABEL, normalizeTags } from '../lib/model.js';

export function mountAdd(root, ctx, params = {}) {
  let kind = null;            // null이면 자동
  let files = [];
  let saving = false;

  const url = h('input', { type: 'url', class: 'input', placeholder: '링크를 붙여넣기', inputmode: 'url', autocomplete: 'off', autocapitalize: 'off', spellcheck: false, value: params.url || '' });
  const title = h('input', { type: 'text', class: 'input', placeholder: '제목 (선택)', maxlength: 200, value: params.title || '' });
  const note = h('textarea', { class: 'input', rows: 2, placeholder: '메모나 종목 코드, 글 (선택)', maxlength: 2000 }, params.text || '');
  const tags = h('input', { type: 'text', class: 'input', placeholder: '꼬리표, 쉼표로 (선택)', autocomplete: 'off' });
  const fileInput = h('input', { type: 'file', multiple: true, hidden: true, accept: 'image/*,video/*,.pdf' });
  const folderInput = h('input', { type: 'file', multiple: true, hidden: true });
  folderInput.setAttribute('webkitdirectory', '');
  folderInput.setAttribute('directory', '');
  const fileList = h('div', { class: 'file-list' });
  const kindRow = h('div', { class: 'chips' });
  const saveBtn = h('button', { type: 'submit', class: 'btn primary wide' }, '담기');

  function currentKind() {
    if (kind) return kind;
    const src = url.value.trim() || note.value.trim();
    if (!src && files.length) return files.every((f) => f.type.startsWith('image/')) ? 'image' : files.some((f) => f.type.startsWith('video/')) ? 'video' : 'other';
    return inferKind(src);
  }

  function renderKinds() {
    clear(kindRow);
    const cur = currentKind();
    kindRow.append(chip('자동', { active: kind === null, onClick: () => { kind = null; renderKinds(); } }));
    for (const k of KINDS) kindRow.append(chip(KIND_LABEL[k], { active: kind ? kind === k : false, title: kind === null && cur === k ? '자동 추정' : null, onClick: () => { kind = k; renderKinds(); } }));
    if (kind === null) { const auto = [...kindRow.children].find((c) => c.textContent === KIND_LABEL[cur]); if (auto) auto.classList.add('guessed'); }
  }

  function renderFiles() {
    clear(fileList);
    files.forEach((f, i) => {
      const row = h('div', { class: 'file-row' },
        f.type.startsWith('image/') ? h('img', { class: 'thumb', alt: '', src: URL.createObjectURL(f) }) : svg(ICON.file, { size: 18 }),
        h('span', { class: 'file-name' }, f.name || '붙여넣은 이미지'),
        h('span', { class: 'file-size' }, fmtBytes(f.size)),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': '빼기', onClick: () => { files.splice(i, 1); renderFiles(); renderKinds(); } }, svg(ICON.x, { size: 14 })));
      fileList.append(row);
    });
    if (files.length > 6) fileList.append(h('p', { class: 'hint' }, `${files.length}개 · 카드 하나에 함께 담겨요`));
  }

  function takeFiles(list) {
    for (const f of list) if (f && f.size >= 0) files.push(f);
    renderFiles(); renderKinds();
  }

  fileInput.addEventListener('change', () => { takeFiles([...fileInput.files]); fileInput.value = ''; });
  folderInput.addEventListener('change', () => {
    const picked = [...folderInput.files].filter((f) => !f.name.startsWith('.'));
    takeFiles(picked); folderInput.value = '';
    if (picked.length) toast(`${picked.length}개 골랐어요`);
  });
  url.addEventListener('input', renderKinds);
  note.addEventListener('input', renderKinds);
  url.addEventListener('paste', () => setTimeout(renderKinds, 0));

  function onPaste(e) {
    const items = e.clipboardData && e.clipboardData.items ? [...e.clipboardData.items] : [];
    const imgs = items.filter((it) => it.kind === 'file' && it.type.startsWith('image/')).map((it) => it.getAsFile()).filter(Boolean);
    if (imgs.length) {
      e.preventDefault();
      takeFiles(imgs.map((f, i) => new File([f], f.name || `clipboard-${Date.now()}-${i + 1}.${(f.type.split('/')[1] || 'png').replace('jpeg', 'jpg')}`, { type: f.type })));
      toast('클립보드 이미지를 담았어요');
      return;
    }
    if (e.target === url || e.target === title || e.target === note || e.target === tags) return;
    const text = e.clipboardData ? e.clipboardData.getData('text') : '';
    if (text && isUrl(text) && !url.value) { url.value = text.trim(); renderKinds(); e.preventDefault(); }
  }
  document.addEventListener('paste', onPaste);

  const pending = h('div', { class: 'capture-pending' });
  function renderPending() {
    clear(pending);
    try {
      const requests = pendingCaptures();
      if (!requests.length) return;
      pending.append(h('h2', null, `내용 읽기 대기 ${requests.length}개`), h('p', { class: 'hint' }, '아직 카드가 아니에요. 실제 내용을 읽은 뒤 덱에 들어가요. 이 브라우저에 보관되며 다른 기기로 자동 동기화되지 않아요.'),
        ...requests.map(r => h('div', { class: 'pending-request' },
          h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer' }, r.title || new URL(r.url).hostname),
          supportsNativeCapture() ? h('button', { type: 'button', class: 'btn', onClick: () => collectList(r) }, '내용 읽기') : h('span', { class: 'hint' }, 'Mac의 먼지·Aside에서 읽을 수 있어요'))));
    } catch (e) { pending.append(h('p', { class: 'hint' }, e.message)); }
  }
  function collectList(request = null, launch = true) {
    const r = request?.url ? request : { url: url.value.trim(), title: title.value.trim(), text: note.value.trim(), tags: normalizeTags(tags.value) };
    if (!isUrl(r.url)) { toast('담을 페이지 주소를 먼저 넣어 주세요'); url.focus(); return; }
    try { queueCapture(r); renderPending(); }
    catch (e) { toast(e.message || '대기 목록에 보관하지 못했어요'); return; }
    if (!launch || !supportsNativeCapture() || !ctx.capturePage) { toast('내용 읽기 대기 목록에 보관했어요'); return; }
    ctx.capturePage(r.url);
    toast('먼지가 페이지의 상품과 내용을 읽고 있어요');
  }

  async function save(e) {
    e && e.preventDefault();
    if (saving) return;
    const src = url.value.trim();
    const hasText = title.value.trim() || note.value.trim();
    if (!src && !hasText && files.length === 0) { toast('링크나 파일, 글 하나는 있어야 해요'); return; }
    if (src && !isUrl(src)) { toast('링크 형식이 아니에요'); url.focus(); return; }
    if (src && files.length === 0) { collectList(); return; }
    saving = true; saveBtn.disabled = true;
    const k = currentKind();
    const partial = {
      kind: k,
      entry: params.url ? 'share' : k === 'stock' ? 'ticker' : files.length ? (files.length > 1 ? 'folder' : 'capture') : 'web',
      source_url: src || null,
      title: title.value.trim() || null,
      note: note.value.trim() || null,
      tags: normalizeTags(tags.value),
    };
    try {
      await ctx.adapter.add(partial, files);
      ctx.emit('cards:changed', {});
      toast('담김');
      url.value = ''; title.value = ''; note.value = ''; tags.value = ''; files = []; kind = null;
      renderFiles(); renderKinds();
      if (params.url) { history.replaceState(null, '', '#/add'); params = {}; }
      url.focus();
    } catch (err) {
      toast(err.message || '담지 못했어요');
    } finally { saving = false; saveBtn.disabled = false; }
  }

  const form = h('form', { class: 'add-form', onSubmit: save },
    field('링크', url),
    h('button', { type: 'button', class: 'btn', onClick: collectList }, '이 페이지 내용 담기'),
    h('p', { class: 'hint' }, 'URL은 출처로 남기고 실제 상품·이미지·본문을 담아요. Mac의 먼지와 Aside가 필요해요.'),
    h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn', onClick: () => fileInput.click() }, svg(ICON.file, { size: 16 }), ' 파일'),
      h('button', { type: 'button', class: 'btn', onClick: () => folderInput.click() }, svg(ICON.folder, { size: 16 }), ' 폴더'),
      h('span', { class: 'hint' }, '⌘V로 이미지 붙여넣기')),
    fileList,
    field('유형', kindRow),
    h('details', { class: 'more', open: !!(params.title || params.text) },
      h('summary', null, '제목·메모·꼬리표'),
      field('제목', title), field('메모', note), field('꼬리표', tags)),
    saveBtn,
    fileInput, folderInput);
  const wrap = h('section', { class: 'view add' }, h('h1', { class: 'view-title' }, '담기'), form, pending);
  root.append(wrap);
  renderKinds();
  if (params.auto === '1' && params.url) collectList(null, false);
  else if (params.auto === '1' && params.text) save();
  else if (!params.url) setTimeout(() => url.focus(), 50);

  renderPending();
  window.addEventListener('storage', renderPending);
  return { destroy() { document.removeEventListener('paste', onPaste); window.removeEventListener('storage', renderPending); wrap.remove(); } };
}

function fmtBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)}KB`;
  return `${(n / 1024 / 1024).toFixed(1)}MB`;
}
