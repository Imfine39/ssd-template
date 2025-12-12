# Workflow: New Project

新規プロジェクトを立ち上げる際の詳細なワークフローです。

---

## Overview

```
Phase 1: Vision     /speckit.vision     目的・ジャーニー定義
    ↓
Phase 2: Design     /speckit.design     Feature提案・Domain設計
    ↓
Phase 3: Foundation /speckit.issue      基盤実装
    ↓
Phase 4: Features   /speckit.issue      各Feature実装（繰り返し）
```

---

## Phase 1: Vision Spec

### 目的
プロジェクトの「なぜ」を明確にします。

### コマンド
```
/speckit.vision 中小企業向けの在庫管理システム
```

### AI の動作

1. **初期質問**: 問題、ユーザー、成功の定義
2. **Vision Spec 作成**: scaffold-spec.js で作成
3. **セクション記入**: Purpose, Users, Journeys, Scope, Constraints, Risks
4. **Clarify ループ**: 曖昧点を1問ずつ解消
5. **サマリー表示 & レビュー依頼**

### Human Checkpoint
- [ ] Vision Spec をレビュー・承認

### 出力
- `.specify/specs/vision/spec.md`

---

## Phase 2: Domain Spec + Feature Proposal

### 目的
技術設計と Feature の洗い出しを行います。

### コマンド
```
/speckit.design
```

### AI の動作

1. **Vision 確認**: 読み込み、未承認なら警告
2. **Feature 提案**: 3-7個の Feature を提案
3. **Feature Issues 作成**: 人間が選択した Feature の Issue を作成
4. **Domain Spec 作成**: M-*, API-*, ルールを定義
5. **Clarify ループ**: Domain の詳細を確認
6. **Foundation Issue 作成**: S-FOUNDATION-001
7. **サマリー表示**

### Human Checkpoint
- [ ] Feature 選択を確認
- [ ] Domain Spec をレビュー・承認

### 出力
- Feature Issues (GitHub)
- `.specify/specs/domain/spec.md`
- Foundation Issue

---

## Phase 3: Foundation Implementation

### 目的
プロジェクトの基盤（認証、DB、構造）を構築します。

### フロー
```
/speckit.issue → Foundation Issue を選択
    ↓
Feature Spec 作成 + Clarify
    ↓
/speckit.plan → 実装計画
    ↓
/speckit.tasks → タスク分割
    ↓
/speckit.implement → 実装
    ↓
/speckit.pr → PR 作成
```

### Human Checkpoint
- [ ] Plan レビュー・承認
- [ ] PR レビュー・マージ

---

## Phase 4: Feature Development (Repeat)

### 繰り返しフロー

```
/speckit.issue → Feature Issue を選択
    ↓
Feature Spec 作成 + Clarify → Human: 承認
    ↓
/speckit.plan → Human: 承認
    ↓
/speckit.tasks → /speckit.implement → /speckit.pr
    ↓
Human: PR レビュー・マージ → 次の Feature へ
```

---

## State Transitions

各フェーズで repo-state.json が更新されます。

| Phase | phase value | Vision status | Domain status |
|-------|-------------|---------------|---------------|
| Start | initialization | none | none |
| After Vision | vision | approved | none |
| After Design | design | approved | approved |
| After Foundation | foundation | approved | approved |
| Development | development | approved | approved |

---

## Tips

### 1. Vision は簡潔に
- 3-5個のメインジャーニー
- 技術詳細は Domain に委譲

### 2. Feature は独立性を重視
- 各 Feature が単独で価値を提供
- 依存関係は最小限に

### 3. Foundation は必要十分に
- 認証/認可
- DB 接続
- 基本ディレクトリ構造
- 共通コンポーネント

### 4. 並行開発も可能
- 複数ブランチで異なる Feature を実装可能
- `.specify/guides/parallel-development.md` 参照

---

## Related Pages

- [[Workflow-Add-Feature]] - 機能追加フロー
- [[Commands-Reference]] - 各コマンドの詳細
- [[Core-Concepts]] - 3層構造の詳細
