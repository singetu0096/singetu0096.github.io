const THEME_KEY = "theme-preference";
const root = document.documentElement;
const themeButtons = Array.from(document.querySelectorAll("[data-theme-toggle]"));
const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const getSystemTheme = () => (themeMediaQuery.matches ? "dark" : "light");

const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (_) {
    return null;
  }
};

const writeStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const nextTheme = theme === "dark" ? "light" : "dark";

  themeButtons.forEach((button) => {
    button.classList.toggle("is-active", theme === "dark");
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", `${nextTheme === "dark" ? "ダーク" : "ライト"}モードに切り替え`);

    const label = button.querySelector("[data-theme-toggle-label]");
    if (label) {
      label.textContent = nextTheme === "dark" ? "Dark" : "Light";
    }
  });
};

applyTheme(root.dataset.theme || readStoredTheme() || getSystemTheme());

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentTheme = root.dataset.theme || getSystemTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    writeStoredTheme(nextTheme);
    applyTheme(nextTheme);
  });
});

if (typeof themeMediaQuery.addEventListener === "function") {
  themeMediaQuery.addEventListener("change", () => {
    if (readStoredTheme()) {
      return;
    }

    applyTheme(getSystemTheme());
  });
}
