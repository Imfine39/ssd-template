# Vision Specification: Sales Quest

Spec Type: Vision
Spec ID: S-VISION-001
Created: 2025-12-17
Status: Draft
Author: AI Generated

---

## 1. System Purpose

### 1.1 Why are we building this?

- **Problem statement**: リードの管理と売上の管理を個別のエクセルで実施しており、情報が分散している
- **Current pain points**:
  - 現在の状況が分かりにくい
  - 操作・管理がしにくい
  - セクター別の売上状況の把握が困難
- **Opportunity**: SFA と売上管理を統合した一元管理システムにより、営業活動の効率化と可視化を実現

### 1.2 Vision Statement

> シニアコンサルタント以上の営業担当者が、リード案件から受注、売上実績までを一元管理し、セクター別の目標達成状況をリアルタイムで把握できる総合営業管理システムを構築する。

### 1.3 Success Definition

- **What does success look like?**
  - 営業担当者がエクセルを使わずにすべての営業管理業務を完結できる
  - ダッシュボードで売上進捗が一目で把握できる
- **Key outcomes we want to achieve:**
  - リード案件の進捗管理の効率化
  - 受注案件のメンバーアサイン管理の一元化
  - セクター別売上目標の達成状況の可視化
- **How will we measure success?**
  - エクセル管理からの完全移行
  - 営業レポート作成時間の削減

---

## 2. Target Users and Stakeholders

### 2.1 Primary Users

| Actor | Description | Primary Goals |
|-------|-------------|---------------|
| シニアコンサルタント | シニアコンサルタント以上の役職を持つ営業担当者 | リード案件の作成・管理、受注案件の管理 |
| マネージャー | アソシエイトマネージャー以上の管理職 | セクター売上目標の設定、メンバーの稼働率確認 |

### 2.2 Secondary Users

| Actor | Description | Interaction |
|-------|-------------|-------------|
| コンサルタント | 一般のコンサルタント | 自分がアサインされた案件の確認（閲覧のみ） |
| アソシエイト | 新人コンサルタント | 自分がアサインされた案件の確認（閲覧のみ） |

### 2.3 Stakeholders

- **Business stakeholders**: セクターリーダー、経営層
- **Technical stakeholders**: IT部門
- **External parties**: なし（外部連携なし）

---

## 3. User Journeys

### Journey 1: リード案件から受注への移行

**Actor:** シニアコンサルタント
**Goal:** 新規リード案件を登録し、営業活動を経て受注案件に移行する

**Story:**
> シニアコンサルタントは新規の商談機会を発見し、リード案件として登録する。顧客情報、想定売上、確度を入力し、営業活動を記録していく。商談が成功し受注が決まったら、ステータスを「受注」に変更することで自動的に受注案件として管理が始まる。

**Key Steps:**
1. リード案件一覧画面から新規リード案件を作成
2. 顧客情報、案件概要、想定売上、確度を入力
3. 活動履歴を記録しながら営業活動を実施
4. 受注が決まったら「受注移行」ボタンで受注案件に移行

**Success Outcome:**
- リード案件が受注案件に変換され、メンバーアサインや売上実績管理が可能になる

---

### Journey 2: 受注案件のメンバーアサインと売上登録

**Actor:** シニアコンサルタント / マネージャー
**Goal:** 受注案件にメンバーをアサインし、月次で売上実績を登録する

**Story:**
> 受注が決まった案件に対して、担当者はプロジェクトメンバーをアサインする。各メンバーのアサイン率を設定し、稼働率を管理する。毎月、実際の売上実績を登録することで、売上目標に対する達成状況を追跡できる。

**Key Steps:**
1. 受注案件詳細画面でメンバーをアサイン
2. 各メンバーのアサイン率を設定（合計100%以内）
3. 月次で売上実績を登録
4. ダッシュボードで売上達成率を確認

**Success Outcome:**
- メンバーの稼働率が適切に管理され、売上実績が正確に記録される

---

### Journey 3: セクター売上目標の管理と進捗確認

**Actor:** マネージャー
**Goal:** セクターの売上目標を設定し、達成状況を確認する

**Story:**
> マネージャーはセクターの年間・月間売上目標を設定する。ダッシュボードでリアルタイムに売上進捗を確認し、目標達成に向けた施策を検討する。売上実績一覧でセクター別、個人別の詳細を分析できる。

