const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');


dotenv.config();

app.get('/', (req, res) => {
    res.send("Hello");
})

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('successfully connected to MongoDB');
})
  .catch((error) => {
    console.error('connection error:', error);
});


app.use('/api/user', userRoutes);


app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
})