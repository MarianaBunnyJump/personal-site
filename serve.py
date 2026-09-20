# -*- coding: utf-8 -*-
"""
本地开发服务器：带 SPA 路由回退（/games /tools /about 回退到 index.html）
用法：python serve.py  →  http://localhost:8899
（python -m http.server 不支持回退，子页面刷新会 404）
"""
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
PAGES = {"/games", "/tools", "/about"}
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path in PAGES:
            self.path = "/index.html" + ("?" + self.path.split("?", 1)[1] if "?" in self.path else "")
        return super().send_head()


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"serving {ROOT} at http://localhost:{PORT}")
    server.serve_forever()
