"use strict";

(() => {
  const dialog = document.getElementById("image-dialog");
  const dialogContent = document.getElementById("dialog-content");
  let dialogTrigger = null;
  let currentView = "top";

  function openImage(title, node, caption, trigger) {
    dialogTrigger = trigger;
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("dialog-caption").textContent = caption;
    dialogContent.replaceChildren(node);
    dialog.showModal();
  }

  document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialogContent.replaceChildren();
    if (dialogTrigger?.isConnected) dialogTrigger.focus({ preventScroll: true });
    dialogTrigger = null;
  });

  function setView(view) {
    if (!["top", "depth"].includes(view)) return;
    currentView = view;
    document.querySelectorAll("[data-view]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.view === view));
    });
    for (const world of ["ghibli", "sanrio"]) {
      const image = document.getElementById(world + "-image");
      image.src = "assets/" + world + "-" + view + ".webp";
      image.style.aspectRatio = view === "top" ? "1" : "2048 / 1143";
      image.alt = (world === "ghibli" ? "하울과 스스와타리의 밝은 원형 작업실" : "헬로키티와 쿠로미의 연결된 한 집") +
        (view === "top" ? ". 수직으로 내려다본 배치와 동선의 컨셉 이미지." : ". 가구의 두께, 높이 차이, 빛과 접촉 그림자가 보이는 사선 입체 컨셉 이미지.");
    }
    document.getElementById("view-note").textContent = view === "top"
      ? "탑뷰 · 먼저 전체 배치와 동선을 봅니다."
      : "입체 시점 · 가구의 부피와 생활 분위기를 봅니다.";
  }

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });
  document.querySelectorAll("[data-world]").forEach(button => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img").cloneNode();
      image.removeAttribute("id");
      image.removeAttribute("fetchpriority");
      image.removeAttribute("style");
      openImage((button.dataset.world === "ghibli" ? "하울의 작업실" : "키티와 쿠로미의 한 집") +
        (currentView === "top" ? " · 탑뷰" : " · 입체 시점"), image,
        "시점별로 만든 공간 컨셉 이미지입니다. 실제 3D 카메라 회전 화면은 아닙니다.", button);
    });
  });

  function poseFrame(character, index) {
    const frame = document.createElement("span");
    frame.className = "pose-frame";
    const column = index % character.cols;
    const row = Math.floor(index / character.cols);
    const sheet = character.sheetOverrides?.[String(index)] || character.sheet;
    frame.style.setProperty("--sheet", 'url("assets/' + sheet + '")');
    frame.style.setProperty("--ratio", String((2048 / 1143) * character.rows / character.cols));
    frame.style.setProperty("--sx", character.cols * 100 + "%");
    frame.style.setProperty("--sy", character.rows * 100 + "%");
    frame.style.setProperty("--x", column * 100 / (character.cols - 1) + "%");
    frame.style.setProperty("--y", row * 100 / (character.rows - 1) + "%");
    frame.setAttribute("role", "img");
    frame.setAttribute("aria-label", character.name + " · " + character.labels[index]);
    return frame;
  }

  function setCharacter(key) {
    if (!Object.hasOwn(CHARACTER_DATA, key)) return;
    const character = CHARACTER_DATA[key];
    document.querySelectorAll(".character-tabs button").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.character === key));
    });
    document.getElementById("character-name").textContent = character.name;
    document.getElementById("character-description").textContent = character.description;
    document.getElementById("atlas-note").textContent = character.note;
    document.getElementById("reference-description").textContent = character.referenceDescription;
    const atlas = document.getElementById("atlas");
    atlas.dataset.character = key;
    atlas.setAttribute("aria-label", character.name + " 표정과 몸짓 시안");
    const scenes = character.labels.map((label, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pose";
      button.setAttribute("aria-label", character.name + " · " + label + " 크게 보기");
      const caption = document.createElement("span");
      caption.className = "pose-label";
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      caption.append(number, label);
      const frame = poseFrame(character, index);
      frame.setAttribute("aria-hidden", "true");
      button.append(frame, caption);
      button.addEventListener("click", () => {
        openImage(character.name + " · " + label, poseFrame(character, index),
          "공식 자료를 바탕으로 만든 정지 시안입니다. 연속 동작이나 실제 3D 모델을 재생하는 화면은 아닙니다.", button);
      });
      return button;
    });
    atlas.replaceChildren(...scenes);
    const references = character.references.map(reference => {
      const figure = document.createElement("figure");
      figure.className = "reference";
      const image = document.createElement("img");
      image.src = reference.file;
      image.alt = reference.title + ". " + reference.note;
      image.loading = "lazy";
      const link = document.createElement("a");
      link.href = reference.url;
      link.textContent = reference.title + " ↗";
      link.target = "_blank";
      link.rel = "noopener";
      const caption = document.createElement("figcaption");
      caption.textContent = reference.note;
      figure.append(image, link, caption);
      return figure;
    });
    document.getElementById("references").replaceChildren(...references);
  }

  document.querySelectorAll(".character-tabs button").forEach(button => {
    button.addEventListener("click", () => setCharacter(button.dataset.character));
  });
  document.querySelectorAll('[role="group"]').forEach(group => {
    group.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const buttons = [...group.querySelectorAll("button")];
      const index = buttons.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 :
        (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus({ preventScroll: true });
      buttons[next].click();
    });
  });
  for (const key of ["kitty", "kuromi"]) {
    const list = document.getElementById(key + "-candidates");
    list.replaceChildren(...CANDIDATE_DATA[key].map(candidate => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = candidate.url;
      link.textContent = candidate.label;
      link.target = "_blank";
      link.rel = "noopener";
      item.append(link);
      return item;
    }));
  }
  setCharacter("kitty");
})();
