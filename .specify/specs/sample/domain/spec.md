# Domain Specification: Sales Quest

Spec Type: Domain
Spec ID: S-DOMAIN-001
Created: 2025-12-18
Status: Draft
Author: AI Generated
Related Vision: S-VISION-001
Related Screen: S-SCREEN-001

---

## 1. Domain Overview

### 1.1 Domain Description

Sales Quest は SFA（Sales Force Automation）と売上管理を統合した総合営業管理システム。
リード案件から受注、売上実績までを一元管理し、セクター別の目標達成状況を可視化する。

- Vision Spec: `.specify/specs/sample/vision/spec.md`
- Screen Spec: `.specify/specs/sample/screen/spec.md`
- Domain boundaries: 営業管理（リード→受注→売上）、メンバー稼働率管理、目標管理
- Core concepts: リード案件、受注案件、売上実績、メンバーアサイン、セクター目標

### 1.2 System Context

```
[Azure AD] <--認証--> [Sales Quest] <---> [PostgreSQL]
                           |
                      ユーザー
                   (PC ブラウザ)
```

- Upstream systems: Azure AD（認証）
- Downstream systems: なし
- Integration points: Azure AD OAuth 2.0 / OIDC

---

## 2. Actors and Roles

Reference from Vision Spec, with technical details added.

| Actor | Role | Permissions | Authentication |
|-------|------|-------------|----------------|
| アソシエイト | Associate | 自分のアサイン案件閲覧のみ | Azure AD |
| コンサルタント | Consultant | 自分のアサイン案件閲覧のみ | Azure AD |
| シニアコンサルタント | SeniorConsultant | リード案件CRUD、受注案件管理、メンバーアサイン | Azure AD |
| アソシエイトマネージャー | AssociateManager | シニアコンサル権限 + セクター売上確認 | Azure AD |
| マネージャー | Manager | 全機能 + セクター目標設定 + ユーザー管理 | Azure AD |
| シニアマネージャー | SeniorManager | 全機能（最高権限） | Azure AD |

**Role Hierarchy:**
```
SeniorManager > Manager > AssociateManager > SeniorConsultant > Consultant > Associate
```

---

## 3. Master Data Definitions (M-*)

Define shared data models that are used across multiple features.
Feature specs MUST reference these by ID, not redefine them.

> **Note:** Screen ↔ Master ↔ API mappings are managed in `../matrix/cross-reference.json`.
> Run `node .specify/scripts/generate-matrix-view.cjs` to regenerate the view.

### M-USER-001: User

**Purpose:** システムユーザー（コンサルタント、マネージャー等）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| azureAdId | string | Yes | Azure AD のユーザーID |
| email | string | Yes | メールアドレス |
| name | string | Yes | 氏名 |
| roleId | UUID | Yes | 役職への参照 (M-ROLE) |
| sectorId | UUID | Yes | 所属セクターへの参照 (M-SECTOR) |
| isActive | boolean | Yes | 有効フラグ |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Relationships:**
- belongsTo M-ROLE (roleId)
- belongsTo M-SECTOR (sectorId)
- hasMany M-LEAD (担当者として)
- hasMany M-ASSIGNMENT (アサインされるメンバーとして)

**Constraints:**
- email は一意
- azureAdId は一意

---

### M-ROLE-001: Role

**Purpose:** 役職マスタ

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| name | string | Yes | 役職名 |
| level | integer | Yes | 権限レベル (1-6) |
| permissions | string[] | Yes | 許可される操作リスト |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Relationships:**
- hasMany M-USER

**Initial Data:**
| level | name | permissions |
|-------|------|-------------|
| 1 | アソシエイト | view_own_assignments |
| 2 | コンサルタント | view_own_assignments |
| 3 | シニアコンサルタント | manage_leads, manage_orders, assign_members |
| 4 | アソシエイトマネージャー | level3 + view_sector_sales |
| 5 | マネージャー | level4 + set_targets, manage_users |
| 6 | シニアマネージャー | all |

