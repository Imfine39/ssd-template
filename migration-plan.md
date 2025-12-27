# SSD-MESH コンテキスト最適化 移行計画

## 概要

現在の問題：**941行が常時コンテキストを消費**（CLAUDE.md 236 + SKILL.md 228 + constitution.md 477）

目標：
- コンテキスト負荷を **大幅削減**（品質優先、行数は目安）
- コード重複を削減（スクリプト共通化）
- 保守性の大幅向上

**重要:** 行数の記載は目安であり、品質を犠牲にして行数を厳守することはしない。コンテキスト削減の目的は精度向上であり、精度を下げては本末転倒。

### Step 7 冗長性調査の反映

このプランは `docs/workflow-fix-trace.md` Step 7 の6並列Agent調査結果を統合：

| Agent | 調査内容 | 反映先 Phase |
|-------|---------|-------------|
| A | ワークフロー間ロジック重複 (560-720行) | Phase 6（統合版） |
| B | テンプレート構造重複 (155-206行) | Phase 7（オプション） |
| C | ドキュメント/ガイド重複 | Phase 8 |
| D | コア定義の役割分担 | Phase 2, 3, 4 |
| E | スクリプト機能重複 (840行) | Phase 1, 5 |
| F | TodoWrite/Self-Check冗長性 (40-45%) | Phase 6（統合版） |

**最適化:** 旧 Phase 6（共通コンポ）と旧 Phase 8（TodoWrite簡略化）を統合。ワークフロー編集を1回で完了。

---

## Phase 0: 準備（ブランチ作成・現状コミット）

**作業内容:**
1. 現在の未コミット変更をコミット
2. 新ブランチ `refactor/context-optimization` を作成
3. バックアップ用タグを作成

**ファイル:** なし（git操作のみ）

---

## Phase 1: スクリプト共通ライブラリ作成

**リスク:** 低（新規作成のみ、既存変更なし）
**削減効果:** 基盤整備

### 1.1 ディレクトリ作成
```
.claude/skills/spec-mesh/scripts/lib/
  ├─ index.js
  ├─ paths.js      (80行)
  ├─ spec-parser.js (120行)
  ├─ file-utils.js  (150行)
  └─ cli-utils.js   (100行)
```

### 1.2 各ライブラリの責務

| ファイル | 責務 | 統合元 |
|----------|------|--------|
| paths.js | パス定義一元化 | state.cjs, validate-matrix.cjs, generate-matrix-view.cjs |
| spec-parser.js | Spec解析 | spec-lint.cjs, spec-metrics.cjs |
| file-utils.js | ファイルI/O | 全スクリプト |
| cli-utils.js | CLI引数・Git操作 | 全スクリプト |

---

## Phase 2: Constitution 分割

**リスク:** 低（新規作成 + 既存は後で削除）
**削減効果:** 477行 → 必要な部分のみ読み込み

### 2.1 新ディレクトリ構造
```
.claude/skills/spec-mesh/constitution/    # ハブ Skill 内に配置
  ├─ core.md           - 全スキル共通の最重要ルール
  ├─ spec-creation.md  - Spec作成ルール
  ├─ quality-gates.md  - CLARIFY GATE, Multi-Review, HUMAN_CHECKPOINT
  ├─ git-workflow.md   - ブランチ、PR、マージ
  └─ terminology.md    - ID体系、ステータス値
```

**注意:** 行数は目安。品質を優先し、必要な情報は省略しない。

### 2.2 各ファイルの内容

**core.md (常時読み込み):**
- Mission（Spec-First Development）
- 絶対ルール（main直push禁止、推測禁止、Spec is Truth、Type Safety）
- 優先順位（Constitution > Spec > Clarify）

**quality-gates.md (品質関連ワークフローが読み込み):**
- CLARIFY GATE 定義
- Multi-Review 3観点パターン
- HUMAN_CHECKPOINT ポリシー（5種類）
- Severity Classifications

**spec-creation.md (Spec作成ワークフローが読み込み):**
- Spec Types 定義
- Status ライフサイクル
- テンプレート使用規則
- [NEEDS CLARIFICATION] マーカー

