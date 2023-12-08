navigator.serviceWorker.register('sw.mjs', {type : "module"}).then(function(registration) {
    console.log('Service worker registered ! ', registration);
}).catch(function(err) {
    console.log('Service worker registration failed: ', err);
});