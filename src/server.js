const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const postRouter = require('./routes/post.routes');
const onePostRouter = require('./routes/onepost.routes');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(express.static(path.join(__dirname, "../public")));

app.use('/post', postRouter);
app.use('/onepost', onePostRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get('/fish', async (req, res) => {
    try {
        const fish = await prisma.fish.findMany({
            orderBy: {
                fishId: 'asc',
            },
            select: {
                fishName: true
            },
        });
        res.json(fish);
    } catch (error) {
        console.error(error);
        res.sendFile(path.join(__dirname, "../public", "500.html"));
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



