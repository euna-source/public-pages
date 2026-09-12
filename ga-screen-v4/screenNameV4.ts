// GA 통합 화면명 v4 — 생성 파일. screen-contract.v4.json에서 build_v4.py로 생성. 직접 수정하지 않습니다.
export const SCREEN_SCHEMA_VERSION = 4 as const;
export const SCREEN_NAME_V4 = {
  /** [로그인] 서비스 · 점검 안내 */
  APP_MAINTENANCE: 'app_maintenance',
  /** [회원가입] 프로필 커버 · 만들기 */
  PROFILE_COVER_CREATE: 'profile_cover_create',
  /** [마이] 프로필 커버 · 수정 */
  PROFILE_COVER_EDIT: 'profile_cover_edit',
  /** [디스커버리(홈)] 포트폴리오 · 상세 */
  PORTFOLIO_DETAIL: 'portfolio_detail',
  /** [파인더] 추천 · Shuffle! 키워드 추천(웹) */
  FINDER_KEYWORD_RECOMMEND: 'finder_keyword_recommend',
  /** [파인더] 추천 · 인맥 둘러보기(웹) */
  NETWORK_BROWSE: 'network_browse',
  /** [디스커버리(홈)] 크리에이터 · 프로필 */
  PROFILE_DETAIL: 'profile_detail',
  /** [디스커버리(홈)] 신고 · 상세 사유 입력 */
  REPORT_DETAIL_INPUT: 'report_detail_input',
  /** [마이] MY · 내 프로필 */
  MY_PROFILE: 'my_profile',
  /** [마이] MY · 프로필 미리보기(웹) */
  MY_PROFILE_PREVIEW: 'my_profile_preview',
  /** [채티] 알림 · 내 알림 */
  NOTIFICATION_CENTER: 'notification_center',
  /** [디스커버리(홈)] 프로젝트 · 상세 */
  PROJECT_DETAIL: 'project_detail',
  /** [채티] 협업 제안 · 상세(웹) */
  PROPOSAL_DETAIL: 'proposal_detail',
  /** [채티] 협업 제안 · 작성(웹) */
  PROPOSAL_CREATE: 'proposal_create',
  /** [채티] 협업 제안 · 수정(웹) */
  PROPOSAL_EDIT: 'proposal_edit',
  /** [설정] Muse 특권 안내(웹) */
  SETTINGS_MUSE_PRIVILEGES: 'settings_muse_privileges',
  /** [채티] 협업 제안 · 제안함 목록(웹) */
  PROPOSAL_LIST: 'proposal_list',
  /** [채티] 알림 · 제안 소식(웹) */
  NOTIFICATION_PROPOSAL_NEWS: 'notification_proposal_news',
  /** [디스커버리(홈)] 갤러리 · 작품 전시(웹) */
  HOME_GALLERY: 'home_gallery',
  /** [마이] 회원 혜택 안내(베타·Muse) */
  MEMBER_PRIVILEGES: 'member_privileges',
  /** [설정] 설정 · 마케팅 수신 거부(웹) */
  SETTINGS_MARKETING_UNSUBSCRIBE: 'settings_marketing_unsubscribe',
} as const;
export type ScreenNameV4 = (typeof SCREEN_NAME_V4)[keyof typeof SCREEN_NAME_V4];
