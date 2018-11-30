const joi = require('joi');

module.exports = {
    createTranasction: (req, res, next) => {
        const schema = joi.array().items(joi.object().keys({
            trans_id: joi.string().required(),
            user_id: joi.string().required(),
            name: joi.string().required(),
            amount: joi.number().required(),
            date: joi.date().required()
        }).unknown()).min(1).required();
        // validate the request payload
        const result = joi.validate(req.body, schema);
        // if payload is not valid pass the error
        if (result.error) {
            return next(result.error);
        }
        
        return next();
    },
    getTransaction: (req, res, next) => {
        const schema = joi.object().keys({
            limit: joi.number().min(1).max(500).default(100),
            sort: joi.string().only(['date', 'amount', 'name']).default('name'),
            order: joi.string().allow(['asc', 'desc']).default('desc'),
            name: joi.string().optional().description('company name is optional')
        });
        // validate the request payload
        const result = joi.validate(req.query, schema);
        // if payload is not valid pass the error
        if (result.error) {
            return next(result.error);
        }

        return next();
    },
    getTransactionById: (req, res, next) => {
        const schema = joi.object().keys({
            trans_id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        });
        // validate the request payload
        const result = joi.validate(req.params, schema);
        // if payload is not valid pass the error
        if (result.error) {
            return next(result.error);
        }

        return next();
    },

    getRecurringByuser_id: (req, res, next) => {
        // validate query params and params
        const schema = joi.object().keys({
            query: joi.object({
                name: joi.string().required(),
            }),
            params: joi.object({
                user_id: joi.string().required()
            })
        }).unknown();
        const result = joi.validate(req, schema);
        if (result.error) {
            return next(result.error);
        }

        return next();

    }
};

