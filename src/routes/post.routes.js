const express = require('express');
const path = require('path');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));

router.post('/', [
    body('angler').trim().isLength({ min: 1 }).escape(),
    body('fishSpecies').trim().isLength({ min: 1 }).escape(),
    body('date').toDate(),
    body('location').optional({ nullable: true }).trim().escape(),
    body('weight').optional({ nullable: true }).toFloat(),
    body('length').optional({ nullable: true }).toFloat(),
    body('temperature').optional({ nullable: true }).toFloat(),
    body('pressure').optional({ nullable: true }).toFloat(),
    body('image').trim().isLength({ min: 1 }).escape(),
    body('voiceMessage').optional({ nullable: true }).trim().escape()
], async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.sendFile(path.join(__dirname, "../../public", "postUnsuccessful.html"));
    }
    try {
        const { angler, fishSpecies, date, location, weight, length, temperature, pressure, image, voiceMessage } = req.body;
        const newPost = await prisma.post.create({
            data: {
                angler,
                fishSpecies,
                date,
                location,
                weight,
                length,
                temperature,
                pressure,
                image,
                voiceMessage
            }
        });
        res.sendFile(path.join(__dirname, "../../public", "postSuccessful.html"));
    } catch (error) {
        console.log(error);
    }
});

router.get('/', async function(req, res) {
    try {
        const offset = Number(req.query.offset) || 0;
        const posts = await prisma.post.findMany({
            orderBy: {
                dateCreated: 'desc'
            },
            take: 3,
            skip: offset
        });
        const formattedPosts = posts.map(post => {
            return {
                ...post,
                date: post.date ? post.date.toLocaleDateString('en-GB') : 'N/A',
                location: post.location || 'N/A',
                weight: post.weight || 'N/A',
                length: post.length || 'N/A',
                temperature: post.temperature || 'N/A',
                pressure: post.pressure || 'N/A',
                voiceMessage: post.voiceMessage || 'N/A'
            };
        });
        res.json(formattedPosts);
    } catch (error) {
        console.log(error);
        res.sendFile(path.join(__dirname, "../../public", "500.html"));
    }
});

module.exports = router;
