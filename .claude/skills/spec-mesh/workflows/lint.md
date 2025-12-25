# Lint Workflow

Run spec integrity checks.

## Purpose

Verify consistency between:
- Vision ↔ Domain ↔ Screen ↔ Feature Specs
- Cross-Reference Matrix
- ID references (M-*, API-*, SCR-*, S-*)

**呼び出し元:** このワークフローは [review.md](review.md) の Step 5 から呼び出されます。
Review --> Lint の一方向の依存関係であり、Lint が Review を呼び出すことはありません（循環依存なし）。

---

## Steps

### Step 1: Run spec-lint

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

**Checks performed:**
- Spec file structure
- Required sections present
- ID format validation
- Cross-references exist

### Step 2: Run validate-matrix

```bash
node .claude/skills/spec-mesh/scripts/validate-matrix.cjs
```

**Checks performed:**
- Matrix → Spec: Referenced items exist in Specs
- Spec → Matrix: Spec items are in Matrix

### Step 3: Report Results

> **Severity Classification:** constitution.md の Severity Classifications を参照。
> Error = Critical, Warning = Major, Info = Minor

**All passed:**
```
=== Lint 完了 ===

spec-lint: ✅ PASSED
validate-matrix: ✅ PASSED

整合性チェック完了。問題はありません。
```

**Errors found:**
```
=== Lint 完了 ===

spec-lint: ❌ FAILED
  - Error: M-ORDER referenced but not defined in Domain Spec
  - Error: Feature S-AUTH-001 missing UC definitions
  - Warning: SCR-005 not referenced by any Feature

validate-matrix: ❌ FAILED
  - Error: API-USER-CREATE in Matrix but not in Domain Spec
  - Warning: SCR-003 not in Matrix

修正が必要です。上記のエラーを解消してください。
```

### Step 4: Auto-fix (if possible)

#### Auto-fix Categories

| Category | Action | Human Confirmation |
|----------|--------|-------------------|
| **Automatic (No confirmation)** | | |
| - Markdown 構文修正 | 自動修正 | 不要 |
| - 日付フォーマット統一 | 自動修正 | 不要 |
| - 末尾空白・改行修正 | 自動修正 | 不要 |
| **Semi-automatic (Confirmation required)** | | |
| - Missing Matrix entries | 追加提案 | 必要 |
| - 欠落している相互参照 | 追加提案 | 必要 |
| **Manual only (No auto-fix)** | | |
| - Unused IDs | 警告のみ | 削除は人間判断 |
| - 内容の矛盾 | 報告のみ | 人間が修正 |
| - セクション欠落 | 報告のみ | 人間が追加 |

```
=== Auto-fix 実行 ===

自動修正（確認不要）: {N} 件
- [完了] Markdown 構文修正 (3箇所)
- [完了] 日付フォーマット統一 (2箇所)

確認が必要な修正: {M} 件
- Matrix に API-USER-CREATE を追加

上記の修正を実行しますか？ (y/N)

手動対応が必要: {K} 件
- SCR-005: 未使用ID（削除検討）
- Section 3.2: 内容矛盾（人間が確認）
```

---

## Self-Check

- [ ] spec-lint.cjs を実行したか
- [ ] validate-matrix.cjs を実行したか
- [ ] エラーがあれば報告したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** Lint 結果を確認してから次のステップに進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| すべてパスした場合 | (次のワークフローへ) | 現在のワークフローを続行 |
| エラーがある場合 | lint ワークフロー | 修正後に再実行 |
