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
Author: AI Assistant

---

## 1. System Purpose

### 1.1 Why are we building this?

- Problem statement:
  - 経営陣・経営企画が案件ポートフォリオや売上推移を横串で把握できていない
  - セクター長/マネージャーがメンバーのアサイン状況・空き状況を即座に把握できない
  - 受注案件の情報が分散しており、一元的な売上計上管理が困難
- Current pain points:
  - 案件情報が分散しており、一元管理ができていない
  - アサイン調整の意思決定に時間がかかる
  - 経理業務（会計伝票作成）が手作業で非効率
- Opportunity:
  - 経営判断のためのKPIモニタリング・予実管理を効率化
  - アサイン調整の意思決定を迅速化し、リソース活用を最適化
  - 会計伝票の一括作成により経理業務を省力化

### 1.2 Vision Statement

> 受注案件（プロジェクト）とアサインメンバー、売上計上状況を一元管理することで、経営判断の迅速化・リソース最適化・経理業務の省力化を実現する営業・案件管理システム。

### 1.3 Success Definition

- What does success look like?
  - 全案件の売上・粗利・将来売上見込みがリアルタイムで可視化されている
  - メンバーのアサイン状況が月次マトリクスで一目で把握できる
  - 月次売上計上が一括で実行でき、会計伝票が自動生成される
- Key outcomes we want to achieve:
  - 経営判断に必要なKPIが即座に参照可能
  - アサイン調整にかかる時間の大幅削減
  - 経理業務の工数削減
- How will we measure success?
  - 案件情報の登録・更新にかかる時間
  - アサイン調整の意思決定までの時間
  - 月次会計伝票作成の工数

---

## 2. Target Users and Stakeholders

### 2.1 Primary Users

| Actor | Description | Primary Goals |
|-------|-------------|---------------|
| 経営陣 | 全社経営を担う役員層 | 全案件の売上・粗利・将来売上見込みの俯瞰 |
| 経営企画室 | 予算・実績管理を担当する部門 | 予算対実績・KPIモニタリング・レポーティング |
| セクター長/マネージャー | 各セクターの案件・メンバーを管理 | 自セクター案件の受注・アサイン・売上管理 |
| PJオーナー | 案件責任者（通常セクター長/マネージャー） | 自案件の情報登録・更新、メンバーアサイン調整 |
| 管理部門（経理） | 売上計上・会計業務を担当 | 売上計上・会計伝票照会 |
| システム管理者 | システム全体の設定・運用を担当 | マスタ管理、権限管理、監査ログ閲覧 |

### 2.2 Secondary Users

| Actor | Description | Interaction |
|-------|-------------|-------------|
| 一般メンバー | プロジェクトにアサインされるメンバー | 自身のアサイン状況の照会 |

### 2.3 Stakeholders

- Business stakeholders: 経営陣、経営企画室、セクター長
- Technical stakeholders: システム管理者、IT部門
- External parties: なし（社内システム）

---

## 3. User Journeys

Describe the main ways users will interact with the system at a high level.
Each journey should tell a story of how a user achieves their goal.

### Journey 1: 案件ダッシュボードで経営状況を把握

**Actor:** 経営陣
**Goal:** 全社の売上・受注状況を一目で把握し、経営判断に活用する

**Story:**
> 経営陣は毎月の経営会議前に案件ダッシュボード画面にアクセスし、全社およびセクター別の売上推移・受注金額・目標値の達成状況をグラフで確認する。問題があるセクターを特定し、必要に応じてドリルダウンして詳細を確認する。

**Key Steps:**
1. ログイン後、案件ダッシュボード画面へ遷移
2. 全社またはセクター別の売上推移グラフを確認
3. 目標値との乖離がある場合、詳細データを確認

**Success Outcome:**
- 経営判断に必要なKPIを5分以内で把握できる

---

### Journey 2: 受注案件の登録と売上計上

**Actor:** PJオーナー、経理
**Goal:** 新規案件を登録し、月次で売上計上を行う

**Story:**
> PJオーナーは新規受注が決まると受注伝票画面で案件情報とメンバーアサイン情報を登録する。月末になると経理担当者が売上計上画面で計上候補を確認し、チェックボックスで選択して会計伝票を一括作成する。

