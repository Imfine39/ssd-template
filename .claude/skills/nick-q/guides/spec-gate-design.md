# SPEC GATE 設計ドキュメント

Overview Spec への変更が Feature/Fix 開発中に必要になった場合の処理フロー。

---

## 1. 背景と課題

### 1.1 現状の問題

Feature/Fix 開発中に既存の Overview Spec（Vision/Domain/Screen）への変更が必要と判明するケースがある：

- **Case 3**: 既存の M-*/API-*/SCR-* の変更が必要
- 例: Feature で email 通知を実装 → M-USER に email 属性追加が必要

現行ワークフローでは「change ワークフローを推奨」とあるが、具体的なタイミングとフローが不明確。

### 1.2 設計方針

**「発見 → マーク → ゲートでブロック → 対処 → 戻る」**

- Feature Spec 作成の流れを中断せず、Overview 変更の「必要性」を記録
- SPEC GATE で確実に検出してブロック
- Overview Change サブワークフローで対処
- 完了後 Multi-Review に戻る

---

## 2. マーカー仕様

### 2.1 マーカー形式

新マーカー `[PENDING OVERVIEW CHANGE]` を導入：

```markdown
[PENDING OVERVIEW CHANGE: {対象ID}]
- 変更: {変更内容の概要}
- 理由: {この Feature/Fix で必要な理由}
```

### 2.2 使用例

```markdown
## Domain References

### Models
- M-USER: ユーザー情報
  - [PENDING OVERVIEW CHANGE: M-USER]
    - 変更: `email: string (required)` を追加
    - 理由: メール通知機能で必要

### APIs
- API-USER-CREATE
  - [PENDING OVERVIEW CHANGE: API-USER-CREATE]
    - 変更: request/response に email フィールド追加
    - 理由: M-USER の変更に伴う
```

### 2.3 対象 ID の種類

| 種類 | 例 | Spec ファイル |
|------|-----|--------------|
| Model | M-USER, M-ORDER | domain/spec.md |
| API | API-USER-CREATE | domain/spec.md |
| Business Rule | BR-001 | domain/spec.md |
| Validation Rule | VR-001 | domain/spec.md |
| Screen | SCR-001 | screen/spec.md |
| Vision | VIS-GOAL-1 | vision/spec.md |

### 2.4 マーカーの検出パターン

```regex
\[PENDING OVERVIEW CHANGE: [^\]]+\]
```

---

## 3. SPEC GATE 仕様

### 3.1 概要

`[NEEDS CLARIFICATION]` と `[PENDING OVERVIEW CHANGE]` の両方をチェック対象とする統合ゲート。

### 3.2 チェック項目

| 順序 | マーカー | 条件 | 結果 |
|------|---------|------|------|
| 1 | `[NEEDS CLARIFICATION]` | > 0 | BLOCKED_CLARIFY |
| 2 | `[PENDING OVERVIEW CHANGE]` | > 0 | BLOCKED_OVERVIEW |
| 3 | `[DEFERRED]` | > 0 | PASSED_WITH_DEFERRED |
| 4 | 全て | = 0 | PASSED |

### 3.3 判定フロー

```
Multi-Review 完了
    ↓
Lint 完了
    ↓
★ SPEC GATE チェック開始 ★
    ↓
[NEEDS CLARIFICATION] カウント
    ↓
[PENDING OVERVIEW CHANGE] カウント
    ↓
[DEFERRED] カウント
    ↓
判定:
┌─ [NEEDS CLARIFICATION] > 0
│     └─→ BLOCKED_CLARIFY → clarify.md
│
├─ [PENDING OVERVIEW CHANGE] > 0
│     └─→ BLOCKED_OVERVIEW → Overview Change サブワークフロー
│
├─ [DEFERRED] > 0
│     └─→ PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT] (リスク確認)
│
└─ 全て 0
      └─→ PASSED → [HUMAN_CHECKPOINT] → Plan
```

### 3.4 優先順位

1. `[NEEDS CLARIFICATION]` が優先（曖昧点解消が先）
2. 曖昧点解消後に `[PENDING OVERVIEW CHANGE]` を処理
3. 両方解消後に `[DEFERRED]` の確認

**理由:** Overview 変更の内容自体に曖昧点がある場合、先に clarify で解消する必要がある。

---

## 4. Overview Change サブワークフロー

### 4.1 概要

SPEC GATE で `[PENDING OVERVIEW CHANGE]` が検出された場合に実行するサブワークフロー。

### 4.2 フロー

