document.querySelector('.navbar-toggler').addEventListener('click', function() {
    var navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
    } else {
        navbarCollapse.classList.add('show');
    }
});

// add to document a button which includes 828600.png icon and fix it to the bottom right of the screen
// the buttons id is notificationButton

let notificationButton = document.createElement('button');
notificationButton.id = 'notificationButton';
notificationButton.className = 'btn btn-primary';
notificationButton.style.position = 'fixed';
notificationButton.style.bottom = '0';
notificationButton.style.left = '0';
notificationButton.style.zIndex = '9999';
notificationButton.style.borderRadius = '0';
notificationButton.style.border = 'none';
notificationButton.style.width = '50px';
notificationButton.style.height = '50px';
notificationButton.style.backgroundColor = 'white';
notificationButton.style.backgroundImage = 'url(../icons/828600.png)';
notificationButton.style.backgroundSize = 'cover';
notificationButton.style.backgroundRepeat = 'no-repeat';
notificationButton.style.backgroundPosition = 'center';
notificationButton.style.cursor = 'pointer';
document.body.appendChild(notificationButton);

let notifScript = document.createElement('script');
notifScript.src = '/scripts/notification.js';
document.body.appendChild(notifScript);


