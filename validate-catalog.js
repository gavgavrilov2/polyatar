const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'Repo.json');
const knownCategories = new Set([
    'social', 'music', 'video', 'design', 'network', 'money', 'travel',
    'themes', 'study', 'office', 'games', 'kids', 'life', 'other'
]);
const requiredFields = [
    'appName', 'appImage', 'appVersion', 'appUpdateTime',
    'descriptionRu', 'descriptionUa', 'descriptionEn', 'descriptionEs', 'descriptionZh'
];

function getCategory(appName) {
    const tag = String(appName).split('#')[1];
    if (!tag) return 'other';
    const value = tag.trim().toLowerCase();
    if (value.startsWith('bank') || value === 'finance' || value.startsWith('money')) return 'money';
    if (value.startsWith('game')) return 'games';
    if (value.startsWith('network') || value === 'vpn') return 'network';
    if (value.startsWith('kid')) return 'kids';
    if (value === 'health') return 'life';
    if (value === 'navigation') return 'travel';
    return value;
}

let apps;
try {
    apps = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
} catch (error) {
    console.error(`FAIL: cannot parse Repo.json: ${error.message}`);
    process.exit(1);
}

if (!Array.isArray(apps)) {
    console.error('FAIL: Repo.json must contain an array.');
    process.exit(1);
}

const errors = [];
const warnings = [];
const names = new Map();

apps.forEach((app, index) => {
    requiredFields.forEach((field) => {
        if (typeof app[field] !== 'string') errors.push(`#${index}: ${field} must be a string.`);
    });

    if (typeof app.appUpdateTime === 'string' && Number.isNaN(Date.parse(app.appUpdateTime))) {
        warnings.push(`#${index}: invalid update date "${app.appUpdateTime}".`);
    }

    const category = getCategory(app.appName);
    if (!knownCategories.has(category)) warnings.push(`#${index}: unknown category "${category}".`);

    if (typeof app.appImage === 'string' && app.appImage.startsWith('icons/')) {
        const iconPath = path.join(__dirname, app.appImage);
        if (!fs.existsSync(iconPath)) warnings.push(`#${index}: missing local icon "${app.appImage}".`);
    } else if (typeof app.appImage === 'string' && app.appImage) {
        try {
            const url = new URL(app.appImage);
            if (!['https:', 'http:'].includes(url.protocol)) warnings.push(`#${index}: unsafe icon URL "${app.appImage}".`);
        } catch (error) {
            warnings.push(`#${index}: invalid icon URL "${app.appImage}".`);
        }
    }

    const name = String(app.appName || '');
    const matches = names.get(name) || [];
    matches.push(index);
    names.set(name, matches);
});

names.forEach((indexes, name) => {
    if (name && indexes.length > 1) warnings.push(`duplicate appName at indexes ${indexes.join(', ')}: "${name.replace(/\n/g, ' ')}".`);
});

console.log(`Catalog: ${apps.length} applications.`);
if (warnings.length) {
    console.log(`Warnings: ${warnings.length}`);
    warnings.forEach((warning) => console.log(`WARN: ${warning}`));
} else {
    console.log('Warnings: none.');
}

if (errors.length) {
    console.error(`Errors: ${errors.length}`);
    errors.forEach((error) => console.error(`FAIL: ${error}`));
    process.exit(1);
}

console.log('Structure: valid.');
