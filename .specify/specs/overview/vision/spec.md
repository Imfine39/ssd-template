# Vision Specification: Quon案件管理システム

<!--
  Template: Vision Spec

  ID Format: S-VISION-001 (one per project)
  See: .claude/skills/spec-mesh/guides/id-naming.md

  Status Values (from constitution.md - Status Values section):
    Spec Status:
    - Draft: Initial creation, not reviewed
    - In Review: Under Multi-Review or stakeholder review
    - Clarified: All [NEEDS CLARIFICATION] markers resolved
    - Approved: Human approved, ready for implementation
    - Implemented: Code complete
-->

Spec Type: Vision
Spec ID: S-VISION-001
Created: 2025-12-25
Status: Draft
Author: Claude

---

## 1. System Purpose

### 1.1 Why are we building this?

- **Problem statement:**
  - 経営陣・経営企画が「案件ポートフォリオ・売上推移」を横串で把握できない
  - セクター長／マネージャーが「メンバーのアサイン状況・空き状況」を即座に把握できない
  - 受注案件とアサインメンバー、売上計上状況の管理が分散している

- **Current pain points:**
  - 経営判断に必要な情報収集に時間がかかる
  - メンバーリソースの最適活用ができていない
  - 売上・予算管理の精度が低い

- **Opportunity:**
  - 案件・アサイン・売上を一元管理することで、経営判断のスピード向上とリソース最適化を実現

### 1.2 Vision Statement

> 受注案件（プロジェクト）とそのアサインメンバー、売上計上状況を一元管理し、経営陣が案件ポートフォリオ・売上推移を横串で把握でき、セクター長／マネージャーがメンバーのアサイン状況・空き状況を即座に把握できるシステムを構築する。

### 1.3 Success Definition

- **What does success look like?**
  - 経営陣がダッシュボードで全案件の状況を即座に確認できる
  - マネージャーがメンバーのアサイン空き状況をリアルタイムで把握できる
  - 売上計上処理が効率化され、会計伝票の自動生成が可能

- **Key outcomes we want to achieve:**
  - 経営判断のスピード向上（情報収集時間の削減）
  - メンバーリソースの最適活用（アサイン率向上）
  - 売上・予算管理の精度向上

- **How will we measure success?**
  - 案件情報照会にかかる時間の短縮
  - アサイン調整にかかる時間の短縮
  - 売上計上処理時間の短縮

---

## 2. Target Users and Stakeholders

### 2.1 Primary Users

| Actor | Description | Primary Goals |
|-------|-------------|---------------|
| 経営陣 | 会社の経営層 | 全案件の売上・粗利・将来売上見込みを俯瞰する |
| 経営企画室 | 予算・KPI管理担当 | 予算対実績・KPIモニタリング・レポーティング |
| セクター長／マネージャー | 各セクターの責任者 | 自セクター案件の受注・アサイン・売上管理 |
| PJオーナー | 案件責任者 | 自案件の情報登録・更新、メンバーアサイン調整 |

### 2.2 Secondary Users

| Actor | Description | Interaction |
|-------|-------------|-------------|
| 管理部門（経理） | 経理担当者 | 売上計上・会計伝票照会 |
| システム管理者 | IT管理者 | マスタ管理、権限管理、監査ログ閲覧 |

### 2.3 Stakeholders

- **Business stakeholders:** 経営陣、経営企画室
- **Technical stakeholders:** システム管理者、IT部門
- **External parties:** なし（社内システム）

---

## 3. User Journeys

### Journey 1 (J-001): 受注伝票の登録・管理

**Actor:** PJオーナー / セクター長
**Goal:** 新規案件を登録し、メンバーをアサインする

**Story:**
> セクター長は新規受注した案件の情報を登録画面で入力する。案件の基本情報（クライアント、契約期間、受注金額など）を入力し、続いてアサインするメンバーの明細（期間、稼働率、単価など）を追加する。登録完了後、案件は検索画面で照会可能となり、ダッシュボードにも反映される。

