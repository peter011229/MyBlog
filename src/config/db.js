const mysql = require('mysql2');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // 允许执行多条 SQL 语句
});

// 使用 Promise 版本的 pool
const promisePool = pool.promise();

console.log('正在连接数据库...');

// 简单的连接测试
promisePool.getConnection()
  .then(connection => {
    console.log('数据库连接成功！');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err.message);
  });

module.exports = promisePool;
