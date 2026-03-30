#!/bin/bash
# Generate course cover images using OpenRouter API (GPT-5 Image Mini)

API_KEY="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"
MODEL="openai/gpt-5-image-mini"
OUTPUT_DIR="/Users/vista/06_VibeCoding/01_Code_Products/solo/public/images/workshops"

generate_image() {
  local id=$1
  local prompt=$2
  local output_file="${OUTPUT_DIR}/cover-${id}.webp"

  echo "Generating cover for: ${id}..."

  response=$(curl -s "https://openrouter.ai/api/v1/chat/completions" \
    -H "Authorization: Bearer ${API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\": \"${MODEL}\",
      \"messages\": [
        {
          \"role\": \"user\",
          \"content\": \"${prompt}\"
        }
      ]
    }")

  # Extract base64 image data from response
  # The response contains inline_data with base64 encoded image
  image_url=$(echo "$response" | python3 -c "
import json, sys, base64
data = json.load(sys.stdin)
choices = data.get('choices', [])
if choices:
    msg = choices[0].get('message', {})
    content = msg.get('content', '')
    # Check if content is a list (multimodal response)
    if isinstance(content, list):
        for part in content:
            if part.get('type') == 'image_url':
                url = part.get('image_url', {}).get('url', '')
                if url.startswith('data:'):
                    # Extract base64 data
                    b64 = url.split(',', 1)[1]
                    sys.stdout.buffer.write(base64.b64decode(b64))
                    sys.exit(0)
                else:
                    print(url)
                    sys.exit(0)
    # Check for image in content string
    elif isinstance(content, str) and content.startswith('data:'):
        b64 = content.split(',', 1)[1]
        sys.stdout.buffer.write(base64.b64decode(b64))
        sys.exit(0)
print('NO_IMAGE')
sys.exit(1)
" 2>/dev/null)

  if [ $? -eq 0 ] && [ -f /dev/stdin ]; then
    echo "  Saved: ${output_file}"
  else
    echo "  Response: $(echo "$response" | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps(d, indent=2)[:500])" 2>/dev/null)"
  fi
}

echo "=== Generating Course Cover Images ==="
echo ""

# We'll generate one first to test the response format
generate_image "ai-command-center" "Generate a modern, abstract cover image for a professional workshop. Theme: AI productivity system, command center, automation. Style: minimal geometric shapes, dark navy blue (#1E3A5F) and gold (#C8953D) color scheme, with subtle tech circuit patterns. Clean, professional, no text. 16:9 aspect ratio. High quality digital art."

echo ""
echo "Done."
