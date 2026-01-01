# Improvement Proposals

**作成日:** 2026-01-01

---

## 優先度別改善提案一覧

### Priority 1: Critical（即時対応）

| ID | 提案 | 対象ファイル | 実装難易度 | 影響範囲 |
|----|------|-------------|-----------|---------|
| P1-01 | pr.cjs の Shell Injection 修正 | scripts/pr.cjs | 低 | PR作成 |
| P1-02 | spec-lint.cjs Incremental Mode 修正 | scripts/spec-lint.cjs | 中 | Lint実行 |
| P1-03 | constitution.md バージョン同期 | constitution.md | 低 | 全体 |
| P1-04 | _quality-flow.md パス修正 | workflows/shared/_quality-flow.md | 低 | Quality Flow |
| P1-05 | 旧構造参照の一括更新 | 複数ファイル | 中 | 全体 |
| P1-06 | state.cjs Boolean検証追加 | scripts/state.cjs | 低 | 状態管理 |
| P1-07 | scaffold-spec.cjs 重複挿入防止 | scripts/scaffold-spec.cjs | 中 | Spec生成 |
| P1-08 | post-merge.cjs Status regex拡張 | scripts/post-merge.cjs | 低 | マージ後処理 |

---

### Priority 2: Major（短期対応 - 1週間以内）

