/**
 * sw.js v2 - Cache Killer + Network First for index.html
 */
const CACHE_NAME = 'click-editor-v2'; // v1 -> v2 so old cache deletes
const urlsToCache = [
  '/manifest.json'
];

self.addEventListener('install', event => {
  console.log('SW v2 Installing - Killing old cache');
  self.skipWaiting(); // Force new SW immediately
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if(name !== CACHE_NAME) {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('activate', event => {
  console.log('SW v2 Activated - Claiming clients');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // For index.html - ALWAYS Network First (no cache)
  if(url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Update cache with fresh index.html
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // For JS/CSS - Network First, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});