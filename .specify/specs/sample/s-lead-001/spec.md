# Feature Specification: リード案件管理

Spec Type: Feature
Spec ID: S-LEAD-001
Created: 2025-12-18
Status: Draft
Author: AI Generated
Related Domain: S-DOMAIN-001
Related Issue: #10

---

## 1. Purpose

### 1.1 What problem does this feature solve?

営業担当者がリード案件（商談中の案件）を効率的に管理できるようにする。
現状はエクセルで管理しており、検索や進捗把握が困難。

### 1.2 Who benefits and how?

- **シニアコンサルタント**: リード案件の作成・編集・検索が容易になる
- **マネージャー**: チームのリード案件状況を一覧で把握できる
- **経営層**: パイプライン全体の可視化

### 1.3 Success metrics

- リード案件登録時間の短縮（目標: 5分以内）
- リード案件の検索時間の短縮（目標: 10秒以内）
- 受注移行率の可視化

---

## 2. Domain Dependencies

This feature uses the following domain entities:

| Domain Element | Usage | Referenced In |
|----------------|-------|---------------|
| M-LEAD | リード案件データ | UC-001, UC-002, UC-003 |
| M-USER | 担当者情報 | UC-001 |
| M-ACTIVITY | 活動履歴 | UC-002 |
| M-SECTOR | セクター情報 | UC-001 |
| API-LEAD-LIST-001 | 一覧取得 | UC-003 |
| API-LEAD-GET-001 | 詳細取得 | UC-002 |
| API-LEAD-CREATE-001 | 新規作成 | UC-001 |
| API-LEAD-UPDATE-001 | 更新 | UC-002 |
| API-LEAD-CONVERT-001 | 受注移行 | UC-004 |
| BR-001 | リード→受注移行ルール | UC-004 |
| BR-005 | 権限ルール | UC-001 |
| VR-001 | 確度バリデーション | UC-001, UC-002 |
| VR-002 | 想定売上バリデーション | UC-001, UC-002 |

---

## 3. Actors

| Actor | Role | Permissions for this Feature |
|-------|------|------------------------------|
| シニアコンサルタント | SeniorConsultant | 全操作（CRUD、受注移行） |
| アソシエイトマネージャー | AssociateManager | 全操作 |
| マネージャー | Manager | 全操作 + 他者の案件編集 |
| シニアマネージャー | SeniorManager | 全操作 + 他者の案件編集 |

---

## 4. User Stories (UC-*)

### UC-001: リード案件の新規作成

**As a** シニアコンサルタント
**I want to** 新しいリード案件を登録する
**So that** 商談の進捗を管理できる

**Acceptance Criteria:**

1. リード案件一覧画面から「新規作成」ボタンをクリックできる
2. 必須項目（案件名、顧客名、想定売上、確度、セクター）を入力できる
3. 保存すると一覧に新しい案件が表示される
4. ステータスは「新規」で作成される

**UI Flow:**

```
リード案件一覧 → [新規作成ボタン] → 作成フォーム → [保存] → 一覧（更新済み）
```

---

### UC-002: リード案件の詳細確認と編集

**As a** シニアコンサルタント
**I want to** リード案件の詳細を確認・編集する
**So that** 営業活動の進捗を記録できる

**Acceptance Criteria:**

1. 一覧から案件をクリックすると詳細画面が表示される
2. 案件情報を編集できる
3. 活動履歴を追加できる
4. ステータスを変更できる

**UI Flow:**

```
リード案件一覧 → [行クリック] → 詳細画面 → [編集] → [保存] → 詳細画面（更新済み）
```

---

### UC-003: リード案件の検索・フィルタリング

**As a** シニアコンサルタント
**I want to** リード案件を検索・フィルタリングする
**So that** 必要な案件をすぐに見つけられる

**Acceptance Criteria:**

1. 案件名・顧客名で検索できる
2. ステータスでフィルタリングできる
3. 担当者でフィルタリングできる
4. 検索結果はページネーションで表示される

**UI Flow:**

```
リード案件一覧 → [検索/フィルター入力] → 検索結果表示
```

---

### UC-004: リード案件から受注案件への移行

**As a** シニアコンサルタント
**I want to** 商談成功したリード案件を受注案件に移行する
**So that** 契約管理とメンバーアサインができる

**Acceptance Criteria:**

1. 詳細画面で「受注移行」ボタンをクリックできる
2. 契約金額、値引き率、期間を入力するモーダルが表示される
3. 移行完了後、受注案件詳細画面に遷移する
4. 元のリード案件のステータスは「受注」になる

**UI Flow:**

```
リード案件詳細 → [受注移行ボタン] → 移行モーダル → [確定] → 受注案件詳細
```

---

## 5. Functional Requirements (FR-*)

### FR-001: リード案件一覧表示

- 一覧には以下を表示: 案件名、顧客名、想定売上、確度、ステータス、担当者
- デフォルトソート: 更新日時降順
- 1ページあたり20件

