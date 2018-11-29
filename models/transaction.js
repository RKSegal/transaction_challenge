const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    transId: {
        type: Schema.Types.ObjectId, 
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        required: true,
        index: true,
        unique: true
    },
    name: {
        type:  Schema.Types.String,
        lowercase: true
    },
    amount: {
        type:  Schema.Types.Number
    },
    createdAt: {
        type: Schema.Types.Date
    },
    date: {
        type: Schema.Types.Date
    },
    transaction: {
        type: Schema.Types.Boolean
    },
    price: {
        type: Schema.Types.Number, 
        required: true
    }
});


TransactionSchema.pre('save', function(next) {
    // Transaction only will be saved once since its immuntable
    this.createdAt = Date.now();
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);