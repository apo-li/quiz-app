const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    quizzes:{
        type: Array,
        required: true
    },
    signupDate: {
        type: Date,
        required: true,
        default: Date.now
    }
    
})

module.exports = mongoose.model('User', userSchema)