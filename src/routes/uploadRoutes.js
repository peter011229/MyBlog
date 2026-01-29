const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// 仅登录用户可以上传图片
router.post('/image', authMiddleware, uploadController.uploadImage);

module.exports = router;
