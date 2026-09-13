const views = {
  center: {
    src: "../assets/rebuild/day.jpg",
    rainSrc: "../assets/rebuild/evening.jpg",
    weatherSrc: {
      morning: "../assets/explore/weather-morning.jpg",
      day: "../assets/rebuild/day.jpg",
      predawn: "../assets/explore/weather-predawn.jpg",
      sunset: "../assets/explore/weather-sunset.jpg",
      rain: "../assets/rebuild/evening.jpg",
      snow: "../assets/explore/weather-snow.jpg",
      firstlight: "../assets/explore/weather-firstlight.jpg",
    },
    alt: "왼쪽 창가 독서대, 중앙 원탁, 난로, 곡선 계단, 위층 자료 회랑과 오른쪽 표본실이 이어진 연구 공방의 중앙 시점",
    title: "방 전체가 이어지는 중앙",
    copy: "원탁을 중심에 두되 오른쪽 표본실까지 걷는 통로는 비워 두었습니다. 위층 회의와 아래층 개인 작업이 동시에 보입니다.",
    anchor: "창가 독서대 · 원탁 · 계단 · 표본실 문",
    props: "지도 · 지형 모형 · 제도 도구 · 표본통",
    quality: "승인된 기준 시점",
  },
  left: {
    src: "../assets/explore/angle-left.jpg",
    alt: "왼쪽 전경의 식물과 사다리 너머로 원탁, 계단, 위층 서가와 표본실을 바라보는 연구 공방 시점",
    title: "독서대 쪽에서 돌아본 방",
    copy: "전경 식물과 사다리가 시야를 조금 가리고, 그 너머의 원탁과 위층 서가가 겹칩니다. 카메라 위치 변화는 통과했지만 작은 소품의 완전 일치는 다음 관문입니다.",
    anchor: "곡선 계단 · 원탁 · 상부 서가 · 표본실",
    props: "전경 식물 · 지도 모형 · 서가 사다리",
    quality: "시점 통과 · 소품 정합 보정 예정",
  },
  right: {
    src: "../assets/explore/angle-right.jpg",
    alt: "창가 맞은편에서 원탁, 독서대와 계단을 가로질러 바라보는 연구 공방 시점",
    title: "창가 맞은편에서 되돌아보기",
    copy: "원탁 뒤편에서 창가 독서대를 정면으로 보고, 오른쪽 계단이 프레임 밖 공간으로 이어지는 관계를 확인합니다. 생성 결과에 없는 표본실 시점이라고 과장하지 않습니다.",
    anchor: "창가 독서대 · 원탁 뒤편 · 오른쪽 계단",
    props: "책 더미 · 작업등 · 지도 모형 · 서가 사다리",
    quality: "시점 통과 · 표본실 역방향은 미통과",
  },
  upper: {
    src: "../assets/explore/angle-upper.jpg",
    alt: "위층 자료 회랑 난간 너머로 평평한 바닥과 원탁, 작업대와 표본실을 내려다보는 연구 공방 시점",
    title: "자료 회랑 높이에서 내려보기",
    copy: "완전한 탑뷰가 아니라 사람이 난간에 선 높이입니다. 위층 회의실과 아래 개인 작업이 동시에 계속되는 관계를 봅니다.",
    anchor: "난간 · 계단참 · 평평한 바닥 · 열린 문",
    props: "카드 서랍 · 반납 바구니 · 지도 통 · 핀보드",
    quality: "높이 관계 관문",
  },
  props: {
    src: "../assets/explore/props-close.jpg",
    alt: "독서대의 펼친 저널, 자, 컴퍼스, 잉크, 확대경과 찻잔 너머로 연구 공방 전체가 보이는 근접 시점",
    title: "손이 닿는 작업의 흔적",
    copy: "저널과 제도 도구는 장식이 아니라 방금 사용한 순서로 놓입니다. 전경의 실제 크기와 접촉 그림자가 방 안에 서 있는 거리를 만듭니다.",
    anchor: "독서대 모서리 · 원탁 · 계단 · 표본실",
    props: "펼친 저널 · 컴퍼스 · 잉크 · 확대경 · 차",
    quality: "소품 밀도 관문",
  },
};

