const comparison = document.querySelector('.comparison');
const buttons = [...document.querySelectorAll('[data-view]')].filter(el => el.tagName === 'BUTTON');
function setView(view) {
  comparison.dataset.view = view;
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
}
buttons.forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
if (matchMedia('(max-width:760px)').matches) setView('barun');
document.querySelector('#size').addEventListener('change', event => {
  if (event.target.value === 'auto') document.documentElement.style.removeProperty('--body-size');
  else document.documentElement.style.setProperty('--body-size', `${event.target.value}px`);
});
document.querySelector('#regular').addEventListener('change', event => comparison.classList.toggle('regular', event.target.checked));
const families = {barun: 'Barun', yet: 'Yet', square: 'Square'};
for (const [key, family] of Object.entries(families)) {
  const status = document.querySelector(`#${key} .font-status`);
  const requests = [document.fonts.load(`400 16px ${family}`, '집계 기간 0123456789')];
  if (key !== 'yet') requests.push(document.fonts.load(`700 16px ${family}`, '집계 기간'));
  Promise.all(requests).then(results => {
    if (results.some(result => result.length === 0)) throw new Error('Font unavailable');
    status.textContent = '서체 적용됨';
    status.dataset.state = 'ready';
  }).catch(() => {
    status.textContent = '서체를 불러오지 못했습니다. 새로고침해 주세요.';
    status.dataset.state = 'error';
  });
}
