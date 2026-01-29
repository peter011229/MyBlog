const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. 从请求头获取 token (格式: Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '未授权，请先登录' });
    }

    try {
        // 2. 验证 token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. 将用户信息存入 req 供后续使用
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token 验证失败:', err.message);
        return res.status(403).json({ message: '令牌无效或已过期' });
    }
};
