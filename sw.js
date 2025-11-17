// Service Worker for MyChild - 2000s Edition
// Enables offline functionality and "Add to Home Screen" support

const CACHE_NAME = 'mychild-v1';
// Get base path dynamically
const basePath = self.location.pathname.replace(/sw\.js$/, '');

const urlsToCache = [
  './',
  './index.html',
  './login.html',
  './css/style.css',
  './js/game.js',
  './js/character-renderer.js',
  './js/utils.js',
  './js/translations.js',
  './assets/favicon.svg',
  './assets/favicon.ico',
  './manifest.json'
].map(url => new URL(url, self.location.origin + basePath).href);

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => {
          // Handle both absolute and relative URLs
          try {
            return new Request(url, { mode: 'no-cors' });
          } catch (e) {
            return url;
          }
        })).catch((err) => {
          console.log('Cache addAll failed:', err);
          // Continue even if some resources fail to cache
          return Promise.resolve();
        });
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // If both cache and network fail, return offline page
          if (event.request.destination === 'document') {
            return caches.match(new URL('./index.html', self.location.origin + basePath).href);
          }
        });
      })
  );
});

