module.exports = {
    validate: require('./validate'),
    logger: require('./logger'),
    notFound: (req, res) => res.json({ code: 'NotFound' }).status(404)
}