const db = require('../config/db');

const Post = {
    // 创建新文章
    create: async (postData) => {
        const { title, content, cover, category_id, tags, author_id } = postData;
        const [result] = await db.query(
            'INSERT INTO posts (title, content, cover, category_id, tags, author_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, cover || null, category_id || null, tags ? JSON.stringify(tags) : null, author_id]
        );
        return result.insertId;
    },

    // 获取文章列表 (分页 + 筛选 + 搜索)
    findAll: async (options) => {
        const { limit = 10, offset = 0, category_id, keyword } = options;
        let sql = `
            SELECT p.id, p.title, p.cover, p.views, p.created_at, u.username as author_name, c.name as category_name 
            FROM posts p 
            LEFT JOIN users u ON p.author_id = u.id 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1
        `;
        const params = [];

        if (category_id) {
            sql += ' AND p.category_id = ?';
            params.push(category_id);
        }

        if (keyword) {
            sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows] = await db.query(sql, params);
        return rows;
    },

    // 获取文章总数 (用于分页)
    countAll: async (options) => {
        const { category_id, keyword } = options;
        let sql = 'SELECT COUNT(*) as total FROM posts p WHERE 1=1';
        const params = [];

        if (category_id) {
            sql += ' AND p.category_id = ?';
            params.push(category_id);
        }

        if (keyword) {
            sql += ' AND (p.title LIKE ? OR p.content LIKE ?)';
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        const [rows] = await db.query(sql, params);
        return rows[0].total;
    },

    // 获取文章详情
    findById: async (id) => {
        // 增加浏览次数
        await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);

        const [rows] = await db.query(
            `SELECT p.*, u.username as author_name, c.name as category_name 
       FROM posts p 
       LEFT JOIN users u ON p.author_id = u.id 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
            [id]
        );
        return rows[0];
    },

    // 更新文章
    update: async (id, postData) => {
        const { title, content, cover, category_id, tags } = postData;
        const [result] = await db.query(
            'UPDATE posts SET title = ?, content = ?, cover = ?, category_id = ?, tags = ? WHERE id = ?',
            [title, content, cover || null, category_id || null, tags ? JSON.stringify(tags) : null, id]
        );
        return result.affectedRows > 0;
    },

    // 删除文章
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Post;
