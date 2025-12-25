以下は、添付のユーザー要求定義（userRequirement.md）とUIイメージを元に、「仕様駆動開発」で実装エージェントがそのまま参照できることを目的とした総合仕様書です。

---

# 0. このドキュメントの位置づけ

- 対象システム：Quon案件管理システム（営業／案件管理・アサイン管理・売上計上）
- 対象範囲：  
  - 受注伝票登録・変更・照会  
  - 売上計上  
  - ダッシュボード（案件状況・アサイン状況）  
  - 共通マスタ・認証・権限・ログ  
- 目的：  
  - 実装用エージェント／エンジニアが、この仕様だけを参照して実装可能な状態を作る  
  - 追加の口頭指示に頼らず、テストケースまで一貫して定義する  

※明示されていない部分は、合理的な設計案として【要確認】と付記しています。設計レビュー時に人間が承認／修正する前提です。

---

# 1. ドメイン概要・ゴール

## 1.1 システム目的

- 受注案件（プロジェクト）とそのアサインメンバー、売上計上状況を一元管理し、
  - 経営陣・経営企画が「案件ポートフォリオ・売上推移」を横串で把握できること
  - セクター長／マネージャーが「メンバーのアサイン状況・空き状況」を即座に把握できること  
  を目的とする。

## 1.2 主な利用者（アクター）

| アクター | 役割 |
|---------|------|
| 経営陣 | 全案件の売上・粗利・将来売上見込みの俯瞰 |
| 経営企画室 | 予算対実績・KPIモニタリング・レポーティング |
| セクター長／マネージャー | 自セクター案件の受注・アサイン・売上管理 |
| PJオーナー | 自案件の情報登録・更新、メンバーアサイン調整 |
| 管理部門（経理） | 売上計上・会計伝票照会 |
| システム管理者 | マスタ管理、権限管理、監査ログ閲覧 |

---

# 2. ユースケース一覧

## 2.1 受注伝票まわり

1. **UC-001：伝票登録**  
   案件受注時に案件情報を登録する。
2. **UC-002：伝票照会・変更**  
   既存案件の内容を照会し、一部項目を変更する。
3. **UC-003：明細管理**  
   案件ヘッダ情報とメンバー明細を入力・保存する。
4. **UC-004：参照登録**  
   引合伝票や過去案件から情報を引き継いで新規案件を登録する。【引合は別システムを想定】
  | 項目                                          | 過去案件コピー時          | 引合コピー時           |
  | ------------------------------------------- | ----------------- | ---------------- |
  | `project_name`                              | コピー               | コピー              |
  | `client_id`                                 | コピー               | コピー              |
  | `contract_start_date` / `contract_end_date` | クリア               | クリア              |
  | `order_amount_total`                        | クリア               | 引合の予定金額を初期値【要確認】 |
  | `pj_status_summary`                         | クリア               | クリア              |
  | `source_document`                           | 元の案件ID or 引合IDを保持 | 引合IDを保持          |

5. **UC-005：アサイン管理**  
   案件ごとのアサインメンバーの期間・単価・稼働率・売上見込みを管理する。

## 2.2 売上計上まわり

6. **UC-006：売上計上**  
   月次で売上計上対象の明細を抽出し、会計伝票を一括作成する。

## 2.3 ダッシュボード／アサイン状況

7. **UC-007：案件状況確認**
   案件ごとの受注・売上・目標値の推移をグラフで確認する。
8. **UC-008：アサイン状況確認**
   メンバー単位のアサイン予定／確定／空き状況を月次マトリクスで確認する。

## 2.4 共通

10. **UC-010：認証・認可**  
    Microsoftアカウント SSO でログインし、自分の権限に応じた機能のみ利用する。
11. **UC-011：マスタ管理**  
    クライアント／エンドクライアント／メンバー／セクターなどのマスタを管理する。
12. **UC-012：監査ログ照会**  
    すべての更新操作を監査ログとして記録・検索する。

---

# 3. 画面一覧と概要

## 3.1 画面一覧

| ID | 画面名 | 概要 |
|----|--------|------|
| S-001 | ログイン／トップ | Microsoft SSO後のランディング。ダッシュボード等への入口。 |
| S-002 | 案件検索画面 | 案件Noやクライアントなどで案件を検索し、S-003に遷移。 |
| S-003 | 受注伝票登録・変更・照会画面 | ヘッダ＋明細＋メモ＋簡易グラフ付き画面。 |
| S-004 | 売上計上画面 | 計上期間を指定し、対象明細を抽出・会計伝票一括作成。 |
| S-005 | 案件ダッシュボード画面 | 案件別の受注・売上・目標推移グラフ。 |
| S-006 | アサイン状況マトリクス画面 | メンバー×月のアサイン・空き状況を可視化。 |
| S-008 | マスタ管理画面群 | クライアント等のマスタ編集。 |
| S-009 | 監査ログ照会画面 | 操作履歴の検索・照会。 |

以下、仕様の要となる S-003 / S-004 / S-005 / S-006 を詳細化する。

---

# 4. 画面仕様（主要画面）

## 4.1 S-003：受注伝票登録・変更・照会画面

### 4.1.1 概要

- 上部：案件No入力＋検索ボタン＋タブ  
  - Summary / 関連案件 / 案件情報入力 / 注文書(添付) / アクション履歴
- 中央：ヘッダ情報＋状況サマリ・ネクストアクション・簡易ダッシュボード（売上推移グラフ）
- 下部：Item（メンバー明細）テーブル

### 4.1.2 画面モード

| モード | 説明 |
|--------|------|
| 照会モード | 全項目 read-only。 initialState。 |
| 変更モード | 変更許可された項目のみ編集可（部分活性）。 |
| 新規登録モード | 案件No 未採番。全ての入力項目が編集可（一部自動設定項目を除く）。 |

- モード表示：画面右上にラベル表示（例：`[照会]` / `[変更]` / `[新規]`）

### 4.1.3 ヘッダ項目定義（`project_orders` に対応）

