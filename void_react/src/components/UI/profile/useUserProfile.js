import { useState, useEffect } from 'react';
import { findUser } from '../../../api/users.api';
import { getUserPosts } from '../../../api/posts.api';
import { getFriends, getSentFriendRequests, sendFriendRequest } from '../../../api/friends.api';

// Хук для данных профиля
export const useUserProfile = (userId) => {
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [hasSentRequest, setHasSentRequest] = useState(false);

    // Функция для проверки отправленных заявок
    const checkSentRequest = async () => {
        try {
            const sentRequests = await getSentFriendRequests();
            const hasSent = sentRequests.some(request => 
                request.id === parseInt(userId)
            );
            setHasSentRequest(hasSent);
        } catch (error) {
            console.error('Ошибка проверки отправленных заявок:', error);
            setHasSentRequest(false);
        }
    };

    // Функция для проверки дружбы
    const checkFriendship = async () => {
        try {
            const friends = await getFriends();
            const isUserFriend = friends.some(friend => 
                friend.id === parseInt(userId)
            );
            setIsFriend(isUserFriend);
        } catch (error) {
            console.error('Ошибка проверки дружбы:', error);
            setIsFriend(false);
        }
    };

    // Функция для получения данных пользователя
    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const userData = await findUser(userId);
            setUser(userData);
            
            const posts = await getUserPosts(userId);
            setUserPosts(posts);

            const currentUserId = getCurrentUserId();
            if (currentUserId && currentUserId !== parseInt(userId)) {
                await checkFriendship();
                await checkSentRequest();
            }
        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
            setError('Не удалось загрузить профиль пользователя');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const refetch = () => {
        fetchUserData();
    };

    // Функция для обновления статуса заявки
    const updateRequestStatus = (status) => {
        setHasSentRequest(status);
    };

    return {
        user,
        userPosts,
        loading,
        error,
        isFriend,
        hasSentRequest,
        refetch,
        updateRequestStatus // ← добавляем эту функцию
    };
};

// Функция для получения ID текущего пользователя
export const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    }
    return null;
};

// Функция для отправки заявки в друзья
export const BecomeFriend = async (userId, updateRequestStatus) => {
    try {
        console.log('Отправка заявки дружбы пользователю:', userId);
        const result = await sendFriendRequest(userId);
        console.log('Результат отправки заявки:', result);
        
        // Обновляем статус заявки
        if (updateRequestStatus) {
            updateRequestStatus(true);
        }
        
        return result;
    } catch (error) {
        console.error('Ошибка при отправке заявки в друзья:', error);
        throw error;
    }
};

// Функция для перехода в чат
export const SendMessage = (userId) => {
    try {
        console.log('Переход в чат с пользователем:', userId);
        alert(`Переход в чат с пользователем ID: ${userId}`);
        return { success: true, message: 'Переход в чат' };
    } catch (error) {
        console.error('Ошибка при переходе в чат:', error);
        throw error;
    }
};

// Функция для аватаров
export const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '../src/uploads/avatars/default-avatar.jpg';
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath}`;
};

// Функция для изображений постов
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
};

// Функция для форматирования даты
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
};

// Функция для проверки, является ли профиль текущим пользователем
export const isMyProfile = (profileUserId) => {
    const currentUserId = getCurrentUserId();
    return currentUserId && currentUserId === parseInt(profileUserId);
};