const Message = require("../models/Message"); // Import the Message model
const { sendNotification, saveOfflineNotification } = require("./notificationController"); // Import notification functions

// Function to send messages
const sendMessage = async (io, socket, messageData, activeChats, onlineUsers) => {
    const { chatId, recipientId, groupId, message } = messageData;
    const userId = socket.handshake.query.userId;

    // Create a new message object
    const newMessage = new Message({
        type: groupId ? "group" : "user",
        senderId: userId,
        recipientId: groupId ? null : recipientId,
        groupId: groupId || null,
        content: message,
        isread: false,
    });

    await newMessage.save();

    // Limit messages to the 20 newest ones
    const filter = groupId ? { groupId } : { $or: [{ senderId: userId, recipientId }, { senderId: recipientId, recipientId: userId }] };
    await limitMessages(filter);

    if (groupId) {
        sendGroupMessage(io, userId, groupId, message, chatId, activeChats);
    } else if (recipientId) {
        sendPersonalMessage(io, userId, recipientId, message, chatId, activeChats, onlineUsers);
    }

    console.log(`Message sent in chat ${chatId} by ${userId}`);
};

// Function to limit the number of messages to 20
const limitMessages = async (filter) => {
    try {
        const count = await Message.countDocuments(filter);
        if (count > 20) {
            const oldestMessages = await Message.find(filter)
                .sort({ createdAt: 1 })
                .limit(count - 20);

            await Message.deleteMany({ _id: { $in: oldestMessages.map((m) => m._id) } });
            console.log(`Deleted ${count - 20} old messages`);
        }
    } catch (error) {
        console.error("Error limiting messages:", error.message);
    }
};

// Helper function for sending group messages
const sendGroupMessage = async (io, userId, groupId, message, chatId, activeChats) => {
    const group = await Group.findById(groupId);
    if (!group) return console.error("Group does not exist");

    group.members.forEach(async (memberId) => {
        if (memberId.toString() !== userId) {
            const memberSocket = io.sockets.sockets.get(memberId.toString());
            const memberChat = activeChats[chatId];

            if (memberSocket) {
                memberSocket.emit("receive_message", { senderId: userId, message, chatId });

                if (!memberChat || memberChat.type !== "group") {
                    sendNotification(memberSocket, userId, message, chatId, "group");
                }
            } else {
                await saveOfflineNotification(memberId, userId, message, "group", groupId, chatId);
            }
        }
    });
};

// Helper function for sending personal messages
const sendPersonalMessage = async (io, userId, recipientId, message, chatId, activeChats, onlineUsers) => {
    const recipientSocketId = onlineUsers[recipientId];
    const recipientSocket = io.sockets.sockets.get(recipientSocketId);
    const recipientChat = activeChats[chatId];
     console.log(recipientSocket,'recipientSocketId aaaaaaaaaaaaaaaaa')
    if (recipientSocket) {
        recipientSocket.emit("receive_message", { senderId: userId, message, chatId });
        const isRecipientInChat = recipientChat && recipientChat.users.includes(userId) && recipientChat.users.includes(recipientId)
        console.log(recipientChat,'recipientChat')
          if (!isRecipientInChat) {
            sendNotification(recipientSocket, userId, message, chatId, "personal");
        }
    } else {
        await saveOfflineNotification(recipientId, userId, message, "personal", null, chatId);
    }
};

module.exports = { sendMessage };
