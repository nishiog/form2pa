#!/bin/bash
# Git branch作成・プッシュスクリプト
# Usage: ./git-branch-push.sh <branch-name> [commit-message]

set -e

BRANCH_NAME=$1
COMMIT_MSG=$2

if [ -z "$BRANCH_NAME" ]; then
    echo "Error: ブランチ名を指定してください"
    echo "Usage: $0 <branch-name> [commit-message]"
    exit 1
fi

# 現在の状態を確認
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  未コミットの変更があります"
    git status --short
    
    if [ -z "$COMMIT_MSG" ]; then
        echo ""
        read -p "コミットメッセージを入力してください: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            echo "Error: コミットメッセージが必要です"
            exit 1
        fi
    fi
    
    echo "📝 変更をコミットします..."
    git add -A
    git commit -m "$COMMIT_MSG"
fi

# ブランチを作成
echo "🌿 ブランチを作成します: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# リモートにプッシュ
echo "🚀 リモートにプッシュします..."
git push -u origin "$BRANCH_NAME"

echo ""
echo "✅ 完了!"
echo "📋 PR作成URL: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/pull/new/$BRANCH_NAME"

