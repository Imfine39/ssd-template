# Core Concepts

SSD-Template の主要概念を解説します。

---

## 1. Three-Layer Spec Structure

SSD-Template では仕様を3層構造で管理します。

```
┌─────────────────────────────────────────────────────────────┐
│                     VISION SPEC                              │
│  .specify/specs/vision/spec.md                              │
│                                                              │
│  - プロジェクトの目的（Why）                                 │
│  - ターゲットユーザー                                        │
│  - ユーザージャーニー（高レベル）                            │
│  - スコープ（In/Out）                                        │
│  - 制約とリスク                                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN SPEC                              │
│  .specify/specs/domain/spec.md                              │
│                                                              │
│  - 共有マスターデータ (M-*)                                  │
│  - 共有 API 契約 (API-*)                                     │
│  - ビジネスルール (BR-*, VR-*, CR-*)                         │
│  - Feature Index（全 Feature の一覧）                        │
│  - 技術選定                                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE SPECS                             │
│  .specify/specs/<feature-id>/spec.md                        │
│                                                              │
│  - 個別機能の詳細仕様                                        │
│  - ユースケース (UC-*)                                       │
│  - 機能要件 (FR-*)                                           │
│  - Domain への参照（M-*, API-* を再定義しない）              │
└─────────────────────────────────────────────────────────────┘
```

### 各層の責務

| Layer | Responsibility | Contains | Example |
|-------|---------------|----------|---------|
| **Vision** | WHY | 目的、ユーザー、スコープ | "中小企業の在庫管理を効率化" |
| **Domain** | WHAT (Shared) | マスタ、API、ルール | M-PRODUCT, API-INVENTORY-LIST |
| **Feature** | HOW (Individual) | UC、FR、UI仕様 | UC-001: 在庫検索 |

### 重要なルール

1. **Feature は Domain を参照のみ** - M-*/API-* を再定義しない
2. **Domain は Single Source of Truth** - 共有定義は Domain に集約
3. **Feature Index で一覧管理** - Domain Spec 内で全 Feature を管理

---

## 2. Specification IDs

すべての仕様要素に一意の ID を付与します。

### ID 体系

| Prefix | Meaning | Example |
|--------|---------|---------|
| `S-VISION-001` | Vision Spec | プロジェクト Vision |
| `S-DOMAIN-001` | Domain Spec | システム Domain |
| `S-XXX-001` | Feature Spec | S-INVENTORY-001 |
| `UC-XXX-001` | Use Case | UC-INV-001 |
| `FR-XXX-001` | Functional Req | FR-INV-001 |
| `M-XXX` | Master Data | M-PRODUCT, M-USER |
| `API-XXX-ACTION` | API Contract | API-PRODUCT-LIST |
| `BR-001` | Business Rule | BR-001 |
| `VR-001` | Validation Rule | VR-001 |
| `CR-001` | Calculation Rule | CR-001 |
| `SC-XXX-001` | Success Criteria | SC-INV-001 |

### Traceability

ID は以下で参照され、追跡可能性を確保します：

- Spec → Plan → Tasks
- Tests (`@spec`, `@uc` annotations)
- PR descriptions (`Implements S-001, UC-001`)
- Issues

---

## 3. Clarify Loop

曖昧さを排除するための対話的プロセスです。

### 仕組み

```
┌─────────────────────────────────────────────────────────────┐
│  1. Spec に `[NEEDS CLARIFICATION]` マークを付ける           │
│                           ↓                                  │
│  2. AI が 1 問ずつ質問を提示                                 │
│     - 推奨オプション (Recommended) を先頭に                  │
│     - 選択肢を表形式で提示                                   │
│                           ↓                                  │
│  3. 人間が回答                                               │
│                           ↓                                  │
│  4. AI が Spec を即時更新                                    │
│                           ↓                                  │
│  5. すべての `[NEEDS CLARIFICATION]` が解消されるまで繰り返し │
└─────────────────────────────────────────────────────────────┘
```

### Clarify の例

```
=== Clarify: Domain (Q1/5) ===

**Master Data について確認します。**

**質問**: 商品マスタ (M-PRODUCT) に必要な主要フィールドは？

**Recommended:** Option A - 基本的な在庫管理に必要なフィールド

| Option | Description |
|--------|-------------|
| A | SKU, 商品名, カテゴリ, 単価 |
| B | A + バーコード, ロット管理 |
| C | B + 賞味期限, シリアル番号 |
| Other | 別の構成 |
```

### Clarify Taxonomy

質問は以下のカテゴリに分類されます：

**Vision Clarify:**
- System Purpose（目的）
- Target Users（ユーザー）
- User Journeys（ジャーニー）
- Scope（スコープ）
- Constraints（制約）

**Domain Clarify:**
- Master Data (M-*)
- API Contracts (API-*)
- Business Rules (BR-*, VR-*, CR-*)
- Technology Decisions
- Non-Functional Requirements