**git-workflow.md (Git操作ワークフローが読み込み):**
- ブランチ命名規則
- コミットメッセージ形式
- PR作成ルール

**terminology.md (必要時のみ):**
- ID Formats
- ステータス値定義

---

## Phase 3: Skill 分割

**リスク:** 中（構造変更）
**削減効果:** 228行 → 25-50行/スキル

### 3.0 分割軸の比較検討

#### 案A: フェーズ軸（元の提案）
```
init(3) → dev(9) → qa(3) → spec(5) → ops(1)
```
**問題:** dev が大きすぎ（9ワークフロー）、ops が小さすぎ（1ワークフロー）

#### 案B: 機能クラスター軸（推奨）
ワークフロー依存関係分析に基づく分割：
```
entry(6) → develop(4) → quality(5) → test(2) → meta(3)
```

| クラスター | 根拠 |
|------------|------|
| entry | 全ての作業開始点。ルーティング+基本ルールを共有 |
| develop | plan→tasks→implement→feedback は順次チェーン |
| quality | review/clarify/lint は常にセットで使用（7ワークフローから呼ばれる） |
| test | test-scenario→e2e は常にペア |
| meta | PR、Spec変更等のメタ操作（仕様に関する操作） |

#### 案C: 頻度軸
```
frequent(5) → moderate(5) → rare(11)
```
**問題:** 関連ワークフローが分断される

#### 採用: 案B（機能クラスター軸）

### 3.1 新スキル構造（機能クラスター軸）

**公式ドキュメント準拠:**
- 各 Skill は SKILL.md 必須（name, description 必須）
- 共有リソースは Skill ではなく通常ディレクトリ（相対パスで参照）
- spec-mesh を「ハブ Skill」として共有リソースを保持

```
.claude/skills/
  │
  ├─ spec-mesh/           # ハブ Skill（共有リソース保持）
  │   ├─ SKILL.md         # 必須：メタデータ + 共有リソースへの案内
  │   ├─ constitution/    # 分割された Constitution ファイル
  │   │   ├─ core.md
  │   │   ├─ spec-creation.md
  │   │   ├─ quality-gates.md
  │   │   ├─ git-workflow.md
  │   │   └─ terminology.md
  │   ├─ templates/       # 共有テンプレート
  │   ├─ guides/          # 共有ガイド
  │   └─ scripts/         # 共有スクリプト
  │
  ├─ spec-mesh-entry/     # 作業開始点（6ワークフロー）
  │   ├─ SKILL.md         # 必須：name, description
  │   └─ workflows/
  │       ├─ vision.md
  │       ├─ design.md
  │       ├─ add.md
  │       ├─ fix.md
  │       ├─ issue.md
  │       └─ quick.md
  │
  ├─ spec-mesh-develop/   # 実装チェーン（4ワークフロー）
  │   ├─ SKILL.md
  │   └─ workflows/
  │       ├─ plan.md
  │       ├─ tasks.md
  │       ├─ implement.md
  │       └─ feedback.md
  │
  ├─ spec-mesh-quality/   # 品質保証（5ワークフロー）
  │   ├─ SKILL.md
  │   └─ workflows/
  │       ├─ review.md      ← 最も呼ばれるワークフロー
  │       ├─ clarify.md
  │       ├─ lint.md
  │       ├─ checklist.md
  │       └─ analyze.md
  │
  ├─ spec-mesh-test/      # テスト（2ワークフロー）
  │   ├─ SKILL.md
  │   └─ workflows/
  │       ├─ test-scenario.md
  │       └─ e2e.md
  │
  └─ spec-mesh-meta/      # メタ操作（3ワークフロー）
      ├─ SKILL.md         # ※ "release" → "meta" に変更
      └─ workflows/
          ├─ pr.md
          ├─ change.md
          └─ featureproposal.md
          # ※ spec.md は削除（scaffold-spec.cjs の薄いラッパー。
          #    他ワークフローが適切なコンテキストで Spec 作成を行う）
```

