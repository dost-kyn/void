const express = require('express');
const router = express.Router(); 
const ChatController = require('./chat.controller');

router.get('/', ChatController.getUserChats);
router.get('/:chatId', ChatController.getChatInfo);
router.get('/:chatId/messages', ChatController.getChatMessages);
router.post('/send', ChatController.sendMessage);
router.put('/:chatId/read', ChatController.markAsRead);
router.get('/with-friend/:friendId', ChatController.getOrCreateChat);

module.exports = router;