const mongoose = require('mongoose');
const faker = require('faker');
const Transaction = require('../models/transaction');

const {MONGODB, MONGODB_URI } = require('../config');

function runSeed() {
    const user_id = mongoose.Types.ObjectId();
    console.log(`Insert data for user id: ${user_id}`);

    const transactions = [];

    for (let i=0; i<10; i++) {
        // Unique companies
        const companyName = faker.company.companyName();
        const numberOfTransaction = faker.random.number(10);
        for (let j=0; j<numberOfTransaction; j++) {
            transactions.push({
                // Unique transaction
                transId: mongoose.Types.ObjectId(),
                // Make sure transaction amount is a float
                amount: Number(`${faker.random.number(10000)}.${faker.random.number(100)}`),
                // Dates are between 2016 - now
                date: faker.date.between('2016-01-01', new Date()),
                user_id,
                name: companyName
            });
        };
    }
    
    // insert specific recurring transactions
    const recurringCompanyName = 'verizon';
    for (let j=1; j<12; j++) {
        const baseAmount = 60;
        const errorMargin = (3 * (faker.random.number(10)/10));
        // Amount should be between 57-63
        // when random number is even it's going to add a number between 0-3 
        // else subtract amount between 0-3
        const amount = faker.random.number() % 2 === 0 ? baseAmount+errorMargin : baseAmount-errorMargin;

        transactions.push({
            // Unique transaction
            transId: mongoose.Types.ObjectId(),
            // Make sure transaction amount is a float
            amount,
            // Dates are between 2016 - now
            date: j < 10 ? new Date(`2018-0${j}-01`) : new Date(`2018-${j}-01`),
            user_id,
            name: 'verizon'
        });
    }

    Transaction.insertMany(transactions)
    .then(function(results) {
        console.log(results);
        process.exit(0);
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });
}

const db = mongoose.connection;
db.on('error', (err) => {
    console.error('MongoDB connection error');
    throw(err);
})
.on('connected', () => {
    console.log('Mongodb connected');
    runSeed();
});

console.log(`Trying to connect: ${MONGODB_URI}`);
mongoose.connect(MONGODB_URI, MONGODB);