**各 Skill から共有リソースへの参照例:**
```markdown
# spec-mesh-entry/SKILL.md 内
詳細は [constitution/core.md](../spec-mesh/constitution/core.md) を参照
```

### 3.2 SKILL.md フォーマット（公式準拠）

各 SKILL.md は以下の YAML フロントマッター必須：

```yaml
---
name: spec-mesh-entry
description: |
  SSD 作業開始ワークフロー。Vision作成、Design、機能追加、バグ修正、Issue開始を担当。
  トリガー: 「Vision を作成」「機能を追加」「バグを修正」「Issue から開始」
---

# spec-mesh-entry

## 概要
作業開始点となるワークフローを提供。

## ワークフロー一覧
- [vision.md](workflows/vision.md) - Vision Spec 作成
- [add.md](workflows/add.md) - 新機能追加
...

## Constitution 参照
- [core.md](../spec-mesh/constitution/core.md) - 必須
- [spec-creation.md](../spec-mesh/constitution/spec-creation.md) - Spec作成時
```

### 3.3 各スキルの Constitution 依存

| スキル | core.md | spec-creation.md | quality-gates.md | git-workflow.md |
|--------|---------|------------------|------------------|-----------------|
| spec-mesh (hub) | ✓ | ✓ | ✓ | ✓ |
| entry   | ✓       | ✓                | -                | ✓               |
| develop | ✓       | ✓                | ✓                | -               |
| quality | ✓       | -                | ✓                | -               |
| test    | ✓       | -                | ✓                | -               |
| meta    | ✓       | ✓                | -                | ✓               |

### 3.4 ワークフロー間参照の更新

ワークフロー間の参照パスを更新する必要がある：

| 現在 | 更新後 |
|------|--------|
| `workflows/review.md` | `../spec-mesh-quality/workflows/review.md` |
| `workflows/clarify.md` | `../spec-mesh-quality/workflows/clarify.md` |
| `workflows/lint.md` | `../spec-mesh-quality/workflows/lint.md` |
| `workflows/plan.md` | `../spec-mesh-develop/workflows/plan.md` |

### 3.5 コンテキスト負荷比較

| ワークフロー | Before | After | 削減率 |
|--------------|--------|-------|--------|
| vision.md    | 941行  | ~300行 | 68% |
| implement.md | 941行  | ~350行 | 63% |
| pr.md        | 941行  | ~145行 | 85% |
| lint.md      | 941行  | ~215行 | 77% |

---

## Phase 4: CLAUDE.md 簡略化

**リスク:** 低
**削減効果:** 236行 → 50行

### 4.1 新 CLAUDE.md 構造

```markdown
# Claude Code Development Guide

## Priority Rules
| 優先度 | ルール |
|--------|--------|
| 1 | Core Constitution |
| 2 | Vision / Domain / Screen / Feature Spec |
| 3 | 不明点は Clarify（推測禁止） |

## Skill Routing
| ユーザーの依頼 | Skill |
|----------------|-------|
| Vision作成、Design、機能追加、バグ修正、Issue開始 | spec-mesh-entry |
| 実装計画、タスク分割、実装、フィードバック | spec-mesh-develop |
| レビュー、Lint、曖昧点解消、品質チェック | spec-mesh-quality |
| テストシナリオ、E2Eテスト | spec-mesh-test |
| PR作成、Spec変更、Feature提案 | spec-mesh-meta |

## Quick Input Files
(現状維持)

## Essential Scripts
(現状維持)

## Project-Specific Rules
(現状維持)
```

---

## Phase 5: スクリプト統合・移行

**リスク:** 中
**削減効果:** ~22%（950行）

### 5.1 スクリプト統合

| 統合後 | 統合元 |
|--------|--------|
| input.cjs | preserve-input.cjs + reset-input.cjs |
| matrix-ops.cjs | generate-matrix-view.cjs + validate-matrix.cjs |

### 5.2 ライブラリ移行

全スクリプトを lib/ モジュールに依存するよう更新

---

## Phase 6: ワークフロー最適化（共通コンポ + TodoWrite/Self-Check 統合）

