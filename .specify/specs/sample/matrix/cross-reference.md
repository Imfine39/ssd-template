# Cross Reference Matrix

> ⚠️ **AUTO-GENERATED** from `cross-reference.json`. Do not edit directly.
>
> Generated: 2025-12-18
> Source: `C:\Users\萓谷篤嗣\Desktop\ssd-template\.specify\specs\sample\matrix\cross-reference.json`
> Regenerate: `node .specify/scripts/generate-matrix-view.cjs`

---

## 1. Screen → Domain

Which Masters and APIs each screen uses.

| Screen ID | Name | Masters | APIs |
|-----------|------|---------|------|
| SCR-001 | ログイン画面 | - | API-AUTH-LOGIN-001, API-AUTH-CALLBACK-001 |
| SCR-002 | ダッシュボード | M-USER, M-LEAD, M-ORDER, M-SALES-RECORD, M-SALES-TARGET | API-DASHBOARD-001 |
| SCR-003 | リード案件一覧画面 | M-LEAD, M-USER, M-SECTOR | API-LEAD-LIST-001 |
| SCR-004 | リード案件詳細画面 | M-LEAD, M-ACTIVITY, M-USER, M-SECTOR | API-LEAD-GET-001, API-LEAD-CREATE-001, API-LEAD-UPDATE-001, API-LEAD-CONVERT-001 |
| SCR-005 | 受注案件一覧画面 | M-ORDER, M-USER, M-SECTOR | API-ORDER-LIST-001 |
| SCR-006 | 受注案件詳細画面 | M-ORDER, M-ASSIGNMENT, M-SALES-RECORD, M-USER | API-ORDER-GET-001, API-ASSIGNMENT-CREATE-001, API-SALES-RECORD-CREATE-001 |
| SCR-007 | 売上実績一覧画面 | M-SALES-RECORD, M-SALES-TARGET, M-SECTOR | API-SALES-SUMMARY-001 |
| SCR-008 | メンバー管理画面 | M-USER, M-ROLE, M-SECTOR, M-ASSIGNMENT | API-MEMBER-LIST-001 |
| SCR-009 | セクター別売上目標画面 | M-SALES-TARGET, M-SECTOR | API-SALES-SUMMARY-001, API-SALES-TARGET-SET-001 |
| SCR-010 | 設定画面 | M-USER, M-ROLE, M-SECTOR | - |


---

## 2. Feature → Domain

Which Screens, Masters, APIs, and Rules each feature uses.

| Feature ID | Title | Screens | Masters | APIs | Rules |
|------------|-------|---------|---------|------|-------|
| S-AUTH-001 | Azure AD 認証 | SCR-001 | M-USER, M-ROLE | API-AUTH-LOGIN-001, API-AUTH-CALLBACK-001, API-AUTH-LOGOUT-001 | - |
| S-DASHBOARD-001 | ダッシュボード | SCR-002 | M-USER, M-LEAD, M-ORDER, M-SALES-RECORD, M-SALES-TARGET | API-DASHBOARD-001 | CR-002, CR-004 |
| S-FOUNDATION-001 | 基盤構築 | - | M-USER, M-ROLE, M-SECTOR | API-AUTH-LOGIN-001, API-AUTH-CALLBACK-001, API-AUTH-LOGOUT-001 | - |
| S-LEAD-001 | リード案件管理 | SCR-003, SCR-004 | M-LEAD, M-ACTIVITY, M-USER, M-SECTOR | API-LEAD-LIST-001, API-LEAD-GET-001, API-LEAD-CREATE-001, API-LEAD-UPDATE-001, API-LEAD-CONVERT-001 | BR-001, BR-005, VR-001, VR-002 |
| S-MEMBER-001 | メンバー稼働率管理 | SCR-008 | M-USER, M-ROLE, M-SECTOR, M-ASSIGNMENT | API-MEMBER-LIST-001 | CR-001 |
| S-ORDER-001 | 受注案件管理 | SCR-005, SCR-006 | M-ORDER, M-ASSIGNMENT, M-USER, M-SECTOR | API-ORDER-LIST-001, API-ORDER-GET-001, API-ASSIGNMENT-CREATE-001 | BR-002, VR-003, VR-004, VR-005, VR-006, VR-007, CR-003 |
| S-SALES-001 | 売上実績管理 | SCR-006, SCR-007 | M-SALES-RECORD, M-ORDER | API-SALES-RECORD-CREATE-001, API-SALES-SUMMARY-001 | BR-003, CR-002 |
| S-TARGET-001 | セクター売上目標管理 | SCR-009 | M-SALES-TARGET, M-SECTOR | API-SALES-TARGET-SET-001, API-SALES-SUMMARY-001 | BR-004, BR-006, CR-004 |


