module.exports = {
    PORT: process.env.PORT || 1984,
    HOST: process.env.HOST || 'localhost',
    MONGODB: require('./mongodb'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://rachel:password@localhost:27017/interview_challenge', 
}