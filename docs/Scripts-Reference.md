# Scripts Reference

Node.js スクリプトのリファレンスです。

---

## Overview

| Script | Purpose |
|--------|---------|
| `state.js` | 状態管理（Repo/Branch） |
| `scaffold-spec.js` | Spec テンプレート作成 |
| `spec-lint.js` | Spec 整合性チェック |
| `branch.js` | ブランチ作成 |
| `pr.js` | PR 作成 |
| `spec-metrics.js` | メトリクス収集 |

**Location:** `.specify/scripts/`

---

## state.js

**Purpose:** プロジェクトとブランチの状態管理

### Commands

```bash
# 初期化
node .specify/scripts/state.js init

# Repo 状態更新
node .specify/scripts/state.js repo [options]

# Branch 状態更新
node .specify/scripts/state.js branch [options]

# 中断
node .specify/scripts/state.js suspend [options]

# 再開
node .specify/scripts/state.js resume [options]

# 状態照会
node .specify/scripts/state.js query [options]
```

### Repo Options

| Option | Description | Values |
|--------|-------------|--------|
| `--set-vision-status` | Vision status | none/scaffold/draft/clarified/approved |
| `--set-domain-status` | Domain status | 同上 |
| `--set-phase` | Project phase | initialization/vision/design/foundation/development |
| `--set-vision-clarify` | Clarify 完了 | true/false |
| `--set-domain-clarify` | Clarify 完了 | true/false |
| `--add-master` | Master 追加 | M-XXX |
| `--add-api` | API 追加 | API-XXX-ACTION |
| `--add-rule` | Rule 追加 | BR-XXX |
| `--set-features-total` | Feature 総数 | number |
| `--set-features-backlog` | Backlog 数 | number |
| `--set-features-inprogress` | In Progress 数 | number |
| `--set-features-completed` | Completed 数 | number |

### Branch Options

| Option | Description | Values |
|--------|-------------|--------|
| `--name` | Branch 名 | string (default: current) |
| `--set-type` | Branch type | feature/fix/spec-change/spec |
| `--set-issue` | Issue 番号 | number |
| `--set-spec-id` | Spec ID | S-XXX-001 |
| `--set-spec-path` | Spec パス | path |
| `--set-step` | Workflow step | idle/spec/spec_review/plan/plan_review/tasks/implement/pr/suspended |
| `--set-task-progress` | タスク進捗 | n/m (e.g., 3/10) |
| `--delete` | Branch 削除 | - |

### Suspend Options

| Option | Description |
|--------|-------------|
| `--branch` | Branch 名 (default: current) |
| `--reason` | 中断理由 |
| `--related` | 関連 Issue 番号 |
| `--resume-after` | 再開条件 |

### Resume Options

| Option | Description |
|--------|-------------|
| `--branch` | Branch 名 (default: current) |
| `--step` | 再開先 step (default: implement) |

### Query Options

| Option | Description |
|--------|-------------|
| `--repo` | Repo 状態表示 |
| `--branch [name]` | Branch 状態表示 |
| `--suspended` | 中断中 Branch 一覧 |
| `--all` | 全状態表示 |

### Examples

```bash
# Repo 状態確認
node .specify/scripts/state.js query --repo

# Vision 承認済みに設定
node .specify/scripts/state.js repo --set-vision-status approved --set-vision-clarify true

# Branch の step を更新
node .specify/scripts/state.js branch --set-step implement

# ブランチを中断
node .specify/scripts/state.js suspend --reason "Domain change required" --related 123

# 中断中のブランチを確認
node .specify/scripts/state.js query --suspended
```

---

## scaffold-spec.js

**Purpose:** Spec テンプレートからファイル作成

### Usage

```bash
node .specify/scripts/scaffold-spec.js --kind <kind> --id <id> --title <title> [options]
```

### Required Arguments

| Argument | Description |
|----------|-------------|
| `--kind` | Spec 種類: vision / domain / feature |
| `--id` | Spec ID (e.g., S-VISION-001) |
| `--title` | Spec タイトル |

### Optional Arguments

| Argument | Description |
|----------|-------------|
| `--vision` | Vision ID (domain/feature 作成時) |
| `--domain` | Domain ID (feature 作成時) |

### Examples

```bash
# Vision Spec 作成
node .specify/scripts/scaffold-spec.js --kind vision --id S-VISION-001 --title "在庫管理システム"

# Domain Spec 作成
node .specify/scripts/scaffold-spec.js --kind domain --id S-DOMAIN-001 --title "在庫管理 Domain" --vision S-VISION-001

# Feature Spec 作成
node .specify/scripts/scaffold-spec.js --kind feature --id S-INVENTORY-001 --title "在庫一覧" --domain S-DOMAIN-001
```

