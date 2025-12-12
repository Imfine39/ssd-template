---
description: Clarify ambiguous requirements with the user.
handoffs:
  - label: Continue to Plan
    agent: speckit.plan
    prompt: Create a plan for the spec
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Spec（Vision、Domain、または Feature）の曖昧な点を特定し、人間に **1問ずつ** 質問して解消する。
回答を受け取るたびに即座に Spec に反映し、曖昧点がなくなるまでループを継続する。

**Important**: This clarification workflow is expected to run (and be completed) BEFORE invoking `/speckit.plan`. If the user explicitly states they are skipping clarification (e.g., exploratory spike), you may proceed, but must warn that downstream rework risk increases.

## When to Use

- `/speckit.vision` 後の Vision Spec 精密化
- `/speckit.design` 後の Domain Spec 精密化
- `/speckit.add`, `/speckit.fix`, `/speckit.issue` での Feature Spec 作成後
- Spec に `[NEEDS CLARIFICATION]` が残っている場合
- 人間から「clarify して」と指示された場合

---

## Steps

### Step 1: Identify Target Spec

1. `$ARGUMENTS` で Spec ID または種類（vision/domain/feature）が指定されていればそれを使用
2. なければ現在のブランチ名から推測:
   - `spec/*-vision` → Vision spec
   - `spec/*-domain` または `spec/*-overview` → Domain spec
   - `feature/*`, `fix/*` → 対応する Feature spec
3. それでも特定できなければ、`.specify/specs/` を確認して質問

4. Spec ファイルを読み込む。存在しなければ:
   - Vision: `/speckit.vision` を先に実行するよう指示
   - Domain: `/speckit.design` を先に実行するよう指示
   - Feature: `/speckit.issue` または `/speckit.add` を先に実行するよう指示

5. Spec Type（Vision, Domain, or Feature）を判定し、対応するタクソノミーを選択

---

### Step 2: Structured Ambiguity Scan

Spec の内容を読み込み、以下のタクソノミーに基づいて各カテゴリのステータスを判定:
- **Clear**: 十分に定義されている
- **Partial**: 一部定義されているが不完全
- **Missing**: 定義されていない

#### Vision Spec タクソノミー

| Category | Check Items |
|----------|-------------|
| **System Purpose** | 解決する課題、ビジネス価値、成功指標の定義 |
| **Target Users** | プライマリ/セカンダリユーザー、ペルソナ、痛点 |
| **User Journeys** | 主要ワークフロー、エントリー/イグジットポイント、ハッピーパス |
| **Scope** | 必須 vs あると良い、明示的な除外事項、フェーズ境界 |
| **Constraints** | タイムライン、予算、技術制約、コンプライアンス |
| **Risks** | 主要な不確実性、外部依存、緩和策 |

#### Domain Spec タクソノミー

| Category | Check Items |
|----------|-------------|
| **Domain & Vocabulary** | ドメイン固有用語の定義、ビジネスコンテキスト |
| **Master Data (M-*)** | 主要エンティティ、フィールド、関係性、一意性制約 |
| **API Contracts (API-*)** | CRUD操作、命名規則、リクエスト/レスポンス形式、エラー形式 |
| **State & Lifecycle** | ステータス遷移、ライフサイクルルール |
| **Actors & Permissions** | アクター定義、権限レベル、認証方式 |
| **Business Rules** | 計算ロジック(CR-*)、バリデーション(VR-*)、制約(BR-*) |
| **Non-Functional** | パフォーマンス、セキュリティ、可用性、データ保持 |
| **Technology Decisions** | 技術スタック、外部依存、統合パターン |

#### Feature Spec タクソノミー

| Category | Check Items |
|----------|-------------|
| **Functional Scope** | ユーザーゴール、成功基準、スコープ外の明示 |
| **Domain Alignment** | M-*/API-*/BR-* 参照の妥当性、Domain に追加すべき要素 |
| **Domain & Data** | エンティティ、属性、関係、データ量想定 |
| **User Interaction** | ユーザージャーニー、画面遷移、空/エラー/ローディング状態 |
| **Use Cases (UC-*)** | 前提条件、主要フロー、代替/例外フロー、受け入れ条件 |
| **Edge Cases** | ネガティブシナリオ、レート制限、競合解決 |
| **Non-Functional** | パフォーマンス、スケーラビリティ、セキュリティ |
| **Completion Signals** | テスト可能な受け入れ条件、Definition of Done |

