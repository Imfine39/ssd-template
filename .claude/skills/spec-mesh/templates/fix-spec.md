# Fix Specification: [BUG TITLE]

<!--
  Template: Fix Spec

  ID Format: F-{AREA}-{NNN}
    - AREA: Feature area identifier (2-15 uppercase chars)
    - NNN: Sequential number (001, 002, ...)
    - Examples: F-AUTH-001, F-ORDERS-001, F-DASHBOARD-001
    - See: .claude/skills/spec-mesh/guides/id-naming.md

  Valid Status Values:
    - Draft: Initial creation, investigation in progress
    - Analyzed: Root cause identified
    - In Review: Under stakeholder review
    - Approved: Ready for implementation
    - Implementing: Fix in progress
    - Completed: Fix implemented and verified
-->

Spec Type: Fix
Spec ID: F-{AREA}-{NNN}
Created: YYYY-MM-DD
Status: Draft
Author: AI Generated
Related Issue: #XX

---

## 1. Bug Summary

### 1.1 What is happening?

[現象の説明]

### 1.2 Expected behavior

[期待される動作]

### 1.3 Steps to reproduce

1.
2.
3.

### 1.4 Environment

- Browser/OS:
- Version:
- Frequency: [Always / Sometimes / Rarely]

### 1.5 Severity

[Critical / High / Medium / Low]

---

## 2. Impact Analysis

### 2.1 Affected Screens

| Screen ID | Name | Impact |
|-----------|------|--------|
| SCR-XXX | [画面名] | [どう影響を受けるか] |

### 2.2 Affected Masters

| Master ID | Name | Impact |
|-----------|------|--------|
| M-XXX | [マスタ名] | [どう影響を受けるか] |

### 2.3 Affected APIs

| API ID | Name | Impact |
|--------|------|--------|
| API-XXX-001 | [API名] | [どう影響を受けるか] |

### 2.4 Affected Rules

| Rule ID | Type | Description | Impact |
|---------|------|-------------|--------|
| BR-XXX | Business | [ルール説明] | [どう影響を受けるか] |
| VR-XXX | Validation | [ルール説明] | [どう影響を受けるか] |
| CR-XXX | Calculation | [ルール説明] | [どう影響を受けるか] |

### 2.5 Affected Features

| Feature ID | Title | Relationship |
|------------|-------|--------------|
| S-XXX-001 | [機能名] | [UC-XXX が影響を受ける 等] |

### 2.6 Affected Users

| Role | Impact |
|------|--------|
| [ロール名] | [どう影響を受けるか] |

---

## 3. Root Cause Analysis

### 3.1 Investigation Summary

[調査で分かったことのサマリー]

### 3.2 Root Cause

[根本原因]

### 3.3 Why it happened

[なぜこのバグが発生したか]

- [ ] 設計ミス
- [ ] 実装漏れ
- [ ] 仕様の曖昧さ
- [ ] エッジケース未考慮
- [ ] その他: ...

### 3.4 Evidence

[調査の証拠（ログ、スクリーンショット、コード箇所など）]

---

## 4. Fix Direction

### 4.1 Proposed Approach

[修正の方向性（詳細は Plan で）]

### 4.2 Spec Updates Required

| Spec Type | Spec ID | Section | Update Description |
|-----------|---------|---------|-------------------|
| Domain | S-DOMAIN-001 | M-XXX | [更新内容] |
| Screen | S-SCREEN-001 | SCR-XXX | [更新内容] |
| Feature | S-XXX-001 | FR-XXX | [更新内容] |

---

## 5. Open Questions

- [ ] [未解決の疑問点]

---

## 6. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| YYYY-MM-DD | Created | Initial fix specification | #XX |

Change types: Created, Updated, Clarified, Approved, Implemented
