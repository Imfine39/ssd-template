# Vision Specification: Sales Quest

Spec Type: Vision
Spec ID: S-VISION-001
Created: 2025-12-23
Status: Draft
Author: AI Assistant

---

## 1. System Purpose

### 1.1 Why are we building this?

- **Problem statement:** リードの管理と売上の管理を個別のExcelで実施しており、現在の状況が分かりにくく、操作・管理がしにくい
- **Current pain points:**
  - 複数のExcelファイルでデータが分散
  - リアルタイムな進捗把握が困難
  - 担当者間の情報共有が煩雑
- **Opportunity:** SFAの機能も売上管理機能も包括した総合営業管理システムで業務効率化

### 1.2 Vision Statement

> コンサルティング企業の営業活動を一元管理し、リードから受注、売上実績までを可視化する総合営業管理システム「Sales Quest」を構築する。

### 1.3 Success Definition

- What does success look like?
  - 営業担当者が案件状況を即座に把握できる
  - セクター別・個人別の売上進捗がリアルタイムで確認可能
  - Excelでの二重管理が不要になる
- Key outcomes we want to achieve:
  - 営業管理工数の削減
  - 正確な売上予測
  - メンバーの稼働率の可視化
- How will we measure success?
  - Excel管理からの完全移行
  - 月次報告作成時間の短縮

---

## 2. Target Users and Stakeholders

### 2.1 Primary Users

| Actor | Description | Primary Goals |
|-------|-------------|---------------|
| シニアコンサルタント | 営業活動を行う上位職（シニアコンサル以上） | リード案件の登録・管理、受注案件の進捗管理、売上実績の登録 |
| マネージャー | セクターの売上責任者 | セクター売上の把握、メンバーの稼働率確認、売上目標管理 |

### 2.2 Secondary Users

| Actor | Description | Interaction |
|-------|-------------|-------------|
| アソシエイト/コンサルタント | 案件にアサインされるメンバー | 自身のアサイン状況・稼働率の確認 |
| 管理者 | システム管理者 | ユーザー管理、マスタ管理 |

### 2.3 Stakeholders

- Business stakeholders: 経営層（売上状況の把握）
- Technical stakeholders: IT部門（Azure AD連携、システム運用）
- External parties: なし

---

## 3. User Journeys

### Journey 1: リード案件から受注への転換

**Actor:** シニアコンサルタント
**Goal:** 新規リード案件を登録し、商談を経て受注案件に転換する

**Story:**
> シニアコンサルタントは新たに獲得したリード情報をシステムに登録する。顧客情報、想定売上、確度などを入力し、活動履歴を記録しながら商談を進める。受注が決まったら「受注移行」ボタンで受注案件に転換し、メンバーをアサインする。

**Key Steps:**
1. リード案件一覧から「新規作成」でリード案件を登録
2. リード案件詳細で活動履歴を追記しながら商談を進行
3. 受注決定後、「受注移行」で受注案件に転換
4. メンバーアサインを設定

**Success Outcome:**
- リード案件が受注案件として管理され、売上予測に反映される

---

### Journey 2: 月次売上管理

**Actor:** マネージャー
**Goal:** セクターの月次売上状況を把握し、目標達成度を確認する

**Story:**
> マネージャーはダッシュボードでセクター全体の売上進捗を確認する。目標に対する達成率を確認し、各案件の状況を把握する。売上実績一覧でセクター別・個人別の集計を確認し、必要に応じて対策を検討する。

**Key Steps:**
1. ダッシュボードで売上進捗グラフを確認
2. セクター別売上目標画面で目標達成率を確認
3. 売上実績一覧で詳細な集計を確認
4. 必要に応じて個別案件の状況を確認

**Success Outcome:**
- セクターの売上状況がリアルタイムで把握でき、適切な意思決定が可能

---

### Journey 3: メンバー稼働管理

**Actor:** マネージャー
**Goal:** メンバーの稼働率を確認し、適切なアサインを行う

**Story:**
> マネージャーは新規案件へのアサインを検討する際、メンバー管理画面で各メンバーの稼働率を確認する。稼働率に余裕のあるメンバーを特定し、受注案件詳細画面でアサインを設定する。

**Key Steps:**
1. メンバー管理画面で稼働率を確認
2. アサイン可能なメンバーを特定
3. 受注案件詳細画面でアサインを追加
4. アサイン率の合計が100%を超えないことを確認

**Success Outcome:**
- メンバーの稼働率が適正に管理され、過負荷を防止

---

## 4. Scope

### 4.1 In Scope

High-level capabilities this system will provide:

- [x] リード案件管理（登録、編集、検索、受注移行）
- [x] 受注案件管理（契約情報、メンバーアサイン）
- [x] 売上実績管理（月次登録、集計、グラフ表示）
- [x] メンバーアサイン管理（稼働率計算）
- [x] ダッシュボード（各状態のサマリー表示）
- [x] セクター別売上目標管理
- [x] ユーザー管理・マスタ管理

### 4.2 Out of Scope

What this system will NOT do (at least in initial release):

- 会計ソフトなど外部サービスとの連携
- モバイルアプリ対応
- 自動メール通知機能

### 4.3 Future Considerations

Items that may be considered for future phases:

- 会計ソフト連携（請求書発行連携など）
- Slack/Teams通知連携
- モバイル対応

