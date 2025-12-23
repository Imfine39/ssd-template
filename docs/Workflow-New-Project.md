# Workflow: New Project

新規プロジェクトを立ち上げる際の詳細なワークフローです。

---

## Overview

```
Phase 1: Vision     /spec-mesh vision     目的・ジャーニー・Screen Hints
    ↓
Phase 2: Design     /spec-mesh design     Screen + Domain Spec 同時作成
    ↓
Phase 3: Foundation /spec-mesh issue      基盤実装
    ↓
Phase 4: Features   /spec-mesh issue      各Feature実装（繰り返し）
```

---

## Phase 1: Vision Spec

### 目的

プロジェクトの「なぜ」を明確にし、画面イメージも収集します。

### ワークフロー

```
/spec-mesh vision 中小企業向けの在庫管理システム
```

### AI の動作

1. **入力読み込み**: `.specify/input/vision-input.md` から読み込み（統合 Quick Input）
   - Part A: ビジョン（必須）
   - Part B: 画面イメージ（推奨）
   - Part C: デザイン希望（任意）
2. **Vision Spec 作成**: scaffold-spec.cjs で作成
3. **セクション記入**: Purpose, Users, Journeys, Scope, **Screen Hints**, Constraints, Risks
4. **サマリー表示 & 曖昧点レポート**
5. **→ `/spec-mesh clarify` で曖昧点を 4 問ずつバッチ解消（別ワークフロー）**

### Human Checkpoint

- [ ] Vision Spec をレビュー・承認

### 出力

- `.specify/specs/{project}/overview/vision/spec.md`（Screen Hints セクション含む）

---

## Phase 2: Screen + Domain Spec 同時作成

### 目的

画面設計と技術設計を同時に行い、ID の相互参照を可能にします。

### ワークフロー

```
/spec-mesh design
```

### AI の動作

1. **Vision 確認**: 読み込み、未承認なら警告
2. **Screen Hints 確認**: Vision Spec の Section 5 から画面情報を取得
   - 空の場合は入力を促す
3. **Feature 提案**: 3-7個の Feature を提案（画面情報と連携）
4. **Feature Issues 作成**: 人間が選択した Feature の Issue を作成
5. **SCR-\* ID 割り当て**: 画面リストから ID を割り当て
6. **M-_/API-_ 導出**: 画面要素から必要なマスタ/API を導出
7. **Screen + Domain Spec 同時作成**:
   - Screen Spec: 画面一覧、遷移図、M-_/API-_ 対応表
   - Domain Spec: M-_, API-_（各定義に "Used by screens" を記載）
8. **Foundation Issue 作成**: S-FOUNDATION-001
9. **サマリー表示 & 曖昧点レポート**

### Human Checkpoint

- [ ] Feature 選択を確認
- [ ] Screen + Domain Spec をレビュー・承認

### 出力

- Feature Issues (GitHub)
- `.specify/specs/{project}/overview/screen/spec.md`（M-_/API-_ 対応表付き）
- `.specify/specs/{project}/overview/domain/spec.md`（Screen 参照付き）
- Foundation Issue

### Screen ↔ Domain 対応

同時作成により、以下の整合性が保証されます：

- Screen Index に `APIs`, `Masters` 列
- M-\* 定義に `Used by screens: SCR-XXX`
- API-\* 定義に `Used by screens: SCR-XXX`

---

## Phase 3: Foundation Implementation

### 目的

プロジェクトの基盤（認証、DB、構造）を構築します。

### フロー

```
/spec-mesh issue → Foundation Issue を選択
    ↓
Feature Spec 作成 + Clarify
    ↓
/spec-mesh plan → 実装計画
    ↓
/spec-mesh tasks → タスク分割
    ↓
/spec-mesh implement → 実装
    ↓
/spec-mesh pr → PR 作成
```

### Human Checkpoint

- [ ] Plan レビュー・承認
- [ ] PR レビュー・マージ

---

## Phase 4: Feature Development (Repeat)

### 繰り返しフロー

```
/spec-mesh issue → Feature Issue を選択
    ↓
Feature Spec 作成 + Clarify → Human: 承認
    ↓
/spec-mesh plan → Human: 承認
    ↓
/spec-mesh tasks → /spec-mesh implement → /spec-mesh pr
    ↓
Human: PR レビュー・マージ → 次の Feature へ
```

---

## State Transitions

各フェーズで repo-state.json が更新されます。

| Phase            | phase value    | Vision status | Domain status |
| ---------------- | -------------- | ------------- | ------------- |
| Start            | initialization | none          | none          |
| After Vision     | vision         | approved      | none          |
| After Design     | design         | approved      | approved      |
| After Foundation | foundation     | approved      | approved      |
| Development      | development    | approved      | approved      |

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
- `.claude/skills/spec-mesh/guides/parallel-development.md` 参照

---

## Related Pages

- [[Workflow-Add-Feature]] - 機能追加フロー
- [[Workflows-Reference]] - 各ワークフローの詳細
- [[Core-Concepts]] - 4層構造の詳細
