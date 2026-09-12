# GA 화면명 정의 기준

앱(AOS·iOS)의 `screen_view` 이벤트에 실리는 `screen_name`을 짓고 지키는 규칙입니다. 두 OS가 같은 화면에 같은 값을 보내야 GA4의 "페이지 제목 및 화면 이름" 차원에서 한 행으로 합산되고, 경로 탐색에서 같은 노드로 이어집니다.

## 1. 무엇이 화면인가

- 사용자가 전면에서 읽거나 입력하는 목적지가 한 화면입니다. 전체 페이지(push·fullScreenCover·Activity), 탭 루트, 목록이 바뀌는 탭, 독립적인 선택·입력 과업을 하는 시트를 포함합니다.
- 같은 목적지의 로딩·빈 결과·오류 문구·입력 칸·키보드·버튼은 별도 화면이 아닙니다.
- 화면이 아닌 것: 확인·안내 팝업 · 유도·완료 팝업 · 시스템 피커 · 옵션(더보기) 시트 · 정렬·첨부·메뉴 시트 · 오류 상태 · 컨테이너 · 정보 표시 시트 · 내부 QA 도구. 필요하면 화면이 아니라 행동 이벤트로 셉니다.
- 내 것과 타인 것은 할 수 있는 일이 달라 구분합니다(`my_profile_card` vs `user_detail`, `contacts_*` vs `relation_list`).
- 같은 콘텐츠 상세는 어디서 들어왔든 같은 이름입니다. 유입은 `previous_screen`으로 봅니다.
- 하위탭 판정: "둘을 구분해야 답이 달라지는 질문이 있는가"로 정합니다. 경로 분석에서 갈라 봐야 하는 목적지(대화방 유형·검색 결과 종류)는 이름으로, 같은 목록의 필터(채티 하위탭·팀 상세 탭)는 `tab` 파라미터로 나눕니다.
- 웹뷰는 호스트 앱이 이름을 냅니다. 전용 이름이 있는 웹 목적지(제안·추천·미리보기·약관·클럽)는 그 이름으로, 남는 웹뷰만 `web_page`+`web_path`로 보냅니다. 같은 화면을 앱과 웹이 두 번 보내지 않습니다.

## 2. 이름을 어떻게 짓는가

- 형식: 소문자 영문·숫자·밑줄, 정규식 `^[a-z][a-z0-9_]{1,39}$`. 2~4토막, 40자 이내(GA4 한도는 100자지만 보고서 가독성 때문에 40자로 둡니다).
- 구조: `<영역>_<대상>[_<한정>]`. 영역 어휘는 현행 발송 중인 어휘를 따릅니다: app · signup · login · reset_password · basic_info · onboarding · home · finder · discovery · user · my · my_info · resume · media · portfolio · inspiration · project · project_card · proposal · chatty · chat_room · lounge · contacts · relation · team · setting · bookmark · notification · report · respect · knock · agreement · web · club · card_game.
- 넣지 않는 것: 회원명·검색어·콘텐츠 제목·고유번호·URL·날짜, 상태(loading·error·empty), 기술 클래스명(Activity·View·Fragment), UI 종류(bottom_sheet·popup - 현행 `visitor_today_bottom_sheet`는 예외로 유지).
- 값은 대장에 있는 것만 보냅니다. 임의 문자열 금지. AOS는 `C8Screen` enum이, iOS는 같은 역할의 enum이 유일한 입구입니다.
- 이름은 의미가 유지되는 동안 바꾸지 않습니다. 폐기한 키는 다른 뜻으로 재사용하지 않습니다. 바꿔야 하면 새 키를 추가하고 구이름 대응표를 대시보드 라벨 층에 둡니다.
- 한국어 라벨은 대장에만 있고 GA로 보내지 않습니다. 라벨은 `<영역> · <대상>` 꼴로 씁니다.

## 3. 언제 보내는가

