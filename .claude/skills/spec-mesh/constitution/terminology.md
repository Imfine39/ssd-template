# Terminology

Canonical definitions for IDs, status values, and terms used across all specs.
All templates and workflows MUST reference these definitions.

---

## Canonical Terms（標準用語）

### 英日対応表

| Concept | Canonical Form | 日本語表記 | 使用禁止表現 |
|---------|---------------|-----------|-------------|
| 仕様文書 | Spec | Spec | 仕様書, Specification |
| ビジョン仕様 | Vision Spec | Vision Spec | ビジョン仕様書 |
| ドメイン仕様 | Domain Spec | Domain Spec | ドメイン仕様書 |
| 画面仕様 | Screen Spec | Screen Spec | 画面仕様書, 画面設計書 |
| 機能仕様 | Feature Spec | Feature Spec | 機能仕様書 |
| 機能単位 | Feature | 機能 | ファンクション, フィーチャー |
| 技術領域 | Domain | ドメイン | 領域 |
| UI単位 | Screen | 画面 | ビュー, ページ, View |
| ユースケース | Use Case | ユースケース | UC (文中では禁止) |
| 機能要件 | Functional Requirement | 機能要件 | FR (文中では禁止) |
| マスタデータ | Master | マスタ | マスター |
| ビジネスルール | Business Rule | ビジネスルール | BR (文中では禁止) |
| バリデーションルール | Validation Rule | バリデーションルール | VR (文中では禁止) |

### プレースホルダー形式

| 形式 | 用途 | 例 |
|------|------|-----|
| `{placeholder}` | テンプレート変数（動的に置換される値） | `{date}`, `{author}`, `{feature_name}` |
| `[MARKER]` | ステータスマーカー（人間が確認する項目） | `[NEEDS CLARIFICATION]`, `[TODO]` |
| `S-{AREA}-{NNN}` | ID 形式パターン（構造を示す） | `S-AUTH-001`, `UC-DASH-002` |

**使用禁止:**
- `<placeholder>` - HTML タグと混同するため禁止
- `{{placeholder}}` - 特定フレームワーク依存のため禁止

### 言語使用ポリシー

| ファイルタイプ | 推奨言語 | 理由 |
|---------------|---------|------|
| Constitution | 英語 | 原則・基準のため一貫性重視 |
| SKILL.md | 英語（description） + 日本語（詳細） | ルーティング定義は英語 |
| Workflows | 日本語 | 詳細手順のため理解しやすさ重視 |
| Templates | 英語（構造）+ 日本語（説明・記入例） | 両方必要 |
| Guides | 日本語 | 詳細説明のため |
| Scripts | 英語（コード）+ 日本語（コメント可） | コードは英語 |

---

## Specification IDs

### Spec Type IDs

| ID Format | Example | Usage |
|-----------|---------|-------|
| `S-VISION-{NNN}` | S-VISION-001 | Vision Spec |
| `S-DOMAIN-{NNN}` | S-DOMAIN-001 | Domain Spec |
| `S-SCREEN-{NNN}` | S-SCREEN-001 | Screen Spec |
| `S-{AREA}-{NNN}` | S-AUTH-001 | Feature Spec |
| `F-{AREA}-{NNN}` | F-AUTH-001 | Fix Spec |
| `TS-{AREA}-{NNN}` | TS-AUTH-001 | Test Scenario Spec |

### Component IDs

| ID Format | Example | Usage |
|-----------|---------|-------|
| `UC-{AREA}-{NNN}` | UC-AUTH-001 | Use Case |
| `FR-{AREA}-{NNN}` | FR-AUTH-001 | Functional Requirement |
| `M-{NAME}` | M-USER | Master Data |
| `API-{RESOURCE}-{ACTION}` | API-USER-CREATE | API Contract |
| `SCR-{NNN}` | SCR-001 | Screen |
| `BR-{NNN}` | BR-001 | Business Rule |
| `VR-{NNN}` | VR-001 | Validation Rule |
| `TC-{NNN}` / `TC-N{NN}` / `TC-J{NN}` | TC-001, TC-N01, TC-J01 | Test Case (Positive/Negative/Journey) |

See `guides/id-naming.md` for complete definitions and examples.

---

## Feature Granularity

### Feature（機能）の定義

> **「独立したユーザー目標を達成する最小単位」**

Feature は以下の基準を満たす単位で定義する：

| 基準 | 説明 | 例 |
|-----|------|-----|
| **独立性** | 他機能なしで価値を提供 | ○ 認証、× パスワードリセット（認証に依存） |
| **完結性** | 単体で動作確認可能 | ○ ユーザー一覧、× API 単体 |
| **テスト可能** | E2E テストを書ける | ○ 検索機能、× バリデーション |
| **1PR 規模** | 独立してマージ可能な変更単位 | ○ フィルター機能、× 全画面実装 |

### 粒度の判定例

**適切な粒度:**
- ユーザー認証（ログイン/ログアウト）
- ダッシュボード表示
- データ検索・フィルタリング
- レポート出力

**細かすぎる（分割不要）:**
- パスワードバリデーション（認証の一部）
- 入力フォームのリセットボタン（画面の一部）
- API エンドポイント単体

**大きすぎる（分割必要）:**
- 全画面実装
- 複数ユーザーロールの権限システム全体

### Vision → Design での Feature Hints

Vision Interview (Phase 2) で洗い出す Feature Hints は、上記基準に従った粒度で抽出する。
Design ワークフローで正式な Feature Issue として作成される。

---

## Status Values

### Spec Status

Status values for Vision, Domain, Screen, Feature, and Fix specifications.

