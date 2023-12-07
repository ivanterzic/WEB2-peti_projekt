const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const postRouter = require('./routes/post.routes');
const onePostRouter = require('./routes/onepost.routes');

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});



