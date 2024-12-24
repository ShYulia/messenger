const mongoose = require('mongoose')
const connection = require('../configs/messengerDB')

const UserSchema = new mongoose.Schema({
    username:String,
    password: String
})

const User = connection.model('user', UserSchema)
module.exports = User