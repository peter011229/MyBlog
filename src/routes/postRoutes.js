const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// 公开接口：获取列表和详情
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// 受保护接口：必须登录才能操作
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
