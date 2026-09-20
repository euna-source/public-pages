// RemoteAdapter: Worker API(fetch + Bearer). 쓰기가 실패하면 큐에 쌓고 순서대로 다시 보낸다. 읽기는 마지막 성공 응답을 캐시.
import { ulid } from '../lib/ulid.js';
import * as db from '../lib/db.js';
import { newCard, applyPatch, normalizeSettings, DEFAULT_SETTINGS } from '../lib/model.js';

// 큐 저장소: IndexedDB. 시험에서는 메모리 저장소를 주입한다.
export class IdbQueue {
  async all() { const items = await db.getAll('queue'); return items.sort((a, b) => a.seq - b.seq); }
  async push(item) { return db.putOne('queue', item); }
  async replace(item) { return db.putOne('queue', item); }
  async remove(seq) { return db.delOne('queue', seq); }
  async clear() { return db.clearStore('queue'); }
}

export class MemoryQueue {
  constructor() { this.items = []; this.seq = 0; }
  async all() { return this.items.slice(); }
  async push(item) { const rec = { ...item, seq: ++this.seq }; this.items.push(rec); return rec.seq; }
  async replace(item) { this.items = this.items.map((it) => it.seq === item.seq ? { ...item } : it); }
  async remove(seq) { this.items = this.items.filter((i) => i.seq !== seq); }
  async clear() { this.items = []; }
}

export class IdbCache {
  async get(key) { const r = await db.getOne('cache', key).catch(() => null); return r ? r.value : undefined; }
  async set(key, value) { return db.putOne('cache', { key, value, at: Date.now() }).catch(() => {}); }
  async clear() { return db.clearStore('cache').catch(() => {}); }
}

export class MemoryCache {
  constructor() { this.m = new Map(); }
  async get(k) { return this.m.get(k); }
  async set(k, v) { this.m.set(k, v); }
  async clear() { this.m.clear(); }
}

export class NetworkError extends Error {
  constructor(msg, status) { super(msg); this.name = 'NetworkError'; this.status = status ?? 0; }
}
export class ApiError extends Error {
  constructor(msg, status) { super(msg); this.name = 'ApiError'; this.status = status; }
}

function isTemp(id) { return typeof id === 'string' && id.startsWith('tmp_'); }

export class RemoteAdapter {
  constructor({ base, token, fetch: fetchFn, queue, cache } = {}) {
    this.mode = 'remote';
    this.base = String(base || '').replace(/\/+$/, '');
    this.token = token || '';
    this._fetch = fetchFn || ((...a) => globalThis.fetch(...a));
    this.queue = queue || new IdbQueue();
    this.cache = cache || new IdbCache();
    this._urls = new Map();
    this._flushing = null;
    this.onQueueChange = null;
  }

  // ---- HTTP ----
  async request(path, { method = 'GET', json, body, raw } = {}) {
    const headers = { Authorization: `Bearer ${this.token}` };
    let payload = body;
    if (json !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(json); }
    let res;
    try {
      res = await this._fetch(this.base + path, { method, headers, body: payload });
    } catch (e) {
      throw new NetworkError(e && e.message ? e.message : '네트워크 오류', 0);
    }
    if (res.status >= 500) throw new NetworkError(`서버 오류 ${res.status}`, res.status);
    if (!res.ok) {
      let msg = res.status === 404 ? '주소나 토큰이 맞지 않아요' : `요청 실패 ${res.status}`;
      try { const j = await res.json(); if (j && j.error) msg = j.error === 'not_found' ? '없는 카드예요' : j.error; } catch {}
      throw new ApiError(msg, res.status);
    }
    if (raw) return res;
    if (res.status === 204) return null;
    return res.json();
  }

  async health() {
    return this.request('/api/health');
  }

  // ---- reads (cache last success) ----
  async _cachedGet(path, key, pick) {
    try {
      const data = await this.request(path);
      const value = pick ? pick(data) : data;
      await this.cache.set(key, value);
      return value;
    } catch (e) {
      if (e instanceof NetworkError) {
        const cached = await this.cache.get(key);
        if (cached !== undefined) return cached;
      }
      throw e;
    }
  }

