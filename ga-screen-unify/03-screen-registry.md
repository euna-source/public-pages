# 통합 화면 대장 (170개)

★는 핵심 31개(1차 실수신 검증 대상). AOS 열은 "현행명 · 할 일", iOS 열은 "화면 목록 행 번호 · 할 일"입니다.

| screen_name | 라벨 | 종류 | 파라미터 | AOS | iOS | 비고 |
|---|---|---|---|---|---|---|
| `app_entry` ★ | 앱 실행 · 스플래시 | 화면 |  | app_entry · 현행 유지 | 2 · 제안 개명 |  |
| `maintenance` | 서비스 · 점검 안내 | 화면 |  | 추가(존재 확인) | 1 · 제안 채택 |  |
| `signup_method` ★ | 로그인·가입 · 방법 선택 | 화면 |  | signup_method · 현행 유지 | 17 · 제안 개명 |  |
| `signup_terms` ★ | 가입 · 약관 동의 | 시트 |  | signup_terms · 현행 유지 | 21 · 현행 유지 |  |
| `signup_email_verification` | 가입 · 이메일 인증번호 | 화면 |  | 추가 | 15 · 제안 채택 |  |
| `signup_password` | 가입 · 비밀번호 설정 | 화면 |  | 추가 | 11 · 제안 채택 |  |
| `login_email` | 로그인 · 이메일 입력 | 화면 |  | 추가 | 14 · 제안 채택 | iOS는 이메일→비밀번호가 한 push 안의 단계. 비밀번호 단계가 별도 화면이면 login_password를 발송합니다. |
| `login_password` | 로그인 · 비밀번호 입력 | 화면 |  | 추가 | 확인 |  |
| `login_2fa_email` | 로그인 · 2단계 인증 코드 | 화면 |  | 추가 | 16 · 제안 채택 |  |
| `reset_password_email` | 비밀번호 재설정 · 이메일 입력 | 화면 |  | 추가 | 확인 |  |
| `reset_password_verify` | 비밀번호 재설정 · 인증번호 | 화면 |  | 추가 | 174 · 제안 개명 | 로그인 전·설정 안 어느 진입이든 같은 이름. 진입은 previous_screen으로 구분합니다. |
| `reset_password_new` | 비밀번호 재설정 · 새 비밀번호 | 화면 |  | 추가 | 160 · 제안 개명 |  |
| `basic_info_id` ★ | 가입 · ID 입력 | 화면 |  | basic_info_id · 현행 유지 | 12 · 제안 개명 |  |
| `basic_info_ko_name` | 가입 · 이름 입력(한글) | 화면 |  | basic_info_ko_name · 현행 유지 | 13 · 제안 개명 | iOS 가입 이름 입력은 1단계입니다. 한글 이름 단계로 간주하되 iOS 리드가 확인합니다. |
| `basic_info_en_name` | 가입 · 영문 이름 | 화면 |  | basic_info_en_name · 현행 유지 | 해당 없음 | iOS 가입 흐름에 영문 이름 단계 없음(확인). |
| `basic_info_jobs` | 가입 · 직업 선택 | 화면 |  | basic_info_jobs · 현행 유지 | 확인 | iOS는 커버 온보딩의 직업 단계(onboarding_cover_intro_profession)와 대응 가능성. 구간 롤업으로 비교. |
| `basic_info_keyword_personal` | 가입 · 키워드(성향) | 화면 |  | basic_info_keyword_personal · 현행 유지 | 확인 | iOS는 자기소개 만들기(profile_expression_onboarding) 안 단계. 구간 롤업으로 비교. |
| `basic_info_keyword_working_preference` | 가입 · 키워드(업무 성향) | 화면 |  | basic_info_keyword_working_preference · 현행 유지 | 확인 |  |
| `basic_info_keyword_ambition` | 가입 · 키워드(목표) | 화면 |  | basic_info_keyword_ambition · 현행 유지 | 확인 |  |
| `onboarding_permission` | 첫 이용 · 접근 권한 안내 | 화면 |  | 추가 | 3 · 제안 채택 |  |
| `onboarding_tutorial` | 첫 이용 · 튜토리얼 | 화면 |  | 추가 | 19 · 제안 개명 |  |
| `onboarding_tutorial_complete` | 첫 이용 · 입장 영상 | 화면 |  | 추가 | 18 · 제안 채택 |  |
| `pending_agreement_detail` | 갱신 약관 · 재동의 | 화면 |  | pending_agreement_detail · 현행 유지 | 7 · 제안 개명 | AOS는 약관 웹 상세+동의 화면, iOS는 재동의 카드 팝업. 목적(개정 약관 재동의)이 같아 한 이름. |
| `agreement_document` | 약관 · 전문 보기 | 웹 | document_type | 추가(존재 확인) | 4 20 170 171 172 175 · 통합 발송 | 어느 약관이든 같은 이름. document_type=signup_terms／privacy／privacy_reconsent／ad_info／terms_of_service／personal_info. |
| `onboarding_cover_intro_profession` ★ | 커버 소개 · 직업 | 화면 |  | onboarding_cover_intro_profession · 현행 유지(체류 추가) · 진입만 | 25 · 단계별 발송 |  |
| `onboarding_cover_intro_nickname` | 커버 소개 · 닉네임 | 화면 |  | onboarding_cover_intro_nickname · 현행 유지(체류 추가) · 진입만 | 25 · 단계별 발송 |  |
| `onboarding_cover_intro_ko_name` | 커버 소개 · 한글 이름 | 화면 |  | onboarding_cover_intro_ko_name · 현행 유지(체류 추가) · 진입만 | 25 · 단계별 발송 |  |
| `onboarding_cover_intro_tagline` | 커버 소개 · 한 줄 소개 | 화면 |  | onboarding_cover_intro_tagline · 현행 유지(체류 추가) · 진입만 | 25 · 단계별 발송 |  |
| `onboarding_cover_intro_media` | 커버 소개 · 미디어 | 화면 |  | onboarding_cover_intro_media · 현행 유지(체류 추가) · 진입만 | 25 · 단계별 발송 |  |
| `onboarding_cover_intro_profile_image` | 커버 소개 · 프로필 이미지 | 화면 |  | onboarding_cover_intro_profile_image · 현행 유지(체류 추가) · 진입만 | 25 · 단계별 발송 | iOS 25행(프로필 커버 만들기)은 딥링크 step= 값이 있는 단계형 화면이므로 단계마다 위 6개 이름을 발송합니다. 단계 구성이 다르면 없는 단계는 비웁니다. |
| `profile_cover_edit` | 프로필 커버 · 수정 | 화면 |  | 추가(존재 확인) | 28 · 제안 채택 |  |
| `profile_expression_onboarding` | 자기소개 · 만들기(첫 온보딩) | 화면 |  | 확인 | 22 · 제안 채택 | AOS는 basic_info_keyword_* 3단계로 나뉩니다. OS 간 비교는 구간(가입 후 첫 이용) 롤업으로 합니다. |
| `profile_expression_edit` | 자기소개 · 수정 | 화면 |  | 추가(존재 확인) | 23 · 제안 채택 |  |
| `my_onboarding_intro` | MY 탭 · 온보딩 인트로(커버 미등록) | 탭 |  | 확인 | 54 · 제안 채택 |  |
| `home` ★ | 홈 · 디스커버리 피드 | 탭 |  | home · 현행 유지 | 30 · 현행 유지 |  |
| `discovery_creator_module` | 홈 · 크리에이터 모듈 전체보기 | 화면 |  | 해당 없음 | 32 · 제안 채택 |  |
| `inspiration_list` | 영감 · 목록(딥링크) | 화면 |  | 확인 | 33 · 제안 채택 |  |
| `muse_comment_list` | Muse 한 마디 · 목록 | 화면 |  | 확인 | 31 · 제안 채택 |  |
| `muse_comment_manage` | Muse 한 마디 · 관리 | 시트 |  | 확인 | 37 · 제안 채택 |  |
| `muse_comment_input` | Muse 한 마디 · 작성·수정 | 시트 |  | 확인 | 38 · 제안 채택 |  |
| `portfolio_detail` ★ | 포트폴리오 · 상세 | 화면 | screen_id=작업물 id | portfolio_detail · 현행 유지 | 35 · 현행 유지 |  |
| `inspiration_detail` ★ | 영감 · 상세 | 화면 | screen_id=콘텐츠 id | inspiration_detail · 현행 유지 | 34 · 현행 유지 |  |
| `portfolio_comment_list` | 포트폴리오 · 댓글 | 시트 | screen_id=작업물 id | 확인 | 47 48 91 · 통합 발송 | 디스커버리 카드·상세·프로필 어디서 열든 같은 이름. 유입은 previous_screen으로 봅니다. |
| `inspiration_comment_list` | 영감 · 댓글 | 시트 | screen_id=콘텐츠 id | 확인 | 43 44 · 통합 발송 |  |
| `respect_select` | 리스펙트 · 한마디 선택 | 시트 |  | 추가 | 49 · 제안 개명 | 팝업 형태지만 독립 선택 과업이라 화면으로 셉니다. |
| `respect_list` | 리스펙트 · 보낸 사람 목록 | 시트 |  | 추가 | 208 213 · 통합 발송 |  |
| `media_viewer` | 첨부 · 미디어 전체보기 | 화면 | media_type=image／video／audio／pdf／youtube | 추가 | 24 26 27 36 117 121 180 181 182 183 184 199 211 · 통합 발송 | 사진·영상·PDF·유튜브 전체보기와 업로드 첨부 미리보기를 하나로 셉니다. 어디서 열었는지는 previous_screen. |
| `finder` ★ | 파인더 · 탭 홈 | 탭 |  | finder · 현행 유지 | 94 · 현행 유지 |  |
| `finder_search` ★ | 파인더 · 검색 입력 | 화면 |  | finder_search · 현행 유지 | 93 · 현행 유지 |  |
| `finder_result_creator` ★ | 파인더 · 크리에이터 검색 결과 | 화면 |  | finder_result_creator · 현행 유지 | 98 · 현행 유지 |  |
| `finder_result_portfolio` ★ | 파인더 · 포트폴리오 검색 결과 | 화면 |  | finder_result_portfolio · 현행 유지 | 97 · 현행 유지 |  |
| `finder_result_project` ★ | 파인더 · 프로젝트 검색 결과 | 화면 |  | finder_result_project · 현행 유지 | 99 · 현행 유지 |  |
| `finder_filter` | 파인더 · 필터 | 시트 | filter_step=region／profession／tag(선택) | 추가 | 107 104 105 106 · 통합 발송 | 필터 시트 안의 지역·직업·해시태그 추가 단계는 같은 화면. 필요하면 filter_step 파라미터. |
| `discovery_recommend_keywords` ★ | 추천 · Shuffle! 키워드 추천(웹) | 웹 |  | discovery_recommend_keywords · 현행 유지 | 96 · 제안 개명 |  |
| `shuffle_bundle` | 추천 · 키워드 묶음 결과 | 화면 |  | shuffle_bundle · 현행 유지 | 95 · 제안 개명 |  |
| `discovery_recommend_network` | 추천 · 인맥 둘러보기(웹) | 웹 |  | discovery_recommend_network · 현행 유지 | 115 · 제안 개명 |  |
| `user_detail` ★ | 크리에이터 · 프로필(타인) | 화면 | screen_id=회원 uid · tab=portfolio／project／inspiration／intro | user_detail · 현행 유지 | 69 70 100 · 통합 발송 | 검색 결과 페이저(100행)도 같은 화면. 좌우로 넘겨 회원이 바뀌면 다시 발송(AOS 현행 규칙). 소개 탭(70행)은 tab=intro. |
| `member_profile_inspiration` | 크리에이터 · 인스퍼레이션 탭(현행 특례) | 탭 |  | member_profile_inspiration · 현행 유지 | 추가 | AOS가 이 탭만 별도 이름으로 발송 중입니다. 바꾸지 않고 iOS도 인스퍼레이션 탭 표시 시 같은 이름을 발송합니다. 다른 탭은 user_detail의 tab 파라미터. |
| `relation_list` | 크리에이터 · 관계 목록(일촌·팔로워·팔로잉) | 시트 | tab=first_connections／follower／following | 확인 | 218 · 통합 발송 | 타인의 관계 목록. 내 인맥(contacts_*)과 구분합니다. |
| `first_connection_mutual` | 크리에이터 · 함께 아는 일촌 | 시트 |  | 확인 | 219 · 제안 채택 |  |
| `knock_type_select` | 노크 · 용건 선택 | 화면 |  | 확인 | 220 · 제안 채택 | AOS 8종 피커 구현 시 같은 이름. |
| `knock_compose` | 노크 · 메시지 입력 | 화면 |  | 추가 | 확인 |  |
| `report_reason` | 신고 · 사유 선택 | 시트 | target_type=user／content／chat_room | 추가 | 126 207 221 · 통합 발송 |  |
| `report_detail_input` | 신고 · 상세 사유 입력 | 화면 | target_type | 추가 | 127 206 · 통합 발송 |  |
| `my_profile_card` ★ | MY · 내 프로필 카드(탭 루트) | 탭 |  | my_profile_card · 현행 유지(체류 추가) · 진입만 | 53 · 현행 유지 | AOS는 MY 탭 진입 시 my_page와 my_profile_card가 함께 나가 화면 수가 부풀려집니다. my_page를 멈추고 이 이름 하나로 3종 발송합니다. |
| `my_profile_preview` | MY · 프로필 미리보기(웹) | 웹 |  | my_profile_preview · 현행 유지 | 57 · 제안 채택 |  |
| `visitor_today_bottom_sheet` | MY · 오늘 방문자 | 시트 |  | visitor_today_bottom_sheet · 현행 유지 | 85 · 제안 개명 |  |
| `profile_collaboration_status` | MY · 노크 수신 설정 | 시트 |  | 확인 | 82 · 제안 채택 |  |
| `my_info_management` | 내 정보 · 관리 홈 | 화면 |  | 추가 | 75 · 제안 개명 | iOS 제안 basic_info_*는 AOS 현행 basic_info_*(가입 필수정보)와 키가 겹쳐 내 정보 수정 화면군은 my_info_* 접두어로 새로 짓습니다. |
| `my_info_id` | 내 정보 · ID 변경 | 화면 |  | 추가 | 55 · 제안 개명 |  |
| `my_info_name` | 내 정보 · 이름 종류 선택 | 시트 |  | 해당 없음 | 86 · 제안 개명 |  |
| `my_info_name_ko` | 내 정보 · 한글 이름 | 화면 |  | 추가 | 72 · 제안 개명 |  |
| `my_info_name_en` | 내 정보 · 영문 이름 | 화면 |  | 추가 | 62 · 제안 개명 |  |
| `my_info_profession` | 내 정보 · 직업 관리 | 화면 |  | 해당 없음 | 65 · 제안 개명 |  |
| `my_info_profession_select` | 내 정보 · 직업 선택 | 화면 |  | 추가 | 78 · 제안 개명 |  |
| `my_info_profession_direct` | 내 정보 · 직업 직접 추가 | 시트 |  | 해당 없음 | 89 · 제안 개명 |  |
| `my_info_signature_keyword` | 내 정보 · 시그니처 키워드 | 화면 |  | 추가 | 61 · 보류(도달 불가) |  |
| `my_info_signature_keyword_register` | 내 정보 · 시그니처 키워드 등록 | 화면 |  | 확인 | 60 · 보류(도달 불가) |  |
| `my_info_region` | 내 정보 · 활동 지역 | 화면 |  | 추가 | 74 · 제안 개명 |  |
| `my_info_region_global_city` | 내 정보 · 해외 도시 입력 | 화면 |  | 추가 | 73 · 제안 개명 |  |
| `my_info_email` | 내 정보 · 이메일 관리 | 시트 |  | 해당 없음 | 87 · 제안 개명 |  |
| `my_info_email_register` | 내 정보 · 이메일 입력 | 화면 |  | 추가 | 76 · 제안 개명 |  |
| `my_info_email_verify` | 내 정보 · 이메일 인증 | 화면 |  | 추가 | 63 · 제안 개명 |  |
| `my_info_phone` | 내 정보 · 전화번호 관리 | 시트 |  | 해당 없음 | 88 · 제안 개명 |  |
| `my_info_phone_register` | 내 정보 · 전화번호 입력 | 화면 |  | 추가 | 64 · 제안 개명 |  |
| `my_info_link` | 내 정보 · 링크 관리 | 시트 |  | 해당 없음 | 83 · 제안 개명 |  |
| `my_info_link_register` | 내 정보 · 링크 입력 | 화면 |  | 추가 | 58 · 제안 개명 |  |
| `my_info_birth_gender` | 내 정보 · 생년월일·성별 | 시트 |  | 해당 없음 | 84 · 제안 개명 |  |
| `my_info_visibility` | 내 정보 · 개인정보 공개설정 | 시트 |  | 확인 | 81 · 제안 개명 |  |
| `my_info_profile_image_register` | 내 정보 · 프로필 사진 등록 | 화면 |  | 확인 | 80 · 보류(도달 불가) |  |
| `register_email` | 계정 · 이메일 강제 등록 | 화면 |  | 확인 | 77 · 제안 채택 |  |
| `user_resume` | 커리어 · 이력 관리(내 이력서) | 화면 |  | user_resume · 현행 유지 | 66 · 제안 개명 | 이름은 타인 이력서처럼 읽히지만 내 이력 관리 화면입니다. 바꾸지 않고 라벨로 바로잡습니다. |
| `resume_career_register` | 커리어 · 경력 입력 | 화면 |  | 추가 | 56 · 제안 채택 |  |
| `resume_education_register` | 커리어 · 학력 입력 | 화면 |  | 추가 | 71 · 제안 채택 |  |
| `resume_awards_register` | 커리어 · 자격·수상 입력 | 화면 |  | 추가 | 59 · 제안 채택 |  |
| `media_image_edit` | 첨부 · 이미지 편집(자르기·회전) | 화면 | purpose=upload／profile_image／card_background | 추가 | 179 200 201 215 216 224 · 통합 발송 |  |
| `media_video_edit` | 첨부 · 동영상 편집(구간 자르기) | 화면 | purpose | 추가 | 214 217 · 통합 발송 |  |
| `portfolio_create` ★ | 작업물 · 종류 선택(신규 진입) | 화면 |  | portfolio_create · 현행 유지 | 188 · 통합 발송 | iOS 188행(포트폴리오 작성)은 종류를 고르기 전에는 portfolio_create, 고른 뒤에는 유형별 *_portfolio_create를 발송합니다. |
| `text_portfolio_create` | 작업물 · 텍스트 작성 | 화면 |  | text_portfolio_create · 현행 유지 | 188 · 단계별 발송 |  |
| `img_portfolio_create` ★ | 작업물 · 이미지 작성 | 화면 |  | img_portfolio_create · 현행 유지 | 188 · 단계별 발송 |  |
| `video_portfolio_create` | 작업물 · 영상 작성 | 화면 |  | video_portfolio_create · 현행 유지 | 188 · 단계별 발송 |  |
| `audio_portfolio_create` | 작업물 · 오디오 작성 | 화면 |  | audio_portfolio_create · 현행 유지 | 188 · 단계별 발송 |  |
| `pdf_portfolio_create` | 작업물 · PDF 작성 | 화면 |  | pdf_portfolio_create · 현행 유지 | 188 · 단계별 발송 |  |
| `youtube_portfolio_create` | 작업물 · 유튜브 작성 | 화면 |  | youtube_portfolio_create · 현행 유지 | 188 · 단계별 발송 |  |
| `text_portfolio_edit` | 작업물 · 텍스트 수정 | 화면 |  | text_portfolio_edit · 현행 유지 | 187 · 단계별 발송 | iOS 187행(포트폴리오 수정)은 작업물 유형에 따라 6개 이름 중 하나를 발송합니다. |
| `img_portfolio_edit` | 작업물 · 이미지 수정 | 화면 |  | img_portfolio_edit · 현행 유지 | 187 · 단계별 발송 |  |
| `video_portfolio_edit` | 작업물 · 영상 수정 | 화면 |  | video_portfolio_edit · 현행 유지 | 187 · 단계별 발송 |  |
| `audio_portfolio_edit` | 작업물 · 오디오 수정 | 화면 |  | audio_portfolio_edit · 현행 유지 | 187 · 단계별 발송 |  |
| `pdf_portfolio_edit` | 작업물 · PDF 수정 | 화면 |  | pdf_portfolio_edit · 현행 유지 | 187 · 단계별 발송 |  |
| `youtube_portfolio_edit` | 작업물 · 유튜브 수정 | 화면 |  | youtube_portfolio_edit · 현행 유지 | 187 · 단계별 발송 |  |
| `project_card_create` ★ | 프로젝트 카드 · 작성 | 화면 |  | project_card_create · 현행 유지 | 190 · 제안 개명 |  |
| `project_card_edit` | 프로젝트 카드 · 수정 | 화면 |  | project_card_edit · 현행 유지 | 189 · 제안 개명 |  |
| `inspiration_create` ★ | 영감 · 작성 | 화면 |  | inspiration_create · 현행 유지 | 186 · 제안 채택 |  |
| `inspiration_edit` | 영감 · 수정 | 화면 |  | inspiration_edit · 현행 유지 | 185 · 제안 채택 |  |
| `chatty` ★ | 채티 · 목록(탭) | 탭 | tab=chat／lounge／project | chatty · 현행 유지 | 108 109 110 111 · 통합 발송 | 채팅·라운지·프로젝트 하위탭은 같은 목록의 필터로 보고 tab 파라미터로 나눕니다. 탭 전환마다 tab 값을 바꿔 다시 발송합니다. |
| `chat_room_direct` ★ | 채티 · 1:1 대화방 | 화면 | screen_id=roomId | 추가 | 118 · 통합 발송 | AOS는 대화방에 이름이 없다(탭까지만). 대화방 유형은 경로 분석에서 갈라 봐야 하므로 이름으로 나눕니다. |
| `chat_room_lounge` | 채티 · 라운지 대화방 | 화면 | screen_id=roomId | 추가 | 118 · 통합 발송 |  |
| `chat_room_project` ★ | 채티 · 프로젝트 대화방 | 화면 | screen_id=roomId | 추가 | 118 · 통합 발송 |  |
| `chat_room_team` | 채티 · 팀 대화방 | 화면 | screen_id=roomId | 추가 | 118 · 통합 발송 |  |
| `chat_room_menu` | 채티 · 대화방 메뉴 | 화면 | room_type=direct／lounge／project／team | 추가 | 119 · 제안 채택 |  |
| `lounge_create` | 라운지 · 만들기 | 화면 |  | 추가 | 112 · 제안 채택 |  |
| `lounge_edit` | 라운지 · 수정 | 화면 |  | 추가 | 113 · 제안 채택 |  |
| `notification_center` ★ | 알림 · 내 알림 | 화면 |  | 추가 | 114 · 제안 개명 |  |
| `contacts_first_connections` ★ | 인맥 · 일촌 | 탭 |  | contacts_first_connections · 현행 유지(체류 추가) · 진입만 | 134 · 현행 유지 |  |
| `contacts_follower` | 인맥 · 팔로워 | 탭 |  | contacts_follower · 현행 유지(체류 추가) · 진입만 | 135 · 현행 유지 |  |
| `contacts_following` | 인맥 · 팔로잉 | 탭 |  | contacts_following · 현행 유지(체류 추가) · 진입만 | 136 · 현행 유지 |  |
| `contacts_my_club` | 인맥 · 마이클럽 | 탭 |  | 확인 | 137 · 제안 채택 |  |
| `contacts_search` | 인맥 · 검색 | 화면 | tab=first_connections／follower／following | 추가 | 130 131 132 133 · 통합 발송 |  |
| `project_detail` ★ | 프로젝트 · 상세 | 화면 | screen_id=프로젝트 id | project_detail · 현행 유지 | 68 · 현행 유지 |  |
| `project_card_list` | 프로젝트 · 목록(딥링크) | 화면 |  | 추가 | 67 · 제안 채택 |  |
| `project_application_compose` | 프로젝트 · 지원 작성 | 화면 |  | 추가 | 79 · 제안 채택 |  |
| `project_applicants` | 프로젝트 · 지원자 목록 | 화면 |  | 추가 | 116 · 제안 채택 |  |
| `proposal_detail` ★ | 협업 제안 · 상세(웹) | 웹 |  | proposal_detail · 현행 유지 | 확인 | iOS는 제안 상세가 web_page 안에 묻히지 않도록 전용 이름으로 발송합니다. |
| `proposal_create` | 협업 제안 · 작성(웹) | 웹 |  | proposal_create · 이름만→발송 | 203 · 통합 발송 | AOS는 이름만 있고 screen_view가 없어 조회수가 안 잡힙니다. iOS 203행(잠금 바텀시트 웹뷰)은 작성/수정 모드에 따라 두 이름. |
| `proposal_edit` | 협업 제안 · 수정(웹) | 웹 |  | proposal_edit · 이름만→발송 | 203 · 통합 발송 |  |
| `contacts_team` | 팀 · 팀 홈(AOS 현행) | 화면 |  | contacts_team · 현행 유지 | 해당 없음 | AOS 팀 홈과 iOS team_list가 같은 화면으로 보이나 두 이름이 이미 발송 중입니다. 코드는 두지 않고 대시보드 별칭으로 합칩니다. 다음 큰 개편 때 하나로 수렴(팀 결정). |
| `team_list` ★ | 팀 · 내 팀과 합류 요청(iOS 현행) | 화면 |  | 해당 없음 | 141 · 현행 유지 |  |
| `team_detail` ★ | 팀 · 상세 | 화면 | screen_id=teamId · tab=portfolio／introduction／member | 추가 | 142 143 144 · 통합 발송 |  |
| `team_create` | 팀 · 만들기 | 화면 |  | 추가 | 139 · 제안 채택 |  |
| `team_edit` | 팀 · 수정 | 화면 |  | 추가 | 145 · 제안 채택 |  |
| `team_invite` | 팀 · 멤버 초대 | 화면 |  | 추가 | 140 · 제안 채택 |  |
| `my_page_menu` ★ | 설정 · 홈 | 화면 |  | my_page_menu · 현행 유지 | 162 · 제안 개명 | 설정 홈이지만 AOS 현행 이름이 my_page_menu라 그대로 쓰고 라벨로 바로잡습니다. |
| `setting_account` | 설정 · 계정 | 화면 |  | 추가 | 151 · 제안 채택 |  |
| `setting_notification` | 설정 · 알림 | 화면 |  | 추가 | 163 · 제안 채택 |  |
| `setting_visibility` | 설정 · 공개 범위 | 화면 |  | 추가 | 155 · 제안 채택 |  |
| `setting_visibility_profile` | 설정 · 프로필 공개 범위 | 화면 |  | 추가 | 167 · 제안 채택 |  |
| `setting_blocked_members` | 설정 · 차단한 사용자 | 화면 |  | 추가 | 165 · 제안 채택 |  |
| `setting_change_password` | 설정 · 비밀번호 변경 | 화면 |  | 추가 | 173 · 제안 채택 |  |
| `setting_2fa` | 설정 · 2단계 인증 | 화면 |  | 추가 | 146 · 제안 채택 |  |
| `setting_2fa_email` | 설정 · 인증 이메일 관리 | 화면 |  | 추가 | 148 · 제안 채택 |  |
| `setting_2fa_email_verify` | 설정 · 인증 이메일 확인 | 화면 |  | 추가 | 168 · 제안 채택 |  |
| `setting_2fa_completed` | 설정 · 2단계 인증 완료 | 화면 |  | 추가 | 147 · 제안 채택 |  |
| `setting_personal_info_agreement` | 설정 · 개인정보 이용 동의·철회 | 화면 | agree=true／false | 해당 없음 | 149 150 · 통합 발송 |  |
| `setting_account_delete_password` | 회원 탈퇴 · 본인 확인 | 화면 |  | 추가 | 152 · 제안 채택 |  |
| `setting_account_delete_reason` | 회원 탈퇴 · 사유 | 시트 |  | 추가 | 178 176 · 통합 발송 | 기타 사유 직접 입력(176행)은 같은 화면의 단계. |
| `setting_account_delete_confirm` | 회원 탈퇴 · 최종 확인 | 화면 |  | 추가 | 153 · 제안 채택 |  |
| `setting_customer_service` | 고객센터 | 화면 |  | 추가 | 154 · 제안 채택 |  |
| `service_agreement` | 설정 · 서비스 동의(약관 목록) | 화면 |  | service_agreement · 현행 유지 | 161 · 제안 개명 |  |
| `setting_muse_privileges` | Muse 특권 안내(웹) | 웹 |  | 확인 | 169 · 제안 채택 |  |
| `setting_contents` | 내 활동 · 모아보기 | 화면 |  | 추가 | 166 · 제안 채택 |  |
| `setting_contents_comments` | 내 활동 · 댓글과 답글 | 화면 |  | 추가 | 156 · 제안 채택 |  |
| `setting_contents_respected` | 내 활동 · 리스펙트한 작업물 | 화면 |  | 추가 | 157 · 제안 채택 |  |
| `setting_contents_liked` | 내 활동 · 좋아요한 콘텐츠 | 화면 |  | 추가 | 164 · 제안 채택 |  |
| `bookmark_creator` | 북마크 · 크리에이터 | 탭 |  | bookmark_creator · 현행 유지(체류 추가) · 진입만 | 158 · 현행 유지 |  |
| `bookmark_portfolio` ★ | 북마크 · 포트폴리오 | 탭 |  | bookmark_portfolio · 현행 유지(체류 추가) · 진입만 | 159 · 현행 유지 |  |
| `web_page` | 웹 · 전용 이름 없는 웹 페이지 | 웹 | web_path=ID를 뺀 경로 | 확인 | 195 196 204 205 · 통합 발송 | 전용 이름이 있는 웹 목적지(제안·추천·미리보기·약관·클럽)는 여기로 보내지 않습니다. 남는 웹뷰만 web_path와 함께 발송합니다. |
| `club_waiting_web` | 클럽 · 대기 랜딩(웹) | 웹 |  | 확인 | 197 · 제안 채택 |  |
| `club_entry_web` | 클럽 · 입장 랜딩(웹) | 웹 |  | 확인 | 198 · 제안 채택 |  |
| `card_game_boss` | 아케이드 · 카드 보스전 | 화면 |  | 확인 | 231 · 제안 채택 |  |
| `card_game_breakout` | 아케이드 · 블록깨기 | 화면 |  | 확인 | 232 · 제안 채택 |  |

