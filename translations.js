// ==========================================================================
// СИСТЕМА МУЛЬТИЯЗЫЧНОСТИ (i18n)
// Поддерживаемые языки: RU, UA, EN, ES, ZH
// ==========================================================================

const I18N = {
    ru: {
        hero_subtitle: 'Репозиторий', hero_promo: 'Сертификаты и прокаченные приложения для твоего iPhone и iPad',
        feat1_title: 'Моментальная выдача', feat1_desc: 'Доступ к файлам за пару минут',
        feat2_title: 'Все права (32)', feat2_desc: 'Полная поддержка функций',
        feat3_title: 'Поддержка 1 год', feat3_desc: 'Помощь по любым IPA',
        feat4_title: 'Гарантия качества', feat4_desc: 'Замена при отзыве Apple',
        phone_title: 'Твой личный App Store', phone_desc: 'Каталог модифицированных приложений для iOS.', stat_apps: 'приложений', stat_users: 'пользователей', stat_live: 'поддержка',
        phone_repo_btn: 'Репозиторий →', phone_udid_btn: 'Узнать UDID', how_it_works: 'Как это работает',
        nav_apps: 'Список приложений', nav_tariffs: 'Тарифы', nav_how: 'Как это работает?', nav_suggest: 'Заказать взлом', nav_vpn: 'iVPN Vless',
        catalog_title: 'Каталог приложений', catalog_subtitle: 'Найдите нужное приложение среди нашей коллекции',
        search_placeholder: 'Поиск приложений...', search_hint_prefix: 'Возможно, вы искали:', search_hint_suffix: '?',
        suggest_app: 'Предложить добавить приложение',
        empty_no_results: 'Ничего не нашлось по запросу «{q}».', empty_no_cat: 'В данной категории пока нет элементов.', empty_default: 'Ничего не нашлось.',
        settings_title: 'Настройки каталога', set_category: 'Категория', set_sort: 'Сортировка', set_perpage: 'Отображать на странице', set_reset: 'Сбросить конфигурацию',
        cat_all: '🌐 Все', cat_social: '💬 Соц.сети', cat_music: '🎵 Музыка', cat_video: '🎬 Видео', cat_design: '🎨 Дизайн', cat_network: '🌍 VPN',
        cat_study: '📚 Учёба', cat_office: '📋 Офис', cat_games: '🎮 Игры', cat_kids: '👶 Дети', cat_life: '💪 Здоровье', cat_money: '💳 Финансы', cat_travel: '✈️ Путешествия', cat_themes: '🖌️ Темы', cat_other: '📦 Другое',
        sort_new: 'Новые', sort_all: 'Все',
        detail_buy: 'Купить через бот', detail_no_desc: 'Описание отсутствует.', detail_updated: 'Обновлено: {d}', detail_mod: 'Мод {v}', detail_meta_ios: 'iOS', detail_meta_size: 'Размер', detail_meta_version: 'Версия', detail_meta_updated: 'Обновлено',
        tariffs_title: 'Тарифные планы', prod_cert: 'Сертификат', prod_repo: 'Репозиторий',
        dur_3m: '3 месяца', dur_6m: '6 месяцев', dur_12m: '12 месяцев', dur_24m: '24 месяца', badge_top: 'Топ',
        th_cert_title: '🛡 Сертификат разработчика', th_cert_desc: 'Нужен для возможности установки сторонних приложений на iPhone и iPad. Действует до одного года максимум. Для использования и установки не требуется ПК.',
        th_repo_title: '📦 Репозиторий', th_repo_desc: 'Наш каталог взломанных приложений (взломы, моды, банки, удаленные приложения и многие другие). Для использования нужен сертификат.',
        plan_selected: 'Выбран план', plan_info: 'План: {p} на {d} за {c}', buy_bot: 'Купить через бот', write_seller: 'Написать продавцу',
        buy_admin_msg: 'Здравствуйте! Хочу оформить тариф IAppsRepo: {p} на {d} за {c}', suggest_msg: 'Добавьте, пожалуйста, приложение: {q}',
        suggest_form_title: '🔒 Заказ взлома приложения',
        suggest_form_appstore: '🔗 Название или ссылка на приложение', suggest_form_appstore_ph: 'Например: Telegram или https://apps.apple.com/...',
        suggest_form_todo: '🛠️ Что нужно сделать?', suggest_form_todo1: 'Взлом на подписку/покупку (от 300₽)', suggest_form_todo2: 'Чистый .ipa без модификаций (200₽)', suggest_form_todo3: 'Исправление вылета (300₽)', suggest_form_todo_other: 'Другое', suggest_form_todo_other_ph: 'Опишите что нужно сделать',
        suggest_form_tg: '✉️ Ваш Telegram для связи', suggest_form_tg_ph: '@username',
        suggest_form_premium: '⭐ Вы подписчик iApps Premium?', suggest_form_yes: 'Да', suggest_form_no: 'Нет',
        suggest_form_pay: '💰 Сколько вы готовы оплатить?', suggest_form_pay_other: 'Другое', suggest_form_pay_other_ph: 'Введите сумму',
        suggest_form_submit: 'Отправить заявку', install_btn: 'Установить', detail_buy_access: 'Купить доступ',
        suggest_form_msg: '🔒 Заказ взлома приложения\n\nПриложение: {appstore}\nЧто нужно: {todo}\nTelegram для связи: {tg}\niApps Premium: {premium}\nГотов оплатить: {pay}',
        why_title: 'Почему выбирают iAPPS', why1_title: 'Расширенный сертификат', why1_desc: 'все права',
        why2_title: 'Чистые IPA сборки', why2_desc: 'с 2016 года', why3_title: 'Огромное репо', why3_desc: '1500+ приложений',
        why4_title: 'Моментальные сертификаты', why4_desc: 'выдача за минуты', why5_title: 'Наши отзывы', why5_desc: 'реальные клиенты',
        foot_channel: 'НАШ КАНАЛ', foot_vpn: 'НАШ ВПН', foot_bot: 'АВТОМАТ-БОТ',
        copyright: '© 2026 IAppsRepo. Все права защищены.', lang_name: 'Русский'
    },
    ua: {
        hero_subtitle: 'Репозиторій', hero_promo: 'Сертифікати та прокачені додатки для твого iPhone та iPad',
        feat1_title: 'Миттєва видача', feat1_desc: 'Доступ до файлів за пару хвилин',
        feat2_title: 'Усі права (32)', feat2_desc: 'Повна підтримка функцій',
        feat3_title: 'Підтримка 1 рік', feat3_desc: 'Допомога з будь-якими IPA',
        feat4_title: 'Гарантія якості', feat4_desc: 'Заміна при відкликанні Apple',
        phone_title: 'Твій особистий App Store', phone_desc: 'Каталог модифікованих додатків для iOS.', stat_apps: 'додатків', stat_users: 'користувачів', stat_live: 'підтримка',
        phone_repo_btn: 'Репозиторій →', phone_udid_btn: 'Дізнатися UDID', how_it_works: 'Як це працює',
        nav_apps: 'Список додатків', nav_tariffs: 'Тарифи', nav_how: 'Як це працює?', nav_suggest: 'Замовити злам', nav_vpn: 'iVPN Vless',
        catalog_title: 'Каталог додатків', catalog_subtitle: 'Знайдіть потрібний додаток серед нашої колекції',
        search_placeholder: 'Пошук додатків...', search_hint_prefix: 'Можливо, ви шукали:', search_hint_suffix: '?',
        suggest_app: 'Запропонувати додати додаток',
        empty_no_results: 'Нічого не знайшлося за запитом «{q}».', empty_no_cat: 'У цій категорії поки немає елементів.', empty_default: 'Нічого не знайшлося.',
        settings_title: 'Налаштування каталогу', set_category: 'Категорія', set_sort: 'Сортування', set_perpage: 'Відображати на сторінці', set_reset: 'Скинути конфігурацію',
        cat_all: '🌐 Усі', cat_social: '💬 Соц.мережі', cat_music: '🎵 Музика', cat_video: '🎬 Відео', cat_design: '🎨 Дизайн', cat_network: '🌍 VPN',
        cat_study: '📚 Навчання', cat_office: '📋 Офіс', cat_games: '🎮 Ігри', cat_kids: '👶 Діти', cat_life: '💪 Здоров\'я', cat_money: '💳 Фінанси', cat_travel: '✈️ Подорожі', cat_themes: '🖌️ Теми', cat_other: '📦 Інше',
        sort_new: 'Нові', sort_all: 'Усі',
        detail_buy: 'Купити через бот', detail_no_desc: 'Опис відсутній.', detail_updated: 'Оновлено: {d}', detail_mod: 'Мод {v}', detail_meta_ios: 'iOS', detail_meta_size: 'Розмір', detail_meta_version: 'Версія', detail_meta_updated: 'Оновлено',
        tariffs_title: 'Тарифні плани', prod_cert: 'Сертифікат', prod_repo: 'Репозиторій',
        dur_3m: '3 місяці', dur_6m: '6 місяців', dur_12m: '12 місяців', dur_24m: '24 місяці', badge_top: 'Топ',
        th_cert_title: '🛡 Сертифікат розробника', th_cert_desc: 'Потрібен для можливості встановлення сторонніх додатків на iPhone та iPad. Діє до одного року максимум. Для використання та встановлення не потрібен ПК.',
        th_repo_title: '📦 Репозиторій', th_repo_desc: 'Наш каталог зламаних додатків (зломи, моди, банки, видалені додатки та багато інших). Для використання потрібен сертифікат.',
        plan_selected: 'Обрано план', plan_info: 'План: {p} на {d} за {c}', buy_bot: 'Купити через бот', write_seller: 'Написати продавцю',
        buy_admin_msg: 'Здравствуйте! Хочу оформити тариф IAppsRepo: {p} на {d} за {c}', suggest_msg: 'Додайте, будь ласка, додаток: {q}',
        suggest_form_title: '🔒 Замовлення зламу додатку',
        suggest_form_appstore: '🔗 Назва або посилання на додаток', suggest_form_appstore_ph: 'Наприклад: Telegram або https://apps.apple.com/...',
        suggest_form_todo: '🛠️ Що потрібно зробити?', suggest_form_todo1: 'Злам на підписку/покупку (від 300₴)', suggest_form_todo2: 'Чистий .ipa без модифікацій (200₴)', suggest_form_todo3: 'Виправлення вильоту (300₴)', suggest_form_todo_other: 'Інше', suggest_form_todo_other_ph: 'Опишіть що потрібно зробити',
        suggest_form_tg: '✉️ Ваш Telegram для зв\'язку', suggest_form_tg_ph: '@username',
        suggest_form_premium: '⭐ Ви підписник iApps Premium?', suggest_form_yes: 'Так', suggest_form_no: 'Ні',
        suggest_form_pay: '💰 Скільки ви готові заплатити?', suggest_form_pay_other: 'Інше', suggest_form_pay_other_ph: 'Введіть суму',
        suggest_form_submit: 'Надіслати заявку', install_btn: 'Встановити', detail_buy_access: 'Купити доступ',
        suggest_form_msg: '🔒 Замовлення зламу додатку\n\nДодаток: {appstore}\nЩо потрібно: {todo}\nTelegram для зв\'язку: {tg}\niApps Premium: {premium}\nГотовий заплатити: {pay}',
        why_title: 'Чому обирають iAPPS', why1_title: 'Розширений сертифікат', why1_desc: 'усі права',
        why2_title: 'Чисті IPA збірки', why2_desc: 'з 2016 року', why3_title: 'Великий репо', why3_desc: '1500+ додатків',
        why4_title: 'Миттєві сертифікати', why4_desc: 'видача за хвилини', why5_title: 'Наші відгуки', why5_desc: 'реальні клієнти',
        foot_channel: 'НАШ КАНАЛ', foot_vpn: 'НАШ VPN', foot_bot: 'АВТОМАТ-БОТ',
        copyright: '© 2026 IAppsRepo. Всі права захищені.', lang_name: 'Українська'
    },
    en: {
        hero_subtitle: 'Repository', hero_promo: 'Certificates and upgraded apps for your iPhone and iPad',
        feat1_title: 'Instant delivery', feat1_desc: 'Access to files in a couple of minutes',
        feat2_title: 'All permissions (32)', feat2_desc: 'Full feature support',
        feat3_title: '1 year support', feat3_desc: 'Help with any IPA',
        feat4_title: 'Quality guarantee', feat4_desc: 'Replacement on Apple revocation',
        phone_title: 'Your personal App Store', phone_desc: 'Catalog of modified apps for iOS.', stat_apps: 'apps', stat_users: 'users', stat_live: 'support',
        phone_repo_btn: 'Repository →', phone_udid_btn: 'Get UDID', how_it_works: 'How it works',
        nav_apps: 'App list', nav_tariffs: 'Pricing', nav_how: 'How it works?', nav_suggest: 'Request crack', nav_vpn: 'iVPN Vless',
        catalog_title: 'App catalog', catalog_subtitle: 'Find the app you need in our collection',
        search_placeholder: 'Search apps...', search_hint_prefix: 'Did you mean:', search_hint_suffix: '?',
        suggest_app: 'Suggest an app to add',
        empty_no_results: 'Nothing found for «{q}».', empty_no_cat: 'No items in this category yet.', empty_default: 'Nothing found.',
        settings_title: 'Catalog settings', set_category: 'Category', set_sort: 'Sort by', set_perpage: 'Per page', set_reset: 'Reset configuration',
        cat_all: '🌐 All', cat_social: '💬 Social', cat_music: '🎵 Music', cat_video: '🎬 Video', cat_design: '🎨 Design', cat_network: '🌍 VPN',
        cat_study: '📚 Study', cat_office: '📋 Office', cat_games: '🎮 Games', cat_kids: '👶 Kids', cat_life: '💪 Health', cat_money: '💳 Finance', cat_travel: '✈️ Travel', cat_themes: '🖌️ Themes', cat_other: '📦 Other',
        sort_new: 'Newest', sort_all: 'All',
        detail_buy: 'Buy via bot', detail_no_desc: 'No description.', detail_updated: 'Updated: {d}', detail_mod: 'Mod {v}', detail_meta_ios: 'iOS', detail_meta_size: 'Size', detail_meta_version: 'Version', detail_meta_updated: 'Updated',
        tariffs_title: 'Pricing plans', prod_cert: 'Certificate', prod_repo: 'Repository',
        dur_3m: '3 months', dur_6m: '6 months', dur_12m: '12 months', dur_24m: '24 months', badge_top: 'Top',
        th_cert_title: '🛡 Developer Certificate', th_cert_desc: 'Required to install third-party apps on iPhone and iPad. Valid for up to one year. No PC required for installation.',
        th_repo_title: '📦 Repository', th_repo_desc: 'Our catalog of cracked apps (cracks, mods, banks, removed apps and many others). A certificate is required to use it.',
        plan_selected: 'Plan selected', plan_info: 'Plan: {p} for {d} at {c}', buy_bot: 'Buy via bot', write_seller: 'Contact seller',
        buy_admin_msg: 'Hello! I want to sign up for IAppsRepo plan: {p} for {d} at {c}', suggest_msg: 'Please add the app: {q}',
        suggest_form_title: '🔒 App Crack Request',
        suggest_form_appstore: '🔗 App name or link', suggest_form_appstore_ph: 'e.g. Telegram or https://apps.apple.com/...',
        suggest_form_todo: '🛠️ What needs to be done?', suggest_form_todo1: 'Crack subscription/purchase (from 300₽)', suggest_form_todo2: 'Clean .ipa without mods (200₽)', suggest_form_todo3: 'Fix crash (300₽)', suggest_form_todo_other: 'Other', suggest_form_todo_other_ph: 'Describe what needs to be done',
        suggest_form_tg: '✉️ Your Telegram for contact', suggest_form_tg_ph: '@username',
        suggest_form_premium: '⭐ Are you an iApps Premium subscriber?', suggest_form_yes: 'Yes', suggest_form_no: 'No',
        suggest_form_pay: '💰 How much are you willing to pay?', suggest_form_pay_other: 'Other', suggest_form_pay_other_ph: 'Enter amount',
        suggest_form_submit: 'Send request', install_btn: 'Install', detail_buy_access: 'Buy access',
        suggest_form_msg: '🔒 App Crack Request\n\nApp: {appstore}\nWhat to do: {todo}\nTelegram: {tg}\niApps Premium: {premium}\nWill pay: {pay}',
        why_title: 'Why choose iAPPS', why1_title: 'Extended certificate', why1_desc: 'all permissions',
        why2_title: 'Clean IPA builds', why2_desc: 'since 2016', why3_title: 'Huge repo', why3_desc: '1500+ apps',
        why4_title: 'Instant certificates', why4_desc: 'issued in minutes', why5_title: 'Our reviews', why5_desc: 'real customers',
        foot_channel: 'OUR CHANNEL', foot_vpn: 'OUR VPN', foot_bot: 'AUTO-BOT',
        copyright: '© 2026 IAppsRepo. All rights reserved.', lang_name: 'English'
    },
    es: {
        hero_subtitle: 'Repositorio', hero_promo: 'Certificados y aplicaciones mejoradas para tu iPhone y iPad',
        feat1_title: 'Entrega instantánea', feat1_desc: 'Acceso a archivos en un par de minutos',
        feat2_title: 'Todos los permisos (32)', feat2_desc: 'Soporte completo de funciones',
        feat3_title: 'Soporte 1 año', feat3_desc: 'Ayuda con cualquier IPA',
        feat4_title: 'Garantía de calidad', feat4_desc: 'Reemplazo ante revocación de Apple',
        phone_title: 'Tu App Store personal', phone_desc: 'Catálogo de apps modificadas para iOS.', stat_apps: 'apps', stat_users: 'usuarios', stat_live: 'soporte',
        phone_repo_btn: 'Repositorio →', phone_udid_btn: 'Obtener UDID', how_it_works: 'Cómo funciona',
        nav_apps: 'Lista de apps', nav_tariffs: 'Planes', nav_how: '¿Cómo funciona?', nav_suggest: 'Solicitar crack', nav_vpn: 'iVPN Vless',
        catalog_title: 'Catálogo de apps', catalog_subtitle: 'Encuentra la app que necesitas en nuestra colección',
        search_placeholder: 'Buscar apps...', search_hint_prefix: '¿Buscabas:', search_hint_suffix: '?',
        suggest_app: 'Sugerir una app para añadir',
        empty_no_results: 'No se encontró nada para «{q}».', empty_no_cat: 'Aún no hay elementos en esta categoría.', empty_default: 'No se encontró nada.',
        settings_title: 'Ajustes del catálogo', set_category: 'Categoría', set_sort: 'Ordenar', set_perpage: 'Por página', set_reset: 'Restablecer configuración',
        cat_all: '🌐 Todos', cat_social: '💬 Social', cat_music: '🎵 Música', cat_video: '🎬 Vídeo', cat_design: '🎨 Diseño', cat_network: '🌍 VPN',
        cat_study: '📚 Estudio', cat_office: '📋 Oficina', cat_games: '🎮 Juegos', cat_kids: '👶 Niños', cat_life: '💪 Salud', cat_money: '💳 Finanzas', cat_travel: '✈️ Viajes', cat_themes: '🖌️ Temas', cat_other: '📦 Otros',
        sort_new: 'Nuevos', sort_all: 'Todos',
        detail_buy: 'Comprar por bot', detail_no_desc: 'Sin descripción.', detail_updated: 'Actualizado: {d}', detail_mod: 'Mod {v}', detail_meta_ios: 'iOS', detail_meta_size: 'Tamaño', detail_meta_version: 'Versión', detail_meta_updated: 'Actualizado',
        tariffs_title: 'Planes de precios', prod_cert: 'Certificado', prod_repo: 'Repositorio',
        dur_3m: '3 meses', dur_6m: '6 meses', dur_12m: '12 meses', dur_24m: '24 meses', badge_top: 'Top',
        th_cert_title: '🛡 Certificado de desarrollador', th_cert_desc: 'Necesario para instalar apps de terceros en iPhone y iPad. Válido hasta un año máximo. No requiere PC para instalar.',
        th_repo_title: '📦 Repositorio', th_repo_desc: 'Nuestro catálogo de apps modificadas (cracks, mods, bancos, apps eliminadas y muchas otras). Se requiere un certificado para usarlo.',
        plan_selected: 'Plan seleccionado', plan_info: 'Plan: {p} por {d} a {c}', buy_bot: 'Comprar por bot', write_seller: 'Contactar vendedor',
        buy_admin_msg: '¡Hola! Quiero contratar el plan IAppsRepo: {p} por {d} a {c}', suggest_msg: 'Por favor, añade la app: {q}',
        suggest_form_title: '🔒 Solicitud de crack de app',
        suggest_form_appstore: '🔗 Nombre o enlace de la app', suggest_form_appstore_ph: 'Ej: Telegram o https://apps.apple.com/...',
        suggest_form_todo: '🛠️ ¿Qué hay que hacer?', suggest_form_todo1: 'Crack de suscripción/compra (desde 300₽)', suggest_form_todo2: '.ipa limpio sin mods (200₽)', suggest_form_todo3: 'Arreglar cierre (300₽)', suggest_form_todo_other: 'Otro', suggest_form_todo_other_ph: 'Describe qué hay que hacer',
        suggest_form_tg: '✉️ Tu Telegram de contacto', suggest_form_tg_ph: '@username',
        suggest_form_premium: '⭐ ¿Eres suscriptor de iApps Premium?', suggest_form_yes: 'Sí', suggest_form_no: 'No',
        suggest_form_pay: '💰 ¿Cuánto estás dispuesto a pagar?', suggest_form_pay_other: 'Otro', suggest_form_pay_other_ph: 'Introduce la cantidad',
        suggest_form_submit: 'Enviar solicitud', install_btn: 'Instalar', detail_buy_access: 'Comprar acceso',
        suggest_form_msg: '🔒 Solicitud de crack de app\n\nApp: {appstore}\nQué hacer: {todo}\nTelegram: {tg}\niApps Premium: {premium}\nPagaré: {pay}',
        why_title: 'Por qué elegir iAPPS', why1_title: 'Certificado ampliado', why1_desc: 'todos los permisos',
        why2_title: 'IPAs limpios', why2_desc: 'desde 2016', why3_title: 'Gran repo', why3_desc: '1500+ apps',
        why4_title: 'Certificados instantáneos', why4_desc: 'entrega en minutos', why5_title: 'Nuestras reseñas', why5_desc: 'clientes reales',
        foot_channel: 'NUESTRO CANAL', foot_vpn: 'NUESTRO VPN', foot_bot: 'BOT-AUTO',
        copyright: '© 2026 IAppsRepo. Todos los derechos reservados.', lang_name: 'Español'
    },
    zh: {
        hero_subtitle: '仓库', hero_promo: '为你的 iPhone 和 iPad 提供证书和增强应用',
        feat1_title: '即时交付', feat1_desc: '几分钟内获取文件',
        feat2_title: '全部权限 (32)', feat2_desc: '完整功能支持',
        feat3_title: '1 年支持', feat3_desc: '任意 IPA 问题帮助',
        feat4_title: '质量保证', feat4_desc: 'Apple 撤销时更换',
        phone_title: '你的专属 App Store', phone_desc: 'iOS 修改版应用目录。', stat_apps: '应用', stat_users: '用户', stat_live: '支持',
        phone_repo_btn: '仓库 →', phone_udid_btn: '获取 UDID', how_it_works: '如何运作',
        nav_apps: '应用列表', nav_tariffs: '价格方案', nav_how: '如何运作？', nav_suggest: '申请破解', nav_vpn: 'iVPN Vless',
        catalog_title: '应用目录', catalog_subtitle: '在我们的集合中找到你需要的应用',
        search_placeholder: '搜索应用...', search_hint_prefix: '你是否在找：', search_hint_suffix: '？',
        suggest_app: '建议添加应用',
        empty_no_results: '未找到与「{q}」相关的内容。', empty_no_cat: '此分类暂无内容。', empty_default: '未找到内容。',
        settings_title: '目录设置', set_category: '分类', set_sort: '排序', set_perpage: '每页显示', set_reset: '重置配置',
        cat_all: '🌐 全部', cat_social: '💬 社交', cat_music: '🎵 音乐', cat_video: '🎬 视频', cat_design: '🎨 设计', cat_network: '🌍 VPN',
        cat_study: '📚 学习', cat_office: '📋 办公', cat_games: '🎮 游戏', cat_kids: '👶 儿童', cat_life: '💪 健康', cat_money: '💳 金融', cat_travel: '✈️ 旅行', cat_themes: '🖌️ 主题', cat_other: '📦 其他',
        sort_new: '最新', sort_all: '全部',
        detail_buy: '通过机器人购买', detail_no_desc: '暂无描述。', detail_updated: '更新于：{d}', detail_mod: 'Mod {v}', detail_meta_ios: 'iOS', detail_meta_size: '大小', detail_meta_version: '版本', detail_meta_updated: '更新',
        tariffs_title: '价格方案', prod_cert: '证书', prod_repo: '仓库',
        dur_3m: '3 个月', dur_6m: '6 个月', dur_12m: '12 个月', dur_24m: '24 个月', badge_top: '热门',
        th_cert_title: '🛡 开发者证书', th_cert_desc: '用于在 iPhone 和 iPad 上安装第三方应用。有效期最长一年。安装无需电脑。',
        th_repo_title: '📦 仓库', th_repo_desc: '我们的破解应用目录（破解、修改版、银行应用、已下架应用等）。使用需要证书。',
        plan_selected: '已选方案', plan_info: '方案：{p} {d} 价格 {c}', buy_bot: '通过机器人购买', write_seller: '联系卖家',
        buy_admin_msg: '你好！我想办理 IAppsRepo 套餐：{p} {d}，价格 {c}', suggest_msg: '请添加应用：{q}',
        suggest_form_title: '🔒 应用破解申请',
        suggest_form_appstore: '🔗 应用名称或链接', suggest_form_appstore_ph: '例如：Telegram 或 https://apps.apple.com/...',
        suggest_form_todo: '🛠️ 需要做什么？', suggest_form_todo1: '破解订阅/购买（300₽起）', suggest_form_todo2: '纯净 .ipa 无修改（200₽）', suggest_form_todo3: '修复闪退（300₽）', suggest_form_todo_other: '其他', suggest_form_todo_other_ph: '描述需要做什么',
        suggest_form_tg: '✉️ 你的 Telegram 联系方式', suggest_form_tg_ph: '@username',
        suggest_form_premium: '⭐ 你是 iApps Premium 订阅者吗？', suggest_form_yes: '是', suggest_form_no: '否',
        suggest_form_pay: '💰 你愿意支付多少？', suggest_form_pay_other: '其他', suggest_form_pay_other_ph: '输入金额',
        suggest_form_submit: '发送申请', install_btn: '安装', detail_buy_access: '购买访问',
        suggest_form_msg: '🔒 应用破解申请\n\n应用：{appstore}\n需要：{todo}\nTelegram：{tg}\niApps Premium：{premium}\n愿意支付：{pay}',
        why_title: '为什么选择 iAPPS', why1_title: '扩展证书', why1_desc: '全部权限',
        why2_title: '纯净 IPA 包', why2_desc: '自 2016 年', why3_title: '超大仓库', why3_desc: '1500+ 应用',
        why4_title: '即时证书', why4_desc: '几分钟内发放', why5_title: '我们的评价', why5_desc: '真实客户',
        foot_channel: '我们的频道', foot_vpn: '我们的 VPN', foot_bot: '自动机器人',
        copyright: '© 2026 IAppsRepo. 版权所有。', lang_name: '中文'
    }
};