**リスク:** 中（既存ワークフローへの参照追加）
**削減効果:** 560-720行 + Todo 40%削減、Self-Check 45%削減

**注意:** 旧 Phase 6, 7, 8 を統合。ワークフロー編集は1回で完了させる。

### 6.1 共通コンポーネント作成

```
.claude/skills/spec-mesh/workflows/shared/
  ├─ impact-analysis.md    # 既存（維持）
  ├─ _clarify-gate.md      # CLARIFY GATE 実行手順（quality-gates.md を参照）
  ├─ _multi-review.md      # Multi-Review 実行手順（quality-gates.md を参照）
  └─ _preserve-input.md    # Input 保存・リセット手順
```

**重要: 定義と手順の分離**
- `constitution/quality-gates.md`: **ポリシー定義**（なぜ必要か、何がルールか）
- `shared/_*.md`: **実行手順**（どう実行するか）
- 共通コンポーネントは必ず constitution を参照し、定義の二重管理を避ける

### 6.2 ワークフロー一括更新

各ワークフローで以下を同時に実施（2回編集を避ける）：

| 変更内容 | 対象WF数 |
|---------|---------|
| 共通コンポーネント参照に置換 | 7-8 WF |
| TodoWrite から重複項目削除 | 6-10 WF |
| Self-Check の簡略化 | 10 WF |

### 6.3 参照ルール（精度低下防止）

**参照は最大2段階まで:**
```
OK:  add.md → shared/_clarify-gate.md
OK:  _clarify-gate.md → constitution/quality-gates.md
NG:  add.md → review.md → quality-gates.md → _multi-review.md (4段階)
```

**共通コンポーネントはインライン展開可:**
```markdown
### Step N: CLARIFY GATE チェック
> 以下を実行: [shared/_clarify-gate.md](shared/_clarify-gate.md)
> ※ 参照先の内容をインライン展開してもよい
```

---

## Phase 7: テンプレート部分化（オプション）

**リスク:** 低
**削減効果:** 155-206行（ROI は限定的）
**判断:** 実装コスト（6ファイル作成 + scaffold-spec.cjs 修正）が高いため、**Phase 10 完了後に再評価**

### 7.1 実施条件

以下の条件を満たす場合のみ実施：
1. Phase 1-6 が安定動作している
2. テンプレート重複が実際に保守コストを発生させている
3. scaffold-spec.cjs の修正リソースが確保できる

### 7.2 スキップ時の代替策

テンプレート内に constitution 参照コメントを追加：
```markdown
<!-- Status 値は constitution/terminology.md を参照 -->
```

---

## Phase 8: ドキュメント整理

**リスク:** 低
**削減効果:** 構造改善（Step 7 Agent C 調査結果）

### 8.1 重複解消（定義の一本化）

| 重複内容 | マスター | 他は参照のみ |
|---------|---------|------------|
| CLARIFY GATE 定義 | constitution/quality-gates.md | CLAUDE.md, SKILL.md は参照 |
| HUMAN_CHECKPOINT 定義 | constitution/quality-gates.md | 同上 |
| テストケースID形式 | guides/id-naming.md | 同上 |
| 開発フロー説明 | docs/Development-Flow.md | 同上 |

### 8.2 ファイル移行/統合

| 現在 | 移行先 |
|------|--------|
| docs/workflow-fix-trace.md | .specify/TRACE.md（プロジェクト固有） |
| docs/Getting-Started.md | スコープ縮小（240行→150行） |

---

## Phase 9: クリーンアップ・テスト

**作業内容:**

### 9.1 クリーンアップ
1. 旧 `constitution.md` を削除（分割済み）
2. 旧 `workflows/` ディレクトリを削除（各 Skill に移動済み）
3. 不要になったファイルの削除

### 9.2 動作テスト

各 Skill ごとにテスト：

| Skill | テスト内容 |
|-------|-----------|
| spec-mesh (hub) | 共有リソースへのアクセス確認 |
| entry | vision, add, fix の実行確認 |
| develop | plan → tasks → implement チェーン確認 |
| quality | review → clarify → lint ループ確認 |
| test | test-scenario → e2e 連携確認 |
| meta | pr, change 実行確認 |

