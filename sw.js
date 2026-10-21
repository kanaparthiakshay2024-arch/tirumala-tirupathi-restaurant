const CACHE_NAME = 'tirupati-restaurant-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.jpg',
  '/hero_bg.jpg',
  '/bhojanam.jpg',
  '/dosa.jpg',
  '/laddu.jpg',
  '/pongal.jpg',
  '/pulihora.jpg',
  '/daddojanam.jpg',
  '/table_2.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ ServiceWorker: Pre-caching offline assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('ServiceWorker pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Ignore non-GET requests or Supabase/API calls for caching
  if (req.method !== 'GET' || req.url.includes('/api/') || req.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Return cached, and fetch updated in background
        fetch(req).then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, res));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        if (res && res.status === 200 && req.url.startsWith('http')) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      }).catch(() => {
        if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
