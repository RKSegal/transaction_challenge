module.exports = function (req, res) {
    return res.send({ code: 'ok' }).code(200);
};