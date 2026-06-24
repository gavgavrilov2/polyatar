// ==========================================================================
// ОДНОРАЗОВАЯ МИГРАЦИЯ: appDescription → descriptionRu + 4 пустых поля.
// Запуск: node migrate-descriptions.js
//
// Было (Repo.json):
//   { "appName": "...", "appDescription": "Русский текст", ... }
//
// Стало (Repo.json):
//   { "appName": "...", "descriptionRu": "Русский текст",
//     "descriptionUa": "", "descriptionEn": "", "descriptionEs": "", "descriptionZh": "", ... }
//
// Старое поле appDescription удаляется. Бэкап в Repo.json.backup.
// ==========================================================================

const fs = require('fs');

fs.copyFileSync('Repo.json', 'Repo.json.backup');

const data = JSON.parse(fs.readFileSync('Repo.json', 'utf8'));
let migrated = 0;

data.forEach(app => {
    const oldDesc = app.appDescription || '';
    app.descriptionRu = oldDesc;
    if (!('descriptionUa' in app)) app.descriptionUa = '';
    if (!('descriptionEn' in app)) app.descriptionEn = '';
    if (!('descriptionEs' in app)) app.descriptionEs = '';
    if (!('descriptionZh' in app)) app.descriptionZh = '';
    delete app.appDescription;
    migrated++;
});

fs.writeFileSync('Repo.json', JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Миграция завершена: ${migrated} приложений.`);
console.log(`   Старое appDescription → descriptionRu (сохранили русский текст)`);
console.log(`   descriptionUa/En/Es/Zh — пустые (заполнишь в Excel)`);
console.log(`   Бэкап: Repo.json.backup`);
