const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// 查看当前用户评论历史
router.get('/my', authMiddleware, commentController.getMyComments);

// 公开：查看评论
router.get('/:postId', commentController.getPostComments);

// 保护：仅登录用户可操作
router.post('/', authMiddleware, commentController.createComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
