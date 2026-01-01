# 設計検証と徹底調査計画

**作成日:** 2026-01-01
**目的:** ユーザー質問への回答、設計検証、問題防止、調査計画

---

## 1. ユーザー質問への回答

### Q1: Add で新規実行時に AI が自動で Issue を作成する？

**現状の設計（ai-sier-qa.md より）:**
```
AI: 「GitHub Issue を作成しますか？
     [推奨] Issue を作成して開始
     [代替] Issue なしで開始」
```

→ **AI は「提案」しているが、自動作成ではない**

**確認事項:** ユーザーの意図は「自動作成」ですか？

| オプション | メリット | デメリット |
|-----------|---------|-----------|
| **自動作成** | ユーザー操作不要、一貫性保証 | Issue 数が増えすぎる可能性 |
| **提案後に確認** | ユーザー制御可能 | 毎回確認が必要 |
| **推奨デフォルト** | 確認なしで作成、断れば作成しない | バランス良い |

**推奨:** 「推奨デフォルト」方式
- デフォルトで Issue 作成
- ユーザーが明示的に「Issue なし」と言った場合のみスキップ

---

### Q2: Input ドキュメントのライフサイクル

**現状の設計（スクリプト確認済み）:**

```
1. ユーザーが .specify/input/add-input.md を記入

2. Add ワークフロー実行
   └─ preserve-input.cjs add --feature s-xxx-001
      └─ コピー先: .specify/specs/features/s-xxx-001/input.md
      └─ 元ファイルはそのまま残る

3. reset-input.cjs add
   └─ .specify/input/add-input.md をテンプレートにリセット
```

**ユーザーの認識は正しい** ✓

ただし現状では自動リセットは含まれていない。

**設計改善案:**

```
Add ワークフロー完了時:
  1. preserve-input.cjs add --feature {feature-id}  # コピー
  2. reset-input.cjs add                             # リセット（自動）
```

これをワークフローの最終ステップに追加。

---

### Q3: 前回発見された Minor Problems の再評価

**前回の調査結果:**
- Critical: 28件（多くは構造・スクリプト問題）
- Major: 52件
- Minor: 45件

**今回の AI SIer 改訂で解決されるもの:**

| 問題 | 今回の改訂で解決？ | 理由 |
|------|-------------------|------|
| [C-REF-003] _vision-interview.md の旧構造参照 | ✓ 解決予定 | _vision-interview.md 削除予定 |
| [M-WFL-001] Todo Template欠如 | 一部解決 | 新ワークフローには追加、既存は要更新 |
| [m-EXP-001] 日英混在 | × 未解決 | 別途対応必要 |
| [m-EXP-002] 曖昧表現「適切に」 | × 未解決 | 別途対応必要 |
| スクリプト問題全般 | × 未解決 | 今回のスコープ外 |
| テンプレート問題全般 | × 未解決 | 今回のスコープ外 |

**結論:** 今回の AI SIer 改訂は「ワークフロー設計」の改善であり、**以前発見された構造・スクリプト問題の大半は未解決のまま残る**。

---

## 2. 問題分類と優先度マトリックス

### 2.1 今回の改訂で必ず対応すべき問題

| ID | 問題 | 対応方法 |
|----|------|---------|
| NEW-01 | project-setup に対応する INPUT_TYPES 追加 | reset-input.cjs / preserve-input.cjs 更新 |
| NEW-02 | QA テンプレートディレクトリ作成 | templates/qa/ 作成 |
| NEW-03 | .specify/qa/ ディレクトリ作成 | ✓ 完了済み |
| C-REF-003 | _vision-interview.md 削除 | ✓ 改訂計画に含む |
| C-REF-005 | guide/workflow-map.md 重複 | 削除 |

### 2.2 今回の改訂と同時に対応推奨

| ID | 問題 | 対応方法 |
|----|------|---------|
| C-REF-002 | _quality-flow.md パス誤り | パス修正 |
| C-REF-004 | 相対パス問題（6ファイル） | パス修正 |
| M-WFL-001 | Todo Template 欠如 | 全ワークフローに追加 |
| P1-03 | constitution.md バージョン同期 | バージョン統一 |

### 2.3 改訂後に対応（スコープ外だが重要）

| ID | 問題 | 優先度 |
|----|------|--------|
| C-SCR-001 | pr.cjs Shell Injection | Critical |
| C-SCR-002 | spec-lint.cjs 重複チェック漏れ | Critical |
| M-SCR-001 | コード複製（DRY違反） | Major |

---

## 3. 問題防止戦略

### 3.1 実装時のチェックリスト

改訂実装時に各フェーズで確認：

#### Phase 2（共通コンポーネント）完了時
- [ ] `_qa-generation.md` が存在し、参照パスが正しい
- [ ] `_qa-analysis.md` が存在し、参照パスが正しい
- [ ] `_professional-proposals.md` が存在し、参照パスが正しい
- [ ] 既存の `_quality-flow.md` が新ファイルを正しく参照

