// ==========================================================================
// iAPPS — ОСНОВНАЯ ЛОГИКА САЙТА
// Зависимости: translations.js (i18n), Repo.json (данные приложений через fetch)
// ==========================================================================

// Глобальные массивы и стейт
let globalAppsData = [];
let filteredAppsData = [];
let currentPage = 1;
let itemsPerPage = 20;
let selectedCategory = '';
let currentSortMode = 'time';

function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(12);
    else if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// Раскладка клавиатуры (двуязычный поиск: ru <-> en)
const keyboardLayouts = { 'a': 'ф', 'b': 'и', 'c': 'с', 'd': 'в', 'e': 'у', 'f': 'а', 'g': 'п', 'h': 'р', 'i': 'ш', 'j': 'о', 'k': 'л', 'l': 'д', 'm': 'ь', 'n': 'т', 'o': 'щ', 'p': 'з', 'r': 'к', 's': 'ы', 't': 'е', 'u': 'г', 'v': 'м', 'w': 'ц', 'x': 'ч', 'y': 'н', 'z': 'я', 'q': 'й' };
const revLayouts = {}; Object.keys(keyboardLayouts).forEach(k => revLayouts[keyboardLayouts[k]] = k);
function getDualLayoutQuery(str) { let o1 = "", o2 = ""; for (let char of str) { o1 += keyboardLayouts[char] || char; o2 += revLayouts[char] || char; } return [str, o1, o2]; }

// ===== КИНЕТИЧЕСКАЯ СЕТКА ФОНА (ТОЧКИ, НЕ ЛИНИИ) =====
// Оригинальный движок рисует точки-пиксели, которые отскакивают от курсора.
// Это быстрее линий (O(n), без вложенного цикла/рёбер) и именно так выглядит «звёздное небо».
const canvas = document.getElementById('kineticGridCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
// Шаг сетки: на мобиле крупнее (меньше точек → легче CPU), на десктопе мельче.
let spacing = window.innerWidth < 768 ? 44 : 40;
const mouse = { x: -1000, y: -1000, radius: 100 };
const gravityWell = { x: -2000, y: -2000, active: false };
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function initGrid() {
    spacing = window.innerWidth < 768 ? 44 : 40;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = [];
    for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
            // ox, oy — оригинальные координаты клетки (куда точка возвращается).
            dots.push({ x, y, ox: x, oy: y });
        }
    }
}

let _rafId = null, _animRunning = false;
function startAnimation() {
    if (reducedMotionQuery.matches) return;
    if (_animRunning) return;
    _animRunning = true;
    _rafId = requestAnimationFrame(animate);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? 'rgba(242, 241, 237, 0.14)' : 'rgba(31, 36, 46, 0.10)';

    let _moved = 0;
    for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const _px = d.x, _py = d.y;

        // Реакция на курсор: если близко — отталкиваем точку.
        const dx = mouse.x - d.ox;
        const dy = mouse.y - d.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
            const force = (mouse.radius - dist) * 0.12;
            const angle = Math.atan2(dy, dx);
            d.x = d.ox - Math.cos(angle) * force;
            d.y = d.oy - Math.sin(angle) * force;
        } else if (gravityWell.active) {
            // Доп. эффект: при фокусе на поиск точки притягиваются к инпуту.
            const gDx = gravityWell.x - d.ox, gDy = gravityWell.y - d.oy;
            const gDist = Math.sqrt(gDx * gDx + gDy * gDy);
            if (gDist < 260 && gDist > 0) {
                const f = (260 - gDist) / 260 * 22;
                d.x += ((d.ox + gDx / gDist * f) - d.x) * 0.1;
                d.y += ((d.oy + gDy / gDist * f) - d.y) * 0.1;
            } else {
                d.x += (d.ox - d.x) * 0.1;
                d.y += (d.oy - d.y) * 0.1;
            }
        } else {
            // Иначе плавно возвращаем точку на законное место.
            d.x += (d.ox - d.x) * 0.1;
            d.y += (d.oy - d.y) * 0.1;
        }
        const _dxx = d.x - _px, _dyy = d.y - _py;
        _moved += _dxx * _dxx + _dyy * _dyy;
        ctx.fillRect(d.x, d.y, 1.6, 1.6); // пиксель клетки (чуть крупнее 1×1 для видимости)
    }
    // Продолжаем цикл только пока что-то реально движется. Когда точки «успокоились»,
    // картинка статична — останавливаемся (выглядит идентично) и оживаем при взаимодействии.
    if (_moved > 0.3 || gravityWell.active) {
        _rafId = requestAnimationFrame(animate);
    } else {
        _animRunning = false;
    }
}

// Сетка не реагирует на курсор/палец в шапке и других кликабельных элементах —
// иначе на телефоне при нажатии на смену темы сетка «заедает» (паразитные силы на точки).
function isInteractiveTarget(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return false;
    // Шапка, кнопки, инпут, модалки — кликабельные зоны
    return !!el.closest('header, button, a, input, .modal-overlay, .lang-dropdown, .settings-modal');
}

window.addEventListener('mousemove', (e) => {
    if (isInteractiveTarget(e.clientX, e.clientY)) { mouse.x = -2000; mouse.y = -2000; startAnimation(); return; }
    mouse.x = e.clientX; mouse.y = e.clientY; startAnimation();
});
window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) {
        const t = e.touches[0];
        if (isInteractiveTarget(t.clientX, t.clientY)) { mouse.x = -2000; mouse.y = -2000; startAnimation(); return; }
        mouse.x = t.clientX; mouse.y = t.clientY; startAnimation();
    }
}, { passive: true });
window.addEventListener('touchstart', (e) => {
    if(e.touches.length > 0) {
        const t = e.touches[0];
        if (isInteractiveTarget(t.clientX, t.clientY)) { mouse.x = -2000; mouse.y = -2000; startAnimation(); }
    }
}, { passive: true });

// ===== ЗАГРУЗКА И ПАРСИНГ ДАННЫХ ПРИЛОЖЕНИЙ =====
const appsGrid = document.getElementById('appsGrid');

