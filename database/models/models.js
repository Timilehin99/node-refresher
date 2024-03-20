const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default : new Date()
    }

})

module.exports = mongoose.model('Auth', user)