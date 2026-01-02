# Claude Code Development Guide

このリポジトリで動作する Claude Code の行動指針です。

---

## Priority Rules

| 優先度 | ルール |
|--------|--------|
| 1 | [Core Constitution](.claude/skills/nick-q/constitution/core.md) |
| 2 | Vision / Domain / Screen / Feature Spec |
| 3 | 不明点は Clarify でエスカレーション（推測禁止） |

---

## Workflow Routing

開発依頼の処理は [SKILL.md](.claude/skills/nick-q/SKILL.md) の Entry セクションで行われます。
SKILL.md を読み込んで指示に従ってください。

### クイックリファレンス

| 依頼タイプ | Input | 処理先 |
|-----------|-------|--------|
| 機能追加 | 必須 | feature.md |
| バグ修正 | 必須 | fix.md |
| Spec 変更 | 必須 | change.md |
| Issue 実装 | 状態依存 | SKILL.md で判定 |
| 小さな変更 | 不要 | implement.md or 誘導 |
| 新規プロジェクト | 必須 | project-setup.md |

> **詳細:** [SKILL.md](.claude/skills/nick-q/SKILL.md) Section 2 (Entry) を参照

ワークフローファイルは `.claude/skills/nick-q/workflows/` にあります。

---

## Core Flow

```
Entry (vision/add/fix/change/issue/quick/setup)
    ↓
入力検証（必須項目確認）
    ↓
ワイヤーフレーム処理（画像/ファイルあれば）
    ↓
QA ドキュメント生成（必須）
    ↓
QA 回答分析 + AskUserQuestion（残り不明点を対話解消）
    ↓
Spec 作成（QA 結果を反映）
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
★ SPEC GATE チェック ★
    │
    ├─ [NEEDS CLARIFICATION] > 0
    │     └─→ BLOCKED_CLARIFY → Clarify → Multi-Review へ戻る
    │
    ├─ [PENDING OVERVIEW CHANGE] > 0 (Feature/Fix のみ)
    │     └─→ BLOCKED_OVERVIEW → Overview Change → Multi-Review へ戻る
    │
    └─ すべてのマーカー = 0
        ├─ [DEFERRED] = 0 → PASSED → [HUMAN_CHECKPOINT]
        └─ [DEFERRED] ≥ 1 → PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT]（リスク確認）
    ↓
Plan → [HUMAN_CHECKPOINT]
    ↓
Tasks → Implement → E2E → PR
```

### SPEC GATE

- **Plan に進む前提条件:** `[NEEDS CLARIFICATION]` = 0 かつ `[PENDING OVERVIEW CHANGE]` = 0
- 曖昧点や未処理の Overview 変更が残った状態での実装は禁止

---

## Quick Input Files

ユーザーが事前に記入している場合があります：

| ファイル | タイミング |
|----------|-----------|
| `.specify/input/project-setup-input.md` | setup ワークフロー |
| `.specify/input/add-input.md` | add ワークフロー (feature.md) |
| `.specify/input/fix-input.md` | fix ワークフロー (fix.md) |
| `.specify/input/change-input.md` | change ワークフロー (change.md) |

**存在すれば読み込んで活用してください。**

---

## MCP Tools

### Context7（ライブラリドキュメント）

```
resolve-library-id → get-library-docs
```

- 実装時に最新のライブラリドキュメントを参照

### Serena（LSP 連携）

```
goToDefinition, findReferences, hover, documentSymbol
```

- コード解析、定義ジャンプ、リファレンス検索

### Claude in Chrome（E2E テスト）

```
tabs_context_mcp → tabs_create_mcp → navigate → find → form_input → computer
```

- ブラウザ操作、スクリーンショット、GIF 記録

---

## Quality Checkpoints

### [HUMAN_CHECKPOINT] タイミング

| タイミング | 確認内容 |
|-----------|---------|
| project-setup 完了後 | Overview Specs（Vision/Domain/Screen）の妥当性 |
| Feature Spec 作成後 | 要件の妥当性、SPEC GATE |
| Fix Spec 作成後 | 修正方針の妥当性、SPEC GATE |
| Plan 作成後 | 実装計画の承認 |
| E2E テスト後 | テスト結果の確認 |

### Multi-Review 観点

> **SSOT:** [quality-gates.md#multi-review](.claude/skills/nick-q/constitution/quality-gates.md#multi-review) 参照

A: 構造・形式 | B: 内容・整合性 | C: 完全性・網羅性

---

## Git Rules

| タイプ | ブランチ |
|--------|---------|
| Spec 変更 | `spec/<issue>-<slug>` |
| 機能追加 | `feature/<issue>-<slug>` |
| バグ修正 | `fix/<issue>-<slug>` |

- `main` への直接 push 禁止
- 常に Issue 連動ブランチで作業

---

## Scripts

```bash
# 状態管理
node .claude/skills/nick-q/scripts/state.cjs query --all
node .claude/skills/nick-q/scripts/state.cjs init

# Quick Input
node .claude/skills/nick-q/scripts/reset-input.cjs vision|add|fix
node .claude/skills/nick-q/scripts/preserve-input.cjs vision
node .claude/skills/nick-q/scripts/preserve-input.cjs add --feature {feature-id}
node .claude/skills/nick-q/scripts/preserve-input.cjs fix --fix {fix-id}
node .claude/skills/nick-q/scripts/preserve-input.cjs design

# Lint・検証
node .claude/skills/nick-q/scripts/spec-lint.cjs
node .claude/skills/nick-q/scripts/validate-matrix.cjs
node .claude/skills/nick-q/scripts/spec-metrics.cjs

# Spec・Matrix 生成
node .claude/skills/nick-q/scripts/scaffold-spec.cjs --kind <type> --id <id> --title <title>
node .claude/skills/nick-q/scripts/generate-matrix-view.cjs

# Git・PR
node .claude/skills/nick-q/scripts/branch.cjs --type <type> --slug <slug> --issue <num>
node .claude/skills/nick-q/scripts/pr.cjs

# テンプレート更新
node .claude/skills/nick-q/scripts/update.cjs --check  # 更新確認
node .claude/skills/nick-q/scripts/update.cjs          # 更新実行
```

---

## Principles

1. **Spec-First** - すべての変更は仕様から
2. **Multi-Review 必須** - Spec 作成後は必ず 3 観点レビュー
3. **推測禁止** - 不明点は Clarify で解消
4. **HUMAN_CHECKPOINT** - 重要な判断は人間確認
5. **小さな変更** - レビューしやすい単位で

---

## Reference

| Document | Description |
|----------|-------------|
| [constitution/](.claude/skills/nick-q/constitution/) | Engineering Constitution（core.md, quality-gates.md 等） |
| [SKILL.md](.claude/skills/nick-q/SKILL.md) | Skill 定義・ルーティング |
| [docs/](docs/) | 詳細ドキュメント |
