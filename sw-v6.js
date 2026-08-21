var CACHE_NAME='rehab-workbench-v6.0';

var ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/greet-banner.jpg',
  './styles.css'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(){});
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE_NAME) return caches.delete(k);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('message', function(e) {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  var url = new URL(e.request.url);

  // Network-first for HTML
  if (e.request.headers.get('accept') && e.request.headers.get('accept').indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(e.request).then(function(resp) {
        var copy = resp.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(e.request, copy).catch(function(){}); });
        return resp;
      }).catch(function() {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // Network-first for everything else (JS, CSS, images)
  e.respondWith(
    fetch(e.request).then(function(resp) {
      if (resp && resp.status === 200 && url.origin === self.location.origin) {
        var copy = resp.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(e.request, copy).catch(function(){}); });
      }
      return resp;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        return caches.match('./index.html');
      });
    })
  );
});