#### 共通チェック項目

- `[NEEDS CLARIFICATION]` マーカーの存在
- TODO / TBD / 未決定の記述
- 曖昧な形容詞（「適切な」「十分な」「高速な」など数値化されていない表現）

---

### Step 3: Generate Question Queue

1. Partial または Missing のカテゴリから質問候補を生成
2. 優先順位付け: **Impact × Uncertainty** で評価
   - Impact: アーキテクチャ、データモデル、テスト設計、UX、運用への影響度
   - Uncertainty: 不確実性の度合い
3. 最大 **5問** を内部キューに追加（セッション全体で最大 **10問**）
4. 以下の質問は除外:
   - 既に回答済み
   - 実装フェーズで決めるべき詳細
   - 影響が小さいスタイル的な好み

---

### Step 4: Sequential Questioning Loop (1問ずつ)

**EXACTLY ONE question at a time** で質問する。

#### 4.1 質問の提示形式

**複数選択の場合:**

```
=== Clarify: [Spec ID] (Q[N]/[Total]) ===

[カテゴリ名] について確認します。

**質問**: [質問内容]

**Recommended:** Option [X] - [推奨理由（1-2文）]

| Option | Description |
|--------|-------------|
| A | [選択肢Aの説明] |
| B | [選択肢Bの説明] |
| C | [選択肢Cの説明] |
| Other | 別の回答を短く記入（5語以内） |

回答: オプション文字（例: "A"）、"yes"で推奨を採用、または短い回答を入力
```

**短答式の場合:**

```
=== Clarify: [Spec ID] (Q[N]/[Total]) ===

[カテゴリ名] について確認します。

**質問**: [質問内容]

**Suggested:** [提案する回答] - [提案理由（1-2文）]

回答形式: 短い回答（5語以内）。"yes"で提案を採用、または別の回答を入力
```

#### 4.2 回答の処理

1. 回答を受け取る
2. バリデーション:
   - 複数選択: オプション文字またはOtherの短答にマッチするか
   - 短答: 5語以内か
   - "yes", "recommended", "suggested" → 提示した推奨/提案を採用
3. 曖昧な場合は明確化を求める（同じ質問としてカウント）
4. 有効な回答を得たら → Step 5 へ

#### 4.3 ループ終了条件

以下のいずれかで終了:
- 全ての重要な曖昧点が解消された
- ユーザーが終了を指示（"done", "good", "no more", "stop", "proceed"）
- 5問に到達

---

### Step 5: Incremental Update (回答ごとに即時反映)

回答を受け取るたびに、**即座に** Spec ファイルを更新する。

#### 5.1 Clarifications セクションの管理

1. `## Clarifications` セクションが存在しなければ作成（Section 15 の後、Traceability の前が推奨）
2. `### Session YYYY-MM-DD` サブヘッダーを作成（当日分がなければ）
3. 以下の形式で記録:
   ```markdown
   - Q: [質問内容] → A: [回答]
   ```

#### 5.2 該当セクションへの統合

回答の内容に応じて、最も適切なセクションを更新:

**Domain Spec の場合:**

| 回答の種類 | 更新先セクション |
|-----------|-----------------|
| アクター/権限 | Section 2 (Actors and Roles) |
| マスターデータ (M-*) | Section 3 (Master Data Definitions) |
| API定義 (API-*) | Section 4 (API Contracts) |
| 状態/ライフサイクル | Section 5 (State & Lifecycle) |
| ビジネスルール (BR-*/VR-*/CR-*) | Section 6 (Shared Business Rules) |
| 非機能要件 | Section 7 (Non-Functional Requirements) |

**Feature Spec の場合:**

| 回答の種類 | 更新先セクション |
|-----------|-----------------|
| Domain依存 (M-*/API-*/BR-*) | Section 2 (Domain Dependencies) |
| アクター | Section 3 (Actors) |
| ユーザーストーリー (UC-*) | Section 4 (User Stories / Use Cases) |
| 機能要件 (FR-*) | Section 5 (Functional Requirements) |
| 成功条件 (SC-*) | Section 6 (Success Criteria) |
| エッジケース | Section 7 (Edge Cases) |
| 非機能要件 | Section 8 (Non-Functional Requirements) |

