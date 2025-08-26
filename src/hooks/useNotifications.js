// hooks/useNotifications.js
import { useState, useEffect } from 'react';

export const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (permission === 'default') {
            Notification.requestPermission().then(setPermission);
        }
    }, [permission]);

    const showNotification = (title, options = {}) => {
        if (permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'daily-flow-alarm',
                renotify: true,
                requireInteraction: true,
                ...options
            });

            // Auto-close after 10 seconds if not interacted with
            setTimeout(() => notification.close(), 10000);

            return notification;
        }
    };

    const requestPermission = () => {
        Notification.requestPermission().then(setPermission);
    };

    return {
        showNotification,
        requestPermission,
        hasPermission: permission === 'granted',
        permission
    };
};