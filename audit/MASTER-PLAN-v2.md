# AI SIer 改善 マスタープラン v2

**作成日:** 2026-01-01
**目的:** 完璧な仕様駆動開発を実現する AI SIer システムの構築
**トレース用ID:** `MASTER-PLAN-v2`

---

## 1. 設計思想

### 1.1 ユーザーに対する考え方

> **核心:** ユーザーは「書くのが面倒」ではなく「知らないことがある」

- 旧思想: 入力を最小限に → ユーザーは書くのを面倒くさがる
- 新思想: 詳細に書ける構造を提供 → ユーザーは知らないことがある

**結論:** Pre-Input で詳細に書ける構造を提供し、QA/AskUserQuestion で補完する

### 1.2 Input/QA/AskUserQuestion の役割分担

```
┌─────────────────────────────────────────────────────────────┐
│ Pre-Input（ユーザーが事前に書く）                            │
├─────────────────────────────────────────────────────────────┤
│ 目的: ユーザーが「知っていること」を引き出す                  │
│                                                             │
│ 特徴:                                                       │
│   ✅ 詳細に書ける構造                                        │
│   ✅ 機能ベース（データ、画面、処理）                         │
│   ✅ 必須項目を明確に                                        │
│   ❌ チェックリストなし（それは QA の役割）                   │
│   ❌ 選択式質問なし（それは QA の役割）                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ QA（AI が動的生成）                                          │
├─────────────────────────────────────────────────────────────┤
│ 目的: ユーザーが「知らないこと」を発見する                    │
│                                                             │
│ 特徴:                                                       │
│   ✅ Input から未記入・不明瞭な項目を特定                     │
│   ✅ チェックリスト形式 OK                                   │
│   ✅ AI の推測を提示して確認                                 │
│   ✅ プロ提案（セキュリティ、UX、パフォーマンス等）           │
│                                                             │
│ カテゴリ:                                                    │
│   [必須] → 未回答なら [NEEDS CLARIFICATION]                  │
│   [確認] → AI の推測を確認                                   │
│   [提案] → 採否を記録（理由付き）                            │
│   [選択] → 複数選択肢から選択                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ AskUserQuestion（対話的確認）                                │
├─────────────────────────────────────────────────────────────┤
│ 目的: 残った不明点を即座に解消                               │
│                                                             │
│ 使用場面:                                                    │
│   - QA 回答後の残り不明点                                    │
│   - 重要な設計判断                                           │
│   - 選択肢形式で効率化                                       │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Spec 階層

```
┌─────────────────────────────────────────────────────────────┐
│                    Overview Specs（What）                    │
├─────────────────────────────────────────────────────────────┤
│  Vision Spec      │ 目的・ゴール・制約・スコープ              │
│  Screen Spec      │ 画面一覧・遷移・UIパターン                │
│  Domain Spec      │ M-*・API-*・RULE-*                       │
└─────────────────────────────────────────────────────────────┘
                              ↓ 参照
┌─────────────────────────────────────────────────────────────┐
│                    Feature Specs（How）                      │
├─────────────────────────────────────────────────────────────┤
│  S-{PREFIX}-{NNN} │ 機能要件・ユースケース・実装詳細          │
│                   │ ← Screen/Domain を参照                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 新しいワークフロー構造

### 2.1 Entry（SKILL.md に統合）

すべての開発依頼は SKILL.md の Entry セクションで処理される。

| タイプ | トリガー | Input | 処理 |
|--------|---------|-------|------|
| **add** | 「機能を追加」「〇〇を作りたい」 | **必須** | Input → Issue 作成 → feature.md |
| **fix** | 「バグを直して」「エラーを修正」 | **必須** | Input → Quick 判定 → 小: 直接実装 / 大: fix.md |
| **change** | 「Spec を変更」「M-* を修正」 | **必須** | Input → change.md |
| **issue** | 「Issue #N を実装」 | **状態依存** | 状態確認 → 適切な処理（詳細は 3章） |
| **quick** | 「小さな変更」 | 不要 | Impact Guard → 直接実装 or add/fix へ |
| **setup** | 「プロジェクトを始めたい」 | **必須** | → project-setup.md |

### 2.1.1 fix タイプの特徴

fix は「何を作るか」ではなく「何を直すか」なので、feature とは異なる処理フローを持つ。

| 項目 | 内容 |
|------|------|
| **QA** | 省略（詳細な機能設計は不要） |
| **AskUserQuestion** | 使用（問題確認・修正方針を対話で決定） |
| **Multi-Review** | 実施（Fix Spec の品質担保） |
| **CLARIFY GATE** | 実施 |

### 2.1.2 change タイプの後続フロー

change.md 完了後、Impact Analysis の結果に基づいて分岐する。

