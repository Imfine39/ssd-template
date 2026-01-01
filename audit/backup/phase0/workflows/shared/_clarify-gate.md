# CLARIFY GATE（曖昧点チェック）共通コンポーネント

> **概念定義:** [quality-gates.md](../../constitution/quality-gates.md#clarify-gate) 参照
>
> このファイルは CLARIFY GATE の**運用手順**を定義します。

Multi-Review + Lint 後に実行する必須チェック。
曖昧点が残っている場合は次のステップに進めない。

---

## Purpose

1. **曖昧点が残ったまま実装に進むことを防止**
2. **Spec の品質を保証するゲートキーピング**
3. **Clarify ワークフローへの適切なルーティング**

---

## 呼び出し元ワークフロー

このコンポーネントは以下のワークフローから呼び出される：

| ワークフロー | チェック対象 Spec | ゲート後の遷移先 |
|-------------|------------------|-----------------|
| vision.md | Vision Spec | design or clarify |
| design.md | Screen + Domain Spec | issue or clarify |
| add.md | Feature Spec | plan or clarify |
| fix.md | Fix Spec | plan/implement or clarify |

---

## Gate Logic

```
Multi-Review 完了
    ↓
Lint 完了
    ↓
★ CLARIFY GATE チェック開始 ★
    ↓
[NEEDS CLARIFICATION] カウント
    ↓
[DEFERRED] カウント
    ↓
Open Questions カウント（Vision/Domain のみ）
    ↓
判定:
┌─ [NEEDS CLARIFICATION] > 0 → BLOCKED（clarify 必須）
│
└─ [NEEDS CLARIFICATION] = 0
      ├─ [DEFERRED] = 0 → PASSED
      └─ [DEFERRED] > 0 → PASSED_WITH_DEFERRED
                              ↓
                    [HUMAN_CHECKPOINT]
                    (リスク確認: [DEFERRED] 項目を提示)
```

### Pass Conditions

> **SSOT:** [quality-gates.md#clarify-gate](../../constitution/quality-gates.md#clarify-gate) 参照

- PASSED / PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT] へ
- BLOCKED → clarify ワークフローへ

---

## Steps

### Step 1: マーカーカウント

**すべての Spec タイプ共通:**

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: {spec_path}
  output_mode: count
```

### Step 1.5: [DEFERRED] カウント

```
Grep tool:
  pattern: "\[DEFERRED:[^\]]+\]"
  path: {spec_path}
  output_mode: count
```

### Step 2: Open Questions カウント（Vision/Domain/Screen のみ）

Overview Spec の場合、Open Questions セクションの未解決項目もカウント：

```
Grep tool:
  pattern: "^- \[ \]"
  path: {spec_path}
  output_mode: count
```

**Feature/Fix Spec の場合:** このステップはスキップ

### Step 3: 合計判定

```javascript
// 判定ロジック
const needs_clarification = markers_count + open_questions_count;
const deferred_count = deferred_markers_count;

if (needs_clarification > 0) {
  status = 'BLOCKED';
} else if (deferred_count > 0) {
  status = 'PASSED_WITH_DEFERRED';
} else {
  status = 'PASSED';
}
```

### Step 4: 結果出力

#### BLOCKED の場合

```
┌─────────────────────────────────────────────────────────────┐
│ ★ CLARIFY GATE: BLOCKED                                     │
│                                                             │
│ [NEEDS CLARIFICATION]: {needs_clarification} 件              │
│                                                             │
│ 次のステップに進む前に clarify ワークフロー が必須です。     │
│                                                             │
│ 「clarify を実行して」と依頼してください。                   │
└─────────────────────────────────────────────────────────────┘

=== 曖昧点の内訳 ===
[NEEDS CLARIFICATION]: {markers_count} 件
Open Questions: {open_questions_count} 件
[DEFERRED]: {deferred_count} 件（参考）

検出された曖昧点:
1. Section X: {マーカーの内容}
2. Section Y: {マーカーの内容}
...

Next: clarify ワークフロー → clarify 完了後、Multi-Review からやり直し
```

#### PASSED_WITH_DEFERRED の場合

```
┌─────────────────────────────────────────────────────────────┐
│ ★ CLARIFY GATE: PASSED_WITH_DEFERRED                        │
│                                                             │
│ [NEEDS CLARIFICATION]: 0 件                                 │
│ [DEFERRED]: {deferred_count} 件                             │
│                                                             │
│ 以下の項目は後で解決する必要があります:                       │
│ 1. {DEFERRED項目1}                                          │
│ 2. {DEFERRED項目2}                                          │
│                                                             │
│ これらのリスクを承知の上で先に進みますか？                    │
└─────────────────────────────────────────────────────────────┘

[HUMAN_CHECKPOINT]
上記の [DEFERRED] 項目を確認し、リスクを承知の上で先に進む場合は承認してください。
実装フェーズで [DEFERRED] 項目に遭遇した場合、clarify に戻る必要があります。

Next: [HUMAN_CHECKPOINT] で確認後、次のステップへ
```

#### PASSED の場合

```
=== CLARIFY GATE ===
[NEEDS CLARIFICATION]: 0 件
[DEFERRED]: 0 件
Open Questions: 0 件
Status: PASSED

Next: [HUMAN_CHECKPOINT] へ進む
```

---

## 重要なルール

### 1. CLARIFY GATE は絶対にスキップ禁止

```
FORBIDDEN:
- ユーザーが「先に進んで」と言っても、clarify_count > 0 なら BLOCKED
- [NEEDS CLARIFICATION] を削除して通過しようとする行為は禁止
- 曖昧点を無視して [HUMAN_CHECKPOINT] を提示することは禁止
```

### 2. Clarify 後は Multi-Review からやり直し

```
vision.md の場合:
  clarify 完了 → Step 5 (Multi-Review) へ戻る

add.md の場合:
  clarify 完了 → Step 7 (Multi-Review) へ戻る
```

### 3. 次ステップへの遷移条件

| Spec Type | BLOCKED 時 | PASSED 時 |
|-----------|-----------|-----------|
| Vision | clarify 必須 | design へ（人間承認後） |
| Domain/Screen | clarify 必須 | issue へ（人間承認後） |
| Feature | clarify 必須 | plan へ（人間承認後） |
| Fix (Trivial) | clarify 必須 | implement へ（人間承認後） |
| Fix (Standard) | clarify 必須 | plan へ（人間承認後） |

---

## Spec Path 一覧

| Spec Type | Path |
|-----------|------|
| Vision | `.specify/specs/overview/vision/spec.md` |
| Domain | `.specify/specs/overview/domain/spec.md` |
| Screen | `.specify/specs/overview/screen/spec.md` |
| Feature | `.specify/specs/features/{id}/spec.md` |
| Fix | `.specify/specs/fixes/{id}/spec.md` |

---

## Output Template

呼び出し元ワークフローで使用するテンプレート：

```markdown
### Step N: CLARIFY GATE チェック

**★ このステップはスキップ禁止 ★**

> **共通コンポーネント参照:** [shared/_clarify-gate.md](shared/_clarify-gate.md) を実行

1. **マーカーカウント:**
   ```
   Grep tool:
     pattern: "\[NEEDS CLARIFICATION\]"
     path: {spec_path}
     output_mode: count
   ```

2. **Open Questions カウント（Vision/Domain/Screen のみ）:**
   ```
   Grep tool:
     pattern: "^- \[ \]"
     path: {spec_path}
     output_mode: count
   ```

3. **判定:**
   - `clarify_count > 0` → BLOCKED（clarify 必須）
   - `clarify_count = 0` → PASSED（[HUMAN_CHECKPOINT] へ）

**重要:** BLOCKED の場合、ユーザーが先に進みたいと言っても clarify を促すこと。
```

---

## Self-Check（呼び出し元で確認）

- [ ] Grep tool で `[NEEDS CLARIFICATION]` をカウントしたか
- [ ] Overview Spec の場合、Open Questions もカウントしたか
- [ ] BLOCKED/PASSED を正しく判定したか
- [ ] BLOCKED の場合、曖昧点の内訳を提示したか
- [ ] BLOCKED の場合、次ステップへの遷移を禁止したか

---

## 呼び出し方

各ワークフローから以下のように呼び出す：

```markdown
### Step N: CLARIFY GATE チェック

**★ このステップはスキップ禁止 ★**

[shared/_clarify-gate.md](shared/_clarify-gate.md) を実行。

判定結果:
- BLOCKED → clarify ワークフローを実行後、Multi-Review へ戻る
- PASSED → Step N+1 ([HUMAN_CHECKPOINT]) へ進む
```
