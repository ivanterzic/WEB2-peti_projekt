import {
    del,
    entries
} from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

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

self.addEventListener('install', function (event) {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', async function (event) {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName !== staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
    /*await syncPosts();*/
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
                    return response;
                });
        })
        .catch(function (error) {
            //console.log('Error, ', error);

            if (event.request.url.includes('/post?offset=')) {
                return new Response(JSON.stringify({}), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            return caches.match('offline.html');
        })
    );
});

self.addEventListener('sync', function (event) {
    console.log('Service worker sync event!');
    if (event.tag === 'uploadPost') {
        event.waitUntil(
            syncPosts()
        );
    }
});

async function syncPosts() {
    entries().then(function (entries) {
        entries.forEach(async (entry) => {
            let post = entry[1];

            let formData = {}
            formData.angler = post.angler;
            formData.fishSpecies = post.fishSpecies;
            formData.date = post.date;
            formData.location = post.location;
            formData.weight = post.weight;
            formData.length = post.length;
            formData.temperature = post.temperature;
            formData.pressure = post.pressure;
            formData.image = post.image;
            formData.voiceMessage = post.voiceMessage;

            const response = await fetch('/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Post successfully uploaded!');
                del(entry[0]);
            } else {
                console.log('Post upload failed!');
            }
        });
    });
}