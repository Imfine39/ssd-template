# Spec-Mesh 修正計画

**作成日:** 2025-12-31
**最終更新:** 2025-12-31
**参照:** [調査レポート](investigation-report.md)

---

## 進捗状況

| Batch | 内容 | 状態 |
|-------|------|------|
| 1A | 構造修正（参照・パス） | ✅ 完了 |
| 1B | スクリプト修正 | ✅ 完了 |
| 1C | テンプレート統一 | ✅ 完了 |
| 1D | ワークフローロジック修正 | ✅ 完了 |
| 1E | SSOT 確立 | ⏸️ 後回し（影響範囲大） |
| 1F | UX 修正 | ✅ 完了 |

---

## 修正フェーズ概要

```
Phase 1: Critical Fixes (P1) ─── 18件 ─── 即時対応
    │
Phase 2: Major Improvements (P2) ─── 48件 ─── 計画的改善
    │
Phase 3: Minor Enhancements (P3) ─── 19件 ─── バックログ
```

---

## Phase 1: Critical Fixes

### Batch 1A: 構造修正（参照・パス）

**依存関係なし - 並列実行可能**

#### Task 1A-1: impact-check.cjs 参照削除
```
File: .claude/skills/spec-mesh/workflows/shared/impact-analysis.md
Line: 309
Action: 存在しないスクリプト参照を削除または代替コマンドに置換
```

#### Task 1A-2: 相対パス修正
```
Files:
  - .claude/skills/spec-mesh-develop/workflows/feedback.md:74
  - .claude/skills/spec-mesh-meta/workflows/change.md:91
  - .claude/skills/spec-mesh-entry/workflows/quick.md:114
Action: shared/impact-analysis.md → ../../spec-mesh/workflows/shared/impact-analysis.md
```

#### Task 1A-3: 削除 spec.md 参照削除
```
Files: 複数（grep で検索）
Pattern: spec-mesh-meta/workflows/spec.md
Action: 参照を削除
```

---

### Batch 1B: スクリプト修正

**依存関係なし - 並列実行可能**

#### Task 1B-1: post-merge.cjs 変数名修正
```
File: .claude/skills/spec-mesh/scripts/post-merge.cjs
Lines: 69-91
Action: featureId → specId にリネーム
```

#### Task 1B-2: changelog.cjs エラーハンドリング追加
```
File: .claude/skills/spec-mesh/scripts/changelog.cjs
Lines: 93-104
Action: 必須パラメータチェックと明確なエラーメッセージを追加
```

---

### Batch 1C: テンプレート統一

**依存関係なし - 並列実行可能**

#### Task 1C-1: feature-spec.md プレースホルダ修正
```
File: .claude/skills/spec-mesh/templates/feature-spec.md
Line: 27
Action: S-{AREA}-001 → S-{XXX}-001 に統一
```

#### Task 1C-2: fix-spec.md プレースホルダ修正
```
File: .claude/skills/spec-mesh/templates/fix-spec.md
Line: 22
Action: F-{AREA}-001 → F-{XXX}-001 に統一
```

---

### Batch 1D: ワークフローロジック修正

**Task 1D-2 は 1D-1 に依存**

#### Task 1D-1: issue.md Quick type ルーティング追加
```
File: .claude/skills/spec-mesh-entry/workflows/issue.md
Lines: 75-76 付近
Action: Quick type 判定時の quick.md へのルーティングを追加

追加内容:
| Quick (typo, 軽微) | quick.md | Quick Mode で対応 |
```

#### Task 1D-2: Entry workflows step 追跡追加
```
Files:
  - .claude/skills/spec-mesh-entry/workflows/add.md
  - .claude/skills/spec-mesh-entry/workflows/fix.md
  - .claude/skills/spec-mesh-entry/workflows/issue.md
Action: Spec 作成後に以下を追加
  node .claude/skills/spec-mesh/scripts/state.cjs branch --set-step spec
```

---