#### 5.3 更新ルール

- 既存の曖昧な記述を**置換**（重複させない）
- `[NEEDS CLARIFICATION]` マーカーを削除
- 曖昧な形容詞を具体的な値に置換
- Markdown構造を維持（見出しの階層、箇条書きのインデント）
- **更新後すぐにファイル保存**（コンテキスト喪失リスクを最小化）

---

### Step 6: Validation (各更新後 + 最終)

各更新後に以下を検証:
- [ ] Clarifications セクションに回答が1つだけ追加されている（重複なし）
- [ ] 更新したセクションに古い矛盾した記述が残っていない
- [ ] Markdown構造が有効
- [ ] 用語の一貫性（同じ概念に異なる用語を使っていない）

---

### Step 7: Completion Report

質問ループ終了後、以下を報告:

```
=== Clarify 完了: [Spec ID] ===

質問/回答: [N] 問
更新したSpec: [ファイルパス]

更新したセクション:
- [セクション名]: [更新内容の要約]
- ...

カバレッジサマリー:
| Category | Status | Notes |
|----------|--------|-------|
| [カテゴリ1] | Resolved | [簡潔な説明] |
| [カテゴリ2] | Clear | 元から十分 |
| [カテゴリ3] | Deferred | Plan フェーズで決定 |
| [カテゴリ4] | Outstanding | 低影響のため保留 |

次のステップ:
- [Resolved/Clear が多い場合]: Spec をレビューし、承認後 `/speckit.plan` へ
- [Outstanding/Deferred が多い場合]: 追加の clarify を推奨、または `/speckit.clarify` を後で再実行
```

---

## Behavior Rules

1. **曖昧点がない場合**: 「重大な曖昧点は検出されませんでした」と報告し、次のステップを提案
2. **Spec が存在しない場合**: 先に `/speckit.bootstrap`（Overview）または `/speckit.issue`（Feature）を実行するよう指示
3. **質問数制限**: 1セッションで最大5問、全体で最大10問を超えない
4. **技術スタック質問**: 機能的な明確性に影響しない限り避ける
5. **早期終了**: ユーザーの終了シグナルを尊重
6. **将来の質問を先出ししない**: キューにある質問を事前に見せない

---

## Example: Domain Clarify Session

