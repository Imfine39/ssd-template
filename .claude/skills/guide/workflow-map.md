# Spec-Mesh Workflow Map

## 全体フロー（シンプル版）

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. VISION                                                     │
│   「Vision を作成して」                                          │
│   ↓                                                             │
│   Vision Spec 作成 → Multi-Review → [HUMAN_CHECKPOINT]          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   2. DESIGN                                                     │
│   「Design を作成して」                                          │
│   ↓                                                             │
│   Screen + Domain + Matrix 作成 → Multi-Review → [CHECKPOINT]   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   3. FEATURE (繰り返し)                                          │
│   「〇〇機能を追加して」                                         │
│   ↓                                                             │
│   Feature Spec → Multi-Review → [CHECKPOINT] → Clarify?         │
│   ↓                                                             │
│   ★ CLARIFY GATE（曖昧点 = 0 が必須）                           │
│   ↓                                                             │
│   Plan → [CHECKPOINT] → Tasks → Implement → PR                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 各フェーズの詳細

### Phase 1: Vision（プロジェクト開始）

| Step | やること | 依頼文 |
|------|---------|--------|
| 1.1 | Vision Spec 作成 | 「Vision を作成して」 |
| 1.2 | レビュー確認 | 自動実行（Multi-Review） |
| 1.3 | 曖昧点解消 | 「曖昧点を解消して」 |
| 1.4 | 人間確認 | [HUMAN_CHECKPOINT] |

**次へ進む条件:** Vision Status = Approved

---

### Phase 2: Design（設計）

| Step | やること | 依頼文 |
|------|---------|--------|
| 2.1 | Screen + Domain 作成 | 「Design を作成して」 |
| 2.2 | レビュー確認 | 自動実行（Multi-Review） |
| 2.3 | 曖昧点解消 | 「曖昧点を解消して」 |
| 2.4 | 人間確認 | [HUMAN_CHECKPOINT] |

**次へ進む条件:** Screen/Domain Status = Approved

---

### Phase 3: Feature（機能開発）

#### 3a. Spec 作成

| Step | やること | 依頼文 |
|------|---------|--------|
| 3.1 | Feature Spec 作成 | 「〇〇機能を追加して」 |
| 3.2 | レビュー確認 | 自動実行（Multi-Review） |
| 3.3 | 曖昧点解消 | 「曖昧点を解消して」 |
| 3.4 | 人間確認 | [HUMAN_CHECKPOINT] |

**CLARIFY GATE:** `[NEEDS CLARIFICATION]` = 0 でないと次に進めない

#### 3b. 実装

| Step | やること | 依頼文 |
|------|---------|--------|
| 3.5 | 実装計画作成 | 「Plan を作成して」 |
| 3.6 | 人間確認 | [HUMAN_CHECKPOINT] |
| 3.7 | タスク分割 | 「タスク分割して」 |
| 3.8 | 実装実行 | 「実装して」 |
| 3.9 | E2E テスト | 「E2E テストして」（任意） |
| 3.10 | PR 作成 | 「PR を作成して」 |

---

## 状態確認コマンド

```bash
# 現在の状態を確認
node .claude/skills/spec-mesh/scripts/state.cjs query --all

# Spec の品質確認
node .claude/skills/spec-mesh/scripts/spec-lint.cjs

# Matrix 確認
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

---

## 困ったときは

| 状況 | 対処 |
|------|------|
| 次に何をすべきか分からない | 「ガイドして」 |
| 曖昧点がある | 「曖昧点を解消して」 |
| Spec を修正したい | 「Spec を変更して」 |
| エラーが出る | エラーメッセージを貼り付けて相談 |
| やり直したい | 状態ファイルを確認して手動調整 |

---

## ファイル配置

```
.specify/
├── input/              ← Quick Input（事前入力）
│   ├── vision-input.md
│   ├── add-input.md
│   └── fix-input.md
├── specs/              ← 生成された Spec
│   └── overview/
│       ├── vision/
│       ├── screen/
│       ├── domain/
│       └── matrix/
├── state/              ← プロジェクト状態
└── memory/             ← 永続化情報
```
