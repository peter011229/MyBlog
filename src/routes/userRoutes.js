const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// 认证路由
router.post('/register', authController.register);
router.post('/login', authController.login);

// 获取当前用户信息
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
