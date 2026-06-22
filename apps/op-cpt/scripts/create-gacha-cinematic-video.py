#!/usr/bin/env python3
"""Render The Vault Room cinematic gacha demo clip.

The source plate is generated art committed under public/media/gacha. This
script keeps the video reproducible while the live product remains a demo.
"""

from __future__ import annotations

import math
import os
import random
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "media" / "gacha"
SOURCE = OUT_DIR / "vault-gacha-cinematic-plate.png"
POSTER = OUT_DIR / "vault-gacha-cinematic-poster.jpg"
VIDEO_NO_AUDIO = OUT_DIR / "vault-gacha-cinematic-spin.noaudio.mp4"
VIDEO = OUT_DIR / "vault-gacha-cinematic-spin.mp4"

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION = 15.0
FRAMES = int(FPS * DURATION)

NAVY = (7, 24, 44)
BLUE = (13, 78, 162)
GOLD = (212, 175, 55)
CORAL = (255, 107, 91)
CREAM = (255, 247, 230)
SKY = (126, 198, 240)


def font(size: int, bold: bool = False, serif: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if serif:
        candidates.extend(
            [
                "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
                "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
            ]
        )
    candidates.extend(
        [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/HelveticaNeue.ttc",
        ]
    )
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_SERIF_BIG = font(112, bold=True, serif=True)
FONT_SERIF_MID = font(70, bold=True, serif=True)
FONT_UI_BIG = font(48, bold=True)
FONT_UI = font(33, bold=True)
FONT_UI_SMALL = font(23, bold=True)
FONT_UI_TINY = font(18, bold=True)


def ease_in_out(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def ease_out_back(x: float) -> float:
    x = max(0.0, min(1.0, x))
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2)


def cover(img: Image.Image, width: int, height: int, zoom: float = 1.0) -> Image.Image:
    src_ratio = img.width / img.height
    target_ratio = width / height
    if src_ratio > target_ratio:
        new_h = int(height * zoom)
        new_w = int(new_h * src_ratio)
    else:
        new_w = int(width * zoom)
        new_h = int(new_w / src_ratio)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - width) // 2
    top = (new_h - height) // 2
    return resized.crop((left, top, left + width, top + height))


def vignette() -> Image.Image:
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(mask)
    for r in range(0, 950, 12):
        alpha = int(255 * (r / 950) ** 1.65)
        draw.ellipse((WIDTH // 2 - r * 1.45, HEIGHT // 2 - r, WIDTH // 2 + r * 1.45, HEIGHT // 2 + r), fill=alpha)
    inv = Image.eval(mask, lambda px: 255 - px)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (*NAVY, 0))
    layer.putalpha(ImageEnhance.Contrast(inv).enhance(1.5).point(lambda px: int(px * 0.72)))
    return layer


VIGNETTE = vignette()


def draw_centered(draw: ImageDraw.ImageDraw, text: str, y: int, typeface: ImageFont.FreeTypeFont, fill, stroke=0, stroke_fill=NAVY):
    bbox = draw.textbbox((0, 0), text, font=typeface, stroke_width=stroke)
    x = (WIDTH - (bbox[2] - bbox[0])) // 2
    draw.text((x, y), text, font=typeface, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)


def rounded_panel(size: tuple[int, int], fill, outline=None, width=3, radius=28) -> Image.Image:
    panel = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=fill, outline=outline, width=width)
    return panel


