(() => {
  const clips = {
    ambient: {
      src: '../assets/living/ambient-collaboration.mp4',
      kicker: '같은 시간, 서로 다른 리듬',
      line: '하울은 읽고, 키티는 쓰고, 모두의 작은 움직임이 겹쳐집니다.',
      current: 'howl',
    },
    handoff: {
      src: '../assets/living/gentle-handoff.mp4',
      kicker: '일은 손에서 손으로',
      line: '종이는 책상 위를 따라 움직이고, 쿠로미의 시선이 먼저 반응합니다.',
      current: 'soot',
    },
    idea: {
      src: '../assets/living/idea-ripple.mp4',
      kicker: '발견은 조용히 번집니다',
      line: '키티의 눈이 먼저 밝아지고, 잠시 뒤 쿠로미의 시선이 따라옵니다.',
      current: 'kitty',
    },
  };

  const regions = [
    { id: 'howl', clips: ['ambient'], x: '20%', y: '45%', w: '22%', h: '29%', first: 0, rest: [7600, 15800] },
    { id: 'table', clips: ['handoff', 'ambient'], x: '50%', y: '47%', w: '22%', h: '27%', first: 3200, rest: [9800, 18400] },
    { id: 'studio', clips: ['idea', 'ambient'], x: '78%', y: '43%', w: '24%', h: '28%', first: 6200, rest: [8200, 17200] },
    { id: 'soot', clips: ['ambient', 'handoff'], x: '25%', y: '76%', w: '25%', h: '24%', first: 9100, rest: [10400, 19600] },
    { id: 'lab', clips: ['ambient', 'idea'], x: '70%', y: '79%', w: '22%', h: '20%', first: 12800, rest: [11600, 21200] },
  ];

  const places = {
    all: { x: '50%', y: '50%', w: '100%', h: '100%', label: '같은 시간, 서로 다른 리듬', line: '하울은 읽고, 키티는 쓰고, 먼지 요정들은 다음 일을 정리하고 있어요.' },
    howl: { x: '20%', y: '51%', w: '28%', h: '55%', label: '하울의 서재', line: '하울은 종이를 들어 올리지 않고 책상에 지지한 채 맥락을 읽습니다.' },
    table: { x: '50%', y: '58%', w: '25%', h: '42%', label: '공유 원탁', line: '필요한 자료만 원탁을 건너고, 다른 일은 멈추지 않습니다.' },
    studio: { x: '79%', y: '54%', w: '30%', h: '55%', label: '창작 책상', line: '키티와 쿠로미는 기록과 검토를 서로 다른 박자로 이어갑니다.' },
    lab: { x: '73%', y: '82%', w: '32%', h: '29%', label: '관찰 작업대', line: '초코캣은 작은 변화와 결과를 오래 지켜봅니다.' },
  };

  const frame = document.querySelector('#world-frame');
  const motionRegions = document.querySelector('#motion-regions');
  const loading = document.querySelector('#loading-note');
  const motionToggle = document.querySelector('#motion-toggle');
  const motionLabel = document.querySelector('#motion-label');
  const presenceLabel = document.querySelector('#presence-label');
  const sceneKicker = document.querySelector('#scene-kicker');
  const sceneLine = document.querySelector('#scene-line');
  const focusLens = document.querySelector('#focus-lens');
  const activityItems = [...document.querySelectorAll('#activity-list li')];
  const placeButtons = [...document.querySelectorAll('[data-place]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = reducedMotion;
  let hasPlayed = false;

  function updateActivity(person) {
    activityItems.forEach((item) => item.classList.toggle('is-current', item.dataset.person === person));
  }

  function showCopy(clip) {
    sceneKicker.textContent = clip.kicker;
    sceneLine.textContent = clip.line;
    updateActivity(clip.current);
  }

  function setStill() {
    regions.forEach((region) => {
      window.clearTimeout(region.timer);
      region.video.classList.remove('is-active');
      region.video.pause();
    });
    frame.dataset.mode = paused ? 'paused' : 'still';
    presenceLabel.textContent = paused ? '시간이 잠시 멈춤' : '조용히 생각하는 중';
  }

  function scheduleRegion(region, initial = false) {
    window.clearTimeout(region.timer);
    if (paused || document.hidden) return;
    const delay = initial
      ? region.first
      : region.rest[0] + Math.random() * (region.rest[1] - region.rest[0]);
    region.timer = window.setTimeout(() => playRegion(region), delay);
  }

  function pickRegionClip(region) {
    if (region.clips.length === 1) return region.clips[0];
    let next = region.clips[Math.floor(Math.random() * region.clips.length)];
    if (next === region.lastClip) next = region.clips.find((clip) => clip !== next);
    region.lastClip = next;
    return next;
  }

  async function playRegion(region) {
    if (paused || document.hidden) return;
    const clip = clips[pickRegionClip(region)];
    const video = region.video;
    video.src = clip.src;
    video.playbackRate = 0.92 + Math.random() * 0.12;
    try {
      await video.play();
      video.classList.add('is-active');
      frame.dataset.mode = 'moving';
      presenceLabel.textContent = '조용히 일하는 중';
      showCopy(clip);
      loading.hidden = true;
      hasPlayed = true;
    } catch (error) {
      video.classList.remove('is-active');
      if (!hasPlayed) {
        frame.dataset.mode = 'still';
        loading.textContent = '움직임은 화면을 한 번 누르면 시작됩니다.';
        loading.hidden = false;
      }
      scheduleRegion(region);
    }
  }

  regions.forEach((region) => {
    const video = document.createElement('video');
    video.className = 'region-video';
    video.muted = true;
    video.playsInline = true;
    video.preload = region.first === 0 ? 'auto' : 'metadata';
    video.style.setProperty('--mask-x', region.x);
    video.style.setProperty('--mask-y', region.y);
    video.style.setProperty('--mask-w', region.w);
    video.style.setProperty('--mask-h', region.h);
    motionRegions.append(video);
    region.video = video;
    video.addEventListener('ended', () => {
      video.classList.remove('is-active');
      video.pause();
      scheduleRegion(region);
    });
    video.addEventListener('error', () => {
      video.classList.remove('is-active');
      scheduleRegion(region);
    });
  });

  motionToggle.addEventListener('click', () => {
    paused = !paused;
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionLabel.textContent = paused ? '움직임 이어보기' : '움직임 멈추기';
    if (paused) {
      setStill();
    } else {
      presenceLabel.textContent = '조용히 일하는 중';
      regions.forEach((region, index) => scheduleRegion(region, index !== 0));
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      regions.forEach((region) => {
        window.clearTimeout(region.timer);
        region.video.pause();
      });
    } else if (!paused) {
      regions.forEach((region, index) => scheduleRegion(region, index !== 0));
    }
  });

  placeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const place = places[button.dataset.place];
      placeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      sceneKicker.textContent = place.label;
      sceneLine.textContent = place.line;
      focusLens.style.setProperty('--x', place.x);
      focusLens.style.setProperty('--y', place.y);
      focusLens.style.setProperty('--w', place.w);
      focusLens.style.setProperty('--h', place.h);
      focusLens.classList.toggle('is-visible', button.dataset.place !== 'all');
    });
  });

  if (reducedMotion) {
    frame.dataset.mode = 'paused';
    loading.hidden = true;
    presenceLabel.textContent = '정지 화면으로 보는 중';
  } else {
    regions.forEach((region) => scheduleRegion(region, true));
  }
})();
