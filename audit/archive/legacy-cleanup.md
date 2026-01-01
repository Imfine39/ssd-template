# Legacy Workflow Cleanup Guide

**作成日:** 2026-01-01

---

## 概要

統合前の旧サブスキル（spec-mesh-entry, spec-mesh-develop, spec-mesh-quality, spec-mesh-test, spec-mesh-meta）のワークフローを分析し、削除可否を判定しました。

---

## サブスキル削除判定

### SKILL.md 削除可否

| サブスキル | 削除可否 | 理由 |
|-----------|---------|------|
| spec-mesh-entry/SKILL.md | ✅ 削除可 | spec-mesh/SKILL.mdに統合済み |
| spec-mesh-develop/SKILL.md | ✅ 削除可 | spec-mesh/SKILL.mdに統合済み |
| spec-mesh-quality/SKILL.md | ✅ 削除可 | spec-mesh/SKILL.mdに統合済み |
| spec-mesh-test/SKILL.md | ✅ 削除可 | spec-mesh/SKILL.mdに統合済み |
| spec-mesh-meta/SKILL.md | ✅ 削除可 | spec-mesh/SKILL.mdに統合済み |
| guide/SKILL.md | ❌ 削除不可 | 独自機能（ワークフロー案内）を提供 |

---

## ワークフロー別削除判定

### 即時削除可能（完全移行済み）

| 旧ファイル | 新ファイル | 差分 | 判定 |
|-----------|-----------|------|------|
| spec-mesh-develop/workflows/plan.md | spec-mesh/workflows/plan.md | なし | ✅ 削除可 |
| spec-mesh-quality/workflows/analyze.md | spec-mesh/workflows/analyze.md | なし | ✅ 削除可 |
| spec-mesh-quality/workflows/checklist.md | spec-mesh/workflows/checklist.md | なし | ✅ 削除可 |
| spec-mesh-meta/workflows/featureproposal.md | spec-mesh/workflows/featureproposal.md | なし | ✅ 削除可 |

### 条件付き削除可能（軽微な差分あり）

| 旧ファイル | 新ファイル | 差分内容 | 判定 |
|-----------|-----------|---------|------|
| spec-mesh-entry/workflows/fix.md | spec-mesh/workflows/fix.md | Quick Input読込処理の詳細度 | ⚠️ 確認後削除可 |
| spec-mesh-entry/workflows/quick.md | spec-mesh/workflows/quick.md | 軽微なフォーマット差 | ⚠️ 確認後削除可 |
| spec-mesh-quality/workflows/lint.md | spec-mesh/workflows/lint.md | エラーメッセージ文言 | ⚠️ 確認後削除可 |
| spec-mesh-test/workflows/test-scenario.md | spec-mesh/workflows/test-scenario.md | UC/FR基準の記述差 | ⚠️ 確認後削除可 |
| spec-mesh-meta/workflows/change.md | spec-mesh/workflows/change.md | impact-analysisパス | ⚠️ パス修正後削除可 |
| spec-mesh-meta/workflows/pr.md | spec-mesh/workflows/pr.md | コマンド例のフォーマット | ⚠️ 確認後削除可 |

### 内容移行が必要（固有内容あり）

| 旧ファイル | 新ファイル | 移行が必要な内容 | 判定 |
|-----------|-----------|----------------|------|
| spec-mesh-entry/workflows/vision.md | spec-mesh/workflows/vision.md | Vision Interview 3フェーズの詳細 | ⚠️ 移行後削除 |
| spec-mesh-entry/workflows/design.md | spec-mesh/workflows/design.md | Matrix生成の詳細手順 | ⚠️ 移行後削除 |
| spec-mesh-entry/workflows/add.md | spec-mesh/workflows/add.md | Deep Interview呼び出し詳細 | ⚠️ 移行後削除 |
| spec-mesh-entry/workflows/issue.md | spec-mesh/workflows/issue.md | Issue分類ロジック | ⚠️ 移行後削除 |
| spec-mesh-develop/workflows/tasks.md | spec-mesh/workflows/tasks.md | フェーズ分割の詳細 | ⚠️ 移行後削除 |
| spec-mesh-develop/workflows/implement.md | spec-mesh/workflows/implement.md | Context7/Serena使用手順 | ⚠️ 移行後削除 |
| spec-mesh-develop/workflows/feedback.md | spec-mesh/workflows/feedback.md | Cascade Update呼び出し | ⚠️ 移行後削除 |
| spec-mesh-quality/workflows/review.md | spec-mesh/workflows/review.md | Multi-Review Agent起動詳細 | ⚠️ 移行後削除 |
| spec-mesh-quality/workflows/clarify.md | spec-mesh/workflows/clarify.md | 4問バッチ質問ロジック | ⚠️ 移行後削除 |
| spec-mesh-test/workflows/e2e.md | spec-mesh/workflows/e2e.md | Chrome Extension操作詳細 | ⚠️ 移行後削除 |

---

## 移行詳細

### vision.md の移行内容

**旧ファイル固有の内容:**
```markdown
## Vision Interview 3フェーズ

### Phase 1: 現状把握
- 現在の業務フロー
- 既存システムの課題
- ステークホルダー

### Phase 2: 理想状態
- あるべき姿
- 成功の定義
- KPI

### Phase 3: Feature候補
- 機能洗い出し
- 優先順位付け
- スコープ確認
```

**移行先:** `spec-mesh/workflows/vision.md` のStep 3に統合

---

### add.md の移行内容

