import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>正在加载用户信息...</div>;
    }

    if (!user) {
        // 未登录，重定向到登录页
        return <Navigate to="/login" replace />;
    }

    // 已登录，渲染子路由内容
    return <Outlet />;
};

export default ProtectedRoute;