- 화면이 전면에 표시될 때 1회 `screen_view`. AOS는 `screen_enter`를 같이 보내고 이탈에 `screen_exit`(+`duration_ms`)를 보냅니다. iOS도 같은 3종을 맞춥니다.
- 뒤로가기·탭 전환으로 다시 전면에 오면 다시 보냅니다. `tab` 파라미터가 있는 화면은 탭이 바뀔 때 값을 바꿔 다시 보냅니다.
- 시트·팝업이 닫혀 밑 화면이 다시 보이는 것은 다시 보내지 않습니다. 앱이 백그라운드에서 돌아오는 것도 다시 보내지 않습니다(양 OS 현행 동작을 DebugView로 맞춥니다).
- 페이저에서 회원·콘텐츠가 바뀌면 같은 이름을 새 `screen_id`로 다시 보냅니다(AOS `user_detail` 현행 규칙).
- Firebase 자동 화면 수집은 끕니다. iOS `Info.plist`의 `FirebaseAutomaticScreenReportingEnabled = NO`, AOS 매니페스트의 `google_analytics_automatic_screen_reporting_enabled = false`. SwiftUI는 자동 수집이 되지 않으므로 수동 발송이 필수입니다.

## 4. 파라미터 계약

| 파라미터 | 뜻 | 상태 |
|---|---|---|
| screen_name | 대장의 값. 임의 문자열 금지. | AOS 현행 · iOS 구현 |
| screen_id | 그 화면이 연 대상 식별자(uid·작업물·프로젝트·roomId·teamId). 없으면 none. GA 맞춤 측정기준으로 등록하지 않는다(카디널리티). BigQuery·내부 적재용. | AOS 현행 · iOS 추가 |
| previous_screen | 직전 화면 이름. 앱이 자동으로 채웁니다. 없으면 none. | AOS 현행 · iOS 추가 |
| entry_point | 앱 밖에서 곧바로 열렸으면 deeplink(푸시 포함). 화면→화면은 none. | AOS 현행 · iOS 추가 |
| tab | 같은 화면 안 필터 탭. 대장에 tab 파라미터가 있는 화면만. 탭이 바뀌면 값을 바꿔 다시 발송합니다. | 양 OS 추가 |
| duration_ms | 체류시간. screen_exit 전용. | AOS 현행 · iOS 확인 |

- `screen_id`·`previous_screen`은 값의 종류가 많아 GA 맞춤 측정기준으로 등록하면 (other) 행으로 뭉개집니다. 이 둘은 BigQuery 내보내기·내부 적재에서만 씁니다. `tab`·`document_type`·`room_type`·`media_type`처럼 값이 적은 것만 맞춤 측정기준으로 등록합니다.

## 5. 새 화면을 추가할 때 체크리스트

1. 이 화면의 수치가 없으면 막히는 결정과 요청자를 적습니다.
2. 전면 목적지 또는 독립 과업 시트인지 확인합니다. 피커·팝업·옵션·정렬·컨테이너·QA 도구는 화면이 아닙니다.
3. 기존 이름으로 셀 수 있는 화면(같은 상세의 다른 유입, 같은 목록의 필터)이면 새 이름 대신 파라미터로 풉니다.
4. 형식 규칙(정규식·40자·영역 어휘)을 지키고 회원명·ID·상태·클래스명을 넣지 않습니다.
5. 같은 화면이 다른 OS에 있으면 같은 키를 쓰고, 없으면 "해당 없음"으로 대장에 남깁니다.
6. 체류가 필요한 화면이면 이탈 발송까지 구현합니다.
7. `screen_id`·`tab` 등 파라미터 값을 대장에 열거합니다.
8. 대장(`screen-keys.json`) 갱신, 양 OS enum 갱신, DebugView 실수신 확인 순서를 지킵니다.

## 6. 정본과 승인

- 정본은 `screen-keys.json` 한 파일입니다. 대장 문서·HTML·CSV는 여기서 생성합니다. 스프레드시트 사본은 정본이 아닙니다.
- AOS `C8Screen`·iOS enum은 이 파일을 따릅니다. 코드에만 있고 파일에 없는 이름은 GA에 나갈 수 없어야 합니다.
- 추가·변경은 기획 리드가 승인하고, 발송은 데이터 담당이 DebugView에서 실수신을 확인한 뒤 "수집 검증 완료"로 올립니다.

## 근거

- Firebase 화면 조회 수집·자동 수집 끄기: https://firebase.google.com/docs/analytics/screenviews
- GA4 수집 한도(이벤트명 40자·파라미터 값 100자·이벤트당 파라미터 25개): https://support.google.com/analytics/answer/9267744
- GA4 높은 카디널리티 차원과 (other) 행: https://support.google.com/analytics/answer/13331684
- GA4 페이지 및 화면 보고서(페이지 제목 및 화면 이름 차원): https://support.google.com/analytics/answer/12926732
