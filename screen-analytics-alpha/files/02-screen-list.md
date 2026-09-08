# 알파 기준 공통 화면 목록

기획·개발·데이터 담당자가 화면의 의미와 구현 위치를 함께 검토하는 목록입니다. 이름은 적용 제안이며, 실제 배포·수신 검증과 팀 확정은 남아 있습니다. 화면 수에 컨테이너·상태·레거시 항목을 합산하지 마세요.

| 공통 이름 | 화면 설명 | 플랫폼 | 기록 정책 | 구분할 값 |
|---|---|---|---|---|
| `media_image_crop` | 이미지 자르기 | aos, ios | 주 화면 조회 |  |
| `project_apply` | 프로젝트 참여 신청 | aos | 주 화면 조회 |  |
| `upload_home` | 콘텐츠 작성 | aos, ios | 주 화면 조회 | content_type; mode=create/edit |
| `upload_inspiration` | 영감 작성 | aos, ios | 주 화면 조회 | mode=create/edit |
| `upload_portfolio` | 포트폴리오 작성 | aos, ios | 주 화면 조회 | mode=create/edit; content_type=image/video/audio/pdf/youtube/text |
| `upload_project` | 프로젝트 작성 | aos, ios | 주 화면 조회 | mode=create/edit |
| `chat_home` | 채티 | ios | 컨테이너·별도 조회 없음 |  |
| `chat_list_direct` | 채티 · 채팅 목록 | aos, ios | 주 화면 조회 |  |
| `chat_list_lounge` | 채티 · 라운지 목록 | aos, ios | 주 화면 조회 |  |
| `chat_list_project` | 채티 · 프로젝트 목록 | aos, ios | 주 화면 조회 |  |
| `chat_lounge_form` | 라운지 만들기·수정 | aos, ios | 주 화면 조회 | mode=create/edit |
| `chat_room` | 채팅방 | aos, ios | 주 화면 조회 | room_type=direct/lounge/project/team; membership_state=preview/joined |
| `chat_room_manage` | 채팅방 관리 | aos, ios | 주 화면 조회 | role; room_type=direct/lounge/project/team |
| `knock_compose` | 대화 제안 입력 | aos | 주 화면 조회 | entry_point |
| `knock_select` | 노크 목적 선택 | ios | 주 화면 조회 | entry_point |
| `media_viewer` | 미디어 보기 | aos, ios | 주 화면 조회 | content_type=image/video/audio/pdf; entry_point |
| `project_applicants` | 프로젝트 지원자 목록 | aos, ios | 주 화면 조회 |  |
| `casting_applicant_detail` | 캐스팅 지원자 상세 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_applicant_list` | 캐스팅 지원자 목록 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_apply` | 캐스팅 지원서 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_apply_detail` | 내 캐스팅 지원 상세 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_apply_email` | 지원 이메일 입력 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_apply_phone` | 지원 전화번호 입력 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_apply_portfolio` | 지원 포트폴리오 선택 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_detail` | 캐스팅 상세 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_draft_list` | 임시저장 캐스팅 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_form` | 캐스팅 작성·수정 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_inbox` | 인박스 캐스팅 탭 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_list` | 캐스팅 목록 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_mine` | 내 캐스팅 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_preview` | 캐스팅 미리보기 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_result` | 캐스팅 검색결과 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `casting_search` | 캐스팅 검색 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `proposal_detail` | 제안 상세 | web | 주 화면 조회 |  |
| `proposal_form` | 제안 작성·수정 | web | 주 화면 조회 | mode=create/edit |
| `proposal_form_email` | 제안 이메일 입력 | web | 주 화면 조회 |  |
| `proposal_form_phone` | 제안 전화번호 입력 | web | 주 화면 조회 |  |
| `proposal_form_portfolio` | 제안 포트폴리오 선택 | web | 주 화면 조회 |  |
| `proposal_form_type` | 제안 유형 선택 | web | 주 화면 조회 |  |
| `proposal_inbox` | 인박스 제안 탭 | web | 주 화면 조회 |  |
| `contact_follower` | 팔로워 목록 | aos, ios | 주 화면 조회 |  |
| `contact_following` | 팔로잉 목록 | aos, ios | 주 화면 조회 |  |
| `contact_first` | 일촌 목록 | aos, ios | 주 화면 조회 |  |
| `contact_first_request` | 1촌 요청 목록 | ios | 구성요소 이벤트 |  |
| `contact_home` | 인맥 관리 | aos, ios | 컨테이너·별도 조회 없음 |  |
| `contact_search` | 인맥 검색 | aos, ios | 주 화면 조회 |  |
| `support_report` | 사용자 신고 직접 입력 | aos, web | 주 화면 조회 |  |
| `team_list` | 내 팀·팀 초대 목록 | aos, ios | 주 화면 조회 |  |
| `inspiration_comment_list` | 뮤즈 코멘트 목록 | ios | 주 화면 조회 |  |
| `inspiration_detail` | 영감 상세 | aos, ios | 주 화면 조회 |  |
| `portfolio_detail` | 포트폴리오 상세 | aos, ios | 주 화면 조회 | content_type=image/video/audio/pdf/youtube/text; entry_point |
| `respect_select` | 리스펙트 메시지 선택 | aos, ios | 주 화면 조회 | content_type; entry_point |
| `home_creator_list` | 추천 크리에이터 전체보기 | ios | 주 화면 조회 |  |
| `home_discovery` | 디스커버리 홈 | aos, ios | 주 화면 조회 |  |
| `home_inspiration_feed` | 영감 연속 목록 | ios | 주 화면 조회 |  |
| `auth_agreement_update` | 갱신 약관 동의 | aos | 주 화면 조회 |  |
| `auth_email_login` | 이메일 로그인 | aos, ios | 주 화면 조회 |  |
| `auth_email_verification` | 가입·로그인 이메일 인증 | aos, ios | 주 화면 조회 | auth_flow=signup/login/password_reset |
| `auth_entry` | 로그인·가입 시작 | aos, ios | 주 화면 조회 |  |
| `auth_login_2fa` | 로그인 2단계 이메일 인증 | aos, ios | 주 화면 조회 |  |
| `auth_login_password` | 로그인 비밀번호 입력 | aos | 주 화면 조회 |  |
| `auth_password_setup` | 비밀번호 설정·재설정 | aos, ios | 주 화면 조회 | auth_flow=signup/password_reset |
| `auth_permission` | 앱 권한 안내 | aos, ios | 주 화면 조회 |  |
| `auth_privacy_agreement` | 개인정보 이용 동의 | ios | 주 화면 조회 |  |
| `auth_signup_id` | 가입 ID 입력 | aos, ios | 주 화면 조회 |  |
| `auth_signup_keyword` | 가입 대표 키워드 선택 | aos | 주 화면 조회 |  |
| `auth_signup_name` | 가입 이름 입력 | aos, ios | 주 화면 조회 |  |
| `auth_signup_onboarding` | 가입 후 프로필 온보딩 | aos | 주 화면 조회 |  |
| `auth_signup_terms` | 가입 약관 동의 | aos, ios | 주 화면 조회 | auth_provider |
| `auth_tutorial` | 첫 이용 튜토리얼 | aos, ios | 주 화면 조회 |  |
| `gallery_caption` | 갤러리 · 작품 설명 | web | 상태 이벤트 |  |
| `gallery_home` | 갤러리 | aos, web | 주 화면 조회 | entry_point |
| `gallery_intro` | 갤러리 · 인트로·준비 | web | 상태 이벤트 |  |
| `gallery_outro` | 갤러리 · 아웃트로 | web | 상태 이벤트 |  |
| `media_image_edit` | 이미지 편집 | aos, ios | 주 화면 조회 |  |
| `media_image_video_selection` | 이미지·영상 선택 | aos | 주 화면 조회 |  |
| `media_profile_image_edit` | 웹 요청 프로필 이미지 편집 | ios | 주 화면 조회 |  |
| `media_profile_video_edit` | 프로필 배경 동영상 편집 | ios | 주 화면 조회 |  |
| `media_video_crop` | 동영상 자르기 | aos, ios | 주 화면 조회 |  |
| `notification_home` | 내 알림 | aos, ios, web | 주 화면 조회 |  |
| `notification_proposal` | 제안 새 소식 | web | 주 화면 조회 |  |
| `arcade_game` | 아케이드 게임 | aos, ios | 주 화면 조회 | game_type |
| `career_home` | 커리어 프로필·온보딩 | aos, ios | 주 화면 조회 | mode=view/onboarding |
| `profile_inspiration` | 프로필 · 영감 | aos, ios | 주 화면 조회 | profile_owner=self/other |
| `profile_intro` | 프로필 · 소개 | aos, ios, web | 주 화면 조회 | profile_owner=self/other |
| `profile_portfolio` | 프로필 · 포트폴리오 | aos, ios | 주 화면 조회 | profile_owner=self/other |
| `profile_project` | 프로필 · 프로젝트 | aos, ios | 주 화면 조회 | profile_owner=self/other |
| `profile_respect_list` | 웹 프로필 리스펙트 | aos | 주 화면 조회 |  |
| `profile_share_preview` | 프로필 공유 미리보기 | aos, ios | 주 화면 조회 |  |
| `profile_visitor_list` | 오늘 방문자 목록 | aos | 주 화면 조회 |  |
| `career_award_form` | 자격·수상 추가·수정 | aos, ios | 주 화면 조회 |  |
| `career_award_list` | 자격·수상 목록 | aos | 주 화면 조회 |  |
| `career_education_form` | 학력 추가·수정 | aos, ios | 주 화면 조회 |  |
| `career_education_list` | 학력 목록 | aos | 주 화면 조회 |  |
| `career_experience_form` | 경력 추가·수정 | aos, ios | 주 화면 조회 |  |
| `career_language` | 언어 능력 | aos | 주 화면 조회 |  |
| `career_school_search` | 학교·전공 검색 | ios | 주 화면 조회 |  |
| `career_skill` | 스킬 | aos | 주 화면 조회 |  |
| `profile_edit_basic` | 필수 기본 정보 입력 | aos | 주 화면 조회 |  |
| `profile_edit_basic_done` | 필수 정보 입력 완료 | aos | 주 화면 조회 |  |
| `profile_edit_cover` | 프로필 커버 만들기·편집 | aos, ios, web | 주 화면 조회 | mode=create/edit; step |
| `profile_edit_email` | 개인정보 이메일 입력 | aos, ios | 주 화면 조회 |  |
| `profile_edit_email_verify` | 프로필 이메일 인증 | aos, ios | 주 화면 조회 |  |
| `profile_edit_id` | ID 변경 | aos, ios | 주 화면 조회 |  |
| `profile_edit_info_menu` | 프로필 정보 관리 항목 선택 | aos | 주 화면 조회 |  |
| `profile_edit_intro` | 프로필 소개 작성·편집 | aos, ios | 주 화면 조회 | mode=create/edit; step |
| `profile_edit_intro_info` | 자기소개 정보 관리 | aos | 주 화면 조회 |  |
| `profile_edit_keyword_goal` | 추구 방향 키워드 | aos | 주 화면 조회 |  |
| `profile_edit_keyword_signature` | 시그니처 키워드 관리 | aos, ios | 주 화면 조회 |  |
| `profile_edit_keyword_style` | 작업 스타일 키워드 | aos | 주 화면 조회 |  |
| `profile_edit_keyword_work` | 작업 방식 키워드 | aos | 주 화면 조회 |  |
| `profile_edit_link` | 링크 등록·수정 | aos, ios | 주 화면 조회 |  |
| `profile_edit_name_en` | 영문 이름 입력·수정 | aos, ios | 주 화면 조회 |  |
| `profile_edit_name_ko` | 한글 이름 입력·수정 | aos, ios | 주 화면 조회 |  |
| `profile_edit_personal_info` | 개인정보 관리 | aos | 주 화면 조회 |  |
| `profile_edit_phone` | 전화번호 등록 | aos, ios | 주 화면 조회 |  |
| `profile_edit_profession` | 직업 관리 | ios | 주 화면 조회 |  |
| `profile_edit_profession_custom` | 직업 직접 입력 | ios | 주 화면 조회 |  |
| `profile_edit_profession_search` | 직업 검색 | ios | 주 화면 조회 |  |
| `profile_edit_profession_select` | 직업 선택 | aos, ios | 주 화면 조회 |  |
| `profile_edit_recommend` | 추천 정보 설정 | aos | 주 화면 조회 |  |
| `profile_edit_region` | 지역 관리 | aos, ios | 주 화면 조회 |  |
| `profile_edit_region_city` | 국내 시·도 선택 | aos | 주 화면 조회 |  |
| `profile_edit_region_county` | 국내 시·군·구 선택 | aos | 주 화면 조회 |  |
| `profile_edit_region_global` | 해외 도시 입력 | aos, ios | 주 화면 조회 |  |
| `project_detail` | 프로젝트 상세 | aos, ios | 주 화면 조회 |  |
| `project_list` | 프로젝트 목록 | aos, ios | 주 화면 조회 |  |
| `finder_filter` | 검색 필터 | aos | 주 화면 조회 |  |
| `finder_keyword` | 키워드 추천 | aos, ios, web | 주 화면 조회 |  |
| `finder_result` | 검색 결과 | aos | 컨테이너·별도 조회 없음 |  |
| `finder_result_creator` | 검색 결과 · 크리에이터 | aos, ios | 주 화면 조회 |  |
| `finder_result_portfolio` | 검색 결과 · 포트폴리오 | aos, ios | 주 화면 조회 |  |
| `finder_result_project` | 검색 결과 · 프로젝트 | aos, ios | 주 화면 조회 |  |
| `finder_search` | 파인더 검색 | aos, ios | 주 화면 조회 |  |
| `finder_shuffle_result` | 셔플 키워드 묶음 결과 | aos, ios | 주 화면 조회 |  |
| `network_dial` | 인맥 다이얼 | aos, ios, web | 주 화면 조회 | entry_point |
| `network_dial_guide` | 인맥 다이얼 사용 안내 | web | 주 화면 조회 |  |
| `network_dial_path` | 인맥 다이얼 파도타기 | web | 주 화면 조회 | navigation_depth |
| `profile_home` | 프로필 개요 | aos, ios, web | 주 화면 조회 | profile_owner=self/other; view_mode=card/resume; entry_point |
| `activity_bookmark` | 북마크한 콘텐츠 | aos, ios | 컨테이너·별도 조회 없음 |  |
| `activity_bookmark_creator` | 북마크·크리에이터 | aos, ios | 주 화면 조회 |  |
| `activity_bookmark_portfolio` | 북마크·포트폴리오 | aos, ios | 주 화면 조회 |  |
| `activity_comment` | 내 댓글·답글 | aos, ios | 주 화면 조회 |  |
| `activity_home` | 내 활동 콘텐츠 | aos, ios | 주 화면 조회 |  |
| `activity_like` | 좋아요한 영감 | aos, ios | 주 화면 조회 |  |
| `activity_respect` | 리스펙트한 콘텐츠 | aos, ios | 주 화면 조회 |  |
| `settings_2fa` | 2단계 인증 설정 | aos, ios | 주 화면 조회 |  |
| `settings_2fa_complete` | 2단계 인증 완료 | aos, ios | 주 화면 조회 |  |
| `settings_2fa_email` | 2단계 인증 등록 | aos, ios | 주 화면 조회 |  |
| `settings_2fa_verify` | 2단계 인증 이메일 확인 | aos, ios | 주 화면 조회 |  |
| `settings_account` | 계정 관리 | aos, ios | 주 화면 조회 |  |
| `settings_blocked_users` | 차단한 사용자 | aos, ios | 주 화면 조회 |  |
| `settings_email_unsubscribe` | 이메일 마케팅 수신거부 | web | 주 화면 조회 |  |
| `settings_home` | 설정 | aos, ios | 주 화면 조회 |  |
| `settings_notification` | 알림 설정 | aos, ios | 주 화면 조회 |  |
| `settings_password_change` | 비밀번호 변경 | aos, ios | 주 화면 조회 |  |
| `settings_password_reset` | 비밀번호 재설정 | aos, ios | 주 화면 조회 |  |
| `settings_password_verify` | 비밀번호 재설정 이메일 확인 | aos, ios | 주 화면 조회 |  |
| `settings_privacy_agreement` | 개인정보 동의 변경 | ios | 주 화면 조회 |  |
| `settings_visibility` | 공개 범위 설정 | aos, ios | 주 화면 조회 |  |
| `settings_visibility_profile` | 프로필 공개 범위 | aos, ios | 주 화면 조회 |  |
| `settings_withdraw_confirm` | 회원 탈퇴 최종 확인 | aos, ios | 주 화면 조회 |  |
| `settings_withdraw_reason` | 탈퇴 사유 직접 입력 | aos, ios | 주 화면 조회 |  |
| `settings_withdraw_verify` | 회원 탈퇴 본인 확인 | aos, ios | 주 화면 조회 |  |
| `support_agreement_detail` | 약관 상세 | aos, ios | 주 화면 조회 |  |
| `support_agreement_list` | 이용약관 목록 | aos, ios | 주 화면 조회 |  |
| `support_home` | 고객센터 | aos, ios | 주 화면 조회 |  |
| `support_privilege` | 회원 등급별 혜택 | web | 주 화면 조회 | member_grade=guest/member/muse |
| `share_casting` | 공유 캐스팅 상세 | web | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `share_portfolio` | 공유 포트폴리오 상세 | web | 주 화면 조회 |  |
| `share_profile` | 공유 프로필 3.0·미리보기 | web | 주 화면 조회 |  |
| `share_project` | 공유 프로젝트 3.0 | web | 주 화면 조회 |  |
| `system_app_download` | 앱 다운로드 안내 | web | 주 화면 조회 |  |
| `system_club_entry` | 클럽 입장 | aos | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `system_club_lineup` | 클럽 대기·멤버 | aos | 주 화면 조회 / 레거시 진입 확인 필요 |  |
| `system_error` | 화면 불러오기 오류 | web | 주 화면 조회 | error_reason |
| `system_maintenance` | 서비스 점검 안내 | aos, ios, web | 주 화면 조회 |  |
| `system_not_found` | 화면을 찾을 수 없음 | web | 주 화면 조회 | error_reason |
| `team_form` | 팀 만들기·수정 | aos, ios | 주 화면 조회 | mode=create/edit |
| `team_intro` | 팀 · 소개 | aos, ios | 주 화면 조회 |  |
| `team_member_invite` | 팀 멤버 초대 | aos, ios | 주 화면 조회 |  |
| `team_members` | 팀 · 멤버 | aos, ios | 주 화면 조회 |  |
| `team_portfolio` | 팀 · 포트폴리오 | aos, ios | 주 화면 조회 |  |
| `team_profile` | 팀 프로필 | aos, ios | 주 화면 조회 |  |