### Output Paths

| Kind | Output Path |
|------|-------------|
| vision | `.specify/specs/vision/spec.md` |
| domain | `.specify/specs/domain/spec.md` |
| feature | `.specify/specs/<id>/spec.md` |

---

## spec-lint.js

**Purpose:** Spec 整合性チェック

### Usage

```bash
node .specify/scripts/spec-lint.js [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | JSON 形式で出力 |
| `--verbose` | 詳細表示 |

### Checks

| Check | Description |
|-------|-------------|
| Vision/Domain/Feature 存在 | 3層構造の整合性 |
| M-*/API-* 参照 | 未定義の参照がないか |
| Feature Index | Domain に Feature が登録されているか |
| Plan/Tasks 存在 | 実装中の Spec に plan/tasks があるか |
| ID 重複 | 同一 ID の重複がないか |
| Domain freshness | Feature が Domain より古くないか |

### Exit Codes

| Code | Description |
|------|-------------|
| 0 | 問題なし |
| 1 | エラーあり |

### Example Output

```
=== Spec Lint Results ===

Vision: .specify/specs/vision/spec.md
  ✓ Valid structure

Domain: .specify/specs/domain/spec.md
  ✓ Valid structure
  ✓ 3 masters defined
  ✓ 5 APIs defined

Features:
  ✓ S-INVENTORY-001: Valid
  ⚠ S-SHIPPING-001: Missing plan.md (status: Implementing)

Summary: 1 warning, 0 errors
```

---

## branch.js

**Purpose:** Issue 連動ブランチ作成

### Usage

```bash
node .specify/scripts/branch.js --type <type> --slug <slug> --issue <num>
```

### Arguments

| Argument | Description | Values |
|----------|-------------|--------|
| `--type` | Branch type | feature / fix / spec-change / spec |
| `--slug` | Short name | e.g., inventory, auth |
| `--issue` | Issue 番号 | number |

### Examples

```bash
# Feature ブランチ作成
node .specify/scripts/branch.js --type feature --slug inventory --issue 12

# Fix ブランチ作成
node .specify/scripts/branch.js --type fix --slug login-error --issue 15

# Spec 変更ブランチ作成
node .specify/scripts/branch.js --type spec-change --slug product-field --issue 20
```

### Output Branch Names

| Type | Pattern |
|------|---------|
| feature | `feature/<issue>-<slug>` |
| fix | `fix/<issue>-<slug>` |
| spec-change | `spec-change/<issue>-<slug>` |
| spec | `spec/<issue>-<slug>` |

---

## pr.js

**Purpose:** PR 作成

### Usage

```bash
node .specify/scripts/pr.js [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--draft` | Draft PR として作成 |

### Flow

1. `spec-lint` 自動実行
2. Branch 状態から Issue/Spec 情報取得
3. PR テンプレート適用
4. `gh pr create` 実行

---

## spec-metrics.js

**Purpose:** プロジェクト健全性メトリクス収集

### Usage

```bash
node .specify/scripts/spec-metrics.js [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | JSON 形式で出力 |
| `--verbose` | 詳細表示 |

### Metrics

| Category | Metrics |
|----------|---------|
| Vision | Count, Last modified |
| Domain | Count, Masters, APIs, Last modified |
| Features | Total, By status, With plan, With tasks |
| Coverage | Total UCs, FRs, SCs |
| Staleness | Outdated features, Specs without UCs, Old drafts |
| Health | Score (0-100), Issues |

### Example Output

```
============================================================
SPECIFICATION METRICS
============================================================
Generated: 2025-12-12T10:30:00.000Z

VISION
----------------------------------------
  Count: 1
  Last modified: 2025-12-10

DOMAIN
----------------------------------------
  Count: 1
  Masters defined: 3
  APIs defined: 8
  Last modified: 2025-12-11

FEATURES
----------------------------------------
  Total: 5
  By status:
    APPROVED: 2
    IMPLEMENTING: 1
    COMPLETED: 2
  With plan.md: 4
  With tasks.md: 3

HEALTH
----------------------------------------
  Score: 95/100
  Issues:
    - 1 feature(s) may be outdated
```

---

## Related Pages

- [[Commands-Reference]] - スクリプトを使用するコマンド
- [[Core-Concepts]] - 状態管理の詳細
- [[Troubleshooting]] - スクリプトのトラブルシューティング
