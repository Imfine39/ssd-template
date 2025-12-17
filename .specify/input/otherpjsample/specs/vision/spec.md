# Vision Specification: Sales Quest

Spec Type: Vision
Spec ID: S-VISION-001
Created: 2025-12-17
Status: Draft
Author: AI Generated (Sample)

---

## 1. System Purpose

### 1.1 Why are we building this?

- Problem statement: リードの管理と売上の管理を個別のExcelで実施しており、現在の状況が分かりにくく、操作・管理がしにくい
- Current pain points:
  - 複数のExcelファイルでデータが分散
  - リード状況と売上実績の紐付けが困難
  - セクター別の売上目標管理が煩雑
  - メンバーの稼働率が把握しにくい
- Opportunity: 統合された営業管理システムにより、営業活動の可視化と効率化を実現

### 1.2 Vision Statement

> SFAの機能も売上管理機能も包括した総合営業管理システムを構築し、シニアコンサル以上の営業担当者が営業管理を容易に行えるようにする。

### 1.3 Success Definition

- What does success look like?
  - 全てのリード・受注案件が一元管理されている
  - セクター別売上目標の達成状況がリアルタイムで確認可能
  - メンバーの稼働率が可視化されている
- Key outcomes we want to achieve:
  - Excel からの完全移行
  - 営業活動の効率向上
  - 意思決定の迅速化
- How will we measure success?
  - Excel 利用率の低下
  - 月次レポート作成時間の短縮
  - ユーザー満足度

---

## 2. Target Users and Stakeholders

### 2.1 Primary Users

| Actor | Description | Primary Goals |
|-------|-------------|---------------|
| シニアコンサルタント | 営業活動を主導するコンサルタント | リード管理、案件進捗管理、売上実績の把握 |
| マネージャー | セクターの売上責任者 | チーム売上目標管理、メンバー稼働率管理 |
| シニアマネージャー | 複数セクターを統括 | 全体売上把握、リソース配分の最適化 |

### 2.2 Secondary Users

| Actor | Description | Interaction |
|-------|-------------|-------------|
| アソシエイトマネージャー | 案件支援担当 | 案件詳細の確認、活動履歴の入力 |
| コンサルタント | 案件メンバー | アサイン状況の確認、稼働実績の入力 |
| アソシエイト | ジュニアメンバー | 自身のアサイン状況確認 |

### 2.3 Stakeholders

- Business stakeholders: 経営層（売上実績レポートの閲覧者）
- Technical stakeholders: IT部門（システム管理・保守）
- External parties: なし（外部連携はスコープ外）

---

## 3. User Journeys

### Journey 1: リード案件管理

**Actor:** シニアコンサルタント
**Goal:** 新規リードを登録し、受注まで進捗を管理する

**Story:**
> シニアコンサルタントは新規の商談機会を得たとき、リード案件として登録する。顧客情報、想定売上、確度を入力し、活動履歴を記録しながら案件を進める。確度が上がり受注が決まったら、受注案件に移行する。

**Key Steps:**
1. ダッシュボードからリード案件一覧へ移動
2. 新規リード案件を登録（顧客情報、想定売上、確度）
3. 活動履歴を随時追加
4. 確度・ステータスを更新
5. 受注決定時に「受注移行」を実行

**Success Outcome:**
- リードから受注までの進捗が可視化され、適切なタイミングでアクションが取れる

---

### Journey 2: 受注案件・売上管理

**Actor:** シニアコンサルタント、マネージャー
**Goal:** 受注案件の売上を管理し、実績を記録する

**Story:**
> 受注が決まった案件に対して、契約情報と売上予定を登録する。プロジェクト進行に伴い、メンバーをアサインし、月次で売上実績を登録する。マネージャーはセクター全体の売上進捗を確認する。

**Key Steps:**
1. 受注案件詳細画面で契約情報を入力
2. 売上予定（月別）を設定
3. メンバーをアサイン（稼働率を考慮）
4. 月次で売上実績を登録
5. ダッシュボードで進捗を確認

**Success Outcome:**
- 売上予定と実績の乖離がリアルタイムで把握でき、早期に対策が打てる

