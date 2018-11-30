module.exports = {
    PORT: process.env.PORT || 1984,
    HOST: process.env.HOST || 'localhost',
    MONGODB: require('./mongodb'), 
    ErrorMargin: 0.03, // 3%
    ErrorMarginRecurringDate: 0.8, // 80%   
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/interview_challenge'
}