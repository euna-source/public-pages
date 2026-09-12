// GA 통합 화면명 v4 — 생성 파일. screen-contract.v4.json에서 build_v4.py로 생성. 직접 수정하지 않습니다.
export const SCREEN_SCHEMA_VERSION = 4 as const;
export const SCREEN_NAME_V4 = {
  /** 서비스 · 점검 안내 */
  APP_MAINTENANCE: 'app_maintenance',
  /** 프로필 커버 · 만들기 */
  PROFILE_COVER_CREATE: 'profile_cover_create',
  /** 프로필 커버 · 수정 */
  PROFILE_COVER_EDIT: 'profile_cover_edit',
  /** 포트폴리오 · 상세 */
  PORTFOLIO_DETAIL: 'portfolio_detail',
  /** 파인더 · 검색 입력 */
  FINDER_SEARCH: 'finder_search',
  /** 파인더 · 프로젝트 검색 결과 */
  FINDER_RESULT_PROJECT: 'finder_result_project',
  /** 추천 · Shuffle! 키워드 추천(웹) */
  FINDER_KEYWORD_RECOMMEND: 'finder_keyword_recommend',
  /** 추천 · 인맥 둘러보기(웹) */
  NETWORK_BROWSE: 'network_browse',
  /** 크리에이터 · 프로필 */
  PROFILE_DETAIL: 'profile_detail',
  /** 신고 · 상세 사유 입력 */
  REPORT_DETAIL_INPUT: 'report_detail_input',
  /** MY · 내 프로필 */
  MY_PROFILE: 'my_profile',
  /** MY · 프로필 미리보기(웹) */
  MY_PROFILE_PREVIEW: 'my_profile_preview',
  /** 프로젝트 카드 · 작성 */
  PROJECT_CREATE: 'project_create',
  /** 프로젝트 카드 · 수정 */
  PROJECT_EDIT: 'project_edit',
  /** 알림 · 내 알림 */
  NOTIFICATION_CENTER: 'notification_center',
  /** 프로젝트 · 상세 */
  PROJECT_DETAIL: 'project_detail',
  /** 프로젝트 · 목록(딥링크) */
  PROJECT_LIST: 'project_list',
  /** 프로젝트 · 지원 작성 */
  PROJECT_APPLICATION_COMPOSE: 'project_application_compose',
  /** 프로젝트 · 지원자 목록 */
  PROJECT_APPLICANTS: 'project_applicants',
  /** 협업 제안 · 상세(웹) */
  PROPOSAL_DETAIL: 'proposal_detail',
  /** 협업 제안 · 작성(웹) */
  PROPOSAL_CREATE: 'proposal_create',
  /** 협업 제안 · 수정(웹) */
  PROPOSAL_EDIT: 'proposal_edit',
  /** Muse 특권 안내(웹) */
  SETTINGS_MUSE_PRIVILEGES: 'settings_muse_privileges',
  /** 협업 제안 · 제안함 목록(웹) */
  PROPOSAL_LIST: 'proposal_list',
  /** 알림 · 제안 소식(웹) */
  NOTIFICATION_PROPOSAL_NEWS: 'notification_proposal_news',
  /** 갤러리 · 작품 전시(웹) */
  HOME_GALLERY: 'home_gallery',
  /** 가입 · 회원 혜택 안내(웹) */
  SIGNUP_PRIVILEGES: 'signup_privileges',
  /** 설정 · 마케팅 수신 거부(웹) */
  SETTINGS_MARKETING_UNSUBSCRIBE: 'settings_marketing_unsubscribe',
} as const;
export type ScreenNameV4 = (typeof SCREEN_NAME_V4)[keyof typeof SCREEN_NAME_V4];
