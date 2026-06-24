// ==========================================================================
// ЭКСПОРТ описаний приложений (5 языков) из Repo.json в Excel (.xlsx).
// Запуск: node export-descriptions.js
// Результат: файл descriptions.xlsx рядом со скриптом.
//
// Колонки:
//   appName      — имя приложения (для контекста)
//   category     — категория из #тега
//   descriptionRu — русское описание (базовое, фолбэк)
//   descriptionUa — украинский (заполняешь)
//   descriptionEn — английский (заполняешь)
//   descriptionEs — испанский (заполняешь)
//   descriptionZh — китайский (заполняешь)
//
// Заполняешь только нужные языки. Пустые = фолбэк на русский при показе.
// ==========================================================================

const fs = require('fs');
const XLSX = require('xlsx');

const data = JSON.parse(fs.readFileSync('Repo.json', 'utf8'));

function extractCategory(appName) {
    if (!appName) return '';
    if (appName.includes('#')) {
        const parts = appName.split('#');
        return (parts[1] || '').trim().toLowerCase();
    }
    return '';
}

// Заголовок колонок
const aoa = [];
aoa.push(['appName', 'category', 'descriptionRu', 'descriptionUa', 'descriptionEn', 'descriptionEs', 'descriptionZh']);

data.forEach(app => {
    const appName = app.appName || '';
    const category = extractCategory(appName);
    aoa.push([
        appName,
        category,
        app.descriptionRu || '',
        app.descriptionUa || '',
        app.descriptionEn || '',
        app.descriptionEs || '',
        app.descriptionZh || ''
    ]);
});

const ws = XLSX.utils.aoa_to_sheet(aoa);

// Ширина колонок
ws['!cols'] = [
    { wch: 28 }, // appName
    { wch: 14 }, // category
    { wch: 50 }, // RU
    { wch: 50 }, // UA
    { wch: 50 }, // EN
    { wch: 50 }, // ES
    { wch: 50 }, // ZH
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Apps');

XLSX.writeFile(wb, 'descriptions.xlsx');

console.log(`OK: descriptions.xlsx создан, ${data.length} приложений × 5 языков.`);
console.log('');
console.log('Колонки: appName | category | RU | UA | EN | ES | ZH');
console.log('Заполни нужные языки (RU уже заполнен), сохрани,');
console.log('потом запусти: node import-descriptions.js');