### 9.3 ドキュメント更新
1. `CLAUDE.md` の Skill Routing 最終確認
2. `.claude/skills/spec-mesh/templates/CLAUDE.template.md` の同期
3. `docs/` 内ドキュメントのパス更新
4. `update.cjs` の新構造対応

---

## 実行順序と依存関係

```
Phase 0: 準備
    │
    ▼
Phase 1: スクリプトlib作成 ←── リスク最小、基盤整備
    │
    ▼
Phase 2: Constitution分割 ←── 新規作成のみ
    │
    ▼
Phase 3: Skill分割 ←── Phase 2に依存
    │
    ▼
Phase 4: CLAUDE.md簡略化 ←── Phase 3に依存
    │
    ▼
Phase 5: スクリプト統合・移行 ←── Phase 1のlibを使用
    │
    ├──────────────────────────────┐
    ▼                              ▼
Phase 6: ワークフロー最適化    Phase 8: ドキュメント整理
(共通コンポ+TodoWrite統合)     (並列実行可能)
    │                              │
    ├──────────────────────────────┘
    ▼
Phase 7: テンプレート部分化 ←── オプション（Phase 9完了後に再評価）
    │
    ▼
Phase 9: クリーンアップ・テスト
```

### Phase 統合の効果

| Before | After | 理由 |
|--------|-------|------|
| 10 Phase | 9 Phase | Phase 6,8 統合（ワークフロー編集を1回に） |
| Phase 7 必須 | Phase 7 オプション | ROI が低いため再評価 |
| Phase 6→7→8 直列 | Phase 6∥8 並列 | 依存関係の整理 |

---

## リスクと軽減策

| リスク | 影響 | 軽減策 |
|--------|------|--------|
| ワークフロー参照切れ | 高 | 各Phase後にテスト |
| Constitution内容欠落 | 高 | 旧新の差分確認 |
| クロススキルコンテキスト不足 | 中 | Constitution依存を明確化 |
| 後方互換性 | 中 | 旧スクリプトをラッパーとして残す |
| **参照深度による精度低下** | 中 | **最大2段階ルール** + インライン展開許可 |
| **定義の二重管理** | 中 | **constitution = ポリシー、shared = 手順** の分離 |
| **相対パス複雑化** | 低 | SKILL.md にパスマッピング記載 |

---

## 成功基準

### コンテキスト削減
- [ ] コンテキスト負荷 60%以上削減（941行 → ~375行）

### 構造改善（Step 7 調査結果の反映）
- [ ] ワークフロー共通コンポーネント化（560-720行削減）
- [ ] テンプレート部分化（155-206行削減）
- [ ] TodoWrite/Self-Check 40-45%削減
- [ ] スクリプト共通ライブラリ化（840行+3スクリプト削減）

### 動作確認
- [ ] 全20ワークフローが動作
- [ ] 全スキルが正しくルーティング
- [ ] 共有リソースへの参照が機能

### ドキュメント整合性
- [ ] Constitution 分割の内容欠落なし
- [ ] ワークフロー間参照パス更新完了
- [ ] docs/ と guides/ の責務分担明確化

---

## 修正対象ファイル一覧

### 新規作成

**Phase 1: スクリプト共通ライブラリ**
- `.claude/skills/spec-mesh/scripts/lib/index.js`
- `.claude/skills/spec-mesh/scripts/lib/paths.js`
- `.claude/skills/spec-mesh/scripts/lib/spec-parser.js`
- `.claude/skills/spec-mesh/scripts/lib/file-utils.js`
- `.claude/skills/spec-mesh/scripts/lib/cli-utils.js`

**Phase 2: Constitution 分割**
- `.claude/skills/spec-mesh/constitution/core.md`
- `.claude/skills/spec-mesh/constitution/spec-creation.md`
- `.claude/skills/spec-mesh/constitution/quality-gates.md`
- `.claude/skills/spec-mesh/constitution/git-workflow.md`
- `.claude/skills/spec-mesh/constitution/terminology.md`

