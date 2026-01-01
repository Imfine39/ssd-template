# Migration Completion Plan

**作成日:** 2026-01-01
**目的:** サブスキル統合を完了し、旧構造を削除する
**スコープ:** 構造統合のみ（品質改善は別計画）

---

## Executive Summary

| 項目 | 内容 |
|------|------|
| 目標 | spec-mesh への統合を完了、旧サブスキル削除 |
| 対象ファイル | 約40ファイル |
| 推定作業時間 | 2-3時間 |
| リスク | 低（ドキュメント変更のみ） |

---

## Phase 1: 参照パス修正（Critical）

### 1.1 Shared Workflows の参照修正

| ファイル | 行 | 修正内容 |
|---------|-----|---------|
| `workflows/shared/_quality-flow.md` | 108 | `../../spec-mesh-quality/workflows/review.md` → `../review.md` |
| `workflows/shared/_vision-interview.md` | 396-406 | `spec-mesh-entry/workflows/*` → `../*.md` |
| `workflows/shared/_cascade-update.md` | 複数 | `spec-mesh-meta/workflows/*` → `../*.md` |
| `workflows/shared/_finalize.md` | 34-39 | スクリプト名統一 |

### 1.2 Guides の参照修正

| ファイル | 行 | 修正内容 |
|---------|-----|---------|
| `guides/human-checkpoint-patterns.md` | 291-293 | `spec-mesh-*/workflows/*` → `../workflows/*.md` |

### 1.3 旧サブスキルワークフローの参照修正

| ファイル | 修正内容 |
|---------|---------|
| `spec-mesh-develop/workflows/feedback.md` | `shared/impact-analysis.md` → 正しい相対パス |
| `spec-mesh-meta/workflows/change.md` | `shared/impact-analysis.md` → 正しい相対パス |
| `spec-mesh-entry/workflows/quick.md` | `shared/impact-analysis.md` → 正しい相対パス |

---

## Phase 2: 固有内容の移行

### 2.1 vision.md への移行

**移行元:** `spec-mesh-entry/workflows/vision.md`
**移行先:** `spec-mesh/workflows/vision.md`

**移行内容:**
- Vision Interview 3フェーズの詳細説明
- Phase 1: 現状把握の質問リスト
- Phase 2: 理想状態の質問リスト
- Phase 3: Feature候補の質問リスト

### 2.2 add.md への移行

**移行元:** `spec-mesh-entry/workflows/add.md`
**移行先:** `spec-mesh/workflows/add.md`

**移行内容:**
- Deep Interview 呼び出し詳細
- Pending Additions 処理の詳細

### 2.3 implement.md への移行

**移行元:** `spec-mesh-develop/workflows/implement.md`
**移行先:** `spec-mesh/workflows/implement.md`

**移行内容:**
- Context7 使用手順
- Serena 使用手順

### 2.4 e2e.md への移行

**移行元:** `spec-mesh-test/workflows/e2e.md`
**移行先:** `spec-mesh/workflows/e2e.md`

**移行内容:**
- Chrome Extension 操作詳細
- セッション開始手順
- GIF 記録手順

### 2.5 review.md への移行

**移行元:** `spec-mesh-quality/workflows/review.md`
**移行先:** `spec-mesh/workflows/review.md`

**移行内容:**
- Multi-Review Agent 起動詳細
- 3観点の具体的なチェック項目

### 2.6 clarify.md への移行

**移行元:** `spec-mesh-quality/workflows/clarify.md`
**移行先:** `spec-mesh/workflows/clarify.md`

**移行内容:**
- 4問バッチ質問ロジック
- ループ処理の詳細

---

## Phase 3: 重複ファイル削除

### 3.1 guide/workflow-map.md 削除

```bash
rm .claude/skills/guide/workflow-map.md
```

**理由:** `spec-mesh/guides/workflow-map.md` と完全重複

---

## Phase 4: 旧サブスキル削除

### 4.1 削除前確認コマンド