**Key Steps:**
1. セクター別売上目標画面で目標を設定
2. ダッシュボードで売上達成率を確認
3. 売上実績一覧でセクター別・個人別の詳細を分析
4. 必要に応じて施策を検討

**Success Outcome:**
- セクターの売上状況が可視化され、目標達成に向けた意思決定ができる

---

## 4. Scope

### 4.1 In Scope

High-level capabilities this system will provide:

- [x] リード案件管理（登録、編集、検索、ステータス管理）
- [x] 受注案件管理（契約情報、メンバーアサイン）
- [x] 売上実績管理（月次登録、集計）
- [x] メンバーアサイン管理（稼働率管理）
- [x] ダッシュボード（サマリー表示、KPI可視化）
- [x] Azure AD 認証連携
- [x] セクター別売上目標管理
- [x] ユーザー管理・マスタ管理

### 4.2 Out of Scope

What this system will NOT do (at least in initial release):

- 会計ソフトなど外部サービスとの連携
- モバイル対応（PC専用）
- 請求書発行機能
- 顧客向けポータル

### 4.3 Future Considerations

Items that may be considered for future phases:

- 外部会計システムとの連携
- モバイルアプリ対応
- AI による売上予測機能
- 顧客管理（CRM）機能の拡張

---

## 5. Screen Hints

> **Note**: This section captures screen-level information from the unified Quick Input.
> These hints are used by `/speckit.design` to create Screen Spec and Domain Spec simultaneously.

### 5.1 Screen List (Provisional)

| # | Screen Name | Purpose | Key Elements |
|---|-------------|---------|--------------|
| 1 | ログイン画面 | Azure AD認証 | Azure AD連携ログインボタン |
| 2 | ダッシュボード | 全体サマリー表示 | 売上進捗グラフ、リード案件数、受注案件数、目標達成率、アクション予定 |
| 3 | リード案件一覧画面 | リード案件の一覧・検索 | 検索、ステータスフィルター、担当者フィルター、ページネーション、CSV出力 |
| 4 | リード案件詳細画面 | リード案件の詳細・編集 | 顧客情報、案件概要、想定売上、確度、担当者、活動履歴、受注移行ボタン |
| 5 | 受注案件一覧画面 | 受注案件の一覧・検索 | 検索、フィルター、ページネーション |
| 6 | 受注案件詳細画面 | 受注案件の詳細・管理 | 契約情報、売上予定、メンバーアサイン一覧、稼働率、売上実績登録 |
| 7 | 売上実績一覧画面 | 売上実績の集計・分析 | 月別集計、セクター別集計、個人別集計、グラフ表示 |
| 8 | メンバー管理画面 | メンバー稼働率確認 | メンバー一覧、稼働率確認 |
| 9 | セクター別売上目標画面 | 売上目標の設定・確認 | セクター一覧、目標設定、達成率表示 |
| 10 | 設定画面 | システム設定 | ユーザー管理、マスタ管理 |

### 5.2 Screen Transitions (Provisional)

- ログイン画面 → ダッシュボード: 認証成功時
- ダッシュボード → 各一覧画面: メニュー/リンククリック
- リード案件一覧 → リード案件詳細: 行クリック
- リード案件詳細 → 受注案件詳細: 受注移行ボタンクリック
- 受注案件一覧 → 受注案件詳細: 行クリック
- 受注案件詳細 → 売上登録モーダル: 売上登録ボタンクリック

### 5.3 Design Preferences

- **Style**: 企業の業務システム風、シンプルで見やすいUI
- **Responsive**: PC のみ
- **Reference Images**: なし

---

## 6. Constraints and Assumptions

### 6.1 Business Constraints

- **Timeline**: 6ヶ月以内（フル機能リリース）
- **Budget**: 予算制約なし（社内開発、工数ベースで管理）
- **Organizational**:
  - セクター別に内部が分かれており、それぞれに売上目標がある
  - 役職階層: アソシエイト → コンサルタント → シニアコンサルタント → アソシエイトマネージャー → マネージャー → シニアマネージャー

### 6.2 Technical Constraints

- **Must integrate with**: Azure AD（認証）
- **Must comply with**: Azure AD 認証による標準的な企業レベルのセキュリティ
- **Platform/environment restrictions**: PC専用（モバイル非対応）
- **Concurrent users**: 20名程度

### 6.3 Assumptions

