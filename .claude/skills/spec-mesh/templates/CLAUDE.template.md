# Claude Code Development Guide

このリポジトリで動作する Claude Code の行動指針です。

---

## Priority Rules

| 優先度 | ルール |
|--------|--------|
| 1 | [Core Constitution](.claude/skills/spec-mesh/constitution/core.md) |
| 2 | Vision / Domain / Screen / Feature Spec |
| 3 | 不明点は Clarify でエスカレーション（推測禁止） |

---

## Workflow Routing

開発依頼の処理は [SKILL.md](.claude/skills/spec-mesh/SKILL.md) の Entry セクションで行われます。
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

> **詳細:** [SKILL.md](.claude/skills/spec-mesh/SKILL.md) Section 2 (Entry) を参照

ワークフローファイルは `.claude/skills/spec-mesh/workflows/` にあります。

---

## Core Flow

```
Entry (vision/add/fix/issue)
    ↓
入力検証（必須項目確認）
    ↓
Spec 作成
    ↓
深掘りインタビュー（必須）← AskUserQuestion で潜在課題を発掘
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
[NEEDS CLARIFICATION] あり? → YES: Clarify → Multi-Review へ戻る
    ↓ NO
★ CLARIFY GATE ★
    │
    ├─ [DEFERRED] = 0 → PASSED → [HUMAN_CHECKPOINT]
    │
    └─ [DEFERRED] ≥ 1 → PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT]（リスク確認）
    ↓
Plan → [HUMAN_CHECKPOINT]
    ↓
Tasks → Implement → E2E → PR
```

### CLARIFY GATE

- **Plan に進む前提条件:** `[NEEDS CLARIFICATION]` = 0
- 曖昧点が残った状態での実装は禁止

---

## Quick Input Files

ユーザーが事前に記入している場合があります：

| ファイル | タイミング |
|----------|-----------|
| `.specify/input/vision-input.md` | vision ワークフロー |
| `.specify/input/add-input.md` | add ワークフロー |
| `.specify/input/fix-input.md` | fix ワークフロー |

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
| Vision Spec 作成後 | 目的・ゴールの妥当性 |
| Design 完了後 | 画面・Domain 設計の妥当性 |
| Feature Spec 作成後 | 要件の妥当性、CLARIFY GATE |
| Plan 作成後 | 実装計画の承認 |
| E2E テスト後 | テスト結果の確認 |

### Multi-Review 観点

> **SSOT:** [quality-gates.md#multi-review](.claude/skills/spec-mesh/constitution/quality-gates.md#multi-review) 参照

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
node .claude/skills/spec-mesh/scripts/state.cjs query --all
node .claude/skills/spec-mesh/scripts/state.cjs init

# Quick Input
node .claude/skills/spec-mesh/scripts/reset-input.cjs vision|add|fix
node .claude/skills/spec-mesh/scripts/preserve-input.cjs vision
node .claude/skills/spec-mesh/scripts/preserve-input.cjs add --feature {feature-id}
node .claude/skills/spec-mesh/scripts/preserve-input.cjs fix --fix {fix-id}
node .claude/skills/spec-mesh/scripts/preserve-input.cjs design

# Lint・検証
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
node .claude/skills/spec-mesh/scripts/spec-metrics.cjs

# Spec・Matrix 生成
node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind <type> --id <id> --title <title>
node .claude/skills/spec-mesh/scripts/generate-matrix-view.cjs

# Git・PR
node .claude/skills/spec-mesh/scripts/branch.cjs --type <type> --slug <slug> --issue <num>
node .claude/skills/spec-mesh/scripts/pr.cjs

# テンプレート更新
node .claude/skills/spec-mesh/scripts/update.cjs --check  # 更新確認
node .claude/skills/spec-mesh/scripts/update.cjs          # 更新実行
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
| [constitution/](.claude/skills/spec-mesh/constitution/) | Engineering Constitution（core.md, quality-gates.md 等） |
| [SKILL.md](.claude/skills/spec-mesh/SKILL.md) | Skill 定義・ルーティング |
| [docs/](docs/) | 詳細ドキュメント |
