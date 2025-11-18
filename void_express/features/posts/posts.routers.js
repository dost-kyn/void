const express = require('express')
const router = express.Router()
const PostController = require('./posts.controller')
const upload = require('../../middlewear/uploadPosts');

// ============ для админки
router.get('/all', PostController.getAllPostsForAdmin); 
router.put('/:id/status', PostController.updatePostStatus); 

router.get('/', PostController.getAllPosts)
router.get('/user/:userId', PostController.getUserPosts)
router.post('/create', PostController.createPost)
router.get('/:id', PostController.getPostById)
router.put('/update/:id', PostController.updatePost)
router.put('/update-with-images/:id', upload.array('images', 10), PostController.updatePostWithImages);
router.post('/create-with-images', upload.array('images', 10), PostController.createPostWithImages);
router.post('/:id/images', upload.single('image'), PostController.addPostImage);
router.delete('/images/:imageId', PostController.deletePostImage);
router.delete('/:id', PostController.deletePost);

module.exports = router