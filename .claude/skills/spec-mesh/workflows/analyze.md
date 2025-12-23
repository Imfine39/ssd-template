# Analyze Workflow

Analyze implementation against Spec/Domain. Run before PR for peace of mind.

## Purpose

Compare actual implementation with specifications to detect:
- Missing implementations
- Extra implementations (not in spec)
- Divergences from spec

---

## Steps

### Step 1: Load Context

1. **Read Feature Spec:**
   ```
   Read tool: .specify/specs/{project}/features/{id}/spec.md
   ```

2. **Read Domain Spec** for M-*/API-* definitions

3. **Read Screen Spec** for UI requirements

### Step 2: Analyze Implementation

**2.1 Check User Stories:**
- List all UC-* from Spec
- For each UC, verify:
  - Related code exists
  - Tests exist with `@uc` annotation
  - Behavior matches spec

**2.2 Check Functional Requirements:**
- List all FR-* from Spec
- Verify implementation

**2.3 Check API Contracts:**
- Compare API-* in Domain Spec with actual endpoints
- Verify request/response match

**2.4 Check Screen Implementation:**
- Compare SCR-* in Screen Spec with actual UI
- Verify components exist

### Step 3: Run spec-metrics

```bash
node .claude/skills/spec-mesh/scripts/spec-metrics.cjs
```

### Step 4: Report

```
=== 分析レポート ===

Feature: {Feature名}
Spec: .specify/specs/{project}/features/{id}/spec.md

## Coverage

| Item | Spec | Implemented | Tests |
|------|------|-------------|-------|
| UC-001 | ✅ | ✅ | ✅ |
| UC-002 | ✅ | ✅ | ⚠️ Missing |
| FR-001 | ✅ | ✅ | ✅ |
| FR-002 | ✅ | ❌ Missing | - |

## Issues Found

❌ Critical:
- FR-002: 未実装

⚠️ Warning:
- UC-002: テストが不足

ℹ️ Info:
- Extra file found: src/utils/helper.ts (not in spec)

## Metrics

- Spec Coverage: 80%
- Test Coverage: 70%
- Implementation Score: 85

## Recommendations

1. FR-002 を実装してください
2. UC-002 のテストを追加してください
```

---

## Self-Check

- [ ] Feature Spec を読み込んだか
- [ ] 各 UC/FR の実装状況を確認したか
- [ ] spec-metrics を実行したか
- [ ] レポートを出力したか

---

## Success Criteria

分析結果は以下の基準で判定:

### PASS (PR 可能)

| Metric | Threshold |
|--------|-----------|
| Spec Coverage | >= 100% (全 UC/FR が実装済み) |
| Test Coverage | >= 80% (UC/FR に対応するテスト) |
| Critical Issues | 0 件 |
| Major Issues | 0 件 |

### WARN (条件付き PR)

| Metric | Threshold |
|--------|-----------|
| Spec Coverage | >= 100% |
| Test Coverage | >= 60% |
| Critical Issues | 0 件 |
| Major Issues | <= 2 件 (文書化されていれば可) |

### FAIL (PR 不可)

以下のいずれかに該当:
- Spec Coverage < 100% (未実装の UC/FR がある)
- Critical Issues > 0
- Test Coverage < 60%

```
=== 分析結果サマリ ===

Status: {PASS|WARN|FAIL}

Spec Coverage: {N}% (Required: 100%)
Test Coverage: {N}% (Required: >= 80%)
Critical: {N} (Required: 0)
Major: {N} (Required: 0 for PASS)

{PASS の場合}
分析完了。PR 作成に進めます。
Next: /spec-mesh pr

{WARN の場合}
軽微な問題があります。以下を確認してから PR してください:
- {issue_list}

{FAIL の場合}
以下を解決してから再分析してください:
- {issue_list}
```

---

## Next Steps

| Status | Action |
|--------|--------|
| PASS | `/spec-mesh pr` |
| WARN | Issue を確認後 `/spec-mesh pr` |
| FAIL - Missing | 実装追加後 `/spec-mesh analyze` |
| FAIL - Extra | Spec 追加 or コード削除後 `/spec-mesh analyze` |
