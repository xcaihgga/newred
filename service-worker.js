var CACHE_NAME='rehab-workbench-v3.0';
var ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/greet-banner.jpg',
  './styles.css',
  './js/utils/esc.js',
  './js/utils/date.js',
  './js/utils/export.js',
  './js/schema.js',
  './js/storage.js',
  './js/state.js',
  './js/seed.js',
  './js/components/icons.js',
  './js/components/toast.js',
  './js/components/modal.js',
  './js/components/shell.js',
  './js/router.js',
  './js/bootstrap.js',
  './js/views/dashboard.js',
  './js/views/schedule.js',
  './js/views/records.js',
  './js/views/patients.js',
  './js/views/patient-detail.js',
  './js/views/todo.js',
  './js/views/assess.js',
  './js/views/scale.js',
  './js/views/plan.js',
  './js/views/fee.js',
  './js/views/settings.js'
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
        return caches.delete(k);
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
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200 && e.request.url.startsWith(self.location.origin)) {
          var respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, respClone).catch(function(){});
          });
        }
        return resp;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});