  async list(q = {}) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== null && v !== '' && v !== 'all') params.set(k, String(v));
    if (!params.has('limit')) params.set('limit', '50');
    const qs = params.toString();
    const path = `/api/cards${qs ? `?${qs}` : ''}`;
    const cards = await this._cachedGet(path, `list:${qs}`, (d) => d.cards || []);
    // 아직 못 보낸 새 카드는 목록에 끼워 준다(판정 대기 조건일 때)
    const pending = await this._pendingAdds();
    if (pending.length && (q.needs_judgment || q.verdict === 'null' || !q.verdict)) {
      const ids = new Set(cards.map((c) => c.id));
      for (const p of pending) if (!ids.has(p.id)) cards.push(p);
    }
    return cards;
  }

  async get(id) {
    if (isTemp(id)) {
      const pend = await this._pendingAdds();
      return pend.find((c) => c.id === id) || null;
    }
    return this._cachedGet(`/api/cards/${encodeURIComponent(id)}`, `card:${id}`, (d) => d.card || d);
  }

  async _pendingAdds() {
    const items = await this.queue.all();
    const out = [];
    for (const it of items) {
      if (it.op === 'add') out.push(it.card);
      if (it.op === 'update') { const c = out.find((x) => x.id === it.id); if (c) Object.assign(c, it.patch); }
      if (it.op === 'remove') { const i = out.findIndex((x) => x.id === it.id); if (i >= 0) out.splice(i, 1); }
    }
    return out;
  }

  // ---- writes (queue on failure, order preserved) ----
  async add(partial = {}, files = []) {
    const body = { kind: partial.kind, entry: partial.entry || 'web', source_url: partial.source_url || undefined, title: partial.title || undefined, note: partial.note || undefined, tags: partial.tags && partial.tags.length ? partial.tags : undefined };
    const pending = await this.queue.all();
    if (pending.length === 0) {
      try {
        const { card } = await this.request('/api/cards', { method: 'POST', json: body });
        const withFiles = files && files.length ? await this._uploadFiles(card.id, files) : card;
        await this.cache.set(`card:${withFiles.id}`, withFiles);
        return withFiles;
      } catch (e) {
        if (!(e instanceof NetworkError)) throw e;
      }
    }
    // 오프라인이거나 앞에 밀린 것이 있으면 순서를 지키려고 큐에 넣는다
    const tempId = `tmp_${ulid()}`;
    const card = newCard(partial, { id: tempId });
    card.files = (files || []).map((f, i) => ({ key: `pending/${tempId}/${i + 1}-${f.name || 'file'}`, mime: f.type || 'application/octet-stream', bytes: f.size || 0, thumb_key: null }));
    await this.queue.push({ op: 'add', card, body, files: (files || []).map((f) => ({ name: f.name || 'file', type: f.type || '', blob: f })) });
    this._notify();
    return card;
  }

  async _uploadFiles(id, files) {
    const fd = new FormData();
    for (const f of files) fd.append('file', f.blob || f, f.name || 'file');
    const { card } = await this.request(`/api/cards/${encodeURIComponent(id)}/files`, { method: 'POST', body: fd });
    return card;
  }

  async update(id, patch) {
    const pending = await this.queue.all();
    if (pending.length === 0 && !isTemp(id)) {
      try {
        const { card } = await this.request(`/api/cards/${encodeURIComponent(id)}`, { method: 'PATCH', json: patch });
        await this.cache.set(`card:${card.id}`, card);
        return card;
      } catch (e) {
        if (!(e instanceof NetworkError)) throw e;
      }
    }
    await this.queue.push({ op: 'update', id, patch });
    this._notify();
    const cur = (await this.cache.get(`card:${id}`)) || (await this._pendingAdds()).find((c) => c.id === id) || { id };
    const next = applyPatch(cur, patch);
    await this.cache.set(`card:${id}`, next);
    return next;
  }

  async remove(id) {
    const pending = await this.queue.all();
    if (pending.length === 0 && !isTemp(id)) {
      try {
        await this.request(`/api/cards/${encodeURIComponent(id)}`, { method: 'DELETE' });
        return { ok: true };
      } catch (e) {
        if (!(e instanceof NetworkError)) throw e;
      }
    }
    await this.queue.push({ op: 'remove', id });
    this._notify();
    return { ok: true, queued: true };
  }

  // 큐를 앞에서부터 보낸다. 실패 항목은 원인과 무관하게 보존하고 다음 재시도까지 멈춘다.
  async flush() {
    if (this._flushing) return this._flushing;
    this._flushing = this._flushInner().finally(() => { this._flushing = null; });
    return this._flushing;
  }

  async _flushInner() {
    const idMap = new Map();
    let sent = 0;
    let dropped = 0;
    const items = await this.queue.all();
    for (const it of items) {
      const real = (id) => idMap.get(id) || id;
      try {
        if (it.op === 'add') {
          let card = it.server_card;
          if (!card) {
            ({ card } = await this.request('/api/cards', { method: 'POST', json: it.body }));
            it.server_card = card;
            await this.queue.replace(it);
          }
          let final = card;
          if (it.files && it.files.length) {
            final = await this._uploadFiles(card.id, it.files);
          }
          idMap.set(it.card.id, final.id);
          // 생성 항목을 지우기 전에 후속 판정·삭제의 실제 ID를 영속화한다.
          for (const pending of await this.queue.all()) {
            if (pending.id === it.card.id) await this.queue.replace({ ...pending, id: final.id });
          }
          await this.cache.set(`card:${final.id}`, final);
        } else if (it.op === 'update') {
          const id = real(it.id);
          if (isTemp(id)) throw new ApiError('보낼 수 없는 카드', 400);
          const { card } = await this.request(`/api/cards/${encodeURIComponent(id)}`, { method: 'PATCH', json: it.patch });
          await this.cache.set(`card:${card.id}`, card);
        } else if (it.op === 'remove') {
          const id = real(it.id);
          if (isTemp(id)) throw new ApiError('보낼 수 없는 카드', 400);
          await this.request(`/api/cards/${encodeURIComponent(id)}`, { method: 'DELETE' });
        }
        await this.queue.remove(it.seq);
        sent += 1;
      } catch (e) {
        break;
      }
    }
    const remaining = (await this.queue.all()).length;
    this._notify();
    return { sent, dropped, remaining, idMap };
  }

  async pendingCount() { return (await this.queue.all()).length; }

  _notify() { if (typeof this.onQueueChange === 'function') this.onQueueChange(); }

  // ---- files: Bearer가 필요해서 <img src>에 바로 못 쓴다. 받아서 object URL로 돌려준다.
  async fileUrl(key) {
    if (!key) return null;
    if (this._urls.has(key)) return this._urls.get(key);
    if (key.startsWith('pending/')) {
      const items = await this.queue.all();
      for (const it of items) if (it.op === 'add') {
        const idx = it.card.files.findIndex((f) => f.key === key);
        if (idx >= 0 && it.files[idx] && it.files[idx].blob) { const u = URL.createObjectURL(it.files[idx].blob); this._urls.set(key, u); return u; }
      }
      return null;
    }
    try {
      const res = await this.request(`/api/files/${key.split('/').map(encodeURIComponent).join('/')}`, { raw: true });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      this._urls.set(key, url);
      return url;
    } catch { return null; }
  }

  async listCriteria() { return this._cachedGet('/api/criteria', 'criteria', (d) => d.criteria || []); }
  async putCriteria(list) { const d = await this.request('/api/criteria', { method: 'PUT', json: { criteria: list } }); const out = (d && d.criteria) || list; await this.cache.set('criteria', out); return out; }

  async getSettings() {
    try { return normalizeSettings(await this._cachedGet('/api/settings', 'settings')); } catch { return { ...DEFAULT_SETTINGS }; }
  }
  async putSettings(s) { const v = normalizeSettings(s); const out = await this.request('/api/settings', { method: 'PUT', json: v }); await this.cache.set('settings', out); return normalizeSettings(out); }

  async export() {
    const res = await this.request('/api/export.jsonl', { raw: true });
    const text = await res.text();
    const cards = []; let tail = {};
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      const obj = JSON.parse(line);
      if (obj && obj.criteria !== undefined && obj.settings !== undefined && obj.id === undefined) tail = obj; else cards.push(obj);
    }
    return { version: 1, exported_at: new Date().toISOString(), cards, criteria: tail.criteria || [], settings: tail.settings || { ...DEFAULT_SETTINGS } };
  }

  async import(json) { return this.request('/api/import', { method: 'POST', json: { cards: json.cards || [], criteria: json.criteria || [] } }); }

  async clearAll() {
    for (const url of this._urls.values()) URL.revokeObjectURL(url);
    this._urls.clear();
    await this.queue.clear();
    await this.cache.clear();
  }
}
