// ==========================================================================
// Фикс белых полей иконок: конвертация Apple CDN URLов в формат без padding.
// Запуск: node fix-icon-urls.js
//
// Проблема: Apple присылает иконки в формате "200x200bb-75.jpg" — где "bb"
// (bounding box) добавляет белые поля вокруг самой иконки.
//
// Решение: меняем на "246x0w.png" — это чистая иконка без padding,
// занимает всю площадь. Идеально для squircle-маски.
//
// Пример:
//   .../Placeholder.mill/200x200bb-75.jpg  →  .../Placeholder.mill/246x0w.png
//   .../AppIcon-0-0.png/246x0w.png         →  без изменений (уже правильный формат)
//
// Бэкап старого Repo.json в Repo.json.backup.
// ==========================================================================

const fs = require('fs');

fs.copyFileSync('Repo.json', 'Repo.json.backup');

const data = JSON.parse(fs.readFileSync('Repo.json', 'utf8'));
let changed = 0;
let skipped = 0;

data.forEach(app => {
    let img = app.appImage || '';

    // Только для Apple CDN (mzstatic.com). Локальные icons/ не трогаем.
    if (!img.includes('mzstatic.com')) { skipped++; return; }

    // Если уже в правильном формате (содержит "0w.png" или "0w.jpg") — пропускаем
    if (/\d+x0w\.(png|jpg)/.test(img)) { skipped++; return; }

    // Заменяем любой формат .../<filename> на /246x0w.png
    // URL имеет вид: https://.../Placeholder.mill/200x200bb-75.jpg
    //               или https://.../AppIcon-0-0.png/246x0w.png
    // Нам нужно заменить последний сегмент пути после последнего /
    const replaced = img.replace(/\/[^/]+$/, '/246x0w.png');

    if (replaced !== img) {
        app.appImage = replaced;
        changed++;
    }
});

fs.writeFileSync('Repo.json', JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Готово!`);
console.log(`   Изменено: ${changed} URLов`);
console.log(`   Пропущено (уже правильно / не mzstatic): ${skipped}`);
console.log(`   Бэкап: Repo.json.backup`);
console.log('');
console.log('Пример нового URL:');
console.log('  ', data.find(a => a.appImage.includes('246x0w.png')).appImage.slice(0, 90) + '...');