const weather = {
  morning: { label: "아침", particle: "dust", shadow: [-34, 12] },
  day: { label: "낮", particle: "dust", shadow: [-16, 7] },
  predawn: { label: "새벽", particle: "mist", shadow: [8, 5] },
  sunset: { label: "노을", particle: "dust", shadow: [39, 14] },
  rain: { label: "비", particle: "mist", shadow: [-10, 5] },
  snow: { label: "눈", particle: "mist", shadow: [-7, 4] },
  firstlight: { label: "첫빛", particle: "mist", shadow: [-42, 13] },
};

const order = Object.keys(weather);
const experience = document.querySelector(".experience");
const media = document.querySelector("#scene-media");
const images = [document.querySelector("#scene-image-a"), document.querySelector("#scene-image-b")];
const statusText = document.querySelector("#status-text");
const loadStatus = document.querySelector("#load-status");
const info = document.querySelector("#scene-info");
const infoToggle = document.querySelector("#info-toggle");
const contactToggle = document.querySelector("#contact-toggle");
const contactLabel = document.querySelector("#contact-label");
const ambientToggle = document.querySelector("#ambient-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactLayout = window.matchMedia("(max-width: 720px)");

let activeImage = 0;
let viewKey = "center";
let weatherKey = "morning";
let zoom = 1.015;
let panX = 0;
let panY = 0;
let pointerStart = null;
let autoplayTimer = 0;
let toastTimer = 0;
let imageRequestGeneration = 0;
let displayedViewKey = "center";
const contactSupportedView = "center";

if (compactLayout.matches) {
  info.hidden = true;
  infoToggle.setAttribute("aria-expanded", "false");
}

function announce(message) {
  clearTimeout(toastTimer);
  loadStatus.textContent = message;
  toastTimer = window.setTimeout(() => { loadStatus.textContent = ""; }, 1800);
}

function sourceFor(key, environment) {
  const selected = views[key];
  if (selected.weatherSrc?.[environment]) return selected.weatherSrc[environment];
  return environment === "rain" && selected.rainSrc ? selected.rainSrc : selected.src;
}

function applyTransform() {
  const maxX = Math.round(media.clientWidth * .06 * zoom);
  const maxY = Math.round(media.clientHeight * .045 * zoom);
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
  experience.style.setProperty("--pan-x", `${panX}px`);
  experience.style.setProperty("--pan-y", `${panY}px`);
  experience.style.setProperty("--scene-scale", zoom.toFixed(3));
}

function resetTransform() {
  panX = 0;
  panY = 0;
  zoom = 1.015;
  applyTransform();
}

function updateInfo() {
  const selected = views[viewKey];
  const hasEnvironmentPlate = Boolean(selected.weatherSrc?.[weatherKey]);
  const index = Object.keys(views).indexOf(viewKey) + 1;
  experience.dataset.environmentPlate = String(hasEnvironmentPlate);
  document.querySelector("#view-index").textContent = `${String(index).padStart(2, "0")} / 05`;
  document.querySelector("#view-title").textContent = selected.title;
  document.querySelector("#view-copy").textContent = selected.copy;
  document.querySelector("#view-anchor").textContent = selected.anchor;
  document.querySelector("#view-props").textContent = selected.props;
  document.querySelector("#gate-note").textContent = hasEnvironmentPlate
    ? `${selected.quality} · 실제 환경 플레이트`
    : `${selected.quality} · 다각도 환경 합성`;
  document.querySelector("#view-quality").textContent = hasEnvironmentPlate ? "실제 환경 플레이트" : "환경 합성 프리뷰";
  statusText.textContent = `${weather[weatherKey].label} · ${document.querySelector(`[data-view-key="${viewKey}"] span`).textContent}`;
}

function swapImage({ quiet = false } = {}) {
  const requestedViewKey = viewKey;
  const requestedWeatherKey = weatherKey;
  const selected = views[requestedViewKey];
  const src = sourceFor(requestedViewKey, requestedWeatherKey);
  const incoming = images[1 - activeImage];
  const requestGeneration = ++imageRequestGeneration;
  if (images[activeImage].getAttribute("src") === src) {
    images[activeImage].alt = selected.alt;
    displayedViewKey = requestedViewKey;
    return;
  }
  if (!quiet) announce("새 시점을 불러오는 중");
  const loader = new Image();
  loader.onload = () => {
    if (requestGeneration !== imageRequestGeneration) return;
    incoming.src = src;
    incoming.alt = selected.alt;
    requestAnimationFrame(() => {
      if (requestGeneration !== imageRequestGeneration) return;
      incoming.classList.add("is-visible");
      images[activeImage].classList.remove("is-visible");
      images[activeImage].alt = "";
      activeImage = 1 - activeImage;
      displayedViewKey = requestedViewKey;
      if (!quiet) announce("시점 전환 완료");
    });
  };
  loader.onerror = () => {
    if (requestGeneration !== imageRequestGeneration) return;
    announce("이 시점을 불러오지 못해 이전 시점을 유지합니다");
    viewKey = displayedViewKey;
    experience.dataset.view = viewKey;
    setPressed("[data-view-key]", viewKey, "viewKey");
    updateInfo();
  };
  loader.src = src;
}

function setPressed(selector, key, datasetKey) {
  document.querySelectorAll(selector).forEach((button) => {
    const active = button.dataset[datasetKey] === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function chooseView(key) {
  if (!views[key] || key === viewKey) return;
  if (contactWalker?.active && key !== contactSupportedView) {
    contactWalker.setActive(false);
    announce("접촉 리그는 중앙 시점의 비어 있는 바닥에서만 검증합니다");
  }
  viewKey = key;
  experience.dataset.view = key;
  setPressed("[data-view-key]", key, "viewKey");
  resetTransform();
  updateInfo();
  swapImage();
}

function chooseWeather(key, { fromAutoplay = false } = {}) {
  if (!weather[key]) return;
  weatherKey = key;
  experience.dataset.weather = key;
  setPressed("[data-weather-key]", key, "weatherKey");
  updateInfo();
  swapImage({ quiet: key !== "rain" && key !== "morning" });
  weatherRenderer.setMode(weather[key].particle);
  if (!fromAutoplay && ambientToggle.getAttribute("aria-pressed") === "true") startAutoplay();
}

document.querySelectorAll("[data-view-key]").forEach((button) => button.addEventListener("click", () => chooseView(button.dataset.viewKey)));
document.querySelectorAll("[data-weather-key]").forEach((button) => button.addEventListener("click", () => chooseWeather(button.dataset.weatherKey)));

document.querySelector("#zoom-in").addEventListener("click", () => { zoom = Math.min(1.14, zoom + .04); applyTransform(); });
document.querySelector("#zoom-out").addEventListener("click", () => { zoom = Math.max(1, zoom - .04); applyTransform(); });
document.querySelector("#reset-view").addEventListener("click", () => { resetTransform(); announce("화면 맞춤"); });

media.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, aside")) return;
  pointerStart = { x: event.clientX, y: event.clientY, panX, panY };
  media.setPointerCapture(event.pointerId);
});

media.addEventListener("pointermove", (event) => {
  if (!pointerStart) return;
  panX = pointerStart.panX + event.clientX - pointerStart.x;
  panY = pointerStart.panY + event.clientY - pointerStart.y;
  applyTransform();
});

function releasePointer(event) {
  pointerStart = null;
  if (media.hasPointerCapture(event.pointerId)) media.releasePointerCapture(event.pointerId);
}
media.addEventListener("pointerup", releasePointer);
media.addEventListener("pointercancel", releasePointer);

media.addEventListener("wheel", (event) => {
  if (!event.ctrlKey) return;
  event.preventDefault();
  zoom = Math.max(1, Math.min(1.14, zoom - event.deltaY * .0004));
  applyTransform();
}, { passive: false });

media.addEventListener("keydown", (event) => {
  const moves = { ArrowLeft: [12, 0], ArrowRight: [-12, 0], ArrowUp: [0, 12], ArrowDown: [0, -12] };
  if (!moves[event.key]) return;
  event.preventDefault();
  panX += moves[event.key][0];
  panY += moves[event.key][1];
  applyTransform();
});

infoToggle.addEventListener("click", () => {
  const expanded = infoToggle.getAttribute("aria-expanded") === "true";
  infoToggle.setAttribute("aria-expanded", String(!expanded));
  info.hidden = expanded;
});

function startAutoplay() {
  clearInterval(autoplayTimer);
  if (reducedMotion.matches) return;
  autoplayTimer = window.setInterval(() => {
    const next = order[(order.indexOf(weatherKey) + 1) % order.length];
    chooseWeather(next, { fromAutoplay: true });
  }, 8000);
}

ambientToggle.addEventListener("click", () => {
  if (reducedMotion.matches) {
    announce("움직임 줄이기 설정에서는 자동 환경 재생을 사용하지 않습니다");
    return;
  }
  const active = ambientToggle.getAttribute("aria-pressed") !== "true";
  ambientToggle.setAttribute("aria-pressed", String(active));
  ambientToggle.querySelector("span").textContent = active ? "환경 멈춤" : "환경 재생";
  if (active) startAutoplay(); else clearInterval(autoplayTimer);
});

class WeatherRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: true });
    this.mode = "dust";
    this.particles = [];
    this.drawCosts = [];
    this.frame = 0;
    this.last = performance.now();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(media);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
      }
      else this.start();
    });
    this.resize();
    this.start();
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = media.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
    this.resetParticles();
  }

  setMode(mode) {
    this.mode = mode;
    this.resetParticles();
  }

  resetParticles() {
    const count = this.mode === "rain" ? 110 : this.mode === "snow" ? 70 : this.mode === "mist" ? 18 : 34;
    this.particles = Array.from({ length: count }, (_, index) => this.makeParticle(index / count));
  }

  makeParticle(progress = Math.random()) {
    return {
      x: Math.random() * this.width,
      y: progress * this.height,
      size: this.mode === "snow" ? 1.2 + Math.random() * 3 : .5 + Math.random() * 1.2,
      speed: this.mode === "rain" ? 420 + Math.random() * 260 : this.mode === "snow" ? 18 + Math.random() * 34 : 5 + Math.random() * 11,
      drift: -10 + Math.random() * 20,
      alpha: .15 + Math.random() * .42,
    };
  }

  start() {
    if (this.frame || reducedMotion.matches || document.hidden) return;
    this.last = performance.now();
    const loop = (now) => {
      this.frame = requestAnimationFrame(loop);
      const dt = Math.min(.05, (now - this.last) / 1000);
      this.last = now;
      this.draw(dt, now / 1000);
    };
    this.frame = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.context.clearRect(0, 0, this.width, this.height);
  }

  draw(dt, time) {
    const drawStarted = performance.now();
    const context = this.context;
    context.clearRect(0, 0, this.width, this.height);
    if (this.mode === "mist") {
      context.globalCompositeOperation = "screen";
      this.particles.forEach((particle, index) => {
        particle.x += Math.sin(time * .16 + index) * dt * 3;
        const radius = 90 + index % 6 * 26;
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius);
        gradient.addColorStop(0, "rgba(173,190,204,.018)");
        gradient.addColorStop(1, "rgba(173,190,204,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
      });
      context.globalCompositeOperation = "source-over";
      this.recordDrawCost(performance.now() - drawStarted);
      return;
    }
    this.particles.forEach((particle, index) => {
      if (this.mode === "rain") {
        particle.x -= dt * 85;
        particle.y += particle.speed * dt;
        context.strokeStyle = `rgba(184,211,220,${particle.alpha})`;
        context.lineWidth = .7;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(particle.x - 8, particle.y + 20);
        context.stroke();
      } else if (this.mode === "snow") {
        particle.x += (Math.sin(time + index) * 12 + particle.drift) * dt;
        particle.y += particle.speed * dt;
        context.fillStyle = `rgba(244,248,244,${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      } else {
        particle.x += Math.sin(time * .4 + index) * dt * 4;
        particle.y -= particle.speed * dt;
        context.fillStyle = `rgba(255,233,184,${particle.alpha * .45})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      if (particle.y > this.height + 24 || particle.y < -24 || particle.x < -30 || particle.x > this.width + 30) {
        Object.assign(particle, this.makeParticle(), { y: this.mode === "dust" ? this.height + 10 : -20 });
      }
    });
    this.recordDrawCost(performance.now() - drawStarted);
  }

  recordDrawCost(value) {
    this.drawCosts.push(value);
    if (this.drawCosts.length > 900) this.drawCosts.shift();
  }

  snapshot() {
    const sorted = [...this.drawCosts].sort((a, b) => a - b);
    const p95 = sorted.length ? sorted[Math.floor(sorted.length * .95)] : 0;
    return { mode: this.mode, draw_cost_p95_ms: Number(p95.toFixed(2)) };
  }
}

