const CACHE_NAME = 'timeweaver-v20';
const urlsToCache = [
  './index.html',
  './style.css',
  './config.js',
  './license.js',
  './calendar.js',
  './storage.js',
  './script.js',
  './interruptions.js',
  './interruptions.css',
  './language.js'
];

// Installera service worker och cacha filer
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cachar filer...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivera service worker och rensa gamla cachar
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Tar bort gammal cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercept network requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - returnera från cache
        if (response) {
          return response;
        }
        // Annars, hämta från nätverk
        return fetch(event.request).then(
          response => {
            // Kontrollera om vi fick ett giltigt svar
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Klona svaret
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