| ID | 画面ラベル | 論理名 | 型 | 必須 | 編集可能 | 備考 |
|----|------------|--------|----|------|----------|------|
| H-001 | 案件No | order_id | 文字列(20) | 新規時：不要 | 変更不可 | 保存時に自動採番。検索キー。 |
| H-002 | プロジェクト名 | project_name | 文字列(100) | 必須 | 〇 | 改行不可。 |
| H-003 | クライアント | client_id | FK(Client) | 必須 | 〇 | プルダウン／検索ダイアログ。 |
| H-004 | エンドクライアント | end_client_id | FK(EndClient) | 任意 | 〇 | |
| H-005 | Tier | tier | ENUM(Tier1/2/3) | 必須 | 〇 | マスタより選択。 |
| H-006 | セクター | sector_id | FK(Sector) | 必須 | 〇 | |
| H-007 | 案件責任者（PJオーナー） | owner_user_id | FK(User) | 必須 | 〇 | 通常はセクター長・Mgr。 |
| H-008 | 契約開始日 | contract_start_date | 日付 | 必須 | 〇 | フォーマット YYYY/MM/DD |
| H-009 | 契約終了日 | contract_end_date | 日付 | 必須 | 〇 | contract_start_date 以上。 |
| H-010 | 受注金額 | order_amount_total | 数値(15,0) | 必須 | 〇 | 通貨は JPY 固定（多通貨は将来拡張）。 |
| H-011 | 正味額 | net_amount | 数値(15,0) | 自動 | 変更不可 | 明細の概算売上合計 − 値引き等。 |
| H-012 | 単月平均 | avg_monthly_amount | 数値(15,0) | 自動 | 変更不可 | 正味額 / 契約月数。契約月数算出ルールは 11.3 参照。 |
| H-013 | PJ状況サマリ | pj_status_summary | テキスト(500) | 任意 | 〇 | UI上の「PJ状況サマリ」。 |
| H-014 | ネクストアクション | next_action | テキスト(500) | 任意 | 〇 | |
| H-015 | 契約形態 | contract_type | ENUM(請負/準委任/その他) | 必須 | 〇 | マスタ化も可。 |
| H-016 | 参照元 | source_document | 文字列(50) | 任意 | 新規時のみ | 引合伝票番号など。 |
| H-017 | メモ | memo | テキスト(2000) | 任意 | 〇 | |
| H-018 | 登録日時 | created_at | datetime | 自動 | 変更不可 | DB自動設定。 |
| H-019 | 登録者 | created_by | FK(User) | 自動 | 変更不可 | |
| H-020 | 最終更新日時 | updated_at | datetime | 自動 | 変更不可 | |
| H-021 | 最終更新者 | updated_by | FK(User) | 自動 | 変更不可 | |

### 4.1.4 明細タブ：メンバー入力（`project_order_items` に対応）

#### テーブル項目

| ID | 画面ラベル | 論理名 | 型 | 必須 | 編集可能 | 備考 |
|----|------------|--------|----|------|----------|------|
| D-001 | 明細No | item_no | 整数 | 自動 | 変更不可 | 案件ヘッダ内ユニーク。 |
| D-002 | Item | item_name | 文字列(50) | 任意 | 〇 | 任意補足（例：マネージャ・コンサル等）。 |
| D-003 | メンバ | member_id | FK(Member) | 必須 | 〇 | メンバー選択。 |
| D-004 | メンバークラス | member_class | ENUM(A/C/SC/AM/M/SM) | 必須 | 初期値のみ | Memberマスタから初期表示。編集可否は【要確認】。 |
| D-005 | 数量 | quantity | 数値(4,1) | 必須 | 〇 | 人数。通常 1.0。 |
| D-006 | 開始期間 | assign_start_date | 日付 | 必須 | 〇 | |
| D-007 | 終了期間 | assign_end_date | 日付 | 必須 | 〇 | |
| D-008 | 稼働率(%) | utilization_rate | 数値(5,2) | 必須 | 〇 | 0〜100。 |
| D-009 | 単価 | unit_price | 数値(15,0) | 必須 | 〇 | メンバークラスに応じて初期表示。 |
| D-010 | 通貨 | currency | 文字列(3) | 必須 | 〇 | 初期値: `JPY` 固定。多通貨対応は将来拡張。 |
| D-011 | 値引額 | discount_amount | 数値(15,0) | 任意 | 〇 | 月額ベースの値引。 |
| D-012 | 値引通貨 | discount_currency | 文字列(3) | 自動 | 変更不可 | 通常 `JPY`。 |
| D-013 | チャージ率(%) | charge_rate | 数値(5,2) | 任意 | 〇 | 「実売単価 ÷ 社内標準売価 × 100」。例：標準200万に対し実売180万→90%。値引率= (100 - charge_rate)。【内部ロジックは 11.5 参照】 |
| D-014 | 単月小計 | monthly_subtotal | 数値(15,0) | 自動 | 変更不可 | `unit_price × (utilization_rate/100) × quantity − discount_amount` |
| D-015 | 稼働期間(月) | working_months | 数値(5,2) | 自動 | 変更不可 | `(assign_end_date − assign_start_date + 1日) / 30` で算出。小数第2位まで保持（第3位四捨五入）【必要に応じてマニュアル修正可】。 |
| D-016 | 概算売上 | estimated_revenue | 数値(15,0) | 自動 | 変更不可 | `monthly_subtotal × working_months`。 |
| D-017 | 計上売上 | recognized_revenue | 数値(15,0) | 自動 | 変更不可 | `accounting_entries` から当該受注明細の累計計上額を集計した値。 |
| D-018 | 状況 | assign_status | ENUM(アサイン中/アサイン終了) | 自動／手動 | 一部編集可 | 終了日と今日の日付を元に自動更新。必要に応じて手動上書き可【要確認】。 |
| D-019 | 削除フラグ | is_deleted | bool | 自動 | UIでは削除不可 | 変更モードでは論理削除禁止。 |

#### 明細操作ルール

- 新規モード：
  - 「＋」ボタンで明細追加。
  - 任意の明細を削除可（行削除ボタン）。物理削除。
- 変更モード：
  - 既存明細の物理削除不可。
  - 期間・稼働率・単価・数量・値引額等の変更はビジネスルール（5章）に従う。
- 共通：
  - ヘッダ保存時にヘッダおよび明細を一括保存。
  - 保存前にクライアントサイド・サーバサイドでバリデーション実施。

### 4.1.5 計上状況タブ

- レイアウト：
  - 行：メンバー
  - 列：契約期間の各月（YYYY/MM）
  - セル：当該月の計上売上金額（合計）
- 入力可否：照会のみ（read-only）。
- 表示値の定義：
  - 特定案件・特定メンバー・特定月で `accounting_entries` に登録された明細金額（Dr/Cr のうち売上行）を集計した合計値。
- 集計キー：
  - `order_id`, `item_no`, `posting_month`, `member_id` を基本キーとする。

---

## 4.2 S-004：売上計上画面

### 4.2.1 概要

- 使用者：主に経理 or PJオーナー
- 機能：
  1. 計上期間（単月）を指定
  2. 指定期間に対して会計伝票未作成の受注明細を検索
  3. チェックされた明細について、会計伝票（借方・貸方2行）を自動生成

### 4.2.2 項目定義

- 検索条件
  - 計上年月（必須）：`YYYY-MM`
  - セクター（任意）
  - クライアント（任意）
  - 案件No（任意）

- 結果一覧（計上候補）

| 項目 | 説明 |
|------|------|
| 案件No | `project_orders.order_id` |
| 案件名称 | `project_orders.project_name` |
| メンバー名 | `member_id` → 表示名 |
| 稼働期間(月) | `project_order_items.working_months` |
| 当月計上予定金額 | 月割ロジックで計算（4.2.3／11.3 参照） |
| 既計上金額 | 当該受注明細の当月分 `accounting_entries` 集計値 |
| 残計上可能金額 | 概算売上 − 累計計上額 |
| チェックボックス | 計上対象の選択 |

