(() => {
  document.documentElement.classList.add("js");
  let preference = "system";
  try {
    const saved = localStorage.getItem("c8-doc-theme-v02");
    if (["light", "dark", "system"].includes(saved)) preference = saved;
  } catch {}
  const mode =
    preference === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.dataset.theme = mode;
  document.documentElement.dataset.preference = preference;
})();
