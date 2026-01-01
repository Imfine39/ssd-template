# AI SIer 改善 詳細実装計画

**作成日:** 2026-01-01
**更新日:** 2026-01-01
**関連ドキュメント:** [input-interview-improvement-plan.md](./input-interview-improvement-plan.md)
**変更規模:** 大規模（ワークフロー再構築、QA ドキュメント方式、プロとしての提案機能）

---

## 1. 影響範囲サマリー

### 1.1 変更ファイル数

| カテゴリ | 新規 | 変更 | 削除 | 合計 |
|---------|------|------|------|------|
| ワークフロー | 1 | 6 | 2 | 9 |
| 共通コンポーネント | 3 | 2 | 2 | 7 |
| Input テンプレート | 1 | 2 | 1 | 4 |
| QA テンプレート | 3 | 0 | 0 | 3 |
| ガイド | 0 | 4 | 0 | 4 |
| ドキュメント | 0 | 3 | 0 | 3 |
| スクリプト | 0 | 3 | 0 | 3 |
| ディレクトリ | 4 | 0 | 0 | 4 |
| **合計** | **12** | **20** | **5** | **37** |

### 1.2 詳細ファイルリスト

#### ワークフロー（.claude/skills/spec-mesh/workflows/）

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `project-setup.md` | 新規 | Vision + Design 統合ワークフロー |
| `vision.md` | 削除/リダイレクト | project-setup.md へのリダイレクト |
| `design.md` | 削除/リダイレクト | project-setup.md へのリダイレクト |
| `add.md` | 変更 | QA ドキュメント方式導入 |
| `fix.md` | 変更 | QA ドキュメント方式導入 |
| `issue.md` | 変更 | ルーティング強化（Quick 自動判定） |
| `quick.md` | 変更 | 判定ロジック明確化 |
| `change.md` | 変更 | Cascade Update 強化 |
| `clarify.md` | 変更 | 軽微な調整 |

#### 共通コンポーネント（.claude/skills/spec-mesh/workflows/shared/）

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `_qa-generation.md` | 新規 | QA ドキュメント生成ロジック |
| `_qa-analysis.md` | 新規 | QA 回答分析ロジック |
| `_professional-proposals.md` | 新規 | AI SIer としての提案ロジック |
| `_vision-interview.md` | 削除 | QA 方式に統合 |
| `_deep-interview.md` | 削除 | QA 方式に統合 |
| `_quality-flow.md` | 変更 | QA 方式参照に更新 |
| `_cascade-update.md` | 変更 | 複合変更対応強化 |

#### QA テンプレート（.claude/skills/spec-mesh/templates/qa/）

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `project-setup-qa.md` | 新規 | Project Setup 用 QA テンプレート |
| `feature-qa.md` | 新規 | Feature 用 QA テンプレート |
| `fix-qa.md` | 新規 | Fix 用 QA テンプレート |

#### Input テンプレート

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `templates/inputs/project-setup-input.md` | 新規 | 機能ベース入力フォーム |
| `templates/inputs/vision-input.md` | 削除 | project-setup に統合 |
| `templates/inputs/add-input.md` | 変更 | 機能ベースに再設計 |
| `templates/inputs/fix-input.md` | 変更 | 簡素化 |

#### .specify/input/（プロジェクト側）

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `project-setup-input.md` | 新規 | テンプレートからコピー |
| `vision-input.md` | 削除 | project-setup に統合 |
| `add-input.md` | 変更 | テンプレート反映 |
| `fix-input.md` | 変更 | テンプレート反映 |

#### ガイド（.claude/skills/spec-mesh/guides/）

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `decision-tree.md` | 変更 | Project Setup 追加、Quick 判定強化 |
| `workflow-map.md` | 変更 | 遷移図更新 |
| `judgment-criteria.md` | 変更 | 複合変更判定追加 |
| `human-checkpoint-patterns.md` | 変更 | 軽微な調整 |

#### スクリプト（.claude/skills/spec-mesh/scripts/）

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `input.cjs` | 変更 | project-setup 対応 |
| `reset-input.cjs` | 変更 | project-setup 対応 |
| `preserve-input.cjs` | 変更 | project-setup 対応 |

#### ドキュメント

| ファイル | 操作 | 変更内容 |
|----------|------|---------|
| `SKILL.md` | 変更 | Routing テーブル更新 |
| `CLAUDE.md` | 変更 | ルーティングテーブル更新 |
| `docs/Workflows-Reference.md` | 変更 | ワークフロー説明更新 |

#### ディレクトリ

