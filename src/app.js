const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 静态文件服务 (用于访问上传的图片)
app.use('/uploads', express.static('public/uploads'));

// 中间件配置
app.use(cors()); // 启用跨域支持
app.use(morgan('dev')); // 日志记录
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 请求体

// 路由导入
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');

// 基础路由测试
app.get('/', (req, res) => {
    res.json({ message: '欢迎访问个人博客 API 系统' });
});

// 路由挂载
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: '服务器内部错误'
    });
});

module.exports = app;
