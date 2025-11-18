import { useState, useEffect } from 'react';
import {
    getFriends,
    getFriendRequests,
    getSentFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest
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
            await acceptFriendRequest(friendshipId);

            // Обновляем список заявок и друзей
            await loadFriendsData();
            return true;
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
            await rejectFriendRequest(friendshipId);

            // Обновляем список заявок
            await loadFriendsData();
            return true;
        } catch (err) {
            setError('Ошибка при отклонении заявки');
            console.error('Error rejecting friend request:', err);
            return false;
        }
    };
    const acceptFriendRequest = async (friendshipId) => {
        try {
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
            setFriends(prev => [...prev, {
                ...result.friendship,
                friendship_id: result.friendship.id
            }]);

            return result;

        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
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
        rejectFriendRequest: handleRejectRequest
    };
};