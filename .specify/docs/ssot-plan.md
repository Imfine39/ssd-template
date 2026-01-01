# SSOT（Single Source of Truth）確立計画

**作成日:** 2025-12-31
**ステータス:** 計画中
**影響範囲:** spec-mesh フレームワーク全体（30+ ファイル）

---

## Executive Summary

spec-mesh フレームワークにおいて、重要な概念定義が複数箇所に重複しており、変更時の不整合リスクが高い状態にある。本計画では、SSOT アーキテクチャを確立し、段階的にマイグレーションを行う。

---

## 問題分析

### 重複の種類

| タイプ | 説明 | 対応方針 |
|--------|------|---------|
| **定義の重複** | 同じ内容が複数箇所で完全に記述 | SSOT を特定し、他は参照に変更 |
| **部分的重複** | 同じ概念が異なる詳細度で記述 | レイヤー分離（概念 vs 運用）を明確化 |
| **正当な参照** | SSOT への参照リンク | 問題なし（維持） |

### 重複項目の詳細分析

#### 1. CLARIFY GATE

| ファイル | 内容 | 行数 | 役割 |
|---------|------|------|------|
| `constitution/quality-gates.md` | 概念定義、Pass Conditions、Flow図 | ~50行 | **定義層 SSOT** |
| `workflows/shared/_clarify-gate.md` | 実行手順、出力テンプレート、呼び出し方 | ~287行 | **運用層 SSOT** |
| 各ワークフロー | インライン使用 | 様々 | 参照元 |

**分析:**
- 現状は「定義」と「運用」が別ファイルで、これは**適切な分離**
- 問題は**相互参照が不明確**なこと
- 各ワークフローでのインライン記述が重複源

**推奨アーキテクチャ:**
```
quality-gates.md (WHAT: 定義)
        ↓ 参照
_clarify-gate.md (HOW: 運用手順)
        ↓ 参照
各ワークフロー (USE: 呼び出し)
```

---

#### 2. Multi-Review 3観点

| ファイル | 内容 | 役割 |
|---------|------|------|
| `constitution/quality-gates.md` | 3観点の定義テーブル | **定義層 SSOT** |
| `workflows/shared/_quality-flow.md` | 実行フロー | **運用層 SSOT** |
| `spec-mesh-quality/workflows/review.md` | 詳細レビュー手順 | 運用詳細 |

**分析:**
- 3観点（構造・内容・完全性）の定義が複数箇所で記述
- `quality-gates.md` の定義が最も簡潔
- `_quality-flow.md` は実行方法を記述

**推奨:**
- `quality-gates.md` を 3観点定義の SSOT とする
- `_quality-flow.md` は明示的に `quality-gates.md` を参照

---

#### 3. HUMAN_CHECKPOINT Policy

| ファイル | 内容 | 役割 |
|---------|------|------|
| `constitution/quality-gates.md` | ポリシー、トリガー条件、5パターン | **定義層 SSOT** |
| `guides/human-checkpoint-patterns.md` | 詳細な使用パターン | 運用ガイド |

**分析:**
- 現状は適切に分離されている
- 各ワークフローでの参照が一貫していることを確認

---

#### 4. Spec Creation Flow

| ファイル | 内容 | 問題点 |
|---------|------|--------|
| `constitution/core.md` | 詳細フロー図（ASCII） | **SSOT 候補** |
| `CLAUDE.md` | 同等のフロー図 | 重複 |
| `spec-mesh/SKILL.md` | 簡略フロー図 | 重複 |
| 各子スキル SKILL.md | 参照または簡略版 | 様々 |

**分析:**
- **最も深刻な重複**
- 5箇所で同じフロー図が存在
- 変更時に5箇所すべてを更新する必要あり

**推奨:**
- `constitution/core.md` を SSOT とする
- `CLAUDE.md` は簡略版 + 参照リンク
- `SKILL.md` は参照リンクのみ

---

## SSOT アーキテクチャ

### レイヤー構造

```
┌─────────────────────────────────────────────────────────────────┐
│                     SSOT Architecture                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: 定義層（Constitution）                                 │
│    ├─ constitution/core.md           → Spec Creation Flow       │
│    ├─ constitution/quality-gates.md  → CLARIFY GATE, Multi-Review│
│    ├─ constitution/terminology.md    → ID形式, Status値         │
│    └─ constitution/git-workflow.md   → Git操作ルール             │
│                                                                 │
│  Layer 2: 運用層（Shared Workflows）                             │
│    ├─ workflows/shared/_clarify-gate.md   → CLARIFY GATE 実行   │
│    ├─ workflows/shared/_quality-flow.md   → Quality Flow 実行   │
│    ├─ workflows/shared/_cascade-update.md → Cascade Update 実行 │
│    └─ workflows/shared/_finalize.md       → 完了処理実行         │
│                                                                 │
│  Layer 3: ガイド層（Guides）                                      │
│    ├─ guides/human-checkpoint-patterns.md                       │
│    ├─ guides/judgment-criteria.md                               │
│    └─ guides/workflow-map.md                                    │
│                                                                 │
│  Layer 4: 利用層（Workflows / SKILL.md）                         │
│    └─ 上位レイヤーを参照して使用                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 参照パターン

各レイヤー間の参照方法を標準化：

#### パターン A: 定義参照（概念のみ）

```markdown
### CLARIFY GATE

