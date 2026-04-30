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

# Margins
PAD_X = 80
PAD_Y = 70

# ---- Top hairline rule ----
draw.line([(PAD_X, PAD_Y), (W - PAD_X, PAD_Y)], fill=INK, width=2)

# ---- Mono eyebrow top-left ----
mono = ImageFont.truetype(MONO_MEDIUM, 18)
draw.text((PAD_X, PAD_Y + 18), "FIELD & FORGE PRESS", font=mono, fill=INK)

# ---- Mono eyebrow top-right ----
right_label = "PARENTCOACHPLAYBOOK.COM"
rb = draw.textbbox((0, 0), right_label, font=mono)
rw = rb[2] - rb[0]
draw.text((W - PAD_X - rw, PAD_Y + 18), right_label, font=mono, fill=INK_SOFT)

# ---- Wordmark (italic Fraunces "Pcp") top-left ----
wm_size = 96
wm_p_font = ImageFont.truetype(F_ITALIC, wm_size)
# Draw "P" in ink
draw.text((PAD_X, PAD_Y + 60), "P", font=wm_p_font, fill=INK)
# Position "cp" right after the "P"
p_box = draw.textbbox((PAD_X, PAD_Y + 60), "P", font=wm_p_font)
p_right = p_box[2]
draw.text((p_right, PAD_Y + 60), "cp", font=wm_p_font, fill=TERRACOTTA)

# Subtitle next to wordmark
sub_font = ImageFont.truetype(F_REGULAR, 22)
sub_y = PAD_Y + 80
draw.line([(p_right + 90, sub_y - 4), (p_right + 90, sub_y + 50)], fill=LINEN, width=1)
draw.text((p_right + 110, sub_y), "The Parent-Coach Playbook", font=sub_font, fill=INK)
sub_mono = ImageFont.truetype(MONO_MEDIUM, 12)
draw.text((p_right + 110, sub_y + 32), "FIELD & FORGE PRESS", font=sub_mono, fill=INK_SOFT)

# ---- Big tagline ----
# "The drive home is the real game."
# "real game" italic in terracotta
def measure(text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0], b[3] - b[1]

tag_size = 92
tag_font = ImageFont.truetype(F_SEMIBOLD, tag_size)
tag_italic = ImageFont.truetype(F_ITALIC, tag_size)

# Two-line layout
line1 = "The drive home"
line2_pre = "is the "
line2_em = "real game."

line1_y = 270
line2_y = 380

draw.text((PAD_X, line1_y), line1, font=tag_font, fill=INK)
# Line 2: pre + italic em
pre_w, _ = measure(line2_pre, tag_font)
draw.text((PAD_X, line2_y), line2_pre, font=tag_font, fill=INK)
draw.text((PAD_X + pre_w, line2_y), line2_em, font=tag_italic, fill=TERRACOTTA)

# ---- Three accent dots (representing the three drives) ----
dots_y = 540
dot_r = 9
dot_gap = 32
draw.ellipse([(PAD_X, dots_y - dot_r), (PAD_X + 2 * dot_r, dots_y + dot_r)], fill=SAGE)
draw.ellipse([(PAD_X + dot_gap, dots_y - dot_r), (PAD_X + dot_gap + 2 * dot_r, dots_y + dot_r)], fill=TERRACOTTA)
draw.ellipse([(PAD_X + 2 * dot_gap, dots_y - dot_r), (PAD_X + 2 * dot_gap + 2 * dot_r, dots_y + dot_r)], fill=HONEY)

# Caption next to dots
cap_font = ImageFont.truetype(F_ITALIC, 26)
draw.text((PAD_X + 3 * dot_gap + 12, dots_y - 18), "Three drives. One relationship.", font=cap_font, fill=INK_SOFT)

# ---- Bottom hairline rule + imprint ----
draw.line([(PAD_X, H - PAD_Y), (W - PAD_X, H - PAD_Y)], fill=LINEN, width=1)
foot_font = ImageFont.truetype(MONO_MEDIUM, 13)
draw.text((PAD_X, H - PAD_Y + 16), "A FREE EDITORIAL BRAND  /  WEEKLY ISSUES  /  EST. 2026", font=foot_font, fill=INK_SOFT)

# Save
out = "/sessions/happy-tender-gates/mnt/Claude Cowork/OUTPUTS/parent-coach-playbook/public/og-default.png"
img.save(out, "PNG", optimize=True)
print(f"wrote: {out}")
print(f"size: {os.path.getsize(out)} bytes")
print(f"dimensions: {W}x{H}")
