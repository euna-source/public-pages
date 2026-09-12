# OS별 할 일

## AOS

1. `my_page` 발송을 멈춥니다. MY 탭 루트는 `my_profile_card` 하나로 진입·이탈 3종을 보냅니다.
2. 진입만 보내는 12개 화면에 `screen_exit`를 붙입니다: `my_profile_card`, `bookmark_creator`, `bookmark_portfolio`, `contacts_first_connections`, `contacts_follower`, `contacts_following`, `onboarding_cover_intro_profession`, `onboarding_cover_intro_nickname`, `onboarding_cover_intro_ko_name`, `onboarding_cover_intro_tagline`, `onboarding_cover_intro_media`, `onboarding_cover_intro_profile_image`.
3. 이름만 있는 `proposal_create`·`proposal_edit`에 `screen_view` 3종을 붙입니다.
4. `chatty`에 `tab` 파라미터(chat|lounge|project)를 붙이고 탭 전환 시 다시 보냅니다. `user_detail`에 `tab`을 붙입니다.
5. 다음 73개 화면에 이름을 추가합니다(존재 확인 4개 포함).
- `maintenance`: 서비스 · 점검 안내
- `signup_email_verification`: 가입 · 이메일 인증번호
- `signup_password`: 가입 · 비밀번호 설정
- `login_email`: 로그인 · 이메일 입력 · iOS는 이메일→비밀번호가 한 push 안의 단계. 비밀번호 단계가 별도 화면이면 login_password를 발송합니다.
- `login_password`: 로그인 · 비밀번호 입력
- `login_2fa_email`: 로그인 · 2단계 인증 코드
- `reset_password_email`: 비밀번호 재설정 · 이메일 입력
- `reset_password_verify`: 비밀번호 재설정 · 인증번호 · 로그인 전·설정 안 어느 진입이든 같은 이름. 진입은 previous_screen으로 구분합니다.
- `reset_password_new`: 비밀번호 재설정 · 새 비밀번호
- `onboarding_permission`: 첫 이용 · 접근 권한 안내
- `onboarding_tutorial`: 첫 이용 · 튜토리얼
- `onboarding_tutorial_complete`: 첫 이용 · 입장 영상
- `agreement_document`: 약관 · 전문 보기 · document_type · 어느 약관이든 같은 이름. document_type=signup_terms|privacy|privacy_reconsent|ad_info|terms_of_service|personal_info.
- `profile_cover_edit`: 프로필 커버 · 수정
- `profile_expression_edit`: 자기소개 · 수정
- `respect_select`: 리스펙트 · 한마디 선택 · 팝업 형태지만 독립 선택 과업이라 화면으로 셉니다.
- `respect_list`: 리스펙트 · 보낸 사람 목록
- `media_viewer`: 첨부 · 미디어 전체보기 · media_type=image|video|audio|pdf|youtube · 사진·영상·PDF·유튜브 전체보기와 업로드 첨부 미리보기를 하나로 셉니다. 어디서 열었는지는 previous_screen.
- `finder_filter`: 파인더 · 필터 · filter_step=region|profession|tag(선택) · 필터 시트 안의 지역·직업·해시태그 추가 단계는 같은 화면. 필요하면 filter_step 파라미터.
- `knock_compose`: 노크 · 메시지 입력
- `report_reason`: 신고 · 사유 선택 · target_type=user|content|chat_room
- `report_detail_input`: 신고 · 상세 사유 입력 · target_type
- `my_info_management`: 내 정보 · 관리 홈 · iOS 제안 basic_info_*는 AOS 현행 basic_info_*(가입 필수정보)와 키가 겹쳐 내 정보 수정 화면군은 my_info_* 접두어로 새로 짓습니다.
- `my_info_id`: 내 정보 · ID 변경
- `my_info_name_ko`: 내 정보 · 한글 이름
- `my_info_name_en`: 내 정보 · 영문 이름
- `my_info_profession_select`: 내 정보 · 직업 선택
- `my_info_signature_keyword`: 내 정보 · 시그니처 키워드
- `my_info_region`: 내 정보 · 활동 지역
- `my_info_region_global_city`: 내 정보 · 해외 도시 입력
- `my_info_email_register`: 내 정보 · 이메일 입력
- `my_info_email_verify`: 내 정보 · 이메일 인증
- `my_info_phone_register`: 내 정보 · 전화번호 입력
- `my_info_link_register`: 내 정보 · 링크 입력
- `resume_career_register`: 커리어 · 경력 입력
- `resume_education_register`: 커리어 · 학력 입력
- `resume_awards_register`: 커리어 · 자격·수상 입력
- `media_image_edit`: 첨부 · 이미지 편집(자르기·회전) · purpose=upload|profile_image|card_background
- `media_video_edit`: 첨부 · 동영상 편집(구간 자르기) · purpose
- `chat_room_direct`: 채티 · 1:1 대화방 · screen_id=roomId · AOS는 대화방에 이름이 없다(탭까지만). 대화방 유형은 경로 분석에서 갈라 봐야 하므로 이름으로 나눕니다.
- `chat_room_lounge`: 채티 · 라운지 대화방 · screen_id=roomId
- `chat_room_project`: 채티 · 프로젝트 대화방 · screen_id=roomId
- `chat_room_team`: 채티 · 팀 대화방 · screen_id=roomId
- `chat_room_menu`: 채티 · 대화방 메뉴 · room_type=direct|lounge|project|team
- `lounge_create`: 라운지 · 만들기
- `lounge_edit`: 라운지 · 수정
- `notification_center`: 알림 · 내 알림
- `contacts_search`: 인맥 · 검색 · tab=first_connections|follower|following
- `project_card_list`: 프로젝트 · 목록(딥링크)
- `project_application_compose`: 프로젝트 · 지원 작성
- `project_applicants`: 프로젝트 · 지원자 목록
- `team_detail`: 팀 · 상세 · screen_id=teamId · tab=portfolio|introduction|member
- `team_create`: 팀 · 만들기
- `team_edit`: 팀 · 수정
- `team_invite`: 팀 · 멤버 초대
- `setting_account`: 설정 · 계정
- `setting_notification`: 설정 · 알림
- `setting_visibility`: 설정 · 공개 범위
- `setting_visibility_profile`: 설정 · 프로필 공개 범위
- `setting_blocked_members`: 설정 · 차단한 사용자
- `setting_change_password`: 설정 · 비밀번호 변경
- `setting_2fa`: 설정 · 2단계 인증
- `setting_2fa_email`: 설정 · 인증 이메일 관리
- `setting_2fa_email_verify`: 설정 · 인증 이메일 확인
- `setting_2fa_completed`: 설정 · 2단계 인증 완료
- `setting_account_delete_password`: 회원 탈퇴 · 본인 확인
- `setting_account_delete_reason`: 회원 탈퇴 · 사유 · 기타 사유 직접 입력(176행)은 같은 화면의 단계.
- `setting_account_delete_confirm`: 회원 탈퇴 · 최종 확인
- `setting_customer_service`: 고객센터
- `setting_contents`: 내 활동 · 모아보기
- `setting_contents_comments`: 내 활동 · 댓글과 답글
- `setting_contents_respected`: 내 활동 · 리스펙트한 작업물
- `setting_contents_liked`: 내 활동 · 좋아요한 콘텐츠
6. 다음 23개는 AOS에 해당 화면이 있는지 회신합니다. 있으면 같은 이름으로 추가합니다.
- `profile_expression_onboarding`: 자기소개 · 만들기(첫 온보딩) · AOS는 basic_info_keyword_* 3단계로 나뉩니다. OS 간 비교는 구간(가입 후 첫 이용) 롤업으로 합니다.
- `my_onboarding_intro`: MY 탭 · 온보딩 인트로(커버 미등록)
- `inspiration_list`: 영감 · 목록(딥링크)
- `muse_comment_list`: Muse 한 마디 · 목록
- `muse_comment_manage`: Muse 한 마디 · 관리
- `muse_comment_input`: Muse 한 마디 · 작성·수정
- `portfolio_comment_list`: 포트폴리오 · 댓글 · screen_id=작업물 id · 디스커버리 카드·상세·프로필 어디서 열든 같은 이름. 유입은 previous_screen으로 봅니다.
- `inspiration_comment_list`: 영감 · 댓글 · screen_id=콘텐츠 id
- `relation_list`: 크리에이터 · 관계 목록(일촌·팔로워·팔로잉) · tab=first_connections|follower|following · 타인의 관계 목록. 내 인맥(contacts_*)과 구분합니다.
- `first_connection_mutual`: 크리에이터 · 함께 아는 일촌
- `knock_type_select`: 노크 · 용건 선택 · AOS 8종 피커 구현 시 같은 이름.
- `profile_collaboration_status`: MY · 노크 수신 설정
- `my_info_signature_keyword_register`: 내 정보 · 시그니처 키워드 등록
- `my_info_visibility`: 내 정보 · 개인정보 공개설정
- `my_info_profile_image_register`: 내 정보 · 프로필 사진 등록
- `register_email`: 계정 · 이메일 강제 등록
- `contacts_my_club`: 인맥 · 마이클럽
- `setting_muse_privileges`: Muse 특권 안내(웹)
- `web_page`: 웹 · 전용 이름 없는 웹 페이지 · web_path=ID를 뺀 경로 · 전용 이름이 있는 웹 목적지(제안·추천·미리보기·약관·클럽)는 여기로 보내지 않습니다. 남는 웹뷰만 web_path와 함께 발송합니다.
- `club_waiting_web`: 클럽 · 대기 랜딩(웹)
- `club_entry_web`: 클럽 · 입장 랜딩(웹)
- `card_game_boss`: 아케이드 · 카드 보스전
- `card_game_breakout`: 아케이드 · 블록깨기

