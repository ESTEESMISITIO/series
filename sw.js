// Service worker: cachea el "cascarón" de la app solo como respaldo offline.
// Estrategia: siempre intenta la red primero (para traer la versión más nueva),
// y usa el cache guardado únicamente si no hay conexión.
const CACHE_NAME = 'bitacora-series-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cualquier request a otro origen (TMDB, Supabase, etc.): siempre red, nunca cache.
  if (url.origin !== self.location.origin) {
    return;
  }
  if (event.request.method !== 'GET') {
    return;
  }

  // El cascarón de la app: red primero (trae siempre lo último), cache solo si no hay señal.
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
