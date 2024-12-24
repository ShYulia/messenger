import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import useAxios from "../hooks/useAxios";
import {Link } from 'react-router-dom'
import { useNotifications } from "../context/notificationsContext";
import { SocketContext } from '../context/socketContext';

const Users = () => {
    const { user, isLoggedIn } = useContext(UserContext);
    const [otherUsers, setOtherUsers] = useState([]);
    const axiosInstance = useAxios();
    const { notifications , setNotifications } = useNotifications();
    const {socket} = useContext(SocketContext); // Получаем сокет из контекста
    // Fetch users
    useEffect(() => {
        
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:5000/users');
                setOtherUsers(response.data);
            } catch (e) {
                console.error('Error fetching users:', e);
            }
        };
        fetchUsers();
    }, []);

   useEffect(()=>{
    if (socket){
        socket.emit('leave_active_chats', {userId: user.id})
        console.log("User left active chats:", user.id);
    }
   },[])
    
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
            <ul className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
                {otherUsers.map((other) => (
                    
                    <li 
                        key={other._id} 
                        className="flex items-center p-3 border-b border-gray-200 last:border-none"
                    >
                        <input 
                            type="checkbox" 
                            className="mr-3 rounded focus:ring-blue-500 text-blue-600" 
                        />
                    
                     <Link 
                     to={`/messages/${other._id}`}
                     state={{ recipientName: other.username }}
                     className="text-blue-600 hover:underline"
                 >
                     {other.username}
                 </Link>
                 <div className="ml-auto">
                 {notifications.personal?.[other._id] && (
                    <span style={{ color: "red", marginLeft: "10px" }}>
                    🔔 {notifications.personal?.[other._id]}
                </span>
                 )}
                 </div>
                     </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;
