# ブランチ作成・コミット・プッシュ手順

## 基本ワークフロー

### 1. 変更内容の確認

```bash
# 現在の状態を確認
git status

# 変更内容を確認
git diff

# ステージングされた変更を確認
git diff --cached
```

### 2. ブランチの作成

```bash
# 新しいブランチを作成して切り替え
git checkout -b <branch-name>

# ブランチ名の例:
# - fix/bug-description
# - feature/feature-name
# - refactor/refactor-target
```

### 3. 変更のステージングとコミット

```bash
# すべての変更をステージング
git add -A

# または特定のファイルのみ
git add <file-path>

# 適切なコミットメッセージでコミット
git commit -m "Type: Brief description

詳細な説明（必要に応じて）
- 変更点1
- 変更点2"
```

#### コミットメッセージの形式（推奨）

```
<Type>: <Short description>

<Longer description if needed>
- <Bullet point 1>
- <Bullet point 2>
```

**Type例:**
- `Fix:` - バグ修正
- `Add:` - 機能追加
- `Update:` - 機能改善
- `Refactor:` - リファクタリング
- `Remove:` - 削除
- `Docs:` - ドキュメント更新

### 4. リモートにプッシュ

```bash
# ブランチをリモートにプッシュ（初回）
git push -u origin <branch-name>

# 2回目以降
git push
```

## 便利なコマンド

### コミット履歴の確認

```bash
# 最新のコミットを確認
git log --oneline -5

# 詳細なコミット情報
git show HEAD
```

### ブランチの確認

```bash
# ローカルブランチ一覧
git branch

# リモートブランチも含む
git branch -a

# 現在のブランチを確認
git branch --show-current
```

### コミットの修正

```bash
# 直前のコミットメッセージを修正
git commit --amend -m "New message"

# 直前のコミットに変更を追加
git add <file>
git commit --amend --no-edit

# 修正したコミットを強制プッシュ（注意: 既にプッシュ済みの場合）
git push -f origin <branch-name>
```

## トラブルシューティング

### プッシュエラー: リモートに新しいコミットがある

```bash
# リモートの変更を取得
git fetch origin

# リベースしてからプッシュ
git rebase origin/<branch-name>
git push
```

### コミットを取り消したい

```bash
# コミットを残しつつ変更を取り消し
git reset --soft HEAD~1

# コミットと変更を完全に取り消し（注意: 変更は失われます）
git reset --hard HEAD~1
```

## PR作成URL

プッシュ後、GitHubでPull Requestを作成:

```
https://github.com/<owner>/<repo>/compare/master...<branch-name>
```