## AOS 현행 이름 처분 (65개)

| AOS 현행 | 확정 | 라벨 | 할 일 | 발송 | 비고 |
|---|---|---|---|---|---|
| home | home | 홈 · 디스커버리 피드 | 현행 유지 | 3종 |  |
| finder | finder | 파인더 · 탭 홈 | 현행 유지 | 3종 |  |
| finder_search | finder_search | 파인더 · 검색 입력 | 현행 유지 | 3종 |  |
| chatty | chatty | 채티 · 목록(탭) | 현행 유지 | 3종 | 채팅·라운지·프로젝트 하위탭은 같은 목록의 필터로 보고 tab 파라미터로 나눕니다. 탭 전환마다 tab 값을 바꿔 다시 발송합니다. |
| my_page |  |  | 제거(중복) | 3종 | MY 탭 진입 시 my_profile_card와 동시에 나갑니다. 멈추고 my_profile_card만 3종으로 발송합니다. 대시보드는 my_page를 my_profile_card 별칭으로 합칩니다. |
| finder_result_creator | finder_result_creator | 파인더 · 크리에이터 검색 결과 | 현행 유지 | 3종 |  |
| finder_result_portfolio | finder_result_portfolio | 파인더 · 포트폴리오 검색 결과 | 현행 유지 | 3종 |  |
| finder_result_project | finder_result_project | 파인더 · 프로젝트 검색 결과 | 현행 유지 | 3종 |  |
| user_detail | user_detail | 크리에이터 · 프로필(타인) | 현행 유지 | 3종 | 검색 결과 페이저(100행)도 같은 화면. 좌우로 넘겨 회원이 바뀌면 다시 발송(AOS 현행 규칙). 소개 탭(70행)은 tab=intro. |
| portfolio_detail | portfolio_detail | 포트폴리오 · 상세 | 현행 유지 | 3종 |  |
| inspiration_detail | inspiration_detail | 영감 · 상세 | 현행 유지 | 3종 |  |
| project_detail | project_detail | 프로젝트 · 상세 | 현행 유지 | 3종 |  |
| proposal_detail | proposal_detail | 협업 제안 · 상세(웹) | 현행 유지 | 3종 | iOS는 제안 상세가 web_page 안에 묻히지 않도록 전용 이름으로 발송합니다. |
| my_profile_card | my_profile_card | MY · 내 프로필 카드(탭 루트) | 현행 유지(체류 추가) | 진입만 | AOS는 MY 탭 진입 시 my_page와 my_profile_card가 함께 나가 화면 수가 부풀려집니다. my_page를 멈추고 이 이름 하나로 3종 발송합니다. |
| my_profile_preview | my_profile_preview | MY · 프로필 미리보기(웹) | 현행 유지 | 3종 |  |
| my_page_menu | my_page_menu | 설정 · 홈 | 현행 유지 | 3종 | 설정 홈이지만 AOS 현행 이름이 my_page_menu라 그대로 쓰고 라벨로 바로잡습니다. |
| user_resume | user_resume | 커리어 · 이력 관리(내 이력서) | 현행 유지 | 3종 | 이름은 타인 이력서처럼 읽히지만 내 이력 관리 화면입니다. 바꾸지 않고 라벨로 바로잡습니다. |
| visitor_today_bottom_sheet | visitor_today_bottom_sheet | MY · 오늘 방문자 | 현행 유지 | 3종 |  |
| service_agreement | service_agreement | 설정 · 서비스 동의(약관 목록) | 현행 유지 | 3종 |  |
| pending_agreement_detail | pending_agreement_detail | 갱신 약관 · 재동의 | 현행 유지 | 3종 | AOS는 약관 웹 상세+동의 화면, iOS는 재동의 카드 팝업. 목적(개정 약관 재동의)이 같아 한 이름. |
| shuffle_bundle | shuffle_bundle | 추천 · 키워드 묶음 결과 | 현행 유지 | 3종 |  |
| member_profile_inspiration | member_profile_inspiration | 크리에이터 · 인스퍼레이션 탭(현행 특례) | 현행 유지 | 3종 | AOS가 이 탭만 별도 이름으로 발송 중입니다. 바꾸지 않고 iOS도 인스퍼레이션 탭 표시 시 같은 이름을 발송합니다. 다른 탭은 user_detail의 tab 파라미터. |
| bookmark_creator | bookmark_creator | 북마크 · 크리에이터 | 현행 유지(체류 추가) | 진입만 |  |
| bookmark_portfolio | bookmark_portfolio | 북마크 · 포트폴리오 | 현행 유지(체류 추가) | 진입만 |  |
| contacts_first_connections | contacts_first_connections | 인맥 · 일촌 | 현행 유지(체류 추가) | 진입만 |  |
| contacts_follower | contacts_follower | 인맥 · 팔로워 | 현행 유지(체류 추가) | 진입만 |  |
| contacts_following | contacts_following | 인맥 · 팔로잉 | 현행 유지(체류 추가) | 진입만 |  |
| contacts_team | contacts_team | 팀 · 팀 홈(AOS 현행) | 현행 유지 | 3종 | AOS 팀 홈과 iOS team_list가 같은 화면으로 보이나 두 이름이 이미 발송 중입니다. 코드는 두지 않고 대시보드 별칭으로 합칩니다. 다음 큰 개편 때 하나로 수렴(팀 결정). |
| discovery_recommend_keywords | discovery_recommend_keywords | 추천 · Shuffle! 키워드 추천(웹) | 현행 유지 | 3종 |  |
| discovery_recommend_network | discovery_recommend_network | 추천 · 인맥 둘러보기(웹) | 현행 유지 | 3종 |  |
| app_entry | app_entry | 앱 실행 · 스플래시 | 현행 유지 | 3종 |  |
| signup_method | signup_method | 로그인·가입 · 방법 선택 | 현행 유지 | 3종 |  |
| signup_terms | signup_terms | 가입 · 약관 동의 | 현행 유지 | 3종 |  |
| portfolio_create | portfolio_create | 작업물 · 종류 선택(신규 진입) | 현행 유지 | 3종 | iOS 188행(포트폴리오 작성)은 종류를 고르기 전에는 portfolio_create, 고른 뒤에는 유형별 *_portfolio_create를 발송합니다. |
| text_portfolio_create | text_portfolio_create | 작업물 · 텍스트 작성 | 현행 유지 | 3종 |  |
| img_portfolio_create | img_portfolio_create | 작업물 · 이미지 작성 | 현행 유지 | 3종 |  |
| video_portfolio_create | video_portfolio_create | 작업물 · 영상 작성 | 현행 유지 | 3종 |  |
| audio_portfolio_create | audio_portfolio_create | 작업물 · 오디오 작성 | 현행 유지 | 3종 |  |
| pdf_portfolio_create | pdf_portfolio_create | 작업물 · PDF 작성 | 현행 유지 | 3종 |  |
| youtube_portfolio_create | youtube_portfolio_create | 작업물 · 유튜브 작성 | 현행 유지 | 3종 |  |
| text_portfolio_edit | text_portfolio_edit | 작업물 · 텍스트 수정 | 현행 유지 | 3종 | iOS 187행(포트폴리오 수정)은 작업물 유형에 따라 6개 이름 중 하나를 발송합니다. |
| img_portfolio_edit | img_portfolio_edit | 작업물 · 이미지 수정 | 현행 유지 | 3종 |  |
| video_portfolio_edit | video_portfolio_edit | 작업물 · 영상 수정 | 현행 유지 | 3종 |  |
| audio_portfolio_edit | audio_portfolio_edit | 작업물 · 오디오 수정 | 현행 유지 | 3종 |  |
| pdf_portfolio_edit | pdf_portfolio_edit | 작업물 · PDF 수정 | 현행 유지 | 3종 |  |
| youtube_portfolio_edit | youtube_portfolio_edit | 작업물 · 유튜브 수정 | 현행 유지 | 3종 |  |
| project_card_create | project_card_create | 프로젝트 카드 · 작성 | 현행 유지 | 3종 |  |
| project_card_edit | project_card_edit | 프로젝트 카드 · 수정 | 현행 유지 | 3종 |  |
| inspiration_create | inspiration_create | 영감 · 작성 | 현행 유지 | 3종 |  |
| inspiration_edit | inspiration_edit | 영감 · 수정 | 현행 유지 | 3종 |  |
| basic_info_id | basic_info_id | 가입 · ID 입력 | 현행 유지 | 3종 |  |
| basic_info_ko_name | basic_info_ko_name | 가입 · 이름 입력(한글) | 현행 유지 | 3종 | iOS 가입 이름 입력은 1단계입니다. 한글 이름 단계로 간주하되 iOS 리드가 확인합니다. |
| basic_info_en_name | basic_info_en_name | 가입 · 영문 이름 | 현행 유지 | 3종 | iOS 가입 흐름에 영문 이름 단계 없음(확인). |
| basic_info_jobs | basic_info_jobs | 가입 · 직업 선택 | 현행 유지 | 3종 | iOS는 커버 온보딩의 직업 단계(onboarding_cover_intro_profession)와 대응 가능성. 구간 롤업으로 비교. |
| basic_info_keyword_personal | basic_info_keyword_personal | 가입 · 키워드(성향) | 현행 유지 | 3종 | iOS는 자기소개 만들기(profile_expression_onboarding) 안 단계. 구간 롤업으로 비교. |
| basic_info_keyword_working_preference | basic_info_keyword_working_preference | 가입 · 키워드(업무 성향) | 현행 유지 | 3종 |  |
| basic_info_keyword_ambition | basic_info_keyword_ambition | 가입 · 키워드(목표) | 현행 유지 | 3종 |  |
| onboarding_cover_intro_profession | onboarding_cover_intro_profession | 커버 소개 · 직업 | 현행 유지(체류 추가) | 진입만 |  |
| onboarding_cover_intro_nickname | onboarding_cover_intro_nickname | 커버 소개 · 닉네임 | 현행 유지(체류 추가) | 진입만 |  |
| onboarding_cover_intro_ko_name | onboarding_cover_intro_ko_name | 커버 소개 · 한글 이름 | 현행 유지(체류 추가) | 진입만 |  |
| onboarding_cover_intro_tagline | onboarding_cover_intro_tagline | 커버 소개 · 한 줄 소개 | 현행 유지(체류 추가) | 진입만 |  |
| onboarding_cover_intro_media | onboarding_cover_intro_media | 커버 소개 · 미디어 | 현행 유지(체류 추가) | 진입만 |  |
| onboarding_cover_intro_profile_image | onboarding_cover_intro_profile_image | 커버 소개 · 프로필 이미지 | 현행 유지(체류 추가) | 진입만 | iOS 25행(프로필 커버 만들기)은 딥링크 step= 값이 있는 단계형 화면이므로 단계마다 위 6개 이름을 발송합니다. 단계 구성이 다르면 없는 단계는 비웁니다. |
| proposal_create | proposal_create | 협업 제안 · 작성(웹) | 이름만→발송 | 이름만 | AOS는 이름만 있고 screen_view가 없어 조회수가 안 잡힙니다. iOS 203행(잠금 바텀시트 웹뷰)은 작성/수정 모드에 따라 두 이름. |
| proposal_edit | proposal_edit | 협업 제안 · 수정(웹) | 이름만→발송 | 이름만 |  |

