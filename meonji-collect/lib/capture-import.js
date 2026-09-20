import { LocalAdapter } from '../adapters/local.js';
import { isUrl } from './model.js';

// 수집 결과는 계약에 있는 카드 필드·로컬 파일로만 저장한다. 주문번호·계정 정보는 받지 않는다.
export async function importCapture(bundle, adapter = new LocalAdapter()) {
  if (!bundle || !Array.isArray(bundle.items) || bundle.items.length > 1000) throw Error('수집 형식이 올바르지 않아요');
  const existing = await adapter.list({ limit: 100000 });
  const seen = new Set(existing.map(c => `${c.source_url}\n${(c.note || '').split('\n').find(line => line.startsWith('옵션: ')) || ''}`));
  let added = 0, skipped = 0, images = 0;
  for (const item of bundle.items) {
    if (!isUrl(item.source_url) || typeof item.title !== 'string' || !item.title.trim()) continue;
    const note = [item.brand && `브랜드: ${item.brand}`, item.variant && `옵션: ${item.variant}`, item.price && `가격: ${item.price}`].filter(Boolean).join('\n');
    const key = `${item.source_url}\n${item.variant ? `옵션: ${item.variant}` : ''}`;
    if (seen.has(key)) { skipped++; continue; }
    const files = [];
    if (item.image?.data && /^image\/(jpeg|png|webp|gif|avif)$/.test(item.image.mime)) {
      const bytes = Uint8Array.from(atob(item.image.data), c => c.charCodeAt(0));
      if (bytes.length <= 5 * 1024 * 1024) files.push(new File([bytes], 'product-preview', { type: item.image.mime }));
    }
    await adapter.add({ kind: 'product', entry: 'capture', source_url: item.source_url, title: item.title.slice(0, 500), note: note || null }, files);
    seen.add(key); added++; images += files.length;
  }
  return { added, skipped, images, total: bundle.items.length, complete: !!bundle.complete, reason: bundle.reason };
}

export async function verifyCapture(expected, adapter = new LocalAdapter()) {
  const cards = await adapter.list({ limit: 100000 });
  return expected.filter(i => cards.some(c => c.source_url === i.url && c.title === i.title &&
    ((c.note || '').split('\n').find(x => x.startsWith('옵션: ')) || '') === (i.variant ? `옵션: ${i.variant}` : ''))).length;
}

// 로그인 탭을 읽는 Mac 도구가 수집함 문서 안에서만 부르는 로컬 저장 입구.
if (typeof window !== 'undefined') {
  const localOnly = () => { if (JSON.parse(localStorage.getItem('meonji.connection') || 'null')?.api_base) throw Error('local mode required'); };
  window.meonjiCapture = Object.freeze({
    async store(bundle) { localOnly(); return importCapture(bundle); },
    async verify(items) { localOnly(); return verifyCapture(items); },
  });
}
