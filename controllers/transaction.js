
const Transaction = require('../models/transaction');

exports.transaction_create = function (req, res) {
    let transaction = new Transaction(
        {
            transId: req.body.transId,  //Unique identifier for the given transaction
            userId: req.body.userId, //Unique identifier of the user sending the request
            name: req.body.name, //Name of the transaction
            amount: req.body.amount, //Amount of the transaction in dollars
            date: req.body.date //Date the transaction posted to the account
        }
    );

    transaction.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Transaction Created successfully')
    })
};