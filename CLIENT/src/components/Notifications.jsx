import { useContext, useEffect } from "react";
import { SocketContext } from '../context/socketContext';
import { useNotifications } from '../context/notificationsContext';

const Notifications = () => {
    const { socket } = useContext(SocketContext);
    const { addNotification } = useNotifications();
useEffect(() => {
        if (!socket) {
            console.log('Socket not available');
            return;
        }

        console.log(socket, 'socket connected');

        socket.on('receive_notification', (data) => {
            console.log('New notification:', data);
            addNotification(data); // Добавляем уведомление через контекст
        });

        return () => {
            socket.off('receive_notification');
        };
    }, [socket, addNotification]);

    return null; // No JSX needed
};

export default Notifications;
