/* ============================================================
   mariana.dev — Service Worker
   策略：
     · 带哈希的构建产物（tools 目录下 assets 文件）→ 缓存优先（内容不变，可长缓存）
     · HTML / 主站 css / js（?v= 手动版本号）→ 网络优先，断网回退缓存
   更新方式：改了主站文件后，把下面 CACHE 版本号 +1 即可
   ============================================================ */
var CACHE = "mariana-site-v2";

var PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/og-image.png",
  /* 4 个站内工具页面：首次访问后即可完全离线使用 */
  "/tools/markdown/index.html",
  "/tools/wheel/index.html",
  "/tools/pomodoro/index.html",
  "/tools/todo/index.html"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  var isHashedAsset = /\/tools\/[^/]+\/assets\//.test(url.pathname);
  var isStaticFile = /\.(css|js|png|jpg|jpeg|svg|webp|ico|json)(\?|$)/.test(url.pathname + url.search);

  if (isHashedAsset) {
    /* 缓存优先：带哈希的文件内容永不变化 */
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          if (res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  /* 其余（HTML / 主站静态文件）：网络优先，断网回退缓存 */
  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        return hit || caches.match("/index.html");
      });
    })
  );
});