class ContactWalker {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: true });
    this.active = false;
    this.frame = 0;
    this.started = 0;
    this.intervals = [];
    this.drawCosts = [];
    this.previousFrame = 0;
    this.contactSamples = [];
    this.boneErrors = [];
    this.overextensions = 0;
    this.firstOverextension = null;
    this.kneeFlips = 0;
    this.previousContact = null;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(media);
    this.resize();
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = media.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  setActive(active) {
    this.active = active && !reducedMotion.matches;
    contactToggle.setAttribute("aria-pressed", String(this.active));
    contactLabel.hidden = !this.active;
    if (this.active) {
      this.started = performance.now();
      this.previousFrame = this.started;
      this.intervals = [];
      this.drawCosts = [];
      this.contactSamples = [];
      this.boneErrors = [];
      this.overextensions = 0;
      this.firstOverextension = null;
      this.kneeFlips = 0;
      this.previousContact = null;
      this.loop(this.started);
    } else {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }

  loop(now) {
    if (!this.active || document.hidden) return;
    const interval = now - this.previousFrame;
    this.previousFrame = now;
    if (interval < 100) this.intervals.push(interval);
    if (this.intervals.length > 900) this.intervals.shift();
    const drawStarted = performance.now();
    this.draw((now - this.started) / 1000);
    this.drawCosts.push(performance.now() - drawStarted);
    if (this.drawCosts.length > 900) this.drawCosts.shift();
    this.frame = requestAnimationFrame((next) => this.loop(next));
  }

  leg(context, hip, foot, forward, stroke, scale) {
    const upper = 60 * scale;
    const lower = 61 * scale;
    const dx = foot.x - hip.x;
    const dy = foot.y - hip.y;
    const rawDistance = Math.hypot(dx, dy);
    const minimum = Math.abs(upper - lower) + .01;
    const maximum = upper + lower - .01;
    const distance = Math.min(maximum, Math.max(minimum, rawDistance));
    if (rawDistance > maximum || rawDistance < minimum) {
      this.overextensions += 1;
      this.firstOverextension ??= {
        raw_distance_px: Number(rawDistance.toFixed(3)),
        minimum_px: Number(minimum.toFixed(3)),
        maximum_px: Number(maximum.toFixed(3)),
      };
    }
    const baseAngle = Math.atan2(dy, dx);
    const kneeOffset = Math.acos(Math.max(-1, Math.min(1, (upper * upper + distance * distance - lower * lower) / (2 * upper * distance))));
    const kneeAngle = baseAngle - kneeOffset * forward;
    const knee = { x: hip.x + Math.cos(kneeAngle) * upper, y: hip.y + Math.sin(kneeAngle) * upper };
    const solvedFoot = rawDistance === distance ? foot : {
      x: hip.x + Math.cos(baseAngle) * distance,
      y: hip.y + Math.sin(baseAngle) * distance,
    };
    const upperError = Math.abs(Math.hypot(knee.x - hip.x, knee.y - hip.y) - upper);
    const lowerError = Math.abs(Math.hypot(solvedFoot.x - knee.x, solvedFoot.y - knee.y) - lower);
    this.boneErrors.push(Math.max(upperError, lowerError));
    if (this.boneErrors.length > 1800) this.boneErrors.shift();
    const bend = (knee.x - hip.x) * (solvedFoot.y - hip.y) - (knee.y - hip.y) * (solvedFoot.x - hip.x);
    if (Math.sign(bend || forward) !== Math.sign(forward)) this.kneeFlips += 1;
    context.strokeStyle = stroke;
    context.lineWidth = 8 * scale;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(hip.x, hip.y);
    context.lineTo(knee.x, knee.y);
    context.lineTo(solvedFoot.x, solvedFoot.y);
    context.stroke();
    context.lineWidth = 5 * scale;
    context.beginPath();
    context.moveTo(solvedFoot.x - 2 * scale, solvedFoot.y);
    context.lineTo(solvedFoot.x + 13 * scale * forward, solvedFoot.y);
    context.stroke();
  }

  arm(context, shoulder, phase, direction, stroke, scale) {
    const swing = Math.sin(phase * Math.PI * 2) * 13 * scale * direction;
    const elbow = { x: shoulder.x + swing * .48, y: shoulder.y + 30 * scale };
    const hand = { x: shoulder.x - swing * .32, y: shoulder.y + 58 * scale - Math.abs(swing) * .12 };
    context.strokeStyle = stroke;
    context.lineWidth = 6 * scale;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(shoulder.x, shoulder.y);
    context.lineTo(elbow.x, elbow.y);
    context.lineTo(hand.x, hand.y);
    context.stroke();
  }

  draw(time) {
    const context = this.context;
    context.clearRect(0, 0, this.width, this.height);
    const scale = Math.max(.58, Math.min(1, this.width / 960));
    const leftBound = this.width * (this.width < 720 ? .08 : .14);
    const rightBound = this.width * (this.width < 720 ? .46 : .48);
    const route = rightBound - leftBound;
    const speed = Math.max(18, this.width * .035);
    const rawDistance = time * speed;
    const routeCycle = Math.floor(rawDistance / route);
    const forward = routeCycle % 2 === 0;
    const distance = rawDistance % route;
    const rootX = forward ? leftBound + distance : rightBound - distance;
    const direction = forward ? 1 : -1;
    const ground = this.height * (this.width < 720 ? .86 : .84);
    const halfStep = 22 * scale;
    const travel = distance;
    const stepNumber = Math.floor(travel / halfStep);
    const u = (travel % halfStep) / halfStep;
    const ease = u * u * (3 - 2 * u);
    const stanceWorld = stepNumber * halfStep + halfStep * .5;
    const swingWorld = stepNumber * halfStep - halfStep * .5 + ease * halfStep * 2;
    const leftStance = stepNumber % 2 === 0;
    const leftWorld = leftStance ? stanceWorld : swingWorld;
    const rightWorld = leftStance ? swingWorld : stanceWorld;
    const mapX = (worldX) => forward ? leftBound + worldX : rightBound - worldX;
    const leftFoot = { x: mapX(leftWorld), y: ground - (leftStance ? 0 : Math.sin(Math.PI * u) * 17 * scale) };
    const rightFoot = { x: mapX(rightWorld), y: ground - (leftStance ? Math.sin(Math.PI * u) * 17 * scale : 0) };
    const contactKey = `${routeCycle}:${stepNumber}`;
    const stanceFoot = leftStance ? leftFoot : rightFoot;
    if (this.previousContact?.key === contactKey) {
      this.contactSamples.push(Math.abs(stanceFoot.x - this.previousContact.x));
      if (this.contactSamples.length > 900) this.contactSamples.shift();
    }
    this.previousContact = { key: contactKey, x: stanceFoot.x };
    const bob = Math.sin(u * Math.PI) * 2.2 * scale;
    const pelvis = { x: rootX, y: ground - 112 * scale + bob };
    const shoulder = { x: rootX, y: pelvis.y - 53 * scale };
    const [shadowX, shadowY] = weather[weatherKey].shadow;

    context.save();
    context.translate(rootX, ground + 4);
    context.rotate(Math.atan2(shadowY, shadowX));
    context.scale(1, .25);
    const shadowGradient = context.createRadialGradient(0, 0, 1, 0, 0, 74 * scale);
    shadowGradient.addColorStop(0, "rgba(12,10,7,.42)");
    shadowGradient.addColorStop(1, "rgba(12,10,7,0)");
    context.fillStyle = shadowGradient;
    context.beginPath();
    context.ellipse(22 * scale, 0, 76 * scale, 24 * scale, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    const stroke = "rgba(244,229,193,.86)";
    const fill = "rgba(36,42,34,.82)";
    this.leg(context, { x: pelvis.x - 7 * scale, y: pelvis.y }, leftFoot, direction, stroke, scale);
    this.leg(context, { x: pelvis.x + 7 * scale, y: pelvis.y }, rightFoot, direction, stroke, scale);
    context.strokeStyle = stroke;
    context.lineWidth = 16 * scale;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(pelvis.x, pelvis.y);
    context.lineTo(shoulder.x, shoulder.y);
    context.stroke();
    this.arm(context, { x: shoulder.x - 8 * scale, y: shoulder.y + 4 * scale }, u, direction, stroke, scale);
    this.arm(context, { x: shoulder.x + 8 * scale, y: shoulder.y + 4 * scale }, u + .5, direction, stroke, scale);
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.lineWidth = 3 * scale;
    context.beginPath();
    context.arc(shoulder.x + direction * 1.5 * scale, shoulder.y - 24 * scale, 17 * scale, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = stroke;
    context.beginPath();
    context.arc(shoulder.x + direction * 6 * scale, shoulder.y - 27 * scale, 1.6 * scale, 0, Math.PI * 2);
    context.fill();
  }

  snapshot() {
    const sorted = [...this.intervals].sort((a, b) => a - b);
    const p95 = sorted.length ? sorted[Math.floor(sorted.length * .95)] : 0;
    const sortedCosts = [...this.drawCosts].sort((a, b) => a - b);
    const drawP95 = sortedCosts.length ? sortedCosts[Math.floor(sortedCosts.length * .95)] : 0;
    const sortedContact = [...this.contactSamples].sort((a, b) => a - b);
    const contactP95 = sortedContact.length ? sortedContact[Math.floor(sortedContact.length * .95)] : null;
    const boneError = this.boneErrors.length ? Math.max(...this.boneErrors) : null;
    return {
      active: this.active,
      frame_interval_p95_ms: Number(p95.toFixed(2)),
      draw_cost_p95_ms: Number(drawP95.toFixed(2)),
      model_stance_anchor_drift_p95_px: contactP95 === null ? null : Number(contactP95.toFixed(3)),
      max_bone_length_error_px: boneError === null ? null : Number(boneError.toFixed(3)),
      overextension_frames: this.overextensions,
      first_overextension: this.firstOverextension,
      knee_flip_frames: this.kneeFlips,
      shadow_vector: weather[weatherKey].shadow,
      route: "center_foreground_floor",
      projected_floor_error_px: null,
      note: "temporary_2d_contact_rig; final_character_and_3d_floor_contact_unverified",
    };
  }
}

const weatherRenderer = new WeatherRenderer(document.querySelector("#weather-canvas"));
const contactWalker = new ContactWalker(document.querySelector("#contact-canvas"));

contactToggle.addEventListener("click", () => {
  if (reducedMotion.matches) {
    announce("움직임 줄이기 설정에서는 접촉 리그를 재생하지 않습니다");
    return;
  }
  if (!contactWalker.active && viewKey !== contactSupportedView) {
    chooseView(contactSupportedView);
    window.setTimeout(() => contactWalker.setActive(true), 240);
    announce("중앙 시점의 비어 있는 바닥에서 접촉을 검증합니다");
    return;
  }
  contactWalker.setActive(!contactWalker.active);
});

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    weatherRenderer.stop();
    contactWalker.setActive(false);
    clearInterval(autoplayTimer);
    ambientToggle.setAttribute("aria-pressed", "false");
    ambientToggle.querySelector("span").textContent = "환경 재생";
  } else {
    weatherRenderer.start();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) contactWalker.setActive(false);
});