### 4.2.3 会計伝票生成ルール（`accounting_entries`）

- 1受注明細 × 1計上月あたり 2 行（Dr/Cr）を `accounting_entries` に作成する。

| 項目 | 物理名 | 値 |
|------|--------|----|
| 会計明細ID | accounting_entry_id | UUID などで採番（内部キー） |
| 会計伝票No | accounting_document_no | 連番で自動採番 |
| 会計明細No | accounting_line_no | 伝票内連番 |
| 案件番号 | order_id | `project_orders.order_id` |
| 明細No | item_no | `project_order_items.item_no` |
| クライアント | client_id | `project_orders.client_id` |
| エンドクライアント | end_client_id | `project_orders.end_client_id` |
| 案件名称 | project_name | `project_orders.project_name` |
| セクター | sector_id | `project_orders.sector_id` |
| メンバーID | member_id | `project_order_items.member_id` |
| 貸借フラグ | dr_cr_flag | 借方行：`Dr`、貸方行：`Cr` |
| 勘定コード | account_code | 借方：売掛金、貸方：売上（マスタ参照） |
| 金額 | amount | 当月計上金額（Dr/Crとも同額） |
| 通貨 | currency | `JPY` 固定 |
| 計上年月 | posting_month | 検索条件で指定した年月（`YYYY-MM`） |
| 登録日時 | created_at | システム自動 |
| 登録者 | created_by | ユーザーID |
| 最終更新日時 | updated_at | システム自動 |
| 最終更新者 | updated_by | ユーザーID |

- 当月計上予定金額の算出【案】：
  - `project_order_items.estimated_revenue` を `working_months` で割った値を基準とし、既計上額との整合性をとるよう調整【詳細ロジックは要検討・11.3にて確定】。
- 売上計上後の更新：
  - 当該 `project_order_items` の `recognized_revenue` を、累計計上額に一致するよう更新する。

---

## 4.3 S-005：案件ダッシュボード画面

### 4.3.1 概要

- 案件別の
  - 受注金額（`project_orders.order_amount_total`）
  - 売上実績
  - 数値目標（今後追加予定）
  の推移を折れ線／棒グラフで表示する。

- 売上実績の主なデータソース：
  - 会計観点：`accounting_entries` の `posting_month` ごとの集計
  - 稼働・工数観点：`project_actuals_item` の金額・工数  
  ※グラフ上で「会計ベース／実績ベース」を切替可能にする【要確認】。

### 4.3.2 表示仕様

- 縦軸：金額（JPY）
- 横軸：年月（YYYY/MM）
- データ系列例：
  - 受注金額累計
  - 売上実績累計（会計ベース）
  - 実績金額累計（稼働ベース）【オプション】
  - 目標売上（目標伝票が実装された場合）【将来拡張】
- ホバー時：
  - 当月の各系列の数値をツールチップ表示。

---

## 4.4 S-006：アサイン状況マトリクス画面

### 4.4.1 概要

- 行：メンバー（`members` マスタ）
- 列：期間（検索条件で指定した開始月から n ヶ月分）
- セル：
  - 予定稼働率：`project_plans_item.planned_utilization_rate`
  - 確定稼働率：`project_order_items.utilization_rate` を基に月次換算した値
  - 実績稼働率（オプション）：`project_actuals_item.utilization_rate`【要確認】

- 画面上の表示モード：
  - デフォルト：**予定＋確定モード**
  - オプション：**実績モード**（過去期間の実績稼働率を別タブまたはトグルで表示）【要確認】

- 上部で3ブロック表示：
  - アベイラブル
  - アサイン予定
  - アサイン確定

### 4.4.2 表示ロジック（予定＋確定モード）

1. 各メンバーについて、指定期間内の以下のデータを取得：
   - 予定：`project_plans_item`（plan_status に応じてフィルタ可【要確認】）
   - 確定：`project_order_items`
2. 1ヶ月単位に稼働率（%）を集計（同一メンバー・同一月の複数案件があれば合算）：
   - 予定稼働率合計 = 同月の `planned_utilization_rate` の合計（案件ごと）
   - 確定稼働率合計 = `project_order_items` から、対象月に属する期間を按分して求めた稼働率合計【按分ロジック要確認】
3. 結果：
   - 合計稼働率 = 予定＋確定
   - 合計が 0% → アベイラブル
   - 0% ＜ 合計 ＜ 100% → アサイン予定
   - 合計 ≧ 100% 近辺 → アサイン確定（フルアサイン）
4. セルホバー時：
   - 当該メンバー・月に紐づく案件ごとの稼働率内訳（案件名・予定/確定区分・稼働率）をポップアップ表示。

### 4.4.3 表示ロジック（実績モード）【オプション】

- データソース：`project_actuals_item`
- 集計単位：
  - `work_month`（YYYY-MM）ごとに、`utilization_rate` または `work_hours` から稼働率を算出。
- 用途：
  - 過去の稼働実績を振り返り、計画との差異を確認する。

---

# 5. ビジネスルール・バリデーション仕様

## 5.1 共通入力チェック

- 日付形式：`YYYY/MM/DD` 以外はエラー。
- 必須項目：
  - ヘッダ・明細の「必須」フラグが ON の項目が null／空文字の場合はエラー。
- 案件期間：`contract_start_date <= contract_end_date`
- アサイン期間：`assign_start_date <= assign_end_date`
- 稼働率：0〜100 の数値（小数第2位まで）。
- 金額系：負数は禁止。0 は許容。

## 5.2 排他制御

- 受注伝票表示開始時、対象 `project_orders` レコードへ排他ロックを取得。
- 他セッションから同一案件の変更モードを要求した場合：
  - 「他ユーザーが編集中です」とエラーメッセージを返却し、照会モードのみ許可。
- Webセッションタイムアウト、または明示的な「キャンセル」「閉じる」操作時にロック解除。

## 5.3 自動計算

- 以下の項目はサーバ側で再計算し、画面とDBを同期する：
  - `project_order_items.monthly_subtotal`
  - `project_order_items.working_months`（11.3 のルールに基づく）
  - `project_order_items.estimated_revenue`
  - `project_orders.net_amount`
  - `project_orders.avg_monthly_amount`
- 売上計上処理後：
  - `accounting_entries` に明細を登録。
  - 当該 `project_order_items.recognized_revenue` を会計明細の累計金額に更新。

## 5.4 状況更新（アサイン状況）

- 明細の「状況（assign_status）」は、以下条件で自動更新【案】：
  - `assign_end_date < 今日` → アサイン終了
  - それ以外 → アサイン中
- 必要に応じて、ユーザーが専用ボタンからステータスを手動変更できるようにする【要確認】。

---

# 6. データモデル（テーブル定義概要）

## 6.1 主テーブル

本節では、案件ヘッダ・明細、予定・実績、会計明細、ダッシュボード、マスタ系テーブルを統合した最終版データモデルを定義する。  
実績テーブル・予定テーブルを分離したうえで、既存テーブルとの整合をとった構成としている。

