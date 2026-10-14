import { BubbleTapEffect, bindBubbleTap } from './bubble-tap.js?v=20261014b';
import { nextReaction } from './reaction.js?v=20261014b';
import { SPEC } from './config.js?v=20261014b';

const STORAGE_KEY = 'c8-bubble-tap-final-v2';
const stage = document.querySelector('#stage');
const holder = document.querySelector('#holder');
const feedback = document.querySelector('#feedback');
const effect = new BubbleTapEffect(document.querySelector('#fx'));
let state = {};
try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; } catch { state = {}; }
if (typeof state !== 'object' || Array.isArray(state)) state = {};
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Private browsing can disable storage. */ } };

function fit() {
  if (innerWidth <= 500) { stage.style.transform = ''; return; }
  const scale = Math.min(innerWidth / 402, Math.max(1, innerHeight - 58) / 812, 1);
  stage.style.transform = `scale(${scale})`;
  holder.style.width = `${402 * scale}px`;
  holder.style.height = `${812 * scale}px`;
}
fit(); addEventListener('resize', fit);

const cleanups = [];
document.querySelectorAll('.bb').forEach(button => {
  const id = button.dataset.i;
  const text = button.querySelector('.tx');
  const base = parseFloat(getComputedStyle(text).fontSize);
  const own = button.classList.contains('me');
  function counts() {
    const s = state[id];
    return s && Number.isInteger(s.userCount) && Number.isInteger(s.totalCount)
      && s.userCount >= 0 && s.userCount <= 5 && s.totalCount >= s.userCount && s.totalCount <= 12
      ? s : { userCount: 0, totalCount: 0 };
  }
  function render() {
    const { userCount, totalCount } = counts();
    // Browser demonstration only: one CSS pixel per typography step.
    // Native apps derive their typography step from their own device settings.
    text.style.fontSize = `${base + totalCount}px`;
    button.dataset.userCount = userCount;
    button.dataset.totalCount = totalCount;
    button.disabled = own;
  }
  render();
  cleanups.push(bindBubbleTap(button, {
    effect,
    react: () => {
      const result = nextReaction({ ...counts(), own });
      if (result.accepted) { state[id] = { userCount: result.userCount, totalCount: result.totalCount }; save(); }
      return result;
    },
    onAccepted: ({ userCount }) => { render(); feedback.textContent = `이 메시지에 ${userCount}/${SPEC.interaction.perUserPerMessageLimit}회 반응했습니다.`; },
    onHaptic: () => { if (typeof navigator.vibrate === 'function') navigator.vibrate(10); },
    onRejected: ({ reason }) => { feedback.textContent = ({'message-limit':'이 메시지는 최대 단계까지 커졌습니다.','user-limit':'이 메시지에는 다섯 번까지 반응할 수 있어요.','own-message':'본인 메시지에는 반응할 수 없어요.'})[reason] || '반응 정보를 확인하지 못했습니다. 다시 체험해 주세요.'; },
    onError: () => { feedback.textContent = '반응을 처리하지 못했습니다. 다시 눌러 주세요.'; }
  }));
  button.addEventListener('demo-reset', render);
});
document.querySelector('#reset').addEventListener('click', () => {
  state = {}; save(); effect.clear();
  document.querySelectorAll('.bb').forEach(b => b.dispatchEvent(new Event('demo-reset')));
  feedback.textContent = '상대방 메시지를 두 번 연속 탭해 보세요.';
});
addEventListener('pagehide', () => { effect.clear(); });
