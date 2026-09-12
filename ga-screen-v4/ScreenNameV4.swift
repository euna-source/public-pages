// GA 통합 화면명 v4 — 생성 파일. screen-contract.v4.json에서 build_v4.py로 생성. 직접 수정하지 않습니다.
public enum ScreenNameV4: String, CaseIterable {
    public static let schemaVersion = 4
    /// 앱 실행 · 스플래시
    case app_splash = "app_splash"
    /// 서비스 · 점검 안내
    case app_maintenance = "app_maintenance"
    /// 로그인·가입 · 방법 선택
    case auth_entry = "auth_entry"
    /// 가입 · 약관 동의
    case signup_terms = "signup_terms"
    /// 가입 · 이메일 인증번호
    case signup_email_verify = "signup_email_verify"
    /// 가입 · 비밀번호 설정
    case signup_password = "signup_password"
    /// 로그인 · 이메일 입력
    case login_email = "login_email"
    /// 로그인 · 비밀번호 입력
    case login_password = "login_password"
    /// 로그인 · 2단계 인증 코드
    case login_2fa_email = "login_2fa_email"
    /// 비밀번호 재설정 · 인증번호
    case reset_password_verify = "reset_password_verify"
    /// 비밀번호 재설정 · 새 비밀번호
    case reset_password_new = "reset_password_new"
    /// 가입 · ID 입력
    case signup_id = "signup_id"
    /// 가입 · 이름 입력(한글)
    case signup_name_ko = "signup_name_ko"
    /// 첫 이용 · 접근 권한 안내
    case onboarding_permission = "onboarding_permission"
    /// 첫 이용 · 튜토리얼
    case onboarding_tutorial = "onboarding_tutorial"
    /// 첫 이용 · 입장 영상
    case onboarding_welcome = "onboarding_welcome"
    /// 갱신 약관 · 재동의
    case agreement_reconsent = "agreement_reconsent"
    /// 약관 · 전문 보기
    case agreement_document = "agreement_document"
    /// 프로필 커버 · 만들기
    case profile_cover_create = "profile_cover_create"
    /// 프로필 커버 · 수정
    case profile_cover_edit = "profile_cover_edit"
    /// 자기소개 · 만들기(첫 온보딩)
    case profile_intro_create = "profile_intro_create"
    /// 자기소개 · 수정
    case profile_intro_edit = "profile_intro_edit"
    /// MY 탭 · 온보딩 인트로(커버 미등록)
    case my_profile_intro = "my_profile_intro"
    /// 홈 · 디스커버리 피드
    case home_feed = "home_feed"
    /// 홈 · 크리에이터 모듈 전체보기
    case home_creator_list = "home_creator_list"
    /// 영감 · 목록(딥링크)
    case inspiration_list = "inspiration_list"
    /// Muse 한 마디 · 목록
    case muse_comment_list = "muse_comment_list"
    /// Muse 한 마디 · 작성·수정
    case muse_comment_input = "muse_comment_input"
    /// 포트폴리오 · 상세
    case portfolio_detail = "portfolio_detail"
    /// 영감 · 상세
    case inspiration_detail = "inspiration_detail"
    /// 포트폴리오 · 댓글
    case portfolio_comment_list = "portfolio_comment_list"
    /// 영감 · 댓글
    case inspiration_comment_list = "inspiration_comment_list"
    /// 리스펙트 · 한마디 선택
    case respect_select = "respect_select"
    /// 리스펙트 · 보낸 사람 목록
    case respect_list = "respect_list"
    /// 첨부 · 미디어 전체보기
    case media_viewer = "media_viewer"
    /// 파인더 · 탭 홈
    case finder_home = "finder_home"
    /// 파인더 · 검색 입력
    case finder_search = "finder_search"
    /// 파인더 · 크리에이터 검색 결과
    case finder_result_creator = "finder_result_creator"
    /// 파인더 · 포트폴리오 검색 결과
    case finder_result_portfolio = "finder_result_portfolio"
    /// 파인더 · 프로젝트 검색 결과
    case finder_result_project = "finder_result_project"
    /// 파인더 · 필터
    case finder_filter = "finder_filter"
    /// 추천 · Shuffle! 키워드 추천(웹)
    case finder_keyword_recommend = "finder_keyword_recommend"
    /// 추천 · 키워드 묶음 결과
    case finder_keyword_bundle = "finder_keyword_bundle"
    /// 추천 · 인맥 둘러보기(웹)
    case network_browse = "network_browse"
    /// 크리에이터 · 프로필
    case profile_detail = "profile_detail"
    /// 크리에이터 · 관계 목록(일촌·팔로워·팔로잉)
    case relation_list = "relation_list"
    /// 크리에이터 · 함께 아는 일촌
    case first_connection_mutual = "first_connection_mutual"
    /// 노크 · 용건 선택
    case knock_type_select = "knock_type_select"
    /// 신고 · 사유 선택
    case report_reason = "report_reason"
    /// 신고 · 상세 사유 입력
    case report_detail_input = "report_detail_input"
    /// MY · 내 프로필
    case my_profile = "my_profile"
    /// MY · 프로필 미리보기(웹)
    case my_profile_preview = "my_profile_preview"
    /// MY · 오늘 방문자
    case my_profile_visitors = "my_profile_visitors"
    /// MY · 노크 수신 설정
    case my_knock_settings = "my_knock_settings"
    /// 내 정보 · 관리 홈
    case my_info_home = "my_info_home"
    /// 내 정보 · ID 변경
    case my_info_id = "my_info_id"
    /// 내 정보 · 한글 이름
    case my_info_name_ko = "my_info_name_ko"
    /// 내 정보 · 영문 이름
    case my_info_name_en = "my_info_name_en"
    /// 내 정보 · 직업 관리
    case my_info_profession = "my_info_profession"
    /// 내 정보 · 직업 선택
    case my_info_profession_select = "my_info_profession_select"
    /// 내 정보 · 직업 직접 추가
    case my_info_profession_direct = "my_info_profession_direct"
    /// 내 정보 · 활동 지역 관리
    case my_info_region = "my_info_region"
    /// 내 정보 · 해외 도시 입력
    case my_info_region_global_city = "my_info_region_global_city"
    /// 내 정보 · 이메일 입력
    case my_info_email_register = "my_info_email_register"
    /// 내 정보 · 이메일 인증
    case my_info_email_verify = "my_info_email_verify"
    /// 내 정보 · 전화번호 입력
    case my_info_phone_register = "my_info_phone_register"
    /// 내 정보 · 링크 입력
    case my_info_link_register = "my_info_link_register"
    /// 내 정보 · 생년월일·성별
    case my_info_birth_gender = "my_info_birth_gender"
    /// 내 정보 · 개인정보 공개설정
    case my_info_visibility = "my_info_visibility"
    /// 계정 · 이메일 강제 등록
    case account_email_required = "account_email_required"
    /// 커리어 · 이력 관리(내 이력서)
    case resume_home = "resume_home"
    /// 커리어 · 경력 입력
    case resume_career_form = "resume_career_form"
    /// 커리어 · 학력 입력
    case resume_education_form = "resume_education_form"
    /// 커리어 · 자격·수상 입력
    case resume_awards_form = "resume_awards_form"
    /// 첨부 · 이미지 편집(자르기·회전)
    case media_image_edit = "media_image_edit"
    /// 첨부 · 동영상 편집(구간 자르기)
    case media_video_edit = "media_video_edit"
    /// 포트폴리오 · 작성
    case portfolio_create = "portfolio_create"
    /// 포트폴리오 · 수정
    case portfolio_edit = "portfolio_edit"
    /// 프로젝트 카드 · 작성
    case project_create = "project_create"
    /// 프로젝트 카드 · 수정
    case project_edit = "project_edit"
    /// 영감 · 작성
    case inspiration_create = "inspiration_create"
    /// 영감 · 수정
    case inspiration_edit = "inspiration_edit"
    /// 채티 · 1:1 대화방
    case chat_room_direct = "chat_room_direct"
    /// 채티 · 라운지 대화방
    case chat_room_lounge = "chat_room_lounge"
    /// 채티 · 프로젝트 대화방
    case chat_room_project = "chat_room_project"
    /// 채티 · 팀 대화방
    case chat_room_team = "chat_room_team"
    /// 채티 · 대화방 메뉴
    case chat_room_menu = "chat_room_menu"
    /// 라운지 · 만들기
    case lounge_create = "lounge_create"
    /// 라운지 · 수정
    case lounge_edit = "lounge_edit"
    /// 알림 · 내 알림
    case notification_center = "notification_center"
    /// 인맥 · 일촌
    case contacts_first_connections = "contacts_first_connections"
    /// 인맥 · 팔로워
    case contacts_follower = "contacts_follower"
    /// 인맥 · 팔로잉
    case contacts_following = "contacts_following"
    /// 인맥 · 검색 결과
    case contacts_search_results = "contacts_search_results"
    /// 프로젝트 · 상세
    case project_detail = "project_detail"
    /// 프로젝트 · 목록(딥링크)
    case project_list = "project_list"
    /// 프로젝트 · 지원 작성
    case project_application_compose = "project_application_compose"
    /// 프로젝트 · 지원자 목록
    case project_applicants = "project_applicants"
    /// 협업 제안 · 작성(웹)
    case proposal_create = "proposal_create"
    /// 협업 제안 · 수정(웹)
    case proposal_edit = "proposal_edit"
    /// 팀 · 내 팀과 합류 요청
    case team_list = "team_list"
    /// 팀 · 상세
    case team_detail = "team_detail"
    /// 팀 · 만들기
    case team_create = "team_create"
    /// 팀 · 수정
    case team_edit = "team_edit"
    /// 팀 · 멤버 초대
    case team_invite = "team_invite"
    /// 설정 · 홈
    case settings_home = "settings_home"
    /// 설정 · 계정
    case settings_account = "settings_account"
    /// 설정 · 알림
    case settings_notification = "settings_notification"
    /// 설정 · 공개 범위
    case settings_visibility = "settings_visibility"
    /// 설정 · 프로필 공개 범위
    case settings_visibility_profile = "settings_visibility_profile"
    /// 설정 · 차단한 사용자
    case settings_blocked_members = "settings_blocked_members"
    /// 설정 · 비밀번호 변경
    case settings_change_password = "settings_change_password"
    /// 설정 · 2단계 인증
    case settings_2fa = "settings_2fa"
    /// 설정 · 인증 이메일 관리
    case settings_2fa_email = "settings_2fa_email"
    /// 설정 · 인증 이메일 확인
    case settings_2fa_email_verify = "settings_2fa_email_verify"
    /// 회원 탈퇴 · 본인 확인
    case account_delete_password = "account_delete_password"
    /// 회원 탈퇴 · 사유
    case account_delete_reason = "account_delete_reason"
    /// 회원 탈퇴 · 최종 확인
    case account_delete_confirm = "account_delete_confirm"
    /// 고객센터
    case support_home = "support_home"
    /// 설정 · 서비스 동의(약관 목록)
    case settings_agreements = "settings_agreements"
    /// Muse 특권 안내(웹)
    case settings_muse_privileges = "settings_muse_privileges"
    /// 내 활동 · 모아보기
    case settings_contents = "settings_contents"
    /// 내 활동 · 댓글과 답글
    case settings_contents_comments = "settings_contents_comments"
    /// 내 활동 · 리스펙트한 작업물
    case settings_contents_respected = "settings_contents_respected"
    /// 내 활동 · 좋아요한 콘텐츠
    case settings_contents_liked = "settings_contents_liked"
    /// 북마크 · 크리에이터
    case bookmark_creator = "bookmark_creator"
    /// 북마크 · 포트폴리오
    case bookmark_portfolio = "bookmark_portfolio"
    /// 클럽 · 대기 랜딩(웹)
    case club_waiting = "club_waiting"
    /// 클럽 · 입장 랜딩(웹)
    case club_entry = "club_entry"
    /// 아케이드 · 카드 보스전
    case arcade_card_boss = "arcade_card_boss"
    /// 아케이드 · 블록깨기
    case arcade_breakout = "arcade_breakout"
    /// 앱 이용 · 필수 업데이트
    case app_update_required = "app_update_required"
    /// 로그인 · 세션 종료 안내
    case auth_session_expired = "auth_session_expired"
    /// 업로드 · 커버 등록 필요
    case profile_cover_required = "profile_cover_required"
    /// 채티 · 대화 목록
    case chat_list = "chat_list"
    /// 채티 · 라운지 목록
    case lounge_list = "lounge_list"
    /// 채티 · 프로젝트 목록
    case project_chat_list = "project_chat_list"
    /// 회원 탈퇴 · 기타 사유 입력
    case account_delete_reason_input = "account_delete_reason_input"
    /// 설정 · 개인정보 이용 동의
    case settings_personal_info_consent = "settings_personal_info_consent"
    /// 설정 · 개인정보 이용 동의 철회
    case settings_personal_info_withdraw = "settings_personal_info_withdraw"
}
