#!/usr/bin/env python3
"""Render the two-stage Vault Gacha demo videos.

The `/gacha` route uses a calm looped vending-machine clip while idle and a
separate pack-rip/reveal clip after the user presses the rip button. Both are
generated from a committed source plate so the look stays reproducible.
"""

from __future__ import annotations

import math
import random
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "media" / "gacha"
SOURCE = OUT_DIR / "vault-gacha-machine-plate.png"

IDLE_VIDEO = OUT_DIR / "vault-gacha-machine-idle-loop.mp4"
IDLE_POSTER = OUT_DIR / "vault-gacha-machine-idle-poster.jpg"
RIP_VIDEO = OUT_DIR / "vault-gacha-pack-rip-reveal.mp4"
RIP_POSTER = OUT_DIR / "vault-gacha-pack-rip-poster.jpg"

WIDTH = 1600
HEIGHT = 900
FPS = 30
IDLE_DURATION = 8.0
RIP_DURATION = 6.4

NAVY = (7, 24, 44)
DEEP = (9, 32, 61)
GOLD = (212, 175, 55)
CORAL = (255, 107, 91)
CREAM = (255, 247, 230)
SKY = (126, 198, 240)
BLUE = (13, 78, 162)


def font(size: int, bold: bool = False, serif: bool = False) -> ImageFont.FreeTypeFont:
    candidates: list[str] = []
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
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_DISPLAY = font(76, bold=True, serif=True)
FONT_DISPLAY_SMALL = font(48, bold=True, serif=True)
FONT_UI = font(30, bold=True)
FONT_UI_SMALL = font(21, bold=True)
FONT_UI_TINY = font(16, bold=True)


def ease(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def ease_out_back(x: float) -> float:
    x = max(0.0, min(1.0, x))
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2)


def cover(img: Image.Image, width: int, height: int, zoom: float = 1.0, x_shift: int = 0, y_shift: int = 0) -> Image.Image:
    src_ratio = img.width / img.height
    target_ratio = width / height
    if src_ratio > target_ratio:
        new_h = int(height * zoom)
        new_w = int(new_h * src_ratio)
    else:
        new_w = int(width * zoom)
        new_h = int(new_w / src_ratio)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = max(0, min(new_w - width, (new_w - width) // 2 + x_shift))
    top = max(0, min(new_h - height, (new_h - height) // 2 + y_shift))
    return resized.crop((left, top, left + width, top + height))


def add_vignette(frame: Image.Image, amount: float = 0.72) -> None:
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(mask)
    for r in range(0, 920, 14):
        alpha = int(255 * (r / 920) ** 1.7)
        draw.ellipse((WIDTH // 2 - r * 1.55, HEIGHT // 2 - r, WIDTH // 2 + r * 1.55, HEIGHT // 2 + r), fill=alpha)
    inv = Image.eval(mask, lambda px: 255 - px)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (*NAVY, 0))
    layer.putalpha(inv.point(lambda px: int(px * amount)))
    frame.alpha_composite(layer)


def glow(size: int, color: tuple[int, int, int], strength: float) -> Image.Image:
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for i in range(26):
        p = i / 25
        radius = int(size * 0.5 * p)
        alpha = int(220 * strength * (1 - p) ** 1.9)
        draw.ellipse((size // 2 - radius, size // 2 - radius, size // 2 + radius, size // 2 + radius), fill=(*color, alpha))
    return layer.filter(ImageFilter.GaussianBlur(16))


def centered(draw: ImageDraw.ImageDraw, text: str, y: int, typeface: ImageFont.FreeTypeFont, fill, stroke: int = 0) -> None:
    bbox = draw.textbbox((0, 0), text, font=typeface, stroke_width=stroke)
    draw.text(((WIDTH - (bbox[2] - bbox[0])) // 2, y), text, font=typeface, fill=fill, stroke_width=stroke, stroke_fill=NAVY)


def draw_machine_light_sweeps(frame: Image.Image, t: float, loop_duration: float) -> None:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    phase = (t / loop_duration) % 1
    for offset, color, alpha in [(0.0, SKY, 70), (0.38, GOLD, 62)]:
        x = -420 + ((phase + offset) % 1) * (WIDTH + 840)
        draw.polygon([(x - 80, 0), (x + 16, 0), (x + 260, HEIGHT), (x + 100, HEIGHT)], fill=(*color, alpha))
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(8)))


def draw_particles(frame: Image.Image, t: float, seed_base: int, density: int = 110, strength: float = 1.0) -> None:
    rng = random.Random(seed_base)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for i in range(density):
        rng.seed(seed_base + i * 313)
        base_x = rng.random() * WIDTH
        base_y = rng.random() * HEIGHT
        speed = 16 + rng.random() * 38
        x = (base_x + math.sin(t * 0.85 + i) * 22) % WIDTH
        y = (base_y - t * speed) % HEIGHT
        radius = 1.0 + rng.random() * 3.6
        color = GOLD if i % 3 else SKY if i % 5 else CORAL
        alpha = int((54 + rng.random() * 132) * strength)
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*color, alpha))
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.2)))


def draw_shockwave(frame: Image.Image, t: float) -> None:
    if not 2.45 <= t <= 4.25:
        return
    p = ease((t - 2.45) / 1.8)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = WIDTH // 2, HEIGHT // 2
    for i, color in enumerate((GOLD, SKY, CREAM)):
        radius = int(80 + p * (360 + i * 130))
        alpha = int((185 - i * 38) * (1 - p))
        width = 8 + i * 4
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=(*color, max(0, alpha)), width=width)
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.2)))


