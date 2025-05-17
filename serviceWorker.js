// This service worker can be customized further
const CACHE_NAME = 'habitsphere-v1';
const urlsToCache = [
  '/HabitSphere/',
  '/HabitSphere/index.html',
  '/HabitSphere/static/css/main.4e1c6dc9.css',
  '/HabitSphere/static/js/main.d2e58073.js',
  '/HabitSphere/manifest.json',
  '/HabitSphere/favicon.ico',
  '/HabitSphere/logo192.png',
  '/HabitSphere/logo512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache if the URL has certain parameters
                if (!event.request.url.includes('chrome-extension://')) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          });
      })
      .catch(() => {
        // If both cache and network fail, show a fallback page
        if (event.request.url.includes('.html')) {
          return caches.match('/HabitSphere/index.html');
        }
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
