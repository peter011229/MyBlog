const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // 生成文件名: 时间戳 + 随机数 + 原始扩展名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 文件过滤 (仅限图片)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('请上传图片文件！'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 限制 5MB
    fileFilter: fileFilter
});

exports.uploadImage = [
    upload.single('image'),
    (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ status: 'fail', message: '请选择要上传的文件' });
            }

            // 返回文件访问路径 (完整 URL)
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

            res.status(200).json({
                status: 'success',
                data: {
                    url: imageUrl
                }
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
];
