const express = require('express');
const router = express.Router();
const mw = require('../mw');
const { transactions } = require('../controllers');

router.get('/', mw.validate.getTransaction, transactions.get);
router.get('/recurring/:user_id', 
    mw.validate.getRecurringByuser_id, 
    transactions.getRecurringByuser_id
);
    
router.get('/:transId', mw.validate.getTransactionById, transactions.getById);

router.post('/', mw.validate.createTranasction, transactions.create);

module.exports = router;