| 結果 | 処理 |
|------|------|
| **実装変更が必要** | → plan.md（関連機能の実装変更を計画）|
| **Spec 変更のみ** | → 完了（Cascade Update で関連 Spec を更新済み）|

**実装変更が必要な例:**
- M-USER に属性追加 → 関連画面・API の実装変更が必要
- API-AUTH-LOGIN のレスポンス変更 → クライアント側の実装変更が必要

**Spec 変更のみの例:**
- 誤字修正、説明文の更新
- 未使用の M-* 定義の削除

### 2.1.3 change タイプの品質フロー

change は「何を変えるか」が明確なので、QA は省略するが品質担保は実施する。

| 項目 | 内容 |
|------|------|
| **QA** | 省略（変更内容は Input で明示済み） |
| **AskUserQuestion** | 使用（影響範囲の確認） |
| **Multi-Review** | 実施（変更の整合性確認） |
| **CLARIFY GATE** | 実施 |

### 2.1.4 Quick 判定 / Impact Guard

**目的:** quick タイプと fix タイプの規模判定を統一する仕組み

**判定基準:**

| 基準 | 小規模（直接実装） | 大規模（Spec 経由） |
|------|-------------------|-------------------|
| 影響ファイル数 | 1-3 ファイル | 4+ ファイル |
| Spec 変更 | なし | あり |
| テスト影響 | 既存テストで OK | 新規テスト必要 |
| API 変更 | なし | あり |
| DB スキーマ変更 | なし | あり |

**判定フロー:**

```
依頼内容
    ↓
Impact Guard 判定（上記基準で評価）
    │
    ├─ 小規模（すべて「小規模」列に該当）
    │       │
    │       └── 直接実装（Plan 不要）
    │           → implement.md → PR
    │
    └─ 大規模（1つでも「大規模」列に該当）
            │
            ├─ 機能追加性質 → add タイプへ誘導 → feature.md
            │
            └─ バグ修正性質 → fix.md
```

**`_impact-guard.md` の役割:**

- quick タイプ: 直接実装可否を判定
- fix タイプ: Quick 判定（小: 直接実装 / 大: fix.md）
- 判定基準の SSOT

### 2.2 ワークフロー一覧

```
=== Entry（SKILL.md） ===

SKILL.md ─────────────┬── add → feature.md
                      ├── fix → fix.md
                      ├── change → change.md
                      ├── issue → 状態に応じて feature.md or fix.md or plan.md
                      ├── quick → 直接実装 or add/fix へ誘導
                      └── setup → project-setup.md


=== Spec 作成ワークフロー ===

project-setup.md      # 新規プロジェクト（Overview Specs + Feature Drafts）
feature.md            # Feature Spec 作成
fix.md                # Fix Spec 作成
change.md             # Spec 変更


=== 実装ワークフロー ===

plan.md → tasks.md → implement.md → pr.md


=== 品質ワークフロー ===

review.md             # Multi-Review
clarify.md            # 曖昧点解消
lint.md               # Lint 実行


=== テストワークフロー ===

test-scenario.md      # テストシナリオ作成
e2e.md                # E2E テスト実行


=== その他 ===

analyze.md            # 実装と Spec の比較
checklist.md          # 品質スコア測定
feedback.md           # フィードバック記録
featureproposal.md    # Feature 提案
spec.md               # Spec 直接編集
```

### 2.3 ファイル構成

```
.claude/skills/spec-mesh/
│
├── SKILL.md                    # スキル定義 + Entry ロジック
│
├── workflows/
│   │
│   │ === Spec 作成 ===
│   ├── project-setup.md        # 新規プロジェクト
│   ├── feature.md              # Feature Spec 作成 ★新規
│   ├── fix.md                  # Fix Spec 作成 ★改修
│   ├── change.md               # Spec 変更 ★改修
│   │
│   │ === 実装 ===
│   ├── plan.md
│   ├── tasks.md
│   ├── implement.md
│   ├── pr.md
│   │
│   │ === 品質 ===
│   ├── review.md
│   ├── clarify.md
│   ├── lint.md
│   │
│   │ === テスト ===
│   ├── test-scenario.md
│   ├── e2e.md
│   │
│   │ === その他 ===
│   ├── analyze.md
│   ├── checklist.md
│   ├── feedback.md
│   ├── featureproposal.md
│   ├── spec.md
│   │
│   └── shared/
│       ├── _qa-generation.md       # QA 動的生成
│       ├── _qa-analysis.md         # QA 回答分析
│       ├── _clarify-gate.md        # CLARIFY GATE
│       ├── _impact-guard.md        # Impact Guard / Quick 判定
│       ├── _cascade-update.md      # 連鎖更新
│       ├── _professional-proposals.md
│       └── _deep-interview.md
│
├── templates/
│   ├── inputs/
│   │   ├── add-input.md
│   │   ├── fix-input.md
│   │   ├── change-input.md         # ★新規
│   │   └── project-setup-input.md
│   │
│   ├── vision-spec.md
│   ├── domain-spec.md
│   ├── screen-spec.md
│   ├── feature-spec.md
│   ├── fix-spec.md
│   └── qa/
│       └── ...
│
├── constitution/
│   ├── core.md
│   ├── quality-gates.md
│   ├── terminology.md
│   └── judgment-criteria.md
│
├── guides/
│   └── ...
│
└── scripts/
    └── ...
```

