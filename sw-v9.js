var CACHE_NAME = 'rehab-workbench-v9.0';
var ALL_CACHES = [
  'rehab-workbench-v1.0',
  'rehab-workbench-v2.0',
  'rehab-workbench-v3.0',
  'rehab-workbench-v4.0',
  'rehab-workbench-v5.0',
  'rehab-workbench-v6.0',
  'rehab-workbench-v7.0',
  'rehab-workbench-v8.0',
  CACHE_NAME
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return ALL_CACHES.indexOf(key) === -1;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return ALL_CACHES.indexOf(key) === -1;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (url.pathname.indexOf('chrome-extension') === 0) return;
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200 && url.origin === self.location.origin) {
          var copy = resp.clone();
          cache.put(e.request, copy).catch(function(){});
        }
        return resp;
      }).catch(function(err) {
        return cache.match(e.request).then(function(hit) {
          if (hit) return hit;
          return new Response('Network error: ' + err.message, { status: 503 });
        });
      });
    })
  );
});