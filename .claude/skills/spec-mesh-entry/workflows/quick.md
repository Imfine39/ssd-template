# Quick Mode Workflow

軽微な変更のための簡易ワークフロー。Spec 作成・Plan・Multi-Review をスキップし、直接実装を行う。

## Purpose

- 品質を損なわない範囲でオーバーヘッドを削減
- スタイル変更、typo 修正、設定値変更など軽微な作業を効率化
- 通常ワークフローへのエスカレーション判断を明確化
- **Impact Guard により他仕様への影響がないことを保証**

---

## Core Flow

```
依頼受領
    ↓
Step 1: Quick Mode 判定（適用条件チェック）
    ↓ PASS
Step 2: ★ Impact Guard ★
    │
    ├─ Spec 参照チェック
    ├─ Matrix 参照チェック
    ├─ コード参照チェック
    └─ 共有コンポーネントチェック
    ↓ PASS（参照なし）
Step 3: 実装
    ↓
Step 4: 検証（Lint/Test）
    ↓
Step 5: コミット
    ↓
Step 6: 完了報告

※ Impact Guard で BLOCK → 通常ワークフローへエスカレーション
```

---

## Eligibility Criteria（適用条件）

以下の **すべて** を満たす場合のみ Quick Mode を使用可能：

| 条件 | チェック |
|------|----------|
| 変更ファイル数 | ≤ 3 ファイル |
| 変更行数 | ≤ 20 行 |
| 新規 ID 追加 | なし（M-*, API-*, UC-*, FR-* 等） |
| ビジネスロジック変更 | なし |
| 既存テストへの影響 | なし |
| セキュリティ関連 | なし |
| API 契約変更 | なし |

### Quick Mode 対象例

| 対象 | 例 |
|------|-----|
| スタイル変更 | 色、フォント、spacing、マージン |
| テキスト修正 | typo、文言調整、ラベル変更 |
| 設定値変更 | 定数、閾値、タイムアウト値 |
| 軽微なバグ修正 | 明らかな 1 行 fix、null チェック追加 |
| コメント追加 | 既存コードへのコメント追記 |

### Quick Mode 対象外（通常ワークフロー必須）

| 対象外 | 理由 |
|--------|------|
| 新機能追加 | ビジネスロジック変更 |
| API エンドポイント追加/変更 | API 契約変更 |
| データベーススキーマ変更 | 影響範囲大 |
| 認証・認可関連 | セキュリティ関連 |
| 複数コンポーネント連携変更 | 影響範囲大 |

---

## Steps

### Step 1: Quick Mode 判定

```
ユーザー依頼を受領
    ↓
適用条件をチェック（上記テーブル参照）
    ↓
すべて YES → Step 2 へ
いずれか NO → 「通常ワークフローを使用してください」と案内
```

**出力:**
```
=== Quick Mode 判定 ===

依頼: {user_request}

チェック結果:
- [x] 変更ファイル数: 2 ファイル (≤ 3)
- [x] 変更行数: 5 行 (≤ 20)
- [x] 新規 ID 追加: なし
- [x] ビジネスロジック変更: なし
- [x] 既存テストへの影響: なし
- [x] セキュリティ関連: なし
- [x] API 契約変更: なし

判定: ✓ Quick Mode 適用可能 → Impact Guard へ
```

---

### Step 2: Impact Guard（影響検証ガード）

**目的:** 変更が他の仕様に影響を与えないことを確証する

> **共通コンポーネント参照:** [shared/impact-analysis.md](shared/impact-analysis.md) を **LIGHT モード** で実行

#### 実行手順

1. 変更対象の識別子（関数名、コンポーネント名、変数名等）を特定
2. LIGHT モードで影響チェックを実行
3. 判定結果に従って続行/エスカレーション

#### 判定ルール

| 結果 | 対応 |
|------|------|
| PASS（参照なし） | ✓ Step 3 へ続行 |
| BLOCK（Spec/Matrix 参照あり） | → change.md または fix.md へエスカレーション |
| WARNING（コード参照多数） | ユーザー確認後、続行可能 |

**出力例:**
```
=== Impact Guard (LIGHT) ===

変更対象: {target_files}

チェック結果:
- [x] Spec 参照: なし
- [x] Matrix 参照: なし

判定: ✓ PASS - 他仕様への影響なし
```

**BLOCK 時:**
```
=== Impact Guard: BLOCKED ===

変更対象: {target_files}
❌ Spec で参照されています: S-AUTH-001

→ change ワークフローを使用してください
```

---

### Step 3: 実装

Impact Guard 通過後、直接変更を実装：

```
Edit tool: {target_file}
  - Apply change
```

### Step 4: 検証

```bash
# Lint（該当する場合）
npm run lint -- --fix

# テスト（影響がある場合）
npm test -- --related {changed_files}

# Spec Lint（.specify/ を変更した場合）
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 5: コミット

Conventional Commit 形式でコミット：

```bash
git add {changed_files}
git commit -m "{type}: {description}" -m "Quick Mode change - no spec update required"
```

**type 選択:**
| 変更種別 | type |
|----------|------|
| スタイル変更 | `style` |
| テキスト修正 | `fix` |
| 設定値変更 | `chore` |
| 軽微バグ修正 | `fix` |

### Step 6: 完了報告

```
=== Quick Mode 完了 ===

変更内容:
- {file1}: {change_description}
- {file2}: {change_description}

検証:
- Impact Guard: PASSED
- Lint: PASSED
- Tests: PASSED (or N/A)

コミット: {commit_hash}

Note: この変更は Impact Guard により他仕様への影響がないことを確認済み。
```

---

## Escalation（エスカレーション）

実装中に以下を発見した場合、Quick Mode を中止し通常ワークフローへ：

| 発見事項 | 対応 |
|----------|------|
| 予想より影響範囲が大きい | add/fix ワークフローへ |
| 関連する既存テストが失敗 | fix ワークフローへ |
| 新規 ID が必要と判明 | add ワークフローへ |
| セキュリティ考慮が必要 | fix ワークフローへ |

**エスカレーション時の出力:**
```
⚠️ Quick Mode からエスカレーション

理由: {escalation_reason}
推奨: {recommended_workflow} ワークフロー

変更を revert し、推奨ワークフローで再開してください。
```

---

## Self-Check

- [ ] 適用条件をすべてチェックしたか
- [ ] **Impact Guard を実行したか**
- [ ] **Spec/Matrix 参照がないことを確認したか**
- [ ] 変更を最小限に留めたか
- [ ] Lint/テストを実行したか
- [ ] Conventional Commit 形式でコミットしたか
- [ ] エスカレーション判断を適切に行ったか

---

## Related Workflows

| Workflow | Relationship |
|----------|--------------|
| add.md | 新機能追加時はこちら |
| fix.md | バグ修正（影響範囲大）はこちら |
| change.md | Spec 変更が必要な場合はこちら |

---

## Configuration

### 適用条件のカスタマイズ

プロジェクトの特性に応じて条件を調整可能：

```markdown
# CLAUDE.md に追記

## Quick Mode Settings

- max_files: 5  # デフォルト: 3
- max_lines: 30 # デフォルト: 20
```
