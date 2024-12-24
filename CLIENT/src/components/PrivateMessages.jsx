import React, { useContext, useEffect, useState} from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import useAxios from "../hooks/useAxios";
import { SocketContext } from '../context/socketContext';
import { useNotifications } from "../context/notificationsContext";

const PrivateMessages = ({}) => {
   const { userId } = useParams(); // Получаем параметр из маршрута
   const location = useLocation(); // Access the passed state
   const { recipientName } = location.state || {};
   const { user } = useContext(UserContext);
   const {socket} = useContext(SocketContext); // Получаем сокет из контекста
   const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState('');
   const [recipientId, setRecipientId] = useState(userId);
   const axiosInstance = useAxios();
   const { notifications , setNotifications } = useNotifications();
   const chatId = [user.id, recipientId].sort().join('-'); // generating chatId
 
   useEffect(() => {
    if (socket) {
        // Listen for the "receive_message" event from the server
        socket.on("receive_message", (messageData) => {
            console.log("New message received:", messageData);
            
            // Check if the message belongs to the current chat
            if (messageData.chatId === chatId) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { senderId: messageData.senderId === user.id ? 'You' : recipientName, message: messageData.message },
                ]);
            }
        });

        // Cleanup the event listener when the component unmounts
        return () => {
            socket.off("receive_message");
        };
    }
}, [socket, chatId, user.id, recipientName]);

useEffect(() =>{
    setNotifications((prev) => {
        const {personal, ...rest}= prev
        console.log(personal, rest, prev, 'personal, rest, prev,')
        const updatedPersonal = {...personal}
        delete updatedPersonal[userId]
        return {...rest, personal : updatedPersonal,
            totalPersonal: Object.values(updatedPersonal).reduce((sum, count) => sum + count, 0),
        }
    })
},[])

   useEffect(() => {
    const clearUnread = async() => {
    try {
        const response = await axiosInstance.put(`http://localhost:5000/messages/private/${user.id}/${recipientId}`, { isread: true })
     console.log(response.data)

    }catch(e){
        console.log(e,'error')
    }
    }
    clearUnread()
 
   },[])
    useEffect(() => {
       
        const fetchMessages = async() =>{
        try {
            const response = await axiosInstance.get(`http://localhost:5000/messages/private/${user.id}/${recipientId}`)
            const formattedMessages = response.data.map((msg) => ({
                ...msg, // Сохраняем остальные поля
                senderId:
                    msg.senderId === user.id
                        ? 'You'
                        : msg.senderId === recipientId
                        ? recipientName
                        : msg.senderId, // Оставляем оригинальный senderId, если он не совпадает
                message:msg.content        
            }));

            setMessages(formattedMessages);
           
        }catch(e) {
            console.log(e)
        }
        }
        fetchMessages();
    },[ user.id, recipientId])
    useEffect(() => {
        if (socket && chatId) {
            
            socket.emit('join_chat', { type: 'user', otherUserId: recipientId,chatId });
        }

    }, [socket, recipientId,chatId]);

    const sendMessage = () => {
        if (socket && message && recipientId) {
            console.log(socket,'socket')
            console.log('Sending message:', { recipientId, message,chatId });
            socket.emit('send_message', { recipientId, message,chatId });
            setMessages((prev) => [...prev, { senderId: 'You', message }]);
            setMessage('');
        }
    };

    return (
        <div>
            <h3>Private Chat</h3>
           
            <input
                type="text"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.senderId}:</strong> {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default PrivateMessages;