```
人間: /speckit.clarify

AI: Domain Spec S-DOMAIN-001 を読み込みました。
    曖昧性スキャンを実行中...

    === Clarify: S-DOMAIN-001 (Q1/5) ===

    Master Data (M-*) について確認します。

    **質問**: このシステムで管理する主要なエンティティは何ですか？

    **Recommended:** Option A - SFAシステムの標準的な構成で、
    顧客→案件→売上の流れを管理できます

    | Option | Description |
    |--------|-------------|
    | A | 顧客(M-CLIENTS)、案件(M-PROJECTS)、売上(M-REVENUES) |
    | B | 顧客(M-CLIENTS)、商品(M-PRODUCTS)、注文(M-ORDERS) |
    | C | ユーザー(M-USERS)、タスク(M-TASKS)、プロジェクト(M-PROJECTS) |
    | Other | 別の組み合わせを記入 |

    回答: オプション文字、"yes"で推奨を採用、または短い回答を入力

人間: yes

AI: 回答を記録しました: 顧客(M-CLIENTS)、案件(M-PROJECTS)、売上(M-REVENUES)

    Spec を更新しました:
    - Section 3 (Master Data Definitions): M-CLIENTS, M-PROJECTS, M-REVENUES を追加
    - Clarifications: Q&A を記録

    === Clarify: S-DOMAIN-001 (Q2/5) ===

    Actors & Permissions について確認します。

    **質問**: システムを利用するアクター（ユーザー種別）は？

    **Suggested:** 営業担当、マネージャー、管理者 -
    SFAシステムの一般的な3層権限構造です

    回答形式: 短い回答（5語以内）。"yes"で提案を採用、または別の回答

人間: 営業、マネージャー、経理、管理者

AI: 回答を記録しました: 営業、マネージャー、経理、管理者

    Spec を更新しました:
    - Section 2 (Actors): 4種類のアクターを定義
    - Clarifications: Q&A を記録

    === Clarify: S-DOMAIN-001 (Q3/5) ===

    State & Lifecycle について確認します。

    **質問**: 案件(M-PROJECTS)のステータス遷移は？

    **Suggested:** リード → 商談 → 見積 → 受注 → 納品 → 検収 -
    コンサルティング案件の典型的なパイプライン

    回答形式: 短い回答。"yes"で提案を採用、または別の回答

人間: yes

AI: 回答を記録しました: リード → 商談 → 見積 → 受注 → 納品 → 検収

    Spec を更新しました:
    - Section 5 (State & Lifecycle): ステータス遷移を定義
    - Section 3 (Master Data Definitions): M-PROJECTS に status フィールドを追加
    - Clarifications: Q&A を記録

    === Clarify: S-DOMAIN-001 (Q4/5) ===

    API Contracts (API-*) について確認します。

    **質問**: 認証方式は？

    **Recommended:** Option A - SPAやモバイルアプリに適した
    ステートレス認証方式です

    | Option | Description |
    |--------|-------------|
    | A | JWT (JSON Web Token) |
    | B | Session-based (Cookie) |
    | C | OAuth 2.0 (外部IdP連携) |
    | D | API Key (サービス間通信用) |

    回答: オプション文字、"yes"で推奨を採用、または短い回答

人間: A

AI: 回答を記録しました: JWT (JSON Web Token)

    Spec を更新しました:
    - Section 4 (API Contracts): 認証方式を JWT と定義
    - Section 7 (Non-Functional Requirements): セキュリティ要件に追記
    - Clarifications: Q&A を記録

    === Clarify: S-DOMAIN-001 (Q5/5) ===

    Business Rules について確認します。

    **質問**: 売上(M-REVENUES)の計算方法は？

    **Suggested:** 案件の契約金額を契約期間で月按分 -
    コンサルティング収益認識の一般的な方法

    回答形式: 短い回答。"yes"で提案を採用、または別の回答

人間: 契約金額を納品月に一括計上

AI: 回答を記録しました: 契約金額を納品月に一括計上

    Spec を更新しました:
    - Section 6 (Shared Business Rules): 売上計上ルールを定義
    - Clarifications: Q&A を記録

    === Clarify 完了: S-DOMAIN-001 ===

    質問/回答: 5 問
    更新したSpec: .specify/specs/domain/spec.md

    更新したセクション:
    - Section 2 (Actors and Roles): 4種類のアクター定義
    - Section 3 (Master Data Definitions): 3つのマスター定義 (M-*)
    - Section 4 (API Contracts): 認証方式
    - Section 5 (State & Lifecycle): ステータス遷移
    - Section 6 (Shared Business Rules): 売上計上ルール
    - Section 7 (Non-Functional Requirements): セキュリティ要件
    - Clarifications: Session 2025-12-11 追加

    カバレッジサマリー:
    | Category | Status | Notes |
    |----------|--------|-------|
    | Domain & Vocabulary | Clear | システム目的は明確 |
    | Master Data (M-*) | Resolved | 3エンティティ定義 |
    | API Contracts (API-*) | Partial | CRUD詳細は次回 |
    | State & Lifecycle | Resolved | 案件ステータス定義 |
    | Actors & Permissions | Resolved | 4アクター定義 |
    | Business Rules | Resolved | 売上計上ルール定義 |
    | Non-Functional | Partial | 認証のみ、性能は未定義 |
    | Integration | Deferred | 外部連携はPlanで検討 |

    次のステップ:
    - API の CRUD 詳細を追加で clarify するか
    - または Spec をレビューし、承認後 `/speckit.plan` へ

    追加の clarify が必要ですか？ ("yes" で継続、"no" でレビューへ)
```

---

## Notes

- Vision clarify は `/speckit.vision` 後に実行（目的とジャーニーの明確化）
- Domain clarify は `/speckit.design` 後に実行（M-*/API-*/BR-* の明確化）
- Feature clarify は Domain が十分に定義されていることが前提
- 人間が「後で」「スキップ」と言った場合は `[NEEDS CLARIFICATION]` を残し、Deferred としてレポート
- 各セッションは独立（前回のセッションを自動継続しない）
- 10問を超えるセッションが必要な場合は、Spec の分割を検討
