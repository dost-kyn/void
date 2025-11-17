const express = require('express');
const router = express.Router(); 
const FriendsController = require('./friends.controller');
// const { authenticate } = require('../../middlewear/authenticate');
// router.use(authenticate);

router.get('/', FriendsController.getFriends);
router.get('/requests', FriendsController.getFriendRequests);
router.put('/requests/accept/:friendshipId', FriendsController.acceptFriendRequest);
router.delete('/requests/reject/:friendshipId', FriendsController.rejectFriendRequest);
router.get('/sent-requests', FriendsController.getSentFriendRequests);
router.post('/request', FriendsController.sendFriendRequest);

module.exports = router;