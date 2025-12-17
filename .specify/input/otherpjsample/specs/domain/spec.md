# Domain Specification: Sales Quest

Spec Type: Domain
Spec ID: S-DOMAIN-001
Created: 2025-12-17
Status: Draft
Author: AI Generated (Sample)
Related Vision: S-VISION-001
Related Screen: S-SCREEN-001

---

## 1. Domain Overview

### 1.1 Domain Description

Sales Quest の技術ドメイン仕様。SFA（営業支援）と売上管理を統合した営業管理システムの技術設計を定義する。

- Vision Spec: `.specify/input/otherpjsample/specs/vision/spec.md`
- Screen Spec: `.specify/input/otherpjsample/specs/screen/spec.md` (to be created)
- Domain boundaries:
  - リード案件管理（商談機会〜受注前）
  - 受注案件管理（受注後のプロジェクト管理）
  - 売上管理（実績・目標）
  - メンバー・稼働率管理
- Core concepts:
  - Lead（リード案件）→ Project（受注案件）への移行
  - Member Assignment（メンバーアサイン）と Utilization Rate（稼働率）
  - Sector（セクター）ベースの組織・目標管理

### 1.2 System Context

```
[Azure AD] <---> [Sales Quest] <---> [Database]
                      |
                      v
              [Export (CSV)]
```

- Upstream systems: Azure AD（認証）
- Downstream systems: なし（外部連携はスコープ外）
- Integration points: Azure AD OAuth 2.0

---

## 2. Actors and Roles

| Actor | Role | Permissions | Authentication |
|-------|------|-------------|----------------|
| シニアマネージャー | senior_manager | 全機能アクセス、セクター目標設定 | Azure AD |
| マネージャー | manager | 担当セクター全機能、メンバー管理 | Azure AD |
| アソシエイトマネージャー | associate_manager | 案件編集、売上登録 | Azure AD |
| シニアコンサルタント | senior_consultant | 案件作成・編集、売上登録 | Azure AD |
| コンサルタント | consultant | 自担当案件閲覧、稼働確認 | Azure AD |
| アソシエイト | associate | 自アサイン確認のみ | Azure AD |

---

## 3. Master Data Definitions (M-*)

### M-USER: ユーザー

**Purpose:** システム利用ユーザー情報

**Used by screens:** SCR-001, SCR-008, SCR-010

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| azure_ad_id | String | Yes | Azure AD Object ID |
| name | String | Yes | 氏名 |
| email | String | Yes | メールアドレス |
| role | Enum | Yes | 役職 (associate/consultant/senior_consultant/associate_manager/manager/senior_manager) |
| sector_id | UUID | Yes | 所属セクター |
| is_active | Boolean | Yes | 有効フラグ |
| created_at | DateTime | Yes | 作成日時 |
| updated_at | DateTime | Yes | 更新日時 |

**Relationships:**
- belongs_to M-SECTOR
- has_many M-MEMBER-ASSIGNMENT

**Constraints:**
- email は一意
- role は定義された Enum 値のみ

---

### M-SECTOR: セクター

**Purpose:** 組織構造（セクター）情報

**Used by screens:** SCR-002, SCR-007, SCR-009

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| name | String | Yes | セクター名 |
| code | String | Yes | セクターコード |
| manager_id | UUID | No | セクター長 (M-USER.id) |
| is_active | Boolean | Yes | 有効フラグ |
| created_at | DateTime | Yes | 作成日時 |

**Relationships:**
- has_many M-USER
- has_many M-SECTOR-TARGET

**Constraints:**
- code は一意

---

### M-LEAD: リード案件

**Purpose:** 商談機会（受注前の案件）情報

**Used by screens:** SCR-002, SCR-003, SCR-004

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| lead_number | String | Yes | リード番号（自動採番） |
| customer_name | String | Yes | 顧客名 |
| customer_contact | String | No | 顧客担当者 |
| title | String | Yes | 案件名 |
| description | Text | No | 案件概要 |
| expected_revenue | Decimal | No | 想定売上 |
| probability | Integer | No | 確度 (0-100%) |
| status | Enum | Yes | ステータス (new/contacting/proposing/negotiating/won/lost) |
| owner_id | UUID | Yes | 担当者 (M-USER.id) |
| sector_id | UUID | Yes | セクター (M-SECTOR.id) |
| expected_close_date | Date | No | 受注予定日 |
| created_at | DateTime | Yes | 作成日時 |
| updated_at | DateTime | Yes | 更新日時 |

**Relationships:**
- belongs_to M-USER (owner)
- belongs_to M-SECTOR
- has_many M-ACTIVITY
- converts_to M-PROJECT

