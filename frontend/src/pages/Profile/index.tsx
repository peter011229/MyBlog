import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    created_at: string;
}

interface UserComment {
    id: number;
    content: string;
    created_at: string;
    post_id: number;
    post_title: string;
}

const Profile: React.FC = () => {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [comments, setComments] = useState<UserComment[]>([]);
    const [loading, setLoading] = useState(true);

    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);

    const fetchProfileData = async () => {
        try {
            const response = await api.get('/users/me');
            setProfile(response.data.data.user);
        } catch (err) {
            console.error('获取个人档案失败:', err);
        }
    };

    const fetchComments = async (page: number) => {
        try {
            const response = await api.get(`/comments/my?page=${page}&limit=5`);
            setComments(response.data.data.comments);
            const { pagination } = response.data.data;
            setTotalPages(pagination.totalPages);
            setTotalComments(pagination.total);
        } catch (err) {
            console.error('获取评论历史失败:', err);
        }
    };

    useEffect(() => {
        if (!authUser) {
            navigate('/login');
            return;
        }

        const init = async () => {
            setLoading(true);
            await Promise.all([fetchProfileData(), fetchComments(1)]);
            setLoading(false);
        };

        init();
    }, [authUser, navigate]);

    // 处理翻页
    const handlePageChange = async (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        await fetchComments(newPage);
        // 滚动到评论区顶部
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>加载中...</div>;


    return (
        <div className="profile-container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
                {/* 左侧：用户信息卡片 */}
                <aside>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f0f2f5', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                            👤
                        </div>
                        <h2 style={{ margin: '0 0 10px', fontSize: '1.5rem', color: '#1a1a1a' }}>{profile?.username}</h2>
                        <p style={{ color: '#8c8c8c', margin: '0 0 20px', fontSize: '0.9rem' }}>注册于 {profile ? new Date(profile.created_at).toLocaleDateString() : ''}</p>

                        <div style={{ textAlign: 'left', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#999', display: 'block', marginBottom: '4px' }}>电子邮箱</label>
                                <span style={{ color: '#333' }}>{profile?.email}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#999', display: 'block', marginBottom: '4px' }}>登录密码</label>
                                <span style={{ color: '#333' }}>••••••••</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#999', display: 'block', marginBottom: '4px' }}>账号状态</label>
                                <span style={{ color: '#52c41a' }}>● 正常</span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            style={{ width: '100%', marginTop: '20px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ff4d4f', color: '#ff4d4f', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                        >
                            退出登录
                        </button>
                    </div>
                </aside>

                {/* 右侧：活动记录 */}
                <main>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ margin: '0 0 25px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            💬 我的评论 <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: 'normal' }}>({totalComments})</span>
                        </h3>

                        <div className="comment-history" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {comments.length > 0 ? (
                                <>
                                    {comments.map(comment => (
                                        <div key={comment.id} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', transition: 'transform 0.2s', border: '1px solid transparent' }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#00b5e5'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span
                                                    onClick={() => navigate(`/post/${comment.post_id}`)}
                                                    style={{ color: '#00b5e5', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}
                                                >
                                                    📄 {comment.post_title}
                                                </span>
                                                <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(comment.created_at).toLocaleString()}</span>
                                            </div>
                                            <p style={{ margin: 0, color: '#555', lineHeight: '1.6', fontSize: '0.9rem' }}>
                                                {comment.content}
                                            </p>
                                        </div>
                                    ))}

                                    {/* 分页控制 */}
                                    {totalPages > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#ccc' : '#666' }}
                                            >
                                                上一页
                                            </button>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>第 {currentPage} / {totalPages} 页</span>
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#ccc' : '#666' }}
                                            >
                                                下一页
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                                    暂无评论记录，快去文章下发表见解吧～
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