---

## 5. Screen Hints

> **Note**: This section captures screen-level information from the unified Quick Input.
> These hints are used by `/spec-mesh design` to create Screen Spec and Domain Spec simultaneously.

### 5.1 Screen List (Provisional)

| # | Screen Name | Purpose | Key Elements |
|---|-------------|---------|--------------|
| 1 | ログイン画面 | 認証 | Azure AD連携 |
| 2 | ダッシュボード | 全体把握 | 売上進捗グラフ、リード案件数、受注案件数、今月の売上目標達成率、直近のアクション予定 |
| 3 | リード案件一覧画面 | リード管理 | 検索、ステータスフィルター、担当者フィルター、ページネーション、CSV出力 |
| 4 | リード案件詳細画面 | リード詳細 | 顧客情報、案件概要、想定売上、確度、担当者、活動履歴、受注移行ボタン |
| 5 | 受注案件一覧画面 | 受注管理 | 一覧表示、検索、フィルター |
| 6 | 受注案件詳細画面 | 受注詳細 | 契約情報、売上予定、メンバーアサイン一覧、稼働率、売上実績登録 |
| 7 | 売上実績一覧画面 | 売上管理 | 月別集計、セクター別集計、個人別集計、グラフ表示 |
| 8 | メンバー管理画面 | 稼働管理 | 稼働率確認 |
| 9 | セクター別売上目標画面 | 目標管理 | セクター別目標設定・達成率表示 |
| 10 | 設定画面 | 管理 | ユーザー管理、マスタ管理 |

### 5.2 Screen Transitions (Provisional)

- ログイン → ダッシュボード: 認証成功時
- ダッシュボード → 各一覧画面: メニュー/リンククリック
- リード案件一覧 → リード案件詳細: 行クリック
- リード案件詳細 → 受注案件詳細: 受注移行ボタン
- 受注案件一覧 → 受注案件詳細: 行クリック
- 受注案件詳細 → 売上登録モーダル: 売上登録ボタン

### 5.3 Design Preferences

- **Style**: 企業の業務システム風、シンプルで見やすいUI
- **Responsive**: PC のみ
- **Reference Images**: なし

---

## 6. Constraints and Assumptions

### 6.1 Business Constraints

- **Timeline:** 3ヶ月以内（MVP として最小限の機能でリリース）
- **Budget:** 中規模（外部リソース活用可）
- **Organizational:**
  - セクター別に内部が分かれており、それぞれに売上目標がある
  - 役職: アソシエイト、コンサルタント、シニアコンサルタント、アソシエイトマネージャー、マネージャー、シニアマネージャー

### 6.2 Technical Constraints

- Must integrate with: Azure AD（認証）
- Must comply with: 社内標準ポリシー（Azure AD 認証 + HTTPS）
- Platform/environment restrictions: Webブラウザ（PC）

### 6.3 Assumptions

- 全ユーザーがAzure ADアカウントを持っている
- インターネット接続環境でアクセスする
- コンサルティング業務特有の概念（稼働率、値引き）を理解している

---

## 7. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Excel からの移行に抵抗がある | Med | Med | 段階的な移行、トレーニング実施 |
| データ移行時の整合性問題 | High | Med | 移行ツール開発、検証期間の確保 |
| Azure AD 連携の技術的問題 | High | Low | 早期の技術検証 |

---

## 8. Open Questions

Questions that need to be resolved before proceeding:

- [x] 具体的なリリース時期はいつか？ → 3ヶ月以内（MVP）
- [x] 既存Excelデータの移行は必要か？その場合のデータ量は？ → 一部移行（アクティブな案件のみ）
- [x] セクターは何個あり、それぞれの売上目標はどのように設定されるか？ → セクター数は可変、各マネージャーが目標設定
- [x] 権限管理の詳細（誰が何を見られる/編集できるか） → 役職ベース（シニアコンサル以上が案件作成、マネージャーがセクター全体閲覧）

---

## 9. Clarifications

Record of clarification questions and answers during the vision refinement process.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| 2025-12-23 | リリース時期 | 3ヶ月以内（MVP） | Section 6.1 Timeline 更新 |
| 2025-12-23 | 開発予算 | 中規模（外部リソース活用可） | Section 6.1 Budget 更新 |
| 2025-12-23 | セキュリティポリシー | 社内標準（Azure AD + HTTPS） | Section 6.2 更新 |
| 2025-12-23 | 既存データ移行 | 一部移行（アクティブ案件のみ） | Section 8 更新 |
| 2025-12-23 | セクター構成 | 可変、各マネージャーが目標設定 | Section 8 更新 |
| 2025-12-23 | 権限管理 | 役職ベース（シニアコンサル以上が案件作成） | Section 8 更新 |

---

## 10. Related Documents

- Screen Spec: `.specify/specs/sample/overview/screen/spec.md` (to be created by /spec-mesh design)
- Domain Spec: `.specify/specs/sample/overview/domain/spec.md` (to be created by /spec-mesh design)
- Feature Specs: (to be created after Screen + Domain Specs)

---

## 11. Original Input

User-provided input that was used to generate this spec.
See: `.specify/specs/sample/overview/vision/input.md`

---

## 12. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| 2025-12-23 | Created | Initial vision specification from Quick Input | AI Assistant |

Change types: Created, Updated, Clarified, Approved