**Key Steps:**
1. 受注伝票登録画面を新規モードで開く
2. ヘッダ情報（案件名、クライアント、契約期間、受注金額等）を入力
3. メンバー明細（メンバー、期間、稼働率、単価等）を追加
4. 保存して案件Noを採番

**Success Outcome:**
- 案件情報とメンバーアサインが正しく登録され、検索・ダッシュボードで確認可能

---

### Journey 2 (J-002): 売上計上処理

**Actor:** 管理部門（経理）
**Goal:** 月次の売上を計上し、会計伝票を作成する

**Story:**
> 経理担当者は月末に売上計上画面を開き、当月の計上期間を指定する。システムは計上対象となる受注明細を自動抽出し、一覧表示する。担当者は対象明細を確認・選択し、会計転記ボタンを押下すると、借方（売掛金）・貸方（売上）の会計伝票が自動生成される。

**Key Steps:**
1. 売上計上画面で計上年月を指定
2. 計上候補の明細一覧を確認
3. 対象明細を選択して会計転記を実行
4. 会計伝票が自動生成され、計上済みとしてマーク

**Success Outcome:**
- 当月の売上が正しく計上され、会計伝票が自動生成される

---

### Journey 3 (J-003): アサイン状況の確認・調整

**Actor:** セクター長／マネージャー
**Goal:** メンバーのアサイン状況を確認し、最適なアサインを行う

**Story:**
> マネージャーは新規案件へのメンバーアサインを検討するため、アサイン状況マトリクス画面を開く。メンバー×月のマトリクスで各メンバーの稼働状況（アベイラブル/アサイン予定/アサイン確定）を確認する。空きのあるメンバーを特定し、新規案件にアサインする判断を行う。

**Key Steps:**
1. アサイン状況マトリクス画面を開く
2. 対象期間を指定してメンバーの稼働状況を表示
3. アベイラブル（空き）のメンバーを特定
4. 受注伝票でメンバーをアサイン

**Success Outcome:**
- メンバーの空き状況を即座に把握し、最適なアサインを実現

---

### Journey 4 (J-004): 案件状況の俯瞰

**Actor:** 経営陣 / 経営企画室
**Goal:** 全案件の売上・受注状況を俯瞰する

**Story:**
> 経営者はダッシュボード画面を開き、全社の案件ポートフォリオを確認する。受注金額、売上実績、目標との差異をグラフで視覚的に把握し、必要に応じて個別案件の詳細を確認する。セクター別の売上状況も確認し、経営判断に活用する。

**Key Steps:**
1. 案件ダッシュボード画面を開く
2. 全社の受注・売上・目標推移をグラフで確認
3. セクター別の状況を確認
4. 必要に応じて個別案件の詳細を照会

**Success Outcome:**
- 経営に必要な情報を即座に把握し、迅速な意思決定が可能

---

## 4. Scope

### 4.1 In Scope

High-level capabilities this system will provide:

- [x] 受注伝票の登録・変更・照会（案件情報とメンバー明細の管理）
- [x] 売上計上処理（月次で会計伝票を一括作成）
- [x] 案件ダッシュボード（受注・売上・目標推移のグラフ表示）
- [x] アサイン状況マトリクス（メンバー×月の稼働状況可視化）
- [x] マスタ管理（クライアント、メンバー、セクター等）
- [x] 監査ログ照会（全更新操作の記録・検索）
- [x] 参照登録（過去案件からの情報引継ぎ）
- [x] Microsoft SSO（Azure AD）認証

### 4.2 Out of Scope

What this system will NOT do (at least in initial release):

- 多通貨対応（初期リリースではJPY固定、将来拡張）
- 引合伝票管理（別システム想定）
- 勤怠管理・工数入力機能
- 外部会計システムとの自動連携

### 4.3 Future Considerations

Items that may be considered for future phases:

