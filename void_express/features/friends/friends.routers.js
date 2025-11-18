const express = require('express');
const router = express.Router(); 
const FriendsController = require('./friends.controller');


router.get('/', FriendsController.getFriends);
router.get('/requests', FriendsController.getFriendRequests);
router.delete('/requests/reject/:friendshipId', FriendsController.rejectFriendRequest);
router.get('/sent-requests', FriendsController.getSentFriendRequests);
router.post('/requests/accept/:friendshipId', FriendsController.acceptFriendRequest)
router.post('/request', FriendsController.sendFriendRequest);

module.exports = router;