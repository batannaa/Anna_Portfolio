document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const themeBtn = document.getElementById("theme-toggle");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    themeBtn.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Restore theme
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeBtn.textContent = "☀️";
  }

  // i18next
  function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.innerHTML = i18next.t(key);
    });
  }

  window.changeLanguage = function (lang) {
    i18next.changeLanguage(lang, () => {
      updateContent();
      localStorage.setItem("language", lang);
    });
  };

  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init(
      {
        fallbackLng: "en",
        supportedLngs: ["en", "fr", "ru"],
        backend: {
          loadPath: "/assets/locales/{{lng}}/{{lng}}.json",
        },
        detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
        },
      },
      (err) => {
        if (err) console.error("i18n error:", err);
        const savedLang = localStorage.getItem("language") || i18next.language;
        if (savedLang) changeLanguage(savedLang.split("-")[0]);
        else updateContent();
      }
    );

  // Preloader
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => (preloader.style.display = "none"), 500);
    }
  });
});
