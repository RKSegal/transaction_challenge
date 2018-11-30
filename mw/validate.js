const joi = require('joi');

module.exports = {
    createTranasction: (req, res, next) => {
        const schema = Joi.object().keys({
            transId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            userId: joi.string().required(),
            name: joi.string().required(),
            amount: joi.number().required(),
            date: joi.date().required()
        });
        // validate the request payload
        const result = Joi.validate(req.body, schema);
        // if payload is not valid pass the error
        if (result.error) {
            return next(result.error);
        }
        
        return next();
    }
};

