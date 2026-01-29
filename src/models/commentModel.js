const db = require('../config/db');

const Comment = {
    // 创建评论
    create: async (data) => {
        const { post_id, user_id, content } = data;
        const [result] = await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [post_id, user_id, content]
        );
        return result.insertId;
    },

    // 根据文章 ID 获取评论
    findByPostId: async (postId) => {
        const [rows] = await db.query(
            `SELECT c.id, c.content, c.created_at, c.user_id, u.username 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.post_id = ? 
             ORDER BY c.created_at ASC`,
            [postId]
        );
        return rows;
    },

    // 删除评论
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM comments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },

    // 获取单条评论（用于权限校验）
    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
        return rows[0];
    },
    // 获取用户发表过的所有评论 (支持分页)
    findByUserId: async (userId, limit = 5, offset = 0) => {
        const [rows] = await db.query(
            `SELECT c.id, c.content, c.created_at, c.post_id, p.title as post_title 
             FROM comments c 
             JOIN posts p ON c.post_id = p.id 
             WHERE c.user_id = ? 
             ORDER BY c.created_at DESC
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );
        return rows;
    },

    // 获取特定用户的评论总数
    countByUserId: async (userId) => {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM comments WHERE user_id = ?',
            [userId]
        );
        return rows[0].total;
    }
};

module.exports = Comment;
