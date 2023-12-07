const express = require('express');
const path = require('path');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async function(req, res) {
   res.sendFile(path.join(__dirname, "../../public", "showonepost.html"));
});

router.get('/getpost', async function(req, res) {
    try {
        const postId = Number(req.query.id);
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });
        if (post) {
            const formattedPost = {
                ...post,
                date: post.date ? post.date.toLocaleDateString('en-GB') : 'N/A',
                location: post.location || 'N/A',
                weight: post.weight || 'N/A',
                length: post.length || 'N/A',
                temperature: post.temperature || 'N/A',
                pressure: post.pressure || 'N/A',
                voiceMessage: post.voiceMessage || 'N/A'
            };
            res.send(formattedPost)
        } else {
            res.sendFile(path.join(__dirname, "../../public", "404.html"));
        }
    } catch (error) {
        console.error(error);
        res.sendFile(path.join(__dirname, "../../public", "500.html"));
    }
});

module.exports = router;