---

### 6.1.1 `project_orders`（案件ヘッダ）

**目的**

- 受注案件を「案件単位」で管理するヘッダテーブル。
- 案件の基本情報（クライアント・期間・受注金額・PJ状況・ネクストアクション等）を保持。
- 明細（`project_order_items`）、予定（`project_plans_*`）、実績（`project_actuals_*`）、会計明細（`accounting_entries`）の親となる。

**主なカラム**

- `order_id` PK … 案件ID（自動採番。例：`PJ2025-0001`）
- `project_name` … 案件名称
- `client_id` … クライアント
- `end_client_id` … エンドクライアント
- `tier` … 案件Tier（Tier1/2/3）
- `sector_id` … セクター
- `owner_user_id` … PJオーナー（案件責任者）
- `contract_start_date` … 契約開始日
- `contract_end_date` … 契約終了日
- `order_amount_total` … 受注金額（案件全体）
- `pj_status_summary` … PJ状況（フリーテキスト）
- `next_action` … ネクストアクション（フリーテキスト）
- `contract_type` … 契約形態（請負、準委任など）
- `source_document` … 参照元（引合伝票など）
- `memo` … メモ
- `net_amount` … 概算売上合計 − 値引き等（project_order_items の集計結果）
- `avg_monthly_amount` … 正味額 / 契約月数
- `created_at`, `created_by`, `updated_at`, `updated_by` … 監査項目

---

### 6.1.2 `project_order_items`（案件明細）

**目的**

- 案件ヘッダ（`project_orders`）に対する「メンバー単位のアサイン情報（受注明細）」を管理。
- 予定・実績テーブルとは別に、「契約上の想定値／初期見積り（概算売上）」を持つ。
- 会計明細（`accounting_entries`）および実績テーブルの集計元（論理的な親）となる。

**主なカラム**

- `order_id` FK … `project_orders.order_id`
- `item_no` PK(複合) … 明細No
- `member_id` … メンバID
- `member_class` … メンバクラス（A/C/SC/AM/M/SM 等）
- `quantity` … 数量（通常 1.0）
- `assign_start_date` … アサイン開始日
- `assign_end_date` … アサイン終了日
- `utilization_rate` … 稼働率(%)
- `unit_price` … 単価（1人月等）
- `currency` … 通貨（当面 `JPY`）
- `discount_amount` … 値引額
- `discount_currency` … 値引通貨（`JPY`）
- `charge_rate` … チャージ率（実売単価 ÷ 社内標準売価 × 100）
- `monthly_subtotal` … 単月小計（計算値）
- `working_months` … 稼働期間(月)（計算値）
- `estimated_revenue` … 概算売上（予定ベース）
- `recognized_revenue` … 計上済売上（会計明細からの集計値）
- `assign_status` … アサイン状況（アサイン中/終了 等）
- `is_deleted` … 論理削除フラグ
- `created_at`, `created_by`, `updated_at`, `updated_by` … 監査項目

---

### 6.1.3 `project_actuals_header`（実績ヘッダ）

**目的**

- 「案件 × 実績集計単位（例：月次、フェーズ）」ごとの実績をヘッダとして管理。
- 配下の実績明細（`project_actuals_item`）の金額・工数の合計を保持し、ダッシュボードや案件状況グラフの元データとする。

**主な関係**

- `project_orders.order_id` 1 : N `project_actuals_header.order_id`

**カラム定義（抜粋）**

| No | 項目名 (物理)          | 項目名 (論理)   | 型              | NOT NULL | キー | 説明 |
|----|------------------------|-----------------|-----------------|----------|-----|------|
| 1  | `actual_id`            | 実績ID          | VARCHAR(30)     | YES      | PK  | `ACT-YYYY-XXXXX` 等で採番。 |
| 2  | `order_id`             | 案件ID          | VARCHAR(20)     | YES      | FK  | `project_orders.order_id`。 |
| 3  | `actual_type`          | 実績種別        | VARCHAR(20)     | YES      |     | `MONTHLY`（月次）、`PHASE`（フェーズ別）など。 |
| 4  | `actual_period_from`   | 実績開始期間    | DATE            | YES      |     | この実績ヘッダがカバーする期間の開始日。 |
| 5  | `actual_period_to`     | 実績終了期間    | DATE            | YES      |     | この実績ヘッダがカバーする期間の終了日。 |
| 6  | `total_actual_amount`  | 合計実績金額    | NUMERIC(15,0)   | YES      |     | 配下明細行の金額合計。 |
| 7  | `total_actual_hours`   | 合計実績工数    | NUMERIC(9,2)    | NO       |     | 任意。 |
| 8  | `status`               | 実績ステータス  | VARCHAR(20)     | YES      |     | `DRAFT` / `CONFIRMED` / `CLOSED` 等。 |
| 9  | `memo`                 | メモ            | VARCHAR(2000)   | NO       |     | 実績全体メモ。 |
| 10 | `created_at`           | 登録日時        | DATETIME        | YES      |     | システム自動。 |
| 11 | `created_by`           | 登録者          | VARCHAR(50)     | YES      |     | ユーザーID。 |
| 12 | `updated_at`           | 最終更新日時    | DATETIME        | YES      |     | システム自動。 |
| 13 | `updated_by`           | 最終更新者      | VARCHAR(50)     | YES      |     | ユーザーID。 |

---

### 6.1.4 `project_actuals_item`（実績明細）

**目的**

- 「案件 × 実績ヘッダ × メンバ × 期間（または日付）」単位の実績を管理。
- アサイン状況マトリクスの「実績」側、および案件別売上実績グラフ（実績ベース）の元データとなる。

**主な関係**

- `project_actuals_header.actual_id` 1 : N `project_actuals_item(actual_id, item_no)`
- `project_orders.order_id` 1 : N `project_actuals_item.order_id`（冗長保持）

**カラム定義（抜粋）**

