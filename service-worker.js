// ==========================================================================
// iAPPS — Service Worker (офлайн-кэш иконок и ключевых ресурсов)
// ==========================================================================
// Что делает:
//   1. При установке кэширует core-ресурсы (HTML, CSS, JS, JSON) — сайт работает офлайн.
//   2. Иконки с Apple CDN (mzstatic.com) кэшируются runtime (CacheFirst).
//      Если Apple CDN упадёт — иконки всё равно покажутся.
//   3. Локальные иконки (icons/) тоже кэшируются навсегда.
//   4. Остальные запросы — network-first (с фолбэком на кэш).
//
// Версия кэша меняется при обновлении CACHE_VERSION (чтобы пользователи
// получали свежие данные, а не вечный офлайн-кэш).
// ==========================================================================

const CACHE_VERSION = 'iapps-v99';
const CORE_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './config.js',
    './translations.js',
    './prices.json',
    './how-it-works.json',
    './Repo.json',
    './logo.png'
];

// Установка: кэшируем core-ресурсы
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            // addAll не падает целиком если один ресурс не загрузился
            return Promise.allSettled(
                CORE_ASSETS.map(url => cache.add(url).catch(() => {}))
            );
        })
    );
    self.skipWaiting(); // активируем SW сразу
});

// Активация: удаляем старые версии кэша
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim(); // берём управление сразу
});

// Стратегии запросов
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // Только GET-запросы (POST и т.д. не кэшируем)
    if (req.method !== 'GET') return;

    // 1. Иконки Apple CDN (mzstatic.com) — CacheFirst (берём из кэша, если нет — сеть)
    if (url.hostname.includes('mzstatic.com') || req.destination === 'image') {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req).then((resp) => {
                    // Кэшируем только успешные ответы
                    if (resp.ok) {
                        const clone = resp.clone();
                        caches.open(CACHE_VERSION).then(c => c.put(req, clone));
                    }
                    return resp;
                }).catch(() => cached || new Response('', { status: 404 }));
            })
        );
        return;
    }

    // 2. Локальные иконки (icons/) — CacheFirst
    if (url.pathname.includes('/icons/')) {
        event.respondWith(
            caches.match(req).then((cached) => {
                return cached || fetch(req).then((resp) => {
                    if (resp.ok) {
                        const clone = resp.clone();
                        caches.open(CACHE_VERSION).then(c => c.put(req, clone));
                    }
                    return resp;
                }).catch(() => cached || new Response('', { status: 404 }));
            })
        );
        return;
    }

    // 3. Навигация (HTML) — NetworkFirst (свежая версия, фолбэк на кэш)
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).then((resp) => {
                const clone = resp.clone();
                caches.open(CACHE_VERSION).then(c => c.put('./index.html', clone));
                return resp;
            }).catch(() => caches.match('./index.html'))
        );
        return;
    }

    // 4. Остальное (CSS/JS/JSON) — NetworkFirst (свежая версия всегда, фолбэк на кэш).
    //    Раньше был StaleWhileRevalidate — но он возвращал старый prices.json.
    if (url.pathname.endsWith('.json') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
        event.respondWith(
            fetch(req).then((resp) => {
                if (resp.ok) {
                    const clone = resp.clone();
                    caches.open(CACHE_VERSION).then(c => c.put(req, clone));
                }
                return resp;
            }).catch(() => caches.match(req).then(c => c || new Response('', { status: 404 })))
        );
        return;
    }

    // 5. Прочее — StaleWhileRevalidate (кэш сразу + обновление в фоне)
    event.respondWith(
        caches.match(req).then((cached) => {
            const fetchPromise = fetch(req).then((resp) => {
                if (resp.ok) {
                    const clone = resp.clone();
                    caches.open(CACHE_VERSION).then(c => c.put(req, clone));
                }
                return resp;
            }).catch(() => cached);
            return cached || fetchPromise;
        })
    );
});