---

### M-SECTOR-001: Sector

**Purpose:** セクター（事業部門）マスタ

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| name | string | Yes | セクター名（金融、製造、小売等） |
| code | string | Yes | セクターコード |
| isActive | boolean | Yes | 有効フラグ |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Relationships:**
- hasMany M-USER
- hasMany M-SALES-TARGET

**Constraints:**
- code は一意

---

### M-LEAD-001: Lead

**Purpose:** リード案件（商談中の案件）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| name | string | Yes | 案件名 |
| customerName | string | Yes | 顧客名 |
| description | text | No | 案件概要 |
| expectedRevenue | decimal | Yes | 想定売上（円） |
| probability | integer | Yes | 確度（0-100%） |
| status | enum | Yes | ステータス |
| ownerId | UUID | Yes | 担当者への参照 (M-USER) |
| sectorId | UUID | Yes | セクターへの参照 (M-SECTOR) |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Status Enum:**
- `new` - 新規
- `contacting` - アプローチ中
- `proposing` - 提案中
- `negotiating` - 商談中
- `won` - 受注
- `lost` - 失注

**Relationships:**
- belongsTo M-USER (ownerId)
- belongsTo M-SECTOR (sectorId)
- hasMany M-ACTIVITY
- converts to M-ORDER (when status = won)

**Constraints:**
- expectedRevenue >= 0
- probability: 0-100
- 担当者は SeniorConsultant 以上のみ

---

### M-ORDER-001: Order

**Purpose:** 受注案件（契約済み案件）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| leadId | UUID | No | 元リード案件への参照 |
| name | string | Yes | 案件名 |
| customerName | string | Yes | 顧客名 |
| contractAmount | decimal | Yes | 契約金額（円） |
| discountRate | decimal | Yes | 値引き率（0-100%） |
| startDate | date | Yes | 開始日 |
| endDate | date | Yes | 終了日 |
| status | enum | Yes | ステータス |
| ownerId | UUID | Yes | 担当者への参照 (M-USER) |
| sectorId | UUID | Yes | セクターへの参照 (M-SECTOR) |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Status Enum:**
- `active` - 進行中
- `completed` - 完了
- `cancelled` - キャンセル

**Relationships:**
- belongsTo M-LEAD (optional, leadId)
- belongsTo M-USER (ownerId)
- belongsTo M-SECTOR (sectorId)
- hasMany M-ASSIGNMENT
- hasMany M-SALES-RECORD

**Constraints:**
- contractAmount >= 0
- discountRate: 0-100
- endDate > startDate
- 受注案件には最低1人のアサインが必要

---

### M-ASSIGNMENT-001: Assignment

**Purpose:** メンバーアサイン（案件へのメンバー割当）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| orderId | UUID | Yes | 受注案件への参照 (M-ORDER) |
| userId | UUID | Yes | メンバーへの参照 (M-USER) |
| assignmentRate | integer | Yes | アサイン率（0-100%） |
| startDate | date | Yes | アサイン開始日 |
| endDate | date | No | アサイン終了日 |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Relationships:**
- belongsTo M-ORDER (orderId)
- belongsTo M-USER (userId)

**Constraints:**
- assignmentRate: 0-100
- 1案件の合計アサイン率 <= 100%
- 同一ユーザーの全案件アサイン率合計 = 稼働率（0-100%を超えてもよいが警告）

---

### M-ACTIVITY-001: Activity

**Purpose:** 活動履歴（リード案件に対する営業活動記録）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| leadId | UUID | Yes | リード案件への参照 (M-LEAD) |
| activityDate | date | Yes | 活動日 |
| type | enum | Yes | 活動種別 |
| description | text | Yes | 活動内容 |
| createdById | UUID | Yes | 記録者への参照 (M-USER) |
| createdAt | datetime | Yes | 作成日時 |

**Type Enum:**
- `call` - 電話
- `email` - メール
- `visit` - 訪問
- `meeting` - 会議
- `proposal` - 提案
- `other` - その他

