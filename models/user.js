//This file is meant as an example of what a UserSchema might look like
//It is not meant to be used in the challenge
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        required: true,
        index: true,
        unique: true
    },
    username: {
        type: Schema.Types.ObjectId, 
        required: true,
        index: true,
        unique: true
    },
    email: {
        type:  Schema.Types.String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type:  Schema.Types.String,
        required: true
    },
    salt: {
        type:  Schema.Types.String,
        required: true
    },
    loggedInAt: {
        type: Schema.Types.Date
    },
    timestamps: true // this will assign createdAt and updatedAt fields to the user schema,
});

module.exports = mongoose.model('User', UserSchema);