```bash
# 旧構造への参照が0件であることを確認
grep -r "spec-mesh-entry/" .claude/skills/spec-mesh/
grep -r "spec-mesh-develop/" .claude/skills/spec-mesh/
grep -r "spec-mesh-quality/" .claude/skills/spec-mesh/
grep -r "spec-mesh-test/" .claude/skills/spec-mesh/
grep -r "spec-mesh-meta/" .claude/skills/spec-mesh/
```

### 4.2 削除対象

```
.claude/skills/spec-mesh-entry/
├── SKILL.md
└── workflows/
    ├── add.md
    ├── design.md
    ├── fix.md
    ├── issue.md
    ├── quick.md
    └── vision.md

.claude/skills/spec-mesh-develop/
├── SKILL.md
└── workflows/
    ├── feedback.md
    ├── implement.md
    ├── plan.md
    └── tasks.md

.claude/skills/spec-mesh-quality/
├── SKILL.md
└── workflows/
    ├── analyze.md
    ├── checklist.md
    ├── clarify.md
    ├── lint.md
    └── review.md

.claude/skills/spec-mesh-test/
├── SKILL.md
└── workflows/
    ├── e2e.md
    └── test-scenario.md

.claude/skills/spec-mesh-meta/
├── SKILL.md
└── workflows/
    ├── change.md
    ├── featureproposal.md
    └── pr.md
```

---

## Phase 5: 外部ドキュメント更新

### 5.1 docs/ 更新

| ファイル | 更新内容 |
|---------|---------|
| `docs/Development-Flow.md` | 旧構造参照があれば修正 |
| `docs/Workflows-Reference.md` | 旧構造参照があれば修正 |
| `docs/Getting-Started.md` | 旧構造参照があれば修正 |

### 5.2 README.md 更新

構造説明があれば新構造に更新

---

## Phase 6: 検証

### 6.1 参照チェック

```bash
# 旧構造への参照が0件
grep -r "spec-mesh-entry" .claude/
grep -r "spec-mesh-develop" .claude/
grep -r "spec-mesh-quality" .claude/
grep -r "spec-mesh-test" .claude/
grep -r "spec-mesh-meta" .claude/
```

### 6.2 Lint 実行

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### 6.3 ワークフロー動作確認

主要ワークフローが正常に Read できることを確認

---

## 実行チェックリスト

**完了日:** 2026-01-01

### Phase 1: 参照パス修正 ✅
- [x] _quality-flow.md 修正
- [x] _vision-interview.md 修正
- [x] _cascade-update.md 修正
- [x] _finalize.md 修正
- [x] human-checkpoint-patterns.md 修正
- [x] 旧サブスキルワークフローのパス修正

### Phase 2: 固有内容移行 ✅
- [x] vision.md への移行
- [x] add.md への移行
- [x] implement.md への移行
- [x] e2e.md への移行
- [x] review.md への移行
- [x] clarify.md への移行

### Phase 3: 重複ファイル削除 ✅
- [x] guide/workflow-map.md 削除

### Phase 4: 旧サブスキル削除 ✅
- [x] 参照0件確認
- [x] spec-mesh-entry 削除
- [x] spec-mesh-develop 削除
- [x] spec-mesh-quality 削除
- [x] spec-mesh-test 削除
- [x] spec-mesh-meta 削除

### Phase 5: 外部ドキュメント更新 ✅
- [x] docs/ 確認・更新（旧構造参照なし確認済み）
- [x] README.md 確認・更新（旧構造参照なし確認済み）

### Phase 6: 検証 ✅
- [x] 参照チェック合格（.claude/ 内に旧構造参照0件）
- [x] Lint 合格（テンプレートリポジトリのため spec なし）
- [x] 動作確認完了

---

## ロールバック手順

問題発生時：
```bash
git checkout -- .claude/skills/
```

---

## 完了条件

1. 旧サブスキルディレクトリが存在しない
2. 旧構造への参照が0件
3. 全ワークフローが正常に動作する
4. Lint がエラーなしで完了する
