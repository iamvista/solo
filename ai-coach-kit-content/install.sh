#!/bin/bash
set -e

echo ""
echo "🚀 AI 一人公司作業系統 — 安裝程式"
echo "===================================="
echo ""

# Check Claude Code
if ! command -v claude &> /dev/null; then
    echo "⚠️  未偵測到 Claude Code CLI"
    echo "   請先安裝：npm install -g @anthropic-ai/claude-code"
    echo "   或參考：https://docs.anthropic.com/claude-code"
    echo ""
    read -p "是否繼續安裝 Skills？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

SKILLS_DIR="$HOME/.claude/commands"
mkdir -p "$SKILLS_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SOURCE="$SCRIPT_DIR/skills"

if [ ! -d "$SKILLS_SOURCE" ]; then
    echo "❌ 找不到 skills 資料夾，請確認檔案結構完整。"
    exit 1
fi

echo "📦 正在安裝 Skills..."
echo ""
INSTALLED=0
for skill_file in "$SKILLS_SOURCE"/*.md; do
    if [ -f "$skill_file" ]; then
        filename=$(basename "$skill_file")
        cp "$skill_file" "$SKILLS_DIR/$filename"
        echo "   ✅ $filename"
        INSTALLED=$((INSTALLED + 1))
    fi
done

echo ""
echo "共安裝 $INSTALLED 個 Skills"
echo ""

# Create workspace
DEFAULT_WORK_DIR="$HOME/solo-workspace"
read -p "📁 工作目錄位置？（預設：$DEFAULT_WORK_DIR）: " WORK_DIR
WORK_DIR="${WORK_DIR:-$DEFAULT_WORK_DIR}"

mkdir -p "$WORK_DIR"/{seeds,research,drafts,published,clients,brand,journal}

# Install coach templates
COACH_SOURCE="$SCRIPT_DIR/coach"
if [ -d "$COACH_SOURCE" ]; then
    mkdir -p "$WORK_DIR/coach"
    for coach_file in "$COACH_SOURCE"/*.md; do
        if [ -f "$coach_file" ]; then
            filename=$(basename "$coach_file")
            cp "$coach_file" "$WORK_DIR/coach/$filename"
            echo "   🎯 $filename"
        fi
    done
    echo ""
    echo "教練模組已安裝"
fi
cp "$SCRIPT_DIR/config-template.md" "$WORK_DIR/config.md"
cp "$SCRIPT_DIR/CLAUDE.md" "$WORK_DIR/CLAUDE.md"

echo ""
echo "===================================="
echo "🎉 安裝完成！"
echo ""
echo "📁 工作目錄：$WORK_DIR"
echo ""
echo "已安裝的 Skills："
echo "   /solo-idea        — 捕捉靈感，產出種子卡片"
echo "   /solo-research    — 深度研究，產出研究摘要"
echo "   /solo-write       — 撰寫文章（初稿→去AI味→風格校準）"
echo "   /solo-distribute  — 多平臺內容分發"
echo "   /solo-brand       — 品牌定位、風格檔案、電梯簡報"
echo "   /solo-client      — 客戶研究、提案準備、跟進追蹤"
echo "   /solo-bizplan     — 商業模式設計與定價策略"
echo "   /solo-morning     — 每日晨間簡報"
echo "   /solo-review      — 每日覆盤"
echo "   /solo-pilot       — 整合指揮（每日迴圈＋新手導覽）"
echo ""
echo "教練系統："
echo "   /solo-coach          — 啟動教練、初始化實驗"
echo "   /solo-coach-morning  — 每日晨間覆盤"
echo "   /solo-coach-checkin  — 下午進度回報"
echo "   /solo-coach-weekly   — 每週總結與實驗設計"
echo ""
echo "🎯 下一步："
echo "   1. cd $WORK_DIR"
echo "   2. 用文字編輯器打開 config.md，填寫你的個人資料"
echo "   3. claude"
echo "   4. 輸入 /solo-pilot 開始新手導覽"
echo "   5. 輸入 /solo-coach 啟動你的 AI 教練"
echo ""
