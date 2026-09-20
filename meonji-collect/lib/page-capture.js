// 현재 문서만 읽는다. 링크 클릭·API 호출·페이지 이동 없이 스크롤하며 항목을 누적한다.
export async function capturePage(options = {}) {
  const started = Date.now();
  const startURL = location.href;
  const maxMs = Math.min(options.maxMs || 90000, 100000);
  const delay = options.delay ?? 450;
  const items = new Map();
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const publicURL = value => {
    try { const u = new URL(value, startURL); return /^https?:$/.test(u.protocol) ? u : null; } catch { return null; }
  };
  const canonical = value => {
    const u = publicURL(value); if (!u) return null;
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) if (/^(utm_|from$|ref$|referrer$|gclid$|fbclid$)/i.test(key)) u.searchParams.delete(key);
    return u.href;
  };
  const productPath = /\/(products?|goods?|items?|product-detail)\/(?:[^/?]+)|\/goods\/view|[?&](goodsno|goodsNo|itemNo|product_no)=/i;
  const skip = el => !!el.closest('header,nav,footer,aside,[data-meonji-capture]');
  function scan() {
    for (const a of document.querySelectorAll('a[href]')) {
      if (skip(a)) continue;
      const img = a.querySelector('img');
      const url = canonical(a.getAttribute('href'));
      if (!img || !url) continue;
      const isProduct = productPath.test(url) || !!a.closest('[itemtype$="/Product"],[data-product-id]');
      if (!isProduct) continue;
      let row = a;
      // 같은 상품의 이미지와 설명만 묶고, 옆 상품·주문번호까지 올라가지 않는다.
      for (let depth = 0; depth < 3 && row.parentElement; depth++) {
        const parent = row.parentElement;
        const other = [...parent.querySelectorAll('a[href]')].some(x => x !== a && x.querySelector('img') && productPath.test(x.href) && canonical(x.href) !== url);
        if (other || parent.tagName === 'BODY') break;
        row = parent;
        if (clean(row.textContent).length > 12) break;
      }
      const title = clean(img.alt || a.getAttribute('aria-label') || a.textContent);
      if (!title || title.length > 500) continue;
      const ps = [...row.querySelectorAll('p')].map(p => clean(p.textContent)).filter(Boolean);
      const titleIndex = ps.findIndex(t => t === title);
      const brand = titleIndex > 0 ? ps[titleIndex - 1] : '';
      const variant = ps.find(t => t !== title && /^\[[^\]]+\]/.test(t)) || '';
      const price = ps.find(t => /(?:[\d,]+\s*원|[₩$€£]\s*[\d,.]+)/.test(t)) || '';
      const image = publicURL(img.currentSrc || img.getAttribute('src'))?.href || null;
      const key = `${url}\n${variant}`;
      const item = { source_url: url, title, brand, variant, price, image_url: image };
      const old = items.get(key);
      if (old || items.size < 1000) items.set(key, { ...item, image_url: image || old?.image_url || null });
    }
    return items.size;
  }
  scan();
  if (items.size < (options.minItems || 1)) return { source_page: startURL, items: [], complete: false, reason: 'not_product_list', passes: 0 };
  let cancelled = false;
  const overlay = document.createElement('div'); overlay.dataset.meonjiCapture = 'true';
  overlay.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647';
  const shadow = overlay.attachShadow({ mode: 'closed' });
  const panel = document.createElement('div');
  panel.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px 16px;background:#fff;color:#222;border:1px solid #ccc;border-radius:12px;box-shadow:0 2px 12px #0002;font:14px system-ui';
  const status = document.createElement('span');
  const stop = document.createElement('button'); stop.textContent = '중지';
  stop.style.cssText = 'font:inherit;min-height:32px;padding:4px 12px';
  stop.onclick = () => { cancelled = true; };
  panel.append(status, stop); shadow.append(panel); document.documentElement.append(overlay);
  const scrolling = document.scrollingElement;
  const containers = [scrolling];
  for (const el of document.querySelectorAll('main,section,div')) {
    if (el.scrollHeight > el.clientHeight + 80 && el.clientHeight > 100 && /auto|scroll/.test(getComputedStyle(el).overflowY) && el.querySelector('a[href] img') && !containers.some(p => p !== scrolling && p.contains(el))) containers.push(el);
  }
  const original = containers.map(el => ({ el, top: el.scrollTop, left: el.scrollLeft }));
  let complete = true, reason = 'end'; let passes = 0;
  const wait = () => new Promise(r => setTimeout(r, delay));
  try {
    scan();
    for (const el of containers) {
      el.scrollTop = 0; await wait();
      let stable = 0, previous = '';
      while (true) {
        if (location.href !== startURL) { complete = false; reason = 'page_changed'; break; }
        if (cancelled || Date.now() - started > maxMs || items.size >= 1000) { complete = false; reason = cancelled ? 'cancelled' : 'limit'; break; }
        scan(); passes++;
        status.textContent = `이 페이지에서 상품 ${items.size}개 찾는 중`;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 3;
        const state = `${el.scrollHeight}:${items.size}`;
        stable = atBottom && state === previous ? stable + 1 : 0;
        if (stable >= 4) break;
        previous = state;
        el.scrollTop = Math.min(el.scrollHeight, el.scrollTop + Math.max(80, el.clientHeight * 0.7));
        await wait();
      }
      if (!complete) break;
    }
    if (location.href === startURL) scan();
  } finally {
    overlay.remove();
    if (location.href === startURL) for (const {el,top,left} of original) { el.scrollTop = top; el.scrollLeft = left; }
  }
  return { source_page: startURL, items: [...items.values()], complete, reason, passes };
}
