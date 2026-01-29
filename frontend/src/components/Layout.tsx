import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <header className="fixed-header">
                <div className="header-inner">
                    <div className="nav-brand">
                        <Link to="/" className="logo-text">MyBlog</Link>
                    </div>
                    <nav className="nav-menu">
                        <Link to="/">首页</Link>
                        {user && <Link to="/write">写文章</Link>}
                    </nav>
                    <div className="nav-user">
                        {user ? (
                            <div className="user-info">
                                <Link to="/profile" className="welcome-text">欢迎, {user.username}</Link>
                                <button onClick={handleLogout} className="logout-btn">退出</button>
                            </div>
                        ) : (
                            <div className="auth-links">
                                <Link to="/login">登录</Link>
                                <Link to="/register">注册</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="app-content">
                <Outlet />
            </main>

            <footer className="app-footer">
                <p>&copy; 2026 我的个人博客 · 基于 React & Node.js</p>
            </footer>

            <style>{`
                .fixed-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 60px;
                    background: #1a1a1a;
                    color: white;
                    z-index: 1000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                .header-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                }
                .logo-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #00b5e5;
                    text-decoration: none;
                }
                .nav-menu {
                    display: flex;
                    gap: 25px;
                }
                .nav-menu a {
                    color: #ccc;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: color 0.3s;
                }
                .nav-menu a:hover {
                    color: #00b5e5;
                }
                .nav-user a {
                    color: white;
                    text-decoration: none;
                    margin-left: 15px;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .welcome-text {
                    font-size: 0.9rem;
                    color: #00b5e5 !important;
                }
                .logout-btn {
                    background: none;
                    border: 1px solid #444;
                    color: #aaa;
                    padding: 4px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                .logout-btn:hover {
                    border-color: #00b5e5;
                    color: #00b5e5;
                }
            `}</style>
        </div>
    );
};

export default Layout;