| No | 項目名 (物理)        | 項目名 (論理) | 型            | NOT NULL | キー     | 説明 |
|----|----------------------|---------------|---------------|----------|---------|------|
| 1  | `actual_id`          | 実績ID        | VARCHAR(30)   | YES      | PK(FK)  | ヘッダへの外部キー。 |
| 2  | `item_no`            | 明細番号      | INT           | YES      | PK      | 実績ID内での連番。 |
| 3  | `order_id`           | 案件ID        | VARCHAR(20)   | YES      | FK(論理)| 検索性能向上のため冗長保持。 |
| 4  | `member_id`          | メンバID      | VARCHAR(20)   | YES      |         | 対象メンバ。 |
| 5  | `member_class`       | メンバクラス  | VARCHAR(10)   | NO       |         | A/C/SC/AM/M/SM 等。 |
| 6  | `work_date`          | 実績日        | DATE          | NO       |         | 日次管理が必要な場合に使用。 |
| 7  | `work_month`         | 実績月        | CHAR(7)       | YES      |         | `YYYY-MM`。集計キー。 |
| 8  | `work_hours`         | 実績工数      | NUMERIC(9,2)  | NO       |         | 時間または人日。 |
| 9  | `utilization_rate`   | 稼働率(%)     | NUMERIC(5,2)  | NO       |         | 該当期間におけるこの案件への稼働率。 |
| 10 | `unit_price`         | 単価          | NUMERIC(15,0) | YES      |         | メンバの請求単価。 |
| 11 | `amount`             | 実績金額      | NUMERIC(15,0) | YES      |         | `work_hours × unit_price` 等。 |
| 12 | `currency`           | 通貨          | CHAR(3)       | YES      |         | 当面 `JPY`。 |
| 13 | `activity_type`      | 作業種別      | VARCHAR(30)   | NO       |         | コンサル、PM、移動 等。 |
| 14 | `note`               | 備考          | VARCHAR(1000) | NO       |         | 明細単位のメモ。 |
| 15 | `created_at`         | 登録日時      | DATETIME      | YES      |         | システム自動。 |
| 16 | `created_by`         | 登録者        | VARCHAR(50)   | YES      |         | ユーザーID。 |
| 17 | `updated_at`         | 最終更新日時  | DATETIME      | YES      |         | システム自動。 |
| 18 | `updated_by`         | 最終更新者    | VARCHAR(50)   | YES      |         | ユーザーID。 |

---

### 6.1.5 `project_plans_header`（予定ヘッダ）

**目的**

- 「案件 × 予定集計単位（例：月次、フェーズ）」ごとの予定値を管理。
- パイプライン管理（受注見込み、確度調整済み売上見込み）の単位となる。

**主な関係**

- `project_orders.order_id` 1 : N `project_plans_header.order_id`

**カラム定義（抜粋）**

| No | 項目名 (物理)         | 項目名 (論理)   | 型              | NOT NULL | キー | 説明 |
|----|-----------------------|-----------------|-----------------|----------|-----|------|
| 1  | `plan_id`             | 予定ID          | VARCHAR(30)     | YES      | PK  | `PLAN-YYYY-XXXXX` 等で採番。 |
| 2  | `order_id`            | 案件ID          | VARCHAR(20)     | YES      | FK  | `project_orders.order_id`。 |
| 3  | `plan_type`           | 予定種別        | VARCHAR(20)     | YES      |     | `MONTHLY` / `PHASE` 等。 |
| 4  | `plan_period_from`    | 予定開始期間    | DATE            | YES      |     | この予定がカバーする期間の開始日。 |
| 5  | `plan_period_to`      | 予定終了期間    | DATE            | YES      |     | この予定がカバーする期間の終了日。 |
| 6  | `total_plan_amount`   | 合計予定金額    | NUMERIC(15,0)   | YES      |     | 明細行の予定金額合計。 |
| 7  | `total_plan_hours`    | 合計予定工数    | NUMERIC(9,2)    | NO       |     | 人日／時間など。 |
| 8  | `probability`         | 受注確度(%)     | NUMERIC(5,2)    | NO       |     | 例：80.00。受注後は 100。 |
| 9  | `status`              | 予定ステータス  | VARCHAR(20)     | YES      |     | `PLANNED` / `APPROVED` / `CANCELLED` / `WON` 等。 |
| 10 | `memo`                | メモ            | VARCHAR(2000)   | NO       |     | 予定全体に関するメモ。 |
| 11 | `created_at`          | 登録日時        | DATETIME        | YES      |     | システム自動。 |
| 12 | `created_by`          | 登録者          | VARCHAR(50)     | YES      |     | ユーザーID。 |
| 13 | `updated_at`          | 最終更新日時    | DATETIME        | YES      |     | システム自動。 |
| 14 | `updated_by`          | 最終更新者      | VARCHAR(50)     | YES      |     | ユーザーID。 |

---

### 6.1.6 `project_plans_item`（予定明細）

**目的**

- 「案件 × 予定ヘッダ × メンバ × 月」単位の予定値を管理。
- アサイン状況マトリクスの「予定」側、パイプラインのメンバ別ブレークダウンの元データとなる。

**主な関係**

- `project_plans_header.plan_id` 1 : N `project_plans_item(plan_id, item_no)`
- `project_orders.order_id` 1 : N `project_plans_item.order_id`（冗長保持）

**カラム定義（抜粋）**

| No | 項目名 (物理)               | 項目名 (論理)         | 型              | NOT NULL | キー     | 説明 |
|----|-----------------------------|-----------------------|-----------------|----------|---------|------|
| 1  | `plan_id`                   | 予定ID                | VARCHAR(30)     | YES      | PK(FK)  | ヘッダへの外部キー。 |
| 2  | `item_no`                   | 明細番号              | INT             | YES      | PK      | 予定ID内での連番。 |
| 3  | `order_id`                  | 案件ID                | VARCHAR(20)     | YES      | FK(論理)| `project_orders.order_id`。 |
| 4  | `member_id`                 | メンバID              | VARCHAR(20)     | YES      |         | 対象メンバ。 |
| 5  | `member_class`              | メンバクラス          | VARCHAR(10)     | NO       |         | A/C/SC/AM/M/SM 等。 |
| 6  | `plan_start_date`           | 予定開始日            | DATE            | NO       |         | メンバアサイン予定開始日。 |
| 7  | `plan_end_date`             | 予定終了日            | DATE            | NO       |         | メンバアサイン予定終了日。 |
| 8  | `plan_month`                | 予定月                | CHAR(7)         | YES      |         | `YYYY-MM`。マトリクスの列キー。 |
| 9  | `planned_hours`             | 予定工数              | NUMERIC(9,2)    | NO       |         | 予定工数（人日／時間）。 |
| 10 | `planned_utilization_rate`  | 予定稼働率(%)         | NUMERIC(5,2)    | NO       |         | その月のこの案件に対する予定稼働率。 |
| 11 | `planned_unit_price`        | 予定単価              | NUMERIC(15,0)   | YES      |         | メンバの予定単価。 |
| 12 | `planned_amount`            | 予定金額              | NUMERIC(15,0)   | YES      |         | `planned_hours × planned_unit_price` 等。 |
| 13 | `currency`                  | 通貨                  | CHAR(3)         | YES      |         | 当面 `JPY`。 |
| 14 | `activity_type`             | 作業種別              | VARCHAR(30)     | NO       |         | コンサル、PM、移動 等。 |
| 15 | `plan_status`               | 予定明細ステータス    | VARCHAR(20)     | NO       |         | `TENTATIVE` / `FIXED` / `CANCELLED` 等。 |
| 16 | `note`                      | 備考                  | VARCHAR(1000)   | NO       |         | 明細単位メモ。 |
| 17 | `created_at`                | 登録日時              | DATETIME        | YES      |         | システム自動。 |
| 18 | `created_by`                | 登録者                | VARCHAR(50)     | YES      |         | ユーザーID。 |
| 19 | `updated_at`                | 最終更新日時          | DATETIME        | YES      |         | システム自動。 |
| 20 | `updated_by`                | 最終更新者            | VARCHAR(50)     | YES      |         | ユーザーID。 |

