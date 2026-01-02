# Overview Change サブワークフロー

> **設計ドキュメント:** [spec-gate-design.md](../../guides/spec-gate-design.md) 参照

SPEC GATE で `[PENDING OVERVIEW CHANGE]` が検出された場合に実行するサブワークフロー。
Feature/Fix Spec から離脱せず、Overview Spec への変更を Embedded（同一ブランチ）で処理する。

---

## Purpose

1. **Feature/Fix 開発中に発見された Overview 変更を確実に処理**
2. **変更の影響を分析し、人間の承認を得る**
3. **同一ブランチで変更を完結させ、トレーサビリティを確保**
4. **重複変更（他 Feature で対応済み）を検出し、無駄な作業を回避**

---

## 前提条件

- SPEC GATE で `BLOCKED_OVERVIEW` と判定されていること
- `[NEEDS CLARIFICATION]` が 0 件であること（曖昧点は先に解消済み）
- Feature/Fix Spec に `[PENDING OVERVIEW CHANGE]` マーカーが存在すること

---

## フロー概要

```
SPEC GATE: BLOCKED_OVERVIEW
    ↓
Step 1: マーカー収集
    ↓
Step 2: 重複チェック
    ├─ 全て適用済み → Step 6 へ（マーカー削除のみ）
    └─ 未適用あり → Step 3 へ
    ↓
Step 3: Impact Analysis (FULL モード)
    ↓
Step 4: [HUMAN_CHECKPOINT]
    ├─ 承認 → Step 5 へ
    └─ 拒否 → Feature Spec 再検討
    ↓
Step 5: Overview Spec 更新
    ↓
Step 6: マーカー削除
    ↓
Step 7: Multi-Review へ戻る
```

---

## Steps

### Step 1: マーカー収集

Feature/Fix Spec から全 `[PENDING OVERVIEW CHANGE]` を抽出：

```
Grep tool:
  pattern: "\[PENDING OVERVIEW CHANGE: [^\]]+\]"
  path: {feature_or_fix_spec_path}
  output_mode: content
  -A: 3
```

**抽出情報:**

| 項目 | 内容 |
|------|------|
| 対象ID | M-*, API-*, SCR-*, BR-*, VR-* など |
| 変更内容 | 属性追加、型変更、削除など |
| 理由 | この Feature/Fix で必要な理由 |

**出力例:**

```
=== [PENDING OVERVIEW CHANGE] 収集結果 ===

1. 対象: M-USER
   変更: email: string (required) を追加
   理由: メール通知機能で必要

2. 対象: API-USER-CREATE
   変更: request/response に email フィールド追加
   理由: M-USER の変更に伴う
```

### Step 2: 重複チェック

各変更について「既に適用済みか」を確認：

**チェック方法:**

| 対象タイプ | チェック対象ファイル | 確認方法 |
|-----------|-------------------|---------|
| M-* | `.specify/specs/overview/domain/spec.md` | 属性が存在するか |
| API-* | `.specify/specs/overview/domain/spec.md` | フィールドが定義されているか |
| BR-*, VR-* | `.specify/specs/overview/domain/spec.md` | ルールが定義されているか |
| SCR-* | `.specify/specs/overview/screen/spec.md` | 要素が定義されているか |

```
Read tool: {対象 Spec ファイル}
→ 変更内容が既に存在するか確認
```

**判定:**

```javascript
for each pending_change:
    if (alreadyExists(pending_change.target, pending_change.change)) {
        pending_change.status = 'ALREADY_APPLIED';
        log(`${pending_change.target} は既に変更済み（別 Feature で対応済み）`);
    } else {
        pending_change.status = 'PENDING';
    }

const pendingChanges = changes.filter(c => c.status === 'PENDING');

if (pendingChanges.length === 0) {
    // 全て適用済み → Step 6 へ（マーカー削除のみ）
} else {
    // 未適用あり → Step 3 へ
}
```

**出力例:**

```
=== 重複チェック結果 ===

1. M-USER (email 追加)
   Status: ALREADY_APPLIED
   → 別 Feature で対応済み。マーカー削除のみ。

2. API-USER-CREATE (email フィールド追加)
   Status: PENDING
   → 変更が必要。Step 3 へ進む。
```

### Step 3: Impact Analysis (FULL モード)

> **共通コンポーネント参照:** [shared/impact-analysis.md](impact-analysis.md) を **FULL モード** で実行

未適用の変更について影響分析を実行：

**3.1 変更対象の特定**
- 変更する M-*/API-*/SCR-* を明確化

**3.2 上流影響分析**
- この変更の影響を受ける Feature Spec を検索
- Matrix から参照関係を確認

**3.3 下流影響分析**
- 変更対象が依存している要素を確認

**3.4 影響度判定**

| 影響度 | 条件 | 対応 |
|--------|------|------|
| **CRITICAL** | 3つ以上の Feature が影響 | 全 Feature オーナーへの事前通知必須 |
| **HIGH** | 1-2つの Feature が影響 | 影響 Spec の同時更新必須 |
| **MEDIUM** | Matrix のみ影響 | Matrix 更新で対応 |
| **LOW** | 参照なし | そのまま続行 |

**出力例:**

