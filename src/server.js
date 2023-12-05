const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