**Constraints:**
- status が 'won' の場合、M-PROJECT への変換が必要
- probability は 0-100 の範囲

---

### M-PROJECT: 受注案件

**Purpose:** 受注後のプロジェクト情報

**Used by screens:** SCR-002, SCR-005, SCR-006

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| project_number | String | Yes | プロジェクト番号（自動採番） |
| lead_id | UUID | No | 元リード (M-LEAD.id) |
| customer_name | String | Yes | 顧客名 |
| title | String | Yes | プロジェクト名 |
| description | Text | No | プロジェクト概要 |
| contract_amount | Decimal | Yes | 契約金額 |
| discount_rate | Decimal | No | 値引き率 |
| status | Enum | Yes | ステータス (active/completed/cancelled) |
| owner_id | UUID | Yes | 担当者 (M-USER.id) |
| sector_id | UUID | Yes | セクター (M-SECTOR.id) |
| start_date | Date | Yes | 開始日 |
| end_date | Date | No | 終了予定日 |
| created_at | DateTime | Yes | 作成日時 |
| updated_at | DateTime | Yes | 更新日時 |

**Relationships:**
- belongs_to M-LEAD (optional)
- belongs_to M-USER (owner)
- belongs_to M-SECTOR
- has_many M-MEMBER-ASSIGNMENT
- has_many M-REVENUE-PLAN
- has_many M-REVENUE-ACTUAL

**Constraints:**
- contract_amount > 0
- discount_rate は 0-100 の範囲

---

### M-MEMBER-ASSIGNMENT: メンバーアサイン

**Purpose:** プロジェクトへのメンバーアサイン情報

**Used by screens:** SCR-006, SCR-008

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| project_id | UUID | Yes | プロジェクト (M-PROJECT.id) |
| user_id | UUID | Yes | メンバー (M-USER.id) |
| role | String | No | プロジェクト内役割 |
| allocation_rate | Decimal | Yes | アサイン率 (0-100%) |
| start_date | Date | Yes | アサイン開始日 |
| end_date | Date | No | アサイン終了日 |
| created_at | DateTime | Yes | 作成日時 |

**Relationships:**
- belongs_to M-PROJECT
- belongs_to M-USER

**Constraints:**
- allocation_rate は 0-100 の範囲
- 同一ユーザーの同一期間の合計 allocation_rate は 100% を超えないことを推奨（警告のみ）

---

### M-REVENUE-PLAN: 売上予定

**Purpose:** プロジェクト別の月次売上予定

**Used by screens:** SCR-006, SCR-007

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| project_id | UUID | Yes | プロジェクト (M-PROJECT.id) |
| year_month | String | Yes | 対象年月 (YYYY-MM) |
| planned_amount | Decimal | Yes | 予定金額 |
| created_at | DateTime | Yes | 作成日時 |
| updated_at | DateTime | Yes | 更新日時 |

**Relationships:**
- belongs_to M-PROJECT

**Constraints:**
- year_month は YYYY-MM 形式
- planned_amount >= 0

---

### M-REVENUE-ACTUAL: 売上実績

**Purpose:** プロジェクト別の月次売上実績

**Used by screens:** SCR-006, SCR-007

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| project_id | UUID | Yes | プロジェクト (M-PROJECT.id) |
| year_month | String | Yes | 対象年月 (YYYY-MM) |
| actual_amount | Decimal | Yes | 実績金額 |
| registered_by | UUID | Yes | 登録者 (M-USER.id) |
| created_at | DateTime | Yes | 作成日時 |
| updated_at | DateTime | Yes | 更新日時 |

**Relationships:**
- belongs_to M-PROJECT
- belongs_to M-USER (registered_by)

**Constraints:**
- year_month は YYYY-MM 形式
- actual_amount >= 0

---

### M-SECTOR-TARGET: セクター売上目標

**Purpose:** セクター別の売上目標

**Used by screens:** SCR-002, SCR-009

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| sector_id | UUID | Yes | セクター (M-SECTOR.id) |
| fiscal_year | Integer | Yes | 対象年度 |
| year_month | String | No | 対象年月 (月別目標の場合) |
| target_amount | Decimal | Yes | 目標金額 |
| created_at | DateTime | Yes | 作成日時 |
| updated_at | DateTime | Yes | 更新日時 |

**Relationships:**
- belongs_to M-SECTOR

**Constraints:**
- target_amount > 0

---

### M-ACTIVITY: 活動履歴

**Purpose:** リード案件に対する活動履歴