---

### Journey 3: メンバー稼働管理

**Actor:** マネージャー
**Goal:** メンバーの稼働率を把握し、最適なアサインを行う

**Story:**
> マネージャーは新規案件にメンバーをアサインする際、現在の稼働状況を確認する。稼働率が高いメンバーには追加アサインを避け、稼働率が低いメンバーを優先的にアサインする。

**Key Steps:**
1. メンバー管理画面で稼働率一覧を確認
2. 稼働可能なメンバーを特定
3. 受注案件詳細画面でメンバーをアサイン
4. アサイン後の稼働率変化を確認

**Success Outcome:**
- メンバーの稼働率が適正に保たれ、過負荷・過少稼働を防止できる

---

### Journey 4: 売上サマリー確認

**Actor:** シニアマネージャー、マネージャー
**Goal:** セクター・個人別の売上状況をサマリーで確認する

**Story:**
> マネージャーは月初にダッシュボードを確認し、先月の実績と今月の目標達成率を把握する。セクター別・個人別の内訳を確認し、目標未達のセクターには対策を指示する。

**Key Steps:**
1. ダッシュボードで全体サマリーを確認
2. 売上実績一覧画面で詳細を確認
3. セクター別・個人別にドリルダウン
4. 必要に応じてCSV出力

**Success Outcome:**
- 売上状況がワンクリックで把握でき、迅速な意思決定が可能

---

### Journey 5: セクター売上目標管理

**Actor:** シニアマネージャー
**Goal:** セクター別の売上目標を設定・管理する

**Story:**
> 年度初めにシニアマネージャーは各セクターの売上目標を設定する。月次で目標に対する進捗を確認し、必要に応じて目標を調整する。

**Key Steps:**
1. セクター別売上目標画面を開く
2. 各セクターの年間・四半期・月別目標を設定
3. ダッシュボードで達成率を確認
4. 必要に応じて目標を調整

**Success Outcome:**
- セクター別の目標管理が一元化され、全社の売上目標達成に向けた管理が容易になる

---

## 4. Scope

### 4.1 In Scope

High-level capabilities this system will provide:

- [x] リード案件の登録・編集・検索・フィルタリング
- [x] リードから受注への案件移行
- [x] 受注案件の管理（契約情報、売上予定）
- [x] 売上実績の登録・集計（月別・セクター別・個人別）
- [x] メンバーアサイン管理
- [x] 稼働率の可視化
- [x] セクター別売上目標の設定・管理
- [x] ダッシュボード（KPIサマリー、グラフ）
- [x] Azure AD連携によるログイン
- [x] CSVエクスポート

### 4.2 Out of Scope

What this system will NOT do (at least in initial release):

- 会計ソフトとの連携
- 外部サービス（CRM、MA等）との連携
- 請求書発行機能
- 経費管理機能
- モバイルアプリ対応

### 4.3 Future Considerations

Items that may be considered for future phases:

- 外部CRMとのデータ連携
- モバイル対応（タブレット/スマホ）
- AI による売上予測
- 自動リマインダー機能

---

## 5. Screen Hints

> **Note**: This section captures screen-level information from the unified Quick Input.
> These hints are used by `/speckit.design` to create Screen Spec and Domain Spec simultaneously.

### 5.1 Screen List (Provisional)

| # | Screen Name | Purpose | Key Elements |
|---|-------------|---------|--------------|
| 1 | ログイン画面 | 認証 | Azure AD連携 |
| 2 | ダッシュボード | KPI確認 | 売上進捗グラフ、リード案件数、受注案件数、今月の売上目標達成率、直近のアクション予定 |
| 3 | リード案件一覧画面 | リード検索・管理 | 検索、ステータスフィルター、担当者フィルター、ページネーション、CSV出力 |
| 4 | リード案件詳細画面 | リード編集 | 顧客情報、案件概要、想定売上、確度、担当者、活動履歴、受注移行ボタン |
| 5 | 受注案件一覧画面 | 受注案件検索 | 一覧表示、検索、フィルター |
| 6 | 受注案件詳細画面 | 受注案件管理 | 契約情報、売上予定、メンバーアサイン一覧、稼働率、売上実績登録 |
| 7 | 売上実績一覧画面 | 売上集計確認 | 月別集計、セクター別集計、個人別集計、グラフ表示 |
| 8 | メンバー管理画面 | 稼働率管理 | 稼働率確認、メンバー一覧 |
| 9 | セクター別売上目標画面 | 目標設定 | セクター一覧、目標値設定、達成率表示 |
| 10 | 設定画面 | システム設定 | ユーザー管理、マスタ管理 |

