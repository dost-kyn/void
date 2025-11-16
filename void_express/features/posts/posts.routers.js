const express = require('express');
const router = express.Router()
const PostController = require('./posts.controller')

router.post('/', PostController.getAllPosts)

module.exports = router