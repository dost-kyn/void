const FriendsService = require("./friends.service");

// Получить список друзей
exports.getFriends = async (req, res, next) => {
    try {
        console.log('🔍 Получение списка друзей...');
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('❌ Токен отсутствует');
            return res.status(401).json({ error: 'Token required' });
        }
        
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        console.log(`👤 ID пользователя: ${userId}`);
        
        const friends = await FriendsService.getUserFriends(userId);
        console.log(`✅ Найдено друзей: ${friends.length}`);
        
        res.status(200).json(friends);
    } catch (error) {
        console.error('❌ Error in getFriends:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
};

// Получить заявки в друзья (входящие)
exports.getFriendRequests = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const requests = await FriendsService.getFriendRequests(userId);
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error in getFriendRequests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Получить отправленные заявки (исходящие)
exports.getSentFriendRequests = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const sentRequests = await FriendsService.getSentFriendRequests(userId);
        res.status(200).json(sentRequests);
    } catch (error) {
        console.error('Error in getSentFriendRequests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Принять заявку в друзья
exports.acceptFriendRequest = async (req, res, next) => {
    try {
        const { friendshipId } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const result = await FriendsService.acceptFriendRequest(friendshipId, userId);
        res.status(200).json({ 
            message: 'Заявка принята',
            friendship: result 
        });
    } catch (error) {
        console.error('Error in acceptFriendRequest:', error);
        
        if (error.message === 'Заявка не найдена' || error.message === 'Нельзя принять эту заявку') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Отклонить заявку в друзья
exports.rejectFriendRequest = async (req, res, next) => {
    try {
        const { friendshipId } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        await FriendsService.rejectFriendRequest(friendshipId, userId);
        res.status(200).json({ message: 'Заявка отклонена' });
    } catch (error) {
        console.error('Error in rejectFriendRequest:', error);
        
        if (error.message === 'Заявка не найдена') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Отправить заявку в друзья
exports.sendFriendRequest = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user1Id = decoded.id;
        
        const { user2_id } = req.body;

        await FriendsService.sendFriendRequest(user1Id, user2_id);
        res.status(200).json({ message: 'Заявка отправлена' });
    } catch (error) {
        console.error('Error in sendFriendRequest:', error);
        
        if (error.message === 'Заявка уже существует') {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};