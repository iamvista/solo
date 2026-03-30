#!/usr/bin/env python3
"""Generate course cover images using OpenRouter API."""

import json
import base64
import urllib.request
import os
import subprocess

API_KEY = "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"
MODEL = "openai/gpt-5-image-mini"
OUTPUT_DIR = "/Users/vista/06_VibeCoding/01_Code_Products/solo/public/images/workshops"

COURSES = [
    {
        "id": "ai-command-center",
        "prompt": "Generate a wide 16:9 abstract cover image. Theme: AI command center, personal productivity dashboard, digital automation. Style: dark navy blue (#1E3A5F) background with glowing gold (#C8953D) geometric circuit lines, floating holographic dashboard panels, subtle grid pattern. Modern, premium, minimal. No text, no people, no letters."
    },
    {
        "id": "vibe-coding",
        "prompt": "Generate a wide 16:9 abstract cover image. Theme: creative coding, building websites with AI, digital creation. Style: dark navy blue (#1E3A5F) background with neon coral (#E63946) and gold (#C8953D) accents, abstract code blocks floating in space, geometric shapes resembling browser windows. Modern, premium, minimal. No text, no people, no letters."
    },
    {
        "id": "ai-content",
        "prompt": "Generate a wide 16:9 abstract cover image. Theme: content creation system, writing automation, multi-format publishing. Style: dark navy blue (#1E3A5F) background with warm gold (#C8953D) flowing lines, abstract shapes suggesting documents transforming into multiple formats, connected nodes. Modern, premium, minimal. No text, no people, no letters."
    },
    {
        "id": "ai-social-content",
        "prompt": "Generate a wide 16:9 abstract cover image. Theme: social media engagement, psychology of content, community interaction. Style: dark navy blue (#1E3A5F) background with vibrant coral (#E63946) and soft gold (#C8953D) accents, abstract speech bubbles and connection lines, heart-like geometric shapes. Modern, premium, minimal. No text, no people, no letters."
    },
    {
        "id": "innovation-workshop",
        "prompt": "Generate a wide 16:9 abstract cover image. Theme: innovation thinking, creative problem solving, lightbulb moment. Style: dark navy blue (#1E3A5F) background with bright gold (#C8953D) bursting light rays, abstract geometric lightbulb shape, puzzle pieces connecting. Modern, premium, minimal. No text, no people, no letters."
    },
    {
        "id": "senior-asset-safety",
        "prompt": "Generate a wide 16:9 abstract cover image. Theme: wealth protection, financial security, asset inheritance planning. Style: dark navy blue (#1E3A5F) background with warm gold (#C8953D) shield-like geometric shapes, abstract safe/vault patterns, layered protection circles. Modern, premium, trustworthy. No text, no people, no letters."
    },
]


def generate_image(course):
    course_id = course["id"]
    prompt = course["prompt"]
    output_png = os.path.join(OUTPUT_DIR, f"cover-{course_id}.png")
    output_webp = os.path.join(OUTPUT_DIR, f"cover-{course_id}.webp")

    print(f"  Generating: {course_id}...", flush=True)

    payload = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  ERROR for {course_id}: {e}")
        return False

    # Extract image from response
    try:
        images = data["choices"][0]["message"].get("images", [])
        if not images:
            print(f"  No image returned for {course_id}")
            print(f"  Response keys: {list(data['choices'][0]['message'].keys())}")
            return False

        url = images[0]["image_url"]["url"]
        if url.startswith("data:"):
            b64_data = url.split(",", 1)[1]
            img_bytes = base64.b64decode(b64_data)

            # Save PNG first
            with open(output_png, "wb") as f:
                f.write(img_bytes)

            # Convert to WebP using ffmpeg (resize to 1200 wide, quality 80)
            result = subprocess.run(
                ["ffmpeg", "-y", "-i", output_png,
                 "-vf", "scale=1200:-1",
                 "-c:v", "libwebp", "-q:v", "80",
                 output_webp],
                capture_output=True, text=True,
            )
            if result.returncode != 0:
                print(f"  ffmpeg error: {result.stderr.strip()[:200]}")
                # Keep as PNG
                output_webp = output_png
            else:
                os.remove(output_png)

            size_kb = os.path.getsize(output_webp) / 1024
            print(f"  Saved: {os.path.basename(output_webp)} ({size_kb:.0f} KB)")
            return True
    except (KeyError, IndexError) as e:
        print(f"  Parse error for {course_id}: {e}")
        return False


if __name__ == "__main__":
    print("=== Generating Course Cover Images ===\n")
    success = 0
    for course in COURSES:
        if generate_image(course):
            success += 1
    print(f"\nDone: {success}/{len(COURSES)} images generated.")