**Relationships:**
- belongsTo M-LEAD (leadId)
- belongsTo M-USER (createdById)

---

### M-SALES-RECORD-001: SalesRecord

**Purpose:** 売上実績（月次の売上記録）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| orderId | UUID | Yes | 受注案件への参照 (M-ORDER) |
| yearMonth | string | Yes | 対象年月（YYYY-MM形式） |
| plannedAmount | decimal | Yes | 予定売上（円） |
| actualAmount | decimal | No | 実績売上（円） |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Relationships:**
- belongsTo M-ORDER (orderId)

**Constraints:**
- plannedAmount >= 0
- actualAmount >= 0
- yearMonth は案件の startDate 〜 endDate の範囲内

---

### M-SALES-TARGET-001: SalesTarget

**Purpose:** 売上目標（セクター別の売上目標）

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary identifier |
| sectorId | UUID | Yes | セクターへの参照 (M-SECTOR) |
| fiscalYear | integer | Yes | 対象年度 |
| yearMonth | string | Yes | 対象年月（YYYY-MM形式） |
| targetAmount | decimal | Yes | 目標金額（円） |
| createdAt | datetime | Yes | 作成日時 |
| updatedAt | datetime | Yes | 更新日時 |

**Relationships:**
- belongsTo M-SECTOR (sectorId)

**Constraints:**
- targetAmount >= 0
- (sectorId, yearMonth) は一意

---

## 4. API Contracts (API-*)

Define shared API contracts that are used across multiple features.
Feature specs MUST reference these by ID when using them.

> **Note:** Screen ↔ API mappings and permissions are managed in `../matrix/cross-reference.json`.

### API-AUTH-LOGIN-001: Azure AD Login

**Purpose:** Azure AD 認証でログイン

**Endpoint:**
```
GET /api/v1/auth/login
```

**Response:** Azure AD の認証画面にリダイレクト

**Authorization:** Public

---

### API-AUTH-CALLBACK-001: Azure AD Callback

**Purpose:** Azure AD 認証コールバック

**Endpoint:**
```
GET /api/v1/auth/callback
```

**Response (Success):**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "string",
    "sector": "string"
  }
}
```

**Authorization:** Public

---

### API-AUTH-LOGOUT-001: Logout

**Purpose:** ログアウト

**Endpoint:**
```
POST /api/v1/auth/logout
```

**Response (Success):**
```json
{
  "success": true
}
```

**Authorization:** Authenticated

---

### API-LEAD-LIST-001: List Leads

**Purpose:** リード案件一覧取得

**Endpoint:**
```
GET /api/v1/leads
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | 案件名・顧客名で検索 |
| status | string | ステータスでフィルター |
| ownerId | UUID | 担当者でフィルター |
| page | integer | ページ番号（default: 1） |
| limit | integer | 件数（default: 20, max: 100） |

