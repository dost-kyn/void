const express = require('express')
const router = express.Router()
const PostController = require('./posts.controller')

router.get('/', PostController.getAllPosts)
router.get('/user/:userId', PostController.getUserPosts)
router.post('/create', PostController.createPost)

module.exports = router