// Парсер строки версии. Формат: "версия | [мод] | размер MB | iOS X.X | "
function parseVersion(raw) {
    const result = { ver: '', mod: '', size: '', ios: '' };
    if (!raw) return result;
    const parts = raw.split('|').map(p => p.trim()).filter(Boolean);
    const iosIdx = parts.findIndex(p => /^ios/i.test(p));
    if (iosIdx !== -1) { result.ios = parts[iosIdx]; parts.splice(iosIdx, 1); }
    const sizeIdx = parts.findIndex(p => /\d\s*(mb|kb|gb)/i.test(p));
    if (sizeIdx !== -1) { result.size = parts[sizeIdx]; parts.splice(sizeIdx, 1); }
    if (parts.length >= 1) result.ver = parts[0];
    if (parts.length >= 2) result.mod = parts[1];
    return result;
}

// Генератор slug-ссылки на бота
function appSlug(title) {
    return encodeURIComponent(title.toLowerCase().replace(/[^a-zа-я0-9]/g, '_'));
}

// Экранирование HTML
function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function safeImageUrl(url) {
    const fallback = 'icons/MdFurman_sign_iapps_logo.jpeg';
    if (!url) return fallback;
    if (url.startsWith('icons/')) return url;
    try {
        const parsed = new URL(url, window.location.href);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : fallback;
    } catch (e) {
        return fallback;
    }
}

// Парсинг одной записи приложения в унифицированный объект
// Конвертация URL иконки Apple CDN в формат без белых полей (padding).
// Формат "200x200bb-75.jpg" (bb = bounding box) даёт белые поля вокруг иконки.
// Меняем на "246x0w.png" — чистая иконка на всю площадь (для squircle-маски).
// Работает автоматически для ЛЮБОГО нового приложения с Apple CDN.
function normalizeIconUrl(url) {
    if (!url) return url;
    if (!url.includes('mzstatic.com')) return url;             // только Apple CDN
    if (/x0w\.(png|jpg)/.test(url)) return url;                // уже правильный формат
    return url.replace(/\/[^/]+$/, '/246x0w.png');            // меняем последний сегмент пути
}

