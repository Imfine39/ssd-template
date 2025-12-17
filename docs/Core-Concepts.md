# Core Concepts

SSD-Template の主要概念を解説します。

---

## 1. Four-Layer Spec Structure

SSD-Template では仕様を4層構造で管理します。

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
│                     SCREEN SPEC                              │
│  .specify/specs/screen/spec.md                              │
│                                                              │
│  - 画面一覧 (Screen Index)                                   │
│  - 画面遷移図 (Mermaid)                                      │
│  - Screen ↔ Feature ↔ API ↔ Master 対応表                   │
│  - 各画面のワイヤーフレーム                                  │
│  - 共通コンポーネント、デザイントークン                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    FEATURE SPECS                             │
│  .specify/specs/<feature-id>/spec.md                        │
│                                                              │
│  - 個別機能の詳細仕様                                        │
│  - ユースケース (UC-*)                                       │
│  - 機能要件 (FR-*)                                           │
│  - Domain/Screen への参照                                    │
└─────────────────────────────────────────────────────────────┘
```

### 各層の責務

| Layer | Responsibility | Contains | Example |
|-------|---------------|----------|---------|
| **Vision** | WHY | 目的、ユーザー、スコープ | "中小企業の在庫管理を効率化" |
| **Domain** | WHAT (技術) | マスタ、API、ルール | M-PRODUCT, API-INVENTORY-LIST |
| **Screen** | WHAT (UX) | 画面、遷移、ワイヤーフレーム | SCR-001: ダッシュボード |
| **Feature** | HOW | UC、FR、実装詳細 | UC-001: 在庫検索 |

### 重要なルール

1. **Feature は Domain/Screen を参照のみ** - M-*/API-*/SCR-* を再定義しない
2. **Domain は技術の Single Source of Truth** - 共有定義は Domain に集約
3. **Screen は UX の Single Source of Truth** - 画面構成は Screen に集約
4. **Screen Index で対応管理** - 画面 ↔ Feature ↔ API ↔ Master の対応を一元管理

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

## 3. Clarify (独立コマンド)

曖昧さを排除するための対話的プロセスです。
**Clarify は独立したコマンド (`/speckit.clarify`) として実行**し、各コマンド (vision, design, add, fix) には組み込みません。

### 仕組み

```
┌─────────────────────────────────────────────────────────────┐
│  1. Spec に `[NEEDS CLARIFICATION]` マークを付ける           │
│                           ↓                                  │
│  2. `/speckit.clarify` を実行                                │
│                           ↓                                  │
│  3. AI が 4 問ずつバッチで質問を提示                          │
│     - 推奨オプション (Recommended) を先頭に                  │
│     - 選択肢を表形式で提示                                   │
│                           ↓                                  │
│  4. 人間がまとめて回答                                       │
│                           ↓                                  │
│  5. AI が Spec を即時更新                                    │
│                           ↓                                  │
│  6. すべての `[NEEDS CLARIFICATION]` が解消されるまで繰り返し │
└─────────────────────────────────────────────────────────────┘
```

### Clarify の例

```
=== Clarify: S-DOMAIN-001 (Batch 1/2) ===

以下の 4 問にまとめてお答えください:

**Q1. Master Data について確認します。**
商品マスタ (M-PRODUCT) に必要な主要フィールドは？

| Option | Description |
|--------|-------------|
| A (推奨) | SKU, 商品名, カテゴリ, 単価 |
| B | A + バーコード, ロット管理 |
| C | B + 賞味期限, シリアル番号 |

**Q2. ユーザー認証について**
...（他の質問が続く）

**Q3. API形式について**
...

**Q4. 在庫単位について**
...

回答例: 「Q1: A, Q2: B, Q3: C, Q4: A」
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
node .specify/scripts/state.cjs query --repo
node .specify/scripts/state.cjs query --branch
node .specify/scripts/state.cjs query --all

# 状態更新
node .specify/scripts/state.cjs repo --set-phase development
node .specify/scripts/state.cjs branch --set-step implement

# 中断・再開
node .specify/scripts/state.cjs suspend --reason "Domain change required"
node .specify/scripts/state.cjs resume
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

## 9. Quick Input System

コマンド実行前にユーザーが構造化された情報を入力するシステムです。

### 仕組み

```
.specify/
├── templates/           # ベーステンプレート（読み取り専用）
│   ├── quickinput-vision.md
│   ├── quickinput-add.md
│   └── quickinput-fix.md
│
├── input/               # ユーザー入力用（編集対象）
│   ├── vision.md
│   ├── add.md
│   └── fix.md
│
└── scripts/
    └── reset-input.js   # 入力ファイルリセット
```

### 使い方

1. `.specify/input/<type>.md` を編集して情報を入力
2. 対応するコマンド（`/speckit.vision`, `/speckit.add`, `/speckit.fix`）を実行
3. 完了後、入力内容は Spec の「Original Input」セクションに記録され、入力ファイルは自動リセット

### メリット

- **構造化**: AI が的確な Spec を生成できる
- **再現性**: 入力が Spec に記録されるため追跡可能
- **効率性**: チャットでの往復を減らせる

---

## 10. Claude Code Hooks

セッション開始時に自動でプロジェクト状態を読み込む仕組みです。

### 設定

`.claude/settings.local.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .specify/scripts/state.cjs query --all 2>/dev/null || echo \"[SSD State] Not initialized\""
          }
        ]
      }
    ]
  }
}
```

### 効果

- **自動コンテキスト**: セッション開始時に現在の状態がコンテキストに入る
- **継続性**: 「どのブランチで作業中か」「どのステップか」を自動把握
- **効率性**: 毎回の状態確認が不要

### 出力例

セッション開始時に以下が自動表示：

```
=== Repo State ===
Project: my-project
Phase: development
Vision Spec: approved
Domain Spec: approved

=== All Branches ===
feature/45-auth:
  Type: feature
  Issue: 45
  Spec ID: S-AUTH-001
  Step: implement
  Task Progress: 3/10
```

---

## Next Steps

- [[Workflow-New-Project]] - 新規プロジェクトの具体的なフロー
- [[Workflow-Add-Feature]] - 機能追加の具体的なフロー
- [[Commands-Reference]] - 各コマンドの詳細