```
=== Impact Analysis (FULL) ===

変更対象: API-USER-CREATE (email フィールド追加)
影響度: HIGH

上流影響（この変更の影響を受ける Spec）:
- S-AUTH-001: ユーザー認証 (uses API-USER-CREATE)

下流依存:
- M-USER: email 属性（この Feature で追加済み）

Matrix 参照:
- SCR-002: ユーザー登録画面

必要なアクション:
1. API-USER-CREATE の request/response を更新
2. S-AUTH-001 への影響確認（API シグネチャ変更なし → OK）
```

### Step 4: [HUMAN_CHECKPOINT]

```
=== [HUMAN_CHECKPOINT] Overview 変更確認 ===

以下の Overview 変更を実行します:

【変更内容】
1. API-USER-CREATE
   - 変更: request/response に email フィールド追加
   - 影響度: HIGH
   - 影響を受ける Feature: S-AUTH-001

【影響分析サマリー】
- 影響を受ける Feature: 1 件
- 破壊的変更: なし（フィールド追加のみ）

確認事項:
- [ ] 変更内容が正しいか
- [ ] 影響範囲を理解しているか
- [ ] この Feature で実行することが適切か

承認後、Overview Spec を更新します。
拒否する場合、Feature Spec を再検討してください。
```

**拒否された場合:**

```
Overview 変更が拒否されました。

以下の選択肢があります:
1. Feature Spec を修正し、Overview 変更を不要にする
2. 変更内容を修正して再度提案する
3. Feature 開発を中止する

Feature Spec を確認し、対応を決定してください。
```

### Step 5: Overview Spec 更新

**5.1 対象 Spec の更新**

```
Edit tool:
  file_path: {対象 Overview Spec}
  old_string: {変更前の内容}
  new_string: {変更後の内容}
```

**5.2 Matrix 更新**

```bash
node .claude/skills/nick-q/scripts/generate-matrix-view.cjs
```

**5.3 影響を受ける既存 Feature Spec の参照更新**（必要な場合）

Impact Analysis で特定された Feature Spec の参照を更新。

**5.4 Changelog 記録**

```bash
node .claude/skills/nick-q/scripts/changelog.cjs record \
  --spec "{対象 Overview Spec}" \
  --type update \
  --description "{変更内容の要約} (triggered by {Feature/Fix ID})"
```

**5.5 コミット**

```bash
git add .specify/specs/overview/
git commit -m "chore(domain): {変更内容の要約}

Triggered by: {Feature/Fix ID}
Reason: {変更理由}"
```

### Step 6: マーカー削除

Feature/Fix Spec から `[PENDING OVERVIEW CHANGE]` マーカーを削除し、正式な参照に書き換え：

**Before:**

```markdown
- M-USER: ユーザー情報
  - [PENDING OVERVIEW CHANGE: M-USER]
    - 変更: `email: string (required)` を追加
    - 理由: メール通知機能で必要
```

**After:**

```markdown
- M-USER: ユーザー情報
  - email: string (required) ← 追加済み
```

**コミット:**

```bash
git add .specify/specs/features/{id}/spec.md
git commit -m "feat(spec): resolve overview changes for {Feature/Fix ID}

Removed [PENDING OVERVIEW CHANGE] markers after applying changes."
```

### Step 7: Multi-Review へ戻る

```
=== Overview Change 完了 ===

【適用した変更】
1. API-USER-CREATE: email フィールド追加

【マーカー処理】
- 削除: 2 件
- 適用済みスキップ: 1 件

Multi-Review を再実行して Spec の品質を確認します。
```

→ Multi-Review を実行
→ SPEC GATE を再チェック

---

## 全てが適用済みの場合（Step 2 → Step 6）

```
=== Overview Change ===

全ての [PENDING OVERVIEW CHANGE] は既に適用済みです。
（別 Feature で対応済み）

マーカーを削除して Multi-Review に戻ります。
```

→ Step 6（マーカー削除）→ Step 7（Multi-Review）

---

## エラーハンドリング

### 競合が発生した場合

別の Feature が同じ Overview Spec を変更中の場合：

```
⚠️ 競合検出

{Overview Spec} は別のブランチで変更されています。

対応:
1. main から最新を取得（git pull origin main）
2. 重複チェック（Step 2）をやり直し
3. 競合する変更があれば手動で解決
```

### 変更が複雑すぎる場合

```
⚠️ 複雑な Overview 変更

この変更は複数の Overview Spec にまたがっており、
単一の Feature で処理するには複雑すぎます。

推奨:
1. この Feature を一時保存
2. 別ブランチで change.md ワークフローを実行
3. main にマージ後、Feature を再開
```

---

## Self-Check

- [ ] 全 `[PENDING OVERVIEW CHANGE]` を収集したか
- [ ] 重複チェックを実行したか
- [ ] Impact Analysis を FULL モードで実行したか
- [ ] [HUMAN_CHECKPOINT] で承認を得たか
- [ ] Overview Spec を更新したか
- [ ] Matrix を更新したか
- [ ] Changelog を記録したか
- [ ] マーカーを削除したか
- [ ] コミットを作成したか
- [ ] Multi-Review に戻ったか

---

## 呼び出し方

SPEC GATE で `BLOCKED_OVERVIEW` と判定された場合に自動的に呼び出される：

```markdown
### SPEC GATE: BLOCKED_OVERVIEW

[PENDING OVERVIEW CHANGE] が検出されました。
Overview Change サブワークフローを実行します。

> **共通コンポーネント参照:** [shared/_overview-change.md](shared/_overview-change.md) を実行

完了後、Multi-Review からやり直します。
```
