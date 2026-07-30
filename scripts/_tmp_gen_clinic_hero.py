import os
import base64
from pathlib import Path
import openai
from PIL import Image
import io

api_key = os.environ["OPENAI_API_KEY"]
client = openai.OpenAI(api_key=api_key)

prompt = (
    "A group of adult volunteer youth sports coaches standing in a loose "
    "semi-circle on a grass practice field in the early evening, gathered "
    "around one coach who is holding a closed, blank clipboard down at his "
    "side, the writing surface turned away from the camera so no page or "
    "writing is visible. Cone bags and a ball bag sit on the grass nearby. "
    "No children or other people are in the background or foreground, only "
    "the group of adult coaches. "
    "Photorealistic documentary photograph, natural available light, shallow "
    "depth of field, warm and slightly desaturated color, fine film grain. "
    "Candid and observed, never posed. No one looks at the camera. No "
    "readable logos, brand names, sponsor signage, or team names on any "
    "equipment or clothing. No text, lettering, writing, or numerals "
    "anywhere in the image, including on the clipboard, which must show its "
    "blank back or be angled so the page is not visible. No stock-photo "
    "gloss, no staged smiles, no motion blur, no trophy celebrations. 3:2 "
    "landscape composition with the subject in the horizontal middle band."
)

response = client.images.generate(
    model="gpt-image-1",
    prompt=prompt,
    size="1536x1024",
    quality="medium",
    n=1,
)

image_bytes = base64.b64decode(response.data[0].b64_json)

repo_root = Path("/sessions/compassionate-cool-fermi/mnt/Claude Cowork/OUTPUTS/Field and Forge/parent-coach-desk")
final_path = repo_root / "public" / "illustrations" / "coach-clinic-cones-clipboard-evening.webp"
tmp_path = final_path.with_suffix(".webp.tmp")

img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
img.save(tmp_path, "WEBP", quality=82)
os.replace(tmp_path, final_path)

size_kb = final_path.stat().st_size / 1024
print(f"Saved: {final_path} ({size_kb:.1f} KB, {img.width}x{img.height})")
