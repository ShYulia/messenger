const mongoose = require('mongoose')
const connection = require('../configs/messengerDB')

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, required: true },
    type: { type: String, enum: ["personal", "group"], required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = connection.model("notification", NotificationSchema);
