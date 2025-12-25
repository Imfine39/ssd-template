# Test Scenario Workflow

Feature Spec から Test Scenario Spec を作成する。

## Purpose

- Feature Spec の Acceptance Criteria をテスト可能な形式に変換
- 具体的なテストデータとステップを定義
- E2E テスト実行の準備

---

## Prerequisites

- Feature Spec が存在し、clarified 状態であること
- Screen Spec が存在すること（UI 要素の参照用）

---

## Steps

### Step 1: Load Feature Spec

1. **Feature Spec を読み込み:**
   ```
   Read tool: .specify/specs/features/{feature}/spec.md
   ```

2. **抽出する情報:**
   - User Stories (US-*)
   - Acceptance Criteria (AC-*)
   - Functional Requirements (FR-*)
   - Related Screens (SCR-*)
   - Related APIs (API-*)

3. **Screen Spec を読み込み（UI 要素参照用）:**
   ```
   Read tool: .specify/specs/overview/screen/spec.md
   ```

### Step 2: Generate Test Coverage Matrix

AC と FR を一覧化し、テストケースをマッピング：

```
| AC/FR ID | Description | Test Cases |
|----------|-------------|------------|
| AC-001 | ユーザーがログインできる | TC-001, TC-N01, TC-N02 |
| AC-002 | ログアウトできる | TC-002 |
| FR-001 | メールアドレス形式を検証 | TC-N03 |
```

**ルール:**
- 各 AC に最低 1 つの Positive Test Case
- エラーケースがある AC には Negative Test Case
- バリデーションルール (VR-*) には境界値テスト

### Step 3: Define Test Data

1. **ユーザーに確認:**
   ```
   テストデータを定義します。

   Q1: テスト用メールアドレス
       推奨: test@example.com
       A) test@example.com
       B) その他（入力してください）

   Q2: テスト用パスワード
       推奨: Test1234!
       A) Test1234!
       B) その他（入力してください）

   Q3: テスト環境 URL
       A) http://localhost:3000
       B) https://staging.example.com
       C) その他（入力してください）
   ```

2. **動的データ要件を特定:**
   - 事前に存在が必要なデータ（ユーザー、案件など）
   - セットアップ方法（API 呼び出し、手動作成など）

### Step 4: Create Positive Test Cases

各 AC に対して Positive Test Case を作成：

**テンプレート:**
```markdown
### TC-NNN: [AC の内容を動詞形に]

**References:** AC-XXX, FR-XXX, SCR-XXX

**Priority:** [Feature の重要度に基づく]

**Preconditions:**
- [テスト開始時の状態]

**Steps:**
1. [SCR-XXX] に遷移
2. [要素] に {test_data_key} を入力
3. [ボタン] をクリック

**Expected Results:**
- [AC の期待結果を具体化]

**Status:** Pending
```

**ステップ作成のルール:**
- Screen Spec の SCR-* を参照して画面遷移を明確に
- 入力値は Test Data セクションのキーを使用 `{key_name}`
- 具体的なアクション（クリック、入力、選択）で記述

### Step 5: Create Negative Test Cases

エラーケースと境界値テストを作成：

**識別方法:**
- AC に「〜できない場合」「エラー時」の記述
- VR-* (Validation Rule) がある場合
- 入力項目の境界値

**例:**
```markdown
### TC-N01: 不正なパスワードでログイン失敗

**References:** AC-001 (error case)

**Steps:**
1. `/login` に遷移
2. メールアドレス欄に `{valid_email}` を入力
3. パスワード欄に `wrong_password` を入力
4. 「ログイン」ボタンをクリック

**Expected Results:**
- エラーメッセージ「パスワードが正しくありません」が表示される
- ログイン画面に留まる
```

### Step 6: Create Journey Tests

User Story 全体をカバーする E2E テストを作成：

**対象:**
- 重要な User Story (US-*)
- 複数画面にまたがるフロー
- Happy Path（正常系の完全フロー）

**例:**
```markdown
### TC-J01: 新規リード案件登録から受注移行まで

**References:** US-001 (full journey)

**Steps:**
1. ダッシュボードから「リード案件一覧」に遷移
2. 「新規作成」ボタンをクリック
3. リード案件情報を入力して保存
4. 作成されたリード案件詳細を確認
5. 「受注移行」ボタンをクリック
6. 受注案件として登録されることを確認

**Expected Results:**
- リード案件が受注案件に変換される
- 受注案件詳細画面が表示される
```

### Step 7: Save Test Scenario Spec

1. **Run scaffold:**
   ```bash
   node .claude/skills/spec-mesh/scripts/scaffold-spec.cjs --kind test-scenario --id TS-{FEATURE_ID} --title "{Feature Name} テストシナリオ"
   ```

2. **Fill template with generated content**

3. **Save to:**
   ```
   .specify/specs/features/{feature}/test-scenarios.md
   ```

### Step 8: Multi-Review

Test Scenario Spec の品質を確認：

1. **Read review workflow:**
   ```
   Read tool: .claude/skills/spec-mesh/workflows/review.md
   ```

2. **Execute Multi-Review:**
   - 3 つの reviewer agent を並列で起動
   - テストカバレッジの確認
   - テストデータの妥当性確認
   - ステップの具体性確認

### Step 9: Summary

```
=== Test Scenario Spec 作成完了 ===

Feature: {Feature Name}
Spec: .specify/specs/features/{feature}/test-scenarios.md

Test Coverage:
- Acceptance Criteria: {N}/{total} カバー
- Positive Cases: {N} 件
- Negative Cases: {N} 件
- Journey Tests: {N} 件

Test Data:
- 静的データ: {N} 項目定義
- 動的データ要件: {N} 項目

=== 次のステップ ===
- テスト環境を準備
- `/spec-mesh e2e` で E2E テスト実行
```

---

## Self-Check

- [ ] Feature Spec を読み込んだか
- [ ] すべての AC をテストケースにマッピングしたか
- [ ] テストデータをユーザーに確認したか
- [ ] Positive / Negative / Journey テストを作成したか
- [ ] Multi-Review を実行したか
- [ ] test-scenarios.md を保存したか

---

## Next Steps

**[HUMAN_CHECKPOINT]** Test Scenario Spec の内容を確認してから次のステップに進んでください。

| Condition | Command | Description |
|-----------|---------|-------------|
| 実装完了後 | `/spec-mesh e2e` | E2E テスト実行 |
| テスト前に実装する場合 | `/spec-mesh plan` | 実装計画作成 |

---

## Test Case Naming Convention

| Prefix | Type | Example |
|--------|------|---------|
| TC-{NNN} | Positive Test | TC-001, TC-002 |
| TC-N{NN} | Negative Test | TC-N01, TC-N02 |
| TC-J{NN} | Journey Test | TC-J01, TC-J02 |

---

## Priority Guidelines

| Priority | Criteria |
|----------|----------|
| Critical | ログイン、決済、データ保存など基本機能 |
| High | 主要なユーザーフロー |
| Medium | 補助機能、エラーハンドリング |
| Low | UI 装飾、オプション機能 |
