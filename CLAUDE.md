# Claude Code Development Guide

このリポジトリで動作する Claude Code の行動指針です。

---

## Priority Rules

| 優先度 | ルール |
|--------|--------|
| 1 | [Engineering Constitution](.claude/skills/spec-mesh/constitution.md) |
| 2 | Vision / Domain / Screen / Feature Spec |
| 3 | 不明点は Clarify でエスカレーション（推測禁止） |

---

## Workflow Routing

ユーザーの依頼に応じて、適切なワークフローを選択して実行してください。

### 依頼 → ワークフロー対応表

| ユーザーの依頼 | 実行 |
|---------------|------|
| 「プロジェクトを始めたい」「Vision を作成」 | `/spec-mesh vision` |
| 「画面設計」「Design を作成」 | `/spec-mesh design` |
| 「機能を追加」「〇〇機能を作りたい」 | `/spec-mesh add` |
| 「バグを修正」「エラーを直して」 | `/spec-mesh fix` |
| 「Issue #N から開始」 | `/spec-mesh issue` |
| 「Spec を変更」「M-* を修正」 | `/spec-mesh change` |
| 「実装計画」「Plan を作成」 | `/spec-mesh plan` |
| 「タスク分割」 | `/spec-mesh tasks` |
| 「実装して」 | `/spec-mesh implement` |
| 「PR を作成」 | `/spec-mesh pr` |
| 「テストシナリオを作成」 | `/spec-mesh test-scenario` |
| 「E2E テスト実行」 | `/spec-mesh e2e` |
| 「品質チェック」「レビュー」 | `/spec-mesh review` |
| 「曖昧点を解消」 | `/spec-mesh clarify` |
| 「Lint 実行」 | `/spec-mesh lint` |
| 「実装と Spec を比較」 | `/spec-mesh analyze` |
| 「品質スコアを測定」 | `/spec-mesh checklist` |
| 「フィードバックを記録」 | `/spec-mesh feedback` |
| 「Feature を提案して」 | `/spec-mesh featureproposal` |
| 「Spec を直接編集」 | `/spec-mesh spec` |

---

## Core Flow

```
Entry (vision/add/fix/issue)
    ↓
入力検証（必須項目確認）
    ↓
Spec 作成
    ↓
Multi-Review（3観点並列） → AI修正
    ↓
Lint
    ↓
[HUMAN_CHECKPOINT]
    ↓
[NEEDS CLARIFICATION] あり? → YES: Clarify → Multi-Review へ戻る
    ↓ NO
★ CLARIFY GATE 通過 ★
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

| Reviewer | 観点 |
|----------|------|
| A | 構造・形式（Template 準拠、ID 命名） |
| B | 内容・整合性（矛盾、用語統一） |
| C | 完全性・網羅性（スコープ欠落） |

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
node .claude/skills/spec-mesh/scripts/preserve-input.cjs <type>

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
| [constitution.md](.claude/skills/spec-mesh/constitution.md) | Engineering Constitution |
| [SKILL.md](.claude/skills/spec-mesh/SKILL.md) | Skill 定義・ルーティング |
| [docs/](docs/) | 詳細ドキュメント |