**Key Steps:**
1. PJオーナーが受注伝票画面で新規案件登録
2. メンバー明細を追加してアサイン情報を設定
3. 月末に経理が売上計上画面で計上対象を選択
4. 会計伝票一括作成を実行

**Success Outcome:**
- 案件登録から売上計上まで一連の業務がシステム内で完結する

---

### Journey 3: アサイン状況の確認と調整

**Actor:** セクター長/マネージャー
**Goal:** メンバーのアサイン状況を把握し、最適なアサインを実現する

**Story:**
> セクター長は月初にアサイン状況マトリクス画面を開き、自セクターメンバーの今月〜3ヶ月先までの稼働状況を確認する。空きのあるメンバーを見つけ、新規案件へのアサインを検討。受注伝票画面でメンバー明細を追加し、アサインを確定する。

**Key Steps:**
1. アサイン状況マトリクス画面でメンバーの稼働状況を確認
2. アベイラブル（空き）のあるメンバーを特定
3. 受注伝票画面でメンバー明細を追加してアサイン

**Success Outcome:**
- メンバーの稼働状況が一目で把握でき、最適なアサインができる

---

## 4. Scope

### 4.1 In Scope

High-level capabilities this system will provide:

- [x] 受注伝票（案件ヘッダ＋メンバー明細）の登録・変更・照会
- [x] 売上計上（月次で計上候補を抽出し、会計伝票を一括作成）
- [x] 案件ダッシュボード（受注金額・売上実績・目標値の推移グラフ表示）
- [x] アサイン状況マトリクス（メンバー×月の予定/確定稼働率を可視化）
- [x] 参照登録（過去案件や引合から情報を引き継いで新規案件登録）
- [x] マスタ管理（クライアント/エンドクライアント/メンバー/セクター等）
- [x] 監査ログ照会（すべての更新操作を記録・検索）

### 4.2 Out of Scope

What this system will NOT do (at least in initial release):

- 引合管理（別システムで管理する想定）
- 多通貨対応（初期リリースはJPY固定、将来拡張）
- 工数入力・勤怠管理（実績は予定・実績テーブルで管理するが、勤怠システム連携は対象外）
- モバイルアプリ対応（Webブラウザのみ）

### 4.3 Future Considerations

Items that may be considered for future phases:

- 多通貨対応
- 勤怠システム連携
- モバイル対応

---

## 5. Screen Hints

> **Note**: This section captures screen-level information from the unified Quick Input.
> These hints are used by `/spec-mesh design` to create Screen Spec and Domain Spec simultaneously.
> If empty, `/spec-mesh design` will prompt for screen information.

### 5.1 Screen List (Provisional)

User-provided screen list. Final SCR-* IDs will be assigned in Screen Spec.

| # | Screen Name | Purpose | Key Elements |
|---|-------------|---------|--------------|
| 1 | ログイン／トップ画面 | Microsoft SSO後のランディング、ダッシュボード等への入口 | メニュー、クイックアクセス |
| 2 | 案件検索画面 | 案件No、クライアントなどで案件を検索 | 検索フォーム、検索結果一覧 |
| 3 | 受注伝票登録・変更・照会画面 | 案件情報の登録・変更・照会 | ヘッダ情報、明細タブ、計上状況タブ、簡易ダッシュボード |
| 4 | 売上計上画面 | 月次売上計上候補の確認と会計伝票一括作成 | 計上期間指定、計上候補一覧、一括作成ボタン |
| 5 | 案件ダッシュボード画面 | 案件別の売上推移可視化 | 売上推移グラフ、フィルタ |
| 6 | アサイン状況マトリクス画面 | メンバー×月の稼働率可視化 | マトリクス表示、ポップアップ詳細 |
| 7 | マスタ管理画面群 | 各種マスタの編集 | CRUD機能 |
| 8 | 監査ログ照会画面 | 操作履歴の検索・照会 | 検索フォーム、ログ一覧 |

### 5.2 Screen Transitions (Provisional)

Known navigation flows between screens.

