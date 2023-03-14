const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
})