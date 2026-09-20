// 사람의 O/X와 카드에 실제로 있는 텍스트만 집계한다. 이미지 판독·성격 진단이 아니다.
export const TASTE_AXES = [
  { id: 'simple', label: '간결함', terms: ['미니멀', '심플', '간결', '베이직', '무지', 'minimal', 'simple', 'basic', 'plain'] },
  { id: 'color', label: '색의 존재감', terms: ['컬러풀', '비비드', '파스텔', '배색', '멀티컬러', 'colorful', 'vivid', 'pastel', 'color block'] },
  { id: 'shape', label: '형태의 변주', terms: ['비대칭', '입체', '독특', '변형', '꼬임', '트위스트', 'asymmetric', 'sculptural', 'twist', 'unique'] },
  { id: 'texture', label: '질감', terms: ['질감', '텍스처', '니트', '울', '리넨', '린넨', '가죽', '테리', 'knit', 'wool', 'linen', 'leather', 'texture', 'terry'] },
  { id: 'comfort', label: '편안함', terms: ['편안', '부드러', '여유', '루즈', '오버핏', '홈웨어', '잠옷', 'soft', 'relaxed', 'loose', 'comfort', 'pajama'] },
  { id: 'utility', label: '실용성', terms: ['기능', '수납', '방수', '내구', '흡수', '포켓', '다용도', 'pocket', 'waterproof', 'durable', 'functional', 'utility'] },
];
export function tasteProfile(cards = []) {
  const judged = cards.filter(c => !c.deleted && c.verdict_by === 'user' && ['like', 'no'].includes(c.verdict));
  const matched = new Set();
  const axes = TASTE_AXES.map(axis => {
    const evidence = judged.flatMap(c => {
      const text = [c.title, c.note, ...(c.tags || [])].filter(Boolean).join(' ').toLowerCase();
      const terms = axis.terms.filter(t => /[가-힣]/.test(t) ? text.includes(t) : new RegExp(`\\b${t}\\b`, 'i').test(text));
      if (!terms.length) return [];
      matched.add(c.id);
      return [{ id: c.id, title: c.title || '제목 없는 카드', verdict: c.verdict, reason: c.reason || null, terms }];
    });
    const likes = evidence.filter(c => c.verdict === 'like').length;
    return { id: axis.id, label: axis.label, count: evidence.length, likes, no: evidence.length - likes,
      score: evidence.length >= 3 ? Math.round(likes / evidence.length * 100) : null, evidence };
  });
  return { judged: judged.length, matched: matched.size, unmatched: judged.length - matched.size, axes };
}
export const PREFERENCE_ID = '00000000000000000000000001';
