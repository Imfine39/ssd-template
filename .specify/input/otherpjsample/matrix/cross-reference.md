# Cross Reference Matrix

> ⚠️ **AUTO-GENERATED** from `cross-reference.json`. Do not edit directly.
>
> Generated: 2025-12-17
> Source: `C:\Users\萓谷篤嗣\Desktop\ssd-template\.specify\input\otherpjsample\matrix\cross-reference.json`
> Regenerate: `node .specify/scripts/generate-matrix-view.cjs`

---

## 1. Screen → Domain

Which Masters and APIs each screen uses.

| Screen ID | Name | Masters | APIs |
|-----------|------|---------|------|
| SCR-001 | ログイン画面 | M-USER | API-AUTH-LOGIN |
| SCR-002 | ダッシュボード | M-SECTOR, M-LEAD, M-PROJECT, M-SECTOR-TARGET | API-DASHBOARD-GET |
| SCR-003 | リード案件一覧画面 | M-LEAD | API-LEAD-LIST, API-LEAD-CREATE, API-EXPORT-CSV |
| SCR-004 | リード案件詳細画面 | M-LEAD, M-ACTIVITY | API-LEAD-GET, API-LEAD-CREATE, API-LEAD-UPDATE, API-LEAD-CONVERT |
| SCR-005 | 受注案件一覧画面 | M-PROJECT | API-PROJECT-LIST, API-EXPORT-CSV |
| SCR-006 | 受注案件詳細画面 | M-PROJECT, M-MEMBER-ASSIGNMENT, M-REVENUE-PLAN, M-REVENUE-ACTUAL | API-PROJECT-GET, API-PROJECT-UPDATE, API-ASSIGNMENT-CREATE, API-REVENUE-REGISTER |
| SCR-007 | 売上実績一覧画面 | M-SECTOR, M-REVENUE-PLAN, M-REVENUE-ACTUAL | API-REVENUE-SUMMARY, API-EXPORT-CSV |
| SCR-008 | メンバー管理画面 | M-USER, M-MEMBER-ASSIGNMENT | API-UTILIZATION-GET |
| SCR-009 | セクター別売上目標画面 | M-SECTOR, M-SECTOR-TARGET | API-TARGET-SET |
| SCR-010 | 設定画面 | M-USER, M-SECTOR | - |


---

## 2. Feature → Domain

Which Screens, Masters, APIs, and Rules each feature uses.

| Feature ID | Title | Screens | Masters | APIs | Rules |
|------------|-------|---------|---------|------|-------|
| S-DASHBOARD-001 | ダッシュボード | SCR-002 | M-LEAD, M-PROJECT, M-SECTOR-TARGET | API-DASHBOARD-GET | - |
| S-FOUNDATION-001 | 基盤構築 | SCR-001, SCR-010 | M-USER, M-SECTOR | API-AUTH-LOGIN | - |
| S-LEAD-001 | リード案件管理 | SCR-003, SCR-004 | M-LEAD, M-ACTIVITY | API-LEAD-LIST, API-LEAD-GET, API-LEAD-CREATE, API-LEAD-UPDATE, API-LEAD-CONVERT | BR-001 |
| S-PROJECT-001 | 受注案件管理 | SCR-005, SCR-006 | M-PROJECT, M-MEMBER-ASSIGNMENT | API-PROJECT-LIST, API-PROJECT-GET, API-PROJECT-UPDATE, API-ASSIGNMENT-CREATE | BR-002, BR-003 |
| S-REVENUE-001 | 売上管理 | SCR-006, SCR-007, SCR-009 | M-REVENUE-PLAN, M-REVENUE-ACTUAL, M-SECTOR-TARGET | API-REVENUE-REGISTER, API-REVENUE-SUMMARY, API-TARGET-SET | BR-004 |


---

## 3. Reverse Lookup: Master → Usage

Find all screens and features that use a specific Master.