### 2.4 削除するファイル

| ファイル | 理由 |
|---------|------|
| `workflows/add.md` | SKILL.md に Entry 統合 |
| `workflows/issue.md` | SKILL.md に Entry 統合 |
| `workflows/quick.md` | SKILL.md に Entry 統合 |
| `workflows/vision.md` | project-setup.md に統合済み |
| `workflows/design.md` | project-setup.md に統合済み |
| `workflows/shared/_vision-interview.md` | _qa-generation.md に置き換え |

**注意:** 旧 `fix.md` は削除ではなく改修（Entry 部分を SKILL.md に移動、Core 部分を残す）

---

## 3. issue タイプの詳細設計

### 3.1 Issue の状態パターン

Issue には複数の状態があり、それぞれ処理が異なる。

| 状態 | 意味 | 発生パターン |
|------|------|-------------|
| **Draft Spec あり** | project-setup で作成済み | project-setup → Issue 作成 |
| **Clarified Spec あり** | Spec 作成完了 | add/fix 完了後、plan 前で中断 |
| **In Review Spec あり** | Multi-Review 途中 | review 中に中断 |
| **Spec なし + 保存済み Input あり** | add/fix 途中で中断 | add/fix の途中で中断 |
| **Spec なし + Input なし** | 人間/外部が作成 | GitHub で手動作成、外部連携 |

### 3.2 状態別処理フロー

```
Issue 選択
    │
    ↓
状態確認（Spec の有無、Input の有無）
    │
    ├─── Draft Spec あり
    │       │
    │       └── Draft 読み込み
    │           → 詳細 QA（_qa-generation.md で深掘り）
    │           → QA 回答分析
    │           → AskUserQuestion（不明点あれば）
    │           → Spec 更新（Draft → Clarified）
    │           → Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]
    │
    ├─── Clarified Spec あり
    │       │
    │       └── → plan.md へ（Spec 作成は完了済み）
    │
    ├─── In Review Spec あり
    │       │
    │       └── Multi-Review から再開
    │           → CLARIFY GATE → [HUMAN_CHECKPOINT]
    │
    ├─── Spec なし + 保存済み Input あり
    │       │
    │       ├── feature ラベル
    │       │       └── Input 読み込み → feature.md
    │       │
    │       └── fix ラベル
    │               └── Input 読み込み → fix.md
    │
    └─── Spec なし + Input なし
            │
            ├── feature ラベル
            │       └── 「add-input.md に記入してから再度依頼してください」
            │
            └── fix ラベル
                    └── 「fix-input.md に記入してから再度依頼してください」
```

### 3.3 Draft Spec の検出方法

```bash
# Issue body から Draft パスを抽出
# project-setup で作成された Issue には以下の形式で記載
#
# Draft Spec: .specify/specs/features/{id}/spec.md

# または直接ファイルを確認
ls .specify/specs/features/*/spec.md
# Status: Draft のものを探す
```

### 3.4 保存済み Input の検出方法

```bash
# preserve-input.cjs で保存された Input を確認
# .specify/specs/features/{feature-id}/input.md
# .specify/specs/fixes/{fix-id}/input.md
```

---

## 4. Input 設計

### 4.1 Input 要件

| タイプ | Input | ファイル | 理由 |
|--------|-------|---------|------|
| **add** | 必須 | `add-input.md` | 機能の詳細をチャットで伝えるのは非効率 |
| **fix** | 必須 | `fix-input.md` | 問題の再現手順等をチャットで伝えるのは非効率 |
| **change** | 必須 | `change-input.md` | 変更対象と内容を明確にする必要がある |
| **issue** | 状態依存 | - | 既存の Spec/Input があれば使用、なければ記入を促す |
| **quick** | 不要 | - | 小さな変更なので直接依頼でOK |
| **setup** | 必須 | `project-setup-input.md` | プロジェクト全体の情報が必要 |

### 4.2 Input テンプレート構造

#### add-input.md（単一機能の詳細）