**旧ファイル固有の内容:**
```markdown
## Deep Interview

### 質問カテゴリ
1. ユーザー視点の深掘り
2. エッジケースの探索
3. 依存関係の確認
4. 非機能要件の確認

### 潜在課題の発掘
- 「他に考慮すべきことはありますか？」
- 「このケースではどうなりますか？」
```

**移行先:** `spec-mesh/workflows/shared/_deep-interview.md` に集約済み
**確認事項:** add.mdから_deep-interview.mdへの参照が正しいか

---

### implement.md の移行内容

**旧ファイル固有の内容:**
```markdown
## MCP Tools 使用

### Context7
```bash
# ライブラリドキュメント取得
resolve-library-id → get-library-docs
```

### Serena
```bash
# コード解析
goToDefinition, findReferences, hover
```
```

**移行先:** `spec-mesh/workflows/implement.md` のStep内に記載確認

---

### e2e.md の移行内容

**旧ファイル固有の内容:**
```markdown
## Chrome Extension 操作

### セッション開始
1. tabs_context_mcp でタブ情報取得
2. tabs_create_mcp で新規タブ作成
3. navigate で URL 遷移

### テスト実行
1. find で要素検索
2. form_input でフォーム入力
3. computer でクリック

### 記録
1. gif_creator で GIF 開始
2. screenshot で静止画
3. GIF エクスポート
```

**移行先:** `spec-mesh/workflows/e2e.md` に記載確認

---

## 削除実行計画

### Phase 1: 即時削除（差分なし）

```bash
# 削除対象
rm .claude/skills/spec-mesh-develop/workflows/plan.md
rm .claude/skills/spec-mesh-quality/workflows/analyze.md
rm .claude/skills/spec-mesh-quality/workflows/checklist.md
rm .claude/skills/spec-mesh-meta/workflows/featureproposal.md
```

### Phase 2: 確認後削除（軽微な差分）

```bash
# 差分確認
diff .claude/skills/spec-mesh-entry/workflows/fix.md .claude/skills/spec-mesh/workflows/fix.md
diff .claude/skills/spec-mesh-entry/workflows/quick.md .claude/skills/spec-mesh/workflows/quick.md
# ... 他ファイル

# 確認後削除
rm .claude/skills/spec-mesh-entry/workflows/fix.md
rm .claude/skills/spec-mesh-entry/workflows/quick.md
# ...
```

### Phase 3: 内容移行後削除

1. 旧ファイルの固有内容を新ファイルに移行
2. 移行完了を確認
3. 旧ファイルを削除

```bash
# 移行完了後
rm .claude/skills/spec-mesh-entry/workflows/vision.md
rm .claude/skills/spec-mesh-entry/workflows/design.md
rm .claude/skills/spec-mesh-entry/workflows/add.md
rm .claude/skills/spec-mesh-entry/workflows/issue.md
rm .claude/skills/spec-mesh-develop/workflows/tasks.md
rm .claude/skills/spec-mesh-develop/workflows/implement.md
rm .claude/skills/spec-mesh-develop/workflows/feedback.md
rm .claude/skills/spec-mesh-quality/workflows/review.md
rm .claude/skills/spec-mesh-quality/workflows/clarify.md
rm .claude/skills/spec-mesh-test/workflows/e2e.md
```

### Phase 4: サブスキル SKILL.md 削除

```bash
# 全ワークフロー削除後
rm .claude/skills/spec-mesh-entry/SKILL.md
rm .claude/skills/spec-mesh-develop/SKILL.md
rm .claude/skills/spec-mesh-quality/SKILL.md
rm .claude/skills/spec-mesh-test/SKILL.md
rm .claude/skills/spec-mesh-meta/SKILL.md

# ディレクトリ削除
rmdir .claude/skills/spec-mesh-entry/workflows
rmdir .claude/skills/spec-mesh-entry
rmdir .claude/skills/spec-mesh-develop/workflows
rmdir .claude/skills/spec-mesh-develop
rmdir .claude/skills/spec-mesh-quality/workflows
rmdir .claude/skills/spec-mesh-quality
rmdir .claude/skills/spec-mesh-test/workflows
rmdir .claude/skills/spec-mesh-test
rmdir .claude/skills/spec-mesh-meta/workflows
rmdir .claude/skills/spec-mesh-meta
```

---

## 参照更新が必要なファイル

削除前に以下のファイルの参照を更新:

| ファイル | 旧参照 | 新参照 |
|---------|-------|-------|
| _vision-interview.md | spec-mesh-entry/workflows/vision.md | ../vision.md |
| _cascade-update.md | spec-mesh-meta/workflows/* | ../*.md |
| human-checkpoint-patterns.md | spec-mesh-*/workflows/* | ../workflows/*.md |
| _finalize.md | spec-mesh-entry/workflows/* | ../workflows/*.md |

---

## 削除チェックリスト

### 削除前確認
- [ ] 旧ファイルへの参照がすべて更新されている
- [ ] 固有内容が新ファイルに移行されている
- [ ] 新ファイルでワークフローが正常動作する

### 削除後確認
- [ ] `grep -r "spec-mesh-entry" .claude/` で参照が0件
- [ ] `grep -r "spec-mesh-develop" .claude/` で参照が0件
- [ ] `grep -r "spec-mesh-quality" .claude/` で参照が0件
- [ ] `grep -r "spec-mesh-test" .claude/` で参照が0件
- [ ] `grep -r "spec-mesh-meta" .claude/` で参照が0件
- [ ] 全ワークフローが正常に動作する
