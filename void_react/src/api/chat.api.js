const API_URL = 'http://localhost:5000/api';

// Получить все чаты пользователя
export const getChats = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch chats');
    return await response.json();
};

// Получить сообщения конкретного чата
export const getChatMessages = async (chatId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat/${chatId}/messages`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
};

// Отправить сообщение
export const sendMessage = async (chatId, messageText) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            chatId: chatId,
            message_text: messageText
        })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
};

// Получить или создать чат с другом
export const getOrCreateChat = async (friendId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat/with-friend/${friendId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to get or create chat');
    return await response.json();
};

// Пометить сообщения как прочитанные
export const markMessagesAsRead = async (chatId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat/${chatId}/read`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to mark messages as read');
    return await response.json();
};