각 이름의 소스 위치와 이전 이름은 아래 상세 목록에서 확인할 수 있습니다.

### 이미지 자르기 · media_image_crop

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ImageCropScreen` · ImageCropScreen · [ImageCropScreen.kt:37](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/component/media/crop/ImageCropScreen.kt#lines-37)
- ios · `CommonWebViewImageCropModalView` · 로컬 presentation/상위 화면 구성 · [CommonWebView.swift:341](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/WebView/Sources/CommonWebView.swift#lines-341)
- ios · `ImageCropModalView` · 로컬 presentation/상위 화면 구성 · [ImageCropModalView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/ProfileDataEditFlow/Image/ImageCropModalView.swift#lines-14)

### 프로젝트 참여 신청 · project_apply

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ProjectJoinApplicationActivity` · ProjectJoinApplicationActivity · [ProjectJoinApplicationActivity.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/projectjoin/ProjectJoinApplicationActivity.kt#lines-8)

### 콘텐츠 작성 · upload_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ContentUploadActivity` · ContentUploadActivity · [ContentUploadActivity.kt:9](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/ContentUploadActivity.kt#lines-9)
- ios · `ContentUploadOverlayView` · 로컬 presentation/상위 화면 구성 · [ContentUploadOverlayView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Overlay/Core/ContentUploadOverlayView.swift#lines-19)
- aos · `UploadWorkScreen` · UploadWorkScreen · [detekt-baseline.xml:547](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-547) · [detekt-baseline.xml:1842](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1842) · [UploadWorkScreen.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/UploadWorkScreen.kt#lines-12)

### 영감 작성 · upload_inspiration

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `INSPIRATION(` · ContentUploadWorkType.INSPIRATION · [ContentUploadWorkType.kt:7](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/api/ContentUploadWorkType.kt#lines-7) · [WorkType.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/model/WorkType.kt#lines-13)
- ios · `ContentUploadInspirationBodyView` · 로컬 presentation/상위 화면 구성 · [ContentUploadInspirationBodyView.swift:33](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Types/Inspiration/ContentUploadInspirationBodyView.swift#lines-33)

### 포트폴리오 작성 · upload_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PORTFOLIO(` · ContentUploadWorkType.PORTFOLIO · [ContentUploadWorkType.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/api/ContentUploadWorkType.kt#lines-8) · [WorkType.kt:25](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/model/WorkType.kt#lines-25) · [TeamProfileInitialTab.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/api/TeamProfileInitialTab.kt#lines-13)
- ios · `ContentUploadPortfolioPageView` · 로컬 presentation/상위 화면 구성 · [ContentUploadPortfolioPageView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Types/Portfolio/ContentUploadPortfolioPageView.swift#lines-13)

### 프로젝트 작성 · upload_project

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PROJECT(` · ContentUploadWorkType.PROJECT · [Contents.kt:34](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/entity/contents/Contents.kt#lines-34) · [ContentUploadWorkType.kt:9](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/api/ContentUploadWorkType.kt#lines-9) · [WorkType.kt:51](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/model/WorkType.kt#lines-51)
- ios · `ContentUploadProjectPageView` · 로컬 presentation/상위 화면 구성 · [ContentUploadProjectPageView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Types/Project/ContentUploadProjectPageView.swift#lines-13)

### 채티 · chat_home

공통 컨테이너입니다. 선택된 하위 화면만 조회로 기록하며 부모 조회를 중복 추가하지 않습니다.

- ios · `ChattyView` · 로컬 presentation/상위 화면 구성 · [ChattyView.swift:21](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/View/ChattyView.swift#lines-21)

### 채티 · 채팅 목록 · chat_list_direct

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `Chat` · HomeSection.Chat · [ChattyEntryDecision.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/entry/ChattyEntryDecision.kt#lines-8)
- ios · `ChattyChatListView` · 로컬 presentation/상위 화면 구성 · [ChattyChatListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/View/ChattyChatListView.swift#lines-20)

### 채티 · 라운지 목록 · chat_list_lounge

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `Lounge` · HomeSection.Lounge · [ChattyGroupRoomStart.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyGroupRoomStart.kt#lines-13)
- ios · `LoungeListView` · 로컬 presentation/상위 화면 구성 · [LoungeListView.swift:21](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/Lounge/LoungeListView.swift#lines-21)

### 채티 · 프로젝트 목록 · chat_list_project

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `Project` · HomeSection.Project · [ContentUploadGuideResponseDto.kt:33](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/data/data-impl/src/main/kotlin/com/heyratel/cre8orclub/data/impl/contentupload/dto/ContentUploadGuideResponseDto.kt#lines-33) · [ChattyGroupRoomStart.kt:17](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyGroupRoomStart.kt#lines-17) · [ChatRoomListUiModel.kt:67](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/list/ChatRoomListUiModel.kt#lines-67)
- ios · `ProjectRoomListView` · 로컬 presentation/상위 화면 구성 · [ProjectRoomListView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/Project/ProjectRoomListView.swift#lines-19)

### 라운지 만들기·수정 · chat_lounge_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `LoungeCreateScreen` · LoungeCreateScreen · [LoungeCreateScreen.kt:30](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/multiuser/lounge/LoungeCreateScreen.kt#lines-30)
- aos · `LoungeEditScreen` · LoungeEditScreen · [LoungeEditScreen.kt:38](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/multiuser/lounge/LoungeEditScreen.kt#lines-38)
- ios · `LoungeComposeView` · ChattyRoute.loungeCompose · [LoungeComposeView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/LoungeCompose/LoungeComposeView.swift#lines-20)

### 채팅방 · chat_room

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ChatRoomActivity` · ChatRoomActivity · [ChatRoomActivity.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/room/ChatRoomActivity.kt#lines-8)
- aos · `entry<ChattyListNavKey.LoungeRoom>` · ChattyListNavKey.LoungeRoom · [ChattyApp.kt:170](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyApp.kt#lines-170)
- aos · `entry<ChattyListNavKey.ProjectRoom>` · ChattyListNavKey.ProjectRoom · [ChattyApp.kt:189](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyApp.kt#lines-189)
- ios · `ChatRoomView` · ChattyRoute.chatRoom · [ChatRoomView.swift:12](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/Chat/ChatRoomView.swift#lines-12)

### 채팅방 관리 · chat_room_manage

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `DirectRoomMenuScreen` · DirectRoomMenuScreen · [DirectRoomMenuScreen.kt:30](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/room/menu/DirectRoomMenuScreen.kt#lines-30)
- aos · `entry<ChattyListNavKey.LoungeManagement>` · ChattyListNavKey.LoungeManagement · [ChattyApp.kt:205](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyApp.kt#lines-205)
- aos · `entry<ChattyListNavKey.ProjectManagement>` · ChattyListNavKey.ProjectManagement · [ChattyApp.kt:226](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyApp.kt#lines-226)
- ios · `ChatRoomMenuView` · ChattyRoute.chatRoomMenu · [ChatRoomMenuView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/ChatRoomMenu/ChatRoomMenuView.swift#lines-20)

### 대화 제안 입력 · knock_compose

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

이전 AOS ProfileKnockDialogFragment의 이동된 구현입니다. iOS 노크 선택 화면과 단계가 달라 별도 키를 사용합니다.

- aos · `ChattyProfileKnockDialogFragment` · chatty profile knock dialog · [ChattyProfileKnockDialogFragment.kt:31](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/knock/ChattyProfileKnockDialogFragment.kt#lines-31)

### 노크 목적 선택 · knock_select

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

AOS의 자유 입력 대화 제안과 선택 단계가 달라 각각 정의합니다. 구현이 같아진 뒤에만 합칩니다.

- ios · `KnockTypeSelectionView` · KnockActionModifier.fullScreenCover · [KnockTypeSelectionView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/SharedFeature/Capability/SharedMemberAction/Sources/Knock/KnockTypeSelectionView.swift#lines-16)

### 미디어 보기 · media_viewer

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `ChatImagePreviewView` · ChattyRoute.chatImagePreview · [ChatImagePreviewView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/Chat/ImagePreview/ChatImagePreviewView.swift#lines-16)
- aos · `MediaViewerActivity` · MediaViewerActivity · [MediaViewerActivity.kt:24](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/media/viewer/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/mediaviewer/MediaViewerActivity.kt#lines-24)
- aos · `PdfViewerScreen` · PdfViewerScreen · [detekt-baseline.xml:506](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-506) · [detekt-baseline.xml:1741](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1741) · [PdfTypeScreen.kt:63](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/feed/feedList/type/PdfTypeScreen.kt#lines-63)
- ios · `SinglePDFViewerView` · 로컬 presentation/상위 화면 구성 · [SinglePDFViewerView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/PDF/SinglePDFViewerView.swift#lines-15)
- ios · `ImageViewerView` · 로컬 presentation/상위 화면 구성 · [ImageViewerView.swift:53](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/Media/ImageViewerView.swift#lines-53)
- ios · `MediaPlayerView` · 로컬 presentation/상위 화면 구성 · [MediaPlayerView.swift:12](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/Media/MediaPlayerView.swift#lines-12)
- ios · `VideoViewerView` · 로컬 presentation/상위 화면 구성 · [VideoViewerView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/Media/VideoViewerView.swift#lines-13)
- aos · `CastingDetailActivity` · CastingDetailActivity · [CastingDetailActivity.kt:84](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/casting/CastingDetailActivity.kt#lines-84)
- ios · `AVPlayerView` · 로컬 presentation/상위 화면 구성 · [CommonWebView.swift:691](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/WebView/Sources/CommonWebView.swift#lines-691)
- ios · `PDFViewerView` · 로컬 presentation/상위 화면 구성 · [CommonWebView.swift:709](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/WebView/Sources/CommonWebView.swift#lines-709)
- ios · `ContentUploadPortfolioPDFViewerView` · 로컬 presentation/상위 화면 구성 · [ContentUploadPortfolioPDFViewerView.swift:12](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Types/Portfolio/Viewers/ContentUploadPortfolioPDFViewerView.swift#lines-12)
- ios · `ContentUploadPortfolioYoutubeMediaView` · 로컬 presentation/상위 화면 구성 · [ContentUploadPortfolioMediaViews.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Types/Portfolio/Media/ContentUploadPortfolioMediaViews.swift#lines-13)
- ios · `ContentUploadPortfolioVideoViewerView` · 로컬 presentation/상위 화면 구성 · [ContentUploadPortfolioVideoViewerView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Types/Portfolio/Viewers/ContentUploadPortfolioVideoViewerView.swift#lines-13)

### 프로젝트 지원자 목록 · project_applicants

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ProjectApplicantListDestination` · ChattyListNavKey.ProjectApplicants · [ProjectApplicantListDestination.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ProjectApplicantListDestination.kt#lines-12) · [ChattyApp.kt:260](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/ChattyApp.kt#lines-260)
- ios · `ChatRoomApplicantListView` · ChattyRoute.projectApplicants · [ChatRoomApplicantListView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/ChatRoomApplicants/ChatRoomApplicantListView.swift#lines-19)

### 캐스팅 지원자 상세 · casting_applicant_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `CastingApplicationDetailSwipe` · /message-box/casting-application/detail · [App.tsx:33](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-33) · [index.tsx:15](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/casting-applications/detail/index.tsx#lines-15)

### 캐스팅 지원자 목록 · casting_applicant_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `CastingApplicationsPage` · /message-box/casting-applications · [App.tsx:32](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-32) · [index.tsx:72](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/casting-applications/index.tsx#lines-72)

### 캐스팅 지원서 · casting_apply

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `ApplyFormMain` · /casting/apply · [App.tsx:16](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-16) · [ApplyFormMain.tsx:20](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/apply/_components/ApplyFormMain.tsx#lines-20)

### 내 캐스팅 지원 상세 · casting_apply_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `MyCastingApplicationDetailPage` · /message-box/my-casting-application/detail · [App.tsx:35](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-35) · [MyCastingApplicationDetailPage.tsx:14](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/my-casting-application/detail/_components/MyCastingApplicationDetailPage.tsx#lines-14)

### 지원 이메일 입력 · casting_apply_email

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `ApplyEmailStep` · /casting/apply/email · [App.tsx:15](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-15) · [ApplyEmailStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/apply/_components/ApplyEmailStep.tsx#lines-5)

### 지원 전화번호 입력 · casting_apply_phone

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `ApplyPhoneStep` · /casting/apply/phone · [App.tsx:17](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-17) · [ApplyPhoneStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/apply/_components/ApplyPhoneStep.tsx#lines-5)

### 지원 포트폴리오 선택 · casting_apply_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `ApplyPortfolioStep` · /casting/apply/portfolio · [App.tsx:18](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-18) · [ApplyPortfolioStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/apply/_components/ApplyPortfolioStep.tsx#lines-5)

### 캐스팅 상세 · casting_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `CastingDetailPage` · /casting/detail/:id · [App.tsx:19](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-19) · [index.tsx:38](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/detail/index.tsx#lines-38)

### 임시저장 캐스팅 · casting_draft_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `DraftsPage` · /casting/drafts · [App.tsx:20](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-20) · [index.tsx:14](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/drafts/index.tsx#lines-14)

### 캐스팅 작성·수정 · casting_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `FormFunnel` · /casting/form?temporaryCastingId={id} · [index.tsx:25](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/form/index.tsx#lines-25)
- web · `FormFunnel` · /casting/form?id={id} · [index.tsx:25](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/form/index.tsx#lines-25)
- web · `FormPage` · /casting/form · [App.tsx:21](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-21) · [FormPage.tsx:26](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/form/components/FormPage.tsx#lines-26)

### 인박스 캐스팅 탭 · casting_inbox

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `CastingTabContent` · /message-box?lineTabId=CASTING · [CastingTabContent.tsx:17](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/main/_components/CastingTabContent.tsx#lines-17)

### 캐스팅 목록 · casting_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `MainPage` · /casting · [App.tsx:22](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-22) · [index.tsx:22](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/main/index.tsx#lines-22)

### 내 캐스팅 · casting_mine

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `MyCastingsPage` · /casting/my-castings · [App.tsx:23](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-23) · [index.tsx:18](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/my-castings/index.tsx#lines-18)

### 캐스팅 미리보기 · casting_preview

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `PreviewPage` · /casting/form [funnel=미리보기] · [PreviewPage.tsx:27](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/form/components/PreviewPage.tsx#lines-27)

### 캐스팅 검색결과 · casting_result

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `SearchResultPage` · /casting/search-result · [App.tsx:25](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-25) · [index.tsx:19](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/search-result/index.tsx#lines-19)

### 캐스팅 검색 · casting_search

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `SearchPage` · /casting/search · [App.tsx:24](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-24) · [index.tsx:15](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/casting/search/index.tsx#lines-15)

### 제안 상세 · proposal_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalDetailSwipe` · /message-box/proposal/detail · [App.tsx:36](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-36) · [index.tsx:16](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/detail/index.tsx#lines-16)

### 제안 작성·수정 · proposal_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalFormMain` · /message-box/proposal/form?id={id} · [App.tsx:39](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-39) · [ProposalFormMain.tsx:18](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/form/_components/ProposalFormMain.tsx#lines-18)
- web · `ProposalFormMain` · /message-box/proposal/form · [App.tsx:39](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-39) · [ProposalFormMain.tsx:18](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/form/_components/ProposalFormMain.tsx#lines-18)

### 제안 이메일 입력 · proposal_form_email

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalEmailStep` · /message-box/proposal/form/email · [App.tsx:38](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-38) · [ProposalEmailStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/form/_components/ProposalEmailStep.tsx#lines-5)

### 제안 전화번호 입력 · proposal_form_phone

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalPhoneStep` · /message-box/proposal/form/phone · [App.tsx:40](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-40) · [ProposalPhoneStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/form/_components/ProposalPhoneStep.tsx#lines-5)

### 제안 포트폴리오 선택 · proposal_form_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalPortfolioStep` · /message-box/proposal/form/portfolio · [App.tsx:41](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-41) · [ProposalPortfolioStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/form/_components/ProposalPortfolioStep.tsx#lines-5)

### 제안 유형 선택 · proposal_form_type

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalTypeStep` · /message-box/proposal/form/type · [App.tsx:42](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-42) · [ProposalTypeStep.tsx:5](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/proposal/form/_components/ProposalTypeStep.tsx#lines-5)

### 인박스 제안 탭 · proposal_inbox

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `MessageBoxMain` · /message-box · [App.tsx:34](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-34) · [index.tsx:7](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/message-box/main/index.tsx#lines-7)

### 팔로워 목록 · contact_follower

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

이전 초안에서 독립 화면 키가 빠진 실제 연락처 탭을 추가했습니다.

- aos · `ContactPage.FOLLOWER` · ContactActivity selectedPage=FOLLOWER · [ContactScreen.kt:219](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactScreen.kt#lines-219) · [ContactViewModel.kt:778](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactViewModel.kt#lines-778)
- ios · `ContactListType.follower` · ContactView selectedContactListType=follower · [ContactView.swift:96](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Contact/Sources/View/ContactView.swift#lines-96)

### 팔로잉 목록 · contact_following

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

이전 초안에서 독립 화면 키가 빠진 실제 연락처 탭을 추가했습니다.

- aos · `ContactPage.FOLLOWING` · ContactActivity selectedPage=FOLLOWING · [ContactScreen.kt:235](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactScreen.kt#lines-235) · [ContactViewModel.kt:779](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactViewModel.kt#lines-779)
- ios · `ContactListType.following` · ContactView selectedContactListType=following · [ContactView.swift:139](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Contact/Sources/View/ContactView.swift#lines-139)

### 일촌 목록 · contact_first

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ContactPage.FIRST_CONNECTION` · ContactActivity selectedPage=FIRST_CONNECTION · [ContactScreen.kt:203](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactScreen.kt#lines-203) · [ContactViewModel.kt:777](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactViewModel.kt#lines-777)
- ios · `ContactListType.firstConnection` · ContactView selectedContactListType=firstConnection · [ContactView.swift:53](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Contact/Sources/View/ContactView.swift#lines-53)

### 1촌 요청 목록 · contact_first_request

일촌 탭 안의 요청 목록입니다. 별도 화면 조회를 올리지 않고 요청 노출·수락·거절 이벤트로 구분합니다.

FirstConnectUserListView 안에 FirstConnectionRequestsListView와 일촌 목록이 함께 배치된 소스를 확인했습니다.

- ios · `FirstConnectionRequestsListView` · 로컬 presentation/상위 화면 구성 · [FirstConnectionRequestsListView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Contact/Sources/Component/List/FirstConnection/Contact/FirstConnectionRequestsListView.swift#lines-16)

### 인맥 관리 · contact_home

공통 컨테이너입니다. 선택된 하위 화면만 조회로 기록하며 부모 조회를 중복 추가하지 않습니다.

- aos · `ContactActivity` · ContactActivity · [ContactActivity.kt:24](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/ContactActivity.kt#lines-24)
- ios · `ContactView` · ContactRoute.list; ContactRoute.cardExchangeList; ContactRoute.teamList · [ContactView.swift:23](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Contact/Sources/View/ContactView.swift#lines-23)

### 인맥 검색 · contact_search

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ContactSearchActivity` · ContactSearchActivity · [ContactSearchActivity.kt:21](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/search/ContactSearchActivity.kt#lines-21)
- ios · `ContactSearchView` · ContactRoute.search · [ContactSearchView.swift:17](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Contact/Sources/View/ContactSearchView.swift#lines-17)

### 사용자 신고 직접 입력 · support_report

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ContactReportDetailScreen` · ContactReportDetailScreen · [detekt-baseline.xml:1544](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1544) · [detekt-baseline.xml:3868](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-3868) · [ContactReportDetailScreen.kt:147](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/contact/ContactReportDetailScreen.kt#lines-147)
- aos · `GroupChatReportDirectInputScreen` · GroupChatReportDirectInputScreen · [GroupChatReportDirectInput.kt:64](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/chatty/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/chatty/ui/multiuser/management/report/GroupChatReportDirectInput.kt#lines-64)
- aos · `ReportProjectCardDetailScreen` · ReportProjectCardDetailScreen · [ProjectCardDetailActivity.kt:442](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/project/ProjectCardDetailActivity.kt#lines-442)
- web · `ReportPage` · /report · [App.tsx:50](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-50) · [index.tsx:13](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/report/index.tsx#lines-13)

### 내 팀·팀 초대 목록 · team_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

이전 contact_team 초안을 team_list로 변경합니다. 양 플랫폼의 독립 팀 목록과 초대 목록을 같은 화면으로 묶습니다. AOS contacts_team, iOS team_list의 기존 수집값은 이전 이름 대응표로 연결합니다.

- aos · `TeamHomeActivity` · TeamHomeActivityRoute · [TeamHomeActivity.kt:18](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamhome/TeamHomeActivity.kt#lines-18) · [TeamHomeActivityRoute.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/api/TeamHomeActivityRoute.kt#lines-10)
- ios · `TeamListView` · TeamRoute.list · [TeamListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/List/TeamListView.swift#lines-20) · [TeamRouteResolver.swift:18](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Routing/TeamRouteResolver.swift#lines-18)

### 뮤즈 코멘트 목록 · inspiration_comment_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `MuseCommentListView` · HomeRoute.museCommentList · [MuseCommentListView.swift:17](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/MuseComments/MuseCommentListView.swift#lines-17)

### 영감 상세 · inspiration_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InspirationDetailActivity` · InspirationDetailActivity · [InspirationDetailActivity.kt:68](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/feed/inspiration/InspirationDetailActivity.kt#lines-68)
- ios · `InspirationDetailView` · HomeRoute.inspirationDetail · [InspirationDetailView.swift:26](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/Inspiration/InspirationDetailView.swift#lines-26)

### 포트폴리오 상세 · portfolio_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `FeedDetailActivity` · FeedDetailActivity · [FeedDetailActivity.kt:86](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/feed/detail/FeedDetailActivity.kt#lines-86)
- ios · `FeedDetailView` · HomeRoute.feedDetail · [FeedDetailView.swift:141](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/FeedDetail/FeedDetailView.swift#lines-141)

### 리스펙트 메시지 선택 · respect_select

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

전면 메시지 선택 과업으로 분류합니다. 하위 버튼마다 화면 조회를 추가하지 않습니다.

- aos · `C8RespectMessageSheet` · respect message dialog · [C8RespectMessageSheet.kt:69](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/core/designsystem/src/main/kotlin/com/heyratel/cre8orclub/core/designsystem/component/messagepicker/C8RespectMessageSheet.kt#lines-69)
- ios · `DiscoveryRespectPhraseSheetView` · respect phrase overlay · [DiscoveryRespectPhraseSheetView.swift:23](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/Discovery/Feed/Respect/DiscoveryRespectPhraseSheetView.swift#lines-23)

### 추천 크리에이터 전체보기 · home_creator_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `DiscoveryCreatorModuleView` · HomeRoute.discoveryCreatorModule · [DiscoveryCreatorModuleView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/Discovery/CreatorModule/DiscoveryCreatorModuleView.swift#lines-19)

### 디스커버리 홈 · home_discovery

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `DiscoveryV2FeedScreen` · DiscoveryV2FeedScreen · [DiscoveryV2FeedScreen.kt:173](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/home/discovery/feed/DiscoveryV2FeedScreen.kt#lines-173)
- ios · `HomeSectionView` · 로컬 presentation/상위 화면 구성 · [HomeSectionView.swift:29](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/Discovery/Screen/HomeSectionView.swift#lines-29)

### 영감 연속 목록 · home_inspiration_feed

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `InspirationListView` · HomeRoute.inspirationList · [InspirationListView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/Inspiration/InspirationListView.swift#lines-13)

### 갱신 약관 동의 · auth_agreement_update

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PendingAgreementActivity` · PendingAgreementActivity · [PendingAgreementActivity.kt:22](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/agreement/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/agreement/pending/PendingAgreementActivity.kt#lines-22)

### 이메일 로그인 · auth_email_login

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `EmailInputScreen` · EmailInputScreen · [detekt-baseline.xml:53](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-53) · [EmailInputScreen.kt:62](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/login/EmailInputScreen.kt#lines-62)
- ios · `EmailLoginView` · JoinNavigation.emailLogin · [EmailLoginView.swift:18](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/EmailLoginView.swift#lines-18)

### 가입·로그인 이메일 인증 · auth_email_verification

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `EmailVerificationScreen` · EmailVerificationScreen · [detekt-baseline.xml:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-13) · [detekt-baseline.xml:55](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-55) · [EmailVerificationScreen.kt:57](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/login/emailverification/EmailVerificationScreen.kt#lines-57)
- ios · `VerifyEmailView` · JoinNavigation.verifyEmail · [VerifyEmailView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/ResetPasswordView/VerifyEmailView.swift#lines-16) · [VerifyEmailView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/VerifyEmailView.swift#lines-15)
- aos · `VerificationEmailInputScreen` · VerificationEmailInputScreen · [detekt-baseline.xml:66](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-66) · [VerificationEmailInputScreen.kt:53](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/login/emailverification/VerificationEmailInputScreen.kt#lines-53)

### 로그인·가입 시작 · auth_entry

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `LoginMethodSelectionScreen` · LoginMethodSelectionScreen · [detekt-baseline.xml:59](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-59) · [LoginMethodSelectionScreen.kt:30](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/login/LoginMethodSelectionScreen.kt#lines-30)
- ios · `JoinLandingView` · 로컬 presentation/상위 화면 구성 · [JoinLandingView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/Current/JoinLandingView.swift#lines-14)

### 로그인 2단계 이메일 인증 · auth_login_2fa

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TwoFactorLoginActivity` · TwoFactorLoginActivity · [TwoFactorLoginActivity.kt:57](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/join/login/twofactor/TwoFactorLoginActivity.kt#lines-57)
- ios · `TwoFactorAuthEmailLoginView` · 로컬 presentation/상위 화면 구성 · [TwoFactorAuthEmailLoginView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/TwoFactorAuthEmailLogin/TwoFactorAuthEmailLoginView.swift#lines-15)

### 로그인 비밀번호 입력 · auth_login_password

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PasswordInputScreen` · PasswordInputScreen · [detekt-baseline.xml:15](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-15) · [detekt-baseline.xml:60](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-60) · [PasswordInputScreen.kt:68](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/login/password/PasswordInputScreen.kt#lines-68)

### 비밀번호 설정·재설정 · auth_password_setup

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SignUpPasswordInputScreen` · SignUpPasswordInputScreen · [detekt-baseline.xml:17](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-17) · [detekt-baseline.xml:64](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-64) · [SignUpPasswordInputScreen.kt:65](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/signup/SignUpPasswordInputScreen.kt#lines-65)
- ios · `ConfigPasswordView` · JoinNavigation.configurePassword · [ConfigPasswordView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/ConfigPasswordView.swift#lines-15)
- aos · `PasswordResetScreen` · PasswordResetScreen · [detekt-baseline.xml:16](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-16) · [detekt-baseline.xml:61](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-61) · [PasswordResetScreen.kt:60](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/passwordreset/PasswordResetScreen.kt#lines-60)

### 앱 권한 안내 · auth_permission

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PermissionSettingScreen` · PermissionSettingScreen · [PermissionSettingScreen.kt:44](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/permissionsetting/PermissionSettingScreen.kt#lines-44)
- ios · `PermissionView` · 로컬 presentation/상위 화면 구성 · [PermissionView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/App/Cre8orClub/Sources/View/PermissionView.swift#lines-14)

### 개인정보 이용 동의 · auth_privacy_agreement

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `PersonalInfoUsageAgreementView` · 로컬 presentation/상위 화면 구성 · [PersonalInfoUsageAgreementView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/App/Cre8orClub/Sources/View/PersonalInfoUsageAgreementView/PersonalInfoUsageAgreementView.swift#lines-13)

### 가입 ID 입력 · auth_signup_id

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SignUpIdInputScreen` · SignUpIdInputScreen · [detekt-baseline.xml:62](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-62) · [SignUpIdInputScreen.kt:56](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/signup/SignUpIdInputScreen.kt#lines-56)
- ios · `JoinIDView` · JoinNavigation.joinID · [JoinIDView.swift:12](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/Current/JoinIDView.swift#lines-12)

### 가입 대표 키워드 선택 · auth_signup_keyword

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `OnboardingSignatureKeywordScreen` · OnboardingSignatureKeywordScreen · [detekt-baseline.xml:1738](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1738) · [OnboardingSignatureKeywordScreen.kt:71](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/join/signUpOnboarding/OnboardingSignatureKeywordScreen.kt#lines-71)

### 가입 이름 입력 · auth_signup_name

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SignUpNameInputScreen` · SignUpNameInputScreen · [detekt-baseline.xml:63](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/detekt-baseline.xml#lines-63) · [SignUpNameInputScreen.kt:56](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/signup/SignUpNameInputScreen.kt#lines-56)
- ios · `JoinNameView` · JoinNavigation.joinName · [JoinNameView.swift:12](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/Current/JoinNameView.swift#lines-12)

### 가입 후 프로필 온보딩 · auth_signup_onboarding

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SignUpOnboardingActivity` · SignUpOnboardingActivity · [SignUpOnboardingActivity.kt:131](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/join/signUpOnboarding/SignUpOnboardingActivity.kt#lines-131)

### 가입 약관 동의 · auth_signup_terms

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

신규 가입 약관과 기존 회원 갱신 약관은 목적이 달라 별도 이름으로 정의합니다.

- aos · `SignUpTermsOfServiceBottomSheet` · LoginActivity TermsOfServiceBottomSheet · [LoginActivity.kt:493](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/auth/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/auth/login/LoginActivity.kt#lines-493)
- ios · `TermsOfUseBottomSheetView` · 가입 약관 시트 · [TermsOfUseBottomSheetView.swift:74](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/Component/TermsOfUse/TermsOfUseBottomSheetView.swift#lines-74)

### 첫 이용 튜토리얼 · auth_tutorial

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TutorialActivity` · TutorialActivity · [TutorialActivity.kt:14](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/join/tutorial/TutorialActivity.kt#lines-14)
- ios · `TutorialIntroView` · 로컬 presentation/상위 화면 구성 · [TutorialIntroView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/Tutorial/Current/TutorialIntroView.swift#lines-14)
- aos · `TutorialTextScreen` · TutorialTextScreen · [detekt-baseline.xml:1833](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1833) · [TutorialScreen.kt:231](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/join/tutorial/TutorialScreen.kt#lines-231)
- aos · `TutorialWelcomeMessageScreen` · TutorialWelcomeMessageScreen · [detekt-baseline.xml:1834](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1834) · [TutorialScreen.kt:139](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/join/tutorial/TutorialScreen.kt#lines-139)
- ios · `TutorialCompletionView` · 로컬 presentation/상위 화면 구성 · [TutorialCompletionView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/Tutorial/Current/TutorialCompletionView.swift#lines-14)

### 갤러리 · 작품 설명 · gallery_caption

같은 갤러리 안의 단계입니다. gallery_phase=caption 상태 변경 이벤트로 기록하고 화면 방문 수에는 더하지 않습니다.

- web · `GalleryCaption` · /gallery [caption] · [GalleryCaption.tsx:38](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/gallery/_components/GalleryCaption.tsx#lines-38)

### 갤러리 · gallery_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `/gallery` · /gallery · [GalleryWebViewRequest.kt:19](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/home/gallery/web/GalleryWebViewRequest.kt#lines-19)
- web · `GalleryPage` · /gallery · [App.tsx:55](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-55) · [index.tsx:121](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/gallery/index.tsx#lines-121)

### 갤러리 · 인트로·준비 · gallery_intro

같은 갤러리 안의 단계입니다. gallery_phase=intro 상태 변경 이벤트로 기록하고 화면 방문 수에는 더하지 않습니다.

- web · `GalleryCover` · /gallery [cover] · [GalleryCover.tsx:51](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/gallery/_components/GalleryCover.tsx#lines-51)

### 갤러리 · 아웃트로 · gallery_outro

같은 갤러리 안의 단계입니다. gallery_phase=outro 상태 변경 이벤트로 기록하고 화면 방문 수에는 더하지 않습니다.

- web · `GalleryCover` · /gallery [outro] · [GalleryCover.tsx:51](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/gallery/_components/GalleryCover.tsx#lines-51)

### 이미지 편집 · media_image_edit

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `MediaEditorActivity` · MediaEditorActivity · [MediaEditorActivity.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/media/editor/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/mediaeditor/image/MediaEditorActivity.kt#lines-8)
- ios · `ContentUploadImageEditFlowView` · 로컬 presentation/상위 화면 구성 · [ContentUploadImageEditFlowView.swift:90](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ContentUpload/Sources/ContentUpload/Components/ImageEditing/ContentUploadImageEditFlowView.swift#lines-90)

### 이미지·영상 선택 · media_image_video_selection

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ImageVideoSelectionScreen` · ImageVideoSelectionScreen · [ManageInfoComponents.kt:125](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/ManageInfoComponents.kt#lines-125)

### 웹 요청 프로필 이미지 편집 · media_profile_image_edit

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `CommonWebViewProfileImageEditFlowView` · 로컬 presentation/상위 화면 구성 · [CommonWebView.swift:476](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/WebView/Sources/CommonWebView.swift#lines-476)
- ios · `ProfileCardBackgroundImageEditFlowView` · 로컬 presentation/상위 화면 구성 · [ProfileCardBackgroundImageEditFlowView.swift:57](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/ProfileDataEditFlow/Image/ProfileCardBackgroundImageEditFlowView.swift#lines-57)
- ios · `ProfileImageEditFlowView` · 로컬 presentation/상위 화면 구성 · [ProfileImageEditFlowView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/ProfileDataEditFlow/Image/ProfileImageEditFlowView.swift#lines-13)

### 프로필 배경 동영상 편집 · media_profile_video_edit

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `ProfileCardBackgroundVideoEditFlowView` · 로컬 presentation/상위 화면 구성 · [ProfileCardBackgroundVideoEditFlowView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/SharedFeature/Surface/SharedProfileEdit/Sources/ProfileDataEditFlow/Video/ProfileCardBackgroundVideoEditFlowView.swift#lines-19)

### 동영상 자르기 · media_video_crop

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `MediaEditorVideoCropActivity` · MediaEditorVideoCropActivity · [MediaEditorVideoCropActivity.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/media/editor/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/mediaeditor/video/MediaEditorVideoCropActivity.kt#lines-8)
- ios · `ProfileCardBackgroundVideoCropView` · 로컬 presentation/상위 화면 구성 · [ProfileCardBackgroundVideoCropView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/SharedFeature/Surface/SharedProfileEdit/Sources/ProfileDataEditFlow/Video/ProfileCardBackgroundVideoCropView.swift#lines-14)
- aos · `VideoCropActivity` · VideoCropActivity · [VideoCropActivity.kt:110](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/crop/VideoCropActivity.kt#lines-110)

### 내 알림 · notification_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `/my-notification` · /my-notification · [MainActivity.kt:1457](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/main/MainActivity.kt#lines-1457)
- web · `NotificationPage` · /my-notification · [App.tsx:47](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-47) · [index.tsx:86](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/my-notification/notification/index.tsx#lines-86) · [NotificationPage.ts:4](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/e2e/pages/NotificationPage.ts#lines-4)
- ios · `AlarmCenterView` · ChattyRoute.alarmCenter · [AlarmCenterView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/View/AlarmCenterView.swift#lines-20)

### 제안 새 소식 · notification_proposal

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `ProposalNewsPage` · /my-notification/proposal-news · [App.tsx:46](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-46) · [index.tsx:13](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/my-notification/proposal-news/index.tsx#lines-13)

### 아케이드 게임 · arcade_game

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ArcadeGameScreen` · ArcadeGameScreen · [ArcadeGameScreen.kt:55](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/arcade/ui/src/main/kotlin/com/heyratel/cre8orclub/feature/arcade/ui/ArcadeGameScreen.kt#lines-55)
- ios · `CardBreakoutGameView` · HomeFeedCardLongPressOverlayView game · [CardBreakoutGameView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/CardBreakout/Sources/CardBreakoutGameView.swift#lines-16) · [HomeFeedCardLongPressOverlayView.swift:553](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Home/Sources/Discovery/Feed/LongPress/HomeFeedCardLongPressOverlayView.swift#lines-553)

### 커리어 프로필·온보딩 · career_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `ResumeWebView` · 로컬 presentation/상위 화면 구성 · [ResumeWebView.swift:9](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/ResumeWebView.swift#lines-9)
- aos · `UserResumeActivity` · UserResumeActivity · [UserResumeActivity.kt:71](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/UserResumeActivity.kt#lines-71)
- aos · `ResumeExperienceActivity` · ResumeExperienceActivity · [ResumeExperienceActivity.kt:72](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeExperienceActivity.kt#lines-72)
- ios · `ResumeManagementView` · MyRoute.resumeManagement · [ResumeManagementView.swift:9](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Resume/ResumeManagementView.swift#lines-9)

### 프로필 · 영감 · profile_inspiration

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `INSPIRATION` · ProfileResumeTab.INSPIRATION · [detekt-baseline.xml:1398](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1398) · [UploadCompletion.kt:9](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/event/UploadCompletion.kt#lines-9) · [ShareLinkType.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/data/data-api/src/main/kotlin/com/heyratel/cre8orclub/data/sharelink/model/ShareLinkType.kt#lines-10)
- aos · `INSPIRATION` · MemberProfileResumeTab.INSPIRATION · [detekt-baseline.xml:1398](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1398) · [UploadCompletion.kt:9](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/event/UploadCompletion.kt#lines-9) · [ShareLinkType.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/data/data-api/src/main/kotlin/com/heyratel/cre8orclub/data/sharelink/model/ShareLinkType.kt#lines-10)
- ios · `ProfileListInspirationGridView` · 로컬 presentation/상위 화면 구성 · [ProfileListInspirationGridView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/ProfileList/Grid/Inspiration/ProfileListInspirationGridView.swift#lines-15)

### 프로필 · 소개 · profile_intro

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `INTRO` · ProfileResumeTab.INTRO · [MemberResumeContent.kt:118](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/member/MemberResumeContent.kt#lines-118) · [MyPageResumeContent.kt:117](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/MyPageResumeContent.kt#lines-117) · [ProfileResumeTab.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/ProfileResumeTab.kt#lines-13)
- ios · `ProfileListView` · 로컬 presentation/상위 화면 구성 · [ProfileListView.swift:22](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/ProfileList/ProfileListView.swift#lines-22)
- web · `ProfileIntroPage` · /profile/intro · [App.tsx:64](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-64) · [index.tsx:12](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/profile-v3/intro/index.tsx#lines-12)
- web · `MemberProfileIntroPage` · /profile/intro/:uid · [App.tsx:65](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-65) · [index.tsx:12](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/profile-v3/intro/member/index.tsx#lines-12)

### 프로필 · 포트폴리오 · profile_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PORTFOLIO` · ProfileResumeTab.PORTFOLIO · [detekt-baseline.xml:1399](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1399) · [UploadCompletion.kt:7](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/event/UploadCompletion.kt#lines-7) · [ShareLinkType.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/data/data-api/src/main/kotlin/com/heyratel/cre8orclub/data/sharelink/model/ShareLinkType.kt#lines-8)
- aos · `PORTFOLIO` · MemberProfileResumeTab.PORTFOLIO · [detekt-baseline.xml:1399](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1399) · [UploadCompletion.kt:7](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/event/UploadCompletion.kt#lines-7) · [ShareLinkType.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/data/data-api/src/main/kotlin/com/heyratel/cre8orclub/data/sharelink/model/ShareLinkType.kt#lines-8)
- ios · `ProfileListPortfolioGridView` · 로컬 presentation/상위 화면 구성 · [ProfileListPortfolioGridView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/ProfileList/Grid/Portfolio/ProfileListPortfolioGridView.swift#lines-15)

### 프로필 · 프로젝트 · profile_project

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PROJECT` · ProfileResumeTab.PROJECT · [detekt-baseline.xml:29](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-29) · [UploadCompletion.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/event/UploadCompletion.kt#lines-8) · [Contents.kt:34](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/entity/contents/Contents.kt#lines-34)
- aos · `PROJECT` · MemberProfileResumeTab.PROJECT · [detekt-baseline.xml:29](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-29) · [UploadCompletion.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/event/UploadCompletion.kt#lines-8) · [Contents.kt:34](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/entity/contents/Contents.kt#lines-34)
- ios · `ProfileListProjectGridView` · 로컬 presentation/상위 화면 구성 · [ProfileListProjectGridView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/ProfileList/Grid/Project/ProfileListProjectGridView.swift#lines-15)

### 웹 프로필 리스펙트 · profile_respect_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `WebViewRespectScreen` · WebViewRespectScreen · [detekt-baseline.xml:1714](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1714) · [WebViewRespectScreen.kt:17](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/WebViewRespectScreen.kt#lines-17)

### 프로필 공유 미리보기 · profile_share_preview

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `MyResumePreview` · MyRoute.resumePreview · [MyResumePreview.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/MyResumePreview.swift#lines-13)
- aos · `MyWebPreViewActivity` · MyWebPreViewActivity · [MyWebPreViewActivity.kt:33](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/MyWebPreViewActivity.kt#lines-33)

### 오늘 방문자 목록 · profile_visitor_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TodayVisitorListScreen` · TodayVisitorListScreen · [detekt-baseline.xml:1832](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1832) · [TodayVisitorListScreen.kt:18](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/TodayVisitorListScreen.kt#lines-18)

### 자격·수상 추가·수정 · career_award_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ModifyResumeCertificationsScreen` · ModifyResumeCertificationsScreen · [detekt-baseline.xml:534](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-534) · [detekt-baseline.xml:1805](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1805) · [ResumeCertificationsActivity.kt:329](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeCertificationsActivity.kt#lines-329)
- ios · `AwardsRegisterView` · 로컬 presentation/상위 화면 구성 · [AwardsRegisterView.swift:6](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Resume/Registers/AwardsRegisterView.swift#lines-6)

### 자격·수상 목록 · career_award_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ResumeCertificationsActivity` · ResumeCertificationsActivity · [ResumeCertificationsActivity.kt:75](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeCertificationsActivity.kt#lines-75)

### 학력 추가·수정 · career_education_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ModifyResumeEducationScreen` · ModifyResumeEducationScreen · [detekt-baseline.xml:535](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-535) · [detekt-baseline.xml:1808](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1808) · [ResumeEducationActivity.kt:514](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeEducationActivity.kt#lines-514)
- ios · `ResumeEducationRegisterView` · 로컬 presentation/상위 화면 구성 · [ResumeEducationRegisterView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Resume/Registers/Educations/ResumeEducationRegisterView.swift#lines-13)

### 학력 목록 · career_education_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ResumeEducationActivity` · ResumeEducationActivity · [ResumeEducationActivity.kt:79](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeEducationActivity.kt#lines-79)

### 경력 추가·수정 · career_experience_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ModifyResumeCareerScreen` · ModifyResumeCareerScreen · [detekt-baseline.xml:537](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-537) · [detekt-baseline.xml:1811](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1811) · [ResumeExperienceActivity.kt:415](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeExperienceActivity.kt#lines-415)
- ios · `ResumeCareerRegisterView` · 로컬 presentation/상위 화면 구성 · [ResumeCareerRegisterView.swift:6](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Resume/Registers/ResumeCareerRegisterView.swift#lines-6)

### 언어 능력 · career_language

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ResumeLanguageActivity` · ResumeLanguageActivity · [ResumeLanguageActivity.kt:54](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeLanguageActivity.kt#lines-54)

### 학교·전공 검색 · career_school_search

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `SchoolOrMajorSearcherView` · 로컬 presentation/상위 화면 구성 · [SchoolOrMajorSearcherView.swift:10](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Resume/Registers/Educations/SchoolOrMajorSearcherView.swift#lines-10)

### 스킬 · career_skill

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ResumeSkillActivity` · ResumeSkillActivity · [ResumeSkillActivity.kt:53](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/resume/ResumeSkillActivity.kt#lines-53)

### 필수 기본 정보 입력 · profile_edit_basic

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `RequiredBasicInfoActivity` · RequiredBasicInfoActivity · [RequiredBasicInfoActivity.kt:99](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/RequiredBasicInfoActivity.kt#lines-99)

### 필수 정보 입력 완료 · profile_edit_basic_done

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `CardInfoCompleteActivity` · CardInfoCompleteActivity · [CardInfoCompleteActivity.kt:59](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/CardInfoCompleteActivity.kt#lines-59)

### 프로필 커버 만들기·편집 · profile_edit_cover

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ConfigureProfileCoverActivity` · ConfigureProfileCoverActivity · [ConfigureProfileCoverActivity.kt:11](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/ConfigureProfileCoverActivity.kt#lines-11)
- aos · `PROFESSION(` · ConfigureProfileCoverStep.PROFESSION · [ConfigureProfileCoverStep.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/api/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/api/configureprofilecover/ConfigureProfileCoverStep.kt#lines-12) · [ConfigureProfileCoverBlockType.kt:9](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/model/ConfigureProfileCoverBlockType.kt#lines-9)
- aos · `NICKNAME(` · ConfigureProfileCoverStep.NICKNAME · [ConfigureProfileCoverStep.kt:16](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/api/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/api/configureprofilecover/ConfigureProfileCoverStep.kt#lines-16) · [ConfigureProfileCoverBlockType.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/model/ConfigureProfileCoverBlockType.kt#lines-13)
- aos · `KO_NAME(` · ConfigureProfileCoverStep.KO_NAME · [ConfigureProfileCoverStep.kt:22](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/api/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/api/configureprofilecover/ConfigureProfileCoverStep.kt#lines-22) · [ConfigureProfileCoverBlockType.kt:17](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/model/ConfigureProfileCoverBlockType.kt#lines-17) · [RequiredBasicInfoActivity.kt:83](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/RequiredBasicInfoActivity.kt#lines-83)
- aos · `TAGLINE(` · ConfigureProfileCoverStep.TAGLINE · [ConfigureProfileCoverStep.kt:27](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/api/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/api/configureprofilecover/ConfigureProfileCoverStep.kt#lines-27) · [ConfigureProfileCoverBlockType.kt:21](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/model/ConfigureProfileCoverBlockType.kt#lines-21)
- aos · `MEDIA(` · ConfigureProfileCoverStep.MEDIA · [ConfigureProfileCoverStep.kt:33](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/api/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/api/configureprofilecover/ConfigureProfileCoverStep.kt#lines-33) · [ConfigureProfileCoverBlockType.kt:25](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/model/ConfigureProfileCoverBlockType.kt#lines-25)
- aos · `PROFILE_IMAGE(` · ConfigureProfileCoverStep.PROFILE_IMAGE · [ConfigureProfileCoverStep.kt:37](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/api/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/api/configureprofilecover/ConfigureProfileCoverStep.kt#lines-37) · [ConfigureProfileCoverBlockType.kt:29](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/configureprofilecover/model/ConfigureProfileCoverBlockType.kt#lines-29)
- ios · `ConfigureProfileCoverView` · 로컬 presentation/상위 화면 구성 · [ConfigureProfileCoverView.swift:12](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ConfigureProfile/Sources/Cover/Entry/ConfigureProfileCoverView.swift#lines-12)
- web · `OnboardingIntroPage` · /onboarding/intro · [App.tsx:60](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-60) · [index.tsx:29](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/onboarding/intro/index.tsx#lines-29)
- web · `OnboardingIntroPage` · /onboarding/intro?mode=edit · [App.tsx:60](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-60) · [index.tsx:29](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/onboarding/intro/index.tsx#lines-29)

### 개인정보 이메일 입력 · profile_edit_email

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputEmailFragment` · InputEmailFragment · [InputEmailFragment.kt:15](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/email/InputEmailFragment.kt#lines-15)
- ios · `RegisterEmailView` · 로컬 presentation/상위 화면 구성 · [RegisterEmailView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/RegisterEmailView.swift#lines-16)

### 프로필 이메일 인증 · profile_edit_email_verify

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputEmailVerificationFragment` · InputEmailVerificationFragment · [InputEmailVerificationFragment.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/email/InputEmailVerificationFragment.kt#lines-13)
- ios · `EmailRegistrationVerifyEmailView` · 로컬 presentation/상위 화면 구성 · [EmailRegistrationVerifyEmailView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/EmailVerify/EmailRegistrationVerifyEmailView.swift#lines-16)

### ID 변경 · profile_edit_id

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `IdModifyActivity` · IdModifyActivity · [IdModifyActivity.kt:11](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/onboarding/id/IdModifyActivity.kt#lines-11)
- ios · `IDView` · 로컬 presentation/상위 화면 구성 · [IDView.swift:9](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/IDView.swift#lines-9)

### 프로필 정보 관리 항목 선택 · profile_edit_info_menu

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ManageInfoSelectionScreen` · ManageInfoSelectionScreen · [ManageInfoComponents.kt:63](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/ManageInfoComponents.kt#lines-63)

### 프로필 소개 작성·편집 · profile_edit_intro

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

제거된 SelfIntroduceRegisterView를 제외하고 남아 있는 ProfileExpressionView/Activity를 기준으로 삼습니다.

- aos · `ProfileExpressionActivity` · ProfileExpressionActivity · [ProfileExpressionActivity.kt:11](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/profileexpression/ProfileExpressionActivity.kt#lines-11)
- aos · `KEYWORD_PERSONA(` · ProfileExpressionStep.KEYWORD_PERSONA · [ProfileExpressionStep.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/profileexpression/model/ProfileExpressionStep.kt#lines-12)
- aos · `KEYWORD_WORKING_PREFERENCE(` · ProfileExpressionStep.KEYWORD_WORKING_PREFERENCE · [ProfileExpressionStep.kt:19](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/profileexpression/model/ProfileExpressionStep.kt#lines-19)
- aos · `KEYWORD_AMBITION(` · ProfileExpressionStep.KEYWORD_AMBITION · [ProfileExpressionStep.kt:26](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/profileexpression/model/ProfileExpressionStep.kt#lines-26)
- aos · `IMAGES(` · ProfileExpressionStep.IMAGES · [ProfileExpressionStep.kt:33](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/profileexpression/model/ProfileExpressionStep.kt#lines-33)
- aos · `DESCRIPTION(` · ProfileExpressionStep.DESCRIPTION · [ProfileExpressionStep.kt:39](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/profile-experience/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/profileexperience/profileexpression/model/ProfileExpressionStep.kt#lines-39)
- ios · `ProfileExpressionView` · 로컬 presentation/상위 화면 구성 · [ProfileExpressionView.swift:75](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/ConfigureProfile/Sources/ProfileExpression/ProfileExpressionView.swift#lines-75)

### 자기소개 정보 관리 · profile_edit_intro_info

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SelfDescriptionInfoActivity` · SelfDescriptionInfoActivity · [SelfDescriptionInfoActivity.kt:44](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/SelfDescriptionInfoActivity.kt#lines-44)

### 추구 방향 키워드 · profile_edit_keyword_goal

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `AmbitionKeywordActivity` · AmbitionKeywordActivity · [AmbitionKeywordActivity.kt:46](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/AmbitionKeywordActivity.kt#lines-46)

### 시그니처 키워드 관리 · profile_edit_keyword_signature

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SignatureKeywordListActivity` · SignatureKeywordListActivity · [SignatureKeywordListActivity.kt:40](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/SignatureKeywordListActivity.kt#lines-40)
- ios · `SignatureKeywordListView` · 로컬 presentation/상위 화면 구성 · [SignatureKeywordListView.swift:6](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/BottomSheet/SignatureKeyword/SignatureKeywordListView.swift#lines-6)
- ios · `OneMinuteKeywordPickerView` · 로컬 presentation/상위 화면 구성 · [OneMinuteKeywordPickerView.swift:8](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/SignatureKeywords/OneMinuteKeywordPickerView.swift#lines-8)

### 작업 스타일 키워드 · profile_edit_keyword_style

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PersonaKeywordActivity` · PersonaKeywordActivity · [PersonaKeywordActivity.kt:49](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/PersonaKeywordActivity.kt#lines-49)

### 작업 방식 키워드 · profile_edit_keyword_work

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `WorkingPreferenceKeywordActivity` · WorkingPreferenceKeywordActivity · [WorkingPreferenceKeywordActivity.kt:45](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/WorkingPreferenceKeywordActivity.kt#lines-45)

### 링크 등록·수정 · profile_edit_link

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `LinkModifyActivity` · LinkModifyActivity · [LinkModifyActivity.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/onboarding/link/LinkModifyActivity.kt#lines-12)
- ios · `LinkView` · 로컬 presentation/상위 화면 구성 · [LinkView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/LinkView/LinkView.swift#lines-15)

### 영문 이름 입력·수정 · profile_edit_name_en

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputEnNameActivity` · InputEnNameActivity · [InputEnNameActivity.kt:65](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/name/InputEnNameActivity.kt#lines-65)
- ios · `EnNameView` · 로컬 presentation/상위 화면 구성 · [EnNameView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/EnNameView.swift#lines-15)

### 한글 이름 입력·수정 · profile_edit_name_ko

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputKoNameActivity` · InputKoNameActivity · [InputKoNameActivity.kt:62](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/name/InputKoNameActivity.kt#lines-62)
- ios · `KoNameView` · 로컬 presentation/상위 화면 구성 · [KoNameView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/KoNameView.swift#lines-15)

### 개인정보 관리 · profile_edit_personal_info

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PersonalInfoActivity` · PersonalInfoActivity · [PersonalInfoActivity.kt:69](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/PersonalInfoActivity.kt#lines-69)

### 전화번호 등록 · profile_edit_phone

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputPhoneNumberActivity` · InputPhoneNumberActivity · [InputPhoneNumberActivity.kt:16](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/phone/InputPhoneNumberActivity.kt#lines-16)
- ios · `PhoneView` · 로컬 presentation/상위 화면 구성 · [PhoneView.swift:10](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/PhoneView.swift#lines-10)

### 직업 관리 · profile_edit_profession

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `ProfessionListView` · 로컬 presentation/상위 화면 구성 · [ProfessionListView.swift:7](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/BottomSheet/ProfessionListView/old/ProfessionListView.swift#lines-7)

### 직업 직접 입력 · profile_edit_profession_custom

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `DirectProfessionRegisterView` · 로컬 presentation/상위 화면 구성 · [DirectProfessionRegisterView.swift:7](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/Professions/DirectProfessionRegisterView.swift#lines-7)

### 직업 검색 · profile_edit_profession_search

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `ProfessionSearchListView` · 로컬 presentation/상위 화면 구성 · [ProfessionSearchListView.swift:9](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/Professions/ProfessionSearchListView.swift#lines-9)

### 직업 선택 · profile_edit_profession_select

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `NewProfessionListActivity` · NewProfessionListActivity · [NewProfessionListActivity.kt:60](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/onboarding/profession/NewProfessionListActivity.kt#lines-60)
- ios · `ProfessionSelectionListView` · 로컬 presentation/상위 화면 구성 · [ProfessionSelectionListView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/BottomSheet/ProfessionListView/new/ProfessionSelectionListView.swift#lines-14)

### 추천 정보 설정 · profile_edit_recommend

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `RecommendationInfoActivity` · RecommendationInfoActivity · [RecommendationInfoActivity.kt:86](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/RecommendationInfoActivity.kt#lines-86)

### 지역 관리 · profile_edit_region

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `RegionListActivity` · RegionListActivity · [RegionListActivity.kt:15](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/region/RegionListActivity.kt#lines-15)
- ios · `RegionListView` · 로컬 presentation/상위 화면 구성 · [RegionListView.swift:10](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/Components/Registers/Regions/RegionListView.swift#lines-10)

### 국내 시·도 선택 · profile_edit_region_city

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputLocalCityScreen` · InputLocalCityScreen · [InputLocalCityScreen.kt:37](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/region/InputLocalCityScreen.kt#lines-37)

### 국내 시·군·구 선택 · profile_edit_region_county

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputLocalCountyScreen` · InputLocalCountyScreen · [InputLocalCountyScreen.kt:38](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/region/InputLocalCountyScreen.kt#lines-38)

### 해외 도시 입력 · profile_edit_region_global

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `InputGlobalRegionActivity` · InputGlobalRegionActivity · [InputGlobalRegionActivity.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/personalInfo/region/InputGlobalRegionActivity.kt#lines-13)
- ios · `GlobalCityInputView` · 로컬 presentation/상위 화면 구성 · [GlobalCityInputView.swift:27](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/RegionBottomSheet/GlobalCityInputView.swift#lines-27)

### 프로젝트 상세 · project_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ProjectCardDetailActivity` · ProjectCardDetailActivity · [ProjectCardDetailActivity.kt:90](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/project/ProjectCardDetailActivity.kt#lines-90)
- ios · `ProjectCardDetailView` · MyRoute.projectCardDetail; MyRoute.projectCardFeedDetail · [ProjectCardDetailView.swift:28](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/ProjectCardDetail/ProjectCardDetailView.swift#lines-28)

### 프로젝트 목록 · project_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ProjectListActivity` · ProjectListActivity · [ProjectListActivity.kt:41](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/home/projectlist/ProjectListActivity.kt#lines-41)
- ios · `ProjectCardListView` · MyRoute.projectCardList · [ProjectCardListView.swift:11](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/ProjectCards/ProjectCardListView.swift#lines-11)

### 검색 필터 · finder_filter

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `FinderFilterActivity` · FinderFilterActivity · [FinderFilterActivity.kt:21](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/home/finder/filter/FinderFilterActivity.kt#lines-21)

### 키워드 추천 · finder_keyword

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `/discovery/keywords` · /discovery/keywords · [DiscoveryRecommendDestination.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/discovery-recommend/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/discoveryrecommend/DiscoveryRecommendDestination.kt#lines-12)
- ios · `KeywordRecommendationView` · FinderRoute.keywordRecommendation · [KeywordRecommendationView.swift:18](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/KeywordRecommendationView.swift#lines-18)
- web · `KeywordsDiscoveryPage` · /discovery/keywords · [App.tsx:26](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-26) · [index.tsx:22](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/discovery/keywords/index.tsx#lines-22)

### 검색 결과 · finder_result

공통 컨테이너입니다. 선택된 하위 화면만 조회로 기록하며 부모 조회를 중복 추가하지 않습니다.

- aos · `FinderResultScreen` · FinderResultScreen · [FinderResultScreen.kt:115](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/home/finder/component/FinderResultScreen.kt#lines-115)

### 검색 결과 · 크리에이터 · finder_result_creator

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `CREATOR(` · SearchResultTab.CREATOR · [Contents.kt:64](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/entity/contents/Contents.kt#lines-64) · [SearchTab.kt:7](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/api/src/main/kotlin/com/heyratel/cre8orclub/feature/home/finder/api/SearchTab.kt#lines-7) · [FinderResultUiModel.kt:21](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/home/finder/model/FinderResultUiModel.kt#lines-21)
- ios · `SearchedCreatorListView` · 로컬 presentation/상위 화면 구성 · [SearchedCreatorListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/FinderSearchViews/SearchedCreatorListView.swift#lines-20)

### 검색 결과 · 포트폴리오 · finder_result_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PORTFOLIO(` · SearchResultTab.PORTFOLIO · [ContentUploadWorkType.kt:8](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/api/ContentUploadWorkType.kt#lines-8) · [WorkType.kt:25](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/model/WorkType.kt#lines-25) · [TeamProfileInitialTab.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/api/TeamProfileInitialTab.kt#lines-13)
- ios · `SearchedPortfolioListView` · 로컬 presentation/상위 화면 구성 · [SearchedPortfolioListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/FinderSearchViews/Portfolio/SearchedPortfolioListView.swift#lines-20)

### 검색 결과 · 프로젝트 · finder_result_project

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `PROJECT(` · SearchResultTab.PROJECT · [Contents.kt:34](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/domain/src/main/kotlin/com/heyratel/cre8orclub/domain/entity/contents/Contents.kt#lines-34) · [ContentUploadWorkType.kt:9](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/api/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/api/ContentUploadWorkType.kt#lines-9) · [WorkType.kt:51](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/profile-content/content-upload/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contentupload/uploadwork/model/WorkType.kt#lines-51)
- ios · `SearchedProjectListView` · 로컬 presentation/상위 화면 구성 · [SearchedProjectListView.swift:18](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/FinderSearchViews/Project/SearchedProjectListView.swift#lines-18)

### 파인더 검색 · finder_search

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `FinderScreen` · FinderScreen · [detekt-baseline.xml:1570](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1570) · [FinderScreen.kt:42](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/home/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/home/finder/screen/FinderScreen.kt#lines-42)
- aos · `FinderSearchActivity` · FinderSearchActivity · [FinderSearchActivity.kt:131](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/finder/FinderSearchActivity.kt#lines-131)
- ios · `FinderSearchView` · FinderRoute.search · [FinderSearchView.swift:17](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/FinderSearchViews/FinderSearchView.swift#lines-17)

### 셔플 키워드 묶음 결과 · finder_shuffle_result

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ShuffleBundleActivity` · ShuffleBundleActivity · [ShuffleBundleActivity.kt:44](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/shuffle/ShuffleBundleActivity.kt#lines-44)
- ios · `KeywordBundleView` · FinderRoute.keywordBundle · [KeywordBundleView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/KeywordBundle/KeywordBundleView.swift#lines-20)

### 인맥 다이얼 · network_dial

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `/discovery/network` · /discovery/network · [DiscoveryRecommendDestination.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/discovery-recommend/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/discoveryrecommend/DiscoveryRecommendDestination.kt#lines-13)
- ios · `NetworkBrowseView` · ChattyRoute.networkBrowse · [NetworkBrowseView.swift:22](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Chatty/Sources/NetworkBrowse/NetworkBrowseView.swift#lines-22)
- web · `DiscoveryNetworkPage` · /discovery/network/:uid? · [App.tsx:59](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-59) · [DiscoveryNetworkPage.tsx:49](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/discovery/network/DiscoveryNetworkPage.tsx#lines-49)

### 인맥 다이얼 사용 안내 · network_dial_guide

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `DialShowcasePage` · /discovery/network/:uid? · [DialShowcasePage.tsx:49](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/discovery/network/DialShowcasePage.tsx#lines-49)

### 인맥 다이얼 파도타기 · network_dial_path

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `NetworkDialRoute` · /discovery/network/:uid · [index.tsx:74](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/discovery/network/index.tsx#lines-74)

### 프로필 개요 · profile_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `SearchedCreatorDetailView` · FinderRoute.searchedCreatorDetails · [SearchedCreatorDetailView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Finder/Sources/View/FinderSearchViews/SearchedCreatorDetail/SearchedCreatorDetailView.swift#lines-14)
- aos · `MemberDetailActivity` · MemberDetailActivity · [MemberDetailActivity.kt:93](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/member/MemberDetailActivity.kt#lines-93)
- aos · `MyPageScreen` · MyPageScreen · [detekt-baseline.xml:1708](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/detekt-baseline.xml#lines-1708) · [MyPageScreen.kt:171](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/MyPageScreen.kt#lines-171)
- ios · `ProfileDetailView` · MyRoute.profile · [ProfileDetailView.swift:166](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/My/Sources/CommonMy/ProfileDetailView.swift#lines-166)
- web · `ProfileRoute` · /profile · [App.tsx:68](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-68)
- web · `MemberProfileRoute` · /profile/:uid · [App.tsx:71](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-71)

### 북마크한 콘텐츠 · activity_bookmark

공통 컨테이너입니다. 선택된 하위 화면만 조회로 기록하며 부모 조회를 중복 추가하지 않습니다.

- aos · `BookmarkActivity` · BookmarkActivity · [BookmarkActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/bookmark/BookmarkActivity.kt#lines-10)
- ios · `BookMarkView` · SettingRoute.bookmark · [BookMarkView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/BookMark/BookMarkView.swift#lines-20)

### 북마크·크리에이터 · activity_bookmark_creator

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `BookmarkCreatorView` · 로컬 presentation/상위 화면 구성 · [BookmarkCreatorView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/BookMark/Creator/BookmarkCreatorView.swift#lines-20)
- aos · `BookmarkTab.CREATOR` · BookmarkActivity tab=CREATOR · [BookmarkViewModel.kt:344](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/bookmark/BookmarkViewModel.kt#lines-344)

### 북마크·포트폴리오 · activity_bookmark_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `BookMarkPortfolioView` · 로컬 presentation/상위 화면 구성 · [BookMarkPortfolioView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/BookMark/Portfolio/BookMarkPortfolioView.swift#lines-20)
- aos · `BookmarkTab.PORTFOLIO` · BookmarkActivity tab=PORTFOLIO · [BookmarkViewModel.kt:345](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/bookmark/BookmarkViewModel.kt#lines-345)

### 내 댓글·답글 · activity_comment

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `MyCommentsAndRepliesListView` · SettingRoute.contentsComments · [MyCommentsAndRepliesListView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/Contents/Comments/MyCommentsAndRepliesListView.swift#lines-16)
- ios · `ContentsCommentsListView` · 로컬 presentation/상위 화면 구성 · [ContentsCommentsListView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/Contents/Comments/ContentsCommentsListView.swift#lines-15)
- aos · `CommentListActivity` · CommentListActivity · [CommentListActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/comment/CommentListActivity.kt#lines-10)

### 내 활동 콘텐츠 · activity_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ContentsActivity` · ContentsActivity · [ContentsActivity.kt:14](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/ContentsActivity.kt#lines-14)
- ios · `ContentsListView` · SettingRoute.contentsList · [ContentsListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/Contents/ContentsListView.swift#lines-20)

### 좋아요한 영감 · activity_like

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `LikedInspirationsView` · 로컬 presentation/상위 화면 구성 · [LikedInspirationsView.swift:22](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/Contents/Liked/Inspiration/LikedInspirationsView.swift#lines-22)
- aos · `LikeListActivity` · LikeListActivity · [LikeListActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/like/LikeListActivity.kt#lines-10)
- ios · `LikedListView` · SettingRoute.contentsLiked · [LikedListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/Contents/Liked/LikedListView.swift#lines-20)

### 리스펙트한 콘텐츠 · activity_respect

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `RespectListActivity` · RespectListActivity · [RespectListActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/contents/respect/RespectListActivity.kt#lines-10)
- ios · `RespectedPortfoliosView` · SettingRoute.contentsRespected · [RespectedPortfoliosView.swift:22](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/Contents/RespectedPortfolios/RespectedPortfoliosView.swift#lines-22)

### 2단계 인증 설정 · settings_2fa

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TwoFactorAuthenticationSettingActivity` · TwoFactorAuthenticationSettingActivity · [TwoFactorAuthenticationSettingActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/twoFactor/TwoFactorAuthenticationSettingActivity.kt#lines-10)
- ios · `TwoFactorUnAuthView` · SettingRoute.account2FA · [TwoFactorUnAuthView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/2FA/TwoFactorUnAuthView.swift#lines-20)

### 2단계 인증 완료 · settings_2fa_complete

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TwoFactorAuthenticationCompleteActivity` · TwoFactorAuthenticationCompleteActivity · [TwoFactorAuthenticationCompleteActivity.kt:38](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/twoFactor/TwoFactorAuthenticationCompleteActivity.kt#lines-38)
- ios · `TwoFactorCompleteView` · SettingRoute.account2FACompleted · [TwoFactorCompleteView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/2FA/TwoFactorCompleteView.swift#lines-15)

### 2단계 인증 등록 · settings_2fa_email

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TwoFactorAuthenticationActivity` · TwoFactorAuthenticationActivity · [TwoFactorAuthenticationActivity.kt:51](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/twoFactor/TwoFactorAuthenticationActivity.kt#lines-51)
- ios · `TwoFactorEmailManageView` · SettingRoute.account2FAEmail · [TwoFactorEmailManageView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/2FA/TwoFactorEmailManageView.swift#lines-16)

### 2단계 인증 이메일 확인 · settings_2fa_verify

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TwoFactorEmailValidateActivity` · TwoFactorEmailValidateActivity · [TwoFactorEmailValidateActivity.kt:64](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/twoFactor/TwoFactorEmailValidateActivity.kt#lines-64)
- ios · `TwoFactorAuthEmailVerifyView` · 로컬 presentation/상위 화면 구성 · [TwoFactorAuthEmailVerifyView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/2FA/TwoFactorAuthEmailVerifyView.swift#lines-15)

### 계정 관리 · settings_account

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `AccountActivity` · AccountActivity · [AccountActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/AccountActivity.kt#lines-10)
- ios · `AccountListView` · SettingRoute.account · [AccountListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/AccountList/AccountListView.swift#lines-20)

### 차단한 사용자 · settings_blocked_users

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `BlockedUsersActivity` · BlockedUsersActivity · [BlockedUsersActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/visibilitySettings/BlockedUsersActivity.kt#lines-10)
- ios · `BlockedUserListView` · SettingRoute.blockedMembers · [BlockedUserListView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/OpenScale/BlockedUserListView.swift#lines-20)

### 이메일 마케팅 수신거부 · settings_email_unsubscribe

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `UnsubscribePage` · /unsubscribe · [App.tsx:58](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-58) · [index.tsx:11](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/unsubscribe/marketing/index.tsx#lines-11)

### 설정 · settings_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `SettingsActivity` · SettingsActivity · [SettingsActivity.kt:32](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/SettingsActivity.kt#lines-32)
- ios · `SettingListView` · SettingRoute.home · [SettingListView.swift:21](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/SettingList/SettingListView.swift#lines-21)

### 알림 설정 · settings_notification

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `AlertSettingActivity` · AlertSettingActivity · [AlertSettingActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/notification/AlertSettingActivity.kt#lines-10)
- ios · `NotiListView` · SettingRoute.notiList · [NotiListView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/Noti/NotiListView.swift#lines-19)

### 비밀번호 변경 · settings_password_change

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ChangePasswordActivity` · ChangePasswordActivity · [ChangePasswordActivity.kt:70](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/changePassword/ChangePasswordActivity.kt#lines-70)
- ios · `ChangePasswordView` · 로컬 presentation/상위 화면 구성 · [ChangePasswordView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/ChangePassword/ChangePasswordView.swift#lines-15)

### 비밀번호 재설정 · settings_password_reset

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ResetPasswordActivity` · ResetPasswordActivity · [ResetPasswordActivity.kt:69](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/settings/account/withdrawAccount/ResetPasswordActivity.kt#lines-69)
- ios · `ResetPasswordView` · 로컬 presentation/상위 화면 구성 · [ResetPasswordView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/ResetPasswordView/ResetPasswordView.swift#lines-15)

### 비밀번호 재설정 이메일 확인 · settings_password_verify

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ResetPasswordEmailCheckActivity` · ResetPasswordEmailCheckActivity · [ResetPasswordEmailCheckActivity.kt:57](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/mypage/settings/account/withdrawAccount/ResetPasswordEmailCheckActivity.kt#lines-57)
- ios · `VerifyEmailView` · 로컬 presentation/상위 화면 구성 · [VerifyEmailView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/ResetPasswordView/VerifyEmailView.swift#lines-16) · [VerifyEmailView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Join/Sources/View/VerifyEmailView.swift#lines-15)
- aos · `ChangePasswordValidateActivity` · ChangePasswordValidateActivity · [ChangePasswordValidateActivity.kt:60](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/changePassword/ChangePasswordValidateActivity.kt#lines-60)

### 개인정보 동의 변경 · settings_privacy_agreement

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `PersonalInfoAgreementView` · SettingRoute.personalInfoAgreement · [PersonalInfoAgreementView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/ServiceAgreement/PersonalInfoAgreementView.swift#lines-19)

### 공개 범위 설정 · settings_visibility

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `VisibilitySettingsActivity` · VisibilitySettingsActivity · [VisibilitySettingsActivity.kt:13](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/visibilitySettings/VisibilitySettingsActivity.kt#lines-13)
- ios · `OpenScaleListView` · SettingRoute.manageVisibility · [OpenScaleListView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/OpenScale/OpenScaleListView.swift#lines-16)

### 프로필 공개 범위 · settings_visibility_profile

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ProfileVisibilitySettingActivity` · ProfileVisibilitySettingActivity · [ProfileVisibilitySettingActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/visibilitySettings/ProfileVisibilitySettingActivity.kt#lines-10)
- ios · `OpenScaleProfileView` · SettingRoute.manageProfileCardVisibility; SettingRoute.manageProfileCardVisibilityFromProfileShare · [OpenScaleProfileView.swift:11](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/OpenScale/OpenScaleProfileView.swift#lines-11)

### 회원 탈퇴 최종 확인 · settings_withdraw_confirm

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `WithdrawConfirmActivity` · WithdrawConfirmActivity · [WithdrawConfirmActivity.kt:45](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/withdraw/WithdrawConfirmActivity.kt#lines-45)
- ios · `WithdrwalCompletionView` · SettingRoute.accountDeleteConfirm · [WithdrwalCompletionView.swift:20](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/AccountList/WithdrwalCompletionView.swift#lines-20)

### 탈퇴 사유 직접 입력 · settings_withdraw_reason

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- ios · `WithdrawalReasonInputView` · 로컬 presentation/상위 화면 구성 · [WithdrawalReasonInputView.swift:14](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/AccountList/WithdrawalReasonInputView.swift#lines-14)
- aos · `WithdrawReasonActivity` · WithdrawReasonActivity · [WithdrawReasonActivity.kt:66](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/withdraw/WithdrawReasonActivity.kt#lines-66)

### 회원 탈퇴 본인 확인 · settings_withdraw_verify

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `WithdrawPasswordActivity` · WithdrawPasswordActivity · [WithdrawPasswordActivity.kt:68](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/account/withdraw/WithdrawPasswordActivity.kt#lines-68)
- ios · `DeleteAccountView` · SettingRoute.accountDelete · [DeleteAccountView.swift:16](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/DeleteAccount/DeleteAccountView.swift#lines-16)

### 약관 상세 · support_agreement_detail

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `AgreementWebDetailActivity` · AgreementWebDetailActivity · [AgreementWebDetailActivity.kt:10](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/agreement/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/agreement/detail/AgreementWebDetailActivity.kt#lines-10)
- ios · `ServiceAgreementDocumentView` · 로컬 presentation/상위 화면 구성 · [ServiceAgreementDocumentView.swift:29](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/UIComponents/Sources/Component/ServiceAgreement/ServiceAgreementDocumentView.swift#lines-29)

### 이용약관 목록 · support_agreement_list

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `ServiceAgreementActivity` · ServiceAgreementActivity · [ServiceAgreementActivity.kt:11](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/serviceagreement/ServiceAgreementActivity.kt#lines-11)
- ios · `ServiceAgreementView` · SettingRoute.serviceAgreement · [ServiceAgreementView.swift:18](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/ServiceAgreement/ServiceAgreementView.swift#lines-18)

### 고객센터 · support_home

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `CustomerCenterActivity` · CustomerCenterActivity · [CustomerCenterActivity.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/settings/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/settings/customercenter/CustomerCenterActivity.kt#lines-12)
- ios · `CustomerServiceListView` · SettingRoute.customerService · [CustomerServiceListView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Setting/Sources/View/CustomerServiceList/CustomerServiceListView.swift#lines-15)

### 회원 등급별 혜택 · support_privilege

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `GuestPrivilegesPage` · /guest/privileges · [App.tsx:30](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-30) · [index.tsx:25](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/guest/privileges/index.tsx#lines-25)
- web · `MemberPrivilegesPage` · /member/privileges · [App.tsx:43](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-43) · [index.tsx:14](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/member/privileges/index.tsx#lines-14)
- web · `MusePrivilegesPage` · /muse/privileges · [App.tsx:45](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-45) · [index.tsx:21](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/muse/privileges/index.tsx#lines-21)

### 공유 캐스팅 상세 · share_casting

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- web · `SharedCastingDetailPage` · /share/casting/:id · [App.tsx:51](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-51) · [index.tsx:4](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/share/casting/index.tsx#lines-4)

### 공유 포트폴리오 상세 · share_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `SharedFeedDetailPage` · /share/feed/:id · [App.tsx:52](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-52) · [index.tsx:7](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/share/feed/index.tsx#lines-7) · [index.tsx:6](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/share/feed-v3/index.tsx#lines-6)

### 공유 프로필 3.0·미리보기 · share_profile

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `SharedProfileRoute` · /share/profile/:id · [App.tsx:53](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-53) · [SharedProfileRoute.tsx:15](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/share/SharedProfileRoute.tsx#lines-15)

### 공유 프로젝트 3.0 · share_project

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- web · `SharedProjectRoute` · /share/project/:id · [App.tsx:54](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-54) · [SharedProjectRoute.tsx:8](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/pages/share/SharedProjectRoute.tsx#lines-8)

### 앱 다운로드 안내 · system_app_download

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

- web · `AppDownloadPage` · /app-download · [App.tsx:240](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-240)

### 클럽 입장 · system_club_entry

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- aos · `/lineup/member/club-entry` · /lineup/member/club-entry · [MainActivity.kt:1038](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/main/MainActivity.kt#lines-1038)

### 클럽 대기·멤버 · system_club_lineup

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

레거시 구현 또는 경로가 남아 있습니다. 현행 알파 사용자 진입은 별도 확인하며 활성 화면 수에 합산하지 않습니다.

- aos · `/lineup/member/club/` · /lineup/member/club/ · [MemberClubWebRouteFactory.kt:21](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/member/MemberClubWebRouteFactory.kt#lines-21) · [MainActivity.kt:1031](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/main/MainActivity.kt#lines-1031)

### 화면 불러오기 오류 · system_error

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

- web · `GlobalErrorPage` · Provider ErrorBoundary fallback · [Provider.tsx:40](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/Provider.tsx#lines-40)

### 서비스 점검 안내 · system_maintenance

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `MaintenanceActivity` · MaintenanceActivity · [MaintenanceActivity.kt:46](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/app/src/main/java/com/heyratel/cre8orclub/presentation/MaintenanceActivity.kt#lines-46)
- ios · `MaintenanceView` · 로컬 presentation/상위 화면 구성 · [MaintenanceView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/App/Cre8orClub/Sources/View/MaintenanceView/MaintenanceView.swift#lines-13)
- web · `ServiceMaintenancePage` · /maintenance · [App.tsx:241](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-241)

### 화면을 찾을 수 없음 · system_not_found

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다.

오류 표면으로 전환된 경우에만 기록합니다. 요청했던 정상 화면의 조회는 기록하지 않습니다.

- web · `NotFoundPage` · * / route errorElement · [App.tsx:242](https://bitbucket.org/cre8orclub/c8c-web/src/de80fc8d25d499c84f35fa34235cdb57b74d7d04/src/App.tsx#lines-242)

### 팀 만들기·수정 · team_form

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TeamEditActivity` · TeamEditActivity · [TeamEditActivity.kt:12](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamedit/TeamEditActivity.kt#lines-12)
- aos · `TeamCreateActivity` · TeamCreateActivity · [TeamCreateActivity.kt:18](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamcreate/TeamCreateActivity.kt#lines-18)
- ios · `TeamFormView` · TeamRoute.form · [TeamFormView.swift:19](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Form/TeamFormView.swift#lines-19)

### 팀 · 소개 · team_intro

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TeamProfileScreenModel.Tab.INTRODUCTION` · TeamProfile.Tab.INTRODUCTION · [TeamProfileIntroduction.kt:173](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileIntroduction.kt#lines-173) · [TeamProfileScreen.kt:105](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileScreen.kt#lines-105) · [TeamProfileTabRow.kt:87](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileTabRow.kt#lines-87)
- ios · `TeamIntroductionTabView` · 로컬 presentation/상위 화면 구성 · [TeamIntroductionTabView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Detail/Components/TeamIntroductionTabView.swift#lines-13)

### 팀 멤버 초대 · team_member_invite

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TeamInviteScreen` · TeamInviteScreen · [TeamInviteScreen.kt:50](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamInviteScreen.kt#lines-50)
- ios · `TeamInviteView` · TeamRoute.invite · [TeamInviteView.swift:22](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Invite/TeamInviteView.swift#lines-22)

### 팀 · 멤버 · team_members

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TeamProfileScreenModel.Tab.MEMBERS` · TeamProfile.Tab.MEMBERS · [TeamProfileViewModel.kt:523](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileViewModel.kt#lines-523) · [TeamProfileScreen.kt:111](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileScreen.kt#lines-111) · [TeamProfileTabRow.kt:88](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileTabRow.kt#lines-88)
- ios · `TeamMemberTabView` · 로컬 presentation/상위 화면 구성 · [TeamMemberTabView.swift:13](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Detail/Components/TeamMemberTabView.swift#lines-13)

### 팀 · 포트폴리오 · team_portfolio

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TeamProfileScreenModel.Tab.PORTFOLIO` · TeamProfile.Tab.PORTFOLIO · [TeamProfileViewModel.kt:513](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileViewModel.kt#lines-513) · [TeamProfileScreen.kt:104](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileScreen.kt#lines-104) · [TeamProfileTabRow.kt:83](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileTabRow.kt#lines-83)
- ios · `TeamPortfolioTabView` · 로컬 presentation/상위 화면 구성 · [TeamPortfolioTabView.swift:18](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Detail/Components/TeamPortfolioTabView.swift#lines-18)

### 팀 프로필 · team_profile

실제 사용자에게 보이는 주 화면으로 전환될 때 한 번 기록합니다. 사전 로딩과 반복 렌더는 제외합니다.

- aos · `TeamProfileActivity` · TeamProfileActivity · [TeamProfileActivity.kt:19](https://bitbucket.org/cre8orclub/c8c-aos/src/b135a94143c455b3251c83332ab05451f849f9db/feature/contact/impl/src/main/kotlin/com/heyratel/cre8orclub/feature/contact/teamprofile/TeamProfileActivity.kt#lines-19)
- ios · `TeamDetailView` · TeamRoute.detail · [TeamDetailView.swift:15](https://bitbucket.org/cre8orclub/c8c-swift/src/34ad6c9dbe92b49383c8d20ca4eced3f5ca7c8ac/Projects/Features/Team/Sources/Detail/TeamDetailView.swift#lines-15)

