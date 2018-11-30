const express = require('express');
const router = express.Router();
const mw = require('../mw');
// Require controllers 
const transaction_controller = require('../controllers/transaction');

// Test url to make sure all files are communicating correctly
router.get('/test', transaction_controller.test);

router.get('/', function(req, res){
    res.render("home")
});

router.get('/transactions', function(req, res){
    Transaction.find({}, function(err, transactions) {
        res.render("transactions", {transactions: transactions});
    })
})


router.post("/", mw.validate.createTranasction, function(req, res){
    //get data add to transactions object
    // We can assume that joi validated the req.body
    const newTransaction = req.body;
    //create a new Transaction and save to DB
    Transaction.create(newTransaction, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/Transactions");
        }
    });  
});

module.exports = router;
