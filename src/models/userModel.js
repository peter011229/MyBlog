const db = require('../config/db');

const User = {
    // 根据用户名查找用户
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

    // 根据邮箱查找用户
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // 创建新用户
    create: async (userData) => {
        const { username, email, password, avatar } = userData;
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
            [username, email, password, avatar || null]
        );
        return result.insertId;
    },

    // 获取用户信息（排除密码）
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, username, email, avatar, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;