// Сопоставление язык → валюта по умолчанию
const LANG_CURRENCY = { ru: 'rub', ua: 'uah', en: 'usd', es: 'usd', zh: 'usd' };

// Текущий язык: 1) из localStorage (выбор пользователя), 2) авто-по языку браузера, 3) RU по умолчанию.
// Если пользователь уже выбирал язык вручную — уважаем его выбор (iapps_lang_set).
(function detectLang() {
    const saved = localStorage.getItem('iapps_lang');
    const userPicked = localStorage.getItem('iapps_lang_set') === '1';
    if (saved && userPicked) {
        window.__currentLang = saved;
        return;
    }
    // Авто-определение по navigator.language
    const navLang = (navigator.language || navigator.userLanguage || 'ru').toLowerCase();
    let detected = 'ru';
    if (navLang.startsWith('uk') || navLang.startsWith('ua')) detected = 'ua';
    else if (navLang.startsWith('zh')) detected = 'zh';
    else if (navLang.startsWith('es')) detected = 'es';
    else if (!navLang.startsWith('ru')) detected = 'en'; // всё остальное → английский
    window.__currentLang = detected;
})();
let currentLang = window.__currentLang || 'ru';

// Перевод строки с подстановкой {placeholder}
function t(key, vars) {
    const dict = I18N[currentLang] || I18N.ru;
    let str = dict[key] || (I18N.ru[key] !== undefined ? I18N.ru[key] : key);
    if (vars) Object.keys(vars).forEach(k => { str = str.replace('{' + k + '}', vars[k]); });
    return str;
}