#### Phase 3（Input・QA テンプレート）完了時
- [ ] `templates/qa/` ディレクトリが存在
- [ ] `project-setup-qa.md` が存在
- [ ] `feature-qa.md` が存在
- [ ] `fix-qa.md` が存在
- [ ] `reset-input.cjs` が project-setup に対応
- [ ] `preserve-input.cjs` が project-setup に対応

#### Phase 4（ワークフロー）完了時
- [ ] `project-setup.md` が存在し、Todo Template を含む
- [ ] `add.md` が QA 方式を正しく参照
- [ ] `fix.md` が QA 方式を正しく参照
- [ ] `vision.md` が project-setup.md へリダイレクト
- [ ] `design.md` が project-setup.md へリダイレクト
- [ ] 全ての共通コンポーネント参照が正しい

#### Phase 7（削除・クリーンアップ）完了時
- [ ] `_vision-interview.md` 削除済み
- [ ] `_deep-interview.md` 削除済み
- [ ] 旧ファイルへの参照が 0 件（grep 確認）

#### Phase 8（検証）完了時
- [ ] `spec-lint.cjs` エラーなし
- [ ] 全ワークフローの参照が解決可能
- [ ] スクリプト動作確認完了

### 3.2 自動検証スクリプト

改訂完了後に実行する検証コマンド：

```bash
# 1. 旧構造への参照チェック
grep -r "spec-mesh-entry" .claude/skills/spec-mesh/
grep -r "spec-mesh-develop" .claude/skills/spec-mesh/
grep -r "spec-mesh-quality" .claude/skills/spec-mesh/
grep -r "spec-mesh-test" .claude/skills/spec-mesh/
grep -r "spec-mesh-meta" .claude/skills/spec-mesh/
grep -r "_vision-interview" .claude/skills/spec-mesh/
grep -r "_deep-interview" .claude/skills/spec-mesh/
grep -r "_guided-discovery" .claude/skills/spec-mesh/

# 2. 新しいファイルの存在確認
ls -la .claude/skills/spec-mesh/workflows/shared/_qa-generation.md
ls -la .claude/skills/spec-mesh/workflows/shared/_qa-analysis.md
ls -la .claude/skills/spec-mesh/workflows/shared/_professional-proposals.md
ls -la .claude/skills/spec-mesh/templates/qa/

# 3. Lint 実行
node .claude/skills/spec-mesh/scripts/spec-lint.cjs

# 4. 参照解決テスト
node .claude/skills/spec-mesh/scripts/validate-refs.cjs  # 新規作成推奨
```

---

## 4. 徹底調査計画（改訂実施後）

### 4.1 調査目的

改訂実施後に以下を検証：
1. **構造整合性**: 全ての参照パスが解決可能か
2. **機能動作**: 各ワークフローが正常に動作するか
3. **品質水準**: 既存の問題が新たに発生していないか
4. **回帰テスト**: 改訂で既存機能が壊れていないか

### 4.2 Agent 並列調査計画

**調査規模:** 30 Agent 以上による網羅的調査

#### Phase A: 構造検証（10 Agent）

