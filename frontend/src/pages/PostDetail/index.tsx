import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { Post } from '../../types/post';
import type { Comment } from '../../types/comment';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            setPost(response.data.data.post);
        } catch (err: any) {
            setError(err.response?.data?.message || '获取文章失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${id}`);
            setComments(response.data.data.comments);
        } catch (err) {
            console.error('获取评论失败:', err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
            fetchComments();
        }
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('确定要删除这篇文章吗？此操作不可撤销。')) return;

        try {
            await api.delete(`/posts/${id}`);
            alert('文章已删除');
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.message || '删除失败');
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommentLoading(true);
        try {
            await api.post('/comments', {
                post_id: id,
                content: newComment
            });
            setNewComment('');
            fetchComments(); // 刷新评论列表
        } catch (err: any) {
            alert(err.response?.data?.message || '评论发表失败');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleCommentDelete = async (commentId: number) => {
        if (!window.confirm('确定要删除这条评论吗？')) return;

        try {
            await api.delete(`/comments/${commentId}`);
            fetchComments();
        } catch (err: any) {
            alert(err.response?.data?.message || '删除失败');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>加载中...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</div>;
    if (!post) return <div style={{ textAlign: 'center', padding: '50px' }}>文章未找到</div>;

    const isAuthor = user && user.id === post.author_id;

    return (
        <div className="post-detail" style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: '#00b5e5', cursor: 'pointer', fontSize: '1rem', padding: '0', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}
                >
                    ← 返回首页
                </button>
            </div>
            <header className="post-header" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '20px', color: '#1a1a1a', lineHeight: '1.2' }}>{post.title}</h1>
                <div style={{ color: '#888', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '15px 20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span>👤 {post.author_name}</span>
                        <span>📅 {new Date(post.created_at).toLocaleString()}</span>
                        <span>👁️ {post.views} 次阅读</span>
                    </div>
                    {isAuthor && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => navigate(`/write?edit=${id}`)}
                                style={{ padding: '6px 16px', cursor: 'pointer', border: '1px solid #00b5e5', color: '#00b5e5', background: 'white', borderRadius: '8px', fontWeight: '500' }}
                            >
                                编辑文章
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{ padding: '6px 16px', cursor: 'pointer', border: 'none', backgroundColor: '#ff4d4f', color: 'white', borderRadius: '8px', fontWeight: '500' }}
                            >
                                删除
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {post.cover && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <img
                        src={post.cover}
                        alt={post.title}
                        style={{ width: '100%', display: 'block' }}
                    />
                </div>
            )}

            <article className="markdown-body" style={{ minHeight: '300px' }}>
                <ReactMarkdown>{post.content || ''}</ReactMarkdown>
            </article>

            {/* 评论系统 */}
            <section className="comments-section" style={{ marginTop: '80px', borderTop: '2px solid #f0f0f0', paddingTop: '40px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    💬 评论交流 <span style={{ fontSize: '1rem', color: '#999', fontWeight: 'normal' }}>({comments.length})</span>
                </h3>

                {/* 发表评论表单 */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} style={{ marginBottom: '40px', background: '#f8f9fa', padding: '25px', borderRadius: '16px' }}>
                        <textarea
                            placeholder="写下你的见解..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '15px',
                                borderRadius: '10px',
                                border: '1px solid #eee',
                                outline: 'none',
                                fontSize: '1rem',
                                marginBottom: '15px',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ textAlign: 'right' }}>
                            <button
                                type="submit"
                                disabled={commentLoading}
                                style={{
                                    padding: '10px 25px',
                                    backgroundColor: '#00b5e5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'opacity 0.3s'
                                }}
                            >
                                {commentLoading ? '提交中...' : '提交评论'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '30px', background: '#f8f9fa', borderRadius: '16px', marginBottom: '40px', color: '#666' }}>
                        请 <span style={{ color: '#00b5e5', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/login')}>登录</span> 后参与讨论
                    </div>
                )}

                {/* 评论列表 */}
                <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-item" style={{ display: 'flex', gap: '15px', padding: '20px', borderBottom: '1px solid #f6f6f6' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                    👤
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{comment.username}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(comment.created_at).toLocaleString()}</span>
                                            {user && user.id === comment.user_id && (
                                                <button
                                                    onClick={() => handleCommentDelete(comment.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    删除
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ lineHeight: '1.6', color: '#555', whiteSpace: 'pre-wrap' }}>
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                            还没有人评论，快来抢沙发吧～
                        </div>
                    )}
                </div>
            </section>



            <style>{`
                .markdown-body {
                    line-height: 2;
                    color: #2c3e50;
                    font-size: 1.1rem;
                }
                .markdown-body p { margin-bottom: 25px; }
                .markdown-body h1, .markdown-body h2, .markdown-body h3 {
                    margin-top: 2em;
                    margin-bottom: 1em;
                    color: #1a1a1a;
                }
                .markdown-body code {
                    background-color: #f1f3f5;
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.9em;
                }
                .markdown-body pre {
                    background-color: #282c34;
                    color: #abb2bf;
                    padding: 24px;
                    border-radius: 12px;
                    overflow: auto;
                    margin: 30px 0;
                }
                .markdown-body img {
                    max-width: 100%;
                    border-radius: 12px;
                    margin: 30px 0;
                    display: block;
                }
                .comment-item:last-child { border-bottom: none; }
            `}</style>
        </div>
    );
};

export default PostDetail;
