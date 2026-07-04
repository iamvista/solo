const body = `# robots.txt for solo.tw
# https://www.solo.tw

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /settings/
Disallow: /auth/
Disallow: /api/
Disallow: /r/

# Content Signals (https://contentsignals.org/, draft-romm-aipref-contentsignals)
# 允許搜尋引用與即時 AI 回答，但不允許模型訓練
Content-Signal: search=yes, ai-input=yes, ai-train=no

# ✅ 允許 AI 搜尋引用
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Google-Extended
Allow: /

# ❌ 封鎖 AI 模型訓練
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: Applebot-Extended
Disallow: /

Sitemap: https://www.solo.tw/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
