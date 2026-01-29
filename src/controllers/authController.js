const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. 验证输入
        if (!username || !password) {
            return res.status(400).json({ message: '请提供用户名和密码' });
        }

        // 2. 查找用户
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 3. 验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 4. 生成 JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            status: 'success',
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error('登录错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. 基本验证
        if (!username || !email || !password) {
            return res.status(400).json({ message: '请填写所有必填字段' });
        }

        // 2. 检查用户是否已存在
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: '邮箱已被注册' });
        }

        // 3. 加密密码
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. 保存到数据库
        const userId = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: 'success',
            message: '注册成功',
            data: { userId, username, email }
        });
    } catch (err) {
        console.error('注册错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取当前登录用户信息
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        console.error('获取个人信息错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};
