import { useState, useEffect } from 'react';
import {
    getFriends,
    getFriendRequests,
    getSentFriendRequests,
    acceptFriendRequest as apiAcceptFriendRequest,
    rejectFriendRequest as apiRejectFriendRequest,
    sendFriendRequest as apiSendFriendRequest
} from '../api/friends.api';

export const useFriends = () => {
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загрузить друзей и заявки
    const loadFriendsData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [friendsData, requestsData, sentRequestsData] = await Promise.all([
                getFriends(),
                getFriendRequests(),
                getSentFriendRequests()
            ]);

            setFriends(friendsData);
            setFriendRequests(requestsData);
            setSentRequests(sentRequestsData);
        } catch (err) {
            setError('Ошибка при загрузке друзей');
            console.error('Error loading friends:', err);
        } finally {
            setLoading(false);
        }
    };

    // Принять заявку в друзья
    const handleAcceptRequest = async (friendshipId) => {
        try {
            setError(null);
            
            // Используем правильный endpoint - POST вместо PUT
            const response = await fetch(`http://localhost:5000/api/friends/requests/accept/${friendshipId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при принятии заявки');
            }

            const result = await response.json();

            // Обновляем локальное состояние
            setFriendRequests(prev => prev.filter(req => req.friendship_id !== friendshipId));
            
            // Перезагружаем данные для обновления списка друзей
            await loadFriendsData();

            return result;

        } catch (err) {
            setError('Ошибка при принятии заявки');
            console.error('Error accepting friend request:', err);
            return false;
        }
    };

    // Отклонить заявку в друзья
    const handleRejectRequest = async (friendshipId) => {
        try {
            setError(null);
            await apiRejectFriendRequest(friendshipId);

            // Обновляем список заявок
            await loadFriendsData();
            return true;
        } catch (err) {
            setError('Ошибка при отклонении заявки');
            console.error('Error rejecting friend request:', err);
            return false;
        }
    };

    // Отправить заявку в друзья
    const handleSendRequest = async (user2Id) => {
        try {
            setError(null);
            await apiSendFriendRequest(user2Id);
            await loadFriendsData(); // Обновляем список отправленных заявок
            return true;
        } catch (err) {
            setError('Ошибка при отправке заявки');
            console.error('Error sending friend request:', err);
            return false;
        }
    };

    useEffect(() => {
        loadFriendsData();
    }, []);

    return {
        friends,
        friendRequests,
        sentRequests,
        loading,
        error,
        loadFriendsData,
        acceptFriendRequest: handleAcceptRequest,
        rejectFriendRequest: handleRejectRequest,
        sendFriendRequest: handleSendRequest
    };
};

// Экспортируем функции фильтрации отдельно
export const filterFriends = (friends, searchTerm) => {
    return (friends || []).filter(friend => {
        if (!friend) return false;
        const name = friend.name || '';
        const lastName = friend.last_name || '';
        const login = friend.login || '';
        const search = searchTerm.toLowerCase();

        return name.toLowerCase().includes(search) ||
               lastName.toLowerCase().includes(search) ||
               login.toLowerCase().includes(search);
    });
};

export const filterFriendRequests = (friendRequests, searchTerm) => {
    return (friendRequests || []).filter(request => {
        if (!request) return false;
        const name = request.name || '';
        const lastName = request.last_name || '';
        const login = request.login || '';
        const search = searchTerm.toLowerCase();

        return name.toLowerCase().includes(search) ||
               lastName.toLowerCase().includes(search) ||
               login.toLowerCase().includes(search);
    });
};

export const filterSentRequests = (sentRequests, searchTerm) => {
    return (sentRequests || []).filter(request => {
        if (!request) return false;
        const name = request.name || '';
        const lastName = request.last_name || '';
        const login = request.login || '';
        const search = searchTerm.toLowerCase();

        return name.toLowerCase().includes(search) ||
               lastName.toLowerCase().includes(search) ||
               login.toLowerCase().includes(search);
    });
};

// Экспортируем функцию форматирования даты
export const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    try {
        return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (error) {
        return 'Неверная дата';
    }
};

// Экспортируем функцию получения URL аватара
export const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '../src/uploads/avatars/default-avatar.jpg';
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath}`;
};