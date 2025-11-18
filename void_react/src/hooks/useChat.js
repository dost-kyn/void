import { useState, useEffect } from 'react';
import { getChats, getChatMessages, sendMessage, getOrCreateChat, markMessagesAsRead } from '../api/chat.api';
const API_URL = 'http://localhost:5000/api';

// Хук для управления состоянием чатов
export const useChatState = () => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return {
        chats, setChats,
        currentChat, setCurrentChat,
        messages, setMessages,
        loading, setLoading,
        error, setError
    };
};

// Функция для получения всех чатов
export const useFetchChats = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChats = async () => {
        try {
            setLoading(true);
            setError(null);
            const chatsData = await getChats();
            return chatsData;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching chats:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchChats, loading, error };
};

// Функция для получения сообщений чата
export const useFetchChatMessages = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChatMessages = async (chatId) => {
        try {
            setLoading(true);
            setError(null);
            const messagesData = await getChatMessages(chatId);
            
            // Пометить сообщения как прочитанные
            await markMessagesAsRead(chatId);
            
            return messagesData;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching messages:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchChatMessages, loading, error };
};

// Функция для отправки сообщения
export const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendNewMessage = async (chatId, messageText) => {
        try {
            setLoading(true);
            setError(null);
            const newMessage = await sendMessage(chatId, messageText);
            return newMessage;
        } catch (err) {
            setError(err.message);
            console.error('Error sending message:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { sendNewMessage, loading, error };
};

// Функция для начала чата с другом
export const useStartChatWithFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startChat = async (friendId) => {
        try {
            setLoading(true);
            setError(null);
            const chat = await getOrCreateChat(friendId);
            return chat;
        } catch (err) {
            setError(err.message);
            console.error('Error starting chat:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { startChat, loading, error };
};






// Функция для получения информации о чате
export const useFetchChatInfo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChatInfo = async (chatId) => {
        try {
            setLoading(true);
            setError(null);
            const chatData = await getChatInfo(chatId);
            return chatData;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching chat info:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchChatInfo, loading, error };
};




// Композитный хук для полной функциональности чата (опционально)
export const useChat = () => {
    const chatState = useChatState();
    const { fetchChats, loading: chatsLoading, error: chatsError } = useFetchChats();
    const { fetchChatMessages, loading: messagesLoading, error: messagesError } = useFetchChatMessages();
    const { sendNewMessage, loading: sendLoading, error: sendError } = useSendMessage();
    const { startChat, loading: startChatLoading, error: startChatError } = useStartChatWithFriend();
    const { fetchChatInfo, loading: chatInfoLoading, error: chatInfoError } = useFetchChatInfo();

    const loading = chatsLoading || messagesLoading || sendLoading || startChatLoading || chatInfoLoading;
    const error = chatsError || messagesError || sendError || startChatError || chatInfoError;

    // Получить все чаты и обновить состояние
    const loadChats = async () => {
        try {
            const chatsData = await fetchChats();
            chatState.setChats(chatsData);
        } catch (err) {
            chatState.setError(err.message);
        }
    };

    // Получить сообщения чата и информацию о чате
    const loadChatMessages = async (chatId) => {
        try {
            console.log('🔄 Loading chat info and messages for chatId:', chatId);
            
            // Загружаем информацию о чате
            const chatInfo = await fetchChatInfo(chatId);
            console.log('✅ Chat info loaded:', chatInfo);
            chatState.setCurrentChat(chatInfo);
            
            // Загружаем сообщения
            const messagesData = await fetchChatMessages(chatId);
            console.log('✅ Messages loaded:', messagesData.length);
            chatState.setMessages(messagesData);
            
        } catch (err) {
            console.error('❌ Error loading chat:', err);
            chatState.setError(err.message);
        }
    };

    // Отправить сообщение и обновить состояние
    const handleSendMessage = async (chatId, messageText) => {
        try {
            const newMessage = await sendNewMessage(chatId, messageText);
            chatState.setMessages(prev => [...prev, newMessage]);
            
            // Обновляем последнее сообщение в списке чатов
            chatState.setChats(prev => prev.map(chat => 
                chat.id === chatId 
                    ? { 
                        ...chat, 
                        last_message: {
                            text: messageText,
                            time: new Date().toISOString(),
                            is_read: false,
                            is_my_message: true
                        }
                    } 
                    : chat
            ));
            
            return newMessage;
        } catch (err) {
            chatState.setError(err.message);
            throw err;
        }
    };

    // Начать чат с другом
    const handleStartChat = async (friendId) => {
        try {
            const chat = await startChat(friendId);
            
            // Обновляем список чатов
            chatState.setChats(prev => {
                const existingChat = prev.find(c => c.id === chat.id);
                if (existingChat) {
                    return prev.map(c => c.id === chat.id ? chat : c);
                } else {
                    return [...prev, chat];
                }
            });
            
            chatState.setCurrentChat(chat);
            return chat;
        } catch (err) {
            chatState.setError(err.message);
            throw err;
        }
    };

    // Выбрать чат
    const selectChat = (chat) => {
        chatState.setCurrentChat(chat);
        if (chat && chat.id) {
            loadChatMessages(chat.id);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    return {
        // Состояние
        chats: chatState.chats,
        currentChat: chatState.currentChat,
        messages: chatState.messages,
        loading,
        error,
        
        // Функции
        loadChats,
        loadChatMessages,
        sendMessage: handleSendMessage,
        startChatWithFriend: handleStartChat,
        selectChat,
        setCurrentChat: chatState.setCurrentChat,
        setMessages: chatState.setMessages
    };
};


export const getChatInfo = async (chatId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch chat info');
    return await response.json();
};
