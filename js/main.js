/* ============================================================
   mariana.dev — 主逻辑
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 用户外链配置 ---------- */
  var USER_LINKS = {
    github: "https://github.com/MarianaBunnyJump",
    csdn: "https://blog.csdn.net/weixin_71572744"
  };

  /* ---------- 工具配置 ----------
     每个工具通过 iframe 嵌入独立项目构建产物 */
  var TOOLS = {
    markdown: { title: "Markdown 编辑器",  src: "tools/markdown/index.html" },
    wheel:    { title: "随机转盘",         src: "tools/wheel/index.html" },
    pomodoro: { title: "惜时 · 番茄钟",    src: "tools/pomodoro/index.html" },
    todo:     { title: "待办清单",         src: "tools/todo/index.html" }
  };

  var overlay = document.getElementById("toolOverlay");
  var overlayBody = document.getElementById("toolWindowBody");
  var overlayTitle = document.getElementById("toolWindowTitle");
  var currentTool = null;

  /* ============================================================
     路由与导航
     ============================================================ */
  var PAGES = ["home", "tools", "works", "about"];
  var pendingTool = null;

  function getPage() {
    var hash = location.hash.replace("#", "");
    return PAGES.indexOf(hash) !== -1 ? hash : "home";
  }

  function goPage(page) {
    PAGES.forEach(function (p) {
      var el = document.getElementById("page-" + p);
      if (el) el.classList.toggle("active", p === page);
    });
    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("active", a.dataset.page === page);
    });
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

  /* 统一处理「点击工具卡片打开工作区」 */
  document.addEventListener("click", function (e) {
    var card = e.target.closest("[data-open-tool]");
    if (!card) return;
    if (!card.closest("#toolsGrid") && !card.closest(".home-tools")) return;
    e.preventDefault();
    var tool = card.getAttribute("data-open-tool");
    if (getPage() === "tools") {
      openTool(tool);
    } else {
      pendingTool = tool;
      location.hash = "tools";
    }
  });

  window.addEventListener("hashchange", function () {
    goPage(getPage());
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
     ============================================================ */
  function openTool(name) {
    if (!TOOLS[name]) return;
    currentTool = name;
    overlayTitle.textContent = TOOLS[name].title;
    overlayBody.innerHTML = "";
    var frame = document.createElement("iframe");
    frame.className = "tool-frame";
    frame.src = TOOLS[name].src;
    frame.title = TOOLS[name].title;
    overlayBody.appendChild(frame);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeTool() {
    if (!currentTool) return;
    currentTool = null;
    overlayBody.innerHTML = "";
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("toolBack").addEventListener("click", closeTool);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closeTool();
  });

  /* ============================================================
     外链卡片配置
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
     初始化
     ============================================================ */
  document.getElementById("footerYear").textContent = new Date().getFullYear();
  applyLinks();
  goPage(getPage());
})();