function processAppData(app) {
    let rawTitle = app.appName || 'Без названия';
    let category = 'other';

    if (rawTitle.includes('#')) {
        const parts = rawTitle.split('#');
        rawTitle = parts[0].trim();
        category = parts[1].trim().toLowerCase();
    } else if (rawTitle.includes('\n')) {
        rawTitle = rawTitle.split('\n')[0].trim();
    }

    // Чистим разделители модификаций: "YouTube | Plus" → "YouTube Plus"
    rawTitle = rawTitle.replace(/\s*\|\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();

    // Унификация категорий
    if (category.startsWith('social')) category = 'social';
    if (category.startsWith('video')) category = 'video';
    if (category.startsWith('music')) category = 'music';
    if (category.startsWith('bank') || category === 'finance' || category.startsWith('money')) category = 'money';
    if (category.startsWith('game')) category = 'games';
    if (category.startsWith('design')) category = 'design';
    // VPN и сетевые утилиты: ловим оба варианта написания (network / networke — опечатка в данных)
    if (category.startsWith('network') || category === 'vpn' || category === 'networke') category = 'network';
    if (category.startsWith('study')) category = 'study';
    if (category.startsWith('office')) category = 'office';
    if (category.startsWith('kid')) category = 'kids';
    if (category.startsWith('life') || category === 'health') category = 'life';
    if (category.startsWith('travel') || category === 'navigation') category = 'travel';
    if (category.startsWith('theme')) category = 'themes';

    // Auto Clicker Hack ошибочно помечен как #Network, но это расширение Safari → Другое
    if (rawTitle.toLowerCase().startsWith('auto clicker')) category = 'other';

    // Описания хранят все 5 языков. Фолбэк на русский если перевода нет.
    // getLocalizedDesc() выбирает нужный по текущему языку интерфейса.
    const descRu = app.descriptionRu || '';
    const descUa = app.descriptionUa || '';
    const descEn = app.descriptionEn || '';
    const descEs = app.descriptionEs || '';
    const descZh = app.descriptionZh || '';

    return {
        title: rawTitle,
        image: safeImageUrl(normalizeIconUrl(app.appImage)),
        category: category,
        version: app.appVersion || '',
        descRu, descUa, descEn, descEs, descZh,
        updateTime: app.appUpdateTime || '',
        updateTimestamp: Number.isNaN(Date.parse(app.appUpdateTime)) ? 0 : Date.parse(app.appUpdateTime),
        rawTags: `${rawTitle} ${category} ${descRu} ${descUa} ${descEn} ${descEs} ${descZh}`.toLowerCase()
    };
}

// Выбор описания по текущему языку с фолбэком на русский.
// descRu обязателен (базовый язык), остальные могут быть пустыми.
function getLocalizedDesc(app) {
    const map = { ru: app.descRu, ua: app.descUa, en: app.descEn, es: app.descEs, zh: app.descZh };
    return map[currentLang] || app.descRu || '';
}

async function loadRepositoryData() {
    renderSkeletons(12);

    // Загружаем Repo.json — это единственный источник данных о приложениях.
    // Обновлять каталог = редактировать Repo.json (добавить/изменить запись, поправить appUpdateTime).
    // Работает только через http-сервер (start-server.bat) или на хостинге (GitHub Pages),
    // потому что fetch блокируется на file://. Если файл недоступен — показываем fallback.
    try {
        // CACHE_VERSION — общий счётчик версий для всех ресурсов. Меняется в index.html (?v=N).
        // Без него браузер кэширует Repo.json и не видит обновлённые описания.
        const response = await fetch('Repo.json?v=' + (window.CACHE_VERSION || 1));
        if (!response.ok) throw new Error();
        const data = await response.json();
        globalAppsData = data.map(processAppData);
        document.getElementById('heroAppsCount').innerText = globalAppsData.length + '+';
        applyFilterAndSettings();
    } catch (error) {
        console.log("Repo.json не загрузился (вероятно открыт по file://). Подгружаем тестовую среду.", error);
        loadLocalFallback();
    }
}

function loadLocalFallback() {
    const fallbackData = [
        { "appName": "YouTube | Vanced\n#Video", "appImage": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/14/35/ab/1435ab95-5b63-4acd-6c43-4cc62ab1eb95/Placeholder.mill/200x200bb-75.jpg", "appVersion": "21.16.2 | 5.2.1 | 300.5 MB | iOS 16.0 | ", "appDescription": "▎Быстрая загрузка медиа\n▎Без рекламы, пропуск рекламы внутри видео\n▎Огромное количество настроек", "appUpdateTime": "2026-04-26T23:17:16+00:00" },
        { "appName": "Instagram | LRD\n#Social", "appImage": "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/f5/db/2f/f5db2f27-5373-1930-f20d-c711c8dea902/AppIcon-0-1x_U007epad-0-85-220.png/246x0w.png", "appVersion": "431 | 4.1.0 | 594.3 MB | iOS 16.3 | ", "appDescription": "Лучшая модификация Instagram.\n\n▎Зажмите кнопку домика для настроек.", "appUpdateTime": "2026-05-30T16:40:03+00:00" },
        { "appName": "Spotify Pro\n#Music", "appImage": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3d/bf/96/3dbf962b-e7b5-2b47-c0e8-0382343fc019/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/246x0w.png", "appVersion": "8.147 | 1.2 | 447.2 MB | iOS 16.6 | ", "appDescription": "Premium подписка активирована.\n▎Без рекламы\n▎Безлимитный пропуск", "appUpdateTime": "2026-04-26T20:29:33+00:00" },
        { "appName": "Сбербанк\n#Banks", "appImage": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/be/fc/48/befc48e8-d69c-0d32-eb8b-986c7cf67484/AppIcon-0-0-1x_U007emarketing-0-9-0-85-220.png/246x0w.png", "appVersion": "12.8 | 173.7 MB | iOS 13.0 | ", "appDescription": "Модифицированное приложение банка.", "appUpdateTime": "2026-04-26T20:29:33+00:00" },
        { "appName": "Клуб Романтики Mod\n#Games", "appImage": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d8/98/fd/d898fdab-a049-00cf-9ad4-f4be740e5907/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/246x0w.png", "appVersion": "12.7 | 1.7.5 | 169.4 MB | iOS 13.0 | ", "appDescription": "▎Разблокированы все истории\n▎Безлимитные билеты", "appUpdateTime": "2026-04-26T20:29:33+00:00" }
    ];

    globalAppsData = fallbackData.map(app => {
        let cleanName = app.appName.split('\n#')[0].trim();
        let cat = app.appName.split('\n#')[1]?.toLowerCase() || 'other';
        const descRu = app.appDescription || '';
        return {
            title: cleanName,
            image: safeImageUrl(normalizeIconUrl(app.appImage)),
            category: cat,
            version: app.appVersion || '',
            descRu, descUa: '', descEn: '', descEs: '', descZh: '',
            updateTime: app.appUpdateTime || '',
            updateTimestamp: Number.isNaN(Date.parse(app.appUpdateTime)) ? 0 : Date.parse(app.appUpdateTime),
            rawTags: app.appName.toLowerCase()
        };
    });
    document.getElementById('heroAppsCount').innerText = globalAppsData.length + '+';
    applyFilterAndSettings();
}

function renderSkeletons(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `<div class="app-skeleton-item"><div class="app-skeleton-box"></div><div><div class="app-skeleton-text"></div><div class="app-skeleton-text short"></div></div></div>`;
    }
    appsGrid.innerHTML = html;
}

// ===== ПОРЦИОННЫЙ ВЫВОД С ПАГИНАЦИЕЙ =====
function renderAppsGridPage() {
    appsGrid.innerHTML = '';

    if (filteredAppsData.length === 0) {
        document.getElementById('paginationBlock').style.display = 'none';
        return;
    }

    document.getElementById('paginationBlock').style.display = 'flex';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredAppsData.length);
    const totalPages = Math.ceil(filteredAppsData.length / itemsPerPage);

    document.getElementById('prevPageBtn').disabled = (currentPage === 1);
    document.getElementById('nextPageBtn').disabled = (currentPage === totalPages || totalPages === 0);
    document.getElementById('pageIndicator').innerText = `${currentPage} / ${totalPages || 1}`;

    // Собираем весь HTML в ОДНУ строку, затем вставляем за один приём.
    // innerHTML += в цикле = N пересборок DOM (очень медленно в Safari).
    let html = '';
    for (let i = startIndex; i < endIndex; i++) {
        const app = filteredAppsData[i];
        const v = parseVersion(app.version);
        // Порядок: Версия · Размер · iOS (как просил пользователь)
        const metaParts = [v.ver, v.size, v.ios].filter(Boolean);
        const metaText = metaParts.join(' · ');
        html += `
            <button type="button" class="app-icon-item elastic-click" data-app-index="${i}" aria-label="${escapeAttr(app.title)}">
                <div class="app-draw-box">
                    <div class="glare-layer"></div>
                    <img src="${escapeAttr(app.image)}" alt="${escapeAttr(app.title)}" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='icons/MdFurman_sign_iapps_logo.jpeg';}else{this.onerror=null;}">
                </div>
                <div class="app-info">
                    <span class="app-name">${escapeHtml(app.title)}</span>
                    ${metaText ? `<span class="app-meta">${escapeHtml(metaText)}</span>` : ''}
                    <span class="app-desc">${escapeHtml(getLocalizedDesc(app))}</span>
                </div>
            </button>`;
    }
    appsGrid.innerHTML = html;
    bindAppCardClicks();
}

// ===== МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ПРИЛОЖЕНИЯ =====
const appDetailModal = document.getElementById('appDetailModal');
const detailImg = document.getElementById('detailImg');
const detailName = document.getElementById('detailName');
const detailChips = document.getElementById('detailChips');
const detailMeta = document.getElementById('detailMeta');
const detailDesc = document.getElementById('detailDesc');
const detailUpdated = document.getElementById('detailUpdated');
const modalFocusReturn = new Map();

function openModal(modal) {
    modalFocusReturn.set(modal, document.activeElement);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusTarget = modal.querySelector('.modal-close-btn, button, input, a[href]');
    if (focusTarget) setTimeout(() => focusTarget.focus(), 0);
}

function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.ios-modal.open')) document.body.style.overflow = '';
    const opener = modalFocusReturn.get(modal);
    modalFocusReturn.delete(modal);
    if (opener && typeof opener.focus === 'function') opener.focus();
}

document.addEventListener('keydown', (e) => {
    const modal = document.querySelector('.ios-modal.open');
    if (!modal) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        closeModal(modal);
        return;
    }
    if (e.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// Делегирование кликов по карточкам: открывает модалку деталей приложения.
// Один listener на контейнере навешивается один раз (init guard) — работает
// и после перерисовки страниц благодаря event delegation.
let appClicksBound = false;
function bindAppCardClicks() {
    if (appClicksBound) return;
    appClicksBound = true;
    appsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.app-icon-item');
        if (!card) return;
        const idx = parseInt(card.getAttribute('data-app-index'), 10);
        if (!isNaN(idx)) {
            openAppDetail(idx);
            triggerHaptic();
        }
    });
}

function openAppDetail(index) {
    const app = filteredAppsData[index];
    if (!app) return;
    const v = parseVersion(app.version);

    detailImg.src = app.image;
    detailImg.alt = app.title;
    detailImg.onerror = function() { this.src = 'icons/MdFurman_sign_iapps_logo.jpeg'; };

    detailName.innerText = app.title;

    // Категория как единственный чип под названием (для наглядности)
    const catLabel = t('cat_' + app.category) || app.category;
    detailChips.innerHTML = `<span class="detail-chip">${escapeHtml(catLabel)}</span>`;

    // Meta-блок: плитки iOS / Размер / Версия / Обновлено (как в App Store)
    const metaItems = [];
    if (v.ios) metaItems.push(`<div class="app-detail-meta-item"><span class="app-detail-meta-value">${escapeHtml(v.ios.replace(/^ios\s*/i, ''))}</span><span class="app-detail-meta-label">${t('detail_meta_ios')}</span></div>`);
    if (v.size) metaItems.push(`<div class="app-detail-meta-item"><span class="app-detail-meta-value">${escapeHtml(v.size)}</span><span class="app-detail-meta-label">${t('detail_meta_size')}</span></div>`);
    if (v.ver) metaItems.push(`<div class="app-detail-meta-item"><span class="app-detail-meta-value">${escapeHtml(v.ver)}</span><span class="app-detail-meta-label">${t('detail_meta_version')}</span></div>`);
    detailMeta.innerHTML = metaItems.join('');
    detailMeta.style.display = metaItems.length ? 'flex' : 'none';

    detailDesc.innerText = getLocalizedDesc(app) || t('detail_no_desc');

    // Дата обновления — внизу по центру, с иконкой часов (как в App Store)
    if (app.updateTimestamp) {
        try {
            const d = new Date(app.updateTimestamp);
            const localeMap = { ru: 'ru-RU', ua: 'uk-UA', en: 'en-US', es: 'es-ES', zh: 'zh-CN' };
            const dateStr = d.toLocaleDateString(localeMap[currentLang] || 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            detailUpdated.innerHTML = `<i class="far fa-clock"></i> ${escapeHtml(t('detail_updated', { d: dateStr }))}`;
            detailUpdated.style.display = '';
        } catch(e) { detailUpdated.style.display = 'none'; }
    } else { detailUpdated.style.display = 'none'; }

    openModal(appDetailModal);
    triggerHaptic();
}

function closeAppDetail() {
    closeModal(appDetailModal);
}

document.getElementById('closeAppDetailBtn').addEventListener('click', closeAppDetail);
document.getElementById('appDetailBackdrop').addEventListener('click', closeAppDetail);
// Кнопка «Купить доступ» в модалке приложения → закрываем модалку + скроллим к тарифам
document.getElementById('detailBuyAccessBtn').addEventListener('click', () => {
    closeAppDetail();
    // Авто-выбор «Репозиторий» в тарифах (как просил пользователь)
    const repoBtn = document.querySelector('#productSelector .selector-btn[data-prod="repo"]');
    if (repoBtn && !repoBtn.classList.contains('active')) {
        repoBtn.click();
    }
    setTimeout(() => {
        document.getElementById('tariffs').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    triggerHaptic();
});

// ===== МОДАЛЬНОЕ ОКНО «КАК ЭТО РАБОТАЕТ» =====
// Открывается по клику на кнопку в шапке. Грузит how-it-works.json,
// берёт текст на языке currentLang, парсит Markdown → HTML, показывает в модалке.
const howItWorksModal = document.getElementById('howItWorksModal');
const howItWorksBody = document.getElementById('howItWorksBody');
let howItWorksData = null;

// Парсер мини-Markdown для ответов (жирный + ссылки). Простой, без заголовков.
function parseInlineMd(text) {
    let html = escapeHtml(text);
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
        try {
            const parsed = new URL(url, window.location.href);
            if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
                return `<a href="${escapeAttr(parsed.href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
            }
        } catch (e) {
            // Invalid URLs remain plain text below.
        }
        return label;
    });
    return html;
}

// Рендер FAQ-аккордеона. Каждый вопрос = кнопка с номером в кружке.
// При клике — раскрывается ответ. Аккордеон: только один открыт.
function renderFAQ(items) {
    return items.map((item, i) => {
        const num = i + 1;
        return `
        <div class="faq-item">
            <button type="button" class="faq-question" data-faq-index="${i}">
                <span class="faq-number">${num}</span>
                <span class="faq-question-text">${escapeHtml(item.q)}</span>
                <i class="fas fa-chevron-down faq-chevron"></i>
            </button>
            <div class="faq-answer"><p>${parseInlineMd(item.a)}</p></div>
        </div>`;
    }).join('');
}

// Делегирование кликов по вопросам (работает после каждого рендера).
let faqClicksBound = false;
function bindFAQClicks() {
    if (faqClicksBound) return;
    faqClicksBound = true;
    howItWorksBody.addEventListener('click', (e) => {
        const q = e.target.closest('.faq-question');
        if (!q) return;
        const item = q.parentElement;
        const isOpen = item.classList.contains('open');
        // Закрываем все (аккордеон — только один открыт)
        howItWorksBody.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
        triggerHaptic();
    });
}

async function openHowItWorks() {
    openModal(howItWorksModal);
    triggerHaptic();

    // Грузим JSON один раз, кэшируем в howItWorksData
    if (!howItWorksData) {
        try {
            const resp = await fetch('how-it-works.json?v=' + (window.CACHE_VERSION || 1));
            howItWorksData = await resp.json();
        } catch (e) {
            howItWorksBody.innerHTML = '<p>Инструкция временно недоступна.</p>';
            return;
        }
    }

    // Берём текст на текущем языке, если нет — фолбэк на русский
    const items = howItWorksData[currentLang] || howItWorksData.ru || [];
    howItWorksBody.innerHTML = renderFAQ(items);
    bindFAQClicks();
}

function closeHowItWorks() {
    closeModal(howItWorksModal);
}

document.getElementById('closeHowItWorksBtn').addEventListener('click', closeHowItWorks);
document.getElementById('howItWorksBackdrop').addEventListener('click', closeHowItWorks);

// ===== МОДАЛКА «ЧТО ТАКОЕ СЕРТИФИКАТ И РЕПОЗИТОРИЙ» =====
const tariffsHelpModal = document.getElementById('tariffsHelpModal');
document.getElementById('tariffsHelpBtn').addEventListener('click', () => {
    openModal(tariffsHelpModal);
    triggerHaptic();
});
document.getElementById('closeTariffsHelpBtn').addEventListener('click', () => closeModal(tariffsHelpModal));
document.getElementById('tariffsHelpBackdrop').addEventListener('click', () => closeModal(tariffsHelpModal));

// ===== НАВИГАЦИОННЫЕ КНОПКИ В ТЕЛЕФОНЕ-ПРЕВЬЮ =====
// Список приложений → скролл к каталогу
document.getElementById('navAppsBtn').addEventListener('click', () => {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
    triggerHaptic();
});
// Тарифы → скролл к тарифам
document.getElementById('navTariffsBtn').addEventListener('click', () => {
    document.getElementById('tariffs').scrollIntoView({ behavior: 'smooth', block: 'start' });
    triggerHaptic();
});
// Как это работает? → открыть модалку
document.getElementById('navHowItWorksBtn').addEventListener('click', openHowItWorks);
// Заказать взлом → открыть форму заявки
document.getElementById('navSuggestBtn').addEventListener('click', () => { openSuggestModal(); });
// iVPN Vless — ссылка с data-link="vpn", работает автоматически через LINKS-config

// ===== ФИЛЬТРАЦИЯ И ПОИСК =====
const searchInput = document.getElementById('repoSearch');
const searchClearBtn = document.getElementById('searchClearBtn');
const searchInlineHint = document.getElementById('searchInlineHint');
const hintSuggestTarget = document.getElementById('hintSuggestTarget');
const emptyState = document.getElementById('emptySearchState');
const suggestOrderBtn = document.getElementById('suggestOrderBtn');
const emptyStateText = document.getElementById('emptyStateText');

// Обработка выбора категории в настройках
document.querySelectorAll('input[name="categoryMode"]').forEach(radio => {
    radio.addEventListener('change', function() {
        selectedCategory = this.value;
        currentPage = 1;
        applyFilterAndSettings();
    });
});

// Debounce: откладывает фильтрацию (1559 приложений) до тех пор,
// пока пользователь не перестанет печатать на 220 мс — поиск стал плавным.
let searchDebounceTimer = null;
function debounceSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        currentPage = 1;
        applyFilterAndSettings();
        handleInlineAutocomplete();
    }, 220);
}

searchInput.addEventListener('input', () => {
    if(searchInput.value.length > 0) searchClearBtn.classList.add('visible');
    else searchClearBtn.classList.remove('visible');
    debounceSearch();
});

searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchClearBtn.classList.remove('visible');
    searchInlineHint.classList.remove('visible');
    currentPage = 1;
    applyFilterAndSettings();
    searchInput.focus();
});

searchInput.addEventListener('focus', () => { startAnimation(); const r = searchInput.getBoundingClientRect(); gravityWell.x = r.left + r.width/2; gravityWell.y = r.top + r.height/2; gravityWell.active = true; });
searchInput.addEventListener('blur', () => { gravityWell.active = false; startAnimation(); });

function handleInlineAutocomplete() {
    const query = searchInput.value.toLowerCase().trim();
    if (query.length < 2) { searchInlineHint.classList.remove('visible'); return; }
    const variations = getDualLayoutQuery(query);
    // Ищем лучшее совпадение, а не первое попавшееся:
    // 1) сортируем кандидатов — чем короче название, тем точнее совпадение (you → "YouTube Music", а не первая запись)
    // 2) точное начало слова важнее, чем просто совпадение тегов
    const candidates = globalAppsData
        .filter(app => variations.some(v => app.title.toLowerCase().startsWith(v)))
        .sort((a, b) => a.title.length - b.title.length);
    const match = candidates[0];
    if (match && match.title.toLowerCase() !== query) {
        hintSuggestTarget.innerText = match.title; searchInlineHint.classList.add('visible');
    } else { searchInlineHint.classList.remove('visible'); }
}

// Делегирование клика: span пересоздаётся в applyTranslations() (innerHTML),
// поэтому клик вешаем на родителя — он не меняется и всегда ловит клик по span.
searchInlineHint.addEventListener('click', (e) => {
    const target = e.target.closest('#hintSuggestTarget');
    if (!target) return;
    const suggestedTitle = target.innerText;
    searchInput.value = suggestedTitle;
    searchClearBtn.classList.add('visible');
    currentPage = 1;
    // Если выбрана категория (Путешествия и т.д.), а подсказанное приложение в ней нет —
    // сбрасываем категорию на «Все», иначе пользователь увидит «Ничего не нашлось».
    const suggestedApp = globalAppsData.find(a => a.title === suggestedTitle);
    if (suggestedApp && selectedCategory && suggestedApp.category !== selectedCategory) {
        const allRadio = document.querySelector('input[name="categoryMode"][value=""]');
        if (allRadio) {
            allRadio.checked = true;
            selectedCategory = '';
        }
    }
    applyFilterAndSettings();
    searchInlineHint.classList.remove('visible');
    searchInput.focus();
});

function applyFilterAndSettings() {
    const cleanQuery = searchInput.value.toLowerCase().trim();
    const queryVariations = cleanQuery ? getDualLayoutQuery(cleanQuery) : [];

    filteredAppsData = globalAppsData.filter(app => {
        const matchCategory = (!selectedCategory || app.category === selectedCategory);
        const matchSearch = !cleanQuery || queryVariations.some(v => app.rawTags.includes(v));
        return matchCategory && matchSearch;
    });

    if (currentSortMode === 'time') {
        // Сортируем по дате обновления (свежие сверху). При равных датах или
        // отсутствии даты — сохраняем исходный порядок (stable sort через индекс).
        const withIndex = filteredAppsData.map((app, i) => ({ app, i }));
        withIndex.sort((a, b) => {
            const ta = a.app.updateTimestamp;
            const tb = b.app.updateTimestamp;
            if (tb !== ta) return tb - ta;   // свежие сначала
            return a.i - b.i;                 // при равенстве — исходный порядок
        });
        filteredAppsData = withIndex.map(x => x.app);
    }

    renderAppsGridPage();

    if (filteredAppsData.length === 0) {
        emptyState.style.display = 'flex';
        if (cleanQuery.length > 0) {
            emptyStateText.innerText = t('empty_no_results', { q: searchInput.value });
            suggestOrderBtn.style.display = 'inline-flex';
            // Кнопка открывает форму заявки (логика ниже в секции suggestModal).
        } else { emptyStateText.innerText = t('empty_no_cat'); suggestOrderBtn.style.display = 'none'; }
    } else { emptyState.style.display = 'none'; }
}

// ===== ПАГИНАЦИЯ =====
// На мобильных smooth-скролл в Safari тормозит поверх тяжёлого рендера — используем instant.
const scrollBehavior = window.innerWidth < 768 ? 'auto' : 'smooth';
document.getElementById('prevPageBtn').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderAppsGridPage(); document.getElementById('catalog').scrollIntoView({ behavior: scrollBehavior, block: 'start' }); }
});
document.getElementById('nextPageBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredAppsData.length / itemsPerPage);
    if (currentPage < totalPages) { currentPage++; renderAppsGridPage(); document.getElementById('catalog').scrollIntoView({ behavior: scrollBehavior, block: 'start' }); }
});

// ===== МОДАЛЬНОЕ ОКНО НАСТРОЕК =====
const settingsModal = document.getElementById('settingsModal');
document.getElementById('openSettingsBtn').addEventListener('click', () => openModal(settingsModal));
document.getElementById('closeSettingsBtn').addEventListener('click', () => closeModal(settingsModal));
document.getElementById('modalBackdrop').addEventListener('click', () => closeModal(settingsModal));

// ===== МОДАЛЬНОЕ ОКНО ЗАКАЗА ВЗЛОМА ПРИЛОЖЕНИЯ =====
// Открытие: из пустого поиска (#suggestOrderBtn) ИЛИ компактной кнопки ➕ в шапке (#suggestHeaderBtn).
// Форма: 5 полей, все обязательны. Кнопка отправки disabled пока всё не заполнено.
// Отправка: открывает Telegram-чат с админом (LINKS.admin) с prefill-сообщением.
const suggestModal = document.getElementById('suggestModal');
const suggestSubmitBtn = document.getElementById('suggestSubmitBtn');
const suggestAppstore = document.getElementById('suggestAppstore');
const suggestTg = document.getElementById('suggestTg');
const suggestTodoOther = document.getElementById('suggestTodoOther');
const suggestPayOther = document.getElementById('suggestPayOther');

function openSuggestModal() {
    // Форма всегда открывается пустой — ссылку App Store пользователь должен
    // вставить сам (с валидацией https://apps.apple.com/).
    openModal(suggestModal);
    updateSuggestSubmitState();
}

document.getElementById('suggestOrderBtn').addEventListener('click', () => { openSuggestModal(); });
document.getElementById('closeSuggestBtn').addEventListener('click', () => closeModal(suggestModal));
document.getElementById('suggestBackdrop').addEventListener('click', () => closeModal(suggestModal));

// Toggle «Другое»: показываем текстовое поле при выборе чипа «Другое»
document.querySelectorAll('input[name="suggestTodo"]').forEach(radio => {
    radio.addEventListener('change', function() {
        suggestTodoOther.style.display = (this.value === 'other') ? 'block' : 'none';
        if (this.value !== 'other') suggestTodoOther.value = '';
        updateSuggestSubmitState();
    });
});
document.querySelectorAll('input[name="suggestPay"]').forEach(radio => {
    radio.addEventListener('change', function() {
        suggestPayOther.style.display = (this.value === 'other') ? 'block' : 'none';
        if (this.value !== 'other') suggestPayOther.value = '';
        updateSuggestSubmitState();
    });
});

// Валидация: кнопка disabled пока не заполнены все обязательные поля
function updateSuggestSubmitState() {
    const todoSelected = document.querySelector('input[name="suggestTodo"]:checked');
    const todoOk = todoSelected && (todoSelected.value !== 'other' || suggestTodoOther.value.trim());
    const premiumOk = !!document.querySelector('input[name="suggestPremium"]:checked');
    const paySelected = document.querySelector('input[name="suggestPay"]:checked');
    const payOk = paySelected && (paySelected.value !== 'other' || suggestPayOther.value.trim());

    // Поле приложения обязательно, но принимаем ЛЮБОЙ текст — ссылку или название.
    // Валидация apps.apple.com убрана по запросу (можно писать словами).
    const urlValue = suggestAppstore.value.trim();
    const urlOk = urlValue.length > 0;

    const allFilled =
        urlOk &&
        todoOk &&
        suggestTg.value.trim() &&
        premiumOk &&
        payOk;
    suggestSubmitBtn.disabled = !allFilled;
}

// Любое изменение поля → перепроверка состояния кнопки
['suggestAppstore', 'suggestTg', 'suggestTodoOther', 'suggestPayOther'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateSuggestSubmitState);
});
document.querySelectorAll('input[name="suggestPremium"]').forEach(radio => {
    radio.addEventListener('change', updateSuggestSubmitState);
});

// Отправка: собираем значения и открываем Telegram с prefill-сообщением
suggestSubmitBtn.addEventListener('click', () => {
    if (suggestSubmitBtn.disabled) return;

    const todoRadio = document.querySelector('input[name="suggestTodo"]:checked');
    const todoValue = todoRadio.value === 'other'
        ? suggestTodoOther.value.trim()
        : (todoRadio.nextElementSibling ? todoRadio.nextElementSibling.innerText : todoRadio.value);

    const premiumRadio = document.querySelector('input[name="suggestPremium"]:checked');
    const premiumValue = premiumRadio.nextElementSibling ? premiumRadio.nextElementSibling.innerText : premiumRadio.value;

    const payRadio = document.querySelector('input[name="suggestPay"]:checked');
    const payValue = payRadio.value === 'other'
        ? suggestPayOther.value.trim()
        : (payRadio.nextElementSibling ? payRadio.nextElementSibling.innerText : payRadio.value);

    const msg = t('suggest_form_msg', {
        appstore: suggestAppstore.value.trim(),
        todo: todoValue,
        tg: suggestTg.value.trim(),
        premium: premiumValue,
        pay: payValue
    });

    window.open(`${LINKS.admin}?text=${encodeURIComponent(msg)}`, '_blank');
    closeModal(suggestModal);
    // Очищаем форму после отправки
    suggestAppstore.value = ''; suggestTg.value = '';
    suggestTodoOther.value = ''; suggestPayOther.value = '';
    document.querySelectorAll('#suggestModal input[type="radio"]').forEach(r => r.checked = false);
    suggestTodoOther.style.display = 'none'; suggestPayOther.style.display = 'none';
    suggestSubmitBtn.disabled = true;
    triggerHaptic();
});

document.querySelectorAll('input[name="sortMode"]').forEach(radio => {
    radio.addEventListener('change', function() {
        currentSortMode = this.value;
        currentPage = 1;
        applyFilterAndSettings();
    });
});

document.querySelectorAll('input[name="itemsPerPage"]').forEach(radio => {
    radio.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value, 10);
        currentPage = 1;
        applyFilterAndSettings();
    });
});

document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    document.querySelector('input[name="categoryMode"][value=""]').checked = true;
    document.querySelector('input[name="sortMode"][value="time"]').checked = true;
    document.querySelector('input[name="itemsPerPage"][value="20"]').checked = true;
    selectedCategory = '';
    currentSortMode = 'time';
    itemsPerPage = 20;
    currentPage = 1;
    applyFilterAndSettings();
    closeModal(settingsModal);
});

// ===== ТАРИФЫ И СЕЛЕКТОРЫ =====
const productHighlighter = document.getElementById('productHighlighter');
const currencyHighlighter = document.getElementById('currencyHighlighter');
let currentProduct = 'cert', currentCurrency = localStorage.getItem('iapps_currency') || LANG_CURRENCY[currentLang] || 'rub';

function updateHighlighter(h, btn) { h.style.width = btn.offsetWidth + 'px'; h.style.transform = `translateX(${btn.offsetLeft - 2}px)`; }

document.querySelectorAll('#productSelector .selector-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('#productSelector .selector-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active'); currentProduct = this.getAttribute('data-prod');
        updateHighlighter(productHighlighter, this); updateAllPrices(); updateActionBlock();
    });
});

document.querySelectorAll('#currencySelector .selector-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('#currencySelector .selector-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active'); currentCurrency = this.getAttribute('data-curr');
        localStorage.setItem('iapps_currency', currentCurrency);
        updateHighlighter(currencyHighlighter, this); updateAllPrices(); updateActionBlock();
    });
});

// ===== ЦЕНЫ ИЗ prices.json =====
// Все цены тарифов лежат в prices.json. Меняешь там — обновляется на сайте.
// Структура: PRICES[product][period][currency] = "600₽"
let PRICES = null;

async function loadPrices() {
    try {
        const resp = await fetch('prices.json?v=' + (window.CACHE_VERSION || 1));
        PRICES = await resp.json();
    } catch (e) {
        console.log('prices.json не загрузился, используем data-атрибуты.', e);
    }
    updateAllPrices();
}

function updateAllPrices() {
    document.querySelectorAll('.price-tag').forEach(tag => {
        // Цены берём ТОЛЬКО из prices.json (единый источник правды).
        // HTML data-* атрибуты убраны — менять цены только в prices.json.
        if (PRICES && PRICES[currentProduct] && PRICES[currentProduct][tag.dataset.payload]) {
            tag.innerText = PRICES[currentProduct][tag.dataset.payload][currentCurrency] || '';
        }
    });
}

const tariffsGrid = document.getElementById('tariffsGrid');
const tariffActionBlock = document.getElementById('tariffActionBlock');
let activeCard = null;

document.querySelectorAll('.tariff-outline-card').forEach(card => {
    card.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            this.classList.remove('active'); tariffsGrid.classList.remove('has-active'); tariffActionBlock.classList.remove('visible');
            activeCard = null; return;
        }
        document.querySelectorAll('.tariff-outline-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active'); tariffsGrid.classList.add('has-active'); activeCard = this;
        updateActionBlock(); tariffActionBlock.classList.add('visible');

        if (window.innerWidth < 768) {
            tariffsGrid.scrollTo({ left: this.offsetLeft - (tariffsGrid.offsetWidth/2) + (this.offsetWidth/2), behavior: 'smooth' });
            setTimeout(() => { tariffActionBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 200);
        }
    });
});

function updateActionBlock() {
    if (!activeCard) return;
    const payload = activeCard.getAttribute('data-payload');
    const days = activeCard.querySelector('.days').innerText;
    const price = activeCard.querySelector('.price-tag').innerText;
    const prodName = currentProduct === 'cert' ? t('prod_cert') : t('prod_repo');
    document.getElementById('actionInfoText').innerText = t('plan_info', { p: prodName, d: days, c: price });
    document.getElementById('buyBotBtn').href = `${LINKS.bot}?start=${currentProduct}_${payload}`;
    document.getElementById('buyAdminBtn').href = `${LINKS.admin}?text=${encodeURIComponent(t('buy_admin_msg', { p: prodName, d: days, c: price }))}`;
}

// ===== ТЁМНАЯ ТЕМА =====
const themeToggle = document.getElementById('themeToggle');
// theme-color меняет цвет адресной строки iOS Safari / Chrome под текущую тему,
// чтобы при overscroll по краям не было тёмных пятен системного цвета браузера.
function syncThemeColor() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    let tc = document.querySelector('meta[name="theme-color"]');
    if (!tc) { tc = document.createElement('meta'); tc.name = 'theme-color'; document.head.appendChild(tc); }
    tc.content = isDark ? '#12141c' : '#f2f1ed';
}

// При первой загрузке: если пользователь не выбирал тему вручную —
// подстраиваемся под систему (prefers-color-scheme).
(function initTheme() {
    const savedTheme = localStorage.getItem('iapps_theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (savedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        // Нет сохранённого выбора → берём из системы
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    syncThemeColor();
})();

themeToggle.addEventListener('click', () => {
    // Отключаем плавные переходы на момент смены темы — цвета меняются мгновенно.
    document.documentElement.classList.add('theme-switching');
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.removeAttribute('data-theme'); themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; startAnimation();
        localStorage.setItem('iapps_theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark'); themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; startAnimation();
        localStorage.setItem('iapps_theme', 'dark');
    }
    syncThemeColor();
    // Возвращаем переходы в следующем кадре (после применения новых цветов).
    requestAnimationFrame(() => requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching');
    }));
});
syncThemeColor(); // синхронизируем при загрузке под сохранённую/дефолтную тему

// ===== ПРОКРУТКА, КНОПКА «НАВЕРХ», ХАПТИК =====
let lastScroll = 0;
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScroll && st > 90) document.getElementById('mainHeader').classList.add('header-hidden');
    else document.getElementById('mainHeader').classList.remove('header-hidden');
    lastScroll = st <= 0 ? 0 : st;

    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) document.getElementById('scrollProgressBar').style.width = (window.pageYOffset / total) * 100 + '%';

    if (st > window.innerHeight * 0.8) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
}, {passive: true});

scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); triggerHaptic(); });

document.addEventListener('click', (e) => { if (e.target.closest('.elastic-click') || e.target.closest('.selector-btn') || e.target.closest('.tariff-outline-card') || e.target.closest('.category-tab-btn') || e.target.closest('.page-nav-btn')) triggerHaptic(); });

// ===== TOUCH-ЭФФЕКТ ПРУЖИНЫ =====
const wrapper = document.getElementById('mainWrapper'); let startY = 0;
window.addEventListener('touchstart', (e) => { startY = e.touches[0].pageY; }, {passive: true});
window.addEventListener('touchmove', (e) => {
    const y = e.touches[0].pageY, scroll = window.pageYOffset;
    if (scroll === 0 && y > startY) wrapper.style.transform = `translateY(${(y - startY) * 0.2}px)`;
    else if ((window.innerHeight + scroll >= document.documentElement.scrollHeight) && y < startY) wrapper.style.transform = `translateY(${(y - startY) * 0.2}px)`;
}, {passive: true});
window.addEventListener('touchend', () => wrapper.style.transform = 'none');

// ===== АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ =====
if (reducedMotionQuery.matches) {
    document.querySelectorAll('.reveal-box').forEach(box => box.classList.add('revealed'));
} else {
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('revealed'); }); }, { threshold: 0.05 });
    document.querySelectorAll('.reveal-box').forEach(box => observer.observe(box));
}

// Троттлинг resize: не чаще 1 раза в 150мс (вместо вызова на каждый пиксель).
let resizeTimer = null;
window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initGrid();
        startAnimation();
        const ap = document.querySelector('#productSelector .selector-btn.active'); if(ap) updateHighlighter(productHighlighter, ap);
        const ac = document.querySelector('#currencySelector .selector-btn.active'); if(ac) updateHighlighter(currencyHighlighter, ac);
    }, 150);
});

// Возврат на вкладку — перерисовать сетку (на случай если она «уснула»).
document.addEventListener('visibilitychange', () => { if (!document.hidden) startAnimation(); });
reducedMotionQuery.addEventListener('change', () => {
    if (reducedMotionQuery.matches && _rafId) {
        cancelAnimationFrame(_rafId);
        _rafId = null;
        _animRunning = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (!reducedMotionQuery.matches) {
        initGrid();
        startAnimation();
    }
});

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
applyTranslations(); // Применить сохранённый язык до рендера каталога
initLangSwitcher();  // Подключить переключатель языка

// Подставляем URL из config.js во все элементы с data-link="ключ".
// Например: <a href="#" data-link="faq"> → href = LINKS.faq
document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.getAttribute('data-link');
    if (window.LINKS && LINKS[key]) el.href = LINKS[key];
});

// Синхронизация активной кнопки валюты с сохранённым значением
document.querySelectorAll('#currencySelector .selector-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-curr') === currentCurrency);
});
updateAllPrices(); // Сразу показать цены в нужной валюте (фолбэк на data-атрибуты)
loadPrices();      // Асинхронно грузим prices.json и обновляем цены из него

// ===== ОПТИМИЗАЦИЯ =====
// Раньше тут был low-power детектор, но он ложно срабатывал на iPhone 12/16 Pro
// (iOS Safari занижает hardwareConcurrency) и ломал Liquid Glass дизайн.
// Убран полностью — backdrop-filter работает везде, Canvas лёгкий (точки, O(n)).

// Canvas-сетка работает на всех устройствах. На мобильных используем больший
// шаг и предвычисленные рёбра вместо O(n²) — нагрузка минимальная.
initGrid(); startAnimation();
loadRepositoryData();
setTimeout(() => {
    const ap = document.querySelector('#productSelector .selector-btn.active'); if(ap) updateHighlighter(productHighlighter, ap);
    const ac = document.querySelector('#currencySelector .selector-btn.active'); if(ac) updateHighlighter(currencyHighlighter, ac);
}, 100);

// ===== SERVICE WORKER (офлайн-кэш иконок и ключевых ресурсов) =====
// Регистрируем только на http(s) — на file:// не работает (и не нужна).
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch((err) => {
            console.log('SW registration failed:', err);
        });
    });
}
