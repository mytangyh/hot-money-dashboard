# Hot Money Dashboard

一个用于展示和分析股票资金流向的实时仪表盘应用。

## 项目概述

Hot Money Dashboard 是一个基于 React 的网页应用，用于可视化展示股票市场的资金流向数据。它能够帮助投资者和分析师实时监控市场热点，跟踪主力资金动向。

### 主要功能

- 实时展示股票资金流向数据
- 按资金类型（机构、游资等）分组展示
- 支持股票数据排序和筛选
- 支持隐私模式
- 支持数据导出和截图

## 技术栈

- React 18
- Tailwind CSS
- Axios
- HTML2Canvas (用于截图功能)
- Radix UI 组件库

## 开发环境设置

1. 克隆项目
```bash
git clone [repository-url]
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

## 项目结构

```
hot-money-dashboard/
├── src/
│   ├── components/    # UI组件
│   ├── utils/         # 工具函数
│   ├── data/          # 数据文件
│   ├── App.jsx        # 应用入口
│   └── HotMoneyDashboard.jsx  # 主仪表盘组件
├── public/            # 静态资源
└── config/           # 配置文件
```

## 构建和部署

构建生产版本：
```bash
npm run build
```

构建后的文件将生成在 `build` 目录中，可以部署到任何静态文件服务器。

## 数据格式

应用期望的数据格式为 JSON，存放在 `src/data` 目录下，文件名格式为 `hot_money_YYYY-MM-DD.json`。

## 环境变量

创建 `.env` 文件并设置以下变量：
- `REACT_APP_API_URL`: API 服务器地址（如果需要）

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请提交 issue 或联系项目维护者。
