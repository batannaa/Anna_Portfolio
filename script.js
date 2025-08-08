
document.addEventListener('DOMContentLoaded', () => {
    // ======================== Theme Toggle ========================
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const body = document.body;

    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        } else {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        }
    }

    // Проверяем сохраненную тему при загрузке страницы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark'); // Тема по умолчанию
    }

    toggleThemeBtn.addEventListener('click', () => {
        const isLightTheme = body.classList.contains('light-theme');
        const newTheme = isLightTheme ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ======================== i18next Internationalization ========================

    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n') || element.innerHTML;
            if (key) {
                element.innerHTML = i18next.t(key);
            }
        });
    }

    // Глобальная функция, чтобы кнопки onclick ее видели
    window.changeLanguage = function(lang) {
        i18next.changeLanguage(lang, () => {
            updateContent();
            localStorage.setItem('language', lang);
        });
    }

    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            fallbackLng: 'en',
            supportedLngs: ['en', 'fr', 'ru'],
            load: 'languageOnly',
            backend: {
                // ИСПРАВЛЕННЫЙ ПУТЬ
                loadPath: '/assets/locales/{{lng}}/{{lng}}.json'
            },
            // Указываем, что нужно сохранять язык в localStorage
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage']
            }
        }, function(err, t) {
            if (err) return console.error('i18n error:', err);
            
            // Восстанавливаем язык или используем определенный детектором
            const savedLang = localStorage.getItem('language') || i18next.language;
            if (savedLang) {
                changeLanguage(savedLang.split('-')[0]); // Убираем региональный код, если есть (e.g., en-US -> en)
            } else {
                 updateContent(); // Обновляем контент с языком по умолчанию
            }
        });

    // ======================== Activities Swiper ========================
    new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
});


// ======================== Preloader ========================
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0'; // Fade out
        setTimeout(() => {
            preloader.style.display = 'none'; // Hide after fading
        }, 500);
    }
});