- ログイン → トップ（ダッシュボード入口）
- トップ → 案件検索画面、案件ダッシュボード、アサイン状況マトリクス、売上計上画面、マスタ管理、監査ログ
- 案件検索画面 → 受注伝票画面（照会モード）
- 受注伝票画面 → 新規登録モード、変更モード
- 受注伝票画面（参照登録） → 新規登録モード（過去案件/引合から情報コピー）

### 5.3 Design Preferences

- **Style**: 企業向け業務システム（シンプル・機能的）、社内標準UIライブラリに準拠
- **Responsive**: PC のみ
- **Reference Images**: なし（既存UI要件に従う）

---

## 6. Constraints and Assumptions

### 6.1 Business Constraints

- Organizational: セクター単位で案件・メンバーを管理
- Compliance requirements: 会計・監査要件への準拠

### 6.2 Technical Constraints

- Must integrate with: Azure AD (Entra ID) によるSSO
- Must comply with: 会計・監査要件
- Platform/environment restrictions:
  - フロントエンド: Next.js (React + TypeScript)
  - バックエンド: FastAPI (Python)
  - データベース: Azure SQL Database
  - インフラ: Azure App Service

### 6.3 Assumptions

- PJオーナー（案件責任者）は通常セクター長またはマネージャー
- ロール: 管理者、経営陣、経営企画、セクター長/マネージャー、一般メンバー
- 応答時間目標: 検索系3秒以内、登録系5秒以内（P95）
- 排他制御: 同一案件の同時編集防止（ロック機構）

---

## 7. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 複雑なビジネスロジックによる開発遅延 | High | Med | 早期にロジックを明確化し、テストケースを作成 |
| 既存システムからのデータ移行 | Med | High | 移行計画を早期に策定、テスト移行を実施 |
| ユーザー adoption の遅れ | Med | Med | トレーニング計画を策定、UIを直感的に設計 |
| パフォーマンス問題（大量データ） | Med | Med | インデックス設計、クエリ最適化を事前検討 |

---

## 8. Open Questions

Questions that need to be resolved before proceeding:

- [ ] 売上計上済みの明細を変更した場合の取り扱い（変更禁止 or 差額調整伝票）は Phase 2 で決定とあるが、Phase 1 では変更禁止で良いか？
- [ ] 監査ログの保持期間は？

---

## 9. Clarifications

Record of clarification questions and answers during the vision refinement process.

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| | | | |

---

## 10. Related Documents

- Screen Spec: `.specify/specs/overview/screen/spec.md` (to be created by /spec-mesh design)
- Domain Spec: `.specify/specs/overview/domain/spec.md` (to be created by /spec-mesh design)
- Feature Specs: (to be created after Screen + Domain Specs)

---

## 11. Original Input

User-provided input that was used to generate this spec.
This section preserves the original context for future reference.

```
プロジェクト名: Quon案件管理システム
一言で説明すると: 受注案件（プロジェクト）とアサインメンバー、売上計上状況を一元管理する営業・案件管理システム

主な機能:
1. 受注伝票（案件ヘッダ＋メンバー明細）の登録・変更・照会
2. 売上計上（月次で計上候補を抽出し、会計伝票を一括作成）
3. 案件ダッシュボード（受注金額・売上実績・目標値の推移グラフ表示）
4. アサイン状況マトリクス（メンバー×月の予定/確定稼働率を可視化）
5. 参照登録（過去案件や引合から情報を引き継いで新規案件登録）
6. マスタ管理（クライアント/エンドクライアント/メンバー/セクター等）
7. 監査ログ照会（すべての更新操作を記録・検索）

技術スタック:
- フロントエンド: Next.js (React + TypeScript)
- バックエンド: FastAPI (Python)
- データベース: Azure SQL Database
- 認証: Azure AD (Entra ID) によるSSO
- インフラ: Azure App Service
```

---

## 12. Changelog

| Date | Change Type | Description | Author |
|------|-------------|-------------|--------|
| 2025-12-25 | Created | Initial vision specification from Quick Input | AI Assistant |

Change types: Created, Updated, Clarified, Approved
