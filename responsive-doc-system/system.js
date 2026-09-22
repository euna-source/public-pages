(() => {
  const root = document.documentElement;
  const media = matchMedia("(prefers-color-scheme: dark)");
  const setTheme = (preference, save = false) => {
    const mode =
      preference === "system" ? (media.matches ? "dark" : "light") : preference;
    root.dataset.theme = mode;
    root.dataset.preference = preference;
    document
      .querySelectorAll("[data-set-theme]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.setTheme === preference),
        ),
      );
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor)
      themeColor.content = mode === "dark" ? "#151816" : "#f4f5f3";
    if (save) {
      try {
        localStorage.setItem("c8-doc-theme-v02", preference);
      } catch {}
    }
  };
  setTheme(root.dataset.preference || "system");
  document
    .querySelectorAll("[data-set-theme]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        setTheme(button.dataset.setTheme, true),
      ),
    );
  media.addEventListener("change", () => {
    if (root.dataset.preference === "system") setTheme("system");
  });
  addEventListener("storage", (e) => {
    if (e.key === "c8-doc-theme-v02")
      setTheme(
        ["light", "dark", "system"].includes(e.newValue)
          ? e.newValue
          : "system",
      );
  });

  document.querySelectorAll("[data-copy]").forEach((button) =>
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy);
      const feedback = document.getElementById(button.dataset.feedback);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        if (feedback) feedback.textContent = "복사했습니다.";
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        if (feedback)
          feedback.textContent =
            "자동 복사를 사용할 수 없습니다. 선택된 내용을 직접 복사해 주세요.";
      }
    }),
  );

  const search = document.querySelector("[data-search]");
  if (search) {
    const items = [...document.querySelectorAll("[data-search-item]")];
    const empty = document.querySelector("[data-empty]");
    const count = document.querySelector("[data-result-count]");
    const clear = document.querySelector("[data-clear-search]");
    const sync = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let found = 0;
      items.forEach((item) => {
        const show = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !show;
        if (show) found++;
      });
      if (empty) empty.hidden = found !== 0;
      if (count) count.textContent = `${items.length}개 중 ${found}개 표시`;
      try {
        const url = new URL(location.href);
        if (query) url.searchParams.set("q", search.value.trim());
        else url.searchParams.delete("q");
        history.replaceState(null, "", url);
      } catch {}
    };
    search.value = new URL(location.href).searchParams.get("q") || "";
    search.addEventListener("input", sync);
    if (clear)
      clear.addEventListener("click", () => {
        search.value = "";
        sync();
        search.focus();
      });
    document.querySelectorAll("[data-reset-search]").forEach((button) =>
      button.addEventListener("click", () => {
        search.value = "";
        sync();
        search.focus();
      }),
    );
    sync();
  }

  document.querySelectorAll("[data-open-dialog]").forEach((button) => {
    const dialog = document.getElementById(button.dataset.openDialog);
    if (!dialog) return;
    button.addEventListener("click", () => dialog.showModal());
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...dialog.querySelectorAll(
          'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    });
    dialog
      .querySelectorAll("[data-close-dialog]")
      .forEach((close) =>
        close.addEventListener("click", () => dialog.close()),
      );
    dialog.addEventListener("click", (e) => {
      const box = dialog.getBoundingClientRect();
      if (
        e.target === dialog &&
        (e.clientX < box.left ||
          e.clientX > box.right ||
          e.clientY < box.top ||
          e.clientY > box.bottom)
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => button.focus());
  });
  document.querySelectorAll("[data-demo-feedback]").forEach((button) =>
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.demoFeedback).textContent =
        "예시 동작을 확인했습니다. 실제 데이터는 바뀌지 않습니다.";
    }),
  );

  document.querySelectorAll(".mobile-nav a").forEach((a) =>
    a.addEventListener("click", () => {
      if (a.hash && a.pathname === location.pathname) {
        a.closest("details").open = false;
        const target = document.querySelector(a.hash);
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus();
        }
      }
    }),
  );
  let openedForPrint = [];
  addEventListener("beforeprint", () => {
    openedForPrint = [...document.querySelectorAll("main details:not([open])")];
    openedForPrint.forEach((el) => (el.open = true));
  });
  addEventListener("afterprint", () => {
    openedForPrint.forEach((el) => (el.open = false));
    openedForPrint = [];
  });
})();