| パス | 操作 | 用途 |
|------|------|------|
| `.specify/qa/` | 新規 | QA ドキュメント格納 |
| `.specify/assets/wireframes/` | 新規 | ワイヤーフレーム格納 |
| `.specify/assets/references/` | 新規 | 参考資料格納 |
| `.specify/assets/screenshots/` | 新規 | スクリーンショット格納 |

---

## 2. 実装フェーズ

### Phase 0: 準備（推定作業: 小）

**目的:** 安全に変更を進めるための準備

| ステップ | 作業内容 | 確認事項 |
|----------|---------|---------|
| 0.1 | 現在のブランチ状態確認 | 未コミットの変更がないこと |
| 0.2 | 新規ブランチ作成 | `spec/ai-sier-improvement` |
| 0.3 | 既存ファイルのバックアップ | audit/backup/ に保存 |

### Phase 1: ディレクトリ構造作成（推定作業: 極小）

**目的:** 新しいファイル構造の基盤を作成

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 1.1 | `.specify/assets/wireframes/` 作成 | なし |
| 1.2 | `.specify/assets/references/` 作成 | なし |
| 1.3 | `.specify/assets/screenshots/` 作成 | なし |
| 1.4 | `.gitkeep` 配置 | 1.1-1.3 |

### Phase 2: 共通コンポーネント作成（推定作業: 大）

**目的:** QA ドキュメント方式と AI SIer 提案機能を作成

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 2.1 | `_qa-generation.md` 新規作成 | なし |
| 2.2 | `_qa-analysis.md` 新規作成 | なし |
| 2.3 | `_professional-proposals.md` 新規作成 | なし |
| 2.4 | `_cascade-update.md` 更新（複合変更対応） | なし |
| 2.5 | `_quality-flow.md` 更新（参照先変更） | 2.1-2.3 |

**_qa-generation.md の構成:**
```
1. 概要
2. QA ドキュメント生成トリガー
3. Pre-Input 分析ロジック
4. 質問の種類（必須/確認/提案/選択）
5. QA テンプレート構造
6. 提案セクションの生成
```

**_professional-proposals.md の構成:**
```
1. AI SIer としての役割
2. 提案の観点
   - 機能追加/削除
   - データ追加/削除
   - ビジネスロジック改善
   - UX 改善
   - セキュリティ考慮
   - パフォーマンス考慮
   - 保守性考慮
   - スケーラビリティ考慮
3. 提案の形式
4. 提案のタイミング
```

### Phase 3: Input・QA テンプレート作成（推定作業: 中）

**目的:** 新しい入力テンプレートと QA テンプレートを作成

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 3.1 | `project-setup-input.md` 新規作成 | なし |
| 3.2 | `add-input.md` 再設計 | なし |
| 3.3 | `fix-input.md` 簡素化 | なし |
| 3.4 | `templates/qa/project-setup-qa.md` 新規作成 | なし |
| 3.5 | `templates/qa/feature-qa.md` 新規作成 | なし |
| 3.6 | `templates/qa/fix-qa.md` 新規作成 | なし |
| 3.7 | `.specify/input/` にコピー | 3.1-3.3 |
| 3.8 | `.specify/qa/` ディレクトリ作成 | なし |

### Phase 4: ワークフロー作成・更新（推定作業: 大）

**目的:** 新しいワークフロー構造を実装

#### Phase 4.1: Project Setup 新規作成

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 4.1.1 | `project-setup.md` 新規作成 | 2.1, 3.1, 3.4 |
| 4.1.2 | Vision + Design 統合フロー実装 | 4.1.1 |
| 4.1.3 | Feature Issue 作成ステップ追加 | 4.1.2 |

**project-setup.md の構成:**
```
1. 概要
2. 前提条件
3. ワークフローステップ
   Step 1: Input 読み込み
   Step 2: ワイヤーフレーム分析（あれば）
   Step 3: QA ドキュメント生成（project-setup-qa.md）
   Step 4: ユーザー回答待ち / 回答分析
   Step 5: 未回答・不明項目を AskUserQuestion で確認
   Step 6: AI SIer 提案（機能・データ・UX・セキュリティ等）
   Step 7: Vision Spec 生成
   Step 8: Screen Spec 生成
   Step 9: Domain Spec 生成
   Step 10: Cross-Reference Matrix 生成
   Step 11: Multi-Review（3観点）
   Step 12: CLARIFY GATE
   Step 13: [HUMAN_CHECKPOINT]
   Step 14: Feature Issues 作成
4. TodoWrite Template
```

