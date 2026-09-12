// GA 통합 화면명 v4 — 생성 파일. screen-contract.v4.json에서 build_v4.py로 생성. 직접 수정하지 않습니다.
package com.heyratel.cre8orclub.core.event.api

object ScreenNameV4 {
    const val SCHEMA_VERSION = 4
    /** [로그인] 앱 실행 · 스플래시 */
    const val APP_SPLASH = "app_splash"
    /** [로그인] 서비스 · 점검 안내 */
    const val APP_MAINTENANCE = "app_maintenance"
    /** [로그인] 로그인·가입 · 방법 선택 */
    const val AUTH_ENTRY = "auth_entry"
    /** [회원가입] 가입 · 약관 동의 */
    const val SIGNUP_TERMS = "signup_terms"
    /** [회원가입] 가입 · 이메일 인증번호 */
    const val SIGNUP_EMAIL_VERIFY = "signup_email_verify"
    /** [회원가입] 가입 · 비밀번호 설정 */
    const val SIGNUP_PASSWORD = "signup_password"
    /** [로그인] 로그인 · 이메일 입력 */
    const val LOGIN_EMAIL = "login_email"
    /** [로그인] 로그인 · 비밀번호 입력 */
    const val LOGIN_PASSWORD = "login_password"
    /** [로그인] 로그인 · 2단계 인증 코드 */
    const val LOGIN_2FA_EMAIL = "login_2fa_email"
    /** [로그인] 비밀번호 재설정 · 이메일 입력 */
    const val RESET_PASSWORD_EMAIL = "reset_password_email"
    /** [로그인] 비밀번호 재설정 · 인증번호 */
    const val RESET_PASSWORD_VERIFY = "reset_password_verify"
    /** [로그인] 비밀번호 재설정 · 새 비밀번호 */
    const val RESET_PASSWORD_NEW = "reset_password_new"
    /** [회원가입] 가입 · ID 입력 */
    const val SIGNUP_ID = "signup_id"
    /** [회원가입] 첫 이용 · 접근 권한 안내 */
    const val ONBOARDING_PERMISSION = "onboarding_permission"
    /** [회원가입] 첫 이용 · 튜토리얼 */
    const val ONBOARDING_TUTORIAL = "onboarding_tutorial"
    /** [회원가입] 첫 이용 · 입장 영상 */
    const val ONBOARDING_WELCOME = "onboarding_welcome"
    /** [회원가입] 갱신 약관 · 재동의 */
    const val AGREEMENT_RECONSENT = "agreement_reconsent"
    /** [회원가입] 약관 · 전문 보기 */
    const val AGREEMENT_DOCUMENT = "agreement_document"
    /** [회원가입] 프로필 커버 · 만들기 */
    const val PROFILE_COVER_CREATE = "profile_cover_create"
    /** [마이] 프로필 커버 · 수정 */
    const val PROFILE_COVER_EDIT = "profile_cover_edit"
    /** [회원가입] 자기소개 · 만들기(첫 온보딩) */
    const val PROFILE_INTRO_CREATE = "profile_intro_create"
    /** [마이] 자기소개 · 수정 */
    const val PROFILE_INTRO_EDIT = "profile_intro_edit"
    /** [회원가입] MY 탭 · 온보딩 인트로(커버 미등록) */
    const val MY_PROFILE_INTRO = "my_profile_intro"
    /** [디스커버리(홈)] 홈 · 디스커버리 피드 */
    const val HOME_FEED = "home_feed"
    /** [디스커버리(홈)] 홈 · 크리에이터 모듈 전체보기 */
    const val HOME_CREATOR_LIST = "home_creator_list"
    /** [디스커버리(홈)] 포트폴리오 · 상세 */
    const val PORTFOLIO_DETAIL = "portfolio_detail"
    /** [디스커버리(홈)] 영감 · 상세 */
    const val INSPIRATION_DETAIL = "inspiration_detail"
    /** [디스커버리(홈)] 포트폴리오 · 댓글 */
    const val PORTFOLIO_COMMENT_LIST = "portfolio_comment_list"
    /** [디스커버리(홈)] 영감 · 댓글 */
    const val INSPIRATION_COMMENT_LIST = "inspiration_comment_list"
    /** [디스커버리(홈)] 리스펙트 · 한마디 선택 */
    const val RESPECT_SELECT = "respect_select"
    /** [디스커버리(홈)] 리스펙트 · 보낸 사람 목록 */
    const val RESPECT_LIST = "respect_list"
    /** [디스커버리(홈)] 첨부 · 미디어 전체보기 */
    const val MEDIA_VIEWER = "media_viewer"
    /** [파인더] 파인더 · 탭 홈 */
    const val FINDER_HOME = "finder_home"
    /** [파인더] 파인더 · 검색 입력 */
    const val FINDER_SEARCH = "finder_search"
    /** [파인더] 파인더 · 크리에이터 검색 결과 */
    const val FINDER_RESULT_CREATOR = "finder_result_creator"
    /** [파인더] 파인더 · 포트폴리오 검색 결과 */
    const val FINDER_RESULT_PORTFOLIO = "finder_result_portfolio"
    /** [파인더] 파인더 · 프로젝트 검색 결과 */
    const val FINDER_RESULT_PROJECT = "finder_result_project"
    /** [파인더] 파인더 · 필터 */
    const val FINDER_FILTER = "finder_filter"
    /** [파인더] 추천 · Shuffle! 키워드 추천(웹) */
    const val FINDER_KEYWORD_RECOMMEND = "finder_keyword_recommend"
    /** [파인더] 추천 · 키워드 묶음 결과 */
    const val FINDER_KEYWORD_BUNDLE = "finder_keyword_bundle"
    /** [파인더] 추천 · 인맥 둘러보기(웹) */
    const val NETWORK_BROWSE = "network_browse"
    /** [디스커버리(홈)] 크리에이터 · 프로필 */
    const val PROFILE_DETAIL = "profile_detail"
    /** [디스커버리(홈)] 크리에이터 · 관계 목록(일촌·팔로워·팔로잉) */
    const val RELATION_LIST = "relation_list"
    /** [디스커버리(홈)] 크리에이터 · 함께 아는 일촌 */
    const val FIRST_CONNECTION_MUTUAL = "first_connection_mutual"
    /** [디스커버리(홈)] 노크 · 용건 선택 */
    const val KNOCK_TYPE_SELECT = "knock_type_select"
    /** [디스커버리(홈)] 신고 · 사유 선택 */
    const val REPORT_REASON = "report_reason"
    /** [디스커버리(홈)] 신고 · 상세 사유 입력 */
    const val REPORT_DETAIL_INPUT = "report_detail_input"
    /** [마이] MY · 내 프로필 */
    const val MY_PROFILE = "my_profile"
    /** [마이] MY · 프로필 미리보기(웹) */
    const val MY_PROFILE_PREVIEW = "my_profile_preview"
    /** [마이] MY · 오늘 방문자 */
    const val MY_PROFILE_VISITORS = "my_profile_visitors"
    /** [마이] MY · 노크 수신 설정 */
    const val MY_KNOCK_SETTINGS = "my_knock_settings"
    /** [마이] 내 정보 · 관리 홈 */
    const val MY_INFO_HOME = "my_info_home"
    /** [마이] 내 정보 · ID 변경 */
    const val MY_INFO_ID = "my_info_id"
    /** [마이] 내 정보 · 한글 이름 */
    const val MY_INFO_NAME_KO = "my_info_name_ko"
    /** [마이] 내 정보 · 영문 이름 */
    const val MY_INFO_NAME_EN = "my_info_name_en"
    /** [마이] 내 정보 · 활동 지역 관리 */
    const val MY_INFO_REGION = "my_info_region"
    /** [마이] 내 정보 · 해외 도시 입력 */
    const val MY_INFO_REGION_GLOBAL_CITY = "my_info_region_global_city"
    /** [마이] 내 정보 · 이메일 입력 */
    const val MY_INFO_EMAIL_REGISTER = "my_info_email_register"
    /** [마이] 내 정보 · 이메일 인증 */
    const val MY_INFO_EMAIL_VERIFY = "my_info_email_verify"
    /** [마이] 내 정보 · 전화번호 입력 */
    const val MY_INFO_PHONE_REGISTER = "my_info_phone_register"
    /** [마이] 내 정보 · 링크 입력 */
    const val MY_INFO_LINK_REGISTER = "my_info_link_register"
    /** [마이] 내 정보 · 생년월일·성별 */
    const val MY_INFO_BIRTH_GENDER = "my_info_birth_gender"
    /** [마이] 내 정보 · 개인정보 공개설정 */
    const val MY_INFO_VISIBILITY = "my_info_visibility"
    /** [마이] 커리어 · 이력 관리(내 이력서) */
    const val RESUME_HOME = "resume_home"
    /** [마이] 커리어 · 경력 입력 */
    const val RESUME_CAREER_FORM = "resume_career_form"
    /** [마이] 커리어 · 학력 입력 */
    const val RESUME_EDUCATION_FORM = "resume_education_form"
    /** [마이] 커리어 · 자격·수상 입력 */
    const val RESUME_AWARDS_FORM = "resume_awards_form"
    /** [마이] 첨부 · 이미지 편집(자르기·회전) */
    const val MEDIA_IMAGE_EDIT = "media_image_edit"
    /** [마이] 첨부 · 동영상 편집(구간 자르기) */
    const val MEDIA_VIDEO_EDIT = "media_video_edit"
    /** [마이] 포트폴리오 · 작성 */
    const val PORTFOLIO_CREATE = "portfolio_create"
    /** [마이] 포트폴리오 · 수정 */
    const val PORTFOLIO_EDIT = "portfolio_edit"
    /** [마이] 프로젝트 카드 · 작성 */
    const val PROJECT_CREATE = "project_create"
    /** [마이] 프로젝트 카드 · 수정 */
    const val PROJECT_EDIT = "project_edit"
    /** [마이] 영감 · 작성 */
    const val INSPIRATION_CREATE = "inspiration_create"
    /** [마이] 영감 · 수정 */
    const val INSPIRATION_EDIT = "inspiration_edit"
    /** [채티] 채티 · 1:1 대화방 */
    const val CHAT_ROOM_DIRECT = "chat_room_direct"
    /** [채티] 채티 · 라운지 대화방 */
    const val CHAT_ROOM_LOUNGE = "chat_room_lounge"
    /** [채티] 채티 · 프로젝트 대화방 */
    const val CHAT_ROOM_PROJECT = "chat_room_project"
    /** [채티] 채티 · 팀 대화방 */
    const val CHAT_ROOM_TEAM = "chat_room_team"
    /** [채티] 채티 · 대화방 메뉴 */
    const val CHAT_ROOM_MENU = "chat_room_menu"
    /** [채티] 라운지 · 만들기 */
    const val LOUNGE_CREATE = "lounge_create"
    /** [채티] 라운지 · 수정 */
    const val LOUNGE_EDIT = "lounge_edit"
    /** [채티] 알림 · 내 알림 */
    const val NOTIFICATION_CENTER = "notification_center"
    /** [채티] 인맥 · 일촌 */
    const val CONTACTS_FIRST_CONNECTIONS = "contacts_first_connections"
    /** [채티] 인맥 · 팔로워 */
    const val CONTACTS_FOLLOWER = "contacts_follower"
    /** [채티] 인맥 · 팔로잉 */
    const val CONTACTS_FOLLOWING = "contacts_following"
    /** [채티] 인맥 · 검색 결과 */
    const val CONTACTS_SEARCH_RESULTS = "contacts_search_results"
    /** [디스커버리(홈)] 프로젝트 · 상세 */
    const val PROJECT_DETAIL = "project_detail"
    /** [디스커버리(홈)] 프로젝트 · 지원 작성 */
    const val PROJECT_APPLICATION_COMPOSE = "project_application_compose"
    /** [디스커버리(홈)] 프로젝트 · 지원자 목록 */
    const val PROJECT_APPLICANTS = "project_applicants"
    /** [채티] 협업 제안 · 상세(웹) */
    const val PROPOSAL_DETAIL = "proposal_detail"
    /** [채티] 협업 제안 · 작성(웹) */
    const val PROPOSAL_CREATE = "proposal_create"
    /** [채티] 협업 제안 · 수정(웹) */
    const val PROPOSAL_EDIT = "proposal_edit"
    /** [채티] 팀 · 내 팀과 합류 요청 */
    const val TEAM_LIST = "team_list"
    /** [채티] 팀 · 상세 */
    const val TEAM_DETAIL = "team_detail"
    /** [채티] 팀 · 만들기 */
    const val TEAM_CREATE = "team_create"
    /** [채티] 팀 · 수정 */
    const val TEAM_EDIT = "team_edit"
    /** [채티] 팀 · 멤버 초대 */
    const val TEAM_INVITE = "team_invite"
    /** [설정] 설정 · 홈 */
    const val SETTINGS_HOME = "settings_home"
    /** [설정] 설정 · 계정 */
    const val SETTINGS_ACCOUNT = "settings_account"
    /** [설정] 설정 · 알림 */
    const val SETTINGS_NOTIFICATION = "settings_notification"
    /** [설정] 설정 · 공개 범위 */
    const val SETTINGS_VISIBILITY = "settings_visibility"
    /** [설정] 설정 · 프로필 공개 범위 */
    const val SETTINGS_VISIBILITY_PROFILE = "settings_visibility_profile"
    /** [설정] 설정 · 차단한 사용자 */
    const val SETTINGS_BLOCKED_MEMBERS = "settings_blocked_members"
    /** [설정] 설정 · 비밀번호 변경 */
    const val SETTINGS_CHANGE_PASSWORD = "settings_change_password"
    /** [설정] 설정 · 2단계 인증 */
    const val SETTINGS_2FA = "settings_2fa"
    /** [설정] 설정 · 인증 이메일 관리 */
    const val SETTINGS_2FA_EMAIL = "settings_2fa_email"
    /** [설정] 설정 · 인증 이메일 확인 */
    const val SETTINGS_2FA_EMAIL_VERIFY = "settings_2fa_email_verify"
    /** [설정] 회원 탈퇴 · 본인 확인 */
    const val ACCOUNT_DELETE_PASSWORD = "account_delete_password"
    /** [설정] 회원 탈퇴 · 사유 */
    const val ACCOUNT_DELETE_REASON = "account_delete_reason"
    /** [설정] 회원 탈퇴 · 최종 확인 */
    const val ACCOUNT_DELETE_CONFIRM = "account_delete_confirm"
    /** [설정] 고객센터 */
    const val SUPPORT_HOME = "support_home"
    /** [설정] 설정 · 서비스 동의(약관 목록) */
    const val SETTINGS_AGREEMENTS = "settings_agreements"
    /** [설정] Muse 특권 안내(웹) */
    const val SETTINGS_MUSE_PRIVILEGES = "settings_muse_privileges"
    /** [설정] 내 활동 · 모아보기 */
    const val SETTINGS_CONTENTS = "settings_contents"
    /** [설정] 내 활동 · 댓글과 답글 */
    const val SETTINGS_CONTENTS_COMMENTS = "settings_contents_comments"
    /** [설정] 내 활동 · 리스펙트한 작업물 */
    const val SETTINGS_CONTENTS_RESPECTED = "settings_contents_respected"
    /** [설정] 내 활동 · 좋아요한 콘텐츠 */
    const val SETTINGS_CONTENTS_LIKED = "settings_contents_liked"
    /** [설정] 북마크 · 크리에이터 */
    const val BOOKMARK_CREATOR = "bookmark_creator"
    /** [설정] 북마크 · 포트폴리오 */
    const val BOOKMARK_PORTFOLIO = "bookmark_portfolio"
    /** [디스커버리(홈)] 클럽 · 대기 랜딩(웹) */
    const val CLUB_WAITING = "club_waiting"
    /** [디스커버리(홈)] 클럽 · 입장 랜딩(웹) */
    const val CLUB_ENTRY = "club_entry"
    /** [디스커버리(홈)] 아케이드 · 카드 보스전 */
    const val ARCADE_CARD_BOSS = "arcade_card_boss"
    /** [디스커버리(홈)] 아케이드 · 블록깨기 */
    const val ARCADE_BREAKOUT = "arcade_breakout"
    /** [로그인] 앱 이용 · 필수 업데이트 */
    const val APP_UPDATE_REQUIRED = "app_update_required"
    /** [마이] 업로드 · 커버 등록 필요 */
    const val PROFILE_COVER_REQUIRED = "profile_cover_required"
    /** [채티] 채티 · 대화 목록 */
    const val CHAT_LIST = "chat_list"
    /** [채티] 채티 · 라운지 목록 */
    const val LOUNGE_LIST = "lounge_list"
    /** [채티] 채티 · 프로젝트 목록 */
    const val PROJECT_CHAT_LIST = "project_chat_list"
    /** [설정] 회원 탈퇴 · 기타 사유 입력 */
    const val ACCOUNT_DELETE_REASON_INPUT = "account_delete_reason_input"
    /** [채티] 협업 제안 · 제안함 목록(웹) */
    const val PROPOSAL_LIST = "proposal_list"
    /** [디스커버리(홈)] 갤러리 · 작품 전시(웹) */
    const val HOME_GALLERY = "home_gallery"
    /** [마이] 회원 혜택 안내(베타·Muse) */
    const val MEMBER_PRIVILEGES = "member_privileges"
    /** [마이] 커리어 · 스킬 입력 */
    const val RESUME_SKILL_FORM = "resume_skill_form"
    /** [마이] 커리어 · 언어 능력 입력 */
    const val RESUME_LANGUAGE_FORM = "resume_language_form"
    /** [마이] 자기소개 · 관리 홈 */
    const val MY_INFO_INTRO_HOME = "my_info_intro_home"
    /** [디스커버리(홈)] 아케이드 · 두더지잡기 */
    const val ARCADE_WHACK = "arcade_whack"
    /** [디스커버리(홈)] 아케이드 · 퍼즐 */
    const val ARCADE_PUZZLE = "arcade_puzzle"
    /** [디스커버리(홈)] 아케이드 · 플래피 */
    const val ARCADE_FLAPPY = "arcade_flappy"
}
