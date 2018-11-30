const _ = require('lodash');
const { ErrorMargin, ErrorMarginRecurringDate } = require('../config');

const calculateDays = (trans1, trans2) => parseInt((Math.abs(trans1.date - trans2.date)) / 86400000);
const countInArray = (arr, value) => arr.reduce((n, x) => n + (x === value), 0);

const isMonthly = (listOfDays) => {
    const total = countInArray(listOfDays, 31) + 
    countInArray(listOfDays, 30) + 
    countInArray(listOfDays, 29) + 
    countInArray(listOfDays, 28);

    if ((total / listOfDays.length) > ErrorMarginRecurringDate) {
        return true;
    }

    return false;
};

const isBiMonthly = (listOfDays) => {
    const total = countInArray(listOfDays, 16) + 
    countInArray(listOfDays, 15) + 
    countInArray(listOfDays, 14) + 
    countInArray(listOfDays, 13);

    if ((total / listOfDays.length) > ErrorMarginRecurringDate) {
        return true;
    }

    return false;
};

const isAnnual = (listOfDays) => {
    const total = countInArray(listOfDays, 365) + 
    countInArray(listOfDays, 364) + 
    countInArray(listOfDays, 363) + 
    countInArray(listOfDays, 362);

    if (total > 2) {
        return true;
    }

    return false;
};

// @returns diff of days 
const getDiffByDays = (transactions) => {
    const daysDelta = [];
    for(let i=1; i<transactions.length; i++) {
        daysDelta.push(calculateDays(transactions[i], transactions[(i-1)]));
    }
   return daysDelta;
}


// Check if transaction recurring by dates
exports.isRecurringByDate = (listOfTransactions) => {
    if (listOfTransactions.length < 2) {
        return false;
    }

    const sortedTransactionByDate = _.sortBy(listOfTransactions, ['date']);
    
    // we can assume that listOfTransactions is ordered by DESC dates
    const daysDelta = getDiffByDays(sortedTransactionByDate)
   
    if (isMonthly(daysDelta) || isBiMonthly(daysDelta) || isAnnual(daysDelta)) {
        return true;
    }
    return false;
}

exports.reponseCB = (res, err, data) => {
    if (err) {
        return next(err);
    }

    return res.json({ code: 'ok', body: data }).status(200);
}

// @returns date object
exports.getNextTransactionDate = (transactions) => {
    const sortedTransactionByDate = _.sortBy(transactions, ['date']);
    const nextTransactionDate = sortedTransactionByDate[sortedTransactionByDate.length-1].date;
    const transactionDays = getDiffByDays(sortedTransactionByDate)
    if (isBiMonthly(transactionDays)) {
        return nextTransactionDate.setDate(nextTransactionDate.getDay()+15);
    }
    else if (isMonthly(transactionDays)) {
        return nextTransactionDate.setMonth(nextTransactionDate.getMonth()+1);
    }
    else if (isAnnual(transactionDays)) {
        return nextTransactionDate.setYear(nextTransactionDate.getYear()+1);
    }
    else {
        throw new Error('Unknown recurring date');
    }
}

