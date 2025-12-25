---
name: guide
description: |
  Workflow navigator that helps users understand where they are and what to do next.
  Use when user asks "次は何？", "何をすればいい？", "ガイドして", "現在の状態は？",
  "what's next?", "help me", or seems confused about the workflow.
---

# Guide - Workflow Navigator

プロジェクトの現在の状態を分析し、次に何をすべきかをガイドします。

## Trigger Phrases

- 「次は何をすべき？」「何をすればいい？」
- 「ガイドして」「教えて」
- 「現在の状態は？」「どこまで進んだ？」
- 「迷っている」「分からない」

## Instructions

### Step 1: 状態を取得

```bash
node .claude/skills/spec-mesh/scripts/state.cjs query --all
```

### Step 2: 状態を分析して次のアクションを提案

以下のフローチャートに基づいて判断：

```
┌─────────────────────────────────────────────────────────┐
│                    START                                │
│                      ↓                                  │
│              Vision Spec ある?                          │
│              ├─ NO → 「Vision を作成して」              │
│              └─ YES ↓                                   │
│                                                         │
│              Vision Status = Approved?                  │
│              ├─ NO → 曖昧点ある? → clarify              │
│              │       なければ → レビュー待ち            │
│              └─ YES ↓                                   │
│                                                         │
│              Screen/Domain Spec ある?                   │
│              ├─ NO → 「Design を作成して」              │
│              └─ YES ↓                                   │
│                                                         │
│              Screen/Domain Status = Approved?           │
│              ├─ NO → 曖昧点ある? → clarify              │
│              │       なければ → レビュー待ち            │
│              └─ YES ↓                                   │
│                                                         │
│              開発する機能がある?                        │
│              ├─ NO → 「機能を追加したい」               │
│              └─ YES ↓                                   │
│                                                         │
│              Feature Spec ある?                         │
│              ├─ NO → 「〇〇機能を追加して」             │
│              └─ YES ↓                                   │
│                                                         │
│              Feature Status = Approved?                 │
│              ├─ NO → 曖昧点ある? → clarify              │
│              │       なければ → レビュー待ち            │
│              └─ YES ↓                                   │
│                                                         │
│              Plan ある?                                 │
│              ├─ NO → 「実装計画を作成して」             │
│              └─ YES ↓                                   │
│                                                         │
│              Tasks ある?                                │
│              ├─ NO → 「タスク分割して」                 │
│              └─ YES ↓                                   │
│                                                         │
│              実装完了?                                  │
│              ├─ NO → 「実装して」                       │
│              └─ YES ↓                                   │
│                                                         │
│              PR 作成済み?                               │
│              ├─ NO → 「PR を作成して」                  │
│              └─ YES → 完了！次の機能へ                  │
└─────────────────────────────────────────────────────────┘
```

### Step 3: 出力フォーマット

```
=== 現在の状態 ===

📍 フェーズ: [vision | design | development]
📄 Vision Spec: [✅ Approved | ⏳ Draft | ❌ なし]
📐 Screen/Domain: [✅ Approved | ⏳ Draft | ❌ なし]
📦 Features: [N個 完了 / M個 進行中 / L個 Backlog]

=== 次のアクション ===

🎯 推奨: 「〇〇して」と依頼してください

理由: [なぜこれが次のステップなのか]

=== ワークフロー全体 ===

[x] Vision 作成
[x] Design (Screen + Domain)
[ ] Feature 追加  ← 現在地
[ ] Plan 作成
[ ] Tasks 分割
[ ] 実装
[ ] PR 作成
```

## Status Interpretation

| Phase | 意味 |
|-------|------|
| `vision` | Vision Spec 作成中 |
| `design` | Screen/Domain 作成中 |
| `development` | Feature 開発中 |
| `ready` | 初期状態（何も始まっていない） |

| Spec Status | 意味 |
|-------------|------|
| `none` | まだ作成されていない |
| `draft` | 作成済み、レビュー待ち |
| `in_review` | レビュー中 |
| `clarified` | 曖昧点解消済み |
| `approved` | 承認済み、次へ進める |

## Quick Answers

### 「何から始めればいい？」
→ Vision Spec がなければ「Vision を作成して」

### 「Vision 作った後は？」
→ Design（Screen + Domain）を作成

### 「Design の後は？」
→ Feature を追加するか、既存機能から開発開始

### 「Feature Spec 作った後は？」
→ 曖昧点を解消 → Plan → Tasks → 実装 → PR

### 「迷った時は？」
→ このガイドスキルを呼んで現在地を確認

## Notes

- 状態は `.specify/state/` に保存されている
- 手動でファイルを確認したい場合は `.specify/specs/` を参照
- 詳細なワークフローは `.claude/skills/spec-mesh/workflows/` にある
