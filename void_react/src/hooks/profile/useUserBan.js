// hooks/profile/useUserBan.js
import { useState, useEffect } from 'react';

export const useUserBan = () => {
    const [isBanned, setIsBanned] = useState(false);

    const checkUserBanStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Проверяем статус пользователя из токена
                setIsBanned(payload.status === 'Ban');
            } catch (error) {
                console.error('Ошибка при проверке статуса бана:', error);
            }
        }
    };

    useEffect(() => {
        checkUserBanStatus();
    }, []);

    return { isBanned };
};