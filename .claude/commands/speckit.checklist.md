---
description: Generate a requirements quality checklist for the current spec. "Unit Tests for English".
handoffs:
  - label: Fix Issues with Clarify
    agent: speckit.clarify
    prompt: Clarify the issues found in the checklist
    send: true
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create implementation plan from the spec
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Spec の**要件品質**を検証するチェックリストを生成する。
「Unit Tests for English」- 実装テストではなく、**要件記述の品質をテスト**する。

**Use this when:**
- Spec が clarify を通過した後、Plan 作成前
- 重要な Feature の最終レビュー前
- ドメイン専門家（UX, Security等）のレビュー前

**NOT for:**
- 実装の動作確認（それは通常のテスト）
- Spec の曖昧点解消（それは `/speckit.clarify`）

---

## Core Concept: Unit Tests for English

### ❌ WRONG - 実装テスト（これは書かない）

```markdown
- [ ] Verify landing page displays 3 episode cards
- [ ] Test hover states work correctly on desktop
- [ ] Confirm logo click navigates to home page
```

### ✅ CORRECT - 要件品質テスト（これを書く）

```markdown
- [ ] Are the number and layout of featured episodes explicitly specified? [Completeness]
- [ ] Is 'prominent display' quantified with specific sizing/positioning? [Clarity]
- [ ] Are hover state requirements consistently defined for all interactive elements? [Consistency]
- [ ] Can "visual hierarchy" requirements be objectively measured? [Measurability]
- [ ] Are loading state requirements defined for asynchronous data? [Coverage]
```

---

## Steps

### Step 1: Identify Target Spec

1) **Parse input**:
   - `$ARGUMENTS` で Spec ID またはドメイン（ux, api, security等）が指定されていればそれを使用
   - なければ現在のブランチから推測
   - 対象 Spec を読み込む

2) **Determine Spec type**:
   - Vision → Vision Quality Dimensions
   - Domain → Domain Quality Dimensions
   - Feature → Feature Quality Dimensions + Domain-specific checks

---

### Step 2: Select Focus Areas

3) **If $ARGUMENTS specifies domain** (e.g., "ux", "api", "security"):
   - そのドメインに特化したチェックを生成

4) **If no domain specified**, ask user:
   ```
   どの観点でチェックしますか？

   | Option | Focus | Description |
   |--------|-------|-------------|
   | A | General | 全般的な要件品質（Completeness, Clarity, Consistency, Coverage） |
   | B | UX | UI/UX 要件の品質（視覚階層、インタラクション、アクセシビリティ） |
   | C | API | API 要件の品質（リクエスト/レスポンス、エラー、認証） |
   | D | Security | セキュリティ要件の品質（認証、認可、データ保護） |
   | E | Performance | パフォーマンス要件の品質（レイテンシ、スループット、スケーラビリティ） |
   | F | Data | データ要件の品質（整合性、バリデーション、マイグレーション） |

   複数選択可（例: "A,B" または "all"）
   ```

---

### Step 3: Generate Checklist

5) **Apply Quality Dimensions** to each focus area:

#### Quality Dimensions (全ドメイン共通)

| Dimension | Question Pattern | Example |
|-----------|------------------|---------|
| **Completeness** | Are all necessary requirements present? | "Are error handling requirements defined for all API failure modes?" |
| **Clarity** | Are requirements unambiguous and specific? | "Is 'fast loading' quantified with specific timing thresholds?" |
| **Consistency** | Do requirements align with each other? | "Do navigation requirements align across all pages?" |
| **Measurability** | Can requirements be objectively verified? | "Can 'visual hierarchy' be objectively measured?" |
| **Coverage** | Are all scenarios/edge cases addressed? | "Are requirements defined for zero-state scenarios?" |

#### Domain-Specific Checks

**UX Focus:**
- Visual hierarchy and layout specifications
- Interaction states (hover, focus, active, disabled)
- Responsive/adaptive requirements
- Accessibility requirements (WCAG)
- Error and empty states
- Loading and transition states

**API Focus:**
- Request/response shape completeness
- Error code and message definitions
- Authentication/authorization requirements
- Rate limiting and pagination
- Versioning strategy
- Backward compatibility

**Security Focus:**
- Authentication mechanism details
- Authorization model (RBAC, ABAC, etc.)
- Data protection requirements (encryption, masking)
- Input validation requirements
- Audit logging requirements
- Compliance requirements

**Performance Focus:**
- Latency targets (p50, p95, p99)
- Throughput requirements
- Resource limits (memory, CPU, connections)
- Scalability requirements
- Degradation behavior under load
- Caching strategy

