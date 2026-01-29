const Comment = require('../models/commentModel');

// 发表评论
exports.createComment = async (req, res) => {
    try {
        const { post_id, content } = req.body;
        const user_id = req.user.id; // 从 JWT 中间件获取

        if (!content) {
            return res.status(400).json({ status: 'fail', message: '内容不能为空' });
        }

        const commentId = await Comment.create({ post_id, user_id, content });

        res.status(201).json({
            status: 'success',
            data: { id: commentId }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 获取文章的所有评论
exports.getPostComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.findByPostId(postId);

        res.status(200).json({
            status: 'success',
            results: comments.length,
            data: { comments }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 删除评论
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ status: 'fail', message: '评论不存在' });
        }

        // 仅限评论者本人或文章作者删除 (此处简化为仅评论者本人)
        if (comment.user_id !== userId) {
            return res.status(403).json({ status: 'fail', message: '无权删除此评论' });
        }

        await Comment.delete(commentId);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
// 获取当前登录用户的所有评论 (支持分页)
exports.getMyComments = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.findByUserId(userId, limit, offset),
            Comment.countByUserId(userId)
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                comments,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