## iOS 화면 목록 처분 (232행)

| No | 화면 | 유형 | 제안·현행명 | 판정 | 확정 screen_name | 분류 | 사유·대응 |
|---|---|---|---|---|---|---|---|
| 1 | 서비스 점검 안내 | fullScreenCover | maintenance | 채택 | maintenance | 제안 채택 |  |
| 2 | 스플래시 | fullScreenCover | splash | 채택 | app_entry | 제안 개명 | splash → app_entry |
| 3 | 접근 권한 안내 | fullScreenCover | onboarding_permission | 채택 | onboarding_permission | 제안 채택 |  |
| 4 | 개인정보 이용 재동의 약관 전문 | sheet | personal_info_reconsent_document | 채택 | agreement_document | 통합 발송 | → agreement_document |
| 5 | 강제 로그아웃 안내 | 팝업 | app_force_logout | 제외 |  | 확인·안내 팝업 | 버튼 하나로 닫히는 알림. 필요하면 이벤트(예: app_update_gate)로 셉니다. |
| 6 | 강제 업데이트 안내 | 팝업 | app_force_update | 제외 |  | 확인·안내 팝업 | 버튼 하나로 닫히는 알림. 필요하면 이벤트(예: app_update_gate)로 셉니다. |
| 7 | 개인정보 수집 및 이용 동의 안내 | 팝업 | personal_info_agreement | 채택 | pending_agreement_detail | 제안 개명 | personal_info_agreement → pending_agreement_detail |
| 8 | 권장 업데이트 안내 | 팝업 | app_recommended_update | 제외 |  | 확인·안내 팝업 | 버튼 하나로 닫히는 알림. 필요하면 이벤트(예: app_update_gate)로 셉니다. |
| 9 | 커버 등록 유도 팝업 (업로드 전 프로필 커버 등록) | 팝업 | upload_cover_required_popup | 제외 |  | 유도·완료 팝업 | 행동의 결과 알림. 완료는 행동 이벤트로 이미 잡힙니다. |
| 10 | 포트폴리오 등록 완료 팝업 | 팝업 | portfolio_registered_popup | 제외 |  | 유도·완료 팝업 | 행동의 결과 알림. 완료는 행동 이벤트로 이미 잡힙니다. |
| 11 | 비밀번호 설정 / 재설정 입력 | push | signup_password | 채택 | signup_password | 제안 채택 |  |
| 12 | 사용자 ID 만들기 | push | signup_user_id | 채택 | basic_info_id | 제안 개명 | signup_user_id → basic_info_id |
| 13 | 이름 입력하기 (회원가입 완료) | push | signup_name | 채택 | basic_info_ko_name | 제안 개명 | signup_name → basic_info_ko_name |
| 14 | 이메일 로그인 (이메일 입력 → 비밀번호 입력) | push | login_email | 채택 | login_email | 제안 채택 |  |
| 15 | 이메일 인증번호 입력 | push | signup_email_verification | 채택 | signup_email_verification | 제안 채택 |  |
| 16 | 2단계 인증 이메일 코드 입력 | fullScreenCover | login_2fa_email | 채택 | login_2fa_email | 제안 채택 |  |
| 17 | 로그인·가입 랜딩 (소셜/이메일 선택) | fullScreenCover | join_landing | 채택 | signup_method | 제안 개명 | join_landing → signup_method |
| 18 | 튜토리얼 완료 (입장 영상) | fullScreenCover | onboarding_tutorial_complete | 채택 | onboarding_tutorial_complete | 제안 채택 |  |
| 19 | 튜토리얼 인트로 (온보딩 가이드) | fullScreenCover | tutorial_intro | 채택 | onboarding_tutorial | 제안 개명 | tutorial_intro → onboarding_tutorial |
| 20 | 가입 약관 전문 보기 (동의 시트 위 전체 높이 시트) | sheet | signup_terms_document | 채택 | agreement_document | 통합 발송 | → agreement_document |
| 21 | 이용약관 동의 바텀시트 (가입) | sheet | signup_terms | 채택 | signup_terms | 현행 유지 |  |
| 22 | 자기소개 만들기 (키워드·이미지·소개글 온보딩) | fullScreenCover | profile_expression_onboarding | 채택 | profile_expression_onboarding | 제안 채택 |  |
| 23 | 자기소개 수정 | fullScreenCover | profile_expression_edit | 채택 | profile_expression_edit | 제안 채택 |  |
| 24 | 자기소개(표현) 편집 — 첨부 이미지 전체보기 | fullScreenCover | profile_expression_image_viewer | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 25 | 프로필 커버 만들기 (첫 온보딩) | fullScreenCover | profile_cover_onboarding | 채택 | onboarding_cover_intro_profession · onboarding_cover_intro_nickname · onboarding_cover_intro_ko_name · onboarding_cover_intro_tagline · onboarding_cover_intro_media · onboarding_cover_intro_profile_image | 단계별 발송 | → onboarding_cover_intro_profession, onboarding_cover_intro_nickname, onboarding_cover_intro_ko_name, onboarding_cover_intro_tagline, onboarding_cover_intro_media, onboarding_cover_intro_profile_image |
| 26 | 프로필 커버 만들기 — 첨부 동영상 전체화면 재생 | fullScreenCover | profile_cover_video_player | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 27 | 프로필 커버 만들기 — 첨부 이미지 전체보기 | fullScreenCover | profile_cover_image_viewer | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 28 | 프로필 커버 수정 | fullScreenCover | profile_cover_edit | 채택 | profile_cover_edit | 제안 채택 |  |
| 29 | 자기소개 이미지 선택 (시스템 피커) | sheet | profile_expression_photo_picker | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 30 | 홈(디스커버리 피드) 탭 | 탭 루트 | home | 채택 | home | 현행 유지 |  |
| 31 | Muse 한 마디 목록 | push | muse_comment_list | 채택 | muse_comment_list | 제안 채택 |  |
| 32 | 디스커버리 크리에이터 모듈 전체보기 | push | discovery_creator_module | 채택 | discovery_creator_module | 제안 채택 |  |
| 33 | 영감 목록 | push | inspiration_list | 채택 | inspiration_list | 제안 채택 |  |
| 34 | 영감 상세 | push | inspiration_detail | 채택 | inspiration_detail | 현행 유지 |  |
| 35 | 포트폴리오 상세 | push | portfolio_detail | 채택 | portfolio_detail | 현행 유지 |  |
| 36 | 포트폴리오 사진 전체보기 뷰어 | fullScreenCover | portfolio_image_viewer | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 37 | Muse 한 마디 관리 시트 | sheet | muse_comment_manage | 채택 | muse_comment_manage | 제안 채택 |  |
| 38 | Muse 한 마디 작성/수정 시트 | sheet | muse_comment_input | 채택 | muse_comment_input | 제안 채택 |  |
| 39 | 내 영감 옵션 시트 (수정·삭제·공유) | sheet | inspiration_option_owner | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 40 | 내 작업물 소유자 액션 시트 (대표작·수정·삭제·공유) | sheet | portfolio_option_owner | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 41 | 내 포트폴리오 옵션 (수정·삭제) | sheet | home_portfolio_option_my | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 42 | 내 프로젝트 카드 더보기 (수정·삭제·공유) | sheet | home_project_card_option_my | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 43 | 영감 댓글 바텀시트 (디스커버리 카드) | sheet | home_inspiration_comment | 채택 | inspiration_comment_list | 통합 발송 | → inspiration_comment_list |
| 44 | 영감 상세 댓글 바텀시트 | sheet | inspiration_detail_comment | 채택 | inspiration_comment_list | 통합 발송 | → inspiration_comment_list |
| 45 | 타인 영감 옵션 시트 (프로필 저장·공유·차단·신고) | sheet | inspiration_option_other | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 46 | 타인 포트폴리오 더보기 옵션 시트 | sheet | portfolio_option_other | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 47 | 포트폴리오 댓글 바텀시트 (디스커버리 카드) | sheet | home_portfolio_comment | 채택 | portfolio_comment_list | 통합 발송 | → portfolio_comment_list |
| 48 | 포트폴리오 상세 댓글 바텀시트 | sheet | portfolio_detail_comment | 채택 | portfolio_comment_list | 통합 발송 | → portfolio_comment_list |
| 49 | 리스펙트 한마디 고르기 | 팝업 | portfolio_respect_phrase | 채택 | respect_select | 제안 개명 | portfolio_respect_phrase → respect_select |
| 50 | 카드 롱프레스 액션 오버레이 | 팝업 | home_card_long_press | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 51 | 상세를 열 수 없어요 (탐색 세션 만료 안내) | push | detail_browse_unavailable | 제외 |  | 오류 상태 | 같은 목적지의 오류 문구. 오류 이벤트로 셉니다. |
| 52 | 콘텐츠 상세 페이저 (스와이프 브라우징 컨테이너) | push | - | 제외 |  | 컨테이너 | 안에 든 화면이 이름을 냅니다. 컨테이너는 이름을 내지 않습니다. |
| 53 | MY 탭 (내 프로필 루트) | 탭 루트 | my_profile_card | 채택 | my_profile_card | 현행 유지 |  |
| 54 | MY 탭 온보딩 인트로 (커버 미선택 회원) | 탭 루트 | my_onboarding_intro | 채택 | my_onboarding_intro | 제안 채택 |  |
| 55 | ID 변경 | push | basic_info_id | 채택 | my_info_id | 제안 개명 | basic_info_id → my_info_id |
| 56 | 경력 추가 · 수정 | push | resume_career_register | 채택 | resume_career_register | 제안 채택 |  |
| 57 | 내 프로필 미리보기 | push | my_profile_preview | 채택 | my_profile_preview | 제안 채택 |  |
| 58 | 링크 등록 | push | basic_info_link_register | 채택 | my_info_link_register | 제안 개명 | basic_info_link_register → my_info_link_register |
| 59 | 수상 · 자격 추가 · 수정 | push | resume_awards_register | 채택 | resume_awards_register | 제안 채택 |  |
| 60 | 시그니처 키워드 등록 | push | basic_info_signature_keyword_register | 채택 | my_info_signature_keyword_register | 보류(도달 불가) | 도달 불가 화면. 이름만 예약하고 발송하지 않습니다. |
| 61 | 시그니처 키워드 목록 | push | basic_info_signature_keyword | 채택 | my_info_signature_keyword | 보류(도달 불가) | 도달 불가 화면. 이름만 예약하고 발송하지 않습니다. |
| 62 | 영문 이름 입력 | push | basic_info_name_en | 채택 | my_info_name_en | 제안 개명 | basic_info_name_en → my_info_name_en |
| 63 | 이메일 인증번호 입력 | push | basic_info_email_verify | 채택 | my_info_email_verify | 제안 개명 | basic_info_email_verify → my_info_email_verify |
| 64 | 전화번호 입력 | push | basic_info_phone_register | 채택 | my_info_phone_register | 제안 개명 | basic_info_phone_register → my_info_phone_register |
| 65 | 직업 · 전문분야 목록 | push | basic_info_profession | 채택 | my_info_profession | 제안 개명 | basic_info_profession → my_info_profession |
| 66 | 커리어 관리 | push | resume_management | 채택 | user_resume | 제안 개명 | resume_management → user_resume |
| 67 | 프로젝트 카드 목록 | push | project_card_list | 채택 | project_card_list | 제안 채택 |  |
| 68 | 프로젝트 카드 상세 | push | project_detail | 채택 | project_detail | 현행 유지 |  |
| 69 | 프로필 상세 (다른 사용자) | push | profile_detail | 채택 | user_detail | 통합 발송 | → user_detail |
| 70 | 프로필 소개 탭 (프로필 카드 세그먼트 4번째 탭) | push | profile_introduction | 채택 | user_detail | 통합 발송 | → user_detail |
| 71 | 학력 추가 · 수정 | push | resume_education_register | 채택 | resume_education_register | 제안 채택 |  |
| 72 | 한글 이름 입력 | push | basic_info_name_ko | 채택 | my_info_name_ko | 제안 개명 | basic_info_name_ko → my_info_name_ko |
| 73 | 해외 도시 직접 입력 | push | basic_info_region_global_city | 채택 | my_info_region_global_city | 제안 개명 | basic_info_region_global_city → my_info_region_global_city |
| 74 | 활동 지역 (기본 정보 관리) | push | basic_info_region | 채택 | my_info_region | 제안 개명 | basic_info_region → my_info_region |
| 75 | 기본 정보 관리 | fullScreenCover | basic_info_management | 채택 | my_info_management | 제안 개명 | basic_info_management → my_info_management |
| 76 | 연락 이메일 입력 | fullScreenCover | basic_info_email_register | 채택 | my_info_email_register | 제안 개명 | basic_info_email_register → my_info_email_register |
| 77 | 이메일 등록 (계정 이메일 미보유 강제 등록) | fullScreenCover | register_email | 채택 | register_email | 제안 채택 |  |
| 78 | 직업 · 전문분야 선택 | fullScreenCover | basic_info_profession_select | 채택 | my_info_profession_select | 제안 개명 | basic_info_profession_select → my_info_profession_select |
| 79 | 프로젝트 지원 작성 | fullScreenCover | project_application_compose | 채택 | project_application_compose | 제안 채택 |  |
| 80 | 프로필 사진 등록(사진 선택 대기) | fullScreenCover | basic_info_profile_image_register | 채택 | my_info_profile_image_register | 보류(도달 불가) | 도달 불가 화면. 이름만 예약하고 발송하지 않습니다. |
| 81 | 개인정보 공개설정 시트 | sheet | basic_info_visibility | 채택 | my_info_visibility | 제안 개명 | basic_info_visibility → my_info_visibility |
| 82 | 노크 수신 설정 바텀시트 | sheet | profile_collaboration_status | 채택 | profile_collaboration_status | 제안 채택 |  |
| 83 | 링크 관리 시트 | sheet | basic_info_link | 채택 | my_info_link | 제안 개명 | basic_info_link → my_info_link |
| 84 | 생년월일 · 성별 | sheet | basic_info_birth_gender | 채택 | my_info_birth_gender | 제안 개명 | basic_info_birth_gender → my_info_birth_gender |
| 85 | 오늘 방문한 사용자 바텀시트 | sheet | profile_today_visitor | 채택 | visitor_today_bottom_sheet | 제안 개명 | profile_today_visitor → visitor_today_bottom_sheet |
| 86 | 이름 언어 선택 시트 | sheet | basic_info_name | 채택 | my_info_name | 제안 개명 | basic_info_name → my_info_name |
| 87 | 이메일 관리 시트 | sheet | basic_info_email | 채택 | my_info_email | 제안 개명 | basic_info_email → my_info_email |
| 88 | 전화번호 관리 시트 | sheet | basic_info_phone | 채택 | my_info_phone | 제안 개명 | basic_info_phone → my_info_phone |
| 89 | 직업 직접 추가 | sheet | basic_info_profession_direct | 채택 | my_info_profession_direct | 제안 개명 | basic_info_profession_direct → my_info_profession_direct |
| 90 | 프로필 사진 변경 시트 | sheet | basic_info_profile_image | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 91 | 프로필 상세 포트폴리오 댓글 바텀시트 | sheet | profile_portfolio_comment | 채택 | portfolio_comment_list | 통합 발송 | → portfolio_comment_list |
| 92 | 활동 지역 (프로필 상세 바텀시트) | sheet | profile_activity_region | 제외 |  | 정보 표시 시트 | 읽기만 하는 짧은 정보. 과업이 없습니다. |
| 93 | 파인더 검색 입력 화면 (최근 검색어·최근 본 크리에이터·인기 검색어·추천 카테고리) | 탭 루트 | finder_search | 채택 | finder_search | 현행 유지 |  |
| 94 | 파인더 탭 (검색 홈) | 탭 루트 | finder | 채택 | finder | 현행 유지 |  |
| 95 | Shuffle 키워드 묶음 목록 | push | finder_shuffle_bundle | 채택 | shuffle_bundle | 제안 개명 | finder_shuffle_bundle → shuffle_bundle |
| 96 | Shuffle! 키워드 추천 | push | finder_shuffle | 채택 | discovery_recommend_keywords | 제안 개명 | finder_shuffle → discovery_recommend_keywords |
| 97 | 검색 결과 - 작업물(포트폴리오) 탭 | push | finder_result_portfolio | 채택 | finder_result_portfolio | 현행 유지 |  |
| 98 | 검색 결과 - 크리에이터 탭 | push | finder_result_creator | 채택 | finder_result_creator | 현행 유지 |  |
| 99 | 검색 결과 - 프로젝트 탭 | push | finder_result_project | 채택 | finder_result_project | 현행 유지 |  |
| 100 | 검색 결과 크리에이터 프로필 페이저 (좌우로 넘겨 보는 프로필) | push | finder_creator_detail | 채택 | user_detail | 통합 발송 | → user_detail |
| 101 | 작업물 검색 결과 정렬 바텀시트 | sheet | finder_result_portfolio_sort | 제외 |  | 정렬·첨부·메뉴 시트 | 같은 화면의 보조 조작. 화면이 바뀌지 않습니다. |
| 102 | 크리에이터 검색 결과 정렬 바텀시트 | sheet | finder_result_creator_sort | 제외 |  | 정렬·첨부·메뉴 시트 | 같은 화면의 보조 조작. 화면이 바뀌지 않습니다. |
| 103 | 프로젝트 검색 결과 정렬 바텀시트 | sheet | finder_result_project_sort | 제외 |  | 정렬·첨부·메뉴 시트 | 같은 화면의 보조 조작. 화면이 바뀌지 않습니다. |
| 104 | 필터 > 지역 추가 | push | finder_filter_region | 채택 | finder_filter | 통합 발송 | → finder_filter |
| 105 | 필터 > 직업 추가 | push | finder_filter_profession | 채택 | finder_filter | 통합 발송 | → finder_filter |
| 106 | 필터 > 해시태그 추가 | push | finder_filter_tag | 채택 | finder_filter | 통합 발송 | → finder_filter |
| 107 | 크리에이터·포트폴리오·프로젝트 필터 시트 | sheet | finder_filter | 채택 | finder_filter | 통합 발송 | → finder_filter |
| 108 | 채티 - 라운지 목록 | 탭 루트 | chatty_lounge | 채택 | chatty | 통합 발송 | → chatty |
| 109 | 채티 - 채팅 목록 (탭 기본) | 탭 루트 | chatty_chat | 채택 | chatty | 통합 발송 | → chatty |
| 110 | 채티 - 프로젝트 목록 | 탭 루트 | chatty_project | 채택 | chatty | 통합 발송 | → chatty |
| 111 | 채티 탭 | 탭 루트 | chatty | 채택 | chatty | 통합 발송 | → chatty |
| 112 | 라운지 만들기 | push | lounge_create | 채택 | lounge_create | 제안 채택 |  |
| 113 | 라운지 수정 | push | lounge_edit | 채택 | lounge_edit | 제안 채택 |  |
| 114 | 알림 센터 | push | alarm_center | 채택 | notification_center | 제안 개명 | alarm_center → notification_center |
| 115 | 인맥 둘러보기 | push | network_browse | 채택 | discovery_recommend_network | 제안 개명 | network_browse → discovery_recommend_network |
| 116 | 지원자 리스트 | push | project_applicants | 채택 | project_applicants | 제안 채택 |  |
| 117 | 채팅 이미지 뷰어 | push | chat_image_preview | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 118 | 채팅방 | push | chat_room | 채택 | chat_room_direct · chat_room_lounge · chat_room_project · chat_room_team | 유형별 발송 | → chat_room_direct, chat_room_lounge, chat_room_project, chat_room_team |
| 119 | 채팅방 메뉴 | push | chat_room_menu | 채택 | chat_room_menu | 제안 채택 |  |
| 120 | 채티 만들기 패널 (새 채팅·라운지 만들기·프로젝트 만들기) | fullScreenCover | chatty_create_menu | 제외 |  | 정렬·첨부·메뉴 시트 | 같은 화면의 보조 조작. 화면이 바뀌지 않습니다. |
| 121 | 채팅 미디어 전체화면 재생 (동영상·오디오) | fullScreenCover | chat_media_player | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 122 | 라운지 커버 사진 선택 (시스템 피커) | sheet | lounge_cover_photo_picker | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 123 | 채팅 첨부 — 동영상 선택 (시스템 피커) | sheet | chat_video_picker | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 124 | 채팅 첨부 — 오디오 파일 선택 (시스템 파일 피커) | sheet | chat_audio_picker | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 125 | 채팅 첨부 — 이미지 선택 (시스템 피커) | sheet | chat_image_picker | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 126 | 채팅방 신고 사유 선택 바텀시트 | sheet | chat_room_report_reason | 채택 | report_reason | 통합 발송 | → report_reason |
| 127 | 채팅방 신고 상세 입력 모달 | sheet | chat_room_report_detail | 채택 | report_detail_input | 통합 발송 | → report_detail_input |
| 128 | 채팅방 첨부 바텀시트 (이미지·동영상·오디오) | sheet | chat_attachment | 제외 |  | 정렬·첨부·메뉴 시트 | 같은 화면의 보조 조작. 화면이 바뀌지 않습니다. |
| 129 | 라운지 만들기 완료 팝업 | 팝업 | lounge_create_complete | 제외 |  | 유도·완료 팝업 | 행동의 결과 알림. 완료는 행동 이벤트로 이미 잡힙니다. |
| 130 | 인맥 검색 (검색 입력 모드) | push | contacts_search | 채택 | contacts_search | 통합 발송 | → contacts_search |
| 131 | 인맥 검색 결과 - 일촌 | push | contacts_search_result_first_connections | 채택 | contacts_search | 통합 발송 | → contacts_search |
| 132 | 인맥 검색 결과 - 팔로워 | push | contacts_search_result_follower | 채택 | contacts_search | 통합 발송 | → contacts_search |
| 133 | 인맥 검색 결과 - 팔로잉 | push | contacts_search_result_following | 채택 | contacts_search | 통합 발송 | → contacts_search |
| 134 | 인맥 관리 - 일촌 탭 | push | contacts_first_connections | 채택 | contacts_first_connections | 현행 유지 |  |
| 135 | 인맥 관리 - 팔로워 탭 | push | contacts_follower | 채택 | contacts_follower | 현행 유지 |  |
| 136 | 인맥 관리 - 팔로잉 탭 | push | contacts_following | 채택 | contacts_following | 현행 유지 |  |
| 137 | 인맥 관리 - 마이클럽 탭 | push | contacts_my_club | 채택 | contacts_my_club | 제안 채택 |  |
| 138 | 팀 더보기 바텀시트 (알림/팔로우/신고) | sheet | contacts_team_actions | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 139 | 팀 만들기 | push | team_create | 채택 | team_create | 제안 채택 |  |
| 140 | 팀 멤버 초대 | push | team_invite | 채택 | team_invite | 제안 채택 |  |
| 141 | 팀 목록 (내 팀 · 합류 요청 인박스) | push | team_list | 채택 | team_list | 현행 유지 |  |
| 142 | 팀 상세 (팀 페이지) | push | team_detail | 채택 | team_detail | 통합 발송 | → team_detail |
| 143 | 팀 상세 — 멤버 탭 | push | team_detail_member | 채택 | team_detail | 통합 발송 | → team_detail |
| 144 | 팀 상세 — 소개 탭 | push | team_detail_introduction | 채택 | team_detail | 통합 발송 | → team_detail |
| 145 | 팀 수정 (팀 해체 진입점) | push | team_edit | 채택 | team_edit | 제안 채택 |  |
| 146 | 2단계 인증 (2FA) | push | setting_2fa | 채택 | setting_2fa | 제안 채택 |  |
| 147 | 2단계 인증 설정 완료 | push | setting_2fa_completed | 채택 | setting_2fa_completed | 제안 채택 |  |
| 148 | 2단계 인증(2FA) 추가 — 이메일 인증 관리 | push | setting_2fa_email | 채택 | setting_2fa_email | 제안 채택 |  |
| 149 | 개인정보 이용 동의 철회 | push | setting_personal_info_disagree | 채택 | setting_personal_info_agreement | 통합 발송 | → setting_personal_info_agreement |
| 150 | 개인정보 이용 동의하기 | push | setting_personal_info_agree | 채택 | setting_personal_info_agreement | 통합 발송 | → setting_personal_info_agreement |
| 151 | 계정 | push | setting_account | 채택 | setting_account | 제안 채택 |  |
| 152 | 계정 삭제 비밀번호 확인 | push | setting_account_delete_password | 채택 | setting_account_delete_password | 제안 채택 |  |
| 153 | 계정 삭제 최종 확인 | push | setting_account_delete_confirm | 채택 | setting_account_delete_confirm | 제안 채택 |  |
| 154 | 고객센터 | push | setting_customer_service | 채택 | setting_customer_service | 제안 채택 |  |
| 155 | 공개 범위 | push | setting_visibility | 채택 | setting_visibility | 제안 채택 |  |
| 156 | 내 댓글 및 답글 | push | setting_contents_comments | 채택 | setting_contents_comments | 제안 채택 |  |
| 157 | 리스펙트한 포트폴리오 | push | setting_contents_respected | 채택 | setting_contents_respected | 제안 채택 |  |
| 158 | 북마크 — 크리에이터 탭 | push | bookmark_creator | 채택 | bookmark_creator | 현행 유지 |  |
| 159 | 북마크 — 포트폴리오 탭 | push | bookmark_portfolio | 채택 | bookmark_portfolio | 현행 유지 |  |
| 160 | 비밀번호 재설정 — 새 비밀번호 입력 | push | setting_reset_password | 채택 | reset_password_new | 제안 개명 | setting_reset_password → reset_password_new |
| 161 | 서비스 동의 | push | setting_service_agreement | 채택 | service_agreement | 제안 개명 | setting_service_agreement → service_agreement |
| 162 | 설정 홈 | push | setting_home | 채택 | my_page_menu | 제안 개명 | setting_home → my_page_menu |
| 163 | 알림 설정 | push | setting_notification | 채택 | setting_notification | 제안 채택 |  |
| 164 | 좋아요한 콘텐츠 | push | setting_contents_liked | 채택 | setting_contents_liked | 제안 채택 |  |
| 165 | 차단한 사용자 | push | setting_blocked_members | 채택 | setting_blocked_members | 제안 채택 |  |
| 166 | 콘텐츠 | push | setting_contents | 채택 | setting_contents | 제안 채택 |  |
| 167 | 프로필 공개 범위 | push | setting_visibility_profile | 채택 | setting_visibility_profile | 제안 채택 |  |
| 168 | 2FA 이메일 인증번호 입력 | fullScreenCover | setting_2fa_email_verify | 채택 | setting_2fa_email_verify | 제안 채택 |  |
| 169 | Muse 특권 안내 (웹뷰) | fullScreenCover | setting_muse_privileges | 채택 | setting_muse_privileges | 제안 채택 |  |
| 170 | 개인정보 수집ㆍ이용 안내 문서 | fullScreenCover | setting_personal_info_document | 채택 | agreement_document | 통합 발송 | → agreement_document |
| 171 | 개인정보 처리방침 전문 | fullScreenCover | setting_privacy_policy | 채택 | agreement_document | 통합 발송 | → agreement_document |
| 172 | 광고성 정보 수신 동의 안내 문서 | fullScreenCover | setting_ad_info_agreement_document | 채택 | agreement_document | 통합 발송 | → agreement_document |
| 173 | 비밀번호 변경 | fullScreenCover | setting_change_password | 채택 | setting_change_password | 제안 채택 |  |
| 174 | 비밀번호 재설정 — 이메일 인증번호 입력 | fullScreenCover | setting_reset_password_verify_email | 채택 | reset_password_verify | 제안 개명 | setting_reset_password_verify_email → reset_password_verify |
| 175 | 이용 약관 전문 | fullScreenCover | setting_terms_of_service | 채택 | agreement_document | 통합 발송 | → agreement_document |
| 176 | 탈퇴 사유 직접 입력 (기타) | fullScreenCover | setting_account_delete_reason_input | 채택 | setting_account_delete_reason | 통합 발송 | → setting_account_delete_reason |
| 177 | 이메일 문의 작성 (시스템 메일 작성기) | sheet | setting_customer_service_email | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 178 | 회원 탈퇴 사유 선택 (바텀시트) | sheet | setting_account_delete_reason | 채택 | setting_account_delete_reason | 통합 발송 | → setting_account_delete_reason |
| 179 | 업로드 이미지 편집(크롭·비율) | fullScreenCover | upload_image_edit | 채택 | media_image_edit | 통합 발송 | → media_image_edit |
| 180 | 업로드 첨부 PDF 미리보기 | fullScreenCover | upload_preview_pdf | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 181 | 업로드 첨부 동영상 미리보기 | fullScreenCover | upload_preview_video | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 182 | 업로드 첨부 오디오 재생 | fullScreenCover | upload_preview_audio | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 183 | 업로드 첨부 유튜브 미리보기 | fullScreenCover | upload_preview_youtube | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 184 | 업로드 첨부 이미지 미리보기 | fullScreenCover | upload_preview_image | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 185 | 영감 수정 | fullScreenCover | inspiration_edit | 채택 | inspiration_edit | 제안 채택 |  |
| 186 | 영감 작성 | fullScreenCover | inspiration_create | 채택 | inspiration_create | 제안 채택 |  |
| 187 | 포트폴리오 수정 | fullScreenCover | portfolio_edit | 채택 | text_portfolio_edit · img_portfolio_edit · video_portfolio_edit · audio_portfolio_edit · pdf_portfolio_edit · youtube_portfolio_edit | 단계별 발송 | → text_portfolio_edit, img_portfolio_edit, video_portfolio_edit, audio_portfolio_edit, pdf_portfolio_edit, youtube_portfolio_edit |
| 188 | 포트폴리오 작성 | fullScreenCover | portfolio_create | 채택 | portfolio_create · text_portfolio_create · img_portfolio_create · video_portfolio_create · audio_portfolio_create · pdf_portfolio_create · youtube_portfolio_create | 단계별 발송 | → portfolio_create, text_portfolio_create, img_portfolio_create, video_portfolio_create, audio_portfolio_create, pdf_portfolio_create, youtube_portfolio_create |
| 189 | 프로젝트 수정 | fullScreenCover | project_edit | 채택 | project_card_edit | 제안 개명 | project_edit → project_card_edit |
| 190 | 프로젝트 작성 | fullScreenCover | project_create | 채택 | project_card_create | 제안 개명 | project_create → project_card_create |
| 191 | 업로드 PDF 파일 선택 | sheet | upload_media_picker_pdf | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 192 | 업로드 동영상 선택(시스템 피커) | sheet | upload_media_picker_video | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 193 | 업로드 사진 선택(시스템 피커) | sheet | upload_media_picker_photo | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 194 | 업로드 오디오 파일 선택 | sheet | upload_media_picker_audio | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 195 | 웹뷰 전체화면 (로그인 후 openWeb) | push | web_page | 채택 | web_page | 통합 발송 | → web_page |
| 196 | 웹뷰 전체화면 — 로그인 전(가입 스택) | push | join_web | 채택 | web_page | 통합 발송 | → web_page |
| 197 | 클럽 대기 랜딩 (웹, lineup/club/<des>) | push | club_waiting_web | 채택 | club_waiting_web | 제안 채택 |  |
| 198 | 클럽 입장 랜딩 (웹, lineup/club-entry) | push | club_entry_web | 채택 | club_entry_web | 제안 채택 |  |
| 199 | 웹 첨부파일 미리보기 (이미지·영상·PDF·유튜브) | fullScreenCover | web_attachment_preview | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 200 | 프로필 사진 등록 (자르기·회전 편집) | fullScreenCover | web_profile_image_edit | 채택 | media_image_edit | 통합 발송 | → media_image_edit |
| 201 | 프로필 사진 자르기 | fullScreenCover | web_profile_image_crop | 채택 | media_image_edit | 통합 발송 | → media_image_edit |
| 202 | 사진 선택 (시스템 포토 피커) | sheet | web_photo_picker | 제외 |  | 시스템 피커 | OS가 그리는 사진·파일·메일 선택기. 앱 화면이 아닙니다. |
| 203 | 웹 안에서 띄우는 잠금 바텀시트 웹뷰 (제안 작성/수정) | sheet | proposal_edit | 채택 | proposal_create · proposal_edit | 유형별 발송 | → proposal_create, proposal_edit |
| 204 | 웹뷰 바텀시트 (presentWeb) | sheet | web_sheet | 채택 | web_page | 통합 발송 | → web_page |
| 205 | 커스텀 웹 바텀시트 (custombottomsheet) | 커스텀 웹 오버레이 | web_custom_bottom_sheet | 채택 | web_page | 통합 발송 | → web_page |
| 206 | 신고 상세 사유 입력 (기타) | fullScreenCover | report_detail_input | 채택 | report_detail_input | 통합 발송 | → report_detail_input |
| 207 | 게시물 신고 사유 선택 시트 | sheet | report_reason_content | 채택 | report_reason | 통합 발송 | → report_reason |
| 208 | 작업물 리스펙트 보낸 사람 목록 | sheet | respect_list | 채택 | respect_list | 통합 발송 | → respect_list |
| 209 | 내 댓글 옵션 시트 (삭제) | overlaySheet | comment_option_mine | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 210 | 타인 댓글 옵션 시트 | overlaySheet | comment_option_other | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 211 | 포트폴리오 PDF 전체보기 (QuickLook 문서 뷰어) | fullScreenCover | portfolio_pdf_viewer | 채택 | media_viewer | 통합 발송 | → media_viewer |
| 212 | 남의 프로젝트 카드 옵션 시트 (프로필 저장·공유·차단·신고) | sheet | project_card_option_other | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 213 | 리스펙트 준 사람 전체 목록 시트 | sheet | respect_user_all | 채택 | respect_list | 통합 발송 | → respect_list |
| 214 | 배경 영상 편집 (동영상 편집) | fullScreenCover | background_video_edit | 채택 | media_video_edit | 통합 발송 | → media_video_edit |
| 215 | 프로필 사진 등록 (사진 선택 → 이미지 편집) | fullScreenCover | profile_image_edit | 채택 | media_image_edit | 통합 발송 | → media_image_edit |
| 216 | 프로필 카드 배경 등록 (선택 → 이미지 편집) | fullScreenCover | profile_card_background_image_edit | 채택 | media_image_edit | 통합 발송 | → media_image_edit |
| 217 | 프로필 카드 배경 영상 구간 자르기 | fullScreenCover | profile_card_background_video_crop | 채택 | media_video_edit | 통합 발송 | → media_video_edit |
| 218 | 관계 세그먼트 시트 (일촌·팔로워·팔로잉) | sheet | relation_follower / relation_following / relation_first_connections | 채택 | relation_list | 통합 발송 | → relation_list |
| 219 | 함께 아는 일촌 목록 시트 | sheet | first_connection_mutual | 채택 | first_connection_mutual | 제안 채택 |  |
| 220 | 노크 용건 선택 | fullScreenCover | knock_type_select | 채택 | knock_type_select | 제안 채택 |  |
| 221 | 사용자 신고 사유 선택 시트 | sheet | report_reason_user | 채택 | report_reason | 통합 발송 | → report_reason |
| 222 | 사용자 액션 바텀시트 (더보기: 팔로우·1촌·노크·저장·차단·신고) | sheet | member_option | 제외 |  | 옵션(더보기) 시트 | 선택지 메뉴. 고른 행동은 행동 이벤트로 셉니다. |
| 223 | 노크 전송 완료 팝업 (채팅에서 확인하기) | 팝업 | knock_sent_popup | 제외 |  | 유도·완료 팝업 | 행동의 결과 알림. 완료는 행동 이벤트로 이미 잡힙니다. |
| 224 | 프로필 사진 자르기 (네이티브 편집 플로우) | fullScreenCover | profile_image_crop | 채택 | media_image_edit | 통합 발송 | → media_image_edit |
| 225 | 업데이트 안내 (신기능 소개) | 팝업 | app_update_notice | 제외 |  | 확인·안내 팝업 | 버튼 하나로 닫히는 알림. 필요하면 이벤트(예: app_update_gate)로 셉니다. |
| 226 | QA 리포트 영상 트림 편집기 | fullScreenCover | qa_report_video_trim | 제외 |  | 내부 QA 도구 | 알파·QA 전용 도구. 수집하지 않습니다. |
| 227 | QA 리포트 첨부 마크업 미리보기 | fullScreenCover | qa_report_markup | 제외 |  | 내부 QA 도구 | 알파·QA 전용 도구. 수집하지 않습니다. |
| 228 | QA 리포트 네트워크 로그 콘솔 (Pulse) | sheet | qa_report_network_console | 제외 |  | 내부 QA 도구 | 알파·QA 전용 도구. 수집하지 않습니다. |
| 229 | QA 리포트 사진·영상 피커 | sheet | qa_report_media_picker | 제외 |  | 내부 QA 도구 | 알파·QA 전용 도구. 수집하지 않습니다. |
| 230 | QA 리포트 작성 시트 | sheet | qa_report_sheet | 제외 |  | 내부 QA 도구 | 알파·QA 전용 도구. 수집하지 않습니다. |
| 231 | 카드 보스전 (프로필 카드) | 팝업 | card_game_boss | 채택 | card_game_boss | 제안 채택 |  |
| 232 | 카드 블록깨기 게임 | 팝업 | card_game_breakout | 채택 | card_game_breakout | 제안 채택 |  |
