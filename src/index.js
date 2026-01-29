const app = require('./app');
require('./config/db'); // 初始化数据库连接

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`服务器已启动，运行在 http://localhost:${PORT}`);
});
