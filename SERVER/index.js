const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connection = require('./configs/messengerDB');
const loginRouter = require('./routers/loginRouter');
const usersRouter = require('./routers/usersRouter');
const messagesRouter = require('./routers/messagesRouter');
const privateNotificationsRouter = require('./routers/privateNotificationsRouter');
const groupNotificationsRouter = require('./routers/groupNotificationsRouter');
const { sendMessage } = require("./controllers/handleSendMessage");

const app = express();
const server = http.createServer(app);

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend communication
app.use('/login', loginRouter); // Routes for login
app.use('/users', usersRouter); // Routes for user management
app.use('/messages/private', messagesRouter); // Routes for private messages
app.use('/private-notifications/', privateNotificationsRouter); // Routes for private notifications
app.use('/group-notifications/', groupNotificationsRouter); // Routes for group notifications

connection.on('connected', () => {
    console.log('Database connection established.'); // Log when DB connection is successful
});

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow requests from this frontend
        methods: ['GET', 'POST']
    }
});

const onlineUsers = {}; // Tracks online users and their current socket IDs
const activeChats = {}; // Tracks active chat rooms and their participants

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Extract user ID from the connection query
    onlineUsers[userId] = socket.id; // Associate the user ID with their socket ID
    console.log(`User ${userId} connected with socket ${socket.id}`);

    // User joins a chat
    socket.on("join_chat", ({ type, otherUserId, chatId }) => {
        if (type === 'user' && otherUserId && chatId) {
            // Initialize chat if it doesn't exist
            if (!activeChats[chatId]) {
                activeChats[chatId] = { users: [], type: 'user' };
            }

            // Add the user to the chat if not already present
            if (!activeChats[chatId].users.includes(userId)) {
                activeChats[chatId].users.push(userId);
            }
            console.log(`User ${userId} joined chat ${chatId}`);
        }
    });

    // Handle sending messages
    socket.on('send_message', (messageData) => {
        console.log('Message received on server:', messageData); // Log received message
        sendMessage(io, socket, messageData, activeChats, onlineUsers); // Forward message to recipients
    });

    // User leaves all active chats
    socket.on('leave_active_chats', (data) => {
        for (const chatId in activeChats) {
            if (activeChats[chatId].users.includes(data.userId)) {
                // Remove user from the chat
                activeChats[chatId].users = activeChats[chatId].users.filter((id) => id !== data.userId);

                // Delete chat if no users are left
                if (activeChats[chatId].users.length === 0) {
                    delete activeChats[chatId];
                }
            }
        }
        console.log(`User ${data.userId} left active chats`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        // Remove user from online users
        delete onlineUsers[userId];

        // Remove user from all active chats
        for (const chatId in activeChats) {
            if (activeChats[chatId].users.includes(userId)) {
                activeChats[chatId].users = activeChats[chatId].users.filter((id) => id !== userId);

                // Delete chat if no users are left
                if (activeChats[chatId].users.length === 0) {
                    delete activeChats[chatId];
                }
            }
        }

        console.log(`User ${userId} disconnected`);
        io.emit('user_offline', userId); // Notify others about the user's disconnection
    });
});

// Start the server
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
