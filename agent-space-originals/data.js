"use strict";
const CHARACTER_DATA = {
  "kitty": {
    "name": "헬로키티",
    "cols": 4,
    "rows": 3,
    "sheet": "kitty-acting.webp",
    "description": "입 없는 얼굴과 빨간 리본은 그대로. 공식 3D 원본에서 확인한 감긴 눈·빈 눈·반감김·눈물·소용돌이와 손의 자세를 함께 살렸습니다.",
    "note": "공식 3D 스티커에서 고른 12장면의 새 입체 시안입니다. 감사·팔짱 두 컷은 손동작이 더 잘 남은 앞선 시안에서 골랐습니다. 정지 포즈이며 연속 애니메이션은 아닙니다.",
    "referenceDescription": "모두 SANRIO가 발행한 공식 3D 스티커입니다. 팔벌림은 기본 중립 자세가 아니며, 눈 위 검은 선도 선택한 원본에 실제로 있습니다.",
    "labels": [
      "눈감고 기뻐하기",
      "힘껏 환호하기",
      "놀라서 멈추기",
      "눈 반쯤 감기",
      "시무룩해지기",
      "눈물 흘리기",
      "혼란스러워하기",
      "살짝 화내기",
      "손 모아 감사하기",
      "팔짱과 확신",
      "안경 쓰고 작업",
      "옆으로 잠들기"
    ],
    "sheetOverrides": {
      "8": "kitty-hands.webp",
      "9": "kitty-hands.webp"
    },
    "references": [
      {
        "file": "assets/kitty-base.png",
        "title": "3D 비례 · 팔벌림",
        "url": "https://store.line.me/stickershop/product/15828/ja",
        "note": "넓은 머리, 작은 몸, 리본·수염"
      },
      {
        "file": "assets/kitty-angry.png",
        "title": "분노 · 눈 위 선",
        "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736178/android/sticker.png?v=1",
        "note": "눈매와 홍조의 공식 예외"
      },
      {
        "file": "assets/kitty-question.png",
        "title": "반감김 · 갸웃",
        "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736182/android/sticker.png?v=1",
        "note": "고개와 눈을 함께 바꾸는 연기"
      }
    ]
  },
  "kuromi": {
    "name": "쿠로미",
    "cols": 4,
    "rows": 3,
    "sheet": "kuromi-acting.webp",
    "description": "검은 후드와 분홍 해골, 흰 얼굴과 작은 몸을 유지했습니다. 눈·입·고개·후드 귀·손·꼬리가 함께 태도를 만들며, 공식 원본처럼 해골의 눈도 바뀔 수 있습니다.",
    "note": "앞 10장면은 공식 스티커 연기를 입체 외관으로 옮긴 시안입니다. 마지막 팔짱·독서는 같은 외형으로 확장한 생활동작 제안입니다. 하트눈 장면의 해골도 원본처럼 하트눈으로 교정했습니다.",
    "referenceDescription": "3D 머리 형태는 2024 공식 옥외 영상, 몸짓과 표정 변화는 공식 2D 스티커를 대조했습니다. 서로 다른 매체의 원본입니다.",
    "labels": [
      "가볍게 응답하기",
      "의문과 갸웃",
      "눈감고 만족",
      "하트눈과 설렘",
      "크게 웃기",
      "장난스러운 윙크",
      "깜짝 놀라기",
      "이를 악물고 화",
      "풀죽어 눈물",
      "귀를 접고 졸기",
      "자신 있게 팔짱",
      "일기 읽기"
    ],
    "references": [
      {
        "file": "assets/kuromi-3d.jpg",
        "title": "공식 3D · 13.8초",
        "url": "https://www.youtube.com/watch?v=UOqmR-zBWJs&t=13.8s",
        "note": "후드의 부피, 얼굴 경계와 윙크"
      },
      {
        "file": "assets/kuromi-heart.png",
        "title": "공식 2D · 하트눈",
        "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18704/android/sticker.png?v=5",
        "note": "얼굴과 해골의 눈이 함께 변함"
      },
      {
        "file": "assets/kuromi-angry.png",
        "title": "공식 2D · 화난 자세",
        "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18720/android/sticker.png?v=5",
        "note": "눈매·이빨·손을 함께 비교"
      }
    ]
  },
  "howl": {
    "name": "하울",
    "cols": 4,
    "rows": 2,
    "sheet": "howl-acting.webp",
    "description": "금발의 비대칭 앞머리, 길고 섬세한 얼굴, 푸른 눈과 녹색 귀걸이를 유지하는 입체 외관입니다. 작은 미소에서 걱정·놀람·못마땅함·고민으로 이어지는 차이를 봅니다.",
    "note": "8컷 중 놀람의 강도 차이가 포함되어 있어 서로 다른 감정 8종을 뜻하지 않습니다. 공식 2D 인물을 바탕으로 제안한 3D 외관이며, 같은 모델의 표정 변형은 아직 구현하지 않았습니다.",
    "referenceDescription": "지브리가 공개한 작품 스틸입니다. 금발 얼굴, 강한 감정 장면, 화덕의 생활동작을 따로 관찰했습니다.",
    "labels": [
      "차분하게 바라보기",
      "작게 미소 짓기",
      "걱정이 떠오르기",
      "조금 놀라기",
      "크게 놀라기",
      "집중해서 살피기",
      "못마땅하게 보기",
      "턱 짚고 고민하기"
    ],
    "references": [
      {
        "file": "assets/howl014.jpg",
        "title": "금발 하울의 얼굴",
        "url": "https://www.ghibli.jp/gallery/howl014.jpg",
        "note": "코·턱·눈·앞머리·귀걸이"
      },
      {
        "file": "assets/howl023.jpg",
        "title": "강한 감정의 얼굴",
        "url": "https://www.ghibli.jp/gallery/howl023.jpg",
        "note": "머리색 변화는 감정 기능과 분리"
      },
      {
        "file": "assets/howl015.jpg",
        "title": "화덕에서의 생활",
        "url": "https://www.ghibli.jp/gallery/howl015.jpg",
        "note": "몸과 손이 물건에 닿는 방식"
      }
    ]
  },
  "soot": {
    "name": "스스와타리",
    "cols": 3,
    "rows": 3,
    "sheet": "soot-acting.webp",
    "description": "검은 둥근 몸, 흰 눈, 가느다란 두 팔과 두 다리. 입을 새로 그리는 대신 동공·몸 기울기·손·물건의 크기로 관심과 힘, 기다림과 기쁨을 표현합니다.",
    "note": "9개의 정지 행동 시안입니다. 책 읽기·종이 운반·쉬기는 원작의 형태를 이용한 새 생활동작입니다. 일부 몸은 약한 세로 타원이며 윤곽이 원작보다 매끈해, 작은 3D 모델에서 다시 조정할 부분입니다.",
    "referenceDescription": "《센과 치히로의 행방불명》 공식 스틸에서 구형 몸·두 눈·가는 팔다리와 별사탕을 든 자세를 확인했습니다.",
    "labels": [
      "주변을 살피기",
      "종이를 들여다보기",
      "별사탕 들어 올리기",
      "무거운 석탄 운반",
      "가볍게 걷기",
      "책 뒤에서 읽기",
      "다리 접고 쉬기",
      "팔 벌려 반기기",
      "별사탕 건네기"
    ],
    "references": [
      {
        "file": "assets/chihiro014.jpg",
        "title": "별사탕과 스스와타리",
        "url": "https://www.ghibli.jp/gallery/chihiro014.jpg",
        "note": "둥근 눈·몸, 가느다란 팔다리"
      },
      {
        "file": "assets/chihiro013.jpg",
        "title": "작은 일꾼의 작업 공간",
        "url": "https://www.ghibli.jp/gallery/chihiro013.jpg",
        "note": "몸과 물건의 크기 차이, 생활감"
      }
    ]
  }
};
const CANDIDATE_DATA = {
  "kitty": [
    {
      "label": "전신 비례 / WOW 팔벌림",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736158/android/sticker.png?v=1"
    },
    {
      "label": "깜빡이고 다시 보기",
      "url": "https://media1.giphy.com/media/YaXydckmFBoePTLeft/giphy.gif"
    },
    {
      "label": "윙크하며 손 인사",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736151/android/sticker.png?v=1"
    },
    {
      "label": "눈을 감고 기뻐하기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736160/android/sticker.png?v=1"
    },
    {
      "label": "힘껏 눈을 찡그리며 환호",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736159/android/sticker.png?v=1"
    },
    {
      "label": "둥근 빈 눈으로 충격",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736164/android/sticker.png?v=1"
    },
    {
      "label": "반감김과 고개 기울임",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736182/android/sticker.png?v=1"
    },
    {
      "label": "눈을 낮추고 시무룩",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736172/android/sticker.png?v=1"
    },
    {
      "label": "반짝이며 울먹이기",
      "url": "https://stickershop.line-scdn.net/sticonshop/v1/sticon/5ac5d13d040ab15980c9b4a7/iPhone/007.png?v=6"
    },
    {
      "label": "눈물을 흘리며 서 있기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736173/android/sticker.png?v=1"
    },
    {
      "label": "하트 눈 / 애정",
      "url": "https://stickershop.line-scdn.net/sticonshop/v1/sticon/5ac5d13d040ab15980c9b4a7/iPhone/013.png?v=6"
    },
    {
      "label": "별 눈 / 감탄",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/1006979/iPhone/sticker@2x.png?v=4"
    },
    {
      "label": "소용돌이 눈 / 혼란",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736186/android/sticker.png?v=1"
    },
    {
      "label": "X 눈 / 거절 또는 곤란",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736185/android/sticker.png?v=1"
    },
    {
      "label": "분노 / 날카로운 눈과 홍조",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736178/android/sticker.png?v=1"
    },
    {
      "label": "민망하고 붉어진 얼굴",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736175/android/sticker.png?v=1"
    },
    {
      "label": "땀 흘리며 난처해하기",
      "url": "https://stickershop.line-scdn.net/sticonshop/v1/sticon/67ed077a6d0b246b2d83da1b/iPhone/039.png"
    },
    {
      "label": "깊이 숙여 인사하기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/1006968/iPhone/sticker_animation@2x.png?v=4"
    },
    {
      "label": "손을 모아 감사하기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736157/android/sticker.png?v=1"
    },
    {
      "label": "아래에서 고개 내밀기",
      "url": "https://media1.giphy.com/media/YaXydckmFBoePTLeft/giphy.gif"
    },
    {
      "label": "팔짱과 확신 또는 삐침",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736177/android/sticker.png?v=1"
    },
    {
      "label": "안경 쓰고 노트북 작업",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736174/android/sticker.png?v=1"
    },
    {
      "label": "옆으로 누워 잠들기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/251736180/android/sticker.png?v=1"
    },
    {
      "label": "파티 도구와 손뼉 / 축하",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/1006987/iPhone/sticker_animation@2x.png?v=4"
    }
  ],
  "kuromi": [
    {
      "label": "가벼운 수락·확인",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/774317477/android/sticker.png?v=2"
    },
    {
      "label": "자신 있게 응답",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/622728735/android/sticker.png?v=2"
    },
    {
      "label": "관심 갖고 듣기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/616157063/android/sticker.png?v=2"
    },
    {
      "label": "의문·갸웃",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18727/android/sticker.png?v=5"
    },
    {
      "label": "턱 괴고 시큰둥",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/810710802/android/sticker.png?v=2"
    },
    {
      "label": "기다림·기대",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/774317509/android/sticker.png?v=2"
    },
    {
      "label": "반짝이는 관심",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18703/android/sticker.png?v=5"
    },
    {
      "label": "눈감고 만족",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/810710818/android/sticker.png?v=2"
    },
    {
      "label": "수줍게 기뻐함",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18706/android/sticker.png?v=5"
    },
    {
      "label": "하트눈·반함",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18704/android/sticker.png?v=5"
    },
    {
      "label": "키스",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18705/android/sticker.png?v=5"
    },
    {
      "label": "큰 웃음",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18713/android/sticker.png?v=5"
    },
    {
      "label": "우쭐함",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18714/android/sticker.png?v=5"
    },
    {
      "label": "장난스러운 웃음",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18719/android/sticker.png?v=5"
    },
    {
      "label": "윙크",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18723/android/sticker.png?v=5"
    },
    {
      "label": "감사·감격",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18726/android/sticker.png?v=5"
    },
    {
      "label": "경악",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18729/android/sticker.png?v=5"
    },
    {
      "label": "머쓱한 웃음",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18730/android/sticker.png?v=5"
    },
    {
      "label": "이를 악문 화",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18720/android/sticker.png?v=5"
    },
    {
      "label": "폭발하는 분노",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/13274563/iPhone/sticker@2x.png?v=2"
    },
    {
      "label": "풀죽어 눈물",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18712/android/sticker.png?v=5"
    },
    {
      "label": "크게 울기",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/13274561/iPhone/sticker@2x.png?v=2"
    },
    {
      "label": "졸림",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/18737/android/sticker.png?v=5"
    },
    {
      "label": "귀막고 거부",
      "url": "https://stickershop.line-scdn.net/stickershop/v1/sticker/774317504/android/sticker.png?v=2"
    }
  ]
};
