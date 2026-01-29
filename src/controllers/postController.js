const Post = require('../models/postModel');
const Category = require('../models/categoryModel');

// 发布文章
exports.createPost = async (req, res) => {
    try {
        const { title, content, category_id, tags, cover } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: '标题和内容不能为空' });
        }

        // 自动解析分类 ID：如果是字符串（名称），则查表或创建；如果是数字 ID，则直接使用
        let finalCategoryId = null;
        if (category_id) {
            if (typeof category_id === 'string' && isNaN(Number(category_id))) {
                finalCategoryId = await Category.findOrCreateByName(category_id);
            } else {
                finalCategoryId = Number(category_id);
            }
        }

        const postId = await Post.create({
            title,
            content,
            category_id: finalCategoryId,
            tags,
            cover,
            author_id: req.user.id
        });

        res.status(201).json({
            status: 'success',
            message: '文章发布成功',
            data: { postId }
        });
    } catch (err) {
        console.error('发布文章错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取文章列表
exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const category_id = req.query.category;
        const keyword = req.query.keyword;

        const limit = pageSize;
        const offset = (page - 1) * limit;

        const options = { limit, offset, category_id, keyword };

        // 同时获取列表和总数
        const [posts, total] = await Promise.all([
            Post.findAll(options),
            Post.countAll(options)
        ]);

        res.json({
            status: 'success',
            data: {
                posts,
                total,
                page,
                pageSize
            }
        });
    } catch (err) {
        console.error('获取列表错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取文章详情
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }
        res.json({
            status: 'success',
            data: { post }
        });
    } catch (err) {
        console.error('获取文章详情错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新文章
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category_id, tags, cover } = req.body;

        // 1. 检查文章是否存在以及是否有权限
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({ message: '您无权编辑此文章' });
        }

        // 自动解析分类 ID
        let finalCategoryId = null;
        if (category_id) {
            if (typeof category_id === 'string' && isNaN(Number(category_id))) {
                finalCategoryId = await Category.findOrCreateByName(category_id);
            } else {
                finalCategoryId = Number(category_id);
            }
        }

        // 2. 执行更新
        await Post.update(id, { title, content, category_id: finalCategoryId, tags, cover });

        res.json({
            status: 'success',
            message: '文章更新成功'
        });
    } catch (err) {
        console.error('更新文章错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除文章
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. 检查文章是否存在以及是否有权限
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: '文章不存在' });
        }

        if (post.author_id !== req.user.id) {
            return res.status(403).json({ message: '您无权删除此文章' });
        }

        // 2. 执行删除
        await Post.delete(id);

        res.json({
            status: 'success',
            message: '文章已删除'
        });
    } catch (err) {
        console.error('删除文章错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};
// 获取所有分类列表
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json({
            status: 'success',
            data: { categories }
        });
    } catch (err) {
        console.error('获取分类列表错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};