#### Phase 4.2: 既存ワークフロー更新

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 4.2.1 | `add.md` に QA ドキュメント方式導入 | 2.1, 3.5 |
| 4.2.2 | `fix.md` に QA ドキュメント方式導入 | 2.1, 3.6 |
| 4.2.3 | `issue.md` にルーティング強化 | なし |
| 4.2.4 | `quick.md` に自動判定ロジック追加 | なし |
| 4.2.5 | `change.md` に Cascade Update 強化 | 2.4 |

#### Phase 4.3: リダイレクト設定

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 4.3.1 | `vision.md` を project-setup へリダイレクト | 4.1.3 |
| 4.3.2 | `design.md` を project-setup へリダイレクト | 4.1.3 |

**リダイレクト形式:**
```markdown
# Vision Workflow (Deprecated)

> **このワークフローは `project-setup.md` に統合されました。**
>
> 新しいプロジェクトを開始する場合は `project-setup.md` を使用してください。

詳細: [project-setup.md](./project-setup.md)
```

### Phase 5: ガイド・ドキュメント更新（推定作業: 中）

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 5.1 | `decision-tree.md` 更新 | Phase 4 完了 |
| 5.2 | `workflow-map.md` 更新 | Phase 4 完了 |
| 5.3 | `judgment-criteria.md` 更新 | Phase 4 完了 |
| 5.4 | `SKILL.md` Routing 更新 | Phase 4 完了 |
| 5.5 | `CLAUDE.md` ルーティング更新 | Phase 4 完了 |
| 5.6 | `docs/Workflows-Reference.md` 更新 | Phase 4 完了 |

### Phase 6: スクリプト更新（推定作業: 小）

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 6.1 | `input.cjs` に project-setup 対応追加 | Phase 3 完了 |
| 6.2 | `reset-input.cjs` に project-setup 対応追加 | Phase 3 完了 |
| 6.3 | `preserve-input.cjs` に project-setup 対応追加 | Phase 3 完了 |

### Phase 7: 削除・クリーンアップ（推定作業: 小）

| ステップ | 作業内容 | 依存関係 |
|----------|---------|---------|
| 7.1 | `_vision-interview.md` 削除 | Phase 4 完了 |
| 7.2 | `_deep-interview.md` 削除 | Phase 4 完了 |
| 7.3 | `templates/inputs/vision-input.md` 削除 | Phase 4 完了 |
| 7.4 | 参照確認（grep で残存参照チェック） | 7.1-7.3 |
| 7.5 | 不要な参照の修正 | 7.4 |

### Phase 8: 検証（推定作業: 中）

| ステップ | 作業内容 | 確認事項 |
|----------|---------|---------|
| 8.1 | `spec-lint.cjs` 実行 | エラーなし |
| 8.2 | 各ワークフローの参照確認 | 壊れたリンクなし |
| 8.3 | スクリプト動作確認 | エラーなし |
| 8.4 | ドキュメント整合性確認 | 矛盾なし |
| 8.5 | 手動ワークフローテスト | 動作確認 |

---

## 3. 依存関係グラフ

```
Phase 0 (準備)
    │
    ▼
Phase 1 (ディレクトリ)
    │
    ├───────────────────────────────────┐
    ▼                                   ▼
Phase 2 (共通コンポーネント)      Phase 3 (Input テンプレート)
    │                                   │
    └───────────┬───────────────────────┘
                ▼
        Phase 4 (ワークフロー)
                │
                ▼
        Phase 5 (ガイド・ドキュメント)
                │
                ├───────────────────────┐
                ▼                       ▼
        Phase 6 (スクリプト)      Phase 7 (削除・クリーンアップ)
                │                       │
                └───────────┬───────────┘
                            ▼
                    Phase 8 (検証)
```

---

## 4. リスク分析と対策

### 4.1 高リスク項目

| リスク | 影響 | 確率 | 対策 |
|--------|------|------|------|
| 既存参照の破損 | 高 | 中 | Phase 7.4 で grep による全参照チェック |
| ワークフロー間の整合性崩壊 | 高 | 中 | Phase 8 で手動テスト実施 |
| スクリプトの互換性問題 | 中 | 低 | Phase 6 で個別テスト |

### 4.2 中リスク項目

| リスク | 影響 | 確率 | 対策 |
|--------|------|------|------|
| QA ドキュメントの回答品質 | 中 | 中 | 未回答・不明項目を AskUserQuestion で補完 |
| 既存プロジェクトへの影響 | 中 | 低 | リダイレクトで後方互換性を部分維持 |
| ドキュメント間の矛盾 | 中 | 中 | Phase 5 で SSOT 原則遵守 |

### 4.3 回復計画

**問題発生時の対応:**

