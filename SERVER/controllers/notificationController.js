const Notification = require("../models/Notification"); // Import the Notification model

// Function to send a real-time notification
const sendNotification = (socket, senderId, message, chatId, type) => {
    socket.emit("receive_notification", {
        senderId,
        message,
        chatId,
        type,
    });
    console.log(`Notification sent to ${socket.id}`);
};

// Function to save offline notifications
const saveOfflineNotification = async (userId, senderId, message, type, groupId = null, chatId = null) => {
    try {
        await Notification.create({
            userId,
            senderId,
            message,
            type,
            groupId,
            chatId,
        });
        console.log(`Notification saved for offline user ${userId}`);
    } catch (error) {
        console.error("Error saving offline notification:", error.message);
    }
};

module.exports = { sendNotification, saveOfflineNotification };