## iOS

1. 화면 이름 enum을 만들고 `LogManager.logScreen`이 문자열 리터럴 대신 enum만 받게 합니다. 값은 `screen-keys.json`과 같아야 합니다.
2. 파라미터 `screen_id`·`previous_screen`·`entry_point`·`tab`을 AOS와 같은 규칙으로 채웁니다. `screen_enter`·`screen_exit`(+`duration_ms`)를 맞춥니다.
3. 현행 17개는 그대로 둡니다.
4. 제안명을 바꿔 구현하는 화면(제안 개명): 대장의 iOS 열이 "제안 개명"인 38개. 대부분 AOS 현행명에 맞추거나(`splash`→`app_entry`, `profile_detail`→`user_detail`, `setting_home`→`my_page_menu`), 가입 필수정보와 겹치는 `basic_info_*` 제안을 `my_info_*`로 옮긴 것입니다.
5. 여러 행을 한 이름으로 보내는 화면(통합 발송)과 한 행을 단계·유형별로 나눠 보내는 화면(단계별 발송)은 대장의 비고를 따릅니다. 대표: 약관 전문 6행→`agreement_document`+`document_type`, 미디어 뷰어 13행→`media_viewer`+`media_type`, 대화방 1행→유형별 4개, 포트폴리오 작성·수정 2행→유형별 12개, 커버 만들기 1행→단계별 6개.
6. 제외 45행은 화면 이벤트를 보내지 않습니다. 필요한 것은 행동 이벤트로 따로 정의합니다.
7. 다음 11개는 iOS 리드가 확인·회신합니다.
- `login_password`: 로그인 · 비밀번호 입력 · 확인
- `reset_password_email`: 비밀번호 재설정 · 이메일 입력 · 확인
- `basic_info_jobs`: 가입 · 직업 선택 · 확인 · iOS는 커버 온보딩의 직업 단계(onboarding_cover_intro_profession)와 대응 가능성. 구간 롤업으로 비교.
- `basic_info_keyword_personal`: 가입 · 키워드(성향) · 확인 · iOS는 자기소개 만들기(profile_expression_onboarding) 안 단계. 구간 롤업으로 비교.
- `basic_info_keyword_working_preference`: 가입 · 키워드(업무 성향) · 확인
- `basic_info_keyword_ambition`: 가입 · 키워드(목표) · 확인
- `knock_compose`: 노크 · 메시지 입력 · 확인
- `my_info_signature_keyword`: 내 정보 · 시그니처 키워드 · 보류(도달 불가)
- `my_info_signature_keyword_register`: 내 정보 · 시그니처 키워드 등록 · 보류(도달 불가)
- `my_info_profile_image_register`: 내 정보 · 프로필 사진 등록 · 보류(도달 불가)
- `proposal_detail`: 협업 제안 · 상세(웹) · 확인 · iOS는 제안 상세가 web_page 안에 묻히지 않도록 전용 이름으로 발송합니다.

## 데이터·기획

- 라벨 층 매핑표(screen_name → 한국어 라벨, `my_page`→`my_profile_card` 별칭, `contacts_team`↔`team_list` 별칭)를 대시보드에 둡니다.
- 맞춤 측정기준 등록: `tab`·`document_type`·`room_type`·`media_type`·`purpose`·`target_type`·`entry_point`. `screen_id`·`previous_screen`은 등록하지 않습니다.
- 핵심 31개 화면을 양 OS DebugView에서 실수신 확인한 뒤 "수집 검증 완료"로 올립니다.