```
SPEC GATE: BLOCKED_OVERVIEW
    ↓
Step 1: マーカー収集
    - Feature/Fix Spec から全 [PENDING OVERVIEW CHANGE] を抽出
    - 対象・変更内容・理由をリスト化
    ↓
Step 2: 重複チェック
    - 各変更について「既に適用済みか」を確認
    - 適用済み → マーカー削除のみ（Step 6 へ）
    - 未適用 → Step 3 へ
    ↓
Step 3: Impact Analysis (FULL モード)
    - 変更による影響範囲を分析
    - 他の Feature への影響を特定
    - shared/impact-analysis.md を FULL モードで実行
    ↓
Step 4: [HUMAN_CHECKPOINT]
    - 変更内容と影響範囲を提示
    - 承認を取得
    - 拒否 → Feature Spec を再検討
    ↓
Step 5: Overview Spec 更新
    - Domain/Screen/Vision Spec を Edit
    - Matrix 更新（generate-matrix-view.cjs）
    - 影響を受ける既存 Feature Spec の参照更新
    - Changelog 記録
    ↓
Step 6: マーカー削除
    - Feature/Fix Spec から [PENDING OVERVIEW CHANGE] を削除
    - 正式な参照に書き換え
    ↓
Step 7: Multi-Review へ戻る
    - 変更後の Spec を再度 Multi-Review
    - SPEC GATE を再チェック
```

### 4.3 重複チェックロジック

複数の Feature が同じ Overview 変更を必要とする場合の処理：

```javascript
for each marker in [PENDING OVERVIEW CHANGE]:
    target = marker.対象ID
    change = marker.変更内容

    if (isAlreadyApplied(target, change)) {
        // 他の Feature で既に変更済み
        removeMarker(marker)
        log(`${target} は既に変更済み（別 Feature で対応済み）`)
    } else {
        // 未適用 → 変更を実行
        pendingChanges.push(marker)
    }
```

### 4.4 適用済み判定

| 対象 | 判定方法 |
|------|---------|
| M-* 属性追加 | Domain Spec で属性が存在するか |
| API-* フィールド追加 | API 定義にフィールドが存在するか |
| SCR-* 要素追加 | Screen Spec に要素が存在するか |

---

## 5. ブランチ戦略

### 5.1 Embedded（同一ブランチ）を推奨

```
feature/123-user-notification
    │
    ├─ commit: Feature Spec 作成（マーカー付き）
    ├─ ★ SPEC GATE: BLOCKED_OVERVIEW ★
    ├─ commit: Domain Spec 更新（M-USER に email 追加）
    ├─ commit: Feature Spec マーカー削除
    ├─ ★ SPEC GATE: PASSED ★
    └─ Plan → 実装 → PR
```

### 5.2 メリット

| 観点 | Embedded のメリット |
|------|-------------------|
| トレーサビリティ | PR で「この Feature に必要だった Overview 変更」が一目瞭然 |
| コンテキスト | 中断なく作業を継続可能 |
| シンプルさ | ブランチ管理が複雑にならない |
| レビュー | 変更の関連性が明確 |

### 5.3 コミット粒度

```
feat(spec): add user notification feature spec (S-NOTIF-001)
  - マーカー [PENDING OVERVIEW CHANGE: M-USER] 付き

chore(domain): add email attribute to M-USER
  - メール通知機能 (S-NOTIF-001) のために必要

chore(domain): update API-USER-CREATE for email field

feat(spec): finalize S-NOTIF-001 after overview changes
  - マーカー削除、正式参照に更新
```

---

## 6. 複数 Feature の競合

### 6.1 シナリオ

Feature A と Feature B が同時並行で開発され、両方が M-USER への email 追加を必要とする場合。

### 6.2 処理フロー

```
Timeline:
────────────────────────────────────────────────────────→

Feature A: [PENDING: M-USER email追加]
    │
    ├─ Overview Change 実行
    │     └─ M-USER に email 追加 ✓
    │
    └─ 完了、main にマージ

Feature B: [PENDING: M-USER email追加]
    │
    ├─ main から最新を取得（rebase/merge）
    ├─ Overview Change 開始
    │     └─ 重複チェック: 「M-USER.email は既に存在」
    │     └─ 適用済み → マーカー削除のみ
    │
    └─ 完了（Domain Spec 変更なし）
```

### 6.3 重要なポイント

1. **先着優先**: 最初に main にマージした Feature の変更が採用される
2. **後続は参照のみ**: 同じ変更が必要な後続 Feature はマーカー削除のみ
3. **競合なし**: 同じ変更を複数回適用しようとする問題を回避

---

## 7. 更新対象ファイル一覧

### 7.1 新規作成

| ファイル | 内容 |
|----------|-----|
| `guides/spec-gate-design.md` | この設計ドキュメント |
| `workflows/shared/_spec-gate.md` | SPEC GATE 共通コンポーネント |
| `workflows/shared/_overview-change.md` | Overview Change サブワークフロー |

### 7.2 更新

