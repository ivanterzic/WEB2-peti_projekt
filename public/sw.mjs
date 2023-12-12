import {
    del,
    entries,
    get,
    set,
    keys
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
    '/scripts/notification.js',
    '/scripts/header.js',
    'manifest.json',
    '/icons/manifest-icon-192.maskable.png',
    '/icons/manifest-icon-512.maskable.png',
];

const staticCacheName = 'pages-cache-v2';

self.addEventListener('install', async function (event) {
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
    keys().then(function (keys) {
        let keysCopyWithLastResponse = keys;
        keysCopyWithLastResponse = keysCopyWithLastResponse.filter(function (key) {
            return key !== 'lastResponse';
        });
        if (keysCopyWithLastResponse.length > 0) {
            self.registration.sync.register('uploadPost');
        }
    });
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
                    if (event.request.url.includes('post?offset=0')) {
                        return response.clone().json().then(function (data) {
                            set('lastResponse', data);
                            return response;
                        });
                    }
                    if (response.status === 404) {
                        return caches.match('404.html');
                    }
                    if (response.status === 500) {
                        return caches.match('500.html');
                    }
                    return response;
                })
                .catch(function (error) {
                    //console.log('Error, ', error);
                    if (event.request.url.includes('/fish')) {
                        return new Response(JSON.stringify({}), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }

                    if (event.request.url.includes('post?offset=0')) {
                        return get('lastResponse')
                            .then(function (lastResponse) {
                                if (lastResponse) {
                                    return new Response(JSON.stringify(lastResponse), {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                } else {
                                    return new Response(JSON.stringify({}), {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                }
                            })
                            .catch(function (error) {
                                return new Response(JSON.stringify({}), {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                            });
                    }
                    else if (event.request.url.includes('post?offset=') && !event.request.url.includes('post?offset=0')) {
                        return new Response(JSON.stringify({}), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                    return caches.match('offline.html');
                });
        })
    );
});

self.addEventListener('sync', function (event) {
    console.log('Service worker sync event!');

    event.waitUntil(
        syncPosts()
    );

});

self.addEventListener('periodicsync', function (event) {
    console.log('Service worker periodicsync event!');

    event.waitUntil(
        syncPosts()
    );

});

async function syncPosts() {
    entries().then(function (entries) {
        entries.forEach(async (entry) => {
            if (entry[0] !== 'lastResponse') {
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
                try {
                    const response = await fetch('/post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    if (response.ok) {
                        del(entry[0]);
                        //console.log('Post successfully uploaded!');
                    } else {
                        //console.log('Post upload failed!');
                    }
                }
                catch(err){
                   // console.log(err);
                }
            }
        });
    });
}

self.addEventListener("notificationclick", function (event) {
    let notification = event.notification;
    let action = event.action;
    event.waitUntil(
        clients.matchAll().then(function (clis) {
            clis.forEach((client) => {
                client.navigate(notification.data.redirectUrl);
                client.focus();
            });
            notification.close();
        })
    );

} );

/*self.addEventListener("notificationclose", function (event) {
    console.log("notificationclose", event);
});*/



self.addEventListener('push', function (event) {
    console.log("push event", event);
    if (event.data) {
        let data = JSON.parse(event.data.text());
        console.log("data", data);
        var options = {
            body: data.body,
            icon: "./icons/manifest-icon-192.maskable.png",
            badge: "./icons/manifest-icon-192.maskable.png",
            vibrate: [200, 100, 200],
            data: {
                redirectUrl: data.redirectUrl,
            },
        };
        event.waitUntil(self.registration.showNotification(data.title, options));
    }
});

