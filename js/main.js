/* ============================================================
   mariana.dev — 主逻辑
   ============================================================ */
(function () {
  "use strict";

  /* ============================================================
     ★★★ 部署配置区 —— 以后只需要改这里 ★★★

     1. 应用部署到笔记本后：把对应 url 改成实际访问地址
        （局域网 http://192.168.x.x:端口，或公网域名）
     2. 要隐藏所有「需启动后端」的黄色提示：把下面的
        SHOW_BACKEND_NOTES 改成 false 即可，一次性全部隐藏
     ============================================================ */
  var SHOW_BACKEND_NOTES = true;

  var EXTERNAL_APPS = [
    {
      id: "sentinel",
      icon: "radar",
      kind: "全栈",
      title: "哨兵站 · AI 资讯监控",
      desc: "39 个数据源定时抓取、AI 相关性判定、WebSocket 实时推送，React 控制台 + 双 Android 客户端。",
      stack: "Node.js · Express · Socket.io · SQLite · React",
      tags: ["AI", "全栈", "监控"],
      url: "http://localhost:8787",
      backend: true,
      run: "sentinel-station 目录 · npm start（端口 8787）"
    },
    {
      id: "ppt",
      icon: "slides",
      kind: "全栈",
      title: "AI PPT 工作台",
      desc: "主题 / 文本 / PDF → AI 大纲 → 并发逐页生成 → 在线编辑，导出原生可编辑 PPTX（含演讲备注）。",
      stack: "FastAPI · LangGraph · React 19 · python-pptx",
      tags: ["AI", "全栈", "办公"],
      url: "http://localhost:47600",
      backend: true,
      run: "PPT_Helper 目录 · make dev-api / dev-worker / dev-web（前端 47600）"
    },
    {
      id: "labu",
      icon: "sparkles",
      kind: "全栈",
      title: "AI 修图智能体",
      desc: "一句话 AI 修图：抠图、消除、替换，LangGraph 编排 + SAM / rembg，画布式编辑器。",
      stack: "FastAPI · LangGraph · React · react-konva",
      tags: ["AI", "全栈", "图像"],
      url: "http://localhost:7302",
      backend: true,
      run: "backend 目录 · uvicorn（端口 7302）+ docker compose 依赖"
    },
    {
      id: "wxlearn",
      icon: "book",
      kind: "全栈",
      title: "AI 闯关学习",
      desc: "想学什么，AI 出题闯关：游戏化答题、AI 复盘报告、错题本与徽章，小程序 + H5 双端。",
      stack: "Taro · React · FastAPI · MySQL",
      tags: ["AI", "全栈", "学习"],
      url: "http://localhost:10086",
      backend: true,
      run: "server 目录 · uvicorn（端口 8000）+ miniapp 目录起 H5"
    },
    {
      id: "protocol",
      icon: "download",
      kind: "全栈",
      title: "协传 · 视频下载器",
      desc: "yt-dlp 支持 1800+ 平台，抖音无水印，AI 总结 / 思维导图，账号与 VIP 体系。",
      stack: "Vue 3 · FastAPI · yt-dlp · SQLite",
      tags: ["工具", "下载"],
      url: "http://localhost:8000",
      backend: true,
      run: "backend 目录 · uvicorn（端口 8000，前后端同端口）"
    },
    {
      id: "uselesstools",
      icon: "smile",
      kind: "小程序",
      kindClass: "green",
      title: "趣工局 · 微信小程序",
      desc: "已上线的解压小工具合集：情绪粉碎机、人生倒计时、白噪音、电子木鱼、借口生成器、决策转盘。",
      stack: "Taro 4 · TypeScript · NutUI",
      tags: ["娱乐", "移动端"],
      url: "https://github.com/MarianaBunnyJump/UselessTools",
      backend: false,
      run: ""
    }
  ];

  /* ---------- 用户外链配置 ---------- */
  var USER_LINKS = {
    github: "https://github.com/MarianaBunnyJump",
    csdn: "https://blog.csdn.net/weixin_71572744"
  };

  /* ---------- 站内工具配置 ----------
     每个工具通过 iframe 嵌入独立项目构建产物 */
  var TOOLS = {
    markdown: { title: "Markdown 编辑器",  src: "tools/markdown/index.html", tags: ["效率", "写作"] },
    wheel:    { title: "随机转盘",         src: "tools/wheel/index.html",    tags: ["娱乐", "决策"] },
    pomodoro: { title: "惜时 · 番茄钟",    src: "tools/pomodoro/index.html", tags: ["效率", "专注"] },
    todo:     { title: "待办清单",         src: "tools/todo/index.html",     tags: ["效率", "待办"] }
  };

  /* ---------- 描边图标库（viewBox 24 · 统一笔画） ---------- */
  var ICONS = {
    radar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l6.3-6.3"/></svg>',
    slides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>',
    smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>'
  };

  function icon(name) {
    return ICONS[name] || ICONS.radar;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============================================================
     用户数据层：卡片覆盖配置 / 自定义应用（localStorage 持久化）
     覆盖配置让「编辑模式」改的名称、描述、链接不用动代码；
     自定义应用让任何链接都能临时挂进工具箱，无需重新发版。
     ============================================================ */
  var OVERRIDES_KEY = "mariana-card-overrides";
  var CUSTOM_KEY = "mariana-custom-apps";
  var cardOverrides = loadStore(OVERRIDES_KEY, {});
  var customApps = loadStore(CUSTOM_KEY, []);

  function loadStore(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v && typeof v === "object" ? v : fallback;
    } catch (e) { return fallback; }
  }

  function saveStore(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function getOverride(id) { return cardOverrides[id] || null; }

  /* 应用覆盖后的展示数据（不改动原配置对象） */
  function eff(app) {
    var o = cardOverrides[app.id];
    if (!o) return app;
    var out = {};
    for (var k in app) out[k] = app[k];
    if (o.title) out.title = o.title;
    if (o.desc) out.desc = o.desc;
    if (o.url) out.url = o.url;
    return out;
  }

  function toolTitle(name) {
    var o = getOverride(name);
    return (o && o.title) || TOOLS[name].title;
  }

  function normUrl(v, fallback) {
    v = (v || "").trim();
    if (!v) return fallback || "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    return v;
  }

  /* ---------- 全局 Toast ---------- */
  var toastEl = null;
  var toastTimer = null;

  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  var overlay = document.getElementById("toolOverlay");
  var overlayBody = document.getElementById("toolWindowBody");
  var overlayTitle = document.getElementById("toolWindowTitle");
  var currentTool = null;

  /* ============================================================
     外观设置（皮肤：深海 / 暗夜 / 浅色 · 主题色 · 背景网格）
     存储：localStorage["mariana-site-settings"]
     ============================================================ */
  var SETTINGS_KEY = "mariana-site-settings";
  var ACCENTS = ["sea", "teal", "blue", "violet", "rose", "amber", "green"];
  var DEFAULT_SETTINGS = { theme: "ocean", accent: "sea", noGrid: false, editMode: false };
  var settings = loadSettings();

  function loadSettings() {
    var base = {};
    for (var k in DEFAULT_SETTINGS) base[k] = DEFAULT_SETTINGS[k];
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          if (saved.theme === "ocean" || saved.theme === "dark" || saved.theme === "light") base.theme = saved.theme;
          if (ACCENTS.indexOf(saved.accent) !== -1) base.accent = saved.accent;
          base.noGrid = saved.noGrid === true;
          base.editMode = saved.editMode === true;
        }
      }
    } catch (e) {}
    return base;
  }

  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
  }

  function applySettings() {
    var root = document.documentElement;
    root.setAttribute("data-theme", settings.theme);
    root.setAttribute("data-accent", settings.accent);
    root.classList.toggle("no-grid", settings.noGrid);

    document.querySelectorAll("[data-set-theme]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-set-theme") === settings.theme);
    });
    document.querySelectorAll("[data-set-accent]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-set-accent") === settings.accent);
    });
    var gs = document.getElementById("gridSwitch");
    if (gs) {
      gs.setAttribute("aria-checked", settings.noGrid ? "false" : "true");
    }
    var es = document.getElementById("editSwitch");
    if (es) {
      es.setAttribute("aria-checked", settings.editMode ? "true" : "false");
    }
    document.body.classList.toggle("edit-mode", settings.editMode === true);
  }

  var settingsPop = document.getElementById("settingsPop");
  var settingsBtn = document.getElementById("navSettings");

  function toggleSettings(open) {
    var willOpen = typeof open === "boolean" ? open : settingsPop.hidden;
    settingsPop.hidden = !willOpen;
    settingsBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    settingsBtn.classList.toggle("active", willOpen);
  }

  if (settingsBtn && settingsPop) {
    settingsBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleSettings();
    });
    document.addEventListener("click", function (e) {
      if (!settingsPop.hidden &&
          !e.target.closest("#settingsPop") &&
          !e.target.closest("#navSettings")) {
        toggleSettings(false);
      }
    });

    document.querySelectorAll("[data-set-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        settings.theme = btn.getAttribute("data-set-theme");
        saveSettings();
        applySettings();
      });
    });
    document.querySelectorAll("[data-set-accent]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        settings.accent = btn.getAttribute("data-set-accent");
        saveSettings();
        applySettings();
      });
    });
    document.getElementById("gridSwitch").addEventListener("click", function () {
      settings.noGrid = !settings.noGrid;
      saveSettings();
      applySettings();
    });
    document.getElementById("editSwitch").addEventListener("click", function () {
      settings.editMode = !settings.editMode;
      saveSettings();
      applySettings();
      showToast(settings.editMode ? "编辑模式已开启：卡片右上角出现 ✎" : "编辑模式已关闭");
    });
    document.getElementById("settingsReset").addEventListener("click", function () {
      settings = {};
      for (var k in DEFAULT_SETTINGS) settings[k] = DEFAULT_SETTINGS[k];
      saveSettings();
      applySettings();
    });
  }

  applySettings();

  /* ============================================================
     路由与导航（History API · 路径式 URL，SEO 友好）
     /  /games  /tools  /about   旧 hash 地址自动兼容
     ============================================================ */
  var PAGES = ["home", "games", "tools", "about"];
  var PAGE_PATHS = { home: "/", games: "/games", tools: "/tools", about: "/about" };
  var PATH_PAGES = { "/": "home", "/games": "games", "/tools": "tools", "/about": "about" };
  var PAGE_TITLES = {
    home: "Mariana · 游戏开发 × 全栈作品集",
    games: "游戏作品 · Mariana",
    tools: "日常工具 · Mariana",
    about: "关于我 · Mariana"
  };
  var PAGE_DESCRIPTIONS = {
    home: "Mariana 的个人网站 —— Unity / VR / 桌面游戏作品，与 10+ 独立开发的全栈工具，全部真实可体验。",
    games: "游戏作品集：Unity VR 交互项目、CPU Racer 桌面竞速、猫猫卡牌 TCG 对战与 Kitchen Party 派对烹饪。",
    tools: "日常工具箱：4 个点开即用的站内工具（Markdown 编辑器 / 随机转盘 / 番茄钟 / 待办清单）与 6 个独立部署的全栈应用。",
    about: "关于 Mariana：游戏开发 × 全栈，技能栈、项目经历与联系方式，正在寻找游戏开发 / 全栈方向的机会。"
  };
  /* 旧地址兼容：#works -> #games */
  var LEGACY_PAGES = { works: "games" };
  var pendingTool = null;
  var IS_FILE = location.protocol === "file:";

  function getPage() {
    var path = location.pathname.replace(/\/+$/, "") || "/";
    if (PATH_PAGES[path]) return PATH_PAGES[path];
    var hash = location.hash.replace("#", "");
    if (LEGACY_PAGES[hash]) return LEGACY_PAGES[hash];
    return PAGES.indexOf(hash) !== -1 ? hash : "home";
  }

  /* 页内跳转：优先 pushState；file:// 下退回 hash */
  function navigate(page) {
    var path = PAGE_PATHS[page] || "/";
    var done = false;
    if (!IS_FILE && window.history && history.pushState) {
      try { history.pushState({}, "", path); done = true; } catch (e) {}
    }
    if (!done) {
      location.hash = "#" + page;
    }
    goPage(page);
  }

  function goPage(page) {
    PAGES.forEach(function (p) {
      var el = document.getElementById("page-" + p);
      if (el) el.classList.toggle("active", p === page);
    });
    document.querySelectorAll(".nav-link").forEach(function (a) {
      var isActive = a.dataset.page === page;
      a.classList.toggle("active", isActive);
      if (isActive) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
    if (PAGE_TITLES[page]) document.title = PAGE_TITLES[page];
    if (PAGE_DESCRIPTIONS[page]) {
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", PAGE_DESCRIPTIONS[page]);
    }
    document.getElementById("navLinks").classList.remove("open");
    document.getElementById("navBurger").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    closeTool();
    if (page === "tools" && pendingTool) {
      var t = pendingTool;
      pendingTool = null;
      setTimeout(function () { openTool(t); }, 30);
    }
  }

  /* 拦截页内导航链接（data-nav），走 History API */
  document.addEventListener("click", function (e) {
    var nav = e.target.closest("[data-nav]");
    if (!nav) return;
    var href = nav.getAttribute("href") || "";
    var page = PATH_PAGES[href.replace(/\/+$/, "") || "/"];
    if (!page) return;
    e.preventDefault();
    navigate(page);
  });

  /* 浏览器前进/后退（也覆盖旧的 #hash 变化）：
     工具打开时返回 = 关闭工具并停留在当前页 */
  window.addEventListener("popstate", function () {
    if (currentTool) closeTool(true);
    goPage(getPage());
  });

  /* 统一处理「点击工具卡片打开工作区」；
     .tool-ext 是「新窗口打开」按钮，交给浏览器默认行为 */
  document.addEventListener("click", function (e) {
    if (e.target.closest(".tool-ext") || e.target.closest(".tool-edit")) return;
    var card = e.target.closest("[data-open-tool]");
    if (!card) return;
    e.preventDefault();
    openTool(card.getAttribute("data-open-tool"));
  });

  /* div 卡片的键盘可达性（Enter / 空格） */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var card = e.target.closest ? e.target.closest('[data-open-tool][role="button"]') : null;
    if (!card) return;
    e.preventDefault();
    openTool(card.getAttribute("data-open-tool"));
  });

  /* 移动端菜单 */
  var burger = document.getElementById("navBurger");
  burger.addEventListener("click", function () {
    var links = document.getElementById("navLinks");
    var open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ============================================================
     工具工作区（iframe 嵌入）
     打开时 pushState 占一条历史：浏览器/手势返回 = 关闭工具
     而不是退出整站（移动端高频诉求）
     ============================================================ */
  var popSuppress = false;

  function openTool(name) {
    if (!TOOLS[name]) return;
    var wasOpen = !!currentTool;
    currentTool = name;
    overlayTitle.textContent = toolTitle(name);
    overlayBody.innerHTML = "";
    var frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.src = TOOLS[name].src;
    frame.title = toolTitle(name);
    frame.setAttribute("allow", "clipboard-write");
    overlayBody.appendChild(frame);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    if (!IS_FILE && window.history && history.pushState) {
      try {
        if (wasOpen) {
          history.replaceState({ tool: name }, "");
        } else {
          history.pushState({ tool: name }, "");
        }
      } catch (e) {}
    }
  }

  function closeTool(fromPop) {
    if (!currentTool) return;
    currentTool = null;
    overlayBody.innerHTML = "";
    overlay.hidden = true;
    document.body.style.overflow = "";
    /* 非返回键触发的关闭：把占用的历史条目弹掉，避免「返回一次没反应」 */
    if (!fromPop && !IS_FILE && window.history && history.back &&
        history.state && history.state.tool) {
      popSuppress = true;
      history.back();
    }
  }

  document.getElementById("toolBack").addEventListener("click", function () { closeTool(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (typeof cmdk !== "undefined" && cmdk && !cmdk.hidden) { cmdkClose(); return; }
    if (typeof editModal !== "undefined" && editModal && !editModal.hidden) { closeEdit(); return; }
    if (settingsPop && !settingsPop.hidden) { toggleSettings(false); return; }
    if (!overlay.hidden) closeTool();
  });

  /* ============================================================
     全栈应用卡片渲染（数据来自顶部 EXTERNAL_APPS + 用户自定义）
     每张卡带 data-id / data-tags / data-text，供搜索与标签筛选
     ============================================================ */
  function findApp(id) {
    for (var i = 0; i < EXTERNAL_APPS.length; i++) {
      if (EXTERNAL_APPS[i].id === id) return EXTERNAL_APPS[i];
    }
    return null;
  }

  function findCustom(id) {
    for (var i = 0; i < customApps.length; i++) {
      if (customApps[i].id === id) return customApps[i];
    }
    return null;
  }

  function cardMeta(app, kind) {
    var tags = app.tags || (kind === "custom" ? ["自定义"] : []);
    return {
      id: app.id,
      kind: kind,
      tags: tags.join("|"),
      text: (app.title + " " + app.desc + " " + (app.stack || "") + " " + tags.join(" ")).toLowerCase()
    };
  }

  function buildExtCard(app, kind) {
    var m = cardMeta(app, kind);
    var kindCls = app.kindClass ? " " + app.kindClass : "";
    var note = "";
    if (app.backend && SHOW_BACKEND_NOTES) {
      note = '<div class="tool-backend-note"><b>⚠ 需启动后端</b>' + esc(app.run) + "</div>";
    }
    return (
      '<a class="tool-card" href="' + esc(app.url) + '" target="_blank" rel="noopener"' +
        ' data-id="' + esc(m.id) + '" data-kind="' + kind + '"' +
        ' data-tags="' + esc(m.tags) + '" data-text="' + esc(m.text) + '">' +
        '<div class="tool-top">' +
          '<div class="tool-ic">' + icon(app.icon) + "</div>" +
          '<span class="tool-kind' + kindCls + '">' + esc(app.kind || (kind === "custom" ? "自定义" : "应用")) + "</span>" +
        "</div>" +
        "<h3>" + esc(app.title) + "</h3>" +
        '<p class="tool-desc">' + esc(app.desc) + "</p>" +
        '<span class="tool-stack">' + esc(app.stack) + "</span>" +
        note +
        '<span class="tool-go">打开应用 <span class="ar">→</span></span>' +
        '<button class="tool-edit" type="button" title="编辑卡片" aria-label="编辑卡片">✎</button>' +
      "</a>"
    );
  }

  function renderExternalTools() {
    var grid = document.getElementById("extToolsGrid");
    if (!grid) return;
    var html = EXTERNAL_APPS.map(function (raw) { return buildExtCard(eff(raw), "app"); }).join("");
    html += customApps.map(function (app) { return buildExtCard(app, "custom"); }).join("");
    html += '<div class="tool-card tool-add-card" role="button" tabindex="0">' +
              '<span class="tool-add-plus">+</span> 添加自定义应用' +
            "</div>";
    grid.innerHTML = html;
    grid.querySelectorAll(".tool-add-card").forEach(function (el) {
      el.addEventListener("click", function () { openEdit(null, "custom"); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEdit(null, "custom"); }
      });
    });
    buildTagChips();
    applyToolFilter();
  }

  /* ---------- 站内工具静态卡片：补数据属性 + 编辑按钮 + 应用覆盖 ---------- */
  function prepSiteToolCards() {
    document.querySelectorAll("[data-open-tool]").forEach(function (card) {
      var id = card.getAttribute("data-open-tool");
      if (!TOOLS[id]) return;
      card.setAttribute("data-id", id);
      card.setAttribute("data-kind", "tool");
      card.setAttribute("data-tags", (TOOLS[id].tags || []).join("|"));
      card.insertAdjacentHTML("beforeend",
        '<button class="tool-edit" type="button" title="编辑卡片" aria-label="编辑卡片">✎</button>');
    });
    applySiteToolOverrides();
  }

  function applySiteToolOverrides() {
    document.querySelectorAll("[data-open-tool]").forEach(function (card) {
      var id = card.getAttribute("data-open-tool");
      if (!TOOLS[id]) return;
      var o = getOverride(id);
      var h = card.querySelector("h3");
      var p = card.querySelector("p");
      if (o && o.title && h) h.textContent = o.title;
      if (o && o.desc && p) p.textContent = o.desc;
      if (h && p) {
        card.setAttribute("data-text",
          (h.textContent + " " + p.textContent + " " + (TOOLS[id].tags || []).join(" ")).toLowerCase());
      }
    });
  }

  /* ---------- 搜索 + 标签筛选（两组卡片共用） ---------- */
  var toolSearchState = { q: "", tags: [] };

  function buildTagChips() {
    var box = document.getElementById("toolTags");
    if (!box) return;
    var tags = [];
    var seen = {};
    function add(t) { if (t && !seen[t]) { seen[t] = 1; tags.push(t); } }
    Object.keys(TOOLS).forEach(function (k) { (TOOLS[k].tags || []).forEach(add); });
    EXTERNAL_APPS.forEach(function (a) { (a.tags || []).forEach(add); });
    customApps.forEach(function (a) { (a.tags || []).forEach(add); });

    box.innerHTML = "";
    var chips = [{ label: "全部", isAll: true }].concat(tags.map(function (t) { return { label: t, isAll: false }; }));
    chips.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tag-chip" + (c.isAll
        ? (toolSearchState.tags.length === 0 ? " active" : "")
        : (toolSearchState.tags.indexOf(c.label) !== -1 ? " active" : ""));
      b.textContent = c.label;
      b.addEventListener("click", function () {
        if (c.isAll) {
          toolSearchState.tags = [];
        } else {
          var i = toolSearchState.tags.indexOf(c.label);
          if (i === -1) toolSearchState.tags.push(c.label);
          else toolSearchState.tags.splice(i, 1);
        }
        buildTagChips();
        applyToolFilter();
      });
      box.appendChild(b);
    });
  }

  function applyToolFilter() {
    var q = toolSearchState.q.trim().toLowerCase();
    var sel = toolSearchState.tags;
    var anyVisible = false;
    document.querySelectorAll("#siteToolsGrid .tool-card, #extToolsGrid .tool-card").forEach(function (card) {
      if (card.classList.contains("tool-add-card")) return;
      var okQ = !q || (card.getAttribute("data-text") || "").indexOf(q) !== -1;
      var cardTags = (card.getAttribute("data-tags") || "").split("|").filter(Boolean);
      var okT = !sel.length || sel.some(function (t) { return cardTags.indexOf(t) !== -1; });
      var show = okQ && okT;
      card.style.display = show ? "" : "none";
      if (show) anyVisible = true;
    });
    var empty = document.getElementById("toolsEmpty");
    if (empty) empty.hidden = anyVisible;
  }

  function initToolsToolbar() {
    var input = document.getElementById("toolSearch");
    if (input) {
      input.addEventListener("input", function () {
        toolSearchState.q = input.value;
        applyToolFilter();
      });
    }
  }

  /* 首页优选作品里的外链卡片：填 url + 提示备注 */
  function applyExternalLinks() {
    document.querySelectorAll("[data-ext-link]").forEach(function (el) {
      var app = findApp(el.getAttribute("data-ext-link"));
      if (app) el.setAttribute("href", app.url);
    });
    document.querySelectorAll("[data-ext-note]").forEach(function (el) {
      var app = findApp(el.getAttribute("data-ext-note"));
      if (app && app.backend && SHOW_BACKEND_NOTES) {
        el.textContent = "⚠ 需启动后端 · " + app.run;
        el.hidden = false;
      }
    });
  }

  /* ============================================================
     外链卡片配置（GitHub / CSDN）
     ============================================================ */
  function applyLinks() {
    var github = USER_LINKS.github;
    var csdn = USER_LINKS.csdn;
    var pairs = [
      [github, ["linkGithubCard", "linkGithubCard2"]],
      [csdn, ["linkCsdnCard", "linkCsdnCard2"]]
    ];
    pairs.forEach(function (pair) {
      var url = pair[0];
      var ids = pair[1];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (url) {
          el.setAttribute("href", url);
        } else {
          el.style.display = "none";
        }
      });
    });
  }

  /* ============================================================
     编辑模式弹窗：改卡片名称 / 描述 / 链接，增删自定义应用
     ============================================================ */
  var editModal = document.getElementById("editModal");
  var editName = document.getElementById("editName");
  var editDesc = document.getElementById("editDesc");
  var editUrl = document.getElementById("editUrl");
  var editUrlField = document.getElementById("editUrlField");
  var editingId = null;    /* null = 新建自定义应用 */
  var editingKind = null;  /* "tool" | "app" | "custom" */

  function openEdit(id, kind) {
    if (!editModal) return;
    editingId = id;
    editingKind = kind;
    var data = { title: "", desc: "", url: "" };

    if (id === null) {
      data = { title: "", desc: "", url: "" };
    } else if (kind === "tool") {
      var o = getOverride(id);
      var card = document.querySelector('[data-open-tool="' + id + '"]');
      var baseP = card ? card.querySelector("p") : null;
      data.title = (o && o.title) || TOOLS[id].title;
      data.desc = (o && o.desc) || (baseP ? baseP.textContent : "");
    } else {
      var base = kind === "custom" ? findCustom(id) : findApp(id);
      if (!base) return;
      var ov = getOverride(id);
      data.title = (ov && ov.title) || base.title;
      data.desc = (ov && ov.desc) || base.desc;
      data.url = (ov && ov.url) || base.url;
    }

    document.getElementById("editModalTitle").textContent =
      id === null ? "添加自定义应用" : "编辑卡片";
    editName.value = data.title;
    editDesc.value = data.desc;
    editUrl.value = data.url;
    editUrlField.hidden = kind === "tool";           /* 站内工具没有可改的外链 */
    document.getElementById("editDelete").hidden = kind !== "custom" || id === null;
    document.getElementById("editReset").hidden = id === null || kind === "custom";
    editModal.hidden = false;
    editName.focus();
  }

  function closeEdit() {
    if (!editModal) return;
    editModal.hidden = true;
    editingId = null;
    editingKind = null;
  }

  function saveEdit() {
    var title = editName.value.trim();
    var desc = editDesc.value.trim();
    if (!title) { showToast("名称不能为空"); return; }

    if (editingId === null) {
      var url = normUrl(editUrl.value, "");
      if (!url) { showToast("请填写链接地址"); return; }
      customApps.push({
        id: "custom-" + Date.now(),
        icon: "smile",
        kind: "自定义",
        kindClass: "green",
        title: title,
        desc: desc || "自定义应用",
        stack: "",
        tags: ["自定义"],
        url: url,
        backend: false
      });
      saveStore(CUSTOM_KEY, customApps);
      renderExternalTools();
      showToast("已添加「" + title + "」");
    } else if (editingKind === "custom") {
      var app = findCustom(editingId);
      if (app) {
        app.title = title;
        app.desc = desc;
        app.url = normUrl(editUrl.value, app.url);
      }
      saveStore(CUSTOM_KEY, customApps);
      renderExternalTools();
      showToast("已保存");
    } else {
      var ov = cardOverrides[editingId] || {};
      ov.title = title;
      ov.desc = desc;
      if (editingKind === "app" && editUrl.value.trim()) ov.url = normUrl(editUrl.value, "");
      cardOverrides[editingId] = ov;
      saveStore(OVERRIDES_KEY, cardOverrides);
      applySiteToolOverrides();
      renderExternalTools();
      showToast("已保存，刷新后依然生效");
    }
    closeEdit();
  }

  function resetEdit() {
    if (!editingId) return;
    delete cardOverrides[editingId];
    saveStore(OVERRIDES_KEY, cardOverrides);
    applySiteToolOverrides();
    renderExternalTools();
    closeEdit();
    showToast("已还原为默认内容");
  }

  function deleteEdit() {
    if (editingKind !== "custom" || !editingId) return;
    customApps = customApps.filter(function (a) { return a.id !== editingId; });
    saveStore(CUSTOM_KEY, customApps);
    renderExternalTools();
    closeEdit();
    showToast("已删除自定义应用");
  }

  /* 编辑按钮（事件委托，覆盖动态渲染的卡片） */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".tool-edit");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var card = btn.closest(".tool-card");
    if (!card) return;
    var id = card.getAttribute("data-id") || card.getAttribute("data-open-tool");
    var kind = card.getAttribute("data-kind") || "tool";
    if (id) openEdit(id, kind);
  });

  function initEditModal() {
    if (!editModal) return;
    document.getElementById("editSave").addEventListener("click", saveEdit);
    document.getElementById("editReset").addEventListener("click", resetEdit);
    document.getElementById("editDelete").addEventListener("click", deleteEdit);
    document.getElementById("editCancel").addEventListener("click", closeEdit);
    editModal.addEventListener("click", function (e) {
      if (e.target === editModal) closeEdit();
    });
  }

  /* ============================================================
     Ctrl+K 快速导航命令面板
     索引：页面 / 站内工具 / 全栈应用与自定义 / 常用设置动作
     ============================================================ */
  var cmdk = document.getElementById("cmdk");
  var cmdkInput = document.getElementById("cmdkInput");
  var cmdkList = document.getElementById("cmdkList");
  var cmdkItems = [];
  var cmdkActive = 0;
  var PAGE_NAMES = { home: "首页", games: "游戏作品", tools: "日常工具", about: "关于" };

  function buildCmdkIndex() {
    var items = [];
    PAGES.forEach(function (p) {
      items.push({
        label: PAGE_NAMES[p],
        hint: "页面",
        run: function () { if (getPage() === p) goPage(p); else navigate(p); }
      });
    });
    Object.keys(TOOLS).forEach(function (id) {
      items.push({
        label: toolTitle(id),
        hint: "站内工具",
        kw: TOOLS[id].tags ? TOOLS[id].tags.join(" ") : "",
        run: function () { openTool(id); }
      });
    });
    EXTERNAL_APPS.forEach(function (raw) {
      var app = eff(raw);
      items.push({
        label: app.title,
        hint: "应用",
        kw: app.desc + " " + (app.tags || []).join(" "),
        run: function () { window.open(app.url, "_blank", "noopener"); }
      });
    });
    customApps.forEach(function (app) {
      items.push({
        label: app.title,
        hint: "自定义",
        kw: app.desc || "",
        run: function () { window.open(app.url, "_blank", "noopener"); }
      });
    });
    ["ocean", "dark", "light"].forEach(function (t) {
      var names = { ocean: "深海皮肤", dark: "暗夜皮肤", light: "浅色皮肤" };
      items.push({
        label: "切换到" + names[t],
        hint: "设置",
        run: function () {
          settings.theme = t;
          saveSettings();
          applySettings();
          showToast("已切换到" + names[t]);
        }
      });
    });
    items.push({
      label: "打开外观设置",
      hint: "设置",
      run: function () { toggleSettings(true); }
    });
    return items;
  }

  function cmdkOpen() {
    if (!cmdk) return;
    cmdk.hidden = false;
    cmdkInput.value = "";
    cmdkRender("");
    setTimeout(function () { cmdkInput.focus(); }, 0);
  }

  function cmdkClose() {
    if (cmdk) cmdk.hidden = true;
  }

  function cmdkRender(q) {
    q = q.trim().toLowerCase();
    var all = buildCmdkIndex();
    cmdkItems = all.filter(function (it) {
      if (!q) return true;
      return ((it.label + " " + (it.kw || "") + " " + it.hint).toLowerCase().indexOf(q) !== -1);
    }).slice(0, 9);
    cmdkActive = 0;
    cmdkList.innerHTML = "";
    if (!cmdkItems.length) {
      var li = document.createElement("li");
      li.className = "cmdk-empty";
      li.textContent = "没有匹配项";
      cmdkList.appendChild(li);
      return;
    }
    cmdkItems.forEach(function (it, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      if (i === cmdkActive) li.classList.add("active");
      var label = document.createElement("span");
      label.textContent = it.label;
      var hint = document.createElement("span");
      hint.className = "cmdk-hint";
      hint.textContent = it.hint;
      li.appendChild(label);
      li.appendChild(hint);
      li.addEventListener("mouseenter", function () { cmdkSetActive(i); });
      li.addEventListener("click", function () { cmdkRun(i); });
      cmdkList.appendChild(li);
    });
  }

  function cmdkSetActive(i) {
    cmdkActive = i;
    cmdkList.querySelectorAll("li").forEach(function (li, j) {
      li.classList.toggle("active", j === i);
    });
  }

  function cmdkRun(i) {
    var it = cmdkItems[i];
    cmdkClose();
    if (it) it.run();
  }

  function initCmdk() {
    if (!cmdk) return;
    cmdkInput.addEventListener("input", function () { cmdkRender(cmdkInput.value); });
    cmdkInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (cmdkItems.length) cmdkSetActive((cmdkActive + 1) % cmdkItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdkItems.length) cmdkSetActive((cmdkActive - 1 + cmdkItems.length) % cmdkItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        cmdkRun(cmdkActive);
      }
    });
    cmdk.addEventListener("click", function (e) {
      if (e.target === cmdk) cmdkClose();
    });
    var btn = document.getElementById("navSearch");
    if (btn) btn.addEventListener("click", cmdkOpen);
  }

  /* Ctrl/Cmd + K 唤起命令面板 */
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (cmdk && !cmdk.hidden) cmdkClose();
      else cmdkOpen();
    }
  });

  /* ============================================================
     滚动揭示
     ============================================================ */
  function observeReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     初始化
     ============================================================ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  prepSiteToolCards();
  renderExternalTools();
  applyExternalLinks();
  applyLinks();
  initToolsToolbar();
  initEditModal();
  initCmdk();
  goPage(getPage());
  observeReveal();

  /* ============================================================
     PWA：Service Worker 注册（https 或 localhost 下生效）
     ============================================================ */
  if ("serviceWorker" in navigator &&
      (location.protocol === "https:" ||
       location.hostname === "localhost" ||
       location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
