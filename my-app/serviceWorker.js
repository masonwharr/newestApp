setTimeout(function(){
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
 
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
 
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
self.addEventListener('install', function(event) {
  console.log('GOING')
  event.waitUntil(
    caches.open('first').then(function(cache) {
      return cache.addAll([
        'public/index.html',
        'src/App.js',
        'src/index.js',
        'src/App.css',
        'src/index.css',
        'src/logo.svg',
        'public/favicon.ico'

      ]);
    })
  );
  console.log(cache)
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
          .then(function(response) {
        
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
          
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open('first')
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
},900);