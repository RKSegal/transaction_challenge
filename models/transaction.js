const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    trans_id: {
        type: Schema.Types.String, 
        required: true,
        index: true,
        unique: true
    },
    user_id: {
        type: Schema.Types.String, 
        required: true,
        index: true
    },
    name: {
        type:  Schema.Types.String,
        lowercase: true,
        required: true,
        index: true
    },
    amount: {
        type:  Schema.Types.Number,
        required: true
    },
    createdAt: {
        type: Schema.Types.Date
    },
    date: {
        type: Schema.Types.Date,
        required: true,
        index: true
    }
});


TransactionSchema.pre('save', function(next) {
    // Transaction only will be saved once since its immuntable
    this.createdAt = Date.now();
    next();
});

TransactionSchema.static('findByCompanyName', function (options, cb) {
    const { name, limit = 100, sort = 'date', order = -1 } = options;
    const sortBy = {};
    sortBy[sort] = order;
    return this.find({ name: name }).sort(sortBy).limit(limit).exec(cb)
  });

TransactionSchema.static('getMeanTransactionByuserIdAndCompanyName', function(user_id, companyName, cb) {
    var self = this;
    self.countDocuments({ name: companyName, user_id: user_id }, function(err, count) {
        self.find({ name: companyName, user_id: user_id })
        .sort( {"amount":1} )
        .skip(count / 2 - 1)
        .limit(1)
        .exec(cb);
    });
});

TransactionSchema.static('getListOfTransactionsByAmountRange', function(user_id, companyName, minAmount, maxAmount, cb) {
    return this.find({ 
        name: companyName, 
        user_id: user_id,
        amount: { $gte: Number(minAmount), $lte: Number(maxAmount) }
    })
    .sort( {"date": -1} )
    .exec(cb);
});

module.exports = mongoose.model('Transaction', TransactionSchema);


