---
description: Run spec lint to check Vision/Domain/Screen/Feature consistency.
---

## Purpose

Spec の整合性をチェックするユーティリティコマンド。

**ユーティリティコマンド** - いつでも単独実行可能。

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Run spec-lint.cjs"
   - "Step 2: Run validate-matrix.cjs"
   - "Step 3: Report results"
   - "Step 4: Handle errors (if any)"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

## Steps

### Step 1: Run spec-lint.cjs

Run from the repo root:

```bash
node .specify/scripts/spec-lint.cjs
```

#### Self-Check (Step 1)

- [ ] spec-lint.cjs を実行したか
- [ ] 出力結果（エラー/警告）を確認したか

### Step 2: Run validate-matrix.cjs

```bash
node .specify/scripts/validate-matrix.cjs
```

#### Self-Check (Step 2)

- [ ] validate-matrix.cjs を実行したか
- [ ] 出力結果（エラー/警告）を確認したか

### Step 3: Report results

結果を整理して報告:

```
=== Lint 結果 ===

spec-lint.cjs:
- Errors: [N] 件
- Warnings: [N] 件

validate-matrix.cjs:
- Missing items: [N] 件
- Inconsistencies: [N] 件

総合結果: [PASS/FAIL]
```

#### Self-Check (Step 3)

- [ ] 両方のスクリプトの結果を報告したか
- [ ] エラー件数と警告件数を表示したか

### Step 4: Handle errors (if any)

エラーがあった場合の対応を提案:

```
=== 推奨アクション ===

[エラータイプに応じた対応を提案]
```

#### Self-Check (Step 4)

- [ ] エラーがあれば対応方法を提案したか
- [ ] 次のステップ（修正 or 続行）を提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## What this checks

### 1. spec-lint.cjs: Matrix → Spec 参照整合性

Matrix が参照するものが Spec に存在するかをチェック。

### Spec Validation

- Spec Type and Spec ID are present in each spec.md
- Spec IDs and UC IDs are unique across all specs
- Feature specs only reference masters/APIs defined in Domain specs
- Feature specs only reference screens (SCR-\*) defined in Screen specs
- Warns when Domain masters/APIs are not referenced by any Feature
- Warns when Screen SCR-\* are not referenced by any Feature
- Screen Index table validation in Screen Spec

### Cross-Reference Matrix Validation

Matrix が存在する場合（`.specify/matrix/cross-reference.json`）、以下もチェック:

- **Matrix ↔ Domain 整合性**: Matrix 内の `masters`, `apis` が Domain Spec に存在するか
- **Matrix ↔ Screen 整合性**: Matrix 内の `screens` が Screen Spec に存在するか
- **Matrix ↔ Feature 整合性**: Matrix 内の `features` が Feature Spec に存在するか
- **Screen ↔ Master/API 対応**: 各 Screen が参照する M-\*/API-\* が Domain で定義されているか
- **Feature ↔ Screen 対応**: Feature が参照する SCR-\* が Matrix の screens に含まれるか
- **Orphan 検出**: どの Feature からも参照されない Screen/Master/API を警告

## Exit codes

- `0` when clean (or warnings only)
- `1` when errors are found (treat as PR blocker)

## Validation Examples

**Domain validation:**

```
ERROR: Unknown master "M-INVENTORY" referenced in feature .specify/specs/s-inv-001/spec.md; update Domain spec first.
WARNING: API "API-REPORTS-EXPORT" defined in Domain is not referenced by any feature.
```

**Screen validation:**

```
ERROR: Unknown screen "SCR-005" referenced in feature .specify/specs/s-orders-001/spec.md; update Screen spec first.
WARNING: Screen "SCR-SETTINGS" defined in Screen spec is not referenced by any feature.
```

**Matrix validation:**

```
ERROR: Matrix references unknown screen "SCR-099" not defined in Screen spec.
ERROR: Matrix references unknown master "M-LEGACY" not defined in Domain spec.
ERROR: Matrix feature "S-OLD-001" does not exist in .specify/specs/.
WARNING: Screen "SCR-002" in Matrix has no masters or apis defined.
WARNING: Feature "S-AUTH-001" references SCR-003 but Matrix entry missing this screen.
```

### 2. validate-matrix.cjs: Spec → Matrix 完全性

Spec の内容が Matrix に反映されているかをチェック（spec-lint.cjs の逆方向）。

**チェック内容:**

- Screen Spec の全 SCR-\* が Matrix に存在するか
- Domain Spec の全 M-\*/API-\* が Matrix のどこかで参照されているか
- Feature Index の全 Feature が Matrix に存在するか
- 全 API に対する permissions 定義が存在するか

**出力例:**

```
Missing Screens in Matrix:
  - SCR-011
  - SCR-012

APIs in Spec but not referenced in Matrix:
  - API-EXPORT-001

Validation FAILED - Matrix is incomplete.
```

**`--fix` オプション:**

不足している項目のテンプレートを JSON 形式で出力:

```bash
node .specify/scripts/validate-matrix.cjs --fix > suggestions.json
```

## When to Run

- **PR 作成前**: `/speckit.pr` で自動実行
- **Spec 更新後**: Domain/Screen/Feature Spec を変更した後
- **Matrix 更新後**: `cross-reference.json` を編集した後
- **定期チェック**: 開発中の整合性確認

## Auto-fix ヒント

Lint エラーが出た場合の対応:

| エラータイプ | 対応方法 |
|-------------|---------|
| Unknown master/API (spec-lint) | `/speckit.change` で Domain 追加 |
| Unknown screen (spec-lint) | `/speckit.change` で Screen 追加 |
| Matrix inconsistency (spec-lint) | Matrix を手動修正 → `generate-matrix-view.cjs` |
| Orphan warning (spec-lint) | Feature で参照を追加、または不要なら削除 |
| Missing in Matrix (validate-matrix) | `--fix` で提案取得 → Matrix に追加 |
