const views = {
  structure: {
    src: "../assets/rebuild/structure.jpg",
    alt: "평평한 바닥과 열린 표본실 문, 사람 크기 기준을 포함해 계단, 두 층 서가, 원탁과 개인 책상의 구조를 보여 주는 연구 공방",
    caption: "평평한 바닥, 문, 사람 크기와 우회 통로를 확인하는 구조",
  },
  day: {
    src: "../assets/rebuild/day.jpg",
    alt: "평평한 나무 바닥 위 원탁과 두 층 서가, 계단, 창가 책상, 제도대, 열린 표본실 문이 연결된 낮의 연구 공방",
    caption: "차가운 창빛과 따뜻한 작업등이 함께 들어오는 낮",
  },
  evening: {
    src: "../assets/rebuild/evening.jpg",
    alt: "같은 평평한 바닥과 열린 통로를 유지한 채 창밖 비와 작업등이 켜진 저녁의 연구 공방",
    caption: "비 오는 창과 난로, 책상등이 깊이를 나누는 저녁",
  },
};

const zones = {
  study: {
    number: "01",
    title: "창가 서재",
    description: "혼자 깊게 읽고 기록하는 자리입니다. 창밖의 차가운 빛, 손이 닿는 책 더미, 식은 찻잔이 머문 시간을 보여 줍니다.",
    work: "읽기, 기록, 방향 정리",
    device: "창, 책상등, 손 닿는 수납",
  },
  table: {
    number: "02",
    title: "공유 원탁",
    description: "완성된 발표를 듣는 곳보다 각자의 자료를 펼쳐 차이를 보는 자리입니다. 지도와 모형은 옮길 수 있고 탁자 가장자리는 손을 놓을 만큼 비워 둡니다.",
    work: "비교, 연결, 짧은 조율",
    device: "지도, 지형 모형, 서로 다른 의자",
  },
  meeting: {
    number: "03",
    title: "위층 회의실",
    description: "서가 사이에 반쯤 닫힌 작은 방입니다. 오래된 유리를 통해 아래의 움직임이 남아 있어 회의가 공간 전체를 멈추게 하지 않습니다.",
    work: "집중 토론, 민감한 판단",
    device: "골이 있는 유리, 작은 타원 탁자, 핀보드",
  },
  archive: {
    number: "04",
    title: "자료 회랑",
    description: "책만 채운 배경이 아닙니다. 카드 서랍과 지도, 반납 바구니와 이동 사다리가 자료의 흐름을 보여 줍니다.",
    work: "찾기, 분류, 반납",
    device: "카드 서랍, 지도 선반, 난간",
  },
  repair: {
    number: "05",
    title: "수선·제작대",
    description: "계단 아래의 낮고 밝은 작업대입니다. 자와 칼, 실과 집게, 반쯤 만든 모형을 손이 쓰는 순서대로 둡니다.",
    work: "제작, 수선, 작은 실험",
    device: "도구벽, 확대등, 난로 가까운 작업면",
  },
  specimen: {
    number: "06",
    title: "식물 표본실",
    description: "유리 너머의 가장 깊은 구역입니다. 젖은 돌과 표본통, 눌러 말린 잎이 바깥 자연과 연구실을 이어 줍니다.",
    work: "관찰, 채집 기록, 보관",
    device: "오래된 유리, 표본통, 물 쓰는 바닥",
  },
};

const image = document.querySelector("#space-image");
const caption = document.querySelector("#view-caption");
const viewButtons = document.querySelectorAll("[data-view]");
const zoneButtons = document.querySelectorAll("[data-zone]");
const menuButton = document.querySelector(".hamburger");
const siteNav = document.querySelector("#site-nav");

viewButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
  button.addEventListener("click", () => {
    const view = views[button.dataset.view];
    if (!view || image.src === new URL(view.src, document.baseURI).href) return;
    image.classList.add("is-changing");
    const loader = new Image();
    loader.onload = () => {
      image.src = view.src;
      image.alt = view.alt;
      caption.textContent = view.caption;
      image.classList.remove("is-changing");
    };
    loader.onerror = () => image.classList.remove("is-changing");
    loader.src = view.src;
    viewButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
  });
});

function selectZone(key) {
  const zone = zones[key];
  if (!zone) return;
  document.querySelector("#zone-number").textContent = zone.number;
  document.querySelector("#zone-title").textContent = zone.title;
  document.querySelector("#zone-description").textContent = zone.description;
  document.querySelector("#zone-work").textContent = zone.work;
  document.querySelector("#zone-device").textContent = zone.device;
  zoneButtons.forEach((button) => {
    const active = button.dataset.zone === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

zoneButtons.forEach((button) => button.addEventListener("click", () => selectZone(button.dataset.zone)));

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  siteNav.classList.toggle("is-open", open);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "메뉴 열기");
    siteNav.classList.remove("is-open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !siteNav.classList.contains("is-open")) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
  siteNav.classList.remove("is-open");
  menuButton.focus();
});
