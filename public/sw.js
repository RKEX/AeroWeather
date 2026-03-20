const CACHE_NAME = 'aeroweather-cache-v1';
const API_CACHE_NAME = 'aeroweather-api-cache-v1';
const RADAR_CACHE_NAME = 'aeroweather-radar-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME && cacheName !== RADAR_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Weather API Caching (Stale-While-Revalidate)
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('rainviewer.com')) {
    const cacheName = url.hostname.includes('tilecache') ? RADAR_CACHE_NAME : API_CACHE_NAME;
    
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchedResponse = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });

          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }

  // 2. Static Assets (Cache First)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).catch(() => {
        // Offline Fallback for Page
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