| ファイル | 更新内容 |
|----------|---------|
| `constitution/quality-gates.md` | SPEC GATE 定義を追加 |
| `workflows/feature.md` | SPEC GATE 対応、Case 3 でマーカー記録 |
| `workflows/fix.md` | 同上 |
| `workflows/change.md` | サブワークフローとしての呼び出し対応 |
| `workflows/review.md` | [PENDING OVERVIEW CHANGE] もチェック対象に |
| `workflows/shared/_spec-gate.md` | SPEC GATE 共通コンポーネント |
| `scripts/spec-lint.cjs` | 新マーカーの検出ルール追加 |
| `SKILL.md` | フロー図の更新 |
| `CLAUDE.md` | SPEC GATE の記載追加 |

---

## 8. 実装フェーズ

### Phase 1: 設計ドキュメント
- [x] spec-gate-design.md 作成

### Phase 2: 共有コンポーネント
- [x] _spec-gate.md 作成
- [x] _overview-change.md 作成

### Phase 3: 既存ワークフロー更新
- [x] feature.md 更新（SPEC GATE、Case 3 マーカー記録）
- [x] fix.md 更新（同上）
- [x] change.md 更新（サブワークフロー対応、Embedded モード）
- [x] review.md 更新（[PENDING OVERVIEW CHANGE] チェック追加）
- [x] project-setup.md 更新（SPEC GATE 対応）
- [x] _spec-gate.md 作成

### Phase 4: Constitution/Quality Gates
- [x] quality-gates.md 更新（SPEC GATE 定義）

### Phase 5: SKILL.md/CLAUDE.md
- [x] SKILL.md フロー図更新
- [x] CLAUDE.md 更新

### Phase 6: スクリプト更新
- [x] spec-lint.cjs 更新（[PENDING OVERVIEW CHANGE] 検出、[NEEDS CLARIFICATION] 検出）

---

## 11. スクリプト更新（実装済み）

### 11.1 spec-lint.cjs への追加

> **Status: 実装済み** - `scripts/spec-lint.cjs` に以下のチェックが追加されました。

**追加されたチェックルール:**

```javascript
// SPEC GATE Marker Checks セクションで実装
const pendingOverviewChangeRegex = /\[PENDING OVERVIEW CHANGE: [^\]]+\]/g;
const needsClarificationRegex = /\[NEEDS CLARIFICATION\]/g;

// Feature/Fix Spec に未解決の [PENDING OVERVIEW CHANGE] があればエラー
// Feature/Fix Spec に [NEEDS CLARIFICATION] があれば警告（APPROVED/IMPLEMENTED ではエラー）
```

**エラーレベル:**

| マーカー | Feature/Fix Spec での扱い | Overview Spec での扱い |
|---------|-------------------------|----------------------|
| `[PENDING OVERVIEW CHANGE]` | Error（Plan 前に解消必須） | N/A（このマーカーは使用しない） |
| `[NEEDS CLARIFICATION]` | Error（既存） | Warning（既存） |
| `[DEFERRED]` | Warning（既存） | Warning（既存） |

**出力例:**

```
=== spec-lint.cjs ===

Checking: .specify/specs/features/S-NOTIF-001/spec.md

[ERROR] Unresolved [PENDING OVERVIEW CHANGE] markers: 2
  - [PENDING OVERVIEW CHANGE: M-USER]
  - [PENDING OVERVIEW CHANGE: API-USER-CREATE]

  Hint: Run Overview Change subworkflow before proceeding to Plan

Summary:
  Errors: 1
  Warnings: 0

Exit code: 1
```

### 11.2 実装優先度

| 優先度 | 項目 | 理由 |
|--------|------|------|
| P1 | `[PENDING OVERVIEW CHANGE]` 検出 | SPEC GATE の自動化に必須 |
| P2 | 未解決マーカーのサマリー表示 | デバッグ支援 |
| P3 | マーカー位置の行番号表示 | 修正箇所の特定 |

### 11.3 将来の拡張

- **自動重複チェック**: [PENDING OVERVIEW CHANGE] の対象が既に Domain/Screen Spec に存在するかを自動チェック
- **Impact 予測**: マーカーの内容から影響を受ける既存 Feature を推測
- **修正提案**: 単純な変更（属性追加など）の場合、自動修正を提案

---

## 9. リスクと対策

| リスク | 対策 |
|--------|-----|
| マーカーが忘れられる | spec-lint.cjs で未解決マーカーを検出 |
| サブワークフローが長くなる | 小さな変更は inline で処理可能に |
| 複雑な Overview 変更 | [HUMAN_CHECKPOINT] で分割を提案 |
| 他チームの Overview 変更 | Impact Analysis で通知先を明示 |

---

## 10. 用語定義

| 用語 | 定義 |
|------|------|
| SPEC GATE | Multi-Review 後の品質ゲート。曖昧点と Overview 変更をチェック |
| BLOCKED_CLARIFY | [NEEDS CLARIFICATION] が残っている状態 |
| BLOCKED_OVERVIEW | [PENDING OVERVIEW CHANGE] が残っている状態 |
| Overview Spec | Vision/Domain/Screen Spec の総称 |
| Embedded | Overview 変更を Feature ブランチ内で実行する方式 |
