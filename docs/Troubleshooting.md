# Troubleshooting

よくある問題と解決方法です。

---

## Installation Issues

### GitHub CLI が認証されていない

**症状:**
```
gh: error: authentication required
```

**解決:**
```bash
gh auth login
```

### state.js がエラーを出す

**症状:**
```
Error: Cannot find module ...
```

**解決:**
```bash
# Node.js がインストールされているか確認
node --version

# .specify/state/ ディレクトリが存在するか確認
ls .specify/state/

# 状態を初期化
node .specify/scripts/state.js init
```

---

## Command Issues

### `/speckit.vision` で Vision Spec が作成されない

**症状:**
- コマンドが実行されるが spec.md が作成されない

**原因:**
- `.specify/specs/vision/` ディレクトリが存在しない
- scaffold-spec.js のパスが間違っている

**解決:**
```bash
# 手動でディレクトリ作成
mkdir -p .specify/specs/vision

# scaffold-spec.js を直接実行
node .specify/scripts/scaffold-spec.js --kind vision --id S-VISION-001 --title "Project Name"
```

---

### `/speckit.design` が Feature Issue を作成できない

**症状:**
```
gh: error: HTTP 401: Bad credentials
```

**解決:**
```bash
# GitHub CLI の認証状態を確認
gh auth status

# 再認証
gh auth login

# リポジトリへのアクセス権を確認
gh repo view
```

---

### `/speckit.issue` で Issue が表示されない

**症状:**
- Issue 一覧が空

**原因:**
- Issue に `feature` ラベルがない
- Issue がクローズされている

**解決:**
```bash
# 全 Issue を確認
gh issue list --state all

# ラベルを追加
gh issue edit <num> --add-label feature --add-label backlog
```

---

## State Management Issues

### Branch 状態が更新されない

**症状:**
- `state.js query --branch` が古い情報を返す

**解決:**
```bash
# 現在のブランチを確認
git branch --show-current

# 状態を手動更新
node .specify/scripts/state.js branch --set-step implement

# 状態ファイルを確認
cat .specify/state/branch-state.json
```

---

### 中断したブランチが見つからない

**症状:**
- `state.js query --suspended` が空

**解決:**
```bash
# 全状態を確認
node .specify/scripts/state.js query --all

# branch-state.json を直接確認
cat .specify/state/branch-state.json | jq '.branches | to_entries[] | select(.value.suspended)'
```

---

## Spec Lint Issues

### spec-lint.js が Feature を検出しない

**症状:**
```
Features: 0 found
```

**原因:**
- spec.md ファイルの `Spec Type: Feature` が正しく設定されていない
- ファイル名が `spec.md` でない

**解決:**
```bash
# Spec ファイルの先頭を確認
head -10 .specify/specs/<feature-id>/spec.md

# Spec Type が正しいか確認
grep "Spec Type:" .specify/specs/*/spec.md
```

---

### Domain freshness 警告が出る

**症状:**
```
⚠ S-XXX-001: 7+ days older than Domain
```

**原因:**
- Domain Spec が更新された後、Feature Spec が更新されていない

**解決:**
1. Feature Spec を確認し、Domain 変更が影響するか確認
2. 影響がある場合: Feature Spec を更新
3. 影響がない場合: Feature Spec の Changelog にメモを追加（最終更新日が更新される）

---

## Git Issues

### ブランチ作成に失敗する

**症状:**
```
fatal: A branch named 'feature/123-xxx' already exists
```

**解決:**
```bash
# 既存ブランチを確認
git branch -a | grep 123

# 既存ブランチを削除（必要に応じて）
git branch -d feature/123-xxx

# または別の名前で作成
node .specify/scripts/branch.js --type feature --slug xxx-v2 --issue 123
```

---

### PR 作成に失敗する

**症状:**
```
gh: error: pull request create failed: ...
```

**原因:**
- リモートにブランチがプッシュされていない
- ベースブランチが存在しない

**解決:**
```bash
# ブランチをプッシュ
git push -u origin $(git branch --show-current)

# PR を手動作成
gh pr create --title "Title" --body "Description"
```

---

## Clarify Loop Issues

### Clarify が終わらない

**症状:**
- `[NEEDS CLARIFICATION]` が残り続ける

**解決:**
1. Spec ファイルを開いて `[NEEDS CLARIFICATION]` を検索
2. 手動で該当箇所を埋める
3. `/speckit.clarify` を再実行

```bash
# NEEDS CLARIFICATION を検索
grep -rn "NEEDS CLARIFICATION" .specify/specs/
```

---

### Clarify の回答が Spec に反映されない

**症状:**
- 回答したが Spec が更新されていない

**解決:**
1. Spec ファイルを直接確認
2. AI に明示的に更新を依頼
3. 手動で更新

---

## Performance Issues

### spec-metrics.js が遅い

**症状:**
- メトリクス収集に時間がかかる

**解決:**
- Spec ファイル数が多い場合は正常
- `.specify/specs/` 以下に不要なファイルがないか確認

---

## Recovery Procedures

### プロジェクト状態のリセット

**注意:** データが失われる可能性があります

```bash
# 状態ファイルのみリセット
rm .specify/state/*.json
node .specify/scripts/state.js init

# 全 Spec を残して状態のみリセット
# Spec は .specify/specs/ に残ります
```

---

### 破損した状態ファイルの修復

```bash
# バックアップがある場合
cp .specify/state/repo-state.json.bak .specify/state/repo-state.json

# バックアップがない場合、初期化して再構築
node .specify/scripts/state.js init

# 既存 Spec から状態を再構築
# Vision があれば
node .specify/scripts/state.js repo --set-vision-status approved

# Domain があれば
node .specify/scripts/state.js repo --set-domain-status approved
```

---

## Getting Help

### ログの確認

```bash
# Git ログ
git log --oneline -10

# 状態ファイル
cat .specify/state/repo-state.json
cat .specify/state/branch-state.json
```

### 追加リソース

- `.specify/guides/error-recovery.md` - エラーリカバリーガイド
- `.specify/guides/parallel-development.md` - 並行開発ガイド
- `.specify/memory/constitution.md` - Engineering Constitution

---

## Related Pages

- [[Getting-Started]] - 初期セットアップ
- [[Scripts-Reference]] - スクリプトの詳細
- [[Commands-Reference]] - コマンドの詳細
