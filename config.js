// ==========================================================================
// iAPPS — ЦЕНТРАЛЬНЫЙ КОНФИГ ССЫЛОК
// Все внешние ссылки собраны здесь. Меняй URL в одном месте — обновится везде.
// Подключается ПЕРВЫМ в index.html (до translations.js / script.js).
// ==========================================================================

const LINKS = {
    // ===== TELEGRAM =====
    bot:        'https://t.me/iappspay_bot',          // бот покупки (автомат)
    admin:      'https://t.me/mdfurman',              // админ (ручные вопросы)
    channel:    'https://t.me/iapps_ipa',             // основной канал
    vpn:        'https://lk.iapps.sbs/landing',         // страница VPN (лендинг)

    // ===== TELETYPE (статьи-справка) =====
    faq:        'https://teletype.in/@iapps/faq_iapps', // FAQ
    udid:       'https://t.me/iapps_udid',      // бот для получения UDID
    certInfo:   'https://teletype.in/@iapps/rcert_info', // про сертификаты
    warranty:   'https://t.me/c/1250520456/1462',       // гарантия (пост в канале)

    // ===== ОТЗЫВЫ =====
    reviews:    'https://t.me/iapps_otzyv',    // канал с отзывами клиентов

    // ===== ДЕФОЛТНАЯ ИКОНКА (fallback) =====
    // Используется, если у приложения нет своей иконки в Repo.json
    fallbackIcon: 'icons/MdFurman_sign_iapps_logo.jpeg',
};

// Делаем глобально доступным
window.LINKS = LINKS;