---

## 3. Reverse Lookup: Master → Usage

Find all screens and features that use a specific Master.

| Master | Used by Screens | Used by Features |
|--------|-----------------|------------------|
| M-ACTIVITY | SCR-004 | S-LEAD-001 |
| M-ASSIGNMENT | SCR-006, SCR-008 | S-MEMBER-001, S-ORDER-001 |
| M-LEAD | SCR-002, SCR-003, SCR-004 | S-DASHBOARD-001, S-LEAD-001 |
| M-ORDER | SCR-002, SCR-005, SCR-006 | S-DASHBOARD-001, S-ORDER-001, S-SALES-001 |
| M-ROLE | SCR-008, SCR-010 | S-AUTH-001, S-FOUNDATION-001, S-MEMBER-001 |
| M-SALES-RECORD | SCR-002, SCR-006, SCR-007 | S-DASHBOARD-001, S-SALES-001 |
| M-SALES-TARGET | SCR-002, SCR-007, SCR-009 | S-DASHBOARD-001, S-TARGET-001 |
| M-SECTOR | SCR-003, SCR-004, SCR-005, SCR-007, SCR-008, SCR-009, SCR-010 | S-FOUNDATION-001, S-LEAD-001, S-MEMBER-001, S-ORDER-001, S-TARGET-001 |
| M-USER | SCR-002, SCR-003, SCR-004, SCR-005, SCR-006, SCR-008, SCR-010 | S-AUTH-001, S-DASHBOARD-001, S-FOUNDATION-001, S-LEAD-001, S-MEMBER-001, S-ORDER-001 |


---

## 4. Reverse Lookup: API → Usage

Find all screens and features that use a specific API.

| API | Used by Screens | Used by Features |
|-----|-----------------|------------------|
| API-ASSIGNMENT-CREATE-001 | SCR-006 | S-ORDER-001 |
| API-AUTH-CALLBACK-001 | SCR-001 | S-AUTH-001, S-FOUNDATION-001 |
| API-AUTH-LOGIN-001 | SCR-001 | S-AUTH-001, S-FOUNDATION-001 |
| API-AUTH-LOGOUT-001 | - | S-AUTH-001, S-FOUNDATION-001 |
| API-DASHBOARD-001 | SCR-002 | S-DASHBOARD-001 |
| API-LEAD-CONVERT-001 | SCR-004 | S-LEAD-001 |
| API-LEAD-CREATE-001 | SCR-004 | S-LEAD-001 |
| API-LEAD-GET-001 | SCR-004 | S-LEAD-001 |
| API-LEAD-LIST-001 | SCR-003 | S-LEAD-001 |
| API-LEAD-UPDATE-001 | SCR-004 | S-LEAD-001 |
| API-MEMBER-LIST-001 | SCR-008 | S-MEMBER-001 |
| API-ORDER-GET-001 | SCR-006 | S-ORDER-001 |
| API-ORDER-LIST-001 | SCR-005 | S-ORDER-001 |
| API-SALES-RECORD-CREATE-001 | SCR-006 | S-SALES-001 |
| API-SALES-SUMMARY-001 | SCR-007, SCR-009 | S-SALES-001, S-TARGET-001 |
| API-SALES-TARGET-SET-001 | SCR-009 | S-TARGET-001 |


---

## 5. Permission Matrix

Role-based API permissions.

| API | Associate | AssociateManager | Authenticated | Consultant | Manager | Public | SeniorConsultant | SeniorManager |
|-----|---|---|---|---|---|---|---|---|
| API-ASSIGNMENT-CREATE-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-AUTH-CALLBACK-001 | - | - | - | - | - | ✓ | - | - |
| API-AUTH-LOGIN-001 | - | - | - | - | - | ✓ | - | - |
| API-AUTH-LOGOUT-001 | - | - | ✓ | - | - | - | - | - |
| API-DASHBOARD-001 | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ |
| API-LEAD-CONVERT-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-LEAD-CREATE-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-LEAD-GET-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-LEAD-LIST-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-LEAD-UPDATE-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-MEMBER-LIST-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-ORDER-GET-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-ORDER-LIST-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-SALES-RECORD-CREATE-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-SALES-SUMMARY-001 | - | ✓ | - | - | ✓ | - | ✓ | ✓ |
| API-SALES-TARGET-SET-001 | - | - | - | - | ✓ | - | - | ✓ |


---

## 6. Statistics

| Metric | Count |
|--------|-------|
| Total Screens | 10 |
| Total Features | 8 |
| Total Masters Referenced | 9 |
| Total APIs Referenced | 16 |
| Total Rules Referenced | 17 |

---

*This file is auto-generated. To update, edit `cross-reference.json` and run the generator script.*
