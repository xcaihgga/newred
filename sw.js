var CACHE_NAME='rehab-workbench-v2.1';
var ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/greet-banner.jpg',
  './styles.css',
  './js/utils/esc.js?v=2',
  './js/utils/date.js?v=2',
  './js/utils/export.js?v=2',
  './js/schema.js?v=2',
  './js/storage.js?v=2',
  './js/state.js?v=2',
  './js/seed.js?v=2',
  './js/components/icons.js?v=2',
  './js/components/toast.js?v=2',
  './js/components/modal.js?v=2',
  './js/components/shell.js?v=2',
  './js/router.js?v=2',
  './js/bootstrap.js?v=2',
  './js/views/dashboard.js?v=2',
  './js/views/schedule.js?v=2',
  './js/views/records.js?v=2',
  './js/views/patients.js?v=2',
  './js/views/patient-detail.js?v=2',
  './js/views/todo.js?v=2',
  './js/views/assess.js?v=2',
  './js/views/scale.js?v=2',
  './js/views/plan.js?v=2',
  './js/views/fee.js?v=2',
  './js/views/settings.js?v=2'
];
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS).catch(function(){});
    }).then(function(){
      return self.skipWaiting();
    })
  );
});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k!==CACHE_NAME)return caches.delete(k);
      }));
    }).then(function(){
      return self.clients.claim();
    })
  );
});
self.addEventListener('message',function(e){
  if(e.data==='SKIP_WAITING'){
    self.skipWaiting();
  }
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached)return cached;
      return fetch(e.request).then(function(resp){
        if(resp&&resp.status===200&&e.request.url.startsWith(self.location.origin)){
          var respClone=resp.clone();
          caches.open(CACHE_NAME).then(function(cache){
            cache.put(e.request,respClone).catch(function(){});
          });
        }
        return resp;
      }).catch(function(){
        return caches.match('./index.html');
      });
    })
  );
});