**Data Focus:**
- Data integrity constraints
- Validation rules completeness
- Migration/versioning strategy
- Retention and archival requirements
- Backup and recovery requirements
- Cross-entity consistency

---

### Step 4: Format and Save

6) **Generate checklist document**:
   - Save to `[SPEC_DIR]/checklist-[domain].md`
   - If `all` or `general`, save as `checklist.md`

7) **Checklist format**:

```markdown
# Requirements Quality Checklist: [Spec ID]

Spec: [Spec Title]
Focus: [Selected domains]
Generated: [DATE]

## Quality Summary

| Dimension | Items | Notes |
|-----------|-------|-------|
| Completeness | [count] | |
| Clarity | [count] | |
| Consistency | [count] | |
| Measurability | [count] | |
| Coverage | [count] | |

---

## Completeness

- [ ] CHK-001: Are all user roles and their permissions explicitly defined? [Spec §2]
- [ ] CHK-002: Are error handling requirements defined for all failure modes? [Gap]

## Clarity

- [ ] CHK-010: Is 'high performance' quantified with specific metrics? [Spec §NFR-1]
- [ ] CHK-011: Are 'related items' selection criteria explicitly defined? [Ambiguity, Spec §FR-5]

## Consistency

- [ ] CHK-020: Do validation rules align between frontend and backend? [Spec §VR-*]

## Measurability

- [ ] CHK-030: Can 'user-friendly' be objectively measured? [Ambiguity]

## Coverage

- [ ] CHK-040: Are requirements defined for concurrent access scenarios? [Gap]
- [ ] CHK-041: Are offline/degraded mode requirements specified? [Gap]

---

## Domain-Specific: [UX/API/Security/Performance/Data]

[Domain-specific items here]

---

## Action Items

Issues that should be addressed before proceeding:

| Priority | Item | Recommended Action |
|----------|------|--------------------|
| High | CHK-010 | Quantify 'high performance' with p95 latency target |
| Medium | CHK-040 | Add concurrent access requirements or explicitly exclude |
| Low | CHK-030 | Define measurable UX criteria or accept subjective evaluation |
```

---

### Step 5: Report and Recommend

8) **Present summary**:
   ```
   === Checklist 生成完了: [Spec ID] ===

   Focus: [Selected domains]
   Total items: [count]

   Quality Summary:
   - Completeness: [X] items ([Y] potential issues)
   - Clarity: [X] items ([Y] potential issues)
   - Consistency: [X] items
   - Measurability: [X] items ([Y] potential issues)
   - Coverage: [X] items ([Y] gaps identified)

   High Priority Issues: [count]
   - [Issue 1 summary]
   - [Issue 2 summary]

   Checklist saved: [path]

   Next steps:
   - [ ] Review checklist items
   - [ ] Address High priority issues via `/speckit.clarify`
   - [ ] Mark items as checked when confirmed
   - [ ] Proceed to `/speckit.plan` when satisfied
   ```

9) **If critical issues found**:
   - Recommend running `/speckit.clarify` to address them
   - Do NOT block, but warn

---

## Integration with 3-Layer Specs

### Vision Spec Checklist

Focus on:
- System purpose clarity
- User journey completeness
- Scope boundary definitions
- Constraint specificity
- Risk identification

### Domain Spec Checklist

Focus on:
- M-* field definitions completeness
- API-* contract completeness
- BR-*/VR-*/CR-* rule clarity
- Cross-entity consistency
- NFR measurability

### Feature Spec Checklist

Focus on:
- UC-* acceptance criteria measurability
- FR-* requirement clarity
- Domain reference correctness
- Edge case coverage
- UI state definitions

---

## Example

```
Human: /speckit.checklist api

AI: Feature Spec S-AUTH-001 を読み込みました。
    API 観点でチェックリストを生成します...

    === Checklist 生成完了: S-AUTH-001 ===

    Focus: API
    Total items: 15

    Quality Summary:
    - Completeness: 5 items (2 potential issues)
    - Clarity: 4 items (1 potential issue)
    - Coverage: 6 items (2 gaps identified)

    High Priority Issues:
    - CHK-003: Rate limiting thresholds not specified [Gap]
    - CHK-007: Error response format inconsistent with Domain API-* [Consistency]

    Checklist saved: .specify/specs/s-auth-001/checklist-api.md

    Next steps:
    - Rate limiting の閾値を clarify で明確化することを推奨
    - エラーレスポンス形式を Domain の API-* と整合させる