# MyBlog - 现代化的全栈个人博客系统 🚀

本项目是一个基于 **React + Node.js + MySQL** 构建的高颜值个人博客系统。它具备完整的用户体系、文章管理、图片上传以及实时评论互动功能，非常适合作为个人技术沉淀与展示的平台。

## ✨ 核心特性
- **🛡️ 完整权限流**：基于 JWT 的用户注册、登录及权限校验，保护创作安全。
- **文章实时互动**：
  - **精美文章详情**：支持渲染标准的 Markdown 内容，提供极致的阅读体验。
  - **评论系统**：支持用户实时发表及删除评论，带分页加载。
- **📝 动态创作体系**：
  - **双栏编辑器**：实时预览 Markdown 效果，支持图片一键上传。
  - **封面支持**：为每篇博文设置精美的封面图。
- **👤 个人中心**：集成个人资料展示与历史评论足迹。
- **🎨 极致视觉设计**：采用现代深色模式与卡片式布局，视觉体验高级。

## 🛠️ 技术栈
- **前端**：React, Vite, TypeScript, Axios, React-Markdown
- **后端**：Node.js, Express, Multer (图片上传), JWT
- **数据库**：MySQL

## 📂 项目结构
- `/src`: 后端核心逻辑（路由、控制器、模型）
- `/frontend`: 基于 Vite 的 React 应用
- `/public/uploads`: 本地图片存储路径

## 🚀 快速启动

### 1. 克隆并安装
```bash
git clone https://github.com/your-username/MyBlog.git
npm install
cd frontend && npm install
```

### 2. 配置数据库
在根目录创建 `.env` 文件并填入以下内容：
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=my_blog
JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=1d
```

### 3. 运行项目
```bash
# 启动后端
npm start

# 启动前端 (另开终端)
cd frontend
npm run dev
```

---
*Powered by Antigravity AI*
