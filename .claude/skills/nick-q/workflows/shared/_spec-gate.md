# SPEC GATE（拡張版曖昧点チェック）共通コンポーネント

> **設計ドキュメント:** [spec-gate-design.md](../../guides/spec-gate-design.md) 参照
>
> **概念定義:** [quality-gates.md](../../constitution/quality-gates.md#spec-gate) 参照
>
> このファイルは SPEC GATE の**運用手順**を定義します。

Multi-Review + Lint 後に実行する必須チェック。
曖昧点または Overview 変更が残っている場合は次のステップに進めない。

---

## Purpose

1. **曖昧点が残ったまま実装に進むことを防止**
2. **Overview 変更が未処理のまま実装に進むことを防止**
3. **Spec の品質を保証するゲートキーピング**
4. **適切なワークフローへのルーティング**

---

## 呼び出し元ワークフロー

| ワークフロー | チェック対象 Spec | ゲート後の遷移先 |
|-------------|------------------|-----------------|
| project-setup.md | Vision + Screen + Domain Spec | Feature Issues or clarify |
| feature.md | Feature Spec | plan or clarify or overview-change |
| fix.md | Fix Spec | plan/implement or clarify or overview-change |
| change.md | 変更対象 Spec | plan or 完了 or clarify |

---

## チェック対象マーカー

| マーカー | 意味 | 検出パターン |
|---------|------|-------------|
| `[NEEDS CLARIFICATION]` | 曖昧点・未確定事項 | `\[NEEDS CLARIFICATION\]` |
| `[PENDING OVERVIEW CHANGE]` | Overview Spec への変更が必要 | `\[PENDING OVERVIEW CHANGE: [^\]]+\]` |
| `[DEFERRED]` | 後回しにした項目 | `\[DEFERRED:[^\]]+\]` |

---

## Gate Logic

```
Multi-Review 完了
    ↓
Lint 完了
    ↓
★ SPEC GATE チェック開始 ★
    ↓
[NEEDS CLARIFICATION] カウント
    ↓
[PENDING OVERVIEW CHANGE] カウント
    ↓
[DEFERRED] カウント
    ↓
判定:
┌─ [NEEDS CLARIFICATION] > 0
│     └─→ BLOCKED_CLARIFY → clarify.md 必須
│
├─ [PENDING OVERVIEW CHANGE] > 0
│     └─→ BLOCKED_OVERVIEW → Overview Change サブワークフロー必須
│
├─ [DEFERRED] > 0
│     └─→ PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT] (リスク確認)
│
└─ 全て 0
      └─→ PASSED → [HUMAN_CHECKPOINT] → Plan
```

### 優先順位

1. **BLOCKED_CLARIFY が最優先**: 曖昧点解消が先
2. **次に BLOCKED_OVERVIEW**: Overview 変更を処理
3. **最後に DEFERRED 確認**: リスクを承知の上で進む

**理由:** Overview 変更の内容自体に曖昧点がある場合、先に clarify で解消する必要がある。

---

## Steps

### Step 1: [NEEDS CLARIFICATION] カウント

```
Grep tool:
  pattern: "\[NEEDS CLARIFICATION\]"
  path: {spec_path}
  output_mode: count
```

### Step 2: [PENDING OVERVIEW CHANGE] カウント

```
Grep tool:
  pattern: "\[PENDING OVERVIEW CHANGE: [^\]]+\]"
  path: {spec_path}
  output_mode: count
```

### Step 3: [DEFERRED] カウント

```
Grep tool:
  pattern: "\[DEFERRED:[^\]]+\]"
  path: {spec_path}
  output_mode: count
```

### Step 4: Open Questions カウント（Overview Spec のみ）

Overview Spec の場合、Open Questions セクションの未解決項目もカウント：

```
Grep tool:
  pattern: "^- \[ \]"
  path: {spec_path}
  output_mode: count
```

**Feature/Fix Spec の場合:** このステップはスキップ

### Step 5: 判定

```javascript
const clarify_count = needs_clarification_count + open_questions_count;
const overview_count = pending_overview_change_count;
const deferred_count = deferred_markers_count;

if (clarify_count > 0) {
  status = 'BLOCKED_CLARIFY';
} else if (overview_count > 0) {
  status = 'BLOCKED_OVERVIEW';
} else if (deferred_count > 0) {
  status = 'PASSED_WITH_DEFERRED';
} else {
  status = 'PASSED';
}
```

### Step 6: 結果出力

#### BLOCKED_CLARIFY の場合

```
┌─────────────────────────────────────────────────────────────┐
│ ★ SPEC GATE: BLOCKED_CLARIFY                                │
│                                                             │
│ [NEEDS CLARIFICATION]: {clarify_count} 件                   │
│                                                             │
│ 次のステップに進む前に clarify ワークフロー が必須です。     │
│                                                             │
│ 「clarify を実行して」と依頼してください。                   │
└─────────────────────────────────────────────────────────────┘

=== 曖昧点の内訳 ===
[NEEDS CLARIFICATION]: {markers_count} 件
Open Questions: {open_questions_count} 件
[PENDING OVERVIEW CHANGE]: {overview_count} 件（後で処理）
[DEFERRED]: {deferred_count} 件（参考）

検出された曖昧点:
1. Section X: {マーカーの内容}
2. Section Y: {マーカーの内容}
...

Next: clarify ワークフロー → clarify 完了後、Multi-Review からやり直し
```

#### BLOCKED_OVERVIEW の場合

```
┌─────────────────────────────────────────────────────────────┐
│ ★ SPEC GATE: BLOCKED_OVERVIEW                               │
│                                                             │
│ [PENDING OVERVIEW CHANGE]: {overview_count} 件              │
│                                                             │
│ Overview Spec への変更が必要です。                          │
│ Overview Change サブワークフローを実行します。              │
└─────────────────────────────────────────────────────────────┘

=== 必要な Overview 変更 ===
1. {対象ID}: {変更内容}
   理由: {理由}
2. {対象ID}: {変更内容}
   理由: {理由}
...

Next: Overview Change サブワークフロー → 完了後、Multi-Review からやり直し
```

#### PASSED_WITH_DEFERRED の場合

```
┌─────────────────────────────────────────────────────────────┐
│ ★ SPEC GATE: PASSED_WITH_DEFERRED                           │
│                                                             │
│ [NEEDS CLARIFICATION]: 0 件                                 │
│ [PENDING OVERVIEW CHANGE]: 0 件                             │
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
=== SPEC GATE ===
[NEEDS CLARIFICATION]: 0 件
[PENDING OVERVIEW CHANGE]: 0 件
[DEFERRED]: 0 件
Open Questions: 0 件
Status: PASSED

Next: [HUMAN_CHECKPOINT] へ進む
```

---

## 重要なルール

### 1. SPEC GATE は絶対にスキップ禁止

```
FORBIDDEN:
- ユーザーが「先に進んで」と言っても、BLOCKED なら次に進めない
- マーカーを削除して通過しようとする行為は禁止
- 問題を無視して [HUMAN_CHECKPOINT] を提示することは禁止
```

### 2. ブロック解消後は Multi-Review からやり直し

```
clarify 完了 → Multi-Review へ戻る
Overview Change 完了 → Multi-Review へ戻る
```

### 3. 次ステップへの遷移条件

| Spec Type | BLOCKED_CLARIFY | BLOCKED_OVERVIEW | PASSED |
|-----------|-----------------|------------------|--------|
| Vision + Domain + Screen | clarify 必須 | N/A | issue へ誘導 |
| Feature | clarify 必須 | overview-change 必須 | plan へ |
| Fix (Trivial) | clarify 必須 | overview-change 必須 | implement へ |
| Fix (Standard) | clarify 必須 | overview-change 必須 | plan へ |

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

## 呼び出し方

各ワークフローから以下のように呼び出す：

```markdown
### Step N: SPEC GATE チェック

**★ このステップはスキップ禁止 ★**

> **共通コンポーネント参照:** [shared/_spec-gate.md](shared/_spec-gate.md) を実行

1. **マーカーカウント:**
   - `[NEEDS CLARIFICATION]`
   - `[PENDING OVERVIEW CHANGE]`
   - `[DEFERRED]`
   - Open Questions（Overview Spec のみ）

2. **判定:**
   - BLOCKED_CLARIFY → clarify 必須
   - BLOCKED_OVERVIEW → overview-change 必須
   - PASSED_WITH_DEFERRED → [HUMAN_CHECKPOINT] (リスク確認)
   - PASSED → [HUMAN_CHECKPOINT] → 次のステップへ

**重要:** BLOCKED の場合、ユーザーが先に進みたいと言っても対応するワークフローを促すこと。
```

---

## Self-Check（呼び出し元で確認）

- [ ] Grep tool で全マーカーをカウントしたか
- [ ] Overview Spec の場合、Open Questions もカウントしたか
- [ ] 判定を正しく行ったか（優先順位を守る）
- [ ] BLOCKED の場合、内訳と次のアクションを提示したか
- [ ] BLOCKED の場合、次ステップへの遷移を禁止したか

