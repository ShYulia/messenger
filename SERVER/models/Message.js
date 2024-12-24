const mongoose = require('mongoose')
const connection = require('../configs/messengerDB')

const MessageSchema = new mongoose.Schema({
   type:{ type: String, enum: ['user', 'group'], required: true },
   senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
   groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, 
   content: { type: String, required: true },
   isread:{type:Boolean, required: true },
   timestamp: { type: Date, default: Date.now },
})

const Message = connection.model('message', MessageSchema)
module.exports = Message