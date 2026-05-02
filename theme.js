(function () {
  var KEY = "todoTheme";
  var DARK = "dark";
  var LIGHT = "light";

  function getStoredTheme() {
    var stored = localStorage.getItem(KEY);
    if (stored === DARK || stored === LIGHT) {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  applyTheme(getStoredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeToggle");
    if (!btn) {
      return;
    }

    function updateLabels() {
      var isDark = document.documentElement.getAttribute("data-theme") === DARK;
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    }

    updateLabels();

    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === DARK ? LIGHT : DARK;
      applyTheme(next);
      localStorage.setItem(KEY, next);
      updateLabels();
    });
  });
})();
