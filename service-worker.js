const CACHE_NAME = 'ufix-cache-v1';
const ASSETS = [
    './index.html',
    './assets/css/style.css',
    './assets/js/storage.js',
    './assets/js/i18n.js',
    './assets/js/app.js',
    './assets/data/content.json',
    './assets/data/language.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
