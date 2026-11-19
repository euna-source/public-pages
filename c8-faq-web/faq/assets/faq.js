// 첫 화면 검색 — 질문 제목에서 찾은 것을 먼저, 답 본문에서만 찾은 것을 뒤에 보여 준다. 데이터는 index.html의 window.FAQ.
(() => {
  const $ = id => document.getElementById(id);
  const input = $("q"), home = $("home"), result = $("result"), hits = $("hits"), count = $("count"), empty = $("empty");
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => s.replace(/\s+/g, "").toLowerCase();
  const mark = (t, ws) => ws.reduce((h, w) => h.replace(new RegExp(esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), m => `<mark>${m}</mark>`), esc(t));
  const chev = '<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function render() {
    const words = input.value.trim().split(/\s+/).filter(Boolean);
    const on = words.length > 0;
    home.hidden = on; result.hidden = !on;
    if (!on) return;
    const ws = words.map(norm);
    const a = FAQ.filter(x => ws.every(w => norm(x.t).includes(w)));
    const b = FAQ.filter(x => !a.includes(x) && ws.every(w => norm(x.t + x.x).includes(w)));
    const rows = [...a, ...b];
    count.textContent = rows.length ? `검색 결과 ${rows.length}개` : "";
    count.hidden = !rows.length; empty.hidden = rows.length > 0;
    hits.innerHTML = rows.map(x => `<a class="row" href="q/${x.id}.html"><span class="row__label"><span class="row__sub">${esc(x.c)}</span>${mark(x.t, words)}</span>${chev}</a>`).join("");
  }
  // 검색어를 주소(#q=)에 남겨, 답에서 뒤로 왔을 때 웹뷰가 페이지를 새로 읽어도 결과를 되살린다
  const fromHash = () => { const m = location.hash.match(/^#q=(.*)$/); try { return m ? decodeURIComponent(m[1]) : ""; } catch { return ""; } };
  input.addEventListener("input", () => { history.replaceState(null, "", input.value ? "#q=" + encodeURIComponent(input.value) : location.pathname); render(); });
  addEventListener("pageshow", () => { if (!input.value) input.value = fromHash(); render(); });
  input.value = fromHash();
  render();
})();
