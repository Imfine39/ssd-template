# Spec-Mesh フレームワーク調査レポート

**調査日:** 2025-12-31
**調査範囲:** spec-mesh 全体（6レイヤー × 67チェック項目）

---

## Executive Summary

| 優先度 | 件数 | 説明 |
|--------|------|------|
| **P1 Critical** | 18件 | 動作を妨げる・誤動作を引き起こす |
| **P2 Major** | 48件 | 品質を損なう・混乱を招く |
| **P3 Minor** | 19件 | 改善すればより良くなる |

---

## P1 Critical Issues（即時修正必須）

### 1. 構造的整合性

#### [P1-STR-001] 存在しない impact-check.cjs への参照
**ファイル:** `workflows/shared/impact-analysis.md:309`

```markdown
# 現状
node .claude/skills/spec-mesh/scripts/impact-check.cjs

# 問題
impact-check.cjs は存在しない
```

**修正:** 参照を削除または正しいスクリプトに置換

---

#### [P1-STR-002] 相対パス shared/impact-analysis.md が解決不能
**ファイル:**
- `spec-mesh-develop/workflows/feedback.md:74`
- `spec-mesh-meta/workflows/change.md:91`
- `spec-mesh-entry/workflows/quick.md:114`

```markdown
# 現状
> **共通コンポーネント:** `shared/impact-analysis.md`

# 問題
これらのファイルから shared/ へのパスが解決不能
正しくは ../../spec-mesh/workflows/shared/impact-analysis.md
```

**修正:** 各ファイルの相対パスを修正

---

### 2. ワークフローロジック

#### [P1-WFL-001] Quick type issue routing 未定義
**ファイル:** `spec-mesh-entry/workflows/issue.md:75-76`

```markdown
# 現状
Classification から Quick type（typo修正等）への遷移が未定義

# 問題
Quick type の issue が来た場合の処理フローがない
```

**修正:** Quick type 判定時の quick.md へのルーティングを追加

---

#### [P1-WFL-002] Entry workflows で Spec 作成後の step 追跡欠落
**ファイル:**
- `spec-mesh-entry/workflows/add.md`
- `spec-mesh-entry/workflows/fix.md`
- `spec-mesh-entry/workflows/issue.md`

```markdown
# 現状
Spec 作成後に state.cjs --set-step spec がない

# 問題
ブランチの現在ステップが追跡されず、再開時に状態が不明
```

**修正:** Spec 作成後に `--set-step spec` を追加

---

### 3. スクリプト品質

#### [P1-SCR-001] post-merge.cjs の変数名不整合
**ファイル:** `scripts/post-merge.cjs:69-91`

```javascript
// 現状
const featureId = ...

// 問題
他のスクリプトでは specId を使用しており不整合
```

**修正:** `featureId` を `specId` にリネーム

---

#### [P1-SCR-002] changelog.cjs 必須パラメータ不足時のエラーハンドリング欠落
**ファイル:** `scripts/changelog.cjs:93-104`

```javascript
// 現状
パラメータチェックなしで処理開始

// 問題
必須パラメータなしで実行すると不明瞭なエラー
```

**修正:** 必須パラメータチェックと明確なエラーメッセージを追加

---

### 4. テンプレート

#### [P1-TPL-001] feature-spec.md プレースホルダ形式不一致
**ファイル:** `templates/feature-spec.md:27`

```markdown
# 現状
Spec ID: S-{AREA}-001

# 問題
scaffold-spec.cjs は S-{XXX}-001 形式を期待
```

**修正:** プレースホルダ形式を統一

---

#### [P1-TPL-002] fix-spec.md プレースホルダ形式不一致
**ファイル:** `templates/fix-spec.md:22`

```markdown
# 現状
Spec ID: F-{AREA}-001

# 問題
scaffold-spec.cjs との不整合
```

**修正:** プレースホルダ形式を統一

---

### 5. UX/DX

#### [P1-UX-001] issue.md 完了時出力フォーマット不統一
**ファイル:** `spec-mesh-entry/workflows/issue.md`

```markdown
# 現状
出力フォーマットが他のワークフローと異なる

# 問題
一貫性がなくユーザーが混乱
```

**修正:** `=== ... ===` 形式に統一

---

#### [P1-UX-002] _vision-interview.md Output Format 問題
**ファイル:** `workflows/shared/_vision-interview.md`

```markdown
# 現状
出力フォーマットが不完全

# 問題
インタビュー完了後の情報が不十分
```

**修正:** 出力フォーマットを充実

---

### 6. 保守性・重複

#### [P1-DUP-001] CLARIFY GATE 定義の重複（3箇所）
**ファイル:**
- `constitution/quality-gates.md`
- `workflows/shared/_clarify-gate.md`
- `spec-mesh/SKILL.md`

```markdown
# 問題
同じ定義が3箇所に存在し、変更時に不整合が発生するリスク

# 推奨
quality-gates.md を Single Source of Truth とし、他は参照
```

---

#### [P1-DUP-002] Multi-Review 3観点定義の重複（3箇所）
**ファイル:**
- `constitution/quality-gates.md`
- `workflows/shared/_quality-flow.md`
- 複数のワークフロー

```markdown
# 問題
3観点（構造・内容・完全性）の定義が複数箇所で重複
```

---

#### [P1-DUP-003] Spec Creation Flow の重複（5箇所）
**ファイル:**
- `CLAUDE.md`
- `spec-mesh/SKILL.md`
- `constitution/core.md`
- 各子スキルの SKILL.md

```markdown
# 問題
フロー図が5箇所に存在し、更新漏れのリスク
```

---