---

### 6.1.7 `accounting_entries`（会計明細）

**目的**

- 会計上の正式な売上計上伝票を管理。
- 受注明細（`project_order_items`）および実績明細（`project_actuals_item`）と論理的に結びつき、
  「案件別／メンバ別の売上実績」「会計上の残高」との整合をとる。

**主なカラム**

- `accounting_entry_id` PK … 会計明細ID（内部キー）
- `accounting_document_no` … 会計伝票No（自動採番）
- `accounting_line_no` … 会計明細No（自動採番）
- `order_id` … 案件ID（受注伝票から）
- `item_no` … 受注明細No
- `client_id` … クライアント
- `end_client_id` … エンドクライアント
- `project_name` … 案件名称
- `sector_id` … セクター
- `member_id` … メンバーID
- `dr_cr_flag` … 貸借フラグ（`Dr` / `Cr`）
- `account_code` … 勘定コード（マスタ）
- `amount` … 金額
- `currency` … 通貨（`JPY`）
- `posting_month` … 計上年月（`YYYY-MM`）
- `created_at`, `created_by`, `updated_at`, `updated_by`

※必要に応じて `actual_id` / `actual_item_no` を保持し、`project_actuals_item` とのトレーサビリティを確保してもよい【要確認】。

---

### 6.1.8 マスタテーブル群

**目的**

- 案件・明細・実績・予定・会計明細等で参照する共通マスタを管理する。

**テーブル**

- `clients` … クライアントマスタ
- `end_clients` … エンドクライアントマスタ
- `sectors` … セクターマスタ
- `members` … メンバマスタ
- `member_classes` … メンバクラス（A/C/SC/AM/M/SM 等）
- `account_codes` … 勘定コードマスタ
- `users` … ユーザーマスタ（Azure ADユーザーのマッピング）

---

### 6.1.9 テーブル間の主な関係（サマリ）

- `project_orders (order_id)`
  - 1:N `project_order_items (order_id, item_no)`
  - 1:N `project_plans_header (order_id)` → 1:N `project_plans_item (plan_id, item_no)`
  - 1:N `project_actuals_header (order_id)` → 1:N `project_actuals_item (actual_id, item_no)`
- `project_order_items (order_id, item_no)`
  - 1:N `accounting_entries (order_id, item_no, ...)`
- `project_plans_item` / `project_actuals_item`
  - 双方が `order_id`, `member_id`, `plan_month` / `work_month` を共通キーとして持つことで、「案件 × メンバ × 月」単位の予定 vs 実績の比較・差分分析が可能。

---

# 7. API仕様（バックエンド：Python／REST想定）

## 7.1 認証

- Azure AD（Microsoftアカウント）での OAuth2／OIDC。
- フロントエンド（Next.js）は取得したアクセストークン・IDトークンを HTTP ヘッダに付与して API を呼び出す。

## 7.2 代表エンドポイント一覧

| API | メソッド | 概要 |
|-----|----------|------|
| `/api/orders` | GET | 案件一覧検索 |
| `/api/orders/{order_id}` | GET | 案件詳細取得（ヘッダ＋明細＋関連情報） |
| `/api/orders` | POST | 案件新規登録 |
| `/api/orders/{order_id}` | PUT | 案件更新 |
| `/api/orders/{order_id}/lock` | POST | 排他ロック取得 |
| `/api/orders/{order_id}/unlock` | POST | 排他ロック解除 |
| `/api/revenue/candidates` | GET | 売上計上候補一覧取得 |
| `/api/revenue/book` | POST | 売上計上実行（`accounting_entries` 生成） |
| `/api/dashboard/summary` | GET | ダッシュボードサマリー取得 |
| `/api/dashboard/summary/full` | GET | セクター別サマリー含むフルダッシュボード取得 |
| `/api/dashboard/revenue-trend` | GET | 売上推移データ取得 |
| `/api/dashboard/assignments` | GET | アサイン状況マトリクス取得 |
| `/api/orders/{order_id}/copy` | POST | 参照登録（案件コピー） |
| `/api/sales-targets/*` | GET/POST/PUT | 売上目標管理 |
| `/api/orders/{order_id}/comments` | GET/POST | 案件コメント管理 |
| `/api/masters/*` | GET/POST/PUT/DELETE | 各種マスタ管理 |

※ 実績・予定データの登録方法（APIかバッチか）は別途仕様化する【要確認】。

## 7.3 例：案件詳細取得 API

- `GET /api/orders/{order_id}`  
- レスポンス（抜粋）：

```json
{
  "header": {
    "order_id": "PJ2025-0001",
    "project_name": "案件X",
    "client_id": "C001",
    "client_name": "日立製作所",
    "tier": "Tier1",
    "sector_id": "SCM",
    "owner_user_id": "U123",
    "contract_start_date": "2025-04-01",
    "contract_end_date": "2025-11-30",
    "order_amount_total": 20000000,
    "pj_status_summary": "10月中旬にステアコ予定。",
    "next_action": "ステアコ準備を日立メンバーと実施"
  },
  "items": [
    {
      "item_no": 10,
      "member_id": "M001",
      "member_name": "山田太郎",
      "member_class": "M",
      "quantity": 1,
      "assign_start_date": "2025-04-01",
      "assign_end_date": "2025-11-30",
      "utilization_rate": 100,
      "unit_price": 2600000,
      "discount_amount": 0,
      "monthly_subtotal": 2600000,
      "working_months": 3.5,
      "estimated_revenue": 9100000,
      "recognized_revenue": 6000000
    }
  ]
}
```

# 8. 非機能要件詳細

## 8.1 技術スタック

- フロントエンド
  - フレームワーク：Next.js（React + TypeScript）
  - UI：
    - SPA/SSR 構成（案件検索・ダッシュボードなどは SPA 的に遷移）
    - デザインコンポーネントは社内標準 UI ライブラリ【要確認】
  - 認証：
    - Azure AD（Entra ID）との OIDC 連携
    - 取得したアクセストークン・IDトークンを API 呼び出し時に付与

- バックエンド
  - 言語：Python
  - フレームワーク：FastAPI
  - 構成：
    - REST API サーバとして `/api/*` を提供（7章参照）
    - OpenAPI Schema から型定義をフロント側（TypeScript）に連携【要確認】

- データベース
  - Azure SQL Database
  - 主なスキーマ：
    - `project_orders`, `project_order_items`
    - `project_plans_header`, `project_plans_item`
    - `project_actuals_header`, `project_actuals_item`
    - `accounting_entries`
    - `audit_logs`
    - `sales_targets_sector`, `sales_targets_company`
    - 各種マスタ (`clients`, `members`, `sectors`, `users` など)

- インフラ構成（案）
  - アプリケーション：
    - Azure App Service（Web App for Containers または Linux App Service）
      - Next.js フロント / FastAPI バックエンドを別 App として構成【推奨】
    - またはバックエンドのみ Azure Functions（HTTP Trigger）で提供【要確認】
  - 認証／ID 管理：
    - Azure AD（Entra ID）
  - 監視：
    - Azure Monitor / Application Insights によるアクセスログ・メトリクス取得

