// 앱 셸: 어댑터 고르기, 해시 라우팅, 두 열 레이아웃, 위젯 모드, 서비스 워커.
import { h, clear, svg, ICON, toast } from './lib/ui.js';
import { parseHash, normalizeSettings, DEFAULT_SETTINGS } from './lib/model.js';
import { LocalAdapter } from './adapters/local.js';
import { RemoteAdapter } from './adapters/remote.js';
import { mountDeck } from './views/deck.js';
import { mountAdd } from './views/add.js';
import { mountList } from './views/list.js';
import { mountCriteria } from './views/criteria.js';
import { mountSettings } from './views/settings.js';

export const VERSION = '1.0.2';
const CONN_KEY = 'meonji.connection';
const WIDGET_MAX = { w: 380, h: 420 };

function readConnection() {
  try { const j = JSON.parse(localStorage.getItem(CONN_KEY) || 'null'); return j && typeof j === 'object' ? { api_base: j.api_base || null, token: j.token || null } : { api_base: null, token: null }; }
  catch { return { api_base: null, token: null }; }
}
function writeConnection(c) { try { localStorage.setItem(CONN_KEY, JSON.stringify(c)); } catch {} }

function makeAdapter(conn) {
  if (conn.api_base) return new RemoteAdapter({ base: conn.api_base, token: conn.token || '' });
  return new LocalAdapter();
}

const bus = new EventTarget();
let conn = readConnection();
let adapter = makeAdapter(conn);
let settingsCache = null;

const ctx = {
  version: VERSION,
  get adapter() { return adapter; },
  connection: () => ({ ...conn }),
  async setConnection(next) {
    conn = { api_base: next.api_base || null, token: next.token || null };
    writeConnection(conn);
    adapter = makeAdapter(conn);
    settingsCache = null;
    wireAdapter();
    renderHeader();
    bus.dispatchEvent(new CustomEvent('cards:changed', { detail: {} }));
  },
  async settings(force = false) {
    if (!settingsCache || force) {
      try { settingsCache = normalizeSettings(await adapter.getSettings()); } catch { settingsCache = { ...DEFAULT_SETTINGS }; }
    }
    return settingsCache;
  },
  emit(name, detail) { bus.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); },
  on(name, fn) { bus.addEventListener(name, fn); return () => bus.removeEventListener(name, fn); },
};

function wireAdapter() {
  if (adapter.mode !== 'remote') return;
  adapter.onQueueChange = () => renderHeader();
  adapter.flush().then((r) => { if (r && r.sent) { toast(`밀린 변경 ${r.sent}건 보냈어요`); ctx.emit('cards:changed', {}); } }).catch(() => {});
}
window.addEventListener('online', () => { if (adapter.mode === 'remote') adapter.flush().then((r) => { if (r && r.sent) { toast(`밀린 변경 ${r.sent}건 보냈어요`); ctx.emit('cards:changed', {}); } }).catch(() => {}); });

// ---- layout ----
const app = document.getElementById('app');
const header = h('header', { class: 'topbar' });
const paneDeck = h('div', { class: 'pane pane-deck' });
const paneMain = h('div', { class: 'pane pane-main' });
const nav = h('nav', { class: 'tabs', 'aria-label': '화면' });
app.append(header, h('main', { class: 'panes' }, paneDeck, paneMain), nav);

const TABS = [['deck', '덱', ICON.deck], ['add', '담기', ICON.add], ['list', '목록', ICON.list], ['criteria', '기준', ICON.criteria], ['settings', '설정', ICON.settings]];

function renderHeader() {
  clear(header);
  const modeTag = h('span', { class: `mode-tag ${adapter.mode}` }, adapter.mode === 'remote' ? '원격' : '로컬');
  header.append(h('a', { class: 'brand', href: '#/deck' }, h('span', { class: 'brand-mark', 'aria-hidden': 'true' }), '먼지 수집함'), modeTag);
  if (adapter.mode === 'remote' && adapter.pendingCount) adapter.pendingCount().then((n) => { if (n) header.append(h('span', { class: 'pending', title: '보내지 못한 변경' }, `${n}`)); });
}

