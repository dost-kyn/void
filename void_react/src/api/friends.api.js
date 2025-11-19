const API_URL = 'http://localhost:5000/api';

export const getFriends = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch friends');
    return await response.json();
};

export const getFriendRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/requests`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch friend requests');
    return await response.json();
};

export const getSentFriendRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/sent-requests`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch sent friend requests');
    return await response.json();
};

// ОБНОВЛЕНО: Используем POST вместо PUT
export const acceptFriendRequest = async (friendshipId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/requests/accept/${friendshipId}`, {
        method: 'POST', // Изменено с PUT на POST
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to accept friend request');
    return await response.json();
};

export const rejectFriendRequest = async (friendshipId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/requests/reject/${friendshipId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to reject friend request');
    return await response.json();
};

export const sendFriendRequest = async (user2Id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/friends/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user2_id: user2Id })
    });
    if (!response.ok) throw new Error('Failed to send friend request');
    return await response.json();
};