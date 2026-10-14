# 앱에 연결하기

## 웹·웹뷰

`BubbleTapEffect`는 이모지를 그리며, `bindBubbleTap`은 수락된 반응에 효과를 붙입니다. 효과 레이어의 부모에 `position: relative`를 주고 `.fx`, `.th` 스타일을 `src/demo.css`에서 가져옵니다. 효과 레이어는 `pointer-events: none`으로 터치를 통과시킵니다.

```js
import { BubbleTapEffect, bindBubbleTap } from './src/bubble-tap.js';

const effect = new BubbleTapEffect(document.querySelector('#effects'));
const unbind = bindBubbleTap(document.querySelector('#message'), {
  effect,
  react: () => messageApi.addReaction(messageId),
  onAccepted: result => renderMessageGrowth(result.totalCount),
  onHaptic: () => nativeBridge.selectionHaptic(),
  onRejected: result => showLimitFeedback(result.reason),
  onError: error => showRetryFeedback(error)
});

// 화면을 없앨 때 호출합니다.
unbind();
effect.destroy();
```

`#message`는 실제 button 요소, `#effects`는 화면 위 오버레이입니다. 위 예제의 `messageApi`, `nativeBridge`, 화면 함수들은 앱이 구현할 연결 지점입니다. 이 패키지에 포함된 함수가 아닙니다.

`react()`는 동기 값 또는 Promise로 `{ accepted: true, userCount: 3, totalCount: 8 }`을 반환합니다. 거절 응답은 `{ accepted: false, reason: 'user-limit' }` 형태입니다. `own-message`, `message-limit`도 처리할 수 있습니다. 기존 서버 형식은 어댑터에서 변환하세요.

서버 응답을 기다리는 동안 같은 메시지의 추가 요청을 막습니다. 오류 때 성공 효과를 표시하지 않습니다. 햅틱 연결 실패는 시각적 반응에 영향을 주지 않습니다.

포인터 입력은 상대방의 같은 메시지를 두 번 연속 탭해야 반응합니다. 웹 기본값은 350ms·32 CSS px 이내이며 `motion-spec.json`에서 조정합니다. 첫 탭에는 API·글자 확대·이모지·햅틱을 실행하지 않고, 두 번째 탭에서 한 번 실행합니다. 다른 메시지 터치·스크롤·터치 취소·창 포커스 해제 시 첫 탭을 초기화합니다. Enter/Space와 보조기기 활성화는 한 번으로 반응합니다. 네이티브 앱도 상대방 메시지의 더블 탭 인식기에 반응 API를 연결하세요.

## 서버와 횟수

- 서버가 사용자와 작성자를 판별하고 본인 반응을 거절합니다.
- 사용자별 5회 제한과 메시지 상한 검증·증가는 한 트랜잭션에서 처리합니다. 합산 기준은 기획 확인 후 적용합니다.
- 네트워크 재시도에는 요청 식별자를 붙여 중복 반영을 방지합니다.
- 재입장·실시간 수신 시 서버의 누적 횟수를 읽어 기기 설정에 맞게 표시합니다.
- `nextReaction()`은 시연용 순수 함수입니다. 실제 서비스 제한은 서버에서 검증해야 합니다.

## iOS·Android 모션 적용

1. `motion-spec.json`의 이모지 배열에서 서로 다른 두 인덱스를 뽑습니다. 첫 인덱스는 0부터 N−1, 두 번째는 0부터 N−2에서 고르고 첫 인덱스 이상이면 1을 더합니다. Unicode 문자열을 쪼개지 않습니다.
2. 터치 좌표를 오버레이의 로컬 좌표로 변환하고 이모지 2개를 40ms 간격으로 시작합니다.
3. 속도·중력·회전·확대는 `motion` 값을 플랫폼 논리 좌표로 적용합니다. 화면 배율을 중복 적용하지 않습니다.
4. 매 프레임 `vy += gravity × dt`, `x += vx × dt`, `y += vy × dt`, `rotation += rotationVelocity × dt`로 갱신합니다. 0.12초에 1.3배, 0.2초에 1배입니다.
5. 동작 줄이기가 켜지면 이동 없이 0.6초 동안 사라집니다. 화면 종료·셀 재사용 시 예약된 효과를 취소합니다.
6. 텍스트 확대와 햅틱은 기존 앱 컴포넌트에 연결합니다. 웹 예제의 CSS 증가량을 네이티브 pt·sp로 그대로 복사하지 않고, 앱의 타이포그래피 체계에서 한 단계 증가를 적용합니다.

## 검증 범위

브라우저 소스 실행·모션·횟수 경계는 이 전달물의 검증 대상입니다. 실제 iOS·Android 빌드, 네이티브 햅틱, 서버 동시 요청은 앱 연결 후 확인해야 합니다. 반복 탭, 스크롤 중 터치 취소, 사용자별 다섯 번째·여섯 번째 반응, 메시지 열두 번째·열세 번째 반응, 본인 메시지, 재입장을 점검하세요.
