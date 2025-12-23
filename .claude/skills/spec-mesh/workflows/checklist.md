# Checklist Workflow

Generate a requirements quality checklist. "Unit Tests for English."

## Purpose

Create a structured checklist to verify spec quality before implementation.

### Relationship with Review

| Tool | タイミング | 用途 |
|------|-----------|------|
| **Checklist** | Spec 作成後、Review 前（任意） | 品質スコアの定量測定、自己チェック |
| **Review** | Spec 作成後（必須） | 3観点からの多角的レビュー、問題発見 |

**推奨フロー:**
1. Spec 作成
2. (任意) Checklist で自己評価 → 明らかな問題を先に修正
3. Review で多角的レビュー → 発見された問題を修正
4. Lint で構造検証

Checklist はオプションです。Review は必須です。

---

## Steps

### Step 1: Load Spec

```
Read tool: .specify/specs/{project}/features/{id}/spec.md
```

### Step 2: Generate Checklist

Based on Spec content, generate checklist for:

**2.1 Completeness:**
- [ ] All sections filled (no TBD/TODO)
- [ ] User Stories have clear actors
- [ ] Functional Requirements are measurable
- [ ] Acceptance criteria defined
- [ ] Error cases documented

**2.2 Clarity:**
- [ ] No ambiguous terms (some, few, etc.)
- [ ] Technical terms defined
- [ ] Edge cases addressed
- [ ] Examples provided for complex logic

**2.3 Consistency:**
- [ ] IDs follow naming convention
- [ ] References to Domain Spec valid
- [ ] References to Screen Spec valid
- [ ] No contradicting requirements

**2.4 Testability:**
- [ ] Each FR can be tested
- [ ] Test approach defined
- [ ] Acceptance criteria measurable

**2.5 Traceability:**
- [ ] Links to Issue
- [ ] Links to Domain M-*/API-*
- [ ] Links to Screen SCR-*

### Step 3: Save Checklist

Save to feature directory:
```
.specify/specs/{project}/features/{id}/checklist.md
```

### Step 4: Report

```
=== Checklist 生成完了 ===

Feature: {Feature名}
Checklist: .specify/specs/{project}/features/{id}/checklist.md

## Quality Score

| Category | Score |
|----------|-------|
| Completeness | {N}/10 |
| Clarity | {N}/10 |
| Consistency | {N}/10 |
| Testability | {N}/10 |
| Traceability | {N}/10 |
| **Total** | {N}/50 |

## Issues Found

- {Issue 1}
- {Issue 2}

## Recommendations

1. {Recommendation 1}
2. {Recommendation 2}

チェックリストを確認し、問題があれば `/spec-mesh clarify` で解消してください。
```

---

## Self-Check

- [ ] Spec を読み込んだか
- [ ] 5つのカテゴリでチェックしたか
- [ ] checklist.md を保存したか
- [ ] スコアを計算したか

---

## Quality Score Thresholds

### Threshold Rationale

スコアは 5 カテゴリ x 10 点 = 50 点満点で評価:

| Category | Weight | Rationale |
|----------|--------|-----------|
| Completeness | 10 | 欠落があると実装時に仮定が必要になる |
| Clarity | 10 | 曖昧さは実装者ごとに解釈が異なるリスク |
| Consistency | 10 | 矛盾はバグの原因になる |
| Testability | 10 | テスト不可な要件は検証できない |
| Traceability | 10 | 追跡性がないと変更影響が分からない |

### Threshold Levels

| Score | Level | Meaning |
|-------|-------|---------|
| **40+ (80%+)** | READY | 全カテゴリで基本要件を満たす。実装開始可能 |
| **30-39 (60-79%)** | NEEDS_WORK | 1-2 カテゴリで問題あり。軽微な修正で改善可能 |
| **<30 (<60%)** | BLOCKED | 複数カテゴリで重大な問題。Clarify 必須 |

### Customizing Thresholds

プロジェクト固有の閾値が必要な場合:

```javascript
// .specify/config.json
{
  "checklist": {
    "thresholds": {
      "ready": 40,      // default: 40
      "needsWork": 30   // default: 30
    },
    "weights": {
      "completeness": 10,
      "clarity": 10,
      "consistency": 10,
      "testability": 10,
      "traceability": 10
    }
  }
}
```

---

## Next Steps

| Score | Action |
|-------|--------|
| 40+ | Ready for `/spec-mesh plan` |
| 30-39 | Minor issues, `/spec-mesh clarify` recommended |
| <30 | Major issues, `/spec-mesh clarify` required |
