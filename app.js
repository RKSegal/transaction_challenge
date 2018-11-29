
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Local Config
const {PORT, MONGODB, MONGODB_URI } = require('./config') 

const app = express();

// Express Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/health', (req, res) => { res.json({ code: 'ok' })});

mongoose.connect(MONGODB_URI, MONGODB);
const db = mongoose.connection;
db.on('error', (err) => {
    console.error('MongoDB connection error');
    throw(err);
});


app.listen(PORT, () => {
    console.log(`Server is up and running on port #${PORT}`);
});