// Применение переводов ко всей странице
function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'))); });
    // Бейдж кода языка на иконке глобуса
    const langBadge = document.getElementById('langCodeBadge');
    if (langBadge) langBadge.textContent = currentLang.toUpperCase();
    // Активный пункт в выпадающем списке
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === currentLang);
    });
}

// Применить валюту к селектору (вызывается при загрузке и смене языка)
function applyCurrencyForLang(lang) {
    const targetCurrency = LANG_CURRENCY[lang] || 'rub';
    localStorage.setItem('iapps_currency', targetCurrency);
    const btn = document.querySelector(`#currencySelector .selector-btn[data-curr="${targetCurrency}"]`);
    if (btn) {
        document.querySelectorAll('#currencySelector .selector-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
}

// Инициализация переключателя языка (вызывается из script.js после загрузки DOM)
function initLangSwitcher() {
    document.getElementById('langToggleBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('langDropdown').classList.toggle('open');
        if (typeof triggerHaptic === 'function') triggerHaptic();
    });
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const newLang = opt.getAttribute('data-lang');
            if (newLang === currentLang) { document.getElementById('langDropdown').classList.remove('open'); return; }
            localStorage.setItem('iapps_lang', newLang);
            localStorage.setItem('iapps_lang_set', '1'); // пользователь выбрал вручную
            applyCurrencyForLang(newLang);
            if (typeof triggerHaptic === 'function') triggerHaptic();
            window.location.reload();
        });
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-switcher')) document.getElementById('langDropdown').classList.remove('open');
    });
}