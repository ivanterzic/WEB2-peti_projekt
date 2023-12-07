const express = require('express');
const path = require('path');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/', function(req, res) {
    console.log(req.body);
    res.sendFile(path.join(__dirname, "../../public", "postSuccessful.html"));
});

router.get('/', function(req, res) {
    res.send('Get request received');
}
);

module.exports = router;