```markdown
# Feature Quick Input

## 機能概要
- **機能名**: （必須）
- **一言で説明すると**: （必須）

## なぜ必要か
- **解決したい課題**:
- **誰が使うか**:
- **どんな価値があるか**:

## データと処理
- **入力データ**:
- **出力データ**:
- **保存するデータ**:
- **主な処理ロジック**:

## 画面イメージ
- **メイン画面の要素**:
- **操作フロー**:
- **参考にしたいUI**:

## 関連する既存機能
- **依存する機能**:
- **影響を受ける機能**:

## 制約・注意点
-

## 補足情報
```

#### fix-input.md（問題の詳細）

```markdown
# Fix Quick Input

## 問題概要
- **問題の要約**: （必須）
- **発生箇所**: （必須）

## 再現手順
1. （必須：最低1ステップ）
2.
3.

## 期待する動作
- **本来どうあるべきか**:

## 実際の動作
- **現在どうなっているか**:
- **エラーメッセージ**:

## 影響範囲
- **影響を受ける機能**:
- **影響を受けるユーザー**:

## 関連情報
- **関連する Issue/PR**:
- **関連するコード**:

## 補足情報
```

#### change-input.md（Spec 変更の詳細）★新規

```markdown
# Change Quick Input

## 変更対象
- **対象 Spec**: （必須）例: Domain Spec, S-AUTH-001
- **対象 ID**: （必須）例: M-USER, API-AUTH-LOGIN

## 変更内容
- **現在の定義**:
- **変更後の定義**:
- **変更理由**: （必須）

## 影響範囲
- **影響を受ける Spec**:
- **影響を受ける機能**:

## 補足情報
```

#### project-setup-input.md（プロジェクト全体）

```markdown
# Project Setup Quick Input

## プロジェクト概要
- **プロジェクト名**: （必須）
- **一言で説明すると**: （必須）
- **解決したい課題**:

## 機能リスト

### 機能 1: [機能名]（必須：最低1機能）

#### 概要
- **何をする機能？**:
- **誰が使う？**:
- **なぜ必要？**:

#### データ
- **入力データ**:
- **出力データ**:
- **保存データ**:

#### 画面イメージ
- **メイン画面の要素**:
- **操作フロー**:

#### 備考

---

### 機能 2: [機能名]

（同様に記入）

---

## 技術的な制約
- **使用する技術スタック**:
- **外部連携**:
- **その他の制約**:

## 補足情報
```

---

## 5. Feature Draft システム

### 5.1 project-setup から Draft 生成

```
project-setup.md
    │
    ↓
Input 読み取り（project-setup-input.md）
    │
    ↓
QA 生成・回答（_qa-generation.md, _qa-analysis.md）
    │
    ↓
Overview Specs 生成
├── Vision Spec（Status: Clarified）
├── Screen Spec（Status: Clarified）
└── Domain Spec（Status: Clarified）
    │
    ↓
Feature Draft × N 生成
├── S-FEAT-001/spec.md（Status: Draft）
├── S-FEAT-002/spec.md（Status: Draft）
└── ...
    │
    ↓
Issue × N 作成
├── Issue #1: [Feature] 機能1
│   Body: "Draft Spec: .specify/specs/features/S-FEAT-001/spec.md"
├── Issue #2: [Feature] 機能2
└── ...
```

### 5.2 Draft の内容

Draft Spec には以下が含まれる：

| セクション | 状態 | 説明 |
|-----------|------|------|
| 基本情報 | ✅ 記入済み | 概要、目的、アクター |
| Domain 参照 | ✅ 記入済み | M-*, API-* への参照 |
| Screen 参照 | ✅ 記入済み | SCR-* への参照 |
| ユースケース詳細 | ⬜ 空欄 | issue ワークフローで埋める |
| 機能要件詳細 | ⬜ 空欄 | issue ワークフローで埋める |
| エラーハンドリング | ⬜ 空欄 | issue ワークフローで埋める |
| 非機能要件 | ⬜ 空欄 | issue ワークフローで埋める |

### 5.3 Draft → Clarified のフロー

```
issue ワークフロー（issue タイプ）
    │
    ↓
Issue 選択 → Draft Spec 検出
    │
    ↓
Draft 読み込み
    │
    ↓
詳細 QA 生成（空欄部分を特定して質問生成）
├── ユースケースの詳細は？
├── エラーケースは？
├── 非機能要件は？
└── ...
    │
    ↓
QA 回答 + AskUserQuestion
    │
    ↓
Feature Spec 更新（Status: Draft → Clarified）
    │
    ↓
Multi-Review → CLARIFY GATE → [HUMAN_CHECKPOINT]
```

---

## 6. 実行フェーズ

### PHASE-0〜7: [DONE]

既存の成果を保持。詳細は MASTER-PLAN.md（v1）を参照。

---

### PHASE-8: 設計基盤の確立 [PENDING]

