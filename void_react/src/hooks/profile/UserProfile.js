
import { useState } from 'react';
import { findUser } from '../../api/users.api';

export const useFetchUserProfile = (showActionAlert) => {
    const [user, setUser] = useState(null);

    const fetchUserProfile = async (userId) => {
        try {
            const userData = await findUser(userId);
            setUser(userData);
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            showActionAlert('error_generic', 'error', { message: 'Ошибка загрузки профиля' });
        }
    };

    return {
        user,
        setUser,
        fetchUserProfile
    };
};