1. **軽微な問題**: その場で修正
2. **中程度の問題**: Phase を一時停止、問題を修正してから再開
3. **重大な問題**: ブランチを破棄し、バックアップから復元

**ロールバック手順:**
```bash
# バックアップからの復元
git checkout main
git branch -D spec/ai-sier-improvement
# audit/backup/ から手動復元
```

---

## 5. 実行順序チェックリスト

### Phase 0: 準備
- [ ] 現在のブランチ状態確認
- [ ] 新規ブランチ作成 (`spec/ai-sier-improvement`)
- [ ] 既存ファイルのバックアップ

### Phase 1: ディレクトリ構造
- [ ] `.specify/assets/wireframes/` 作成
- [ ] `.specify/assets/references/` 作成
- [ ] `.specify/assets/screenshots/` 作成
- [ ] `.gitkeep` 配置

### Phase 2: 共通コンポーネント
- [ ] `_qa-generation.md` 新規作成
- [ ] `_qa-analysis.md` 新規作成
- [ ] `_professional-proposals.md` 新規作成
- [ ] `_cascade-update.md` 更新
- [ ] `_quality-flow.md` 更新

### Phase 3: Input・QA テンプレート
- [ ] `project-setup-input.md` 新規作成
- [ ] `add-input.md` 再設計
- [ ] `fix-input.md` 簡素化
- [ ] `templates/qa/project-setup-qa.md` 新規作成
- [ ] `templates/qa/feature-qa.md` 新規作成
- [ ] `templates/qa/fix-qa.md` 新規作成
- [ ] `.specify/input/` にコピー
- [ ] `.specify/qa/` ディレクトリ作成

### Phase 4: ワークフロー
- [ ] `project-setup.md` 新規作成
- [ ] `add.md` 更新
- [ ] `fix.md` 更新
- [ ] `issue.md` 更新
- [ ] `quick.md` 更新
- [ ] `change.md` 更新
- [ ] `vision.md` リダイレクト
- [ ] `design.md` リダイレクト

### Phase 5: ガイド・ドキュメント
- [ ] `decision-tree.md` 更新
- [ ] `workflow-map.md` 更新
- [ ] `judgment-criteria.md` 更新
- [ ] `SKILL.md` 更新
- [ ] `CLAUDE.md` 更新
- [ ] `docs/Workflows-Reference.md` 更新

### Phase 6: スクリプト
- [ ] `input.cjs` 更新
- [ ] `reset-input.cjs` 更新
- [ ] `preserve-input.cjs` 更新

### Phase 7: 削除・クリーンアップ
- [ ] `_vision-interview.md` 削除
- [ ] `_deep-interview.md` 削除
- [ ] `templates/inputs/vision-input.md` 削除
- [ ] 参照確認（grep）
- [ ] 不要な参照の修正

### Phase 8: 検証
- [ ] `spec-lint.cjs` 実行
- [ ] 参照確認
- [ ] スクリプト動作確認
- [ ] ドキュメント整合性確認
- [ ] 手動ワークフローテスト

---

## 6. 主要ファイルの設計概要

### 6.1 _qa-generation.md

```markdown
# QA ドキュメント生成

Pre-Input を分析し、ユーザー向け QA ドキュメントを生成するロジック。

## 設計思想

実際の SIer のワークフローを模倣：
1. ドキュメント交換: Pre-Input → QA ドキュメント → ユーザー回答
2. MTG（対話）: 未回答・不明項目のみ AskUserQuestion

## QA ドキュメント構造

### 質問カテゴリ

| マーカー | 意味 | 例 |
|----------|------|-----|
| [必須] | 必ず回答が必要 | 「対象ユーザーは誰ですか？」 |
| [確認] | AI の推測を確認 | 「〇〇と理解しましたが正しいですか？」 |
| [提案] | AI からの提案 | 「〇〇機能も必要では？」 |
| [選択] | 複数選択肢から選択 | 「認証方式は A/B/C どれですか？」 |

### セクション構成

1. 基本情報（プロジェクト名、目的等）
2. 機能要件（Pre-Input から抽出）
3. 非機能要件（セキュリティ、パフォーマンス等）
4. 提案事項（AI SIer としての提案）
5. 確認事項（AI の推測確認）

## 生成トリガー

| ワークフロー | トリガー | QA テンプレート |
|--------------|----------|----------------|
| project-setup | Input 読み込み後 | project-setup-qa.md |
| add | Input 読み込み後 | feature-qa.md |
| fix | Input 読み込み後 | fix-qa.md |

## 終了条件

1. 全ての [必須] 項目に回答あり
2. [確認] 項目の承認/却下が完了
3. [提案] 項目の採否が決定
4. Critical な曖昧点がない
```