#### [P1-DUP-004] 削除された spec.md への参照
**ファイル:** 複数

```markdown
# 問題
.claude/skills/spec-mesh-meta/workflows/spec.md は削除済みだが参照が残存
```

**修正:** 参照を削除

---

## P2 Major Issues（品質改善）

### ワークフローロジック（6件）

| ID | ファイル | 問題 |
|----|---------|------|
| P2-WFL-001 | vision.md | PASSED_WITH_DEFERRED 処理欠落 |
| P2-WFL-002 | tasks.md | HUMAN_CHECKPOINT 形式不完全 |
| P2-WFL-003 | clarify.md | ループステップ参照不整合 |
| P2-WFL-004 | decision-tree.md | エスカレーション先不完全 |
| P2-WFL-005 | design.md | clarify ループパス欠落 |
| P2-WFL-006 | implement.md | feedback サイクル定義不明確 |

### セマンティック品質（13件）

| ID | 問題 |
|----|------|
| P2-SEM-001 | Vision Interview と Deep Interview の位置づけ曖昧 |
| P2-SEM-002-008 | 曖昧表現 "適切に" が judgment-criteria.md で具体化されていない（7件） |
| P2-SEM-009-011 | 前提条件・実行順序の問題（3件） |
| P2-SEM-012-014 | 例外処理の明示不足（3件） |

### スクリプト・テンプレート（7件）

| ID | ファイル | 問題 |
|----|---------|------|
| P2-SCR-001 | scaffold-spec.cjs | test-scenario テンプレート欠落 |
| P2-SCR-002 | state.cjs | query --all に JSON 出力オプションなし |
| P2-SCR-003 | matrix-ops.cjs | エラーメッセージが不明確 |
| P2-TPL-001-004 | 各テンプレート | 記入例不足 |

### UX/DX（12件）

| ID | 問題 |
|----|------|
| P2-UX-001-003 | Todo Template 欠如（featureproposal.md, analyze.md, checklist.md） |
| P2-UX-004-007 | AskUserQuestion の選択肢品質問題 |
| P2-UX-008-010 | 次ステップの明確さ不足 |
| P2-UX-011-012 | エラーメッセージの具体性不足 |

### 保守性（8件）

| ID | 問題 |
|----|------|
| P2-DUP-001 | HUMAN_CHECKPOINT Policy 重複 |
| P2-DUP-002 | Deep Interview 呼び出し説明重複 |
| P2-DUP-003 | guide スキルと workflow-map.md 重複 |
| P2-DUP-004-008 | 冗長性問題 |

---

## P3 Minor Issues（改善提案）

### 主な項目

| カテゴリ | 件数 | 概要 |
|---------|------|------|
| ワークフロー | 3件 | ステップ番号整合性、コメント改善 |
| セマンティック | 6件 | 言語ポリシー違反、表現改善 |
| スクリプト | 3件 | コード整理、未使用変数 |
| UX/DX | 4件 | ナビゲーション改善、参照追加 |
| 保守性 | 3件 | ドキュメント整理 |

---

## 修正計画

### Phase 1: Critical Fixes（P1）

**依存関係順に修正:**

```
1. 構造修正（参照・パス）
   ├── [P1-STR-001] impact-check.cjs 参照削除
   ├── [P1-STR-002] 相対パス修正（3ファイル）
   └── [P1-DUP-004] 削除された spec.md 参照削除

2. スクリプト修正
   ├── [P1-SCR-001] post-merge.cjs 変数名修正
   └── [P1-SCR-002] changelog.cjs エラーハンドリング追加

3. テンプレート統一
   ├── [P1-TPL-001] feature-spec.md プレースホルダ修正
   └── [P1-TPL-002] fix-spec.md プレースホルダ修正

4. ワークフローロジック修正
   ├── [P1-WFL-001] issue.md Quick type ルーティング追加
   └── [P1-WFL-002] Entry workflows step 追跡追加

5. SSOT 確立（重複解消）
   ├── [P1-DUP-001] CLARIFY GATE 定義を quality-gates.md に集約
   ├── [P1-DUP-002] Multi-Review 定義を quality-gates.md に集約
   └── [P1-DUP-003] Spec Creation Flow を core.md に集約

6. UX 修正
   ├── [P1-UX-001] issue.md 出力フォーマット統一
   └── [P1-UX-002] _vision-interview.md 出力改善
```

### Phase 2: Major Improvements（P2）

**カテゴリ別に修正:**

```
1. ワークフロー改善（6件）
2. セマンティック改善（13件）
   └── judgment-criteria.md に具体化追加
3. スクリプト・テンプレート改善（7件）
4. UX/DX 改善（12件）
5. 重複解消（8件）
```

### Phase 3: Minor Enhancements（P3）

**優先度低：リソースがあれば対応**

---

## Quick Wins（簡単に修正できる項目）

| 項目 | 作業時間 | 影響 |
|------|---------|------|
| 相対パス修正（3ファイル） | 5分 | 参照エラー解消 |
| プレースホルダ形式統一 | 5分 | scaffold-spec 動作改善 |
| 出力フォーマット統一 | 10分 | UX 向上 |
| 削除ファイル参照削除 | 5分 | 混乱解消 |

---

## 要検討項目

| 項目 | 判断ポイント |
|------|-------------|
| SSOT 集約方法 | インライン定義 vs 参照のみ |
| Deep Interview 位置づけ | Vision Interview との関係整理 |
| 多言語ポリシー | 日英混在ルールの明確化 |

---

## Next Steps

1. **Quick Wins を即時実行**
2. **Phase 1 を優先的に修正**
3. **Phase 2 を計画的に改善**
4. **Phase 3 はバックログ管理**