### Batch 1E: SSOT 確立（重複解消）

**これは影響範囲が大きいため、他のタスク完了後に実施**

#### Task 1E-1: CLARIFY GATE 定義を quality-gates.md に集約
```
Single Source of Truth: constitution/quality-gates.md
参照元（更新）:
  - workflows/shared/_clarify-gate.md → 参照のみに変更
  - spec-mesh/SKILL.md → 参照のみに変更
```

#### Task 1E-2: Multi-Review 定義を quality-gates.md に集約
```
Single Source of Truth: constitution/quality-gates.md
参照元（更新）:
  - workflows/shared/_quality-flow.md → 参照のみに変更
```

#### Task 1E-3: Spec Creation Flow を core.md に集約
```
Single Source of Truth: constitution/core.md
参照元（更新）:
  - CLAUDE.md → 簡略版 + 参照リンク
  - spec-mesh/SKILL.md → 参照のみ
  - 各子スキル SKILL.md → 参照のみ
```

---

### Batch 1F: UX 修正

**依存関係なし - 並列実行可能**

#### Task 1F-1: issue.md 出力フォーマット統一
```
File: .claude/skills/spec-mesh-entry/workflows/issue.md
Action: 完了時出力を === ... === 形式に統一
```

#### Task 1F-2: _vision-interview.md 出力改善
```
File: .claude/skills/spec-mesh/workflows/shared/_vision-interview.md
Action: Output Format セクションを充実化
```

---

## 実行順序

```
Batch 1A (構造) ──┬──► Batch 1D (ロジック) ──┬──► Batch 1E (SSOT)
Batch 1B (スクリプト) ─┤                        │
Batch 1C (テンプレート) ┘                        │
                                               │
Batch 1F (UX) ─────────────────────────────────┘
```

---

## Phase 2: Major Improvements（詳細は別途）

### 概要

| カテゴリ | 件数 | 主な作業 |
|---------|------|---------|
| ワークフロー改善 | 6件 | PASSED_WITH_DEFERRED 処理追加等 |
| セマンティック改善 | 13件 | judgment-criteria.md への具体化追加 |
| スクリプト改善 | 7件 | エラーハンドリング、JSON 出力追加 |
| UX/DX 改善 | 12件 | Todo Template 追加、選択肢改善 |
| 重複解消 | 8件 | インライン定義を参照に変更 |

---

## Phase 3: Minor Enhancements（バックログ）

- ステップ番号整合性
- コメント改善
- 言語ポリシー統一
- ナビゲーション改善

---

## Quick Wins（今すぐ実行可能）

```bash
# 1. 相対パス修正（3ファイル）
# feedback.md, change.md, quick.md の shared/ パスを修正

# 2. プレースホルダ統一
# feature-spec.md, fix-spec.md の {AREA} → {XXX}

# 3. 削除ファイル参照削除
grep -r "spec-mesh-meta/workflows/spec.md" .claude/
# → 見つかった参照を削除
```

---

## チェックリスト

### Phase 1 完了条件

- [ ] Batch 1A: 構造修正完了
- [ ] Batch 1B: スクリプト修正完了
- [ ] Batch 1C: テンプレート統一完了
- [ ] Batch 1D: ワークフローロジック修正完了
- [ ] Batch 1E: SSOT 確立完了
- [ ] Batch 1F: UX 修正完了
- [ ] 全 P1 issue 解消確認

### 検証方法

```bash
# Lint 実行
node .claude/skills/spec-mesh/scripts/spec-lint.cjs

# 参照チェック
# - 存在しないファイル参照がないこと
# - 相対パスが正しく解決すること

# スクリプトテスト
node .claude/skills/spec-mesh/scripts/post-merge.cjs --help
node .claude/skills/spec-mesh/scripts/changelog.cjs --help
```

---

## 実行指示

修正を開始する場合:

```
Phase 1 を実行してください
```

または特定のバッチのみ:

```
Batch 1A（構造修正）を実行してください
```