- ユーザーは Azure AD アカウントを持っている
- シニアコンサルタント以上のみがリード案件を作成可能
- コンサルなので稼働率、値引きといった概念が必要

---

## 7. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Azure AD 連携の複雑さ | High | Medium | 早期に認証機能を実装してリスクを検証 |
| ユーザー抵抗（慣れたエクセルからの移行） | Medium | Medium | トレーニング実施、移行期間の設定 |
| 過去データ参照の手間 | Low | Medium | 必要に応じてエクセルを並行参照可能 |

---

## 8. Open Questions

Questions that need to be resolved before proceeding:

- [x] プロジェクトのタイムライン・リリース目標日は？ → 6ヶ月以内
- [x] 予算制約はあるか？ → なし（社内開発）
- [x] 既存エクセルデータの移行は必要か？ → 不要（新規スタート）
- [x] セキュリティ要件（データ保持期間、アクセスログ等）は？ → Azure AD 認証による標準レベル
- [x] 同時接続ユーザー数の想定は？ → 20名程度

---

## 9. Clarifications

Record of clarification questions and answers during the vision refinement process.

### Session 2025-12-18

- Q: プロジェクトのリリース目標はいつ頃ですか？ → A: 6ヶ月以内（フル機能）
- Q: 予算制約はありますか？ → A: 予算制約なし（社内開発）
- Q: セキュリティ要件で特に重要なものは？ → A: Azure AD 認証のみ（標準的な企業レベル）
- Q: 同時接続ユーザー数の想定は？ → A: 20名程度
- Q: 既存エクセルデータの移行は必要か？ → A: 不要（新規スタート、必要なら手動参照）

---

## 10. Related Documents

- Screen Spec: `.specify/specs/sample/screen/spec.md` (to be created by /speckit.design)
- Domain Spec: `.specify/specs/sample/domain/spec.md` (to be created by /speckit.design)
- Feature Specs: (to be created after Screen + Domain Specs)

---

## 11. Original Input

User-provided input that was used to generate this spec.
This section preserves the original context for future reference.

```
## Part A: ビジョン（必須）

### A1. 基本情報
- プロジェクト名: Sales Quest
- 一言で説明すると: SFAの機能も売上管理機能も包括した総合営業管理システム

### A2. 課題
- 現状の問題: リードの管理と売上の管理を個別のエクセルで実施している
- なぜ解決したいか: 現在の状況が分かりにくいのと、操作・管理がしにくい

### A3. ユーザー
- 主なユーザー: シニアコンサル以上の営業担当者
- ユーザーが達成したいこと: 営業管理が容易に

### A4. やりたいこと
1. リード案件管理
2. 受注案件管理
3. 売上実績管理
4. メンバーアサイン管理
5. 各状態をサマリーで確認可能

### A5. やらないこと
- 会計ソフトなど外部サービスとの連携

### A6. 制約・前提条件
- 組織構造: セクター別に内部が分かれており、それぞれに売上目標があります。
  役職はアソシエイト、コンサルタント、シニアコンサルタント、アソシエイトマネージャー、マネージャー、シニアマネージャー
- ビジネスロジック: コンサルなので稼働率、値引きといった概念があります。

## Part B: 画面イメージ
10画面: ログイン、ダッシュボード、リード案件一覧/詳細、受注案件一覧/詳細、
売上実績一覧、メンバー管理、セクター別売上目標、設定

## Part C: デザイン希望
- 企業の業務システム風、シンプルで見やすいUI
- PC のみ

## Part D: ビジネスルール
- リード案件のステータスが「受注」になったら受注案件に移行する
- 受注案件には必ず1人以上のメンバーがアサインされている必要がある
- 売上実績は月次で登録する
- セクターごとに売上目標が設定される
- シニアコンサルタント以上のみがリード案件を作成可能
- バリデーション: 確度0〜100%、想定売上・契約金額0以上、稼働率0〜100%、アサイン率合計100%以内
- 計算: 稼働率=全案件アサイン率合計、売上達成率=実績/目標×100、値引き後金額=契約金額×(1-値引き率)
```

---

## 12. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| 2025-12-18 | Clarified | タイムライン、予算、セキュリティ、同時接続数、データ移行を明確化 | AI |
| 2025-12-17 | Created | Initial vision specification from Quick Input | AI |

Change types: Created, Updated, Clarified, Approved
