

const Transaction = require('../models/transaction');
const { ErrorMargin, ErrorMarginRecurringDate } = require('../config');
const { isRecurringByDate, reponseCB, getNextTransactionDate } = require('../utils');

exports.create = function(req, res, next) {
    //get data add to transactions object
    // We can assume that joi validated the req.body
    //create a new Transaction and save to DB
    return Transaction.create(req.body)
    .then((result) => {
        // Get the mean
        const { user_id } = result[0];
        const companyName = result[0].name;
        Transaction.getMeanTransactionByuserIdAndCompanyName(user_id, companyName, (err, meanTransaction) => {
            if (err) {
                throw err;
            }
            const { amount } = meanTransaction[0];
            const minAmount = amount - (ErrorMargin * amount);
            const  maxAmount = amount + (ErrorMargin * amount);
            const nextAmount = amount;
            Transaction.getListOfTransactionsByAmountRange(user_id, companyName, minAmount, maxAmount, (err, transactions) => {
                if (err) {
                    throw err;
                }
                // if there are no transactions this is not a recurring transactions
                const recurring = isRecurringByDate(transactions);
                if (!recurring) {
                    // Not recurring
                    return res.json([]).status(200);
                }
                // parse the results
                try {
                    const objResult = {
                        name: companyName,
                        user_id: user_id,
                        next_date: getNextTransactionDate(transactions),
                        next_amt: nextAmount,
                        transactions: transactions
                    };
                    return res.json({ body: [objResult] }).status(200);
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            });
        });
    }).catch((err) => {
        return reponseCB(res, err);
    });
    
};

exports.get = function(req, res, next) {
    if (req.query.name) {
        return Transaction.findByCompanyName(req.query, reponseCB.bind(null, res));  
    }
    const sort = {};
    sort[req.query.sort] = req.query.order;
    return Transaction.find().sort(sort).limit(req.query.limit).exec(reponseCB.bind(null, res));
};

exports.getById = function(req, res, next) {
    Transaction.findOne({ trans_id: req.params.trans_id }, reponseCB.bind(null, res));
};

exports.getRecurringByuser_id = function(req, res, next) {
    
    const companyName = req.query.name;
    const user_id = req.params.user_id;

    Transaction.getMeanTransactionByuserIdAndCompanyName(user_id, companyName, (err, meanTransaction) => {
        if (err) {
            return next(err);
        }
        const { amount } = meanTransaction[0];
        minAmount = amount - (ErrorMargin * amount);
        maxAmount = amount + (ErrorMargin * amount);
        Transaction.getListOfTransactionsByAmountRange(user_id, companyName, minAmount, maxAmount, (err, transactions) => {
            if (err) {
                return next(err);
            }
            // Last step will be to check if it's recurring by date
            const recurring = isRecurringByDate(transactions);
            return res.json({ recurring, body: transactions }).status(200);
            
        });
    });
};
