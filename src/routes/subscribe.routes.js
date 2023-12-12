const express = require('express');
const router = express.Router();
const path = require('path');
const webpush = require('web-push');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async function(req, res) {
    console.log(req.body);
    let subscription = req.body.sub;   
    try {
        const newSubscription = await prisma.subscription.create({
            data: {
                data: JSON.stringify(subscription)
            }
        });
        res.json({
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({});
    }
}
);

module.exports = router;
