const db = require('../config/db');

const Category = {
    // 获取所有分类
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
        return rows;
    },

    // 根据名称查找分类或创建它
    findOrCreateByName: async (name) => {
        if (!name) return null;

        // 1. 先尝试查找
        const [rows] = await db.query('SELECT id FROM categories WHERE name = ?', [name]);
        if (rows.length > 0) {
            return rows[0].id;
        }

        // 2. 找不到则创建
        const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        return result.insertId;
    },

    // 根据 ID 检查是否存在
    exists: async (id) => {
        if (!id) return false;
        const [rows] = await db.query('SELECT id FROM categories WHERE id = ?', [id]);
        return rows.length > 0;
    }
};

module.exports = Category;
