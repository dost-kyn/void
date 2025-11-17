const express = require('express')
const router = express.Router()
const PostController = require('./posts.controller')
const upload = require('../../middlewear/uploadPosts');

router.get('/', PostController.getAllPosts)
router.get('/user/:userId', PostController.getUserPosts)
router.post('/create', PostController.createPost)
router.get('/:id', PostController.getPostById)
router.put('/update/:id', PostController.updatePost)
router.put('/update-with-images/:id', upload.array('images', 10), PostController.updatePostWithImages);
router.post('/create-with-images', upload.array('images', 10), PostController.createPostWithImages);
router.post('/:id/images', upload.single('image'), PostController.addPostImage);


module.exports = router