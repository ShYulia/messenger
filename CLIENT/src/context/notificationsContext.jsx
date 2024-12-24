import React, { createContext, useState, useContext } from 'react';

// Создание контекста
const NotificationsContext = createContext();

// Хук для использования контекста
export const useNotifications = () => useContext(NotificationsContext);

// Провайдер для управления состоянием уведомлений
export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState({
        personal: {},
        group: {},
        totalPersonal: 0,
        totalGroup: 0,
    });

    const addNotification = (data) => {
        setNotifications((prev) => {
            const newNotifications = { ...prev };

            if (data.type === 'personal') {
                newNotifications.personal[data.senderId] = (newNotifications.personal[data.senderId] || 0) + 1;
            } else if (data.type === 'group') {
                newNotifications.group[data.groupId] = (newNotifications.group[data.groupId] || 0) + 1;
            }

            return {
                ...newNotifications,
                totalPersonal: Object.values(newNotifications.personal).reduce((sum, count) => sum + count, 0),
                totalGroup: Object.values(newNotifications.group).reduce((sum, count) => sum + count, 0),
            };
        });
    };

    return (
        <NotificationsContext.Provider value={{ notifications, addNotification, setNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};
