# Hot Money Dashboard

一个用于展示股市热点资金流向的实时数据看板。

[English](./README.en.md) | 简体中文

## 在线演示

- GitHub Pages: https://mytangyh.github.io/hot-money-dashboard/
- Cloudflare Pages: https://hot-money-dashboard.pages.dev/

## 功能特点

- 🚀 实时展示热点资金流向数据
- 📊 数据可视化展示
- 🔄 自动每5分钟刷新数据
- 💾 本地数据缓存
- 📱 响应式设计，支持移动端
- 🌐 支持多语言（中文/英文）
- 🔒 支持隐私模式
- 📸 支持数据导出和截图

## 技术栈

- React 18
- Vite 5
- Tailwind CSS
- Axios
- Zustand (状态管理)
- i18next (国际化)
- HTML2Canvas (截图功能)

## 快速开始

### 开发环境设置

1. 克隆仓库
```bash
git clone https://github.com/mytangyh/hot-money-dashboard.git
cd hot-money-dashboard
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```
应用将在 http://localhost:3000 启动

### 生产环境构建
```bash
npm run build
```

## 部署

### Docker 部署

1. 构建镜像：
```bash
docker build -t hot-money-dashboard .
```

2. 运行容器：
```bash
docker run -d -p 80:80 hot-money-dashboard
```

应用将在 http://localhost 运行

### GitHub Pages

项目已配置 GitHub Actions 自动部署：
- 推送到 `master` 分支会自动触发部署
- 部署状态可在 Actions 页面查看

### Cloudflare Pages

1. Fork 本仓库
2. 在 Cloudflare Pages 创建新项目
3. 连接你的 GitHub 仓库
4. 设置构建命令：`npm run build`
5. 设置输出目录：`dist`

## 项目结构

```
hot-money-dashboard/
├── src/
│   ├── components/    # UI组件
│   │   ├── ui/       # 基础UI组件
│   │   └── layout/   # 布局组件
│   ├── hooks/        # 自定义Hooks
│   ├── utils/        # 工具函数
│   ├── store/        # 状态管理
│   ├── i18n/         # 国际化配置
│   └── types/        # TypeScript类型
├── public/           # 静态资源
└── vite.config.js    # Vite配置
```

## 环境变量

创建 `.env.local` 文件：
```env
VITE_API_BASE_URL=https://data.10jqka.com.cn/dataapi/transaction/stock/v1/list
```

## 开发指南

### 代码风格
- 使用 ESLint 和 Prettier 保持代码风格一致
- 遵循 React Hooks 的最佳实践
- 组件采用函数式编程风格

### 提交规范
```bash
feat: 添加新特性
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 作者：mytangyh
- GitHub：[https://github.com/mytangyh](https://github.com/mytangyh)

## 致谢

- [同花顺数据](https://data.10jqka.com.cn/) - 提供数据支持
- [Tailwind CSS](https://tailwindcss.com/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