| ID | 提案 | 対象ファイル | 実装難易度 | 影響範囲 |
|----|------|-------------|-----------|---------|
| P2-01 | コード重複解消（Matrix関数） | matrix-ops.cjs, validate-matrix.cjs | 中 | Matrix操作 |
| P2-02 | Master ID命名統一 | templates/feature-spec.md, domain-spec.md | 低 | ID体系 |
| P2-03 | Status定義の統一化 | constitution/terminology.md, templates/* | 中 | 全テンプレート |
| P2-04 | 相対パス基準の統一 | 全テンプレート | 中 | 参照解決 |
| P2-05 | scaffold → state.cjs 連携追加 | scripts/scaffold-spec.cjs | 中 | Spec生成 |
| P2-06 | Todo Template追加（9ファイル） | 各ワークフロー | 低 | ワークフロー |
| P2-07 | paths.cjs Vision Legacyパス追加 | scripts/lib/paths.cjs | 低 | パス解決 |
| P2-08 | changelog.cjs Entry ID改善 | scripts/changelog.cjs | 低 | 変更履歴 |
| P2-09 | guide/workflow-map.md 削除 | .claude/skills/guide/workflow-map.md | 低 | 重複解消 |
| P2-10 | PASSED_WITH_DEFERRED処理追加 | 複数ワークフロー | 中 | CLARIFY GATE |

---

### Priority 3: Minor（中期対応 - 1ヶ月以内）

| ID | 提案 | 対象ファイル | 実装難易度 | 影響範囲 |
|----|------|-------------|-----------|---------|
| P3-01 | 日英混在の解消 | 複数ワークフロー | 低 | 可読性 |
| P3-02 | parseArgs複数値引数対応 | scripts/lib/cli-utils.cjs | 中 | CLI操作 |
| P3-03 | テーブルセル|エスケープ | scripts/lib/matrix-utils.cjs | 低 | Matrix表示 |
| P3-04 | TC-J{NN}記法の正式化 | guides/id-naming.md | 低 | ID命名 |
| P3-05 | Task ID半整数形式の統一 | templates/tasks.md | 低 | タスク管理 |
| P3-06 | 引数パーサのルート解決統一 | 複数スクリプト | 中 | CLI操作 |
| P3-07 | 判断基準の具体化 | guides/judgment-criteria.md | 中 | 判断支援 |
| P3-08 | エラーメッセージの改善 | 複数スクリプト | 中 | デバッグ |

---

## 詳細提案

### P1-01: pr.cjs Shell Injection 修正

**現状:**
```javascript
// scripts/pr.cjs:106-109
const result = spawnSync('gh', [...args], {
  shell: true, // ★ 危険
  ...
});
```

**改善案:**
```javascript
const result = spawnSync('gh', args, {
  shell: false,
  stdio: 'inherit'
});
```

**理由:** `shell: true` により、title/bodyにシェルコマンドが含まれる場合に実行される可能性

---

### P1-05: 旧構造参照の一括更新

**対象パターン:**
```
spec-mesh-entry/workflows/* → spec-mesh/workflows/*
spec-mesh-develop/workflows/* → spec-mesh/workflows/*
spec-mesh-quality/workflows/* → spec-mesh/workflows/*
spec-mesh-test/workflows/* → spec-mesh/workflows/*
spec-mesh-meta/workflows/* → spec-mesh/workflows/*
```

**対象ファイル:**
- `workflows/shared/_vision-interview.md`
- `workflows/shared/_cascade-update.md`
- `guides/human-checkpoint-patterns.md`
- `workflows/shared/_finalize.md`

**実行コマンド（検索用）:**
```bash
grep -r "spec-mesh-entry/workflows" .claude/skills/
grep -r "spec-mesh-develop/workflows" .claude/skills/
grep -r "spec-mesh-quality/workflows" .claude/skills/
grep -r "spec-mesh-test/workflows" .claude/skills/
grep -r "spec-mesh-meta/workflows" .claude/skills/
```

---

### P2-01: コード重複解消（Matrix関数）

**現状:** 以下の関数が3ファイルで重複定義
- `extractScreenIds()`
- `extractMasterIds()`
- `extractApiIds()`
- `extractFeatureIds()`
- `findMissing()`

**改善案:**
1. `lib/matrix-utils.cjs` に関数を集約
2. `matrix-ops.cjs`, `validate-matrix.cjs`, `generate-matrix-view.cjs` から参照

```javascript
// lib/matrix-utils.cjs
module.exports = {
  // 既存のエクスポート
  ...existingExports,

  // 追加
  extractScreenIds,
  extractMasterIds,
  extractApiIds,
  extractFeatureIds,
  findMissing
};
```

---

### P2-02: Master ID命名統一

**現状:**
- Domain Spec: `M-NAME`（番号接尾辞なし）
- Feature Spec: `M-{AREA}-001`

**改善案:** Domain Specの定義を正として統一

```markdown
# Domain Spec
Master ID形式: M-{NAME}
例: M-USER, M-ORDER, M-PRODUCT

# Feature Spec
Dependencies:
- M-USER (ユーザーマスター)
- M-ORDER (注文マスター)
```

**更新対象:**
- `templates/feature-spec.md` のSection 2.1記述修正
- `guides/id-naming.md` で明確化

---

### P2-03: Status定義の統一化

**提案:** `constitution/terminology.md` に全Status定義を集約

```markdown
## Status 定義

### Spec Level Status
| Status | 説明 |
|--------|------|
| Draft | 作成中 |
| In Review | レビュー中 |
| Clarified | 曖昧点解消済み |
| Approved | 承認済み |
| Implemented | 実装完了 |

### Entity Level Status（Screen等）
| Status | 説明 |
|--------|------|
| Planned | 計画中 |
| In Progress | 実装中 |
| Implemented | 実装完了 |
| Deprecated | 廃止予定 |

### Test Level Status
| Status | 説明 |
|--------|------|
| Pending | 未実行 |
| Pass | 成功 |
| Fail | 失敗 |
| Blocked | ブロック |
| Skipped | スキップ |
```

---

### P2-05: scaffold → state.cjs 連携追加

**現状:** scaffold-spec.cjs実行後にbranch-state.cjsonのspecId/specPathが未設定

**改善案:**

```javascript
// scaffold-spec.cjs 末尾に追加
const { execSync } = require('child_process');

// Spec生成後に状態更新
try {
  execSync(`node ${stateScriptPath} branch --set-spec-id ${specId} --set-spec-path ${specPath}`, {
    stdio: 'inherit'
  });
} catch (e) {
  console.warn('Warning: Failed to update branch state');
}
```

---

### P2-06: Todo Template追加

**対象ファイル:** 9ファイル

各ワークフローの冒頭に以下のパターンを追加:

```markdown
## Todo Template

このワークフロー開始時に以下をTodoWriteで登録:

```json
[
  {"content": "ステップ1の説明", "status": "pending", "activeForm": "ステップ1実行中"},
  {"content": "ステップ2の説明", "status": "pending", "activeForm": "ステップ2実行中"},
  ...
]
```
```

---

## 実行ロードマップ

```
Week 1: Priority 1 (Critical)
├── Day 1-2: P1-01〜P1-04（セキュリティ・パス修正）
├── Day 3-4: P1-05（旧構造参照一括更新）
└── Day 5: P1-06〜P1-08（スクリプト修正）

Week 2: Priority 2 (Major) - Part 1
├── Day 1-2: P2-01（コード重複解消）
├── Day 3: P2-02, P2-07（ID・パス統一）
└── Day 4-5: P2-03, P2-04（Status・パス基準統一）

Week 3: Priority 2 (Major) - Part 2
├── Day 1-2: P2-05, P2-08（スクリプト連携）
├── Day 3: P2-06（Todo Template追加）
└── Day 4-5: P2-09, P2-10（重複解消・DEFERRED処理）

Week 4+: Priority 3 (Minor)
└── 順次対応
```

---

## 検証チェックリスト

### Priority 1完了後
- [ ] `node scripts/pr.cjs` がshell injection耐性を持つ
- [ ] `node scripts/spec-lint.cjs --incremental` が重複IDを検出
- [ ] constitution.mdのバージョンが個別ファイルと一致
- [ ] 旧構造（spec-mesh-*）への参照が0件

### Priority 2完了後
- [ ] Matrix関数がlib/matrix-utils.cjsのみで定義
- [ ] 全テンプレートでMaster IDが`M-NAME`形式
- [ ] terminology.mdに全Status定義が集約
- [ ] scaffold-spec.cjs後にstate.cjsが自動更新

### Priority 3完了後
- [ ] 日本語/英語の混在がなくなる
- [ ] 全CLIが複数値引数に対応
- [ ] TC-J形式がid-naming.mdで正式定義
