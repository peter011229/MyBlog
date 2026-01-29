const app = require('./app');
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

// 💡 自动初始化数据库：如果表不存在，则根据 init.sql 自动创建
async function autoInitDB() {
    try {
        const sqlPath = path.join(__dirname, 'config', 'init.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await db.query(sql);
            console.log('📦 数据库查验：表结构已准备就绪');
        }
    } catch (err) {
        console.error('⚠️ 数据库自动初始化失败:', err.message);
    }
}

const PORT = process.env.PORT || 3000;

// 先初始化数据库，再启动服务器
autoInitDB().then(() => {
    app.listen(PORT, () => {
        console.log(`服务器已启动，运行在 http://localhost:${PORT}`);
    });
});
