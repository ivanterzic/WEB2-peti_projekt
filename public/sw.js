const filesToCache = [
    '/',
    '/fish',
    'index.html',
    'post.html',
    'feed.html',
    'postSuccessful.html',
    'postUnsuccessful.html',
    'offline.html',
    '404.html',
    '500.html',
    '/favicon.ico',
    '/stylesheets/feed.css',
    '/stylesheets/post.css',
    '/stylesheets/header.css',
    '/scripts/post.js',
    '/scripts/swRegister.js',
    'manifest.json',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',

];

const staticCacheName = 'pages-cache-v2';
const dynamicCacheName = 'posts-cache-v2';

self.addEventListener('install', function (event) {
    console.log('Service worker installing...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName !== staticCacheName && cacheName !== dynamicCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
                if (response) {
                    //console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                //console.log('Network request for ', event.request.url);
                if (!navigator.onLine && event.request.url.includes('showonepost.html')) {
                    return caches.match('offline.html');
                }
                return fetch(event.request)
                    .then(function (response) {
                        if (response.status === 404) {
                            return caches.match('404.html');
                        }
                        if (response.status === 500) {
                            return caches.match('500.html');
                        }
                        return caches.open(dynamicCacheName)
                            .then(function (cache) {
                                if (event.request.url.includes('/post?offset=') && event.request.url.includes('offset=0')) {
                                    cache.put(event.request.url, response.clone());
                                }
                                return response;
                            });
                    });
            }
        )
        .catch(function (error) {
            //console.log('Error, ', error);
            if (event.request.url.includes('/post?offset=')) {
                return new Response(JSON.stringify({}), {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return caches.match('offline.html');
        })
    );
});