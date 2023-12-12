let notificationButton = document.getElementById('notificationButton');

if ("Notification" in window && "serviceWorker" in navigator) {
    notificationButton.addEventListener("click", function () {
        Notification.requestPermission(async function (result) {
            if (result === "granted") {
                await subscriptionSetup();
            } else {
                console.log("Denied");
            }
        });
    });
} else {
    notificationButton.setAttribute("disabled", "");
    console.log("Notifications not supported");
}

function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


async function subscriptionSetup() {
    try {
        let registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        if (subscription === null) {
            var publicKey = "BBYaNvpQO4SekCm867_YFSTyy5ycIz0dQaKmDyYaTBb9pWzqHjgmIrTsDvfqemeflMGzFQiNE1PPoVjcjoRXSr0";
            sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            });
            let res = await fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify({sub}),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                console.log("User subscribed");
            }
        } else {
            console.log("User already subscribed");
        }
    } catch (err) {
        console.log("Error", err);
    }
}