import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import PostDetail from '../pages/PostDetail';
import Write from '../pages/Write';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

const AppRouter: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* 公开路由 */}
                        <Route index element={<Home />} />
                        <Route path="post/:id" element={<PostDetail />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />

                        {/* 需要登录的路由 */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="write" element={<Write />} />
                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default AppRouter;
