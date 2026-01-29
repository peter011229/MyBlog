import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Write: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // 获取编辑模式 ID
    const queryParams = new URLSearchParams(location.search);
    const editId = queryParams.get('edit');

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number>(1);
    const [tags, setTags] = useState('');
    const [cover, setCover] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

    // 辅助函数：处理图片上传
    const handleImageUpload = async (file: File, type: 'cover' | 'content') => {
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const response = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = response.data.data.url;
            if (type === 'cover') {
                setCover(url);
            } else {
                // 在光标位置插入图片语法
                const imageMd = `\n![图片描述](${url})\n`;
                setContent(prev => prev + imageMd);
            }
        } catch (err: any) {
            alert(err.response?.data?.message || '图片上传失败');
        } finally {
            setUploading(false);
        }
    };

    // 获取全部分类数据
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/posts/categories/all');
                setCategories(response.data.data.categories);
            } catch (err) {
                console.error('获取分类失败:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editId) {
            const fetchPost = async () => {
                setFetching(true);
                try {
                    const response = await api.get(`/posts/${editId}`);
                    const post = response.data.data.post;

                    // 权限检查：非作者不能编辑
                    if (user && post.author_id !== user.id) {
                        alert('您无权编辑此文章');
                        navigate('/');
                        return;
                    }

                    setTitle(post.title);
                    setContent(post.content || '');
                    setCategoryId(post.category_id || 1);
                    setTags(post.tags ? JSON.parse(post.tags).join(', ') : '');
                    setCover(post.cover || '');
                } catch (err) {
                    console.error('获取文章失败:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchPost();
        }
    }, [editId, user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const postData = {
            title,
            content,
            category_id: categoryId,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            cover
        };

        try {
            if (editId) {
                await api.put(`/posts/${editId}`, postData);
                alert('编辑成功！');
            } else {
                await api.post('/posts', postData);
                alert('发布成功！');
            }
            navigate(editId ? `/post/${editId}` : '/');
        } catch (err: any) {
            alert(err.response?.data?.message || '保存失败');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div style={{ textAlign: 'center', padding: '50px' }}>正在加载文章数据...</div>;

    return (
        <div className="write-page" style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '15px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', color: '#00b5e5', cursor: 'pointer', fontSize: '1rem', padding: '0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}
                >
                    ← 返回
                </button>
            </div>
            <form onSubmit={handleSave} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="请输入文章标题..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ flex: 1, padding: '12px', fontSize: '1.2rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        style={{ padding: '0 15px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        style={{ padding: '0 30px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? '正在保存...' : (editId ? '更新文章' : '发布文章')}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="标签 (逗号分隔)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="封面图片 URL"
                            value={cover}
                            onChange={(e) => setCover(e.target.value)}
                            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <label style={{
                            padding: '8px 15px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            border: '1px solid #ddd'
                        }}>
                            {uploading ? '上传中...' : '📤 上传封面'}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
                            />
                        </label>
                    </div>
                </div>
            </form>

            <div className="editor-toolbar" style={{ marginBottom: '10px' }}>
                <label style={{
                    padding: '5px 12px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                }}>
                    🖼️ 插入图片
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'content')}
                    />
                </label>
                {uploading && <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#666' }}>正在处理图片...</span>}
            </div>

            <div className="editor-container" style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0 }}>
                {/* 编辑区 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="使用 Markdown 开始你的创作..."
                        style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                {/* 预览区 */}
                <div style={{ flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '4px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
                    <div style={{ color: '#999', fontSize: '0.8rem', marginBottom: '10px' }}>实时预览区</div>
                    <div className="markdown-body">
                        <ReactMarkdown>{content || '*预览区域*'}</ReactMarkdown>
                    </div>
                </div>
            </div>

            <style>{`
                .markdown-body { line-height: 1.6; }
                .markdown-body h1, .markdown-body h2 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
                .markdown-body pre { background: #f6f8fa; padding: 10px; border-radius: 4px; }
                .markdown-body code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
            `}</style>
        </div>
    );
};

export default Write;
