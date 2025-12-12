# Templates Reference

Spec テンプレートのリファレンスです。

---

## Overview

| Template | Location | Purpose |
|----------|----------|---------|
| Vision Spec | `.specify/templates/vision-spec-template.md` | プロジェクトの目的・ジャーニー |
| Domain Spec | `.specify/templates/domain-spec-template.md` | M-*/API-*/ルール定義 |
| Feature Spec | `.specify/templates/feature-spec-template.md` | 個別機能の詳細仕様 |
| Plan | `.specify/templates/plan-template.md` | 実装計画 |
| Tasks | `.specify/templates/tasks-template.md` | タスク分割 |
| Checklist | `.specify/templates/checklist-template.md` | 品質チェックリスト |

---

## Vision Spec Template

**File:** `vision-spec-template.md`

**Purpose:** プロジェクトの「なぜ」を定義

### Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | System Purpose | 問題、ビジョン、成功の定義 |
| 2 | Target Users | 主要/副次ユーザー、ステークホルダー |
| 3 | User Journeys | 高レベルのユーザージャーニー |
| 4 | Scope | In-scope / Out-of-scope |
| 5 | Constraints | ビジネス/技術制約、前提条件 |
| 6 | Risks | リスクと緩和策 |
| 7 | Open Questions | 未解決の質問 |
| 8 | Clarifications | Clarify ログ |
| 9 | Related Documents | Domain/Feature への参照 |
| 10 | Changelog | 変更履歴 |

### Header Fields

```markdown
Spec Type: Vision
Spec ID: S-VISION-001
Created: [DATE]
Status: [Draft | In Review | Approved]
Author: [OWNER]
```

---

## Domain Spec Template

**File:** `domain-spec-template.md`

**Purpose:** 共有定義の Single Source of Truth

### Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Domain Overview | ドメイン説明、システムコンテキスト |
| 2 | Actors and Roles | アクター、ロール、権限 |
| 3 | Master Data (M-*) | 共有エンティティ定義 |
| 4 | API Contracts (API-*) | 共有 API 定義 |
| 5 | Business Rules | BR-*, VR-*, CR-* |
| 6 | Non-Functional Requirements | 性能、セキュリティ、信頼性 |
| 7 | Technology Decisions | 技術スタック、依存関係 |
| 8 | Feature Index | 全 Feature の一覧 |
| 9 | Open Questions | 未解決の質問 |
| 10 | Clarifications | Clarify ログ |
| 11 | Changelog | 変更履歴 |
| 12 | Implementation Notes | 実装中の発見 |

### Header Fields

```markdown
Spec Type: Domain
Spec ID: S-DOMAIN-001
Created: [DATE]
Status: [Draft | In Review | Approved | Implementing | Completed]
Author: [OWNER]
Related Vision: S-VISION-001
```

### Master Data Format (M-*)

```markdown
### M-[NAME]-001: [Entity Name]

**Purpose:** [Why this master exists]

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |

**Relationships:**
- [Relationship to other masters]

**Constraints:**
- [Validation rules]
```

### API Contract Format (API-*)

```markdown
### API-[RESOURCE]-[ACTION]-001: [API Name]

**Purpose:** [What this API does]

**Endpoint:**
[METHOD] /api/v1/[path]

**Request:**
{ ... }

**Response (Success):**
{ ... }

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
```

### Feature Index Format

```markdown
| Feature ID | Title | Path | Status | Related M-*/API-* |
|------------|-------|------|--------|-------------------|
| S-XXX-001 | [Title] | `.specify/specs/s-xxx-001/` | [Status] | [M-*, API-*] |
```

---

## Feature Spec Template

**File:** `feature-spec-template.md`

**Purpose:** 個別機能の詳細仕様

### Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Purpose and Scope | 機能説明、スコープ |
| 2 | Domain Dependencies | M-*/API-*/BR-* への参照 |
| 3 | Actors | この機能に関連するアクター |
| 4 | User Stories / Use Cases | UC-* |
| 5 | Functional Requirements | FR-* |
| 6 | Edge Cases | エッジケースとエラー処理 |
| 7 | Success Criteria | SC-* |
| 8 | UI / UX Behavior | 画面、状態、ワイヤーフレーム |
| 9 | Feature-Specific Rules | この機能固有のルール |
| 10 | Testing Strategy | テスト計画 |
| 11 | Open Questions | 未解決の質問 |
| 12 | Clarifications | Clarify ログ |
| 13 | Traceability | Vision/Domain/Issue への参照 |
| 14 | Changelog | 変更履歴 |
| 15 | Implementation Notes | 実装中の発見 |

### Header Fields

```markdown
Spec Type: Feature
Spec ID: S-[XXX]-001
Created: [DATE]
Status: [Draft | In Review | Approved | Implementing | Completed | Deprecated]
Author: [OWNER]
Related Issue(s): [#123]
Related Vision: S-VISION-001
Related Domain: S-DOMAIN-001
```

### Use Case Format (UC-*)

```markdown
### UC-[XXX]-001: [Title]

**Priority:** [P1 | P2 | P3]
**Actor:** [Actor]

**Pre-conditions:**
- [Condition]

**Main Flow:**
1. [Step 1]
2. [Step 2]

**Alternate Flows:**
- [Alternative]

**Post-conditions:**
- [State after completion]

**Acceptance Criteria:**
- [ ] [Criterion]
```

---

## Plan Template

**File:** `plan-template.md`

**Purpose:** 実装計画

### Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | Context | 対象 Spec、ブランチ、Issue |
| 2 | Stack & Dependencies | 技術選定 |
| 3 | Constitution Check | 原則との整合性確認 |
| 4 | Architecture | ディレクトリ構造、パターン |
| 5 | Implementation Strategy | 実装方針 |
| 6 | Risk & Mitigations | リスクと対策 |
| 7 | Open Questions | 未解決の質問 |

---

## Tasks Template

**File:** `tasks-template.md`

**Purpose:** タスク分割

### Sections

| # | Section | Description |
|---|---------|-------------|
| 0 | Context | 対象 Spec、Branch |
| 1 | Task List | UC ベースのタスク一覧 |
| 2 | Dependencies | タスク間の依存関係 |
| 3 | Progress Tracking | 進捗表 |

### Task Format

```markdown
### Task 1: [Title]

**Related UC:** UC-XXX-001
**Estimated:** [S/M/L]
**Status:** [ ] Not Started / [x] Done

**Steps:**
1. [ ] [Step 1]
2. [ ] [Step 2]

**Acceptance:**
- [ ] [Criterion]
```

---

## Checklist Template

**File:** `checklist-template.md`

**Purpose:** 品質チェックリスト（Unit Tests for English）

### Concept

Requirements を「英語のユニットテスト」として表現し、検証可能にする。

### Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | UC Checklist | UC ごとの検証項目 |
| 2 | FR Checklist | FR ごとの検証項目 |
| 3 | Edge Cases | エッジケースの検証項目 |
| 4 | NFR Checklist | 非機能要件の検証項目 |

### Format

```markdown
### UC-XXX-001: [Title]

**Given:** [前提条件]
**When:** [アクション]
**Then:** [期待結果]

- [ ] [検証項目 1]
- [ ] [検証項目 2]
```

---

## Status Values

すべての Spec で使用可能なステータス：

| Status | Description |
|--------|-------------|
| Draft | 作成中 |
| In Review | レビュー中 |
| Approved | 承認済み |
| Implementing | 実装中 |
| Completed | 完了 |
| Deprecated | 廃止 |
| Superseded | 後継に置換 |

---

## Related Pages

- [[Core-Concepts]] - 3層構造の詳細
- [[Commands-Reference]] - テンプレートを使用するコマンド
- [[Scripts-Reference]] - scaffold-spec.js