### 6.2 _professional-proposals.md

```markdown
# AI SIer としての提案

システム開発のプロとしてユーザーに提案するロジック。

## 設計思想

データ項目だけでなく、全ての観点から提案を行う。
最終判断はユーザーが行う。

## 提案カテゴリ

| 観点 | 提案例 |
|------|--------|
| 機能追加 | 「レポート機能も必要では？」 |
| 機能削除 | 「この機能は MVP では不要では？」 |
| データ追加 | 「更新日時も記録した方が良いのでは？」 |
| データ削除 | 「この項目は使われないのでは？」 |
| ビジネスロジック | 「この計算ロジックは正しいですか？」 |
| UX 改善 | 「エラー時のフィードバックはどうしますか？」 |
| セキュリティ | 「権限管理は必要ですか？」 |
| パフォーマンス | 「大量データ時の対策は？」 |
| 保守性 | 「ログ設計はどうしますか？」 |
| スケーラビリティ | 「将来の拡張を考慮すると...」 |

## 提案のタイミング

1. QA ドキュメント生成時（提案セクション）
2. QA 回答分析後（追加提案）
3. Spec 作成時（改善提案）

## 提案の形式

QA ドキュメント内:
```md
### P1.1: 検索機能の追加 [提案]

**AI の所見:** 商品一覧画面がありますが、検索機能がありません。
商品数が増えると探しにくくなる可能性があります。

**提案:** 検索・フィルター機能の追加

採否: [ ] 採用 / [ ] 不採用 / [ ] 要検討
```
```

### 6.3 project-setup.md

```markdown
# Project Setup Workflow

Vision + Design を統合した新規プロジェクト開始ワークフロー。

## 概要

新規プロジェクトの初期化を一貫したフローで行う。
QA ドキュメント方式でユーザーから情報を収集し、
Vision Spec + Screen Spec + Domain Spec を生成する。

## 前提条件

- 新規プロジェクト（既存 Spec がない）
- project-setup-input.md が記入済み（推奨）

## ワークフローステップ

### Step 1: Input 読み込み
.specify/input/project-setup-input.md を読み込む

### Step 2: ワイヤーフレーム分析
.specify/assets/wireframes/ にファイルがあれば分析

### Step 3: QA ドキュメント生成
shared/_qa-generation.md を使用して project-setup-qa.md を生成

### Step 4: ユーザー回答待ち
ユーザーに QA ドキュメントへの回答を依頼

### Step 5: QA 回答分析
shared/_qa-analysis.md で回答を分析
未回答・不明項目は AskUserQuestion で確認

### Step 6: AI SIer 提案
shared/_professional-proposals.md で追加提案
（機能・データ・UX・セキュリティ等）

### Step 7-10: Spec 生成
Vision → Screen → Domain → Matrix

### Step 11-13: 品質フロー
Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]

### Step 14: Feature Issues 作成
Feature Hints から GitHub Issues を作成

## TodoWrite Template
[ステップ一覧]
```

---

## 7. 実装上の注意点

### 7.1 SSOT（Single Source of Truth）の維持

- 複合変更の判定ロジック: `judgment-criteria.md` が SSOT
- Quality Flow の定義: `_quality-flow.md` が SSOT
- CLARIFY GATE: `constitution/quality-gates.md` が SSOT

### 7.2 後方互換性

- `vision.md`、`design.md` は完全削除せずリダイレクト
- 既存コマンド（"/vision"、"/design"）は引き続き動作
- 内部的に `project-setup.md` へルーティング

### 7.3 テスト戦略

1. **Unit レベル**: 各ワークフローを個別にテスト
2. **Integration レベル**: ワークフロー間の遷移をテスト
3. **E2E レベル**: 新規プロジェクト作成を通しでテスト

---

## 8. 次のステップ

この計画の承認後、Phase 0 から順次実行します。

**承認確認項目:**
1. 影響範囲は許容範囲か？
2. リスク対策は十分か？
3. 実装順序に問題はないか？
4. 追加で考慮すべき点はあるか？

---

## Appendix: 参考コマンド

```bash
# バックアップ作成
mkdir -p audit/backup
cp -r .claude/skills/spec-mesh/workflows audit/backup/
cp -r .claude/skills/spec-mesh/templates/inputs audit/backup/

# 参照チェック（削除後）
grep -r "_vision-interview" .claude/
grep -r "_deep-interview" .claude/
grep -r "vision-input" .claude/

# ブランチ作成
git checkout -b spec/ai-sier-improvement

# 検証
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```