- 多通貨対応（JPY以外の通貨サポート）
- 予実管理の高度化（予算・目標管理機能の拡充）
- 外部システム連携（会計システム、勤怠システム等）
- モバイル対応

---

## 5. Screen Hints

> **Note**: This section captures screen-level information from the unified Quick Input.
> These hints are used by design ワークフロー to create Screen Spec and Domain Spec simultaneously.
> If empty, design ワークフロー will prompt for screen information.

### 5.1 Screen List (Provisional)

User-provided screen list. Final SCR-* IDs will be assigned in Screen Spec.

| # | Screen Name | Purpose | Key Elements |
|---|-------------|---------|--------------|
| 1 | S-001: ログイン／トップ画面 | Microsoft SSO後のランディング、各機能への入口 | SSO認証、ナビゲーションメニュー |
| 2 | S-002: 案件検索画面 | 案件を検索して受注伝票画面へ遷移 | 検索条件入力、検索結果一覧 |
| 3 | S-003: 受注伝票登録・変更・照会画面 | 案件ヘッダと明細の管理 | タブ構成、ヘッダ情報、メンバー明細テーブル、売上推移グラフ |
| 4 | S-004: 売上計上画面 | 月次売上計上と会計伝票作成 | 計上期間指定、対象明細一覧、会計転記ボタン |
| 5 | S-005: 案件ダッシュボード画面 | 案件別の受注・売上・目標推移の可視化 | 折れ線／棒グラフ、フィルター |
| 6 | S-006: アサイン状況マトリクス画面 | メンバー×月の稼働状況可視化 | マトリクス表示、3ブロック（アベイラブル/予定/確定） |
| 7 | S-008: マスタ管理画面群 | 各種マスタデータの編集 | クライアント、メンバー、セクター等のCRUD |
| 8 | S-009: 監査ログ照会画面 | 操作履歴の検索・照会 | 検索条件、ログ一覧 |

### 5.2 Screen Transitions (Provisional)

Known navigation flows between screens.

- ログイン → トップ画面: SSO認証成功後
- トップ → 案件検索: ナビゲーションメニュー
- トップ → 案件ダッシュボード: ナビゲーションメニュー
- トップ → アサインマトリクス: ナビゲーションメニュー
- トップ → 売上計上: ナビゲーションメニュー
- トップ → マスタ管理: ナビゲーションメニュー（管理者のみ）
- 案件検索 → 受注伝票（照会モード）: 検索結果クリック
- 受注伝票 → 変更モード切替: 編集ボタン

### 5.3 Design Preferences

- **Style**: 業務システムとして使いやすいシンプルなUI、社内標準UIライブラリに準拠
- **Responsive**: PC のみ
- **Reference Images**: なし

---

## 6. Constraints and Assumptions

### 6.1 Business Constraints

- **Organizational:** セクター単位で案件・メンバーを管理。Tier1/2/3の案件分類あり。
- **Compliance requirements:** 監査ログの保持（期間は要確認）

### 6.2 Technical Constraints

- **Must integrate with:** Azure AD（Microsoft SSO認証）
- **Must comply with:** 社内標準UIライブラリ
- **Platform/environment restrictions:**
  - フロントエンド: Next.js（React + TypeScript）
  - バックエンド: Python（FastAPI）
  - DB: Azure SQL Database
  - 認証: Azure AD（Microsoft SSO）
  - インフラ: Azure App Service

### 6.3 Assumptions

- 案件編集時は排他ロックを取得し、他ユーザーの同時編集を防止
- 応答時間目標: 検索系3秒以内、登録系5秒以内（P95）
- 通貨はJPY固定（多通貨は将来拡張）
- 会計伝票はDr（売掛金）/Cr（売上）の2行ペア

### 6.4 Business Rules

