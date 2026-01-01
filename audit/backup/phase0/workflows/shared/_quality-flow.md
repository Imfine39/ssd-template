# Quality Flow（品質フロー）共通コンポーネント

> **概念定義:** [quality-gates.md](../../constitution/quality-gates.md) 参照
> - Multi-Review 3観点: [#multi-review](../../constitution/quality-gates.md#multi-review)
> - CLARIFY GATE: [#clarify-gate](../../constitution/quality-gates.md#clarify-gate)
>
> このファイルは Quality Flow の**運用手順**を定義します。

QA 分析 → Multi-Review → Lint → CLARIFY GATE の一連のフローを定義。
Spec 作成後の品質担保プロセス。

---

## Purpose

1. **Spec 作成後の品質担保プロセスを標準化**
2. **各ステップの実行順序を保証**
3. **ワークフロー間の重複を削減**

---

## Quality Flow 概要

```
Spec 作成完了
    ↓
┌─────────────────────────────────────┐
│ ★ Quality Flow 開始 ★               │
├─────────────────────────────────────┤
│ 1. QA 回答分析（未回答確認）          │
│    ↓                                │
│ 2. Multi-Review（3観点並列）         │
│    ↓                                │
│ 3. AI 修正                          │
│    ↓                                │
│ 4. Lint                             │
│    ↓                                │
│ 5. CLARIFY GATE                     │
│    ↓                                │
│ [BLOCKED → clarify → 2へ戻る]       │
└─────────────────────────────────────┘
    ↓ PASSED
呼び出し元の次のステップへ（Cascade Update）
```

---

## 呼び出し元ワークフロー

| ワークフロー | 対象 Spec | Quality Flow 後の遷移 |
|-------------|----------|---------------------|
| project-setup.md | Vision + Screen + Domain Spec | issue |
| add.md | Feature Spec | plan |
| fix.md | Fix Spec | plan or implement |
| change.md | Vision/Screen/Domain 変更 | plan |

---

## Steps

### Step 1: QA 回答分析

**★ 必須ステップ ★**

> **コンポーネント参照:** [_qa-analysis.md](_qa-analysis.md)

```markdown
QA ドキュメントの回答状況を確認:

1. 回答状況チェック
   - [必須] 項目: 全て回答済みか
   - [確認] 項目: 承認/却下が完了しているか
   - [提案] 項目: 採否が決定しているか
   - [選択] 項目: 選択が完了しているか

2. 未回答項目がある場合
   → AskUserQuestion で確認（最大4問ずつ）

3. 終了条件
   - 全ての [必須] に回答あり
   - Critical な曖昧点がない
```

#### Post-QA Verification（Feature/Fix のみ）

QA 分析完了後、追加された要件の整合性を検証：

```markdown
QA で追加・変更された要件を特定:
- 採用された提案を確認
- 新たに追加された要件を確認
- それらが参照する M-*/API-*/SCR-* を抽出

不足要素の対応:
| 状況 | 対応 |
|------|------|
| 全要素が存在 | そのまま続行 |
| 新規要素が必要 | Spec に仮定義を追記 → Cascade Update で反映 |
| 既存要素の変更が必要 | change ワークフローを先行 |
```

### Step 2: Multi-Review（3観点並列レビュー）

> **ワークフロー参照:** [review.md](../review.md)

```markdown
1. 3 つの reviewer agent を並列で起動:
   - Reviewer A: 構造・形式
   - Reviewer B: 内容・整合性
   - Reviewer C: 完全性・網羅性

2. フィードバックを統合:
   - 重複排除
   - 重要度でソート（Critical → Major → Minor）

3. 結果を分類:
   - AI 修正可能: 形式エラー、用語不統一、明らかな欠落
   - ユーザー確認必要: 曖昧な要件、ビジネス判断
```

### Step 3: AI 修正

```markdown
Critical と Major のうち AI で修正可能なものを修正:

Edit tool: {spec_path}
  - Fix issue C1: ...
  - Fix issue M1: ...

修正ログ:
=== 修正完了 ===
- [C1] {issue}: {修正内容}
- [M1] {issue}: {修正内容}
```

### Step 4: Lint 実行

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

Matrix が存在する場合:
```bash
node .claude/skills/spec-mesh/scripts/matrix-ops.cjs validate
```

### Step 5: CLARIFY GATE チェック

**★ スキップ禁止 ★**

> **コンポーネント参照:** [_clarify-gate.md](_clarify-gate.md)

```markdown
1. [NEEDS CLARIFICATION] マーカーをカウント
2. [DEFERRED] マーカーをカウント
3. Open Questions をカウント（Overview Spec のみ）
4. 判定:
   - [NEEDS CLARIFICATION] > 0 → BLOCKED
   - [NEEDS CLARIFICATION] = 0 かつ [DEFERRED] > 0 → PASSED_WITH_DEFERRED
   - [NEEDS CLARIFICATION] = 0 かつ [DEFERRED] = 0 → PASSED

BLOCKED の場合:
  → clarify ワークフローを実行
  → clarify 完了後、Step 2 (Multi-Review) へ戻る

PASSED_WITH_DEFERRED の場合:
  → [HUMAN_CHECKPOINT] で [DEFERRED] 項目を提示
  → リスクを承知の上で承認を得る
  → 呼び出し元ワークフローの次のステップへ

PASSED の場合:
  → 呼び出し元ワークフローの次のステップへ
```

**Note:** HUMAN_CHECKPOINT は呼び出し元ワークフローの Finalize ステップで実施

---

## ワークフロー別チェックリスト

> **判断基準:** 「適切か」「妥当か」等の曖昧表現の具体的判断基準は [judgment-criteria.md](../../guides/judgment-criteria.md) を参照

### Vision Spec

| 確認項目 | チェック |
|---------|---------|
| Vision Spec の Purpose が課題/問題を正確に反映しているか | [ ] |
| Target Users と User Journeys が適切に定義されているか | [ ] |
| Scope (In/Out) が要件と一致しているか | [ ] |

### Screen + Domain Spec

| 確認項目 | チェック |
|---------|---------|
| Screen Spec の画面定義が要件を網羅しているか | [ ] |
| Domain Spec の M-*/API-* 定義が適切か | [ ] |
| Cross-Reference Matrix の整合性を確認したか | [ ] |

### Feature Spec

| 確認項目 | チェック |
|---------|---------|
| Feature Spec の User Stories が期待する動作を反映しているか | [ ] |
| Functional Requirements が適切に定義されているか | [ ] |
| M-*/API-* の参照/追加が正しいか | [ ] |

### Fix Spec

| 確認項目 | チェック |
|---------|---------|
| Root Cause Analysis が正確か | [ ] |
| Proposed Fix が問題を解決するか | [ ] |
| 影響範囲が適切に評価されているか | [ ] |
| Verification Plan が十分か | [ ] |

---

## 出力テンプレート

Quality Flow 完了時の出力：

```
=== Quality Flow 完了 ===

Spec: {spec_path}

【QA 分析】
- [必須]: {n1}/{N1} 回答済
- [確認]: {n2}/{N2} 完了
- [提案]: {n3}/{N3} 採用
- 追加要件: {M} 件

【Multi-Review】
- Critical: {count} (Fixed: {fixed})
- Major: {count} (Fixed: {fixed})
- Minor: {count}

【Lint】
- Status: PASSED

【CLARIFY GATE】
- [NEEDS CLARIFICATION]: {N} 件
- [DEFERRED]: {D} 件
- Open Questions: {M} 件
- Status: {PASSED | PASSED_WITH_DEFERRED | BLOCKED}

{if BLOCKED}
★ clarify ワークフロー を実行してください。
clarify 完了後、Multi-Review からやり直します。
{/if}

{if PASSED_WITH_DEFERRED}
★ [DEFERRED] 項目があります:
1. {DEFERRED項目1}
2. {DEFERRED項目2}

[HUMAN_CHECKPOINT]
上記のリスクを承知の上で先に進む場合は承認してください。
実装フェーズで [DEFERRED] に遭遇した場合、clarify に戻る必要があります。

→ 承認後、次のステップ（Cascade Update）へ進む
{/if}

{if PASSED}
→ 次のステップ（Cascade Update）へ進む
{/if}
```

---

## Self-Check

- [ ] QA 回答分析を完了したか
- [ ] Multi-Review を実行したか（3観点並列）
- [ ] AI 修正可能な問題を修正したか
- [ ] Lint を実行したか
- [ ] CLARIFY GATE をチェックしたか（BLOCKED → clarify）

---

## 呼び出し方

各ワークフローから以下のように呼び出す：

```markdown
### Step N: Quality Flow

**★ 品質担保プロセス（必須） ★**

> **参照:** [shared/_quality-flow.md] を **Read tool で読み込んで** 実行

1. QA 回答分析
2. Multi-Review（3観点並列）
3. AI 修正
4. Lint
5. CLARIFY GATE

BLOCKED → clarify → Multi-Review へ戻る
PASSED → 次のステップへ
```