**Phase 3: Skill 分割**
- `.claude/skills/spec-mesh-entry/SKILL.md`
- `.claude/skills/spec-mesh-develop/SKILL.md`
- `.claude/skills/spec-mesh-quality/SKILL.md`
- `.claude/skills/spec-mesh-test/SKILL.md`
- `.claude/skills/spec-mesh-meta/SKILL.md`

**Phase 5: スクリプト統合**
- `.claude/skills/spec-mesh/scripts/input.cjs` (preserve + reset 統合)
- `.claude/skills/spec-mesh/scripts/matrix-ops.cjs` (generate + validate 統合)

**Phase 6: ワークフロー共通コンポーネント**
- `.claude/skills/spec-mesh/workflows/shared/_clarify-gate.md`
- `.claude/skills/spec-mesh/workflows/shared/_multi-review.md`
- `.claude/skills/spec-mesh/workflows/shared/_preserve-input.md`

**Phase 7: テンプレートパーシャル（オプション - Phase 9完了後に再評価）**
- `.claude/skills/spec-mesh/templates/partials/_metadata-header.md`
- `.claude/skills/spec-mesh/templates/partials/_status-comment.md`
- `.claude/skills/spec-mesh/templates/partials/_open-questions.md`
- `.claude/skills/spec-mesh/templates/partials/_clarifications-table.md`
- `.claude/skills/spec-mesh/templates/partials/_changelog-table.md`
- `.claude/skills/spec-mesh/templates/partials/_original-input.md`

### 修正

**Phase 4: CLAUDE.md 簡略化**
- `CLAUDE.md` - Skill Routing 中心に簡略化
- `.claude/skills/spec-mesh/templates/CLAUDE.template.md` - CLAUDE.md と同期

**Phase 3: ハブ Skill 再構成**
- `.claude/skills/spec-mesh/SKILL.md` - ハブ Skill として再構成

**Phase 5: スクリプト移行**
- `.claude/skills/spec-mesh/scripts/*.cjs` - lib依存に変更

**Phase 6: ワークフロー更新（統合版）**
- 全20ワークフロー - 共通コンポーネント参照 + TodoWrite/Self-Check 簡略化を同時実施

**Phase 7: テンプレート更新（オプション）**
- `templates/vision-spec.md` - パーシャル参照に変更
- `templates/domain-spec.md` - パーシャル参照に変更
- `templates/screen-spec.md` - パーシャル参照に変更
- `templates/feature-spec.md` - パーシャル参照に変更
- `templates/fix-spec.md` - パーシャル参照に変更

**Phase 8: ドキュメント整理**
- `docs/Development-Flow.md` - マスター情報源として整理
- `docs/Workflows-Reference.md` - 新 Skill 構造に対応
- `docs/Getting-Started.md` - スコープ縮小
- `guides/id-naming.md` - テストケースID形式のマスター化

### 移動

**Phase 3: ワークフロー分配**
- `.claude/skills/spec-mesh/workflows/*.md` → 各スキルの `workflows/` へ
  - entry: vision, design, add, fix, issue, quick
  - develop: plan, tasks, implement, feedback
  - quality: review, clarify, lint, checklist, analyze
  - test: test-scenario, e2e
  - meta: pr, change, featureproposal

**Phase 8: ドキュメント移行**
- `docs/workflow-fix-trace.md` → `.specify/TRACE.md`

### 削除

**Phase 3: 不要ワークフロー**
- `workflows/spec.md` - 不要（scaffold-spec.cjs の薄いラッパー）

**Phase 9: クリーンアップ**
- 旧 `constitution.md` (分割後)
- 旧 `workflows/` ディレクトリ (移動後)
- `scripts/preserve-input.cjs` (input.cjs に統合後)
- `scripts/reset-input.cjs` (input.cjs に統合後)
- `scripts/generate-matrix-view.cjs` (matrix-ops.cjs に統合後)
- `scripts/validate-matrix.cjs` (matrix-ops.cjs に統合後)
