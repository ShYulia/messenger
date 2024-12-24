import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (userId) {
            const socket = io('http://localhost:5000', { query: { userId } });
            socketRef.current = socket;

            console.log('Socket created:', socket);

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            return () => {
                socket.disconnect();
                console.log('Socket cleaned up');
            };
        }
    }, [userId]);

    return socketRef.current;
};

export default useSocket;
