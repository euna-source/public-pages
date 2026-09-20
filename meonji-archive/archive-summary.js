// Count originals once even when several files in a drawer contain them.
export function drawerSummary(cards, ids, labels, axes, now = Date.now()) {
  const list = [...new Map(cards.filter(c => ids.includes('all') || c.labels.some(id => ids.includes(id))).map(c => [c.id, c])).values()];
  const dated = list.map(c => c.createdAt && new Date(c.createdAt).getTime()).filter(t => Number.isFinite(t) && t > 0 && t <= now);
  const first = dated.length ? new Date(Math.min(...dated)) : null;
  const date = first ? `${first.getFullYear()}.${String(first.getMonth()+1).padStart(2,'0')}.${String(first.getDate()).padStart(2,'0')}` : null;
  const scores = new Map();
  for (const c of list.filter(c => c.verdict === 'like')) for (const axis of new Set(c.axes || [])) {
    if (axes[axis]) scores.set(axis, (scores.get(axis) || 0) + 1);
  }
  const keywords = [...scores].sort((a,b) => b[1]-a[1] || a[0]-b[0]).slice(0,3).map(([axis]) => axes[axis]);
  const hasTaste = keywords.length > 0;
  if (!hasTaste) keywords.push(...ids.filter(id => id !== 'all').map(id => labels[id]?.name).filter(Boolean).slice(0,3));
  return {count:list.length, date, datedCount:dated.length, startLabel:date ? (dated.length === list.length ? '수집 시작' : '확인된 첫 기록') : '수집 시작일 미기록', keywords, keywordLabel:hasTaste ? 'O로 고른 감각' : '담긴 분류'};
}
export function folderPreview(cards, limit = 5) {
  if (cards.length <= limit) return cards;
  return Array.from({length:limit}, (_, i) => cards[Math.round(i*(cards.length-1)/(limit-1))]);
}
