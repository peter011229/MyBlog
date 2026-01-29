import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Post } from '../../types/post';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: number | undefined, name: string }[]>([]);

    // 获取分类数据
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/posts/categories/all');
                setCategories([
                    { id: undefined, name: '全部' },
                    ...response.data.data.categories
                ]);
            } catch (err) {
                console.error('获取分类失败:', err);
            }
        };
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/posts', {
                params: {
                    page,
                    pageSize,
                    keyword,
                    category: categoryId
                }
            });
            const { posts, total } = response.data.data;
            setPosts(posts);
            setTotal(total);
        } catch (error) {
            console.error('获取文章列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, categoryId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // 搜索时重置回第一页
        fetchPosts();
    };

    return (
        <div className="home-container" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            {/* 左侧文章列表 */}
            <div className="main-content" style={{ flex: 1, minWidth: 0 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px' }}>正在加载文章数据...</div>
                ) : (
                    <div className="post-list">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <article key={post.id} className="post-card">
                                    <Link to={`/post/${post.id}`} className="post-card-link">
                                        <div className="post-cover-wrapper">
                                            <img
                                                src={post.cover || 'https://via.placeholder.com/400x250?text=No+Cover'}
                                                alt={post.title}
                                                className="post-cover"
                                            />
                                        </div>
                                        <div className="post-content-area">
                                            <h2 className="post-title">{post.title}</h2>
                                            <div className="post-meta">
                                                <span>👤 {post.author_name}</span>
                                                <span className="meta-sep">/</span>
                                                <span>📁 {post.category_name}</span>
                                                <span className="meta-sep">/</span>
                                                <span>👁️ {post.views}</span>
                                                <span className="meta-sep">/</span>
                                                <span>🕒 {new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <div className="empty-state" style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '12px', color: '#999' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
                                <p>暂无相关文章，换个关键词试试？</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 分页器 */}
                {total > pageSize && (
                    <div className="pagination-wrapper">
                        <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>上一页</button>
                        <span className="page-info">第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页</span>
                        <button className="page-btn" disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(page + 1)}>下一页</button>
                    </div>
                )}
            </div>

            {/* 右侧侧边栏 */}
            <aside className="sidebar" style={{ width: '320px', flexShrink: 0 }}>
                {/* 搜索挂件 */}
                <div className="sidebar-widget">
                    <h3 className="widget-title">站内搜索</h3>
                    <form onSubmit={handleSearch} className="search-bar">
                        <input
                            type="text"
                            placeholder="搜索感兴趣的内容..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit">搜索</button>
                    </form>
                </div>

                {/* 标签/分类挂件 */}
                <div className="sidebar-widget">
                    <h3 className="widget-title">文章分类</h3>
                    <div className="category-cloud">
                        {categories.map(cat => (
                            <button
                                key={cat.id || 'all'}
                                onClick={() => { setCategoryId(cat.id); setPage(1); }}
                                className={`category-tag ${categoryId === cat.id ? 'active' : ''}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 个人简介挂件 (仿图需求) */}
                <div className="sidebar-widget profile-widget">
                    <h3 className="widget-title">关于博客</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                        欢迎来到我的个人博客，这里记录技术成长与生活点滴。
                    </p>
                </div>
            </aside>

            <style>{`
                .post-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .post-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                }
                .post-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
                }
                .post-card-link {
                    display: flex;
                    text-decoration: none;
                    color: inherit;
                    height: 180px;
                }
                .post-cover-wrapper {
                    width: 280px;
                    height: 100%;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .post-cover {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s;
                }
                .post-card:hover .post-cover {
                    transform: scale(1.1);
                }
                .post-content-area {
                    flex: 1;
                    padding: 25px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-width: 0;
                }
                .post-title {
                    font-size: 1.4rem;
                    margin: 0 0 15px 0;
                    color: #222;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .post-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    font-size: 0.85rem;
                    color: #888;
                    align-items: center;
                }
                .meta-sep { opacity: 0.3; }

                .sidebar-widget {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .widget-title {
                    font-size: 1.1rem;
                    margin: 0 0 20px 0;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #f6f6f6;
                    position: relative;
                }
                .widget-title::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 40px;
                    height: 2px;
                    background: var(--primary-color);
                }
                .search-bar {
                    display: flex;
                    gap: 8px;
                }
                .search-bar input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #eee;
                    border-radius: 6px;
                    outline: none;
                    font-size: 0.9rem;
                }
                .search-bar button {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                    white-space: nowrap;
                    flex-shrink: 0;
                    font-weight: 500;
                }
                .search-bar button:hover {
                    opacity: 0.9;
                    box-shadow: 0 2px 8px rgba(0,181,229,0.3);
                }
                .category-cloud {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .category-tag {
                    padding: 6px 14px;
                    background: #f8f9fa;
                    border: none;
                    border-radius: 6px;
                    color: #666;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .category-tag:hover {
                    background: #eee;
                    color: var(--primary-color);
                }
                .category-tag.active {
                    background: var(--primary-color);
                    color: white;
                }

                .pagination-wrapper {
                    margin-top: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                }
                .page-btn {
                    padding: 8px 20px;
                    border: 1px solid #eee;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    color: #555;
                }
                .page-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .page-info {
                    color: #888;
                    font-size: 0.95rem;
                }

                @media (max-width: 900px) {
                    .home-container { flex-direction: column; }
                    .sidebar { width: 100% !important; }
                    .post-card-link { height: auto; flex-direction: column; }
                    .post-cover-wrapper { width: 100%; height: 200px; }
                }
            `}</style>
        </div>
    );
};

export default Home;
