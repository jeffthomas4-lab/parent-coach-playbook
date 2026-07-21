# DEPRECATED: this one-off script is superseded by the imagegen skill
# (see About Me/openai-config.md for the supported key/config path).
# Sanitized 2026-07-15 — a live OpenAI key was hardcoded on this line and has
# been removed. That key is burned; do not restore a literal key here.
# If this script is still needed, set OPENAI_API_KEY in your shell environment
# before running it. Prefer the imagegen skill for all new image work.
import openai, base64, os
from pathlib import Path

api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise SystemExit(
        "OPENAI_API_KEY not set. Export it in your shell, or better, use the "
        "imagegen skill instead of this deprecated script."
    )
client = openai.OpenAI(api_key=api_key)

prompt = (
    "A parent and child walking side by side along a quiet path toward a sports field at golden hour, "
    "the parent's hand resting gently on the child's shoulder, both carrying a sports bag, "
    "long shadows stretching behind them, warm amber light across the grass, "
    "the field visible in the soft background, mood of quiet reflection and shared purpose, "
    "realistic image, cinematic and warm"
)

output_path = Path(r"C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk\public\illustrations\are-youth-sports-worth-it-hero.webp")
output_path.parent.mkdir(parents=True, exist_ok=True)

print("Generating image... (takes ~60 seconds)")
response = client.images.generate(
    model="gpt-image-1",
    prompt=prompt,
    size="1536x1024",
    n=1,
)

image_data = base64.b64decode(response.data[0].b64_json)
with open(output_path, "wb") as f:
    f.write(image_data)

print(f"Done. Saved to: {output_path}")
