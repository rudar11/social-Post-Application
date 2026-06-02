const express = require('express');
const multer = require('multer');
const postController = require('../controllers/post.controller');
const isAuthenticated = require('../middleware/auth.middleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//  '/api/posts'  hit , this routes handle 
router.post('/', isAuthenticated, upload.single("image"), postController.createPost);
router.get('/', postController.getPosts);
router.post('/:id/like', isAuthenticated, postController.likePost);
router.post('/:id/comment', isAuthenticated, postController.commentPost);
router.delete('/:id', isAuthenticated, postController.deletePost);

module.exports = router;