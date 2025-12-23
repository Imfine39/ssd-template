# Test Scenario Spec: [FEATURE_NAME]

<!--
  Template: Test Scenario Spec

  ID Formats:
    - Test Scenario: TS-{FEATURE_ID} (e.g., TS-AUTH-001)
    - Test Case (Positive): TC-{NNN} (e.g., TC-001, TC-002)
    - Test Case (Negative): TC-N{NN} (e.g., TC-N01, TC-N02)
    - Test Case (Journey): TC-J{NN} (e.g., TC-J01, TC-J02)
  See: .claude/skills/spec-mesh/guides/id-naming.md

  Status Values (from constitution.md - Status Values section):
    Test Scenario Spec Status:
    - Draft: Initial creation
    - In Review: Under stakeholder review
    - Ready: Approved and ready for execution
    - Executing: Test execution in progress
    - Completed: All tests executed

    Test Status (for individual test cases):
    - Pending: Not yet executed
    - Pass: Test passed
    - Fail: Test failed
    - Blocked: Cannot run due to dependencies
    - Skipped: Intentionally skipped
-->

Spec Type: Test Scenario
Spec ID: TS-{FEATURE_ID}
Feature: S-{XXX}-001
Created: {date}
Status: Draft

---

## 1. Test Suite Overview

### 1.1 Scope

| Item | Value |
|------|-------|
| Feature | [Feature Name] |
| Feature Spec | `.specify/specs/{project}/features/{feature}/spec.md` |
| Screens | SCR-001, SCR-002 |
| APIs | API-XXX-001, API-XXX-002 |

### 1.2 Test Coverage Matrix

| AC/FR ID | Description | Test Cases | Status |
|----------|-------------|------------|--------|
| AC-001 | [Acceptance Criteria 1] | TC-001, TC-N01 | Pending |
| AC-002 | [Acceptance Criteria 2] | TC-002 | Pending |
| FR-001 | [Functional Requirement 1] | TC-001 | Pending |

### 1.3 Test Environment

| Environment | URL | Notes |
|-------------|-----|-------|
| Local | http://localhost:3000 | 開発用 |
| Staging | https://staging.example.com | テスト用 |

---

## 2. Test Data

### 2.1 Static Test Data

| Key | Value | Description |
|-----|-------|-------------|
| valid_email | test@example.com | 正常なメールアドレス |
| valid_password | Test1234! | 正常なパスワード |
| invalid_email | not-an-email | 不正なメールアドレス |
| empty_string | | 空文字 |

### 2.2 Dynamic Data Requirements

| Requirement | Setup Method | Teardown |
|-------------|--------------|----------|
| 登録済みユーザー | テスト用固定ユーザー or API で作成 | 不要 |
| 既存案件データ | テストデータ投入 | テスト後削除 |

---

## 3. Positive Test Cases

### TC-001: [Test Case Title]

**References:** AC-001, FR-001, SCR-001

**Priority:** Critical | High | Medium | Low

**Preconditions:**
- [Precondition 1]
- [Precondition 2]

**Steps:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Expected Results:**
- [Expected result 1]
- [Expected result 2]

**Status:** Pending | Pass | Fail | Blocked | Skipped

**Evidence:** (screenshot/GIF link after execution)

---

### TC-002: [Test Case Title]

**References:** AC-002, SCR-002

**Priority:** High

**Preconditions:**
- [Precondition]

**Steps:**
1. [Step 1]
2. [Step 2]

**Expected Results:**
- [Expected result]

**Status:** Pending

---

## 4. Negative Test Cases

### TC-N01: [Negative Case Title]

**References:** AC-001 (error case)

**Priority:** High

**Preconditions:**
- [Precondition]

**Steps:**
1. [Step that should fail]

**Expected Results:**
- エラーメッセージ「[expected error message]」が表示される
- [Other expected behavior]

**Status:** Pending

---

### TC-N02: [Boundary/Edge Case Title]

**References:** FR-001 (boundary)

**Priority:** Medium

**Preconditions:**
- [Precondition]

**Steps:**
1. [Boundary value input]

**Expected Results:**
- [Expected behavior at boundary]

**Status:** Pending

---

## 5. Journey Tests

### TC-J01: [End-to-End Journey Title]

**References:** US-001 (full journey)

**Priority:** Critical

**Description:**
> [Brief description of the complete user journey being tested]

**Preconditions:**
- [Initial state]

**Steps:**
1. [Journey step 1]
2. [Journey step 2]
3. [Journey step 3]
4. [Journey step 4]
5. [Journey step 5]

**Expected Results:**
- [Final state achieved]
- [All intermediate states correct]

**Status:** Pending

**Evidence:** (journey GIF after execution)

---

## 6. Test Execution Log

| Date | Executor | Environment | TC IDs | Pass | Fail | Skip | Notes |
|------|----------|-------------|--------|------|------|------|-------|
| | | | | | | | |

---

## 7. Detailed Results

### Latest Execution: {date}

| TC ID | Result | Duration | Evidence | Notes |
|-------|--------|----------|----------|-------|
| TC-001 | ✅ Pass | 5s | [screenshot] | |
| TC-002 | ❌ Fail | 3s | [screenshot] | 期待と異なるメッセージ |
| TC-N01 | ✅ Pass | 2s | [screenshot] | |
| TC-J01 | ⏭️ Skip | - | - | 環境問題でブロック |

### Failure Details

#### TC-002: [Failure Title]

**Expected:**
```
[Expected state/text/behavior]
```

**Actual:**
```
[Actual state/text/behavior]
```

**Root Cause:** [If identified]

**Action Required:** [Fix needed or spec update]

---

## 8. Related Documents

- Feature Spec: `.specify/specs/{project}/features/{feature}/spec.md`
- Screen Spec: `.specify/specs/{project}/overview/screen/spec.md`
- Domain Spec: `.specify/specs/{project}/overview/domain/spec.md`

---

## 9. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| {date} | Created | Initial test scenario spec | AI Assistant |

Change types: Created, Updated, Executed, Reviewed
