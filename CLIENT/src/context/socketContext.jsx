import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ userId, children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (userId) {
            const newSocket = io('http://localhost:5000', { query: { userId } });
            console.log('Socket created:', newSocket);

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            return () => {
                newSocket.disconnect();
                console.log('Socket disconnected');
            };
        }
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
