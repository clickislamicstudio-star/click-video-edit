/**
 * sw.js - Service Worker for PWA Offline
 */
const CACHE_NAME = 'click-editor-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/core/math.js',
  '/js/core/snap-engine.js',
  '/js/core/transform.js',
  '/js/core/keyframe.js',
  '/js/core/i18n.js',
  '/js/store.js',
  '/js/hardware.js',
  '/js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if(response) return response;
      return fetch(event.request);
    })
  );
});