## 8.2 性能・スケーラビリティ

- 想定規模
  - 案件件数：数千〜数万件
  - 明細（メンバーアサイン）件数：案件数 × 数名〜十数名
  - 計上明細（`accounting_entries`）：月次数万行レベルまでを想定

- 応答時間目標（P95）
  - 検索系画面（案件検索、ダッシュボード表示）：
    - 3秒以内
  - 登録・更新系（受注伝票登録／更新、売上計上実行）：
    - 5秒以内
  - 重い集計（長期間・多案件を対象とするダッシュボード）は非同期化やページングで UX を担保【要確認】

- 性能対策
  - 主な検索条件（案件No、クライアント、セクタ、期間）に対するインデックス設計
  - `accounting_entries` の `posting_month`, `order_id`, `member_id` などに複合インデックスを付与
  - ダッシュボード用に、必要に応じて集計テーブルやマテリアライズドビューを検討【要確認】

## 8.3 セキュリティ

- 認証
  - Azure AD（Entra ID）による SSO を必須とする。
  - ID トークン／アクセストークンはクライアントからバックエンド API へ Bearer Token として付与。

- 認可（ロール・権限）
  - 代表ロール
    - 管理者：マスタ管理、権限管理、監査ログ閲覧
    - 経営陣／経営企画：
      - 全案件の照会
      - ダッシュボードの全社ビュー閲覧
    - セクター長／マネージャー：
      - 自セクターの案件の登録・更新
      - 自分が PJ オーナーの案件編集
    - 一般メンバー：
      - 自分がアサインされている案件の閲覧のみ
  - 実装方針
    - ロール情報は Azure AD グループまたはアプリロールで付与【要確認】
    - バックエンドでのロール判定により API レベルでアクセス制御

- 通信・ネットワーク
  - すべて HTTPS 通信を必須とする。
  - Azure 内部通信は VNet 統合／Private Endpoint による閉域化を検討【要確認】。

- データ保護
  - パスワード情報は当システムでは保持しない（認証は Azure AD に委譲）。
  - 高機微情報が追加される場合には、Azure SQL の Transparent Data Encryption 等を利用【要確認】。

## 8.4 ログ・監査

- アプリケーションログ
  - FastAPI 側でリクエスト／レスポンス（要約）をログ出力。
  - 例外発生時はスタックトレースとコンテキスト情報を Application Insights に送信。

- 監査ログ（DB テーブル）
  - 対象：更新系 API（受注伝票登録・更新、売上計上、マスタ更新 等）
  - 記録項目例：
    - ユーザーID（Azure AD の object ID 等）
    - 操作種別（CREATE / UPDATE / DELETE）
    - 対象テーブル名
    - 対象キー（例：`order_id`, `item_no` 等）
    - 変更前後差分（JSON 形式）
    - タイムスタンプ
  - 保持期間：
    - 本番環境における保持期間（例：7年など）は会計・監査要件に応じて別途定義【要確認】。

## 8.5 運用・保守（概要）

- バックアップ
  - Azure SQL Database の自動バックアップ機能を利用。
  - 復旧ポイント目標（RPO/RTO）は業務要件に応じて設定【要確認】。

- リリース・デプロイ
  - Git リポジトリ管理（main / develop / feature ブランチ）。
  - CI/CD（Azure DevOps または GitHub Actions）により、自動テスト通過後にステージング→本番へデプロイ。

---

# 9. テスト仕様（仕様駆動／受け入れ条件）

代表的なシナリオのみ記載。実装時には、ここを起点に詳細テストケース管理表に展開する。

## 9.1 UC-001：伝票登録

### シナリオ UC001-01：正常系 新規案件登録

- Given
  - ログイン済みのマネージャーが「受注伝票登録」画面を新規モードで開いている。
  - 必須ヘッダ項目（プロジェクト名、クライアント、Tier、セクタ、PJオーナー、契約開始日・終了日、受注金額、契約形態）が入力済み。
  - 明細1行以上が入力済みで、必須明細項目（メンバ、数量、期間、稼働率、単価）が入力済み。
- When
  - 「保存」ボタンをクリックする。
- Then
  - クライアントサイド・サーバサイドのバリデーションが全て OK となる。
  - `project_orders` に 1 レコードが登録される。
  - `project_order_items` に 明細行数 分のレコードが登録される。
  - `order_id` が新規採番され、画面ヘッダに表示される。
  - 画面モードが「照会」に切り替わる。

### シナリオ UC001-02：異常系 必須項目未入力

- Given
  - プロジェクト名が未入力の状態で、他の必須項目は入力済み。
- When
  - 「保存」ボタンをクリックする。
- Then
  - プロジェクト名必須エラーが表示される。
  - `project_orders` / `project_order_items` には登録処理が行われない。

### シナリオ UC001-03：異常系 期間不整合

- Given
  - 契約終了日 `<` 契約開始日 となる値が入力されている。
- When
  - 「保存」ボタンをクリックする。
- Then
  - 「契約終了日は契約開始日以降の日付を指定してください」等のエラーが表示される。
  - DB への登録は行われない。

## 9.2 UC-006：売上計上

### シナリオ UC006-01：正常系 当月分売上計上

- Given
  - 計上年月 = 2025/04 が画面上で選択されている。
  - 2025/04 に計上すべき受注明細が少なくとも1件存在し、当該月分の `accounting_entries` は未作成である。
- When
  - 「検索」ボタンを押下し、計上候補一覧を表示する。
  - 対象明細にチェックを入れ、「会計転記」ボタンを押下する。
- Then
  - チェックされた明細数 × 2 行（Dr/Cr）の `accounting_entries` が登録される。
  - それぞれの `posting_month` は 2025-04 となる。
  - 対象 `project_order_items` の `recognized_revenue` が、累計計上額に一致するよう更新される。
  - UI 上で「計上完了」メッセージが表示される。

### シナリオ UC006-02：異常系 計上済み明細の二重計上防止

- Given
  - 特定明細について、2025/04 分の `accounting_entries` が既に存在する。
- When
  - 同一条件で再度「検索」→「会計転記」を実行しようとする。
- Then
  - 当該明細は計上候補一覧に表示されない、またはチェック不可状態になる。
  - 二重計上用の `accounting_entries` は作成されない。

## 9.3 UC-008：アサイン状況表示

### シナリオ UC008-01：メンバーの予定・確定稼働率が正しく集計される

- Given
  - メンバーAが、ある月（2025/04）に対して
    - 案件X（受注）で確定稼働率 50%
    - 案件Y（予定）で予定稼働率 30%
    が登録されている。
- When
  - アサイン状況マトリクス画面で、対象期間に 2025/04 を含む期間を指定して表示する。
- Then
  - メンバーA・2025/04 のセルには
    - 確定 = 50%
    - 予定 = 30%
    と表示される。
  - 合計 80% として、ブロック分類は「アサイン予定」に含まれる。