**目的:** 新設計思想の文書化と既存ドキュメントの整理

#### STEP-8.1: 設計思想の文書化

| 対象 | 作業 |
|------|------|
| constitution/core.md | 設計思想（1.1, 1.2, 1.3）を追記 |
| constitution/terminology.md | 用語定義の確認・更新 |

#### STEP-8.2: CLAUDE.md / SKILL.md の準備

| 対象 | 作業 |
|------|------|
| CLAUDE.template.md | 新しいワークフロー構造を反映 |
| SKILL.md | Entry セクションの構造を設計 |

---

### PHASE-9: ワークフロー再構成 [PENDING]

**目的:** Entry を SKILL.md に統合、ワークフローファイルの整理

#### STEP-9.1: SKILL.md に Entry 統合

```markdown
# SKILL.md に追加するセクション

## 2. Entry（開発開始）

すべての開発依頼はこのセクションで処理される。

### 2.1 依頼タイプの判定

ユーザーの発言からタイプを判定：

| キーワード | タイプ |
|-----------|--------|
| 「機能を追加」「〇〇を作りたい」「新機能」 | add |
| 「バグ」「エラー」「修正」「直して」 | fix |
| 「Spec を変更」「M-* を修正」「定義を変更」 | change |
| 「Issue #N」「Issue から」 | issue |
| 「小さな変更」「ちょっと」「Quick」 | quick |
| 「プロジェクトを始める」「新規プロジェクト」 | setup |

**判定できない場合:** AskUserQuestion で確認

### 2.2 Input 確認

| タイプ | Input ファイル | 必須？ |
|--------|---------------|--------|
| add | `.specify/input/add-input.md` | 必須 |
| fix | `.specify/input/fix-input.md` | 必須 |
| change | `.specify/input/change-input.md` | 必須 |
| issue | - | 状態依存（3章参照） |
| quick | - | 不要 |
| setup | `.specify/input/project-setup-input.md` | 必須 |

**Input 必須タイプで未記入の場合:**
1. 該当 Input ファイルのパスをユーザーに提示
2. 「記入後に再度依頼してください」と案内
3. ワークフロー終了

### 2.3 共通前処理

1. **状態確認:**
   ```bash
   node .claude/skills/spec-mesh/scripts/state.cjs query --all
   ```

2. **前提条件チェック:**
   - setup 以外: Vision Spec が存在するか
   - add/fix: Domain Spec が存在するか（警告のみ）

3. **ブランチ状態確認:**
   - 既存の作業中ブランチがあれば警告

### 2.4 タイプ別処理

| タイプ | 処理 |
|--------|------|
| **add** | Input 読み込み → Issue 作成 → `feature.md` へ |
| **fix** | Input 読み込み → Impact Guard 判定 → 小: `implement.md` / 大: `fix.md` へ |
| **change** | Input 読み込み → `change.md` へ |
| **issue** | 状態判定（3章参照） → 適切なワークフローへ |
| **quick** | Impact Guard 判定 → 小: `implement.md` / 大: add/fix へ誘導 |
| **setup** | Input 読み込み → `project-setup.md` へ |
```

#### STEP-9.2: 新規ワークフロー作成

| ファイル | 作業 |
|---------|------|
| workflows/feature.md | 新規作成（Feature Spec 作成フロー）※ add.md の Core 部分を移行 |
| workflows/fix.md | 改修（Entry 部分を削除、Core 部分を残す） |
| workflows/change.md | 改修（Input 必須化、Entry 部分を削除） |
| workflows/shared/_impact-guard.md | 新規作成（Quick 判定 / Impact Guard の SSOT）|

#### STEP-9.3: ワークフロー削除

| ファイル | 作業 |
|---------|------|
| workflows/add.md | 削除 |
| workflows/issue.md | 削除 |
| workflows/quick.md | 削除 |
| workflows/vision.md | 削除 |
| workflows/design.md | 削除 |
| workflows/shared/_vision-interview.md | 削除 |

#### STEP-9.4: 参照更新

