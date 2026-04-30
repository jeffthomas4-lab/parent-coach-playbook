"""
Build the default Open Graph image for The Parent-Coach Playbook.

Output: public/og-default.png  (1200x630 PNG)

Run after any brand change so the social preview stays current.
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ---- Brand tokens ----
PAPER       = (250, 246, 238)
PAPER_WARM  = (242, 234, 217)
INK         = (45,  37,  32)
INK_SOFT    = (95,  84,  72)
TERRACOTTA  = (197, 113, 61)
HONEY       = (212, 171, 106)
SAGE        = (143, 166, 140)
LINEN       = (221, 210, 189)

# ---- Fonts ----
FONT_DIR = "/tmp/pcp-fonts"
F_ITALIC      = f"{FONT_DIR}/Fraunces-Italic.ttf"
F_REGULAR     = f"{FONT_DIR}/Fraunces-Regular.ttf"
F_SEMIBOLD    = f"{FONT_DIR}/Fraunces-SemiBold.ttf"
MONO_MEDIUM   = f"{FONT_DIR}/JetBrainsMono-Medium.ttf"

W, H = 1200, 630

img = Image.new("RGB", (W, H), PAPER)
draw = ImageDraw.Draw(img)

PAD_X = 80
PAD_Y = 70

# ---- Top hairline rule ----
draw.line([(PAD_X, PAD_Y), (W - PAD_X, PAD_Y)], fill=INK, width=2)

# Top-left tagline echo
mono = ImageFont.truetype(MONO_MEDIUM, 16)
draw.text((PAD_X, PAD_Y + 18), "PARENTCOACHPLAYBOOK.COM", font=mono, fill=INK)

# Top-right friendly note
right_label = "FOR PARENTS WHO COACH, DRIVE & SUPERVISE"
rb = draw.textbbox((0, 0), right_label, font=mono)
rw = rb[2] - rb[0]
draw.text((W - PAD_X - rw, PAD_Y + 18), right_label, font=mono, fill=INK_SOFT)

# ---- Wordmark: "The Parent-Coach Playbook." italic Fraunces, two-tone ----
wm_size = 48
wm_font = ImageFont.truetype(F_ITALIC, wm_size)

def measure(text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0], b[3] - b[1]

wm_y = PAD_Y + 60
prefix = "The Parent-Coach "
accent = "Playbook"
period = "."
prefix_w, _ = measure(prefix, wm_font)
accent_w, _ = measure(accent, wm_font)

draw.text((PAD_X, wm_y), prefix, font=wm_font, fill=INK)
draw.text((PAD_X + prefix_w, wm_y), accent, font=wm_font, fill=TERRACOTTA)
draw.text((PAD_X + prefix_w + accent_w, wm_y), period, font=wm_font, fill=INK)

# ---- Big tagline ----
tag_size = 92
tag_font = ImageFont.truetype(F_SEMIBOLD, tag_size)
tag_italic = ImageFont.truetype(F_ITALIC, tag_size)

line1 = "The drive home"
line2_pre = "is the "
line2_em = "real game."

line1_y = 240
line2_y = 350

draw.text((PAD_X, line1_y), line1, font=tag_font, fill=INK)
pre_w, _ = measure(line2_pre, tag_font)
draw.text((PAD_X, line2_y), line2_pre, font=tag_font, fill=INK)
draw.text((PAD_X + pre_w, line2_y), line2_em, font=tag_italic, fill=TERRACOTTA)

# ---- Three accent dots + handwritten-style caption ----
dots_y = 510
dot_r = 9
dot_gap = 32
draw.ellipse([(PAD_X, dots_y - dot_r), (PAD_X + 2 * dot_r, dots_y + dot_r)], fill=SAGE)
draw.ellipse([(PAD_X + dot_gap, dots_y - dot_r), (PAD_X + dot_gap + 2 * dot_r, dots_y + dot_r)], fill=TERRACOTTA)
draw.ellipse([(PAD_X + 2 * dot_gap, dots_y - dot_r), (PAD_X + 2 * dot_gap + 2 * dot_r, dots_y + dot_r)], fill=HONEY)

cap_font = ImageFont.truetype(F_ITALIC, 28)
draw.text((PAD_X + 3 * dot_gap + 12, dots_y - 18), "Three drives. One relationship.", font=cap_font, fill=INK_SOFT)

# ---- Bottom hairline rule + friendly footer ----
draw.line([(PAD_X, H - PAD_Y), (W - PAD_X, H - PAD_Y)], fill=LINEN, width=1)
foot_font = ImageFont.truetype(MONO_MEDIUM, 13)
draw.text((PAD_X, H - PAD_Y + 16), "WEEKLY READS  /  MAREN, DAN & JEFF", font=foot_font, fill=INK_SOFT)

# Save
out = "/sessions/happy-tender-gates/mnt/Claude Cowork/OUTPUTS/parent-coach-playbook/public/og-default.png"
img.save(out, "PNG", optimize=True)
print(f"wrote: {out}")
print(f"size: {os.path.getsize(out)} bytes")
print(f"dimensions: {W}x{H}")