### 5.2 Screen Transitions (Provisional)

- ログイン → ダッシュボード: 認証成功時
- ダッシュボード → 各一覧画面: メニュー選択
- リード案件一覧 → リード案件詳細: 行クリック
- リード案件詳細 → 受注案件詳細: 受注移行ボタン押下
- 受注案件一覧 → 受注案件詳細: 行クリック
- 受注案件詳細 → 売上登録モーダル: 売上登録ボタン押下

### 5.3 Design Preferences

- **Style**: 企業の業務システム風、シンプルで見やすいUI
- **Responsive**: PC のみ
- **Reference Images**: なし

---

## 6. Constraints and Assumptions

### 6.1 Business Constraints

- Timeline: [NEEDS CLARIFICATION]
- Budget: [NEEDS CLARIFICATION]
- Organizational: セクター別の組織構造に対応する必要がある

### 6.2 Technical Constraints

- Must integrate with: Azure AD（認証）
- Must comply with: 社内セキュリティポリシー
- Platform/environment restrictions: Webブラウザ（PC）のみ

### 6.3 Assumptions

- ユーザーは全員 Azure AD アカウントを持っている
- セクター構造は固定で、頻繁な変更はない
- 稼働率は月単位で管理する

---

## 7. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Excel からの移行抵抗 | High | Med | 段階的移行、トレーニング実施 |
| データ移行の不整合 | Med | Med | 移行前のデータクレンジング |
| 稼働率計算ロジックの複雑化 | Med | Low | 初期はシンプルなロジックで開始 |
| Azure AD 連携の技術的問題 | High | Low | 早期にPoCを実施 |

---

## 8. Open Questions

Questions that need to be resolved before proceeding:

- [ ] 稼働率の計算方法（月間稼働可能時間の定義）
- [ ] 値引きの計算・管理方法
- [ ] 売上認識のタイミング（契約時/納品時/入金時）
- [ ] 役職別のアクセス権限の詳細

---

## 9. Clarifications

Record of clarification questions and answers during the vision refinement process.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| - | - | - | - |

---

## 10. Related Documents

- Screen Spec: `.specify/input/otherpjsample/specs/screen/spec.md` (to be created)
- Domain Spec: `.specify/input/otherpjsample/specs/domain/spec.md` (to be created)
- Feature Specs: (to be created after Screen + Domain Specs)

---

## 11. Original Input

User-provided input that was used to generate this spec.

```
プロジェクト名: Sales Quest
一言で説明すると: SFAの機能も売上管理機能も包括した総合営業管理システム

課題:
- 現状の問題: リードの管理と売上の管理を個別のエクセルで実施している
- なぜ解決したいか: 現在の状況が分かりにくいのと、操作・管理がしにくい

ユーザー:
- 主なユーザー: シニアコンサル以上の営業担当者
- 達成したいこと: 営業管理が容易に

やりたいこと:
1. リード案件管理
2. 受注案件管理
3. 売上実績管理
4. メンバーアサイン管理
5. 各状態をサマリーで確認可能

やらないこと:
- 会計ソフトなど外部サービスとの連携

制約:
- 組織構造: セクター別に内部が分かれており、それぞれに売上目標があります
- 役職: アソシエイト、コンサルタント、シニアコンサルタント、アソシエイトマネージャー、マネージャー、シニアマネージャー
- ビジネスロジック: 稼働率、値引きといった概念あり
```

---

## 12. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| 2025-12-17 | Created | Initial vision specification from sample input | AI |

Change types: Created, Updated, Clarified, Approved
