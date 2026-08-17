# 🐱 Mariana's Personal Site

> 一个 Unity 程序员的个人网站 —— 工具箱 + 作品集 + 关于我

纯静态个人网站，托管在腾讯 CloudStudio，公网可访问。

🌐 **在线访问：** [https://69c8c3a9f1f848f79ab4d808bd0dd850.app.workbuddy.link](https://69c8c3a9f1f848f79ab4d808bd0dd850.app.workbuddy.link)

---

## ✨ 功能

网站分 4 个页面，顶部导航切换：

| 页面 | 内容 |
|---|---|
| 🏠 首页 | 个人简介、工具箱快速入口、精选作品、外链 |
| 🛠️ 工具箱 | 4 个自有工具（见下） |
| 🎨 作品 | Unity/VR、ComfyUI、Web 项目展示 |
| 👋 关于 | 技能栈、联系方式 |

## 🛠️ 工具箱

全部是我自己开发的小工具，以 iframe 形式嵌入主站：

| 工具 | 简介 |
|---|---|
| 📝 **Markdown 编辑器**（速记） | 实时预览、代码高亮、大纲导航、自动保存 |
| 🎯 **随机转盘选择器** | 多方案管理、权重设置、配色主题、导入导出 |
| ✓ **待办清单** | 优先级、标签、Excel/JSON 导入导出、筛选排序 |
| 🍅 **惜时 · 番茄钟** | 正倒计时、10 套配色、勋章系统、专注日历 |

## 🎨 技术栈

- **HTML / CSS / 原生 JavaScript**（主站，零依赖）
- **Vite**（番茄钟、待办清单的构建工具）
- **React + TypeScript + Tailwind**（待办清单）
- **Canvas**（转盘动画）
- **localStorage**（数据本地持久化）
- **CloudStudio**（公网托管，零服务器成本）

## 📁 项目结构

```
.
├── index.html              # 主站入口
├── css/
│   └── style.css           # 主站样式
├── js/
│   └── main.js             # 主站逻辑（路由、工具加载）
└── tools/                  # 工具构建产物（iframe 嵌入）
    ├── markdown/           # Markdown 编辑器
    ├── wheel/              # 转盘选择器
    ├── todo/               # 待办清单
    └── pomodoro/           # 番茄钟
```

## 🚀 本地运行

纯静态站，任意 HTTP 服务器都能跑：

```bash
# 方式 1：Python
python -m http.server 8899

# 方式 2：Node
npx serve

# 然后浏览器打开 http://localhost:8899
```

## 🔄 部署

使用腾讯 CloudStudio 静态托管，更新流程：

```bash
# 改完代码后
git add .
git commit -m "update: 描述你的改动"
git push

# 然后用 WorkBuddy 重新部署到 CloudStudio（公网链接不变）
```

## 🔗 联系

- **GitHub：** [@MarianaBunnyJump](https://github.com/MarianaBunnyJump)
- **CSDN：** [blog.csdn.net/weixin_71572744](https://blog.csdn.net/weixin_71572744)

---

Made with ❤️ by Mariana · Built in Shanghai
