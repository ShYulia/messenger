const mongoose = require('mongoose')
const connection = require('../configs/messengerDB')

const GroupSchema = new mongoose.Schema({
    groupName:String,
    members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
})

const Group = connection.model('group', GroupSchema)
module.exports = Group