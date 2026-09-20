// 담기: 링크 하나·파일 하나면 저장된다. 나머지는 전부 선택.
import { h, clear, svg, ICON, toast, chip, field } from '../lib/ui.js';
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

  function collectList() {
    const src = url.value.trim();
    if (!isUrl(src)) { toast('열린 목록 페이지 주소를 먼저 넣어 주세요'); url.focus(); return; }
    const launch = new URL('susuwatari://collect'); launch.searchParams.set('url', src);
    location.href = launch.href;
    toast('먼지가 이 페이지 안의 상품을 담아요');
  }

  async function save(e) {
    e && e.preventDefault();
    if (saving) return;
    const src = url.value.trim();
    const hasText = title.value.trim() || note.value.trim();
    if (!src && !hasText && files.length === 0) { toast('링크나 파일, 글 하나는 있어야 해요'); return; }
    if (src && !isUrl(src)) { toast('링크 형식이 아니에요'); url.focus(); return; }
    if (src && /^https:\/\/(www\.)?29cm\.co\.kr\/order\/my-order\/list(?:[?#]|$)/.test(src)) { collectList(); return; }
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
    h('button', { type: 'button', class: 'btn', onClick: collectList }, '이 목록의 상품 모두 담기'),
    h('p', { class: 'hint' }, 'Mac의 먼지와 Aside를 사용해 열린 페이지 안에서만 담아요.'),
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
  const wrap = h('section', { class: 'view add' }, h('h1', { class: 'view-title' }, '담기'), form);
  root.append(wrap);
  renderKinds();
  if (params.auto === '1' && (params.url || params.text)) save();
  else if (!params.url) setTimeout(() => url.focus(), 50);

  return { destroy() { document.removeEventListener('paste', onPaste); wrap.remove(); } };
}

function fmtBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)}KB`;
  return `${(n / 1024 / 1024).toFixed(1)}MB`;
}
