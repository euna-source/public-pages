import { isUrl } from './model.js';
const KEY = 'meonji.capture.pending';
export function pendingCaptures(storage = localStorage) {
  const value = JSON.parse(storage.getItem(KEY) || '[]');
  if (!Array.isArray(value)) throw Error('내용 읽기 대기 목록을 읽지 못했어요');
  return value.filter(x => x && isUrl(x.url));
}
export function queueCapture(request, storage = localStorage) {
  if (!isUrl(request.url)) throw Error('페이지 주소를 확인해 주세요');
  const pending = pendingCaptures(storage);
  const old = pending.find(x => x.url === request.url);
  if (!old && pending.length >= 1000) throw Error('내용 읽기 대기 목록이 가득 찼어요');
  const next = { ...old, ...request, created_at: old?.created_at || new Date().toISOString() };
  const list = [next, ...pending.filter(x => x.url !== request.url)];
  storage.setItem(KEY, JSON.stringify(list));
  return list;
}
export function finishCapture(urls, storage = localStorage) {
  const done = new Set(urls.filter(Boolean));
  storage.setItem(KEY, JSON.stringify(pendingCaptures(storage).filter(x => !done.has(x.url))));
}
export function supportsNativeCapture(nav = navigator) {
  return /Mac/.test(nav.platform || '') && (nav.maxTouchPoints || 0) < 2;
}
