const webpush = require('web-push');
const {
    PrismaClient
} = require('@prisma/client');
const { text } = require('express');
const prisma = new PrismaClient();

const vapidKeys = {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
};

async function sendPushNotification(text) {
    webpush.setVapidDetails(
        'mailto:ivan.terzic2@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );

    const subscriptions = await prisma.subscription.findMany();

    subscriptions.forEach(async sub => {
        try {
            //console.log("Sending push notification to: ", sub.data);
            await webpush.sendNotification(JSON.parse(sub.data), JSON.stringify({
                title: 'Novi ulov!',
                body: text,
                redirectUrl: '/feed.html'
            }))
        } catch (error) {
            //console.log(error);
        }
    });
}

module.exports = {
    sendPushNotification
};