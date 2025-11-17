// Service Worker for MyChild - 2000s Edition
// Enables offline functionality and "Add to Home Screen" support

// Version for cache busting - update this when you want to force cache refresh
const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `mychild-v${CACHE_VERSION}`;
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
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // Return cached version with proper headers
          const headers = new Headers(response.headers);
          headers.set('Cache-Control', 'public, max-age=180');
          headers.set('X-Content-Type-Options', 'nosniff');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        }
        
        // Fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Clone the response
          const responseToCache = networkResponse.clone();
          
          // Cache the response if it's successful
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          
          // Add security headers to response
          const headers = new Headers(networkResponse.headers);
          headers.set('Cache-Control', 'public, max-age=180');
          headers.set('X-Content-Type-Options', 'nosniff');
          
          return new Response(networkResponse.body, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers: headers
          });
        }).catch(() => {
          // If both cache and network fail, return offline page
          if (event.request.destination === 'document') {
            return caches.match(new URL('./index.html', self.location.origin + basePath).href);
          }
        });
      })
  );
});