> **定義:** [quality-gates.md](path/to/quality-gates.md#clarify-gate) 参照

判定: PASSED / PASSED_WITH_DEFERRED / BLOCKED
```

#### パターン B: 運用参照（実行手順）

```markdown
### Step N: CLARIFY GATE チェック

**★ スキップ禁止 ★**

> **運用手順:** [_clarify-gate.md](path/to/_clarify-gate.md) を実行
```

#### パターン C: インライン簡略 + 参照

```markdown
### Spec Creation Flow

```
Entry → Spec → Interview → Review → Lint → CLARIFY GATE → Plan → Implement
```

> **詳細フロー:** [constitution/core.md](path/to/core.md#spec-driven-workflow) 参照
```

---

## マイグレーション計画

### Phase 0: 準備（1-2時間）

#### 0.1 SSOT 宣言の追加

各 SSOT ファイルの先頭に SSOT 宣言を追加：

```markdown
<!-- SSOT: CLARIFY GATE 定義 -->
<!-- 他のファイルはこのセクションを参照すること。定義の複製禁止。 -->
```

#### 0.2 参照先アンカーの整備

`quality-gates.md` にアンカーを追加：
- `#clarify-gate`
- `#multi-review`
- `#human-checkpoint-policy`

---

### Phase 1: Spec Creation Flow 統一（高優先度）

**影響ファイル:** 5ファイル
**リスク:** 低（ドキュメントのみ）

#### 1.1 core.md を SSOT として確定

```markdown
## Spec Creation Flow

<!-- SSOT: Spec Creation Flow -->
<!-- 他のファイルはこのフローを参照すること。完全な複製禁止。 -->

```
Entry → Spec → Interview → Multi-Review → Lint → CLARIFY GATE → Plan → Implement
```
[詳細フロー図]
```

#### 1.2 CLAUDE.md の更新

```markdown
## Core Flow

> **SSOT:** [constitution/core.md](.claude/skills/spec-mesh/constitution/core.md#spec-driven-workflow)

```
Entry → Spec → Interview → Review → Lint → CLARIFY GATE → Plan → Implement
```

詳細は上記リンク参照。
```

#### 1.3 spec-mesh/SKILL.md の更新

```markdown
## Spec Creation Flow

> **詳細:** [constitution/core.md](constitution/core.md#spec-driven-workflow) 参照
```

#### 1.4 各子スキル SKILL.md

フロー図を削除し、Hub SKILL.md への参照のみに変更。

---

### Phase 2: CLARIFY GATE 参照整理（中優先度）

**影響ファイル:** 10+ファイル
**リスク:** 低

#### 2.1 quality-gates.md に SSOT マーカー追加

```markdown
## CLARIFY GATE

<!-- SSOT: CLARIFY GATE 定義 -->

### Definition
...
```

#### 2.2 _clarify-gate.md の冒頭に参照追加

```markdown
# CLARIFY GATE（曖昧点チェック）共通コンポーネント

> **概念定義:** [quality-gates.md](../../constitution/quality-gates.md#clarify-gate) 参照
>
> このファイルは CLARIFY GATE の**運用手順**を定義します。

...
```

#### 2.3 各ワークフローの統一

インラインの Pass Conditions テーブルを削除し、参照に置換：

```markdown
### Step N: CLARIFY GATE

> **運用:** [_clarify-gate.md](path) を実行

判定結果に応じて:
- BLOCKED → clarify へ
- PASSED → 次のステップへ
```

---

### Phase 3: Multi-Review 参照整理（中優先度）

**影響ファイル:** 10ファイル
**リスク:** 低

#### 3.1 quality-gates.md に SSOT マーカー追加

```markdown
## Multi-Review

<!-- SSOT: Multi-Review 3観点定義 -->

### Three Perspectives
| Reviewer | Focus | Checks |
|----------|-------|--------|
| A: 構造 | Template準拠、形式 | ... |
| B: 内容 | 整合性、矛盾 | ... |
| C: 完全性 | 網羅性、欠落 | ... |
```

#### 3.2 _quality-flow.md の更新

```markdown
### Step 2: Multi-Review（3観点並列レビュー）

> **3観点定義:** [quality-gates.md](../../constitution/quality-gates.md#multi-review) 参照

3つの reviewer agent を並列で起動:
- Reviewer A: 構造・形式
- Reviewer B: 内容・整合性
- Reviewer C: 完全性・網羅性
```

---

### Phase 4: HUMAN_CHECKPOINT 参照確認（低優先度）

現状は比較的良好。明示的な参照リンクを追加：

```markdown
### [HUMAN_CHECKPOINT]

> **ポリシー:** [quality-gates.md](path#human-checkpoint-policy)
> **パターン:** [human-checkpoint-patterns.md](path)
```

---

## 検証計画

### 自動検証

```bash
# 1. 重複検出スクリプト（将来実装）
node .claude/skills/spec-mesh/scripts/check-ssot.cjs

# 2. リンク整合性チェック
# 全 .md ファイルのリンクが有効かチェック

# 3. SSOT マーカー検証
# 各 SSOT ファイルにマーカーがあるか確認
```

### 手動検証チェックリスト

- [ ] Spec Creation Flow が core.md のみで定義されているか
- [ ] CLARIFY GATE の Pass Conditions が quality-gates.md のみで定義されているか
- [ ] Multi-Review 3観点が quality-gates.md のみで定義されているか
- [ ] 各ワークフローが適切な参照パターンを使用しているか
- [ ] 参照リンクがすべて有効か

---

## リスク管理

### リスク 1: 参照リンク切れ

**発生条件:** ファイル名変更、セクション名変更
**影響:** ドキュメントの不整合
**対策:**
- アンカー名を安定させる
- リンクチェック自動化

### リスク 2: 情報の過度な分散

**発生条件:** 参照が多すぎて理解に支障
**影響:** 開発者の混乱
**対策:**
- インライン簡略版 + 参照パターンを使用
- 必要最小限の情報はインラインで提供

### リスク 3: マイグレーション中の不整合

**発生条件:** 段階的移行中に一部のみ更新
**影響:** 一時的な不整合
**対策:**
- Phase ごとに完了を確認
- 検証チェックリストを実行

---

## 実行スケジュール

| Phase | 内容 | 優先度 | 推定時間 |
|-------|------|--------|---------|
| 0 | 準備（SSOT マーカー、アンカー整備） | 高 | 1時間 |
| 1 | Spec Creation Flow 統一 | 高 | 2時間 |
| 2 | CLARIFY GATE 参照整理 | 中 | 2時間 |
| 3 | Multi-Review 参照整理 | 中 | 1時間 |
| 4 | HUMAN_CHECKPOINT 参照確認 | 低 | 30分 |
| 検証 | 全体検証 | 必須 | 1時間 |

**合計推定時間:** 7.5時間

---

## 成果物

### 完了時の状態

1. **明確な SSOT 宣言**: 各概念に対して SSOT ファイルが明確
2. **統一された参照パターン**: 全ファイルが同じパターンで参照
3. **検証可能性**: リンク切れ・重複を自動検出可能
4. **保守性向上**: 変更時に1箇所のみ更新で済む

### ドキュメント更新

| ファイル | 更新内容 |
|---------|---------|
| constitution/*.md | SSOT マーカー追加 |
| workflows/shared/_*.md | 定義層への参照追加 |
| CLAUDE.md | 簡略版 + 参照リンク |
| SKILL.md | 参照リンクのみ |
| 各ワークフロー | インライン重複削除、参照に置換 |

---

## 承認

この計画を実行するには、以下の承認が必要：

```
=== [HUMAN_CHECKPOINT] SSOT 計画承認 ===

確認事項:
- [ ] SSOT アーキテクチャの方針を理解したか
- [ ] マイグレーション計画に同意するか
- [ ] 推定時間を許容できるか

承認後、Phase 0 から順に実行します。
```

---

## 参考: 現在の重複状況サマリー

| 概念 | 重複箇所 | SSOT 候補 | 移行難易度 |
|------|---------|-----------|-----------|
| Spec Creation Flow | 5箇所 | core.md | 低 |
| CLARIFY GATE 定義 | 3箇所 | quality-gates.md | 低 |
| Multi-Review 3観点 | 3箇所 | quality-gates.md | 低 |
| HUMAN_CHECKPOINT | 2箇所 | quality-gates.md | 低 |
| Pass Conditions テーブル | 5+箇所 | quality-gates.md | 中 |

---

## 次のアクション

1. **承認待ち**: この計画の承認を得る
2. **Phase 0 実行**: 準備作業
3. **Phase 1-4 実行**: 段階的マイグレーション
4. **検証**: 全体検証とドキュメント