window.__agentSpaceDiagnostics = {
  snapshot: () => ({
    view: viewKey,
    weather: weatherKey,
    zoom,
    pan: [panX, panY],
    reducedMotion: reducedMotion.matches,
    weatherRenderer: weatherRenderer.snapshot(),
    contact: contactWalker.snapshot(),
  }),
};

function preloadViews() {
  Object.values(views).forEach((view) => {
    if (view.src === views.center.src) return;
    const image = new Image();
    image.src = view.src;
  });
}

const initialParams = new URLSearchParams(location.search);
if (views[initialParams.get("view")]) viewKey = initialParams.get("view");
if (weather[initialParams.get("weather")]) weatherKey = initialParams.get("weather");
displayedViewKey = viewKey;
experience.dataset.view = viewKey;
experience.dataset.weather = weatherKey;
setPressed("[data-view-key]", viewKey, "viewKey");
setPressed("[data-weather-key]", weatherKey, "weatherKey");
images[activeImage].src = sourceFor(viewKey, weatherKey);
images[activeImage].alt = views[viewKey].alt;
updateInfo();
applyTransform();
weatherRenderer.setMode(weather[weatherKey].particle);
if ("requestIdleCallback" in window) requestIdleCallback(preloadViews, { timeout: 3500 });
else window.setTimeout(preloadViews, 1800);