| Master | Used by Screens | Used by Features |
|--------|-----------------|------------------|
| M-ACTIVITY | SCR-004 | S-LEAD-001 |
| M-LEAD | SCR-002, SCR-003, SCR-004 | S-DASHBOARD-001, S-LEAD-001 |
| M-MEMBER-ASSIGNMENT | SCR-006, SCR-008 | S-PROJECT-001 |
| M-PROJECT | SCR-002, SCR-005, SCR-006 | S-DASHBOARD-001, S-PROJECT-001 |
| M-REVENUE-ACTUAL | SCR-006, SCR-007 | S-REVENUE-001 |
| M-REVENUE-PLAN | SCR-006, SCR-007 | S-REVENUE-001 |
| M-SECTOR | SCR-002, SCR-007, SCR-009, SCR-010 | S-FOUNDATION-001 |
| M-SECTOR-TARGET | SCR-002, SCR-009 | S-DASHBOARD-001, S-REVENUE-001 |
| M-USER | SCR-001, SCR-008, SCR-010 | S-FOUNDATION-001 |


---

## 4. Reverse Lookup: API → Usage

Find all screens and features that use a specific API.

| API | Used by Screens | Used by Features |
|-----|-----------------|------------------|
| API-ASSIGNMENT-CREATE | SCR-006 | S-PROJECT-001 |
| API-AUTH-LOGIN | SCR-001 | S-FOUNDATION-001 |
| API-DASHBOARD-GET | SCR-002 | S-DASHBOARD-001 |
| API-EXPORT-CSV | SCR-003, SCR-005, SCR-007 | - |
| API-LEAD-CONVERT | SCR-004 | S-LEAD-001 |
| API-LEAD-CREATE | SCR-003, SCR-004 | S-LEAD-001 |
| API-LEAD-GET | SCR-004 | S-LEAD-001 |
| API-LEAD-LIST | SCR-003 | S-LEAD-001 |
| API-LEAD-UPDATE | SCR-004 | S-LEAD-001 |
| API-PROJECT-GET | SCR-006 | S-PROJECT-001 |
| API-PROJECT-LIST | SCR-005 | S-PROJECT-001 |
| API-PROJECT-UPDATE | SCR-006 | S-PROJECT-001 |
| API-REVENUE-REGISTER | SCR-006 | S-REVENUE-001 |
| API-REVENUE-SUMMARY | SCR-007 | S-REVENUE-001 |
| API-TARGET-SET | SCR-009 | S-REVENUE-001 |
| API-UTILIZATION-GET | SCR-008 | - |


---

## 5. Permission Matrix

Role-based API permissions.

| API | * | associate | associate_manager | consultant | manager | senior_consultant | senior_manager |
|-----|---|---|---|---|---|---|---|
| API-ASSIGNMENT-CREATE | - | - | - | - | ✓ | - | ✓ |
| API-AUTH-LOGIN | ✓ | - | - | - | - | - | - |
| API-DASHBOARD-GET | - | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-EXPORT-CSV | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-LEAD-CONVERT | - | - | ✓ | - | ✓ | ✓ | ✓ |
| API-LEAD-CREATE | - | - | ✓ | - | ✓ | ✓ | ✓ |
| API-LEAD-GET | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-LEAD-LIST | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-LEAD-UPDATE | - | - | ✓ | - | ✓ | ✓ | ✓ |
| API-PROJECT-GET | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-PROJECT-LIST | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-PROJECT-UPDATE | - | - | ✓ | - | ✓ | ✓ | ✓ |
| API-REVENUE-REGISTER | - | - | ✓ | - | ✓ | - | ✓ |
| API-REVENUE-SUMMARY | - | - | ✓ | ✓ | ✓ | ✓ | ✓ |
| API-TARGET-SET | - | - | - | - | - | - | ✓ |
| API-UTILIZATION-GET | - | - | - | - | ✓ | - | ✓ |


---

## 6. Statistics

| Metric | Count |
|--------|-------|
| Total Screens | 10 |
| Total Features | 5 |
| Total Masters Referenced | 9 |
| Total APIs Referenced | 16 |
| Total Rules Referenced | 4 |

---

*This file is auto-generated. To update, edit `cross-reference.json` and run the generator script.*
