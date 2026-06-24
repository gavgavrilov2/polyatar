// ==========================================================================
// ИМПОРТ мультиязычных описаний из descriptions.xlsx обратно в Repo.json.
// Запуск: node import-descriptions.js
//
// Что делает:
//   1. Читает descriptions.xlsx (5 колонок: RU/UA/EN/ES/ZH)
//   2. Сопоставляет строки по appName с Repo.json
//   3. Для каждой заполненной ячейки обновляет соответствующее descriptionXX
//   4. Пустые ячейки = пропускаем (не затираем существующий перевод)
//   5. Сохраняет обновлённый Repo.json
//
// Безопасность: старый Repo.json бэкапится в Repo.json.backup перед записью.
// ==========================================================================

const fs = require('fs');
const XLSX = require('xlsx');

const LANG_FIELDS = ['descriptionRu', 'descriptionUa', 'descriptionEn', 'descriptionEs', 'descriptionZh'];

// Загружаем xlsx
const wb = XLSX.readFile('descriptions.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

if (rows.length < 2) {
    console.error('FAIL: descriptions.xlsx пустой или нет данных.');
    process.exit(1);
}

// Первая строка — заголовок. Строим карту: имя колонки → индекс.
const header = rows[0];
const colIdx = {};
header.forEach((h, i) => { colIdx[h] = i; });

if (colIdx.appName === undefined) {
    console.error('FAIL: в xlsx нет колонки appName.');
    process.exit(1);
}

// Строим карты: appName → { lang: text } для каждого языка
const updateMap = new Map(); // appName → { descriptionRu: '...', descriptionEn: '...', ... }
const filledCounts = { descriptionRu: 0, descriptionUa: 0, descriptionEn: 0, descriptionEs: 0, descriptionZh: 0 };

for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const appName = (row[colIdx.appName] || '').toString();
    if (!appName) continue;

    const updates = {};
    LANG_FIELDS.forEach(field => {
        if (colIdx[field] === undefined) return; // такой колонки нет в xlsx
        const val = (row[colIdx[field]] || '').toString().trim();
        if (val) {
            updates[field] = val;
            filledCounts[field]++;
        }
    });

    if (Object.keys(updates).length > 0) {
        updateMap.set(appName, updates);
    }
}

console.log('Заполнено в xlsx по языкам:');
Object.entries(filledCounts).forEach(([k, v]) => console.log(`   ${k.padEnd(15)} ${v}`));

// Бэкап Repo.json
fs.copyFileSync('Repo.json', 'Repo.json.backup');

// Загружаем Repo.json, обновляем
const data = JSON.parse(fs.readFileSync('Repo.json', 'utf8'));
let updatedAppsCount = 0;

data.forEach(app => {
    const appName = app.appName || '';
    const updates = updateMap.get(appName);
    if (updates) {
        let changed = false;
        LANG_FIELDS.forEach(field => {
            if (updates[field] !== undefined) {
                app[field] = updates[field];
                changed = true;
            }
        });
        if (changed) updatedAppsCount++;
    }
});

// Сохраняем
fs.writeFileSync('Repo.json', JSON.stringify(data, null, 2), 'utf8');

console.log('');
console.log(`✅ Готово!`);
console.log(`   Обновлено приложений: ${updatedAppsCount}`);
console.log(`   Бэкап старого: Repo.json.backup`);
console.log('');
console.log('Теперь сделай git add Repo.json && git commit && git push');
