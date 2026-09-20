// LocalAdapter: 브라우저 IndexedDB. 카드·기준·설정은 레코드로, 파일 바이트는 files 스토어의 Blob으로.
import { ulid } from '../lib/ulid.js';
import * as db from '../lib/db.js';
import {
  newCard, applyPatch, applyGuess, applyAutoLabel, filterCards, mergeById, normalizeSettings, exportBundle, DEFAULT_SETTINGS,
} from '../lib/model.js';

const SETTINGS_KEY = 'main';

export class LocalAdapter {
  constructor() {
    this.mode = 'local';
    this._urls = new Map();
  }

  async list(q = {}) {
    const [cards, settings] = await Promise.all([db.getAll('cards'), this.getSettings()]);
    return filterCards(cards, q, settings.jev_threshold);
  }

  async get(id) {
    const c = await db.getOne('cards', id);
    return c && !c.deleted ? c : null;
  }

  async add(partial = {}, files = []) {
    const id = ulid();
    const card = newCard(partial, { id });
    const stored = [];
    let n = 0;
    for (const f of files || []) {
      if (!f) continue;
      n += 1;
      const name = safeName(f.name || `file-${n}`);
      const key = `cards/${id}/${n}-${name}`;
      stored.push({ key, blob: f, mime: f.type || 'application/octet-stream' });
      card.files.push({ key, mime: f.type || 'application/octet-stream', bytes: f.size || 0, thumb_key: null });
    }
    if (card.files.length && card.entry === 'web' && !partial.entry) card.entry = 'capture';
    if (stored.length) await db.putMany('files', stored);
    await db.putOne('cards', card);
    return card;
  }

  async update(id, patch) {
    const cur = await db.getOne('cards', id);
    if (!cur) throw new Error('not_found');
    const next = applyPatch(cur, patch);
    await db.putOne('cards', next);
    return next;
  }

  async remove(id) {
    const cur = await db.getOne('cards', id);
    if (!cur) return { ok: true };
    await db.putOne('cards', { ...cur, deleted: true, updated_at: new Date().toISOString() });
    return { ok: true };
  }

  async fileUrl(key) {
    if (!key) return null;
    if (this._urls.has(key)) return this._urls.get(key);
    const rec = await db.getOne('files', key);
    if (!rec || !rec.blob) return null;
    const url = URL.createObjectURL(rec.blob);
    this._urls.set(key, url);
    return url;
  }

  async listCriteria() {
    const list = await db.getAll('criteria');
    return list.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
  }

  async putCriteria(list) {
    const withIds = (list || []).map((c) => ({ ...c, id: c.id || ulid() }));
    await db.clearStore('criteria');
    if (withIds.length) await db.putMany('criteria', withIds);
    return withIds;
  }

  async getSettings() {
    const rec = await db.getOne('settings', SETTINGS_KEY).catch(() => null);
    return normalizeSettings(rec ? rec.value : DEFAULT_SETTINGS);
  }

  async putSettings(s) {
    const value = normalizeSettings(s);
    const cards = await db.getAll('cards');
    const now = new Date().toISOString();
    await db.putMany('cards', cards.map((c) => applyAutoLabel(c, value.jev_threshold, now)));
    await db.putOne('settings', { key: SETTINGS_KEY, value });
    return value;
  }

  // 추측 반영(CLI가 준 결과를 들여올 때, 시험용). 자동 라벨 규칙 포함.
  async putGuess(cardId, guess) {
    const [cur, settings] = await Promise.all([db.getOne('cards', cardId), this.getSettings()]);
    if (!cur) throw new Error('not_found');
    const { card, auto_labeled } = applyGuess(cur, guess, settings.jev_threshold);
    await db.putOne('cards', card);
    return { card, auto_labeled };
  }

  async export() {
    const [cards, criteria, settings] = await Promise.all([db.getAll('cards'), this.listCriteria(), this.getSettings()]);
    return exportBundle({ cards, criteria, settings: { jev_threshold: settings.jev_threshold, reveal_seconds: settings.reveal_seconds, api_base: null } });
  }

  async import(json) {
    if (!json || typeof json !== 'object') throw new Error('형식이 아니에요');
    const settings = await this.getSettings();
    const existing = await db.getAll('cards');
    const incoming = json.cards || [];
    const { list, changed } = mergeById(existing, incoming);
    await db.putMany('cards', list.map((c) => applyAutoLabel(c, settings.jev_threshold, c.updated_at || new Date().toISOString())));
    if (Array.isArray(json.criteria) && json.criteria.length) {
      const curCriteria = await db.getAll('criteria');
      const merged = mergeById(curCriteria, json.criteria).list;
      await db.putMany('criteria', merged);
    }
    if (json.settings && typeof json.settings === 'object') {
      const { api_base, ...rest } = json.settings;
      await this.putSettings({ ...settings, ...rest });
    }
    return { imported: changed };
  }

  async clearAll() {
    for (const url of this._urls.values()) URL.revokeObjectURL(url);
    this._urls.clear();
    await db.deleteDatabase();
  }
}

function safeName(name) {
  return String(name).replace(/[^\w.\-가-힣]+/g, '_').slice(0, 80) || 'file';
}