| Agent | 調査対象 | 確認内容 |
|-------|---------|---------|
| A-01 | workflows/*.md | 全ワークフローの参照整合性 |
| A-02 | workflows/shared/*.md | 共通コンポーネントの整合性 |
| A-03 | templates/*.md | テンプレートの形式・参照 |
| A-04 | templates/qa/*.md | QA テンプレートの構造 |
| A-05 | constitution/*.md | Constitution の整合性 |
| A-06 | guides/*.md | ガイドの整合性 |
| A-07 | scripts/*.cjs | スクリプトの動作 |
| A-08 | scripts/lib/*.cjs | ライブラリの整合性 |
| A-09 | docs/*.md | 外部ドキュメントの整合性 |
| A-10 | SKILL.md, CLAUDE.md | ルーティング定義 |

#### Phase B: ワークフロー動作検証（10 Agent）

| Agent | 調査対象 | 確認内容 |
|-------|---------|---------|
| B-01 | project-setup | 新規プロジェクト開始フロー |
| B-02 | add | 機能追加フロー |
| B-03 | fix | バグ修正フロー |
| B-04 | issue | Issue 開始フロー |
| B-05 | change | Spec 変更フロー |
| B-06 | quick | Quick Mode フロー |
| B-07 | plan + tasks | 実装計画フロー |
| B-08 | implement + pr | 実装・PR フロー |
| B-09 | review + lint | 品質チェックフロー |
| B-10 | test-scenario + e2e | テストフロー |

#### Phase C: QA 方式検証（5 Agent）

| Agent | 調査対象 | 確認内容 |
|-------|---------|---------|
| C-01 | _qa-generation.md | QA 生成ロジックの妥当性 |
| C-02 | _qa-analysis.md | QA 分析ロジックの妥当性 |
| C-03 | _professional-proposals.md | 提案ロジックの網羅性 |
| C-04 | QA テンプレート群 | テンプレート構造の妥当性 |
| C-05 | QA ↔ Spec 連携 | QA から Spec 生成の整合性 |

#### Phase D: 回帰テスト（5 Agent）

| Agent | 調査対象 | 確認内容 |
|-------|---------|---------|
| D-01 | 既存 Critical 問題 | 再発していないか |
| D-02 | 既存 Major 問題 | 再発していないか |
| D-03 | スクリプト互換性 | 既存スクリプトが動作するか |
| D-04 | テンプレート互換性 | 既存 Spec が有効か |
| D-05 | 外部参照整合性 | 外部ドキュメントとの整合性 |

### 4.3 調査実行手順

```
1. 改訂実施完了
   ↓
2. 自動検証スクリプト実行
   ↓
3. Phase A: 構造検証（10 Agent 並列）
   ↓
4. Phase A 結果集約・問題修正
   ↓
5. Phase B: ワークフロー動作検証（10 Agent 並列）
   ↓
6. Phase B 結果集約・問題修正
   ↓
7. Phase C: QA 方式検証（5 Agent 並列）
   ↓
8. Phase C 結果集約・問題修正
   ↓
9. Phase D: 回帰テスト（5 Agent 並列）
   ↓
10. 最終レポート作成
```

### 4.4 各 Agent への指示テンプレート

```markdown
## 調査指示: Agent {ID}

### 対象
{調査対象ファイル/ディレクトリ}

### 確認内容
1. {確認項目1}
2. {確認項目2}
3. {確認項目3}

### 出力形式
| 項目 | 状態 | 詳細 |
|------|------|------|
| ... | OK/NG/WARN | ... |

### 問題発見時
- 問題ID: {Phase}-{Agent}-{番号}
- 重要度: Critical/Major/Minor
- ファイル: {パス:行番号}
- 問題内容: {説明}
- 推奨修正: {対応案}
```

### 4.5 調査結果集約フォーマット

```markdown
# 改訂後調査結果レポート

## Executive Summary
| Phase | Agent数 | OK | NG | WARN |
|-------|--------|-----|-----|------|
| A: 構造検証 | 10 | ? | ? | ? |
| B: ワークフロー | 10 | ? | ? | ? |
| C: QA方式 | 5 | ? | ? | ? |
| D: 回帰テスト | 5 | ? | ? | ? |
| **合計** | **30** | ? | ? | ? |

## 発見された問題
### Critical
(問題一覧)

### Major
(問題一覧)

### Minor
(問題一覧)

## 推奨アクション
1. ...
2. ...
```

---

## 5. 設計更新事項

### 5.1 Issue 自動作成の設計更新

**更新内容:** `ai-sier-qa.md` の Q6.2 を更新

```markdown
### Q6.2: Issue がない状態で依頼が来たら？

**A:** AI がデフォルトで Issue を作成。

```
AI: 「Issue #N を作成しました。
     [タイトル] {機能名} の追加
     [ラベル] feature/fix/change

     ※ Issue なしで進めたい場合はお知らせください」
```

**例外:**
- Quick Mode: Issue 作成不要
- ユーザーが明示的に「Issue なし」と指示
```

### 5.2 Input リセット自動化の設計更新

**更新内容:** ワークフロー完了時に自動リセット

```markdown
## Add Workflow 最終ステップ（追加）

### Step N: Input リセット

1. preserve-input.cjs で入力を Feature ディレクトリにコピー
2. reset-input.cjs で入力テンプレートをリセット

```bash
node .claude/skills/spec-mesh/scripts/preserve-input.cjs add --feature {feature-id}
node .claude/skills/spec-mesh/scripts/reset-input.cjs add
```

※ これにより次の Feature 追加時に空のテンプレートから開始できる
```

---

## 6. 次のステップ

### 即時対応
1. [ ] この設計文書をレビュー・承認
2. [ ] Issue 自動作成設計の最終確認
3. [ ] Input リセット自動化設計の最終確認

### 改訂実施
1. [ ] Phase 0-8 を順次実行
2. [ ] 各 Phase 完了時にチェックリスト確認
3. [ ] 自動検証スクリプト実行

### 改訂後調査
1. [ ] 30 Agent による徹底調査実行
2. [ ] 結果集約・問題修正
3. [ ] 最終レポート作成

---

## Appendix: 調査 Agent 起動コマンド例

```
Task tool (parallel, subagent_type: reviewer):
  Agent A-01: "workflows/*.md の全参照パスを検証し、解決不能な参照を報告"
  Agent A-02: "workflows/shared/*.md の整合性を検証"
  ...
  Agent A-10: "SKILL.md と CLAUDE.md のルーティング定義を検証"
```