| Status | Uppercase Form | Description |
|--------|---------------|-------------|
| `None` | - | Spec does not exist yet |
| `Scaffold` | - | Spec file created from template, content not filled |
| `Draft` | `DRAFT` | Initial creation, not reviewed |
| `In Review` | `IN REVIEW` | Under Multi-Review or stakeholder review |
| `Clarified` | `CLARIFIED` | All [NEEDS CLARIFICATION] markers resolved |
| `Approved` | `APPROVED` | Human approved, ready for implementation |
| `Implemented` | `IMPLEMENTED` | Code complete |
| `Deprecated` | `DEPRECATED` | No longer active, replaced by newer version |
| `Superseded` | `SUPERSEDED` | Replaced by another spec (reference the new spec) |

**Lifecycle:** `None` → `Scaffold` → `Draft` → `In Review` → `Clarified` → `Approved` → `Implemented`

**Alternative endings:** `Deprecated` or `Superseded`

**Prohibited values:**
- `IMPLEMENTING` - 使用禁止。進行中は `In Review` または `Approved` を使用

**Note:**
- Spec file headers use Mixed Case: `Status: Draft`
- spec-lint.cjs validates uppercase forms: `DRAFT`, `IN REVIEW`, etc.
- state.cjs uses lowercase with underscores: `draft`, `in_review`, etc.

---

### Screen Status

Status values for individual screens within Screen Spec.

| Status | Description |
|--------|-------------|
| `Planned` | In spec but not implemented |
| `In Progress` | Currently being implemented |
| `Implemented` | Code complete |
| `Deprecated` | No longer used |

**Lifecycle:** `Planned` → `In Progress` → `Implemented` (or `Deprecated`)

---

### Test Status

Status values for test cases in Test Scenario Spec.

| Status | Description |
|--------|-------------|
| `Pending` | Not yet executed |
| `Pass` | Test passed |
| `Fail` | Test failed |
| `Blocked` | Cannot run due to dependencies |
| `Skipped` | Intentionally skipped |

---

### Test Scenario Spec Status

Status values for the overall Test Scenario Spec document.

| Status | Description |
|--------|-------------|
| `Draft` | Initial creation |
| `In Review` | Under stakeholder review |
| `Ready` | Approved and ready for execution |
| `Executing` | Test execution in progress |
| `Completed` | All tests executed |

---

## Clarification Markers

Markers used to indicate ambiguity status in specifications.

| Marker | 意味 | 使用条件 | CLARIFY GATE への影響 |
|--------|------|---------|---------------------|
| `[NEEDS CLARIFICATION]` | 曖昧で解消が必要 | 曖昧点を発見した時 | ブロック（解消必須） |
| `[DEFERRED: 理由]` | 現時点では決められない | 下記条件に該当 | 通過可能（リスク記録） |

### [DEFERRED] の使用条件

| 理由カテゴリ | 説明 | 使用例 |
|-------------|------|-------|
| 技術検証待ち | 技術選定やPoCの結果待ち | `[DEFERRED: 技術検証後に決定]` |
| 外部承認待ち | ステークホルダーの確認が必要 | `[DEFERRED: PM承認待ち]` |
| 後フェーズ詳細化 | MVP以降で対応予定 | `[DEFERRED: Phase 2で詳細化]` |
| 情報不足 | 追加調査が必要 | `[DEFERRED: 追加調査必要]` |

### [DEFERRED] のライフサイクル

```
1. 作成: clarify.md で「現時点では回答できない」を選択
    ↓
2. 記録: Risks セクションに影響を記載、Deferred Items テーブルに追加
    ↓
3. 追跡: spec-lint で検出・カウント、state.cjs で管理
    ↓
4. 解消: 実装フェーズで遭遇時 or 情報が得られた時に clarify へ戻る
    ↓
5. 削除: 解消後に通常の記述に変換、Deferred Items から削除
```

### [DEFERRED] の形式

```markdown
[DEFERRED: {理由カテゴリ}]

<!-- 例 -->
認証方式は [DEFERRED: 技術検証後に決定] とする。
```

---

## Branch Step Values

Step values for branch state tracking (used by `state.cjs`).

| Step | Meaning |
|------|---------|
| `idle` | No active work |
| `spec` | Spec creation in progress/complete |
| `plan` | Plan created |
| `tasks` | Tasks created |
| `implement` | Implementation complete |
| `pr` | PR created |
| `suspended` | Work suspended |

---

## Severity Levels

See [quality-gates.md](quality-gates.md) for severity definitions used in reviews.

---

## Task Complexity Judgment

### ultrathink 推奨条件

以下のいずれかに該当する場合、ultrathink を推奨:

| 条件 | 理由 |
|------|------|
| **依存関係が 3 以上** | 複数 Spec/コンポーネント間の整合性確認が必要 |
| **既存コードの大幅変更** | 影響範囲の慎重な分析が必要 |
| **セキュリティ関連** | 脆弱性を生まないよう慎重に |
| **データマイグレーション** | 破壊的変更のリスク |
| **API 契約変更** | 後方互換性の考慮 |
| **エッジケースが多い** | 網羅的な考慮が必要 |

### 並列実行可能条件

以下の **すべて** を満たす場合、Task を並列実行可能:

| 条件 | チェック方法 |
|------|------------|
| **変更ファイルが重ならない** | 各 Task の対象ファイルが独立 |
| **依存関係がない** | Task A の出力が Task B の入力でない |
| **共有状態への書き込みがない** | グローバル設定、DB スキーマ等 |
| **テストが独立** | 互いのテスト結果に影響しない |
