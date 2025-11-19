
import { useState, useEffect } from 'react';

export const useUserBan = () => {
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        checkUserBanStatus();
    }, []);

    const checkUserBanStatus = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            if (payload.status) {
                setIsBanned(payload.status === 'Ban');
            } else {
                // Если статуса нет в токене, запрашиваем у API
                fetchUserStatus(payload.id);
            }
        } catch (error) {
            console.error('Ошибка при проверке статуса бана:', error);
        }
    };

    const fetchUserStatus = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setIsBanned(userData.status === 'Ban');
            }
        } catch (error) {
            console.error('Ошибка при запросе статуса пользователя:', error);
        }
    };

    return { isBanned };
};