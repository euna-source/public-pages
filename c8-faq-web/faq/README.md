# 크리에이터클럽 자주 묻는 질문 웹 (CCO-180)

설정 > 고객센터 > 「자주 묻는 질문」을 누르면 앱 웹뷰로 여는 정적 HTML 묶음이에요. 이용약관(`static.cre8orclub.com/policy/*.html`)과 같은 방식으로 올리면 돼요.

## 올리는 법

- `faq/` 폴더를 통째로 `https://static.cre8orclub.com/faq/`에 올려요.
- 앱이 여는 주소: `https://static.cre8orclub.com/faq/index.html`
- 빌드 도구는 필요 없어요. 외부 의존은 Pretendard 글꼴 CDN 하나예요(`cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css`).

## 구성

| 경로 | 화면 |
|---|---|
| `index.html` | 첫 화면: 검색, 자주 찾는 질문 5개, 카테고리 9개 |
| `c/0.html` ~ `c/8.html` | 카테고리별 질문 목록 |
| `q/{카테고리}-{번호}.html` | 질문 하나의 답(63장). 질문마다 주소가 하나씩 있어요 |
| `assets/faq.css` | 공통 스타일(다크) |
| `assets/faq.js` | 첫 화면 검색만 해요. 다른 화면에는 스크립트가 없어요 |
| `assets/img/` | 답 이미지 |

## 앱에서 맞춰 줄 것

1. 머리: 뒤로 가기와 제목(「자주 묻는 질문」)은 네이티브가 그려요. HTML에는 머리가 없어요.
2. 뒤로 가기: 웹뷰 안에서 페이지를 이동해요(첫 화면 → 카테고리 → 답). 네이티브 ←를 누르면 웹 기록이 있을 때는 `history.back()`, 없을 때는 화면을 닫아 주세요.
3. 메일: 「이메일 문의」는 `mailto:support@cre8orclub.com` 링크예요. 웹뷰에서 메일 앱으로 넘겨 주세요.
4. 앱 화면 바로가기: 「앱에서 2단계 인증 열기」 같은 바로가기는 앱 스킴이 정해지지 않아서 이번 묶음에서 뺐어요. 스킴을 알려 주시면 넣을게요.
5. 화면 크기: 휴대폰 폭에 맞춰져 있고, 아래 여백은 `safe-area-inset-bottom`을 따라요.

## 글을 고칠 때

글은 기획(정본 앱 답 화면)에서 고친 뒤 이 묶음을 다시 만들어 전달해요. 파일만 바꿔 올리면 되고, 앱 업데이트는 필요 없어요.

## 참고

- 지금 이용약관 페이지들이 쓰는 글꼴 주소(`…/dist/web/static/pretendard-variable.css`)는 404라서, 약관은 Pretendard가 아니라 시스템 글꼴로 보이고 있어요. 이 묶음은 살아 있는 주소를 써요.
- 첫 화면 검색어는 주소 끝(`#q=…`)에 남아요. 답을 보고 뒤로 오면 검색 결과가 그대로 보여요.