**Feature Clarify:**
- Use Cases (UC-*)
- Functional Requirements (FR-*)
- UI/UX Behavior
- Edge Cases
- Testing Strategy

---

## 4. State Management

プロジェクトとブランチの状態を追跡します。

### 2層構造

```
.specify/state/
├── repo-state.json      # プロジェクト全体の状態
└── branch-state.json    # ブランチごとの状態
```

### Repo State

```json
{
  "vision": {
    "status": "approved",    // none|scaffold|draft|clarified|approved
    "clarifyComplete": true
  },
  "domain": {
    "status": "approved",
    "clarifyComplete": true,
    "definedMasters": ["M-PRODUCT", "M-INVENTORY"],
    "definedApis": ["API-PRODUCT-LIST"],
    "definedRules": ["BR-001"]
  },
  "phase": "development",    // initialization|vision|design|foundation|development
  "features": {
    "total": 5,
    "backlog": 2,
    "inProgress": 1,
    "completed": 2
  }
}
```

### Branch State

```json
{
  "branches": {
    "feature/123-inventory": {
      "type": "feature",
      "issue": 123,
      "specId": "S-INVENTORY-001",
      "specPath": ".specify/specs/s-inventory-001/spec.md",
      "step": "implement",     // idle|spec|spec_review|plan|plan_review|tasks|implement|pr|suspended
      "taskProgress": {
        "completed": 3,
        "total": 10
      }
    }
  }
}
```

### State Commands

```bash
# 状態確認
node .specify/scripts/state.js query --repo
node .specify/scripts/state.js query --branch
node .specify/scripts/state.js query --all

# 状態更新
node .specify/scripts/state.js repo --set-phase development
node .specify/scripts/state.js branch --set-step implement

# 中断・再開
node .specify/scripts/state.js suspend --reason "Domain change required"
node .specify/scripts/state.js resume
```

---

## 5. Warning-Based Approach

SSD-Template は強制ブロックではなく、警告ベースのアプローチを採用しています。

### 原則

```
┌─────────────────────────────────────────────────────────────┐
│  前提条件を満たさない場合:                                   │
│                                                              │
│  WARNING: Vision Spec がまだ承認されていません。             │
│  技術設計の前に /speckit.vision を実行することを推奨します。 │
│                                                              │
│  続行しますか？ (y/N)                                        │
│                                                              │
│  → 人間の判断で続行可能                                      │
└─────────────────────────────────────────────────────────────┘
```

### メリット

1. **柔軟性** - 緊急時やプロトタイプ時にスキップ可能
2. **学習** - 警告を見ることでベストプラクティスを学べる
3. **信頼** - AI が人間を信頼し、最終判断を委ねる

---

## 6. M-*/API-* Handling in Features

Feature Spec 作成時の Domain 要素の扱い方。

### 3つのケース

| Case | Situation | Action |
|------|-----------|--------|
| **Case 1** | 既存の M-*/API-* で足りる | 参照を追加 |
| **Case 2** | 新規 M-*/API-* が必要 | Feature 作成中に Domain を更新 |
| **Case 3** | 既存 M-*/API-* の変更が必要 | `/speckit.change` で Domain 変更を先行 |

### Case 3 のフロー

```
Feature 作成中に既存 M-* の変更が必要と判明
              ↓
現在のブランチを suspend
              ↓
/speckit.change で Domain 変更ブランチ作成
              ↓
Domain 変更を完了・マージ
              ↓
元のブランチを resume
              ↓
Feature 作成を継続
```

---

## 7. Specification Lifecycle

Spec のステータス遷移：

```
Draft → In Review → Approved → Implementing → Completed
                                    ↓
                              Deprecated / Superseded
```

| Status | Description |
|--------|-------------|
| **Draft** | 作成中、自由に編集可能 |
| **In Review** | レビュー中、軽微な修正のみ |
| **Approved** | 承認済み、実装開始可能 |
| **Implementing** | 実装中 |
| **Completed** | 実装完了、参照のみ |
| **Deprecated** | 廃止（理由を記録） |
| **Superseded** | 後続 Spec に置換（ID を記録） |

---

## 8. Change Size Classification

変更の大きさによってワークフローが異なります。

| Size | Examples | Workflow |
|------|----------|----------|
| **Trivial** | Typo修正、フォーマット | PR直接（Spec不要） |
| **Small** | 単一UCのバグ修正 | Issue + Spec Changelog更新 |
| **Medium** | 新UC追加、複数ファイル変更 | Full: Spec → Plan → Tasks |
| **Large** | Domain変更、アーキ変更 | Full + Impact分析 + レビュー会議 |
| **Emergency** | セキュリティ修正 | Hotfix → 48時間以内にSpec作成 |

---

## Next Steps

- [[Workflow-New-Project]] - 新規プロジェクトの具体的なフロー
- [[Workflow-Add-Feature]] - 機能追加の具体的なフロー
- [[Commands-Reference]] - 各コマンドの詳細