function renderNav(route) {
  clear(nav);
  for (const [r, label, icon] of TABS) nav.append(h('a', { href: `#/${r}`, class: `tab${route === r ? ' on' : ''}`, 'aria-current': route === r ? 'page' : null }, svg(icon, { size: 20 }), h('span', null, label)));
}

let wide = false;
let widget = false;
let deckView = null;
let mainView = null;
let currentRoute = null;
let currentParamsKey = '';

function isWidgetSize() { return window.innerWidth < WIDGET_MAX.w && window.innerHeight < WIDGET_MAX.h; }

function layout() {
  const { route } = parseHash(location.hash);
  const nextWidget = route === 'widget' || isWidgetSize();
  const nextWide = !nextWidget && window.innerWidth >= 1024;
  if (nextWidget !== widget || nextWide !== wide) {
    widget = nextWidget; wide = nextWide;
    document.body.classList.toggle('widget', widget);
    document.body.classList.toggle('wide', wide);
    if (deckView) { deckView.destroy(); deckView = null; }
    if (mainView) { mainView.destroy(); mainView = null; }
    currentRoute = null;
  }
  route_();
}

function route_() {
  const { route, params } = parseHash(location.hash);
  const key = JSON.stringify(params);
  if (widget) {
    renderNav(route);
    if (!deckView) deckView = mountDeck(paneDeck, ctx, { compact: true });
    if (mainView) { mainView.destroy(); mainView = null; }
    return;
  }
  if (wide) {
    if (!deckView) deckView = mountDeck(paneDeck, ctx);
    const mainRoute = route === 'deck' ? 'list' : route;
    if (mainRoute !== currentRoute || key !== currentParamsKey) {
      if (mainView) mainView.destroy();
      mainView = mountView(mainRoute, paneMain, params, { embedded: mainRoute === 'list' });
      currentRoute = mainRoute; currentParamsKey = key;
    }
    renderNav(route);
    return;
  }
  // 좁은 화면: 한 번에 한 화면
  if (route !== currentRoute || key !== currentParamsKey) {
    if (deckView) { deckView.destroy(); deckView = null; }
    if (mainView) { mainView.destroy(); mainView = null; }
    if (route === 'deck') deckView = mountDeck(paneDeck, ctx);
    else mainView = mountView(route, paneMain, params, {});
    currentRoute = route; currentParamsKey = key;
  }
  renderNav(route);
  window.scrollTo(0, 0);
}

function mountView(route, root, params, opts) {
  switch (route) {
    case 'add': return mountAdd(root, ctx, params);
    case 'list': return mountList(root, ctx, opts);
    case 'criteria': return mountCriteria(root, ctx);
    case 'settings': return mountSettings(root, ctx);
    case 'deck': return mountDeck(root, ctx);
    default: location.replace('#/deck'); return { destroy() {} };
  }
}

// ---- boot ----
if (!location.hash) location.replace('#/deck');
// /share?url= 로 들어온 경우(서비스 워커가 없을 때의 보험)
if (location.pathname.endsWith('/share') && location.search) {
  const q = new URLSearchParams(location.search);
  const p = new URLSearchParams(); for (const k of ['url', 'title', 'text']) if (q.get(k)) p.set(k, q.get(k));
  location.replace(`${location.pathname.replace(/share$/, '')}#/add?${p}`);
}
renderHeader();
wireAdapter();
layout();
window.addEventListener('hashchange', layout);
let resizeT; window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(layout, 120); });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      if (w) w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('새 버전이 준비됐어요. 다시 열면 적용돼요.', { ms: 3000 }); });
    });
  }).catch(() => {});
}
