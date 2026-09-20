# -*- coding: utf-8 -*-
"""
生成站点所需的静态图像资源：
  og-image.png            1200x630  社交分享卡片（Open Graph / Twitter）
  icons/icon-192.png      192x192   PWA 图标
  icons/icon-512.png      512x512   PWA 图标
  icons/icon-maskable-512.png       PWA maskable（安全区内留白）
  icons/apple-touch-icon.png        iOS 桌面图标 180x180

用法：python scripts/gen_assets.py
"""
import math
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MSYHBD = r"C:\Windows\Fonts\msyhbd.ttc"
MSYH = r"C:\Windows\Fonts\msyh.ttc"
SEGOE = r"C:\Windows\Fonts\segoeuib.ttf"

SEA_LIGHT = (220, 235, 255)   # DCEBFF
SEA_MID = (143, 190, 255)     # 8FBEFF
SEA_BLUE = (59, 120, 240)     # 3B78F0
SEA_DEEP = (20, 67, 196)      # 1443C4
ACCENT = (43, 109, 232)       # 2B6DE8
INK = (10, 30, 60)            # 深海墨


def diag_gradient(size, stops):
    """对角渐变：stops = [(pos0..1, rgb), ...] 从左上到右下"""
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    n = len(stops) - 1
    for y in range(h):
        for x in range(0, w):
            t = (x + y) / (w + h - 2)
            for i in range(n):
                p0, c0 = stops[i]
                p1, c1 = stops[i + 1]
                if t <= p1 or i == n - 1:
                    k = 0 if p1 == p0 else min(1, max(0, (t - p0) / (p1 - p0)))
                    px[x, y] = tuple(int(c0[j] + (c1[j] - c0[j]) * k) for j in range(3))
                    break
    return img


def ring(draw, cx, cy, r, color, width):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=width)


def gen_og_image():
    W, H = 1200, 630
    img = diag_gradient((W, H), [(0, SEA_LIGHT), (0.35, SEA_MID), (0.7, SEA_BLUE), (1, SEA_DEEP)])
    d = ImageDraw.Draw(img, "RGBA")

    # 右侧等深线同心圆装饰
    cx, cy = 940, 315
    for i, r in enumerate((150, 230, 310, 390)):
        alpha = 40 + i * 22
        ring(d, cx, cy, r, (255, 255, 255, alpha), 3)
    # 核心
    d.ellipse([cx - 62, cy - 62, cx + 62, cy + 62], fill=(255, 255, 255, 235))
    f_core = ImageFont.truetype(SEGOE, 58)
    d.text((cx, cy - 2), "M", font=f_core, anchor="mm", fill=ACCENT)

    # 顶部 kicker
    f_kick = ImageFont.truetype(SEGOE, 24)
    d.text((72, 96), "OPEN TO WORK · PORTFOLIO · TOOLBOX", font=f_kick, fill=(10, 30, 60, 200))

    # 主标题
    f_title = ImageFont.truetype(MSYHBD, 92)
    d.text((66, 150), "用代码，把想法", font=f_title, fill=INK)
    d.text((66, 262), "变成能用的东西", font=f_title, fill=(255, 255, 255, 245))

    # 副标题
    f_sub = ImageFont.truetype(MSYH, 36)
    d.text((72, 402), "游戏开发 × 全栈 · 4 个游戏作品 + 10 个自研工具", font=f_sub, fill=(236, 243, 252, 255))

    # 标签胶囊
    f_tag = ImageFont.truetype(MSYH, 26)
    tags = ["Unity / C#", "XR / VR", "Web 全栈", "AI 工作流"]
    x = 72
    for t in tags:
        w = d.textlength(t, font=f_tag)
        d.rounded_rectangle([x, 486, x + w + 36, 540], radius=27,
                            fill=(255, 255, 255, 210), outline=(255, 255, 255, 120), width=2)
        d.text((x + 18, 492), t, font=f_tag, fill=INK)
        x += w + 36 + 16

    # 左下角落款
    f_sign = ImageFont.truetype(SEGOE, 22)
    d.text((72, 574), "mariana.dev", font=f_sign, fill=(255, 255, 255, 200))

    img.save(os.path.join(ROOT, "og-image.png"), optimize=True)
    print("og-image.png", img.size)


def gen_icon(size, out, maskable=False):
    """圆角渐变方块 + 白色 M；maskable 版不留透明角（整面铺满）"""
    img = diag_gradient((size, size), [(0, (59, 120, 240)), (1, SEA_DEEP)])
    if not maskable:
        mask = Image.new("L", (size, size), 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.22), fill=255)
        base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        base.paste(img, (0, 0), mask)
        img = base
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(SEGOE, int(size * (0.5 if maskable else 0.56)))
    d.text((size / 2, size / 2), "M", font=f, anchor="mm", fill=(255, 255, 255))
    img.save(out, optimize=True)
    print(os.path.basename(out), img.size)


def main():
    os.makedirs(os.path.join(ROOT, "icons"), exist_ok=True)
    gen_og_image()
    gen_icon(192, os.path.join(ROOT, "icons", "icon-192.png"))
    gen_icon(512, os.path.join(ROOT, "icons", "icon-512.png"))
    gen_icon(512, os.path.join(ROOT, "icons", "icon-maskable-512.png"), maskable=True)
    gen_icon(180, os.path.join(ROOT, "icons", "apple-touch-icon.png"))


if __name__ == "__main__":
    main()
