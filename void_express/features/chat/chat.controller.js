const ChatService = require("./chat.service");

// Получить список чатов пользователя
exports.getUserChats = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const chats = await ChatService.getUserChats(userId);
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error in getUserChats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Получить сообщения из конкретного чата
exports.getChatMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const messages = await ChatService.getChatMessages(parseInt(chatId), userId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getChatMessages:', error);
        
        if (error.message === 'Чат не найден' || error.message === 'Нет доступа к чату') {
            return res.status(403).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Отправить сообщение
exports.sendMessage = async (req, res, next) => {
    try {
        const { chatId, message_text } = req.body;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.id;
        
        const message = await ChatService.sendMessage(parseInt(chatId), senderId, message_text);
        res.status(201).json(message);
    } catch (error) {
        console.error('Error in sendMessage:', error);
        
        if (error.message === 'Чат не найден' || error.message === 'Нет доступа к чату') {
            return res.status(403).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Пометить сообщения как прочитанные
exports.markAsRead = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        await ChatService.markMessagesAsRead(parseInt(chatId), userId);
        res.status(200).json({ message: 'Сообщения помечены как прочитанные' });
    } catch (error) {
        console.error('Error in markAsRead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Получить или создать чат с другом
exports.getOrCreateChat = async (req, res, next) => {
    try {
        const { friendId } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const chat = await ChatService.getOrCreateChat(userId, parseInt(friendId));
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error in getOrCreateChat:', error);
        
        if (error.message === 'Пользователи не являются друзьями') {
            return res.status(403).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Получить информацию о конкретном чате
exports.getChatInfo = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const chat = await ChatService.getChatInfo(parseInt(chatId), userId);
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error in getChatInfo:', error);
        
        if (error.message === 'Чат не найден' || error.message === 'Нет доступа к чату') {
            return res.status(403).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};