const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDatabase() {
    console.log('--- 开始初始化数据库表 (多语句模式) ---');

    try {
        // 读取 SQL 文件
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // 直接执行整个 SQL 文件
        await db.query(sql);

        console.log('✅ 所有数据库表创建/验证成功！');
    } catch (err) {
        console.error('❌ 数据库初始化失败:', err.message);
    } finally {
        process.exit();
    }
}

initDatabase();
