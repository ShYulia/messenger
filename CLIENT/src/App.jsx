import React, { useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Users from './components/Users';
import Groups from './components/Groups';
import PrivateMessages from './components/PrivateMessages';
import Login from './Auth/Login';
import { UserContext } from './context/userContext';
import Navbar from './components/Navbar';
import Notifications from './components/Notifications';
import { SocketProvider } from './context/socketContext';
import { NotificationsProvider } from './context/notificationsContext';

function App() {
    const { user, isLoggedIn } = useContext(UserContext);
    const [notifications, setNotifications] = useState({ personal: {}, group: {}, totalPersonal: 0, totalGroup: 0 });
    return (
        <>
            {isLoggedIn && setNotifications? (
                // Оборачиваем приложение в SocketProvider
                <SocketProvider userId={user?.id}>
                <NotificationsProvider>
                    <Navbar  />
                        <Notifications  />
                    <Routes>
                        <Route path="/" element={<Users />} />
                        <Route path="messages/:userId" element={<PrivateMessages />} />
                        <Route path="groups" element={<Groups />} />
                        <Route
                            path="users"
                            element={<Users  />}
                        />
                    </Routes>
                    </NotificationsProvider>
                </SocketProvider>
            ) : (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            )}
        </>
    );
}

export default App;
