#!/usr/bin/env python3
"""Generate cover image for vibe-coding-claude-code course."""

import json
import base64
import urllib.request
import os
import subprocess
import sys

API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
MODEL = "openai/gpt-5-image-mini"
OUTPUT_DIR = "/Users/vista/06_VibeCoding/01_Code_Products/solo/public/images/workshops"

COURSE = {
    "id": "vibe-coding-claude-code",
    "prompt": (
        "Generate a wide 16:9 abstract cover image. Theme: Claude Code CLI, "
        "developer terminal, AI pair programming inside a terminal window. "
        "Style: dark warm background (#0b0d12) with glowing Claude orange "
        "(#D97757) and warm amber (#F59E0B) accents. Compose abstract "
        "geometric shapes resembling a stylized terminal window with a "
        "blinking cursor block, monospace bracket marks, gentle gradient "
        "rays from the top-left corner, faint code-like horizontal lines "
        "as texture. Premium, modern, minimal, futuristic. No text, no "
        "letters, no numbers, no people, no logos."
    ),
}


def main():
    if not API_KEY:
        print("Missing OPENROUTER_API_KEY env var")
        sys.exit(1)

    course_id = COURSE["id"]
    prompt = COURSE["prompt"]
    output_png = os.path.join(OUTPUT_DIR, f"cover-{course_id}.png")
    output_webp = os.path.join(OUTPUT_DIR, f"cover-{course_id}.webp")

    print(f"Generating: {course_id}", flush=True)

    payload = json.dumps(
        {"model": MODEL, "messages": [{"role": "user", "content": prompt}]}
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  REQUEST ERROR: {e}")
        sys.exit(1)

    images = data.get("choices", [{}])[0].get("message", {}).get("images", [])
    if not images:
        print("  No image returned. Full message keys:")
        print(list(data.get("choices", [{}])[0].get("message", {}).keys()))
        print(json.dumps(data, ensure_ascii=False)[:800])
        sys.exit(1)

    url = images[0]["image_url"]["url"]
    if not url.startswith("data:"):
        print(f"  Unexpected url: {url[:120]}")
        sys.exit(1)

    b64_data = url.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_data)
    with open(output_png, "wb") as f:
        f.write(img_bytes)

    # Convert to WebP via ffmpeg
    result = subprocess.run(
        [
            "ffmpeg", "-y", "-i", output_png,
            "-vf", "scale=1200:-1",
            "-c:v", "libwebp", "-q:v", "82",
            output_webp,
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"  ffmpeg error: {result.stderr.strip()[:300]}")
        sys.exit(1)

    os.remove(output_png)
    size_kb = os.path.getsize(output_webp) / 1024
    print(f"  Saved: {os.path.basename(output_webp)} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
