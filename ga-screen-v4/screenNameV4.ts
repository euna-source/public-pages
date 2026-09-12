// GA 통합 화면명 v4 — 생성 파일. screen-contract.v4.json에서 build_v4.py로 생성. 직접 수정하지 않습니다.
export const SCREEN_SCHEMA_VERSION = 4 as const;
export const SCREEN_NAME_V4 = {
  /** [로그인] 앱 · 점검 안내 */
  APP_MAINTENANCE: 'app_maintenance',
  /** [디스커버리] 포트폴리오 · 상세 */
  PORTFOLIO_DETAIL: 'portfolio_detail',
  /** [파인더] 파인더 · Shuffle 메인(웹) */
  FINDER_SHUFFLE_HOME: 'finder_shuffle_home',
  /** [채티] 채티 · 다이얼 홈(팔로잉 크리에이터 판) */
  DIAL_HOME: 'dial_home',
  /** [디스커버리] 크리에이터 · 프로필 */
  PROFILE_DETAIL: 'profile_detail',
  /** [디스커버리] 채팅방 신고 · 사유 직접 입력 */
  REPORT_DETAIL_INPUT: 'report_detail_input',
  /** [마이] MY · 내 프로필 */
  MY_PROFILE: 'my_profile',
  /** [마이] MY · 프로필 미리보기(웹) */
  MY_PROFILE_PREVIEW: 'my_profile_preview',
  /** [채티] 알림함 · 받은 알림 목록 */
  NOTIFICATION_CENTER: 'notification_center',
  /** [디스커버리] 프로젝트 · 상세 */
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
  /** [채티] 알림함 · 협업 제안 소식(웹) */
  NOTIFICATION_PROPOSAL_NEWS: 'notification_proposal_news',
  /** [디스커버리] 디스커버리 · 갤러리(웹·미출시) */
  DISCOVERY_GALLERY: 'discovery_gallery',
  /** [마이] 회원 자격 · 베타 혜택 안내(웹) */
  MEMBER_PRIVILEGES: 'member_privileges',
  /** [설정] 설정 · 마케팅 수신 거부(웹) */
  SETTINGS_MARKETING_UNSUBSCRIBE: 'settings_marketing_unsubscribe',
  /** [채티] 채티 · 다이얼 안내(팔로잉 8명 미만) */
  DIAL_GUIDE: 'dial_guide',
  /** [채티] 채티 · 다이얼 파도타기(크리에이터 판) */
  DIAL_CREATOR: 'dial_creator',
  /** [마이] 프로필 커버 · 디자인 선택(웹) */
  PROFILE_COVER_DESIGN: 'profile_cover_design',
} as const;
export type ScreenNameV4 = (typeof SCREEN_NAME_V4)[keyof typeof SCREEN_NAME_V4];
