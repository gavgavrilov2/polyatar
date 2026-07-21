const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, 'Repo.json');
const knownCategories = new Set([
    'social', 'music', 'video', 'design', 'network', 'russia', 'money', 'travel',
    'themes', 'study', 'office', 'games', 'kids', 'life', 'other'
]);
const requiredFields = [
    'appName', 'appImage', 'appVersion', 'appUpdateTime',
    'descriptionRu', 'descriptionUa', 'descriptionEn', 'descriptionEs', 'descriptionZh'
];
const categoryAssets = {
    social: 'Social.svg', music: 'Music.svg', video: 'Video.svg', design: 'Design.svg',
    network: 'VPN.svg', russia: 'Russia.svg', money: 'Finance.svg', travel: 'Travel.svg',
    themes: 'Themes.svg', study: 'Study.svg', office: 'Office.svg', games: 'Games.svg',
    kids: 'Kids.svg', life: 'Health.svg', other: 'Other.svg'
};

function getCategory(appName) {
    const tag = String(appName).split('#')[1];
    if (!tag) return 'other';
    const value = tag.trim().toLowerCase();
    if (value.startsWith('bank') || value === 'finance' || value.startsWith('money')) return 'money';
    if (value.startsWith('game')) return 'games';
    if (value.startsWith('network') || value === 'vpn') return 'network';
    if (value.startsWith('russia')) return 'russia';
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
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const translations = fs.readFileSync(path.join(__dirname, 'translations.js'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(__dirname, 'service-worker.js'), 'utf8');
const config = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');

const cacheVersion = (indexHtml.match(/window\.CACHE_VERSION\s*=\s*(\d+)/) || [])[1];
const workerVersion = (serviceWorker.match(/CACHE_VERSION\s*=\s*'iapps-v(\d+)'/) || [])[1];
const resourceVersions = [...indexHtml.matchAll(/(?:style\.css|config\.js|translations\.js|script\.js)\?v=(\d+)/g)].map(match => match[1]);
const preloadVersion = (indexHtml.match(/Repo\.json\?v=(\d+)/) || [])[1];
const siteUrl = 'https://gavgavrilov2.github.io/polyatar/';

if (!cacheVersion || cacheVersion !== workerVersion || preloadVersion !== cacheVersion || resourceVersions.some(version => version !== cacheVersion)) {
    errors.push(`cache versions are inconsistent (HTML: ${cacheVersion || 'missing'}, Service Worker: ${workerVersion || 'missing'}).`);
}

['og-image.png', 'robots.txt', 'sitemap.xml'].forEach((filename) => {
    if (!fs.existsSync(path.join(__dirname, filename))) errors.push(`missing SEO file: ${filename}.`);
});
if (!indexHtml.includes(`rel="canonical" href="${siteUrl}"`)) errors.push('canonical URL is missing or incorrect.');
if (!indexHtml.includes(`property="og:image" content="${siteUrl}og-image.png"`)) errors.push('Open Graph image URL is missing or incorrect.');
if (!indexHtml.includes('name="twitter:card" content="summary_large_image"')) errors.push('Twitter large image card is missing.');
if (fs.existsSync(path.join(__dirname, 'robots.txt')) && !fs.readFileSync(path.join(__dirname, 'robots.txt'), 'utf8').includes(`${siteUrl}sitemap.xml`)) errors.push('robots.txt sitemap URL is missing or incorrect.');
if (fs.existsSync(path.join(__dirname, 'sitemap.xml')) && !fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8').includes(siteUrl)) errors.push('sitemap.xml site URL is missing or incorrect.');
if (!/measurementId:\s*'G-[A-Z0-9]+'/.test(config)) errors.push('Google Analytics measurement ID is missing or invalid.');

Object.entries(categoryAssets).forEach(([category, filename]) => {
    const filterPattern = new RegExp(`name="categoryMode" value="${category}"`);
    const translationPattern = new RegExp(`cat_${category}:`, 'g');
    const iconPath = path.join(__dirname, 'icons', 'settings', filename);

    if (!filterPattern.test(indexHtml)) errors.push(`missing category filter: ${category}.`);
    if ((translations.match(translationPattern) || []).length !== 5) errors.push(`missing category translations: ${category}.`);
    if (!fs.existsSync(iconPath)) {
        errors.push(`missing category icon: icons/settings/${filename}.`);
    } else {
        const icon = fs.readFileSync(iconPath, 'utf8');
        if (!icon.includes('#8d96a8')) errors.push(`unexpected category icon color: icons/settings/${filename}.`);
    }
});

if (!/name="categoryMode" value=""/.test(indexHtml)) errors.push('missing category filter: all.');
if ((translations.match(/cat_all:/g) || []).length !== 5) errors.push('missing category translations: all.');
const allIconPath = path.join(__dirname, 'icons', 'settings', 'All.svg');
if (!fs.existsSync(allIconPath)) {
    errors.push('missing category icon: icons/settings/All.svg.');
} else if (!fs.readFileSync(allIconPath, 'utf8').includes('#8d96a8')) {
    errors.push('unexpected category icon color: icons/settings/All.svg.');
}

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