### FR-002: リード案件作成フォーム

- 必須項目: 案件名、顧客名、想定売上、確度、セクター
- 任意項目: 説明
- 担当者はログインユーザーで自動設定

### FR-003: リード案件編集

- 全フィールドが編集可能
- ステータスは選択肢から選ぶ
- 編集時は更新日時を自動更新

### FR-004: 活動履歴機能

- 活動種別（電話、メール、訪問、会議、提案、その他）を選択
- 活動日と内容を入力
- 時系列で表示（新しい順）

### FR-005: 受注移行機能

- 契約金額（必須）、値引き率（任意、デフォルト0）、期間（必須）を入力
- 移行実行時に M-ORDER レコードを作成
- M-LEAD のステータスを「won」に更新

### FR-006: 検索・フィルター機能

- テキスト検索: 案件名・顧客名の部分一致
- ステータスフィルター: 複数選択可能
- 担当者フィルター: 単一選択
- [NEEDS CLARIFICATION] 検索結果のソート順オプション

---

## 6. Success Criteria (SC-*)

### SC-001: 一覧表示パフォーマンス

- 1000件のリード案件でも500ms以内に一覧表示

### SC-002: 作成フロー完了

- 新規作成から保存まで5クリック以内

### SC-003: 検索レスポンス

- 検索結果が1秒以内に表示される

---

## 7. Edge Cases and Error Handling

### 7.1 Error Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| バリデーションエラー | フォーム上にエラーメッセージ表示 |
| API タイムアウト | 「接続エラー」トースト表示、リトライ可能 |
| 権限不足 | 「権限がありません」メッセージ表示 |
| 既に受注済みの案件を再度移行 | 「既に受注済みです」エラー |

### 7.2 Edge Cases

| Case | Handling |
|------|----------|
| 想定売上が0円 | 許容（ボランティア案件等） |
| 確度100%だが受注移行しない | 許容（移行は手動操作） |
| [NEEDS CLARIFICATION] 同時編集 | 楽観的ロックで競合検出？ |

---

## 8. UI/UX Specifications

### 8.1 Screen References

This feature uses:

| Screen ID | Screen Name | Usage |
|-----------|-------------|-------|
| SCR-003 | リード案件一覧画面 | 一覧表示、検索 |
| SCR-004 | リード案件詳細画面 | 詳細確認、編集、活動記録、受注移行 |

### 8.2 Key UI Components

- 一覧テーブル（ソート可能、ページネーション付き）
- 検索バー + フィルターパネル
- 詳細フォーム（インライン編集）
- 活動履歴タイムライン
- 受注移行モーダル

### 8.3 Screen Modifications

No new screens required. Using existing SCR-003, SCR-004 from Screen Spec.

---

## 9. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Response time | < 500ms (p95) |
| Concurrent edits | [NEEDS CLARIFICATION] |
| Audit logging | 作成・更新・削除・受注移行をログ記録 |

---

## 10. Dependencies

### 10.1 Feature Dependencies

| Depends On | Reason |
|------------|--------|
| S-AUTH-001 | 認証・認可 |

### 10.2 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| None | - | - |

---

## 11. Test Plan

### 11.1 Unit Tests

- [ ] バリデーション: 確度が0-100の範囲内
- [ ] バリデーション: 想定売上が0以上
- [ ] 受注移行: ステータスが正しく更新される

### 11.2 Integration Tests

- [ ] @uc UC-001: リード案件作成フロー
- [ ] @uc UC-002: リード案件編集フロー
- [ ] @uc UC-003: 検索・フィルタリング
- [ ] @uc UC-004: 受注移行フロー

### 11.3 E2E Tests

- [ ] 一覧→詳細→編集→保存の一連フロー
- [ ] 新規作成→受注移行の一連フロー

---

## 12. Open Questions

- [ ] 同時編集時の競合処理方法（楽観的ロック vs 悲観的ロック）
- [ ] 検索結果のソート順オプション（更新日時以外に何が必要か）
- [ ] 活動履歴の編集・削除は可能か

---

## 13. Clarifications

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| - | - | - | - |

---

## 14. Approvals

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | - | - | Pending |
| Tech Lead | - | - | Pending |

---

## 15. Traceability

- Vision Spec: `.specify/specs/sample/vision/spec.md`
- Domain Spec: `.specify/specs/sample/domain/spec.md`
- Screen Spec: `.specify/specs/sample/screen/spec.md`

---

## 16. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| 2025-12-18 | Created | Initial feature specification | #10 |

Change types: Created, Updated, Clarified, Approved, Implemented

---

## 17. Implementation Notes

Notes discovered during implementation.

- Technical constraints discovered: (TBD)
- Design decisions made: (TBD)
- Deviations from spec (with justification): (TBD)
- Feedback for Domain Spec updates: (TBD)