| 対象 | 作業 |
|------|------|
| CLAUDE.template.md | ルーティングテーブル更新 |
| 各ワークフロー | 相互参照の更新 |
| constitution/*.md | 参照パス更新 |

#### STEP-9.5: plan.md の修正

**問題:** 現在の plan.md は Feature Spec のパスがハードコードされており、Fix Spec や Change に対応していない。

**修正内容:**

| 作業 |
|------|
| Spec タイプ判定ロジック追加（ブランチ名 or state.cjs から） |
| タイプ別パス対応（features/fixes/変更対象） |
| Change の Plan 要否判定ロジック追加 |

**タイプ別パス:**

| タイプ | Spec パス | Plan 保存先 |
|--------|----------|-------------|
| feature | `.specify/specs/features/{id}/spec.md` | `.specify/specs/features/{id}/plan.md` |
| fix | `.specify/specs/fixes/{id}/spec.md` | `.specify/specs/fixes/{id}/plan.md` |
| change | 変更対象の Spec | 変更対象の Spec ディレクトリ/plan.md |

**Change の Plan 要否判定:**

| パターン | 例 | Plan 必要？ |
|---------|-----|-----------|
| 実装変更が必要 | M-USER に属性追加 → 関連機能を修正 | ✅ 必要 |
| Spec 変更のみ | 誤字修正、説明文更新 | ❌ 不要 |

---

### PHASE-10: Input/QA 再設計 [PENDING]

**目的:** Input テンプレートの改善、QA との連携強化

#### STEP-10.1: Input テンプレート更新

| ファイル | 作業 |
|---------|------|
| templates/inputs/add-input.md | 詳細構造に改善（4.2 参照） |
| templates/inputs/fix-input.md | 詳細構造に改善（4.2 参照） |
| templates/inputs/change-input.md | 新規作成（4.2 参照） |
| templates/inputs/project-setup-input.md | 詳細構造に改善（4.2 参照） |

#### STEP-10.2: QA 動的生成の改善

| ファイル | 作業 |
|---------|------|
| shared/_qa-generation.md | Input 分析ロジック追加 |
| shared/_qa-analysis.md | 未回答必須→[NEEDS CLARIFICATION] 連携追加 |

#### STEP-10.3: Input → QA → Spec マッピング完成

| 作業 |
|------|
| 各 Input 項目が QA のどの質問に対応するか明確化 |
| QA 回答が Spec のどのセクションに反映されるか明確化 |

---

### PHASE-11: Feature Draft システム実装 [PENDING]

**目的:** project-setup から Feature Draft を生成し、issue ワークフローで詳細化

#### STEP-11.1: project-setup.md 改修

| 作業 |
|------|
| Feature Draft 生成ロジック追加 |
| Issue 作成時に Draft パスを記載 |

#### STEP-11.2: SKILL.md の issue タイプ実装

| 作業 |
|------|
| 状態判定ロジック実装（3.2 参照） |
| Draft 検出ロジック実装（3.3 参照） |
| 保存済み Input 検出ロジック実装（3.4 参照） |

#### STEP-11.3: feature.md に Draft 対応追加

| 作業 |
|------|
| Draft 読み込みロジック追加 |
| 詳細 QA 生成（空欄部分を特定） |

---

### PHASE-12: Critical 問題修正 [PENDING]

**目的:** セキュリティ問題と重要な機能欠落の修正

#### STEP-12.1: Shell Injection 完全修正

| ファイル | 作業 |
|---------|------|
| scripts/branch.cjs | validateInput() 関数追加、execSync 前に検証 |
| scripts/scaffold-spec.cjs | validateShellInput() 関数追加 |
| scripts/post-merge.cjs | validateShellInput() 関数追加 |

#### STEP-12.2: 未回答必須→[NEEDS CLARIFICATION] 連携の確認

| 確認事項 |
|---------|
| STEP-10.2 で実装した連携が正しく動作するか確認 |

> **注:** 実装は STEP-10.2 で実施済み。ここでは動作確認のみ。

#### STEP-12.3: [DEFERRED] 保持確認

| 確認事項 |
|---------|
| _qa-analysis.md で [DEFERRED] が正しく処理されるか |
| clarify.md で [DEFERRED] を [NEEDS CLARIFICATION] に変換しないか |
| CLARIFY GATE で PASSED_WITH_DEFERRED が正しく判定されるか |

---

### PHASE-13: 検証 [PENDING]

**目的:** 全体の整合性確認と自動テスト作成

#### STEP-13.1: 参照整合性確認

**1. 削除ファイルへの参照確認:**

```bash
# 削除ファイルへの参照確認
grep -r "add\.md\|issue\.md\|quick\.md" .claude/skills/spec-mesh/
grep -r "vision\.md\|design\.md" .claude/skills/spec-mesh/
grep -r "_vision-interview" .claude/skills/spec-mesh/

# Lint 実行
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

**2. 参照更新が必要なファイル一覧:**

PHASE-9 で削除したワークフローへの参照が残っているファイル：

| ファイル | 更新内容 |
|---------|---------|
| `guides/workflow-map.md` | ワークフロー一覧を新構造に更新 |
| `guides/decision-tree.md` | 判定ロジックを Entry ベースに更新 |
| `guides/human-checkpoint-patterns.md` | 参照ワークフロー名を更新 |
| `constitution.md` | state.cjs 使用例のワークフロー名を更新 |
| `workflows/shared/_cascade-update.md` | add.md → feature.md |
| `workflows/shared/_quality-flow.md` | add.md → feature.md |
| `workflows/shared/_deep-interview.md` | add.md → feature.md, _vision-interview 参照削除 |
| `workflows/shared/_finalize.md` | add.md → feature.md, issue.md 参照削除 |
| `workflows/shared/impact-analysis.md` | add.md → feature.md, design.md → project-setup.md, quick.md → SKILL.md Entry |

**3. 更新方針:**

- `add.md` → `feature.md` に置換
- `vision.md` → `project-setup.md` に置換
- `design.md` → `project-setup.md` に置換
- `issue.md` → SKILL.md Entry セクション参照に変更
- `quick.md` → SKILL.md Entry セクション + `_impact-guard.md` 参照に変更
- `_vision-interview.md` → `_qa-generation.md` または `_deep-interview.md` に置換

#### STEP-13.2: ワークフロー動作確認

| テストケース |
|-------------|
| add タイプ: Input あり → feature.md → Spec 作成 |
| add タイプ: Input なし → エラーメッセージ |
| fix タイプ: Input あり + 小規模 → 直接実装 |
| fix タイプ: Input あり + 大規模 → fix.md → Spec 作成 |
| issue タイプ: Draft あり → 詳細化 → Spec 更新 |
| issue タイプ: Clarified Spec あり → plan.md へ |
| issue タイプ: Spec なし + Input なし → エラーメッセージ |
| quick タイプ: 小規模 → 直接実装 |
| quick タイプ: 大規模 → add/fix へ誘導 |
| change タイプ: Input あり → change.md → Cascade Update |
| setup タイプ: → project-setup.md |

#### STEP-13.3: 自動テスト作成

| 作業 |
|------|
| 30 Agent 調査で発見した問題を自動テストに変換 |
| CI に組み込み可能な形式で作成 |

---

## 7. 継承する問題（PHASE-0〜7 から）

### 7.1 Critical（必須）

| ID | 問題 | 状態 | 対応 PHASE |
|----|------|------|-----------|
| C-SCR-007 | branch.cjs Shell Injection | 未修正 | PHASE-12 |
| C-SCR-008 | scaffold-spec.cjs Shell Injection | 未修正 | PHASE-12 |
| C-SCR-009 | post-merge.cjs Shell Injection | 未修正 | PHASE-12 |
| C-05-005 | 未回答必須→[NEEDS CLARIFICATION] 連携 | 修正済み | 確認 PHASE-12 |

### 7.2 Major（重要）

| ID | 問題 | 状態 | 対応 PHASE |
|----|------|------|-----------|
| M-QA-001 | QA→Spec マッピング不完全 | 未修正 | PHASE-10 |
| M-INPUT-001 | Input テンプレートが「最小限」志向 | 未修正 | PHASE-10 |
| M-WF-001 | ワークフロー構造の重複 | ✅ 修正済み | PHASE-9 |

### 7.3 Minor（低優先・参考）

| ID | 問題 | 備考 |
|----|------|------|
| Minor-DOC-* | ドキュメント整合性 | 自然に解消される見込み |
| Minor-TERM-* | 用語統一 | PHASE-8 で対応 |

---

## 8. 進捗トラッキング

| Phase | ステータス | 完了日 |
|-------|----------|--------|
| PHASE-0〜7 | [DONE] | 2026-01-01 |
| PHASE-8 | [DONE] | 2026-01-01 |
| PHASE-9 | [DONE] | 2026-01-01 |
| PHASE-10 | [DONE] | 2026-01-01 |
| PHASE-11 | [DONE] | 2026-01-01 |
| PHASE-12 | [DONE] | 2026-01-01 |
| PHASE-13 | [DONE] | 2026-01-01 |

### PHASE-9 完了時の残作業

以下の作業は PHASE-13 で対応する：

1. **guides/ 以下のファイルの参照更新** - STEP-13.1 で対応
2. **constitution.md の参照更新** - STEP-13.1 で対応
3. **workflows/shared/*.md の参照更新** - STEP-13.1 で対応

---

## 9. 実装順序（推奨）

```
PHASE-8: 設計基盤の確立
    ↓
PHASE-9: ワークフロー再構成
    ↓
PHASE-10: Input/QA 再設計
    ↓
PHASE-11: Feature Draft システム実装
    ↓
PHASE-12: Critical 問題修正
    ↓
PHASE-13: 検証
```

**理由:**
1. まず設計思想を文書化（PHASE-8）
2. 次にワークフロー構造を整理（PHASE-9）
3. Input/QA はワークフロー構造に依存（PHASE-10）
4. Feature Draft はワークフロー構造に依存（PHASE-11）
5. Critical 修正は独立して可能だが、ワークフロー後が安全（PHASE-12）
6. 最後に全体検証（PHASE-13）

---

## 10. Compact 後の再開チェックリスト

compact 発生後、以下を確認：

1. [ ] このファイル (MASTER-PLAN-v2.md) を読み込み
2. [ ] 進捗トラッキング（Section 8）で現在のフェーズを確認
3. [ ] [IN-PROGRESS] のステップを探す
4. [ ] そのステップから作業を再開

---

## 11. セルフチェック結果

**実施日:** 2026-01-01
**チェック観点:** 設計一貫性、抜け漏れ、実装可能性、依存関係、用語統一、フロー整合性

---

### 11.1 良好な点 ✅

| # | 項目 | 評価 |
|---|------|------|
| 1 | 設計思想の一貫性 | ✅ 1.1〜1.3 で明確に定義 |
| 2 | ファイル構成の整理 | ✅ 削除/新規作成が明確 |
| 3 | issue タイプの状態パターン | ✅ 5パターンを網羅 |
| 4 | PHASE 間の依存関係 | ✅ 実装順序の理由が説明済み |
| 5 | Input 必須化の理由 | ✅ 各タイプで理由が明記 |
| 6 | plan.md の Spec タイプ対応 | ✅ STEP-9.5 で対応済み |

---

### 11.2 発見された問題・改善点 ⚠️

| # | 問題 | 重要度 | 対応 | 状態 |
|---|------|--------|------|------|
| 1 | **tasks.md / implement.md も Feature Spec 前提の可能性** | 中 | STEP-9.5 に追加確認を追記 | 未対応 |
| 2 | **fix タイプの Quick 判定後の分岐が不正確** | 高 | 2.1 の表を修正 | ✅ 2.1.4 で対応 |
| 3 | **fix の QA 省略が明記されていない** | 高 | 2.1 または別セクションに追記 | ✅ 2.1.1 で対応済み |
| 4 | **change の後のフロー（Plan 要否）が不明確** | 中 | change.md の設計を詳細化 | ✅ 2.1.2 で対応済み |
| 5 | **STEP-10.2 と STEP-12.2 の重複** | 低 | 整理（STEP-10.2 に統合） | ✅ 対応済み |
| 6 | **project-setup の QA 形式が未定義** | 中 | PHASE-11 で対応 | 未対応 |
| 7 | **Multi-Review の対象が不明確** | 高 | feature/fix/change それぞれの品質フローを明記 | ✅ 2.1.1, 2.1.3 で対応 |
| 8 | **`_impact-guard.md` が未定義** | 高 | 2.1.4 + STEP-9.2 に追加 | ✅ 対応済み |
| 9 | **SKILL.md Entry セクションの詳細が未定義** | 高 | STEP-9.1 を詳細化 | ✅ 対応済み |
| 10 | **change タイプの品質フロー未定義** | 高 | 2.1.3 を追加 | ✅ 対応済み |

---

### 11.3 修正が必要な箇所（適用済み ✅）

以下の修正はすべて適用済みです。

| # | 修正内容 | 対象箇所 | 状態 |
|---|---------|---------|------|
| 1 | fix 行の表記修正 | 2.1 Entry テーブル | ✅ 適用済み |
| 2 | fix の品質フロー追記 | 2.1.1 新規セクション | ✅ 適用済み |
| 3 | change の後続フロー追記 | 2.1.2 新規セクション | ✅ 適用済み |
| 4 | STEP-10.2 と STEP-12.2 の整理 | STEP-12.2 | ✅ 適用済み |

---

### 11.4 追加確認が必要な項目

| # | 項目 | 確認タイミング | 確認方法 |
|---|------|---------------|---------|
| 1 | tasks.md が Fix Spec に対応しているか | PHASE-9 | ファイル読み込みで確認 |
| 2 | implement.md が Fix Spec に対応しているか | PHASE-9 | ファイル読み込みで確認 |
| 3 | templates/fix-spec.md が存在するか | PHASE-10 | Glob で確認 |
| 4 | Input ファイルの実際の保存場所 | PHASE-10 | 既存の Input 運用を確認 |

---

### 11.5 セルフチェック結論

**総合評価:** ✅ 設計は良好、即時修正はすべて適用済み

**即時修正:** ✅ すべて完了
1. ✅ 2.1 の fix 行の表記修正
2. ✅ fix の品質フロー追記（2.1.1）
3. ✅ change の後続フロー追記（2.1.2）
4. ✅ STEP-10.2 と STEP-12.2 の整理

**PHASE 実行時に確認:**
1. tasks.md / implement.md の Spec タイプ対応（PHASE-9）
2. templates/fix-spec.md の存在確認（PHASE-10）
3. Input ファイルの保存場所（PHASE-10）

---

**次のアクション:** PHASE-8（設計基盤の確立）を開始
