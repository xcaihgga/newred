var CACHE_NAME='rehab-v3.4.1';
var ASSETS=[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
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