**Used by screens:** SCR-004

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| lead_id | UUID | Yes | リード (M-LEAD.id) |
| activity_type | Enum | Yes | 種別 (call/meeting/email/other) |
| description | Text | Yes | 内容 |
| activity_date | Date | Yes | 活動日 |
| user_id | UUID | Yes | 活動者 (M-USER.id) |
| created_at | DateTime | Yes | 作成日時 |

**Relationships:**
- belongs_to M-LEAD
- belongs_to M-USER

---

## 4. API Contracts (API-*)

### API-AUTH-LOGIN: ログイン

**Purpose:** Azure AD 認証後のセッション開始

**Used by screens:** SCR-001

**Endpoint:**
```
POST /api/v1/auth/login
```

**Request:**
```json
{
  "azure_ad_token": "string"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "string",
    "sector": { "id": "uuid", "name": "string" }
  },
  "access_token": "string",
  "expires_at": "datetime"
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_INVALID_TOKEN | 401 | Azure AD トークンが無効 |
| AUTH_USER_NOT_FOUND | 404 | ユーザーが未登録 |
| AUTH_USER_INACTIVE | 403 | ユーザーが無効化されている |

**Authorization:** None (public)

---

### API-DASHBOARD-GET: ダッシュボード取得

**Purpose:** ダッシュボード用の KPI サマリー取得

**Used by screens:** SCR-002

**Endpoint:**
```
GET /api/v1/dashboard
```

**Response (Success):**
```json
{
  "lead_summary": {
    "total": 100,
    "by_status": { "new": 20, "contacting": 30, "proposing": 25, "negotiating": 15, "won": 8, "lost": 2 }
  },
  "project_summary": {
    "active": 25,
    "completed": 50
  },
  "revenue": {
    "current_month_target": 10000000,
    "current_month_actual": 7500000,
    "achievement_rate": 75.0
  },
  "upcoming_actions": [
    { "lead_id": "uuid", "title": "string", "action": "string", "due_date": "date" }
  ]
}
```

**Authorization:** All authenticated users

---

### API-LEAD-LIST: リード一覧取得

**Purpose:** リード案件一覧の取得（検索・フィルター対応）

**Used by screens:** SCR-003

**Endpoint:**
```
GET /api/v1/leads?status={status}&owner_id={owner_id}&sector_id={sector_id}&q={search}&page={page}&per_page={per_page}
```

**Response (Success):**
```json
{
  "leads": [
    {
      "id": "uuid",
      "lead_number": "string",
      "customer_name": "string",
      "title": "string",
      "expected_revenue": 1000000,
      "probability": 50,
      "status": "proposing",
      "owner": { "id": "uuid", "name": "string" },
      "expected_close_date": "2025-03-31",
      "updated_at": "datetime"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_count": 100
  }
}
```

**Authorization:** consultant 以上

---

### API-LEAD-GET: リード詳細取得

**Purpose:** リード案件の詳細情報取得

**Used by screens:** SCR-004

**Endpoint:**
```
GET /api/v1/leads/{id}
```

**Response (Success):**
```json
{
  "id": "uuid",
  "lead_number": "string",
  "customer_name": "string",
  "customer_contact": "string",
  "title": "string",
  "description": "string",
  "expected_revenue": 1000000,
  "probability": 50,
  "status": "proposing",
  "owner": { "id": "uuid", "name": "string" },
  "sector": { "id": "uuid", "name": "string" },
  "expected_close_date": "2025-03-31",
  "activities": [
    { "id": "uuid", "activity_type": "meeting", "description": "string", "activity_date": "date", "user": { "name": "string" } }
  ],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Authorization:** consultant 以上

---

### API-LEAD-CREATE: リード作成

**Purpose:** 新規リード案件の作成

**Used by screens:** SCR-003, SCR-004

**Endpoint:**
```
POST /api/v1/leads
```

**Request:**
```json
{
  "customer_name": "string",
  "customer_contact": "string",
  "title": "string",
  "description": "string",
  "expected_revenue": 1000000,
  "probability": 50,
  "expected_close_date": "2025-03-31"
}
```

**Authorization:** senior_consultant 以上

---

### API-LEAD-UPDATE: リード更新

**Purpose:** リード案件の更新

**Used by screens:** SCR-004

**Endpoint:**
```
PUT /api/v1/leads/{id}
```

**Authorization:** senior_consultant 以上（自担当のみ、または manager 以上）

---

### API-LEAD-CONVERT: リード受注移行

**Purpose:** リード案件を受注案件（プロジェクト）に移行

**Used by screens:** SCR-004

**Endpoint:**
```
POST /api/v1/leads/{id}/convert
```

**Request:**
```json
{
  "contract_amount": 1000000,
  "discount_rate": 10,
  "start_date": "2025-04-01",
  "end_date": "2025-09-30"
}
```

**Response (Success):**
```json
{
  "project": {
    "id": "uuid",
    "project_number": "string"
  },
  "message": "Lead converted to project successfully"
}
```

**Authorization:** senior_consultant 以上

---

### API-PROJECT-LIST: 受注案件一覧取得

**Purpose:** 受注案件一覧の取得

**Used by screens:** SCR-005

**Endpoint:**
```
GET /api/v1/projects?status={status}&owner_id={owner_id}&sector_id={sector_id}&page={page}&per_page={per_page}
```

**Authorization:** consultant 以上

---

### API-PROJECT-GET: 受注案件詳細取得

**Purpose:** 受注案件の詳細情報取得

**Used by screens:** SCR-006

**Endpoint:**
```
GET /api/v1/projects/{id}
```

**Authorization:** consultant 以上

---

### API-PROJECT-UPDATE: 受注案件更新

**Purpose:** 受注案件の更新

**Used by screens:** SCR-006

**Endpoint:**
```
PUT /api/v1/projects/{id}
```

**Authorization:** senior_consultant 以上

---

### API-ASSIGNMENT-CREATE: メンバーアサイン

**Purpose:** プロジェクトへのメンバーアサイン

**Used by screens:** SCR-006

**Endpoint:**
```
POST /api/v1/projects/{project_id}/assignments
```

**Request:**
```json
{
  "user_id": "uuid",
  "role": "string",
  "allocation_rate": 50,
  "start_date": "2025-04-01",
  "end_date": "2025-09-30"
}
```

**Authorization:** manager 以上

---

### API-REVENUE-REGISTER: 売上実績登録

**Purpose:** 月次売上実績の登録

**Used by screens:** SCR-006

**Endpoint:**
```
POST /api/v1/projects/{project_id}/revenues
```

**Request:**
```json
{
  "year_month": "2025-04",
  "actual_amount": 500000
}
```

**Authorization:** associate_manager 以上

---

### API-REVENUE-SUMMARY: 売上実績サマリー取得

**Purpose:** 売上実績の集計データ取得

**Used by screens:** SCR-007

**Endpoint:**
```
GET /api/v1/revenues/summary?period={monthly|quarterly}&sector_id={sector_id}&year={year}
```

**Response (Success):**
```json
{
  "summary": [
    {
      "period": "2025-04",
      "sector_name": "string",
      "target": 10000000,
      "actual": 7500000,
      "achievement_rate": 75.0
    }
  ],
  "by_member": [
    { "user_name": "string", "actual": 1500000 }
  ]
}
```

**Authorization:** consultant 以上

---

### API-UTILIZATION-GET: 稼働率取得

**Purpose:** メンバーの稼働率情報取得

**Used by screens:** SCR-008

**Endpoint:**
```
GET /api/v1/utilization?sector_id={sector_id}&year_month={year_month}
```

**Response (Success):**
```json
{
  "members": [
    {
      "user": { "id": "uuid", "name": "string", "role": "string" },
      "utilization_rate": 80,
      "assignments": [
        { "project_name": "string", "allocation_rate": 50 }
      ]
    }
  ]
}
```

**Authorization:** manager 以上

---

### API-TARGET-SET: 売上目標設定

**Purpose:** セクター別売上目標の設定

**Used by screens:** SCR-009

**Endpoint:**
```
POST /api/v1/sectors/{sector_id}/targets
```

**Request:**
```json
{
  "fiscal_year": 2025,
  "targets": [
    { "year_month": "2025-04", "target_amount": 10000000 },
    { "year_month": "2025-05", "target_amount": 12000000 }
  ]
}
```

**Authorization:** senior_manager のみ

---

### API-EXPORT-CSV: CSV エクスポート

**Purpose:** 各種データの CSV エクスポート

**Used by screens:** SCR-003, SCR-005, SCR-007

**Endpoint:**
```
GET /api/v1/export/{type}?filters...
```

**Types:** leads, projects, revenues

**Authorization:** consultant 以上

---

## 5. Business Rules

### 5.1 Domain Rules

| Rule ID | Description | Applies To |
|---------|-------------|------------|
| BR-001 | リードのステータスが 'won' に変更されたら、プロジェクトへの移行を促す | M-LEAD |
| BR-002 | プロジェクトの契約金額は値引き後の金額で登録する | M-PROJECT |
| BR-003 | メンバーの稼働率合計が 100% を超える場合は警告を表示（ブロックはしない） | M-MEMBER-ASSIGNMENT |
| BR-004 | 売上実績は過去の月のみ登録可能（将来月は不可） | M-REVENUE-ACTUAL |

### 5.2 Validation Rules

| Rule ID | Field/Entity | Validation | Error Message |
|---------|--------------|------------|---------------|
| VR-001 | M-LEAD.probability | 0 <= value <= 100 | 確度は0〜100の範囲で入力してください |
| VR-002 | M-PROJECT.contract_amount | value > 0 | 契約金額は0より大きい値を入力してください |
| VR-003 | M-PROJECT.discount_rate | 0 <= value <= 100 | 値引き率は0〜100の範囲で入力してください |
| VR-004 | M-MEMBER-ASSIGNMENT.allocation_rate | 0 < value <= 100 | アサイン率は1〜100の範囲で入力してください |
| VR-005 | M-REVENUE-ACTUAL.year_month | value <= current_month | 将来の月の売上実績は登録できません |

### 5.3 Calculation Rules

| Rule ID | Description | Formula/Logic |
|---------|-------------|---------------|
| CR-001 | 稼働率 | 同一期間のアサイン率合計 (SUM(allocation_rate) for active assignments) |
| CR-002 | 売上達成率 | (実績合計 / 目標) * 100 |
| CR-003 | 値引き後金額 | 契約金額 * (1 - 値引き率/100) |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | < 500ms (p95) | Application Performance Monitoring |
| Dashboard Load | < 2s | Lighthouse |
| List API (100 items) | < 1s | Load testing |

### 6.2 Security

- Authentication method: Azure AD OAuth 2.0 + JWT
- Authorization model: Role-based Access Control (RBAC)
- Data encryption: TLS 1.3 (in transit), AES-256 (at rest)
- Audit requirements: ログイン履歴、データ変更履歴を保存

### 6.3 Reliability

- Availability target: 99.5% (月次)
- Backup strategy: 日次バックアップ、7日間保持
- Disaster recovery: [NEEDS CLARIFICATION]

### 6.4 Observability

- Logging standards: JSON format, structured logging
- Metrics to collect: API latency, error rate, active users
- Tracing requirements: Request ID による追跡

---

## 7. Technology Decisions

### 7.1 Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | [NEEDS CLARIFICATION] | - |
| Backend | [NEEDS CLARIFICATION] | - |
| Database | [NEEDS CLARIFICATION] | - |
| Infrastructure | [NEEDS CLARIFICATION] | - |

### 7.2 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Azure AD | - | 認証・SSO |

---

## 8. Feature Index

All features that implement this domain. Updated as features are added.

| Feature ID | Title | Path | Status | Related M-*/API-* |
|------------|-------|------|--------|-------------------|
| S-FOUNDATION-001 | 基盤構築 | `.specify/specs/s-foundation-001/` | Draft | M-USER, M-SECTOR, API-AUTH-* |
| S-LEAD-001 | リード案件管理 | `.specify/specs/s-lead-001/` | Draft | M-LEAD, M-ACTIVITY, API-LEAD-* |
| S-PROJECT-001 | 受注案件管理 | `.specify/specs/s-project-001/` | Draft | M-PROJECT, M-MEMBER-ASSIGNMENT, API-PROJECT-*, API-ASSIGNMENT-* |
| S-REVENUE-001 | 売上管理 | `.specify/specs/s-revenue-001/` | Draft | M-REVENUE-*, M-SECTOR-TARGET, API-REVENUE-* |
| S-DASHBOARD-001 | ダッシュボード | `.specify/specs/s-dashboard-001/` | Draft | API-DASHBOARD-* |

**Status values:** Draft | In Review | Approved | Implementing | Completed | Deprecated

---

## 9. Open Questions

Technical questions that need to be resolved:

- [ ] フロントエンド技術スタック（React / Vue / etc.）
- [ ] バックエンド技術スタック（Node.js / Python / etc.）
- [ ] データベース選定（PostgreSQL / MySQL / etc.）
- [ ] インフラ環境（Azure / AWS / オンプレミス）
- [ ] 稼働率の計算における「稼働可能時間」の定義
- [ ] 値引き承認ワークフローの必要性

---

## 10. Clarifications

Record of clarification questions and answers during domain design.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| - | - | - | - |

---

## 11. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| 2025-12-17 | Created | Initial domain specification from sample input | - |

Change types: Created, Updated, Extended, Deprecated, Superseded

---

## 12. Implementation Notes

Notes discovered during implementation that may inform future changes.

- Technical constraints discovered: -
- Design decisions made: -
- Deviations from original spec (with justification): -