def draw_speed_lines(frame: Image.Image, t: float) -> None:
    if not 2.15 <= t <= 3.45:
        return
    p = ease((t - 2.15) / 1.3)
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = WIDTH // 2, HEIGHT // 2
    for i in range(42):
        angle = (i / 42) * math.tau + math.sin(t * 8) * 0.04
        inner = 110 + p * 40
        outer = 360 + p * 520 + (i % 5) * 34
        x1 = cx + math.cos(angle) * inner
        y1 = cy + math.sin(angle) * inner
        x2 = cx + math.cos(angle) * outer
        y2 = cy + math.sin(angle) * outer
        color = GOLD if i % 3 else SKY
        alpha = int(150 * (1 - abs(p - 0.55)))
        draw.line((x1, y1, x2, y2), fill=(*color, max(0, alpha)), width=3 if i % 4 else 5)
    frame.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.45)))


def mini_prize_card(index: int, scale: float, alpha: int) -> Image.Image:
    w = max(28, int(78 * scale))
    h = max(42, int(112 * scale))
    card = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    palette = [GOLD, SKY, CORAL, BLUE, CREAM]
    accent = palette[index % len(palette)]
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=max(5, w // 8), fill=(10, 18, 43, alpha), outline=(*accent, alpha), width=max(2, w // 22))
    draw.rounded_rectangle((w * 0.12, h * 0.12, w * 0.88, h * 0.7), radius=max(4, w // 12), fill=(*accent, int(alpha * 0.26)), outline=(*CREAM, int(alpha * 0.48)), width=1)
    draw.ellipse((w * 0.36, h * 0.24, w * 0.64, h * 0.44), outline=(*CREAM, int(alpha * 0.82)), width=max(1, w // 26))
    draw.line((w * 0.25, h * 0.78, w * 0.75, h * 0.78), fill=(*accent, alpha), width=max(2, w // 24))
    draw.line((w * 0.32, h * 0.86, w * 0.68, h * 0.86), fill=(*CREAM, int(alpha * 0.72)), width=max(1, w // 34))
    return card


def draw_card_burst(frame: Image.Image, t: float) -> None:
    if not 2.55 <= t <= 5.6:
        return
    p = ease_out_back((t - 2.55) / 1.35)
    fade = 1 - ease((t - 4.65) / 0.95)
    alpha = int(230 * max(0, min(1, fade)))
    if alpha <= 0:
        return
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    cx, cy = WIDTH // 2, HEIGHT // 2 + 8
    for i in range(16):
        angle = -math.pi * 0.92 + (i / 15) * math.pi * 1.84
        distance = (110 + (i % 5) * 38) * p
        bob = math.sin(t * 8 + i) * 20
        x = cx + math.cos(angle) * distance
        y = cy + math.sin(angle) * distance * 0.72 + bob
        card = mini_prize_card(i, 0.92 + (i % 4) * 0.18, alpha)
        card = card.rotate(math.degrees(angle) * 0.34 + math.sin(t * 5 + i) * 16, resample=Image.Resampling.BICUBIC, expand=True)
        layer.alpha_composite(card, (int(x - card.width / 2), int(y - card.height / 2)))
    frame.alpha_composite(layer)


def draw_idle_ui(frame: Image.Image, t: float) -> None:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((1194, 38, 1564, 118), radius=24, fill=(7, 24, 44, 176), outline=(*SKY, 132), width=2)
    draw.text((1224, 55), "VISUAL DEMO", font=FONT_UI_SMALL, fill=CORAL)
    draw.text((1224, 83), "Pick pack -> rip -> reveal", font=FONT_UI_TINY, fill=CREAM)
    pulse = 0.5 + 0.5 * math.sin(t * math.tau / IDLE_DURATION)
    draw.rounded_rectangle((556, 798, 1044, 854), radius=28, fill=(7, 24, 44, 190), outline=(*GOLD, 130 + int(70 * pulse)), width=2)
    centered(draw, "READY TO RIP", 811, FONT_UI_SMALL, (*CREAM, 235), stroke=1)
    frame.alpha_composite(layer)


def draw_pack(frame: Image.Image, t: float) -> None:
    appear = ease_out_back((t - 0.4) / 1.2)
    if appear <= 0:
        return
    tear = ease((t - 2.0) / 1.15)
    burst = ease((t - 2.8) / 1.0)
    scale = 1 + 0.05 * math.sin(t * 9)
    w = int(260 * appear * scale)
    h = int(364 * appear * scale)
    if w < 20 or h < 20:
        return
    x = WIDTH // 2 - w // 2
    y = HEIGHT // 2 - h // 2 - 10
    shadow = glow(max(w, h) + 210, GOLD, 0.45 + burst * 0.55)
    frame.alpha_composite(shadow, (WIDTH // 2 - shadow.width // 2, HEIGHT // 2 - shadow.height // 2 - 8))

    pack = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(pack)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=max(18, w // 10), fill=(10, 16, 42, 245), outline=(*GOLD, 255), width=max(3, w // 60))
    for i in range(8):
        yy = int(h * (0.12 + i * 0.09))
        draw.line((18, yy, w - 18, yy + int(math.sin(i + t) * 18)), fill=(126, 198, 240, 72 + i * 8), width=max(2, w // 70))
    draw.rounded_rectangle((w * 0.16, h * 0.14, w * 0.84, h * 0.42), radius=max(10, w // 18), fill=(7, 24, 44, 230), outline=(*SKY, 190), width=2)
    draw.ellipse((w * 0.36, h * 0.2, w * 0.64, h * 0.36), outline=(*GOLD, 230), width=max(2, w // 42))
    draw.rectangle((w * 0.485, h * 0.31, w * 0.515, h * 0.41), fill=(*GOLD, 230))
    draw.text((w * 0.2, h * 0.55), "VAULT", font=font(max(20, w // 6), bold=True, serif=True), fill=CREAM)
    draw.text((w * 0.21, h * 0.71), "MYSTERY PACK", font=font(max(12, w // 13), bold=True), fill=GOLD)
    if tear > 0:
        tear_y = int(h * (0.12 + 0.28 * tear))
        draw.line((w * 0.08, tear_y, w * 0.92, tear_y + math.sin(t * 18) * 14), fill=(*CREAM, 235), width=max(4, w // 35))
        draw.polygon([(0, 0), (w, 0), (w, tear_y), (w * (0.5 + 0.14 * tear), tear_y + h * 0.08), (w * (0.5 - 0.14 * tear), tear_y + h * 0.08), (0, tear_y)], fill=(255, 247, 230, int(125 * tear)))
    frame.alpha_composite(pack, (x, y))


def draw_reveal_slab(frame: Image.Image, t: float) -> None:
    reveal = ease_out_back((t - 3.12) / 1.2)
    if reveal <= 0:
        return
    w = int(260 * reveal)
    h = int(384 * reveal)
    if w < 8 or h < 8:
        return
    slab = Image.new("RGBA", (max(1, w), max(1, h)), (0, 0, 0, 0))
    draw = ImageDraw.Draw(slab)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=max(14, w // 12), fill=(226, 237, 246, 240), outline=(*CREAM, 255), width=max(3, w // 54))
    draw.rounded_rectangle((w * 0.08, h * 0.04, w * 0.92, h * 0.18), radius=max(7, w // 32), fill=(248, 248, 230, 255), outline=(185, 35, 42, 255), width=2)
    draw.text((w * 0.14, h * 0.075), "VAULT ROOM", font=font(max(14, w // 14), bold=True), fill=NAVY)
    draw.text((w * 0.7, h * 0.064), "10", font=font(max(22, w // 8), bold=True), fill=GOLD)
    draw.rounded_rectangle((w * 0.18, h * 0.24, w * 0.82, h * 0.86), radius=max(6, w // 35), fill=(9, 17, 40, 255), outline=(*GOLD, 230), width=2)
    for i in range(8):
        y = h * (0.31 + i * 0.06)
        draw.line((w * 0.25, y, w * 0.75, y + math.sin(i + t * 3) * 13), fill=(126, 198, 240, 100), width=max(2, w // 120))
    draw.text((w * 0.25, h * 0.50), "HIT", font=font(max(34, w // 5), bold=True, serif=True), fill=CREAM)
    angle = math.sin(t * 1.8) * 3
    slab = slab.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    aura = glow(max(w, h) + 240, SKY, 0.95)
    frame.alpha_composite(aura, (WIDTH // 2 - aura.width // 2, HEIGHT // 2 - aura.height // 2 + 12))
    frame.alpha_composite(slab, (WIDTH // 2 - slab.width // 2, HEIGHT // 2 - slab.height // 2 + 20))


def draw_reveal_ui(frame: Image.Image, t: float) -> None:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle((1200, 36, 1564, 112), radius=22, fill=(7, 24, 44, 184), outline=(*SKY, 138), width=2)
    draw.text((1228, 53), "DEMO MODE", font=FONT_UI_SMALL, fill=CORAL)
    draw.text((1228, 82), "Winner shown after clip", font=FONT_UI_TINY, fill=CREAM)
    if 4.05 < t < 6.3:
        a = int(255 * ease((t - 4.05) / 0.45))
        draw.rounded_rectangle((458, 716, 1142, 806), radius=34, fill=(7, 24, 44, int(210 * a / 255)), outline=(*GOLD, int(170 * a / 255)), width=2)
        centered(draw, "WINNER READY", 735, FONT_DISPLAY_SMALL, (*CREAM, a), stroke=2)
        centered(draw, "Choose redeem, vault, or 75% FMV buyback", 786, FONT_UI_TINY, (*GOLD, a), stroke=1)
    frame.alpha_composite(layer)


def render_idle_frame(base: Image.Image, idx: int) -> Image.Image:
    t = idx / FPS
    phase = t / IDLE_DURATION
    zoom = 1.0 + 0.022 * math.sin(phase * math.tau)
    frame = cover(base, WIDTH, HEIGHT, zoom=zoom, x_shift=int(math.sin(phase * math.tau) * 10)).convert("RGBA")
    frame = ImageEnhance.Brightness(frame).enhance(0.94 + 0.06 * math.sin(phase * math.tau))
    frame = ImageEnhance.Contrast(frame).enhance(1.08)
    glow_strength = 0.45 + 0.25 * math.sin(phase * math.tau * 2)
    machine_glow = glow(760, SKY, glow_strength)
    frame.alpha_composite(machine_glow, (WIDTH // 2 - machine_glow.width // 2 + 64, HEIGHT // 2 - machine_glow.height // 2 + 12))
    draw_machine_light_sweeps(frame, t, IDLE_DURATION)
    draw_particles(frame, t, 8201, density=92, strength=0.7)
    add_vignette(frame, 0.48)
    draw_idle_ui(frame, t)
    return frame.convert("RGB")


def render_rip_frame(base: Image.Image, idx: int) -> Image.Image:
    t = idx / FPS
    progress = t / RIP_DURATION
    zoom = 1.05 + 0.10 * ease(progress)
    frame = cover(base, WIDTH, HEIGHT, zoom=zoom).convert("RGBA")
    frame = ImageEnhance.Brightness(frame).enhance(0.54 + 0.3 * ease(progress))
    frame = ImageEnhance.Contrast(frame).enhance(1.18)
    frame.alpha_composite(Image.new("RGBA", (WIDTH, HEIGHT), (*NAVY, 76)))
    draw_machine_light_sweeps(frame, t, RIP_DURATION)
    draw_particles(frame, t, 9349, density=150, strength=1.05)
    draw_speed_lines(frame, t)
    draw_shockwave(frame, t)
    if 2.72 < t < 3.28:
        flash = int(230 * math.sin((t - 2.72) / 0.56 * math.pi))
        frame.alpha_composite(Image.new("RGBA", (WIDTH, HEIGHT), (*CREAM, flash)))
    draw_pack(frame, t)
    draw_card_burst(frame, t)
    draw_reveal_slab(frame, t)
    add_vignette(frame, 0.66)
    draw_reveal_ui(frame, t)
    return frame.convert("RGB")


def encode_raw_video(path: Path, frame_count: int, frame_fn, base: Image.Image, poster: Path | None = None, poster_at: int = 0, audio: bool = False) -> None:
    tmp = path.with_suffix(".noaudio.mp4")
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
        "medium",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(tmp if audio else path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    for idx in range(frame_count):
        frame = frame_fn(base, idx)
        if poster and idx == poster_at:
            frame.save(poster, quality=94, optimize=True)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit(f"ffmpeg encode failed for {path}")

    if not audio:
        return

    audio_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(tmp),
        "-filter_complex",
        (
            "aevalsrc='0.016*sin(2*PI*(54+44*t)*t)+0.012*sin(2*PI*(116+58*t)*t)"
            "+if(between(t,1.95,2.25),0.035*sin(2*PI*980*t),0)"
            "+if(between(t,2.58,3.22),0.095*sin(2*PI*(380+260*sin(18*t))*t),0)"
            "+if(between(t,3.18,4.65),0.032*sin(2*PI*(168+22*t)*t),0)':s=48000:d=6.4,"
            "afade=t=in:st=0:d=0.35,afade=t=out:st=5.8:d=0.45,volume=0.8[a]"
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
        str(path),
    ]
    subprocess.run(audio_cmd, check=True)
    tmp.unlink(missing_ok=True)


def main() -> None:
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is required")
    if not SOURCE.exists():
        raise SystemExit(f"Missing source plate: {SOURCE}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(SOURCE).convert("RGB")

    encode_raw_video(
        IDLE_VIDEO,
        int(IDLE_DURATION * FPS),
        render_idle_frame,
        base,
        poster=IDLE_POSTER,
        poster_at=12,
        audio=False,
    )
    encode_raw_video(
        RIP_VIDEO,
        int(RIP_DURATION * FPS),
        render_rip_frame,
        base,
        poster=RIP_POSTER,
        poster_at=int(1.4 * FPS),
        audio=True,
    )
    print(f"Wrote {IDLE_VIDEO}")
    print(f"Wrote {IDLE_POSTER}")
    print(f"Wrote {RIP_VIDEO}")
    print(f"Wrote {RIP_POSTER}")


if __name__ == "__main__":
    main()