**Response (Success):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "customerName": "string",
      "expectedRevenue": 10000000,
      "probability": 80,
      "status": "negotiating",
      "owner": { "id": "uuid", "name": "string" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Authorization:** SeniorConsultant 以上

---

### API-LEAD-GET-001: Get Lead

**Purpose:** リード案件詳細取得

**Endpoint:**
```
GET /api/v1/leads/:id
```

**Response (Success):**
```json
{
  "id": "uuid",
  "name": "string",
  "customerName": "string",
  "description": "string",
  "expectedRevenue": 10000000,
  "probability": 80,
  "status": "negotiating",
  "owner": { "id": "uuid", "name": "string" },
  "sector": { "id": "uuid", "name": "string" },
  "activities": [
    {
      "id": "uuid",
      "activityDate": "2025-12-15",
      "type": "visit",
      "description": "初回訪問"
    }
  ],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| LEAD_NOT_FOUND | 404 | 指定されたリード案件が存在しない |

**Authorization:** SeniorConsultant 以上

---

### API-LEAD-CREATE-001: Create Lead

**Purpose:** リード案件作成

**Endpoint:**
```
POST /api/v1/leads
```

**Request:**
```json
{
  "name": "string",
  "customerName": "string",
  "description": "string",
  "expectedRevenue": 10000000,
  "probability": 80,
  "sectorId": "uuid"
}
```

**Response (Success):**
```json
{
  "id": "uuid",
  "name": "string",
  ...
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | 入力値が不正 |

**Authorization:** SeniorConsultant 以上

---

### API-LEAD-UPDATE-001: Update Lead

**Purpose:** リード案件更新

**Endpoint:**
```
PATCH /api/v1/leads/:id
```

**Request:**
```json
{
  "name": "string",
  "customerName": "string",
  "description": "string",
  "expectedRevenue": 10000000,
  "probability": 80,
  "status": "negotiating"
}
```

**Authorization:** SeniorConsultant 以上（担当者または Manager 以上）

---

### API-LEAD-CONVERT-001: Convert Lead to Order

**Purpose:** リード案件を受注案件に移行

**Endpoint:**
```
POST /api/v1/leads/:id/convert
```

**Request:**
```json
{
  "contractAmount": 10000000,
  "discountRate": 10,
  "startDate": "2025-01-01",
  "endDate": "2025-06-30"
}
```

**Response (Success):**
```json
{
  "order": {
    "id": "uuid",
    "name": "string",
    ...
  }
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| LEAD_NOT_FOUND | 404 | リード案件が存在しない |
| LEAD_ALREADY_CONVERTED | 400 | 既に受注済み |

**Authorization:** SeniorConsultant 以上

---

### API-ORDER-LIST-001: List Orders

**Purpose:** 受注案件一覧取得

**Endpoint:**
```
GET /api/v1/orders
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | 案件名・顧客名で検索 |
| sectorId | UUID | セクターでフィルター |
| ownerId | UUID | 担当者でフィルター |
| page | integer | ページ番号 |
| limit | integer | 件数 |

**Authorization:** SeniorConsultant 以上

---

### API-ORDER-GET-001: Get Order

**Purpose:** 受注案件詳細取得

**Endpoint:**
```
GET /api/v1/orders/:id
```

**Authorization:** SeniorConsultant 以上

---

### API-ASSIGNMENT-CREATE-001: Create Assignment

**Purpose:** メンバーアサイン追加

**Endpoint:**
```
POST /api/v1/orders/:orderId/assignments
```

**Request:**
```json
{
  "userId": "uuid",
  "assignmentRate": 50,
  "startDate": "2025-01-01",
  "endDate": "2025-06-30"
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| ASSIGNMENT_RATE_EXCEEDED | 400 | 合計アサイン率が100%を超える |

**Authorization:** SeniorConsultant 以上

---

### API-SALES-RECORD-CREATE-001: Create Sales Record

**Purpose:** 売上実績登録

**Endpoint:**
```
POST /api/v1/orders/:orderId/sales-records
```

**Request:**
```json
{
  "yearMonth": "2025-01",
  "plannedAmount": 1500000,
  "actualAmount": 1600000
}
```

**Authorization:** SeniorConsultant 以上

---

### API-SALES-SUMMARY-001: Get Sales Summary

**Purpose:** 売上集計取得

**Endpoint:**
```
GET /api/v1/sales/summary
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| fiscalYear | integer | 対象年度 |
| sectorId | UUID | セクターでフィルター（optional） |
| groupBy | string | 集計単位（month/sector/user） |

**Response (Success):**
```json
{
  "data": [
    {
      "key": "2025-01",
      "target": 50000000,
      "actual": 52000000,
      "achievementRate": 104
    }
  ]
}
```

**Authorization:** SeniorConsultant 以上

---

### API-SALES-TARGET-SET-001: Set Sales Target

**Purpose:** 売上目標設定

**Endpoint:**
```
PUT /api/v1/sales/targets
```

**Request:**
```json
{
  "sectorId": "uuid",
  "fiscalYear": 2025,
  "targets": [
    { "yearMonth": "2025-04", "targetAmount": 50000000 },
    { "yearMonth": "2025-05", "targetAmount": 50000000 }
  ]
}
```

**Authorization:** Manager 以上

---

### API-MEMBER-LIST-001: List Members

**Purpose:** メンバー一覧取得（稼働率付き）

**Endpoint:**
```
GET /api/v1/members
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| sectorId | UUID | セクターでフィルター |
| roleId | UUID | 役職でフィルター |

**Response (Success):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "role": "string",
      "sector": "string",
      "utilizationRate": 80
    }
  ]
}
```

**Authorization:** SeniorConsultant 以上

---

### API-DASHBOARD-001: Get Dashboard Data

**Purpose:** ダッシュボードデータ取得

**Endpoint:**
```
GET /api/v1/dashboard
```

**Response (Success):**
```json
{
  "leadCount": 25,
  "orderCount": 12,
  "monthlyRevenue": 50000000,
  "achievementRate": 75,
  "salesProgress": {
    "target": 200000000,
    "actual": 150000000
  },
  "upcomingActions": [
    {
      "date": "2025-12-20",
      "leadId": "uuid",
      "leadName": "A社案件",
      "description": "フォローアップ"
    }
  ]
}
```

**Authorization:** Authenticated

---

## 5. Business Rules

### 5.1 Domain Rules

Rules that apply across the entire domain.

| Rule ID | Description | Applies To |
|---------|-------------|------------|
| BR-001 | リード案件のステータスが「won」になったら受注案件に移行する | M-LEAD, M-ORDER |
| BR-002 | 受注案件には必ず1人以上のメンバーがアサインされている必要がある | M-ORDER, M-ASSIGNMENT |
| BR-003 | 売上実績は月次で登録する（案件期間内の月のみ） | M-SALES-RECORD |
| BR-004 | セクターごとに売上目標が設定される | M-SALES-TARGET |
| BR-005 | シニアコンサルタント（level >= 3）以上のみがリード案件を作成可能 | M-LEAD, M-USER |
| BR-006 | マネージャー（level >= 5）以上のみがセクター売上目標を設定可能 | M-SALES-TARGET, M-USER |

### 5.2 Validation Rules

| Rule ID | Field/Entity | Validation | Error Message |
|---------|--------------|------------|---------------|
| VR-001 | M-LEAD.probability | 0 <= value <= 100 | 確度は0〜100%で入力してください |
| VR-002 | M-LEAD.expectedRevenue | value >= 0 | 想定売上は0以上で入力してください |
| VR-003 | M-ORDER.contractAmount | value >= 0 | 契約金額は0以上で入力してください |
| VR-004 | M-ORDER.discountRate | 0 <= value <= 100 | 値引き率は0〜100%で入力してください |
| VR-005 | M-ASSIGNMENT.assignmentRate | 0 <= value <= 100 | アサイン率は0〜100%で入力してください |
| VR-006 | M-ORDER.assignments | sum(assignmentRate) <= 100 | 1案件の合計アサイン率は100%以内にしてください |
| VR-007 | M-ORDER.endDate | endDate > startDate | 終了日は開始日より後にしてください |

### 5.3 Calculation Rules

| Rule ID | Description | Formula/Logic |
|---------|-------------|---------------|
| CR-001 | メンバー稼働率 | sum(全アサイン案件のassignmentRate) |
| CR-002 | 売上達成率 | (実績売上 / 目標売上) × 100 |
| CR-003 | 値引き後金額 | contractAmount × (1 - discountRate / 100) |
| CR-004 | セクター売上達成率 | (セクター実績合計 / セクター目標合計) × 100 |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | < 500ms (p95) | 一覧API |
| API Response Time | < 200ms (p95) | 詳細取得API |
| Throughput | 100 req/sec | 同時ユーザー20名想定 |

### 6.2 Security

- Authentication method: Azure AD OAuth 2.0 / OIDC
- Authorization model: Role-Based Access Control (RBAC)
- Data encryption: HTTPS (TLS 1.3), DB暗号化
- Audit requirements: ログイン/ログアウト、重要操作のログ記録

### 6.3 Reliability

- Availability target: 99.5%（業務時間内）
- Backup strategy: 日次バックアップ
- Disaster recovery: [NEEDS CLARIFICATION]

### 6.4 Observability

- Logging standards: 構造化ログ（JSON形式）
- Metrics to collect: API応答時間、エラー率、同時接続数
- Tracing requirements: リクエストID によるトレース

---

## 7. Technology Decisions

### 7.1 Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + TypeScript | 型安全性、豊富なエコシステム |
| UI Framework | [NEEDS CLARIFICATION] | MUI / Chakra / Tailwind 等 |
| Backend | Node.js + TypeScript | フロントエンドとの言語統一 |
| API Framework | Express / Fastify | [NEEDS CLARIFICATION] |
| Database | PostgreSQL | リレーショナルデータ、実績 |
| ORM | Prisma | 型安全性、マイグレーション |
| Authentication | MSAL (Azure AD) | Azure AD 統合 |
| Infrastructure | Azure App Service | Azure AD との親和性 |

### 7.2 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| @azure/msal-react | latest | Azure AD 認証 |
| prisma | latest | ORM |
| recharts / chart.js | [TBD] | グラフ描画 |

---

## 8. Feature Index

All features that implement this domain. Updated as features are added.

| Feature ID | Title | Path | Status | Related M-*/API-* |
|------------|-------|------|--------|-------------------|
| S-FOUNDATION-001 | 基盤構築 | `.specify/specs/sample/s-foundation-001/` | Backlog | M-USER, M-ROLE, M-SECTOR, API-AUTH-* |
| S-AUTH-001 | Azure AD 認証 | `.specify/specs/sample/s-auth-001/` | Backlog | M-USER, API-AUTH-* |
| S-LEAD-001 | リード案件管理 | `.specify/specs/sample/s-lead-001/` | Backlog | M-LEAD, M-ACTIVITY, API-LEAD-* |
| S-ORDER-001 | 受注案件管理 | `.specify/specs/sample/s-order-001/` | Backlog | M-ORDER, M-ASSIGNMENT, API-ORDER-*, API-ASSIGNMENT-* |
| S-SALES-001 | 売上実績管理 | `.specify/specs/sample/s-sales-001/` | Backlog | M-SALES-RECORD, API-SALES-RECORD-*, API-SALES-SUMMARY-* |
| S-MEMBER-001 | メンバー稼働率管理 | `.specify/specs/sample/s-member-001/` | Backlog | M-USER, M-ASSIGNMENT, API-MEMBER-* |
| S-TARGET-001 | セクター売上目標管理 | `.specify/specs/sample/s-target-001/` | Backlog | M-SALES-TARGET, API-SALES-TARGET-* |
| S-DASHBOARD-001 | ダッシュボード | `.specify/specs/sample/s-dashboard-001/` | Backlog | API-DASHBOARD-* |

**Status values:** Draft | In Review | Approved | Implementing | Completed | Deprecated | Backlog

---

## 9. Open Questions

Technical questions that need to be resolved:

- [ ] UI フレームワークの選定（MUI / Chakra / Tailwind）
- [ ] バックエンド API フレームワーク（Express / Fastify）
- [ ] グラフライブラリの選定（Recharts / Chart.js）
- [ ] ディザスタリカバリ要件の詳細

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
| 2025-12-18 | Created | Initial domain specification from Vision Spec | - |

Change types: Created, Updated, Extended, Deprecated, Superseded

---

## 12. Implementation Notes

Notes discovered during implementation that may inform future changes.

- Technical constraints discovered: (TBD)
- Design decisions made: (TBD)
- Deviations from original spec (with justification): (TBD)
