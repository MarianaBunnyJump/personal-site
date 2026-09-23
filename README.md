# 🐱 Mariana's Personal Site

> 游戏开发 × 全栈 —— 个人求职作品集 + 自研工具箱

纯静态主站，全栈应用部署在自己的服务器（闲置笔记本）上。

🌐 **在线访问：** [https://mariana.nikangd5300.workers.dev](https://mariana.nikangd5300.workers.dev)（Cloudflare Workers 静态托管，push 到 GitHub 自动部署）

---

## ✨ 网站结构

| 页面 | 内容 |
|---|---|
| 🏠 首页 | 个人价值主张、优势、优选作品（4 个）、GitHub / CSDN |
| 🎮 游戏作品 | Unity VR、CPU Racer、猫猫卡牌 TCG、Kitchen Party |
| 🛠️ 日常工具 | 站内工具（点开即用）+ 全栈应用（独立部署，点击直达） |
| 👋 关于 | 技能栈、更多项目经历、联系方式 |

## 🛠️ 站内工具（点开即用）

全部自己开发，以 iframe 嵌入主站，数据存在浏览器本地：

| 工具 | 简介 |
|---|---|
| 📝 **Markdown 编辑器** | 实时预览、代码高亮、大纲导航、自动保存 |
| 🎯 **随机转盘** | 多方案管理、权重设置、配色主题、导入导出 |
| ✓ **待办清单** | 优先级、标签、Excel/JSON 导入导出、筛选排序 |
| 🍅 **惜时 · 番茄钟** | 正倒计时、10 套配色、勋章系统、专注日历 |

## 🚀 全栈应用（独立部署）

全部独立完成，部署后从「日常工具」页点击直达。**链接与提示统一在 [js/main.js](js/main.js) 顶部的「部署配置区」维护：**

| 应用 | 仓库位置 | 启动方式 | 端口 |
|---|---|---|---|
| 🛰️ 哨兵站 · AI 资讯监控 | `E:\13_AIPrj\Android_InfoGet\sentinel-station` | `npm start` | 8787 |
| 📊 AI PPT 工作台 | `E:\13_AIPrj\PPT_Helper` | `make dev-api` + `make dev-worker` + `make dev-web` | 47600 |
| 🪄 AI 修图智能体 | `E:\13_AIPrj\LabuLabuTV` | `docker compose up -d` + `uvicorn` | 7302 |
| 🧠 AI 闯关学习 | `E:\13_AIPrj\WxAILearn` | `uvicorn`（后端）+ Taro H5 | 8000 |
| 📥 协传 · 视频下载器 | `E:\13_AIPrj\protocol-video-downloader` | `uvicorn main:app` | 8000 |
| 🐟 趣工局 · 微信小程序 | [GitHub/UselessTools](https://github.com/MarianaBunnyJump/UselessTools) | 无需后端（小程序） | — |

### 部署架构：前端 Vercel + 后端家里老电脑

```
简历上的链接 → Vercel（主站，全球 CDN，24h 在线）
                  └── 日常工具页里的「全栈应用」卡片 → 家里老电脑（frp/Cloudflare Tunnel 穿透）
```

#### 第一步：前端上 Vercel

1. 把本仓库 push 到 GitHub（仓库已有 `vercel.json`：子页面回退 + 静态资源缓存头都已配好）。
2. [vercel.com](https://vercel.com) → Add New Project → 导入该仓库 → Framework Preset 选 **Other** → Deploy。
3. （可选但强烈建议）买个域名绑定到 Vercel 项目，替换掉 `*.vercel.app` 前缀。
4. **域名替换 checklist**（拿到正式 URL 后，全局替换 4 处旧域名）：
   - `index.html`：`canonical` / `og:url` / `og:image` / JSON-LD 里的 `url`（文件内有 ★ 注释标记）
   - `sitemap.xml`：4 个 `<loc>`（文件内有 ★ 注释标记）
   - `robots.txt`：去掉 `Sitemap:` 行的注释并替换域名
5. **上线前检查**：`js/main.js` 顶部「部署配置区」——
   - 6 个全栈应用的 `url` 改成家里老电脑的公网地址（穿透后域名或 IP:端口）
   - 后端稳定运行后把 `SHOW_BACKEND_NOTES` 改为 `false` 隐藏全部启动提示

#### 第二步：后端跑在家里老电脑

- 每个应用的启动方式见下表；建议用 pm2（Node）/ NSSM（Windows 服务）注册开机自启
- 老电脑没有公网 IP 时，用 [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)（免费、域名友好）或 frp 内网穿透，把每个应用映射成公网地址
- 地址拿到后填回 `js/main.js` 的 `EXTERNAL_APPS`

| 应用 | 仓库位置 | 启动方式 | 端口 |
|---|---|---|---|
| 🛰️ 哨兵站 · AI 资讯监控 | `E:\13_AIPrj\Android_InfoGet\sentinel-station` | `npm start` | 8787 |
| 📊 AI PPT 工作台 | `E:\13_AIPrj\PPT_Helper` | `make dev-api` + `make dev-worker` + `make dev-web` | 47600 |
| 🪄 AI 修图智能体 | `E:\13_AIPrj\LabuLabuTV` | `docker compose up -d` + `uvicorn` | 7302 |
| 🧠 AI 闯关学习 | `E:\13_AIPrj\WxAILearn` | `uvicorn`（后端）+ Taro H5 | 8000 |
| 📥 协传 · 视频下载器 | `E:\13_AIPrj\protocol-video-downloader` | `uvicorn main:app` | 8000 |
| 🐟 趣工局 · 微信小程序 | [GitHub/UselessTools](https://github.com/MarianaBunnyJump/UselessTools) | 无需后端（小程序） | — |

### 隐藏「需启动后端」提示

把 `js/main.js` 里的 `SHOW_BACKEND_NOTES` 改成 `false`，全站所有黄色提示一次性消失，无需删代码。

### 本地预览（必须走 HTTP，不要双击文件）

双击 index.html（file://）会被浏览器拦截 iframe 里的模块脚本和样式表，工具页会花屏 —— 这是浏览器安全策略，不是 bug。

```bash
# 方式 1：带 SPA 路由回退（子页面刷新不 404，推荐）
python serve.py            # → http://localhost:8899

# 方式 2：npx serve
npx serve .
```

### 给作品换真实截图（强烈建议）

游戏/作品卡片的封面现在是渐变占位块。把截图放进 `assets/covers/`，再把对应卡片的

```html
<div class="work-cover" style="--cover:...">CPU</div>
```

改成

```html
<div class="work-cover"><img src="assets/covers/cpu-racer.jpg" alt="CPU Racer 实机截图"></div>
```

即可。截图同时可以裁一份 1200×630 用作 `og-image.png`（可用 `python scripts/gen_assets.py` 重新生成默认版）。

## 🎨 技术栈

- **HTML / CSS / 原生 JavaScript**（主站，零依赖）
- **视觉皮肤系统**：默认「深海蓝白」（海面到深海渐变、等深线 Hero、胶囊导航、Unbounded 展示字体），
  可在右上角设置面板切换「暗夜 / 浅色」皮肤与 7 种主题色，选择存 localStorage
- **Vite**（番茄钟、待办清单的构建工具）
- **React + TypeScript + Tailwind**（待办清单）
- **Canvas**（转盘动画）
- **localStorage**（数据本地持久化）
- **Vercel**（前端托管，全球 CDN + 安全响应头）+ 家用老电脑（后端服务，内网穿透暴露公网）
- **Lighthouse CI**（push 到 main 自动跑性能/无障碍体检）
- **统计**：站点自称无追踪 —— index.html 底部留有 Umami/Plausible 的注释占位，需要访问统计时取消注释换成自托管地址即可

## 🚀 本地运行

```bash
python serve.py            # 推荐：带 SPA 路由回退 → http://localhost:8899
```

> ⚠️ 不要双击 index.html 用 file:// 打开 —— 工具页会因浏览器安全策略花屏。

## 📁 项目结构

```
.
├── index.html              # 主站入口（首页 / 游戏作品 / 日常工具 / 关于）
├── vercel.json             # Vercel 配置（子页面回退 + 缓存头 + 安全响应头）
├── serve.py                # 本地开发服务器（SPA 回退）
├── sw.js                   # Service Worker（PWA 离线缓存，预缓存含 4 个工具页）
├── manifest.json           # PWA 清单（可安装到桌面/手机）
├── robots.txt / sitemap.xml / 404.html
├── og-image.png            # 社交分享卡片图（1200×630）
├── icons/                  # PWA / iOS 图标集（scripts/gen_assets.py 生成）
├── scripts/gen_assets.py   # 分享图与图标生成脚本
├── lighthouserc.json       # Lighthouse CI 配置（性能/无障碍阈值）
├── .github/workflows/      # push 到 main 自动跑 Lighthouse 体检
├── assets/covers/          # 作品真实截图（自行放入）
├── css/style.css           # 主站样式（深海蓝白 / 暗夜 / 浅色三套皮肤）
├── js/main.js              # 主站逻辑 + ★部署配置区（外链 URL / 后端提示开关）
└── tools/                  # 站内工具构建产物（iframe 嵌入）
    ├── markdown/  wheel/  todo/  pomodoro/
```

## 🔗 联系

- **GitHub：** [@MarianaBunnyJump](https://github.com/MarianaBunnyJump)
- **CSDN：** [blog.csdn.net/weixin_71572744](https://blog.csdn.net/weixin_71572744)

---

Made with ❤️ by Mariana · Built in Shanghai
