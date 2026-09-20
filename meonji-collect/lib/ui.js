// 작은 DOM 도우미. innerHTML 대신 노드로 만든다.
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && k !== 'list' && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

export function svg(pathD, { size = 18, stroke = 1.8, view = 24 } = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  const s = document.createElementNS(ns, 'svg');
  s.setAttribute('viewBox', `0 0 ${view} ${view}`);
  s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', stroke); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  for (const d of [].concat(pathD)) { const p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); s.append(p); }
  return s;
}

export const ICON = {
  deck: 'M4 7h12v13H4z M8 4h12v13',
  add: 'M12 5v14 M5 12h14',
  list: 'M4 6h16 M4 12h16 M4 18h10',
  criteria: 'M4 20 14 10 M13 4l7 7-4 4-7-7z M10 6l1-1',
  settings: 'M4 7h9 M17 7h3 M4 17h3 M11 17h9 M13 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M9 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  x: 'M6 6l12 12 M18 6 6 18',
  o: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z',
  q: 'M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7V15 M12 18.5v.1',
  undo: 'M9 14 4 9l5-5 M4 9h11a5 5 0 0 1 0 10h-3',
  back: 'M15 5l-7 7 7 7',
  trash: 'M5 7h14 M9 7V4h6v3 M7 7l1 13h8l1-13',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  file: 'M6 3h8l4 4v14H6z M14 3v4h4',
  folder: 'M3 6h6l2 2h10v11H3z',
  clip: 'M8 4h8v3H8z M6 6h12v14H6z',
  check: 'M5 12l4 4 10-10',
};

let toastTimer = null;
export function toast(msg, { ms = 1800 } = {}) {
  let el = document.getElementById('toast');
  if (!el) { el = h('div', { id: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

export function confirmDialog(msg) {
  return Promise.resolve(window.confirm(msg));
}

export function chip(label, { active = false, onClick, title } = {}) {
  return h('button', { type: 'button', class: `chip${active ? ' on' : ''}`, 'aria-pressed': active ? 'true' : 'false', onClick, title }, label);
}

export function field(label, control, hint) {
  return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control, hint ? h('span', { class: 'field-hint' }, hint) : null);
}

export function debounce(fn, ms = 150) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function readFileAsDataURL(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(file); });
}