## 9.4 その他代表テスト観点（一覧のみ）

- 認証・認可
  - 未ログイン状態での画面アクセスがログイン画面へリダイレクトされる。
  - 一般メンバーが他セクター案件の編集 API を呼び出そうとした場合に 403 が返る。

- 排他制御
  - ユーザーAが案件を編集モードで開いている状態で、ユーザーBが同案件を編集モードで開こうとした場合に排他エラーとなる。

- パフォーマンス
  - 案件数が想定最大件数（例：3万件）登録された状態での検索レスポンスが 3 秒以内（P95）であること。

---

# 10. 用語集

| 用語 | 説明 |
|------|------|
| 受注伝票 | 案件ヘッダ（`project_orders`）と明細（`project_order_items`）を合わせた概念。SAP の受注伝票に相当。 |
| 明細 | 受注伝票に紐づく、メンバー単位のアサイン情報行。 |
| 引合伝票 | 受注前の見込み案件情報。本システムでは主に `project_plans_*` による予定情報で表現する。 |
| 予定 | 将来の売上・稼働の見込み値。`project_plans_header` / `project_plans_item` に保持。 |
| 実績 | 実際の稼働・売上情報。`project_actuals_header` / `project_actuals_item` および `accounting_entries` に保持。 |
| 計上 | 会計上の売上認識処理。`accounting_entries` に Dr/Cr の会計明細として登録すること。 |
| アサイン予定 | 引合・計画段階のメンバーアサイン。主に `project_plans_item` による管理。 |
| アサイン確定 | 受注後、契約に基づき確定したメンバーアサイン。`project_order_items` により管理。 |
| チャージ率 | 社内標準売価に対する実際の売価の比率。`実売単価 ÷ 標準売価 × 100`（%）で表現。値引き度合いの管理指標。 |
| ダッシュボードサマリー | ホーム画面に表示される売上目標・受注額・売上の集計情報。全社およびセクター別のKPIを表示。 |

---

# 11. 決定事項管理（DEC: Decision）

実装前後で人間が明示的に決める／レビューすべきポイントを整理する。
各決定事項には DEC-XXX の識別子を付与し、ステータスを明示する。

---

## 11.1 フロントエンドフレームワーク

- **ステータス**: **決定済み**
- **方針**: Next.js（React + TypeScript）
- **補足**: 社内既存 XML ベース UI との共存／移行方針は別途整理【要確認】。

---

## 11.2 バックエンドフレームワークと認証方式（DEC-003）

- **DEC ID**: DEC-003
- **ステータス**: **決定済み**
- **方針**:
  - フレームワーク: **FastAPI**
  - 認証方式: **FastAPI ミドルウェアで実装**（API Gateway ではない）
- **詳細**:
  - Azure AD（Entra ID）との OIDC 連携
  - IDトークン／アクセストークンはクライアントから Bearer Token として付与

---

## 11.3 稼働月数算出ルール（DEC-001）

- **DEC ID**: DEC-001
- **ステータス**: **決定済み**

### 基本計算式

```
working_months = (end_date - start_date + 1 day) / 30
```

### 端数処理

- 小数第3位で四捨五入（Python Decimal: `ROUND_HALF_UP`, `quantize(Decimal("0.01"))`）
- 例: 3.034 → 3.03, 3.035 → 3.04

### 日付の扱い

- 開始日・終了日はローカル日付（タイムゾーンなし）
- 両端を含む（inclusive）
- 開始日 > 終了日 の場合はバリデーションエラー

### 制約

- 最小値: 0.01（0日/同日でほぼ0となるケースを防止）
- 単一連続期間のみ対象（複数期間分割は将来仕様で拡張）

### うるう年・月末の扱い

- 暦日差分ベースのため、28/29/30/31日をそのまま包含
- 特別な補正ロジックは適用しない

### 計算例

| 期間 | 日数 | 稼働月数 |
|------|------|----------|
| 2025/04/01 – 2025/06/30 | 91日 | 3.03ヶ月 |
| 2025/04/01 – 2025/11/30 | 244日 | 8.13ヶ月 |
| 2025/05/31 – 2025/06/30 | 31日 | 1.03ヶ月 |
| 2025/05/01 – 2025/05/01 | 1日 | 0.03ヶ月 |

### 実装箇所

- `backend/services/order_service.py` の `calculate_working_months()` メソッド

---

## 11.4 通貨・多通貨対応

- **ステータス**: **決定済み（初期リリース）／多通貨対応は将来検討**
- **方針**: 当面は **JPY のみ** をサポートし、通貨カラムには `JPY` を固定格納
- **補足**: 将来の多通貨対応時は、`currency` カラムの活用および為替レートテーブルを追加

---

## 11.5 チャージ率と社内標準売価（DEC-002）

- **DEC ID**: DEC-002
- **ステータス**: **決定済み**

### チャージ率の定義

```
チャージ率(%) = 実売単価 ÷ 社内標準売価 × 100
```

- 例: 標準 300 万円、実売 270 万円 → チャージ率 90%
- 値引率 = 100 - チャージ率

### 社内標準売価マスタ（member_classes テーブル）

| class_code | メンバークラス | 標準売価（万円/月） | 標準売価（円/月） |
|------------|---------------|---------------------|-------------------|
| SM | シニアマネージャー | 400 | 4,000,000 |
| ASM | アソシエイトシニアマネージャー | 350 | 3,500,000 |
| M | マネージャー | 300 | 3,000,000 |
| AM | アソシエイトマネージャー | 260 | 2,600,000 |
| SC | シニアコンサルタント | 220 | 2,200,000 |
| C | コンサルタント | 165 | 1,650,000 |
| A | アナリスト | 165 | 1,650,000 |

### UX仕様

- メンバー選択時、`member_classes.standard_unit_price` から単価フィールドに初期値を自動入力
- ユーザーは単価を手動で修正可能
- 修正後の単価と標準売価からチャージ率を自動計算・表示

### 利用イメージ

- 90% 未満の案件を「値引き案件」としてダッシュボードで抽出
- セクター・クライアント別のチャージ率分布を可視化し、価格戦略の検討材料とする

---

## 11.6 予定／実績データの登録方法（DEC-004）

- **DEC ID**: DEC-004
- **ステータス**: **決定済み**
- **方針**: 予定・実績データは **UI から登録** する（バッチ連携・外部システム連携ではない）
- **実装時期**: Phase 3 で `project_plans_header/item`, `project_actuals_header/item` の UI を実装

---

## 11.7 会計計上済み明細の変更ポリシー（DEC-005）

- **DEC ID**: DEC-005
- **ステータス**: **Phase 2 で決定予定**
- **検討事項**:
  - `accounting_entries` が存在する受注明細について:
    - 単価・数量・期間の変更を禁止するか
    - または変更を許容し、差額分を調整伝票として新たに `accounting_entries` に起こすか
  - UI 上の制御（変更不可項目として表示するか、警告を出すか 等）
- **参照**: spec.md §4.2.3, §5.3