def glow_circle(size: int, color, strength: float) -> Image.Image:
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(22):
        ratio = i / 21
        alpha = int(210 * strength * (1 - ratio) ** 1.8)
        r = int((size / 2) * ratio)
        d.ellipse((size // 2 - r, size // 2 - r, size // 2 + r, size // 2 + r), fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(12))


def draw_pack(draw: ImageDraw.ImageDraw, frame: Image.Image, t: float):
    charge = ease_out_back((t - 2.0) / 4.2)
    pulse = 1 + math.sin(t * 8) * 0.035
    w = int(220 * charge * pulse)
    h = int(328 * charge * pulse)
    if w <= 0 or h <= 0:
        return
    x = WIDTH // 2 - w // 2
    y = HEIGHT // 2 - h // 2 - int(8 * math.sin(t * 4))
    shadow = Image.new("RGBA", (w + 110, h + 110), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((55, 55, w + 55, h + 55), radius=28, fill=(0, 0, 0, 180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(32))
    frame.alpha_composite(shadow, (x - 55, y - 35))

    pack = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(pack)
    pd.rounded_rectangle((0, 0, w - 1, h - 1), radius=28, fill=(10, 9, 24, 238), outline=(*GOLD, 255), width=4)
    for i in range(9):
        yy = int(h * (0.08 + i * 0.095))
        pd.line((18, yy, w - 18, yy + int(math.sin(i) * 20)), fill=(92, 34, 154, 120), width=max(2, w // 58))
    pd.rounded_rectangle((w * 0.18, h * 0.16, w * 0.82, h * 0.48), radius=18, fill=(26, 13, 55, 230), outline=(*SKY, 190), width=2)
    pd.ellipse((w * 0.37, h * 0.22, w * 0.63, h * 0.39), outline=(*GOLD, 220), width=max(2, w // 38))
    pd.rectangle((w * 0.48, h * 0.32, w * 0.52, h * 0.43), fill=(*GOLD, 220))
    pd.text((w * 0.13, h * 0.63), "BLACK", font=font(max(18, w // 7), bold=True), fill=CREAM)
    pd.text((w * 0.18, h * 0.75), "VAULT PACK", font=font(max(12, w // 13), bold=True), fill=GOLD)
    frame.alpha_composite(pack, (x, y))

    ring = glow_circle(max(420, int(520 * charge)), GOLD, 0.85 if t < 7 else 1.2)
    frame.alpha_composite(ring, (WIDTH // 2 - ring.width // 2, HEIGHT // 2 - ring.height // 2 - 10))


def draw_slab(frame: Image.Image, t: float):
    reveal = ease_out_back((t - 7.7) / 3.0)
    if reveal <= 0:
        return
    w = int(315 * reveal)
    h = int(452 * reveal)
    if w < 24 or h < 36:
        return
    x = WIDTH // 2 - w // 2
    y = HEIGHT // 2 - h // 2 + 18
    slab = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(slab)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=max(16, w // 14), fill=(218, 229, 240, 232), outline=(*CREAM, 255), width=max(3, w // 55))
    d.rounded_rectangle((w * 0.08, h * 0.04, w * 0.92, h * 0.18), radius=max(8, w // 30), fill=(238, 238, 221, 255), outline=(190, 36, 40, 255), width=max(2, w // 90))
    d.rounded_rectangle((w * 0.16, h * 0.23, w * 0.84, h * 0.88), radius=max(7, w // 34), fill=(9, 14, 30, 255), outline=(*GOLD, 220), width=max(2, w // 80))
    for i in range(7):
        yy = h * (0.29 + i * 0.075)
        d.line((w * 0.22, yy, w * 0.78, yy + math.sin(t * 3 + i) * 18), fill=(126, 198, 240, 95), width=max(2, w // 120))
    d.text((w * 0.15, h * 0.07), "VAULT ROOM", font=font(max(16, w // 13), bold=True), fill=NAVY)
    d.text((w * 0.66, h * 0.07), "10", font=font(max(24, w // 8), bold=True), fill=GOLD)
    d.text((w * 0.22, h * 0.51), "HIT", font=font(max(38, w // 5), bold=True, serif=True), fill=CREAM)
    angle = math.sin(t * 1.2) * 3
    slab = slab.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    glow = glow_circle(max(w, h) + 160, SKY, 0.72)
    frame.alpha_composite(glow, (WIDTH // 2 - glow.width // 2, HEIGHT // 2 - glow.height // 2 + 8))
    frame.alpha_composite(slab, (WIDTH // 2 - slab.width // 2, y - (slab.height - h) // 2))


def draw_particles(frame: Image.Image, t: float, rng: random.Random):
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    intensity = 0.45 + 0.55 * ease_in_out(min(1, max(0, (t - 2.5) / 7.5)))
    for i in range(165):
        seed = i * 179 + 11
        rng.seed(seed)
        base_x = rng.random() * WIDTH
        base_y = rng.random() * HEIGHT
        drift = (t * (12 + rng.random() * 36) + seed) % 240
        x = (base_x + math.sin(t * 0.7 + seed) * 28) % WIDTH
        y = (base_y - drift) % HEIGHT
        size = 1 + rng.random() * 4.5
        color = GOLD if i % 3 else SKY if i % 5 else CORAL
        alpha = int((70 + rng.random() * 130) * intensity)
        d.ellipse((x - size, y - size, x + size, y + size), fill=(*color, alpha))
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.25)))


def draw_sweep(frame: Image.Image, t: float):
    if t < 4.2 or t > 8.7:
        return
    progress = (t - 4.2) / 4.5
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x = -420 + progress * (WIDTH + 840)
    d.polygon([(x - 120, 0), (x + 120, 0), (x + 420, HEIGHT), (x + 180, HEIGHT)], fill=(255, 247, 230, 74))
    d.polygon([(x - 10, 0), (x + 40, 0), (x + 300, HEIGHT), (x + 230, HEIGHT)], fill=(*GOLD, 90))
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(8)))


def draw_title_overlays(frame: Image.Image, t: float):
    d = ImageDraw.Draw(frame)
    if t < 3.5:
        a = int(255 * (1 - ease_in_out(max(0, t - 2.4) / 1.1)))
        draw_centered(d, "THE VAULT ROOM", 74, FONT_SERIF_BIG, (*CREAM, a), stroke=3, stroke_fill=(*NAVY, a))
        draw_centered(d, "GACHA DEMO", 188, FONT_UI_BIG, (*GOLD, a), stroke=2, stroke_fill=(*NAVY, a))
    if 2.4 < t < 6.8:
        a = int(255 * ease_in_out(min(1, (t - 2.4) / 0.8)) * (1 - ease_in_out(max(0, t - 5.9) / 0.9)))
        draw_centered(d, "BLACK VAULT PACK", 810, FONT_UI_BIG, (*CREAM, a), stroke=2, stroke_fill=(*NAVY, a))
        draw_centered(d, "100% VISUAL DEMO PULL", 870, FONT_UI_SMALL, (*GOLD, a), stroke=1, stroke_fill=(*NAVY, a))
    if 6.9 < t < 10.9:
        a = int(255 * ease_in_out(min(1, (t - 6.9) / 0.5)) * (1 - ease_in_out(max(0, t - 10.1) / 0.8)))
        draw_centered(d, "VAULT OPENING", 92, FONT_UI_BIG, (*GOLD, a), stroke=2, stroke_fill=(*NAVY, a))
    if 9.5 < t < 12.8:
        a = int(255 * ease_in_out(min(1, (t - 9.5) / 0.6)) * (1 - ease_in_out(max(0, t - 12.0) / 0.8)))
        draw_centered(d, "PRIZE LOCKED", 820, FONT_SERIF_MID, (*CREAM, a), stroke=3, stroke_fill=(*NAVY, a))
        draw_centered(d, "Redeem the hit or preview 70% FMV sell-back", 898, FONT_UI_SMALL, (*GOLD, a), stroke=1, stroke_fill=(*NAVY, a))
    if t >= 12.4:
        a = int(255 * ease_in_out(min(1, (t - 12.4) / 0.8)))
        panel = rounded_panel((1120, 260), (7, 24, 44, int(218 * a / 255)), outline=(*GOLD, int(190 * a / 255)), width=3, radius=34)
        frame.alpha_composite(panel, (400, 380))
        d = ImageDraw.Draw(frame)
        draw_centered(d, "COMING SOON", 420, FONT_SERIF_MID, (*CREAM, a), stroke=2, stroke_fill=(*NAVY, a))
        draw_centered(d, "Payment, odds and legal rules will be wired before live play.", 510, FONT_UI_SMALL, (*GOLD, a), stroke=1, stroke_fill=(*NAVY, a))
        draw_centered(d, "For now: cinematic demo only.", 558, FONT_UI_TINY, (255, 247, 230, int(210 * a / 255)))


def draw_ui_chrome(frame: Image.Image, t: float):
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((40, 40, 258, 118), radius=24, fill=(7, 24, 44, 176), outline=(*GOLD, 150), width=2)
    d.text((70, 57), "THE", font=FONT_UI_TINY, fill=GOLD)
    d.text((70, 76), "VAULT ROOM", font=font(23, bold=True, serif=True), fill=CREAM)
    d.rounded_rectangle((1460, 44, 1880, 122), radius=24, fill=(7, 24, 44, 176), outline=(*GOLD, 138), width=2)
    d.text((1490, 61), "DEMO MODE", font=FONT_UI_SMALL, fill=CORAL)
    d.text((1490, 91), "No payment processed", font=FONT_UI_TINY, fill=CREAM)
    if 3.8 < t < 11.7:
        pct = ease_in_out((t - 3.8) / 7.9)
        d.rounded_rectangle((710, 952, 1210, 984), radius=16, fill=(7, 24, 44, 186), outline=(*CREAM, 90), width=1)
        d.rounded_rectangle((719, 961, 719 + int(482 * pct), 975), radius=7, fill=(*GOLD, 230))
    frame.alpha_composite(layer)


def render_frame(base: Image.Image, idx: int) -> Image.Image:
    t = idx / FPS
    zoom = 1.0 + 0.08 * ease_in_out(t / DURATION)
    if 5.4 < t < 8.2:
        zoom += 0.035 * math.sin(t * 35)
    frame = cover(base, WIDTH, HEIGHT, zoom=zoom).convert("RGBA")
    brightness = 0.52 + 0.35 * ease_in_out(t / 5.0) + (0.25 if 6.0 < t < 8.0 else 0)
    frame = ImageEnhance.Brightness(frame).enhance(brightness)
    frame = ImageEnhance.Contrast(frame).enhance(1.14)

    if 6.3 < t < 7.4:
        flash = int(160 * math.sin((t - 6.3) / 1.1 * math.pi))
        frame.alpha_composite(Image.new("RGBA", (WIDTH, HEIGHT), (255, 247, 230, flash)))

    frame.alpha_composite(VIGNETTE)
    rng = random.Random(1234)
    draw_particles(frame, t, rng)
    draw_sweep(frame, t)
    draw_pack(ImageDraw.Draw(frame), frame, t)
    draw_slab(frame, t)
    draw_ui_chrome(frame, t)
    draw_title_overlays(frame, t)
    return frame.convert("RGB")


def encode_video():
    if not SOURCE.exists():
        raise SystemExit(f"Missing source plate: {SOURCE}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(SOURCE).convert("RGB")

    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(VIDEO_NO_AUDIO),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    for idx in range(FRAMES):
        frame = render_frame(base, idx)
        if idx == int(1.0 * FPS):
            frame.save(POSTER, quality=94, optimize=True)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit("ffmpeg video encode failed")

    audio_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(VIDEO_NO_AUDIO),
        "-filter_complex",
        (
            "aevalsrc='0.018*sin(2*PI*(55+26*t)*t)+0.012*sin(2*PI*(110+18*t)*t)':"
            "s=48000:d=15,afade=t=in:st=0:d=1.1,afade=t=out:st=13.6:d=1.3,"
            "volume=0.7[a]"
        ),
        "-map",
        "0:v:0",
        "-map",
        "[a]",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        str(VIDEO),
    ]
    subprocess.run(audio_cmd, check=True)
    VIDEO_NO_AUDIO.unlink(missing_ok=True)


if __name__ == "__main__":
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is required to render the gacha cinematic video")
    encode_video()
    print(f"Wrote {VIDEO}")
    print(f"Wrote {POSTER}")
