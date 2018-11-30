
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { logger, notFound } = require('./mw');
// Local Config
const {PORT, MONGODB, MONGODB_URI } = require('./config') 

const app = express();


app
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: false}))
.use('/health', logger.logRequest, require('./routes/health'))
.use('/transactions', logger.logRequest, require('./routes/transactions'))
.use(notFound)
.use(function(error, req, res, next) {
    const errMessage = error && error.message ? error.message : 'Something Went Wrong.';
    return res.json({
        code: 'Error',
        message: errMessage
    }).status(500);
});

const db = mongoose.connection;
db.on('error', (err) => {
    console.error('MongoDB connection error');
    connectWithRetry();
    throw(err);
})
.on('connected', () => {
    console.log('Mongodb connected');
});

const connectWithRetry = () => {
    mongoose.connect(MONGODB_URI, MONGODB);
};

console.log(`Trying to connect: ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI, MONGODB);

app.listen(PORT, () => {
    console.log(`Server is up and running on port #${PORT}`);
});