- 変更モードでは既存明細の物理削除不可（論理削除のみ）
- 受注伝票表示開始時に排他ロックを取得
- 他ユーザーが編集中の案件は照会モードのみ許可
- アサイン状況は終了日と今日の日付で自動更新（assign_end_date < 今日 → アサイン終了）
- 売上計上後は当該明細の recognized_revenue を累計計上額に更新

### 6.5 Validation Rules

| Field | Rule |
|-------|------|
| 日付形式 | YYYY/MM/DD 以外はエラー |
| 必須項目 | 空の場合はエラー |
| 契約期間 | contract_start_date <= contract_end_date |
| アサイン期間 | assign_start_date <= assign_end_date |
| 稼働率 | 0〜100（小数第2位まで） |
| 金額系 | 負数禁止、0は許容 |

### 6.6 Calculation Rules

| 項目 | 計算式 |
|------|--------|
| 稼働月数 | (終了日 - 開始日 + 1日) / 30（小数第3位で四捨五入） |
| 単月小計 | 単価 × (稼働率/100) × 数量 − 値引額 |
| 概算売上 | 単月小計 × 稼働月数 |
| 正味額 | 明細の概算売上合計 |
| 単月平均 | 正味額 / 契約月数 |
| チャージ率(%) | 実売単価 ÷ 社内標準売価 × 100 |

---

## 7. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 排他制御による編集待ち | Med | Med | セッションタイムアウトでロック自動解除 |
| 大量データでの性能劣化 | High | Med | インデックス設計、ページング実装 |
| Azure AD認証連携の複雑さ | Med | Low | 既存の認証ライブラリ活用 |

---

## 8. Open Questions

Questions that need to be resolved before proceeding:

- [ ] 監査ログの保持期間（会計・監査要件に基づく）
- [ ] 社内標準UIライブラリの詳細仕様
- [ ] 会計計上済み明細の変更ポリシー（禁止 or 調整伝票方式）

---

## 9. Clarifications

Record of clarification questions and answers during the vision refinement process.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| 2025-12-25 | 初期作成 | - | - |

---

## 10. Related Documents

- Screen Spec: `.specify/specs/overview/screen/spec.md` (to be created by design ワークフロー)
- Domain Spec: `.specify/specs/overview/domain/spec.md` (to be created by design ワークフロー)
- Feature Specs: (to be created after Screen + Domain Specs)

---

## 11. Original Input

User-provided input that was used to generate this spec.
This section preserves the original context for future reference.

```
プロジェクト名: Quon案件管理システム
一言で説明すると: 営業案件・アサイン管理・売上計上を一元管理するシステム

課題:
- 経営陣・経営企画が「案件ポートフォリオ・売上推移」を横串で把握できない
- セクター長／マネージャーが「メンバーのアサイン状況・空き状況」を即座に把握できない
- 受注案件とアサインメンバー、売上計上状況の管理が分散している

やりたいこと:
1. 受注伝票の登録・変更・照会（案件情報とメンバー明細の管理）
2. 売上計上処理（月次で会計伝票を一括作成）
3. 案件ダッシュボード（受注・売上・目標推移のグラフ表示）
4. アサイン状況マトリクス（メンバー×月の稼働状況可視化）
5. マスタ管理（クライアント、メンバー、セクター等）
6. 監査ログ照会（全更新操作の記録・検索）
7. 参照登録（過去案件からの情報引継ぎ）

やらないこと:
- 多通貨対応（初期リリースではJPY固定、将来拡張）
- 引合伝票管理（別システム想定）
- 勤怠管理・工数入力機能

技術スタック:
- フロントエンド: Next.js（React + TypeScript）
- バックエンド: Python（FastAPI）
- DB: Azure SQL Database
- 認証: Azure AD（Microsoft SSO）
```

---

## 12. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| 2025-12-25 | Created | Initial vision specification from Quick Input | Claude |
| 2025-12-25 | Updated | Multi-Review: Added Business Rules, Validation Rules, Calculation Rules (Section 6.4-6.6), Journey IDs | Claude |

Change types: Created, Updated, Clarified, Approved
