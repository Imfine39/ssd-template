# Implement Workflow

Execute tasks from the plan with tests and adherence to spec.

## Prerequisites

- tasks.md must exist
- On Issue-linked branch

---

## Todo Management

**IMPORTANT:** このワークフローでは、ワークフローステップではなく **tasks.md の各タスク** を TodoWrite で管理する。

1. Step 2 で tasks.md を読み込んだ後、各タスクを TodoWrite に登録
2. 各タスクの実装前に `in_progress` に更新
3. 各タスクの実装完了時に `completed` に更新

**ワークフローステップ自体の Todo 化は不要。** タスクの進捗管理に集中すること。

---

## Task 複雑性判断

各タスク実装前に複雑性を評価し、適切なアプローチを選択する。

### ultrathink 推奨条件

以下のいずれかに該当する場合、ultrathink を推奨:

| 条件 | 理由 |
|------|------|
| **依存関係が 3 以上** | 複数 Spec/コンポーネント間の整合性確認が必要 |
| **既存コードの大幅変更** | 影響範囲の慎重な分析が必要 |
| **セキュリティ関連** | 脆弱性を生まないよう慎重に |
| **データマイグレーション** | 破壊的変更のリスク |
| **API 契約変更** | 後方互換性の考慮 |
| **エッジケースが多い** | 網羅的な考慮が必要 |

### 判断フロー

```
Task 開始
    │
    ├─ 複雑性チェック
    │   ├─ 依存関係 ≥ 3？ → ultrathink 推奨
    │   ├─ セキュリティ関連？ → ultrathink 推奨
    │   └─ API 契約変更？ → ultrathink 推奨
    │
    └─ 複数 Task がある場合
        ├─ ファイル重複あり？ → 順次実行
        ├─ 依存関係あり？ → 順次実行
        └─ すべて独立？ → 並列実行可能
```

---

## Steps

### Step 1: Verify Context

1. **Check branch:**
   ```bash
   git branch --show-current
   ```
   - Must be `feature/*` or `fix/*`

2. **Read all context:**
   - Spec: `.specify/specs/features/{id}/spec.md`
   - Plan: `.specify/specs/features/{id}/plan.md`
   - Tasks: `.specify/specs/features/{id}/tasks.md`

3. **Confirm Spec IDs** are clear (S-*, UC-*, FR-*)

### Step 2: Load Tasks

1. Parse tasks.md for pending tasks
2. **TodoWrite でタスクを登録:**
   ```
   tasks.md の各タスクを TodoWrite に登録する。
   例: Task 1, Task 2, Task 3 → それぞれ pending として登録
   ```
3. Present task list
4. Confirm implementation order with user

### Step 3: For Each Task

**3.1 Update progress:**
```bash
node .claude/skills/nick-q/scripts/state.cjs branch --set-task-progress {completed}/{total}
```

**3.2 Read task requirements:**
- Identify related UC/FR/SC IDs
- Understand acceptance criteria

**3.2.5 [DEFERRED] チェック:**

実装対象のタスクに関連する Spec セクションを読み込む際、[DEFERRED] マーカーを検索:

```bash
Grep tool:
  pattern: "\[DEFERRED:[^\]]+\]"
  path: {spec_path}
  output_mode: content
```

**[DEFERRED] 項目が見つかった場合:**

```
=== [DEFERRED] 項目を発見 ===

タスク: {タスク名}
関連する [DEFERRED] 項目:
1. [DEFERRED: 技術検証後に決定] - API レスポンス形式

このまま実装を続けることはできません。

AskUserQuestion:
  questions:
    - question: "どのように進めますか？"
      header: "[DEFERRED] 対応"
      options:
        - label: "今すぐ clarify する"
          description: "clarify ワークフローで解消してから続行"
        - label: "仮定を置いて実装"
          description: "仮定を記録し、後で検証（リスクあり）"
        - label: "作業を中断"
          description: "このタスクを保留し、別のタスクに移る"
      multiSelect: false
```

**「今すぐ clarify する」を選択した場合:**
1. clarify ワークフローを実行
2. [DEFERRED] が解消されたら implement に戻る
3. サイクルカウントをインクリメント

**「仮定を置いて実装」を選択した場合:**
1. Implementation Notes に Assumption Log を記録:
   ```markdown
   ### Assumption Log

   | ID | Assumption | Related [DEFERRED] | Verification Needed |
   |----|------------|-------------------|---------------------|
   | ASM-001 | API returns JSON array | Section 3.2 | API spec confirmation |
   ```
2. Risks セクションに影響を追記
3. 後で検証が必要なことをマーク
4. 実装を続行

**「作業を中断」を選択した場合:**
1. タスクを保留としてマーク
2. 別のタスクに移る

**3.3 Write tests first** (fail-first):
```typescript
/**
 * @spec S-XXX-001
 * @uc UC-001
 */
describe('Feature behavior', () => {
  it('should do X', () => {
    // Test implementation
  });
});
```

**3.4 Implement code:**
- Small, focused changes
- Follow existing patterns
- Reference Spec IDs in comments where helpful

**3.5 Run tests:**
- All tests should pass
- If fail, classify:
  | Classification | Action |
  |----------------|--------|
  | Spec bug | Need feedback |
  | Test bug | Fix test |
  | Implementation bug | Fix code |
  | Environment bug | Fix config |

**3.6 Check for feedback needs:**
- Technical constraint not in spec?
- Ambiguity that needed decision?
- Deviation from spec required?
- Design decision made during implementation?

**Feedback Approval Flow:**
1. If any of the above apply, **stop and ask human permission**
2. Describe the issue and proposed feedback
3. On approval, use feedback ワークフロー to record:
   ```
   feedback ワークフロー
   ```
4. The feedback workflow will guide you to add Implementation Notes to the appropriate Spec
5. **Never** record feedback without explicit human approval

See `workflows/feedback.md` for detailed feedback recording process.

### Step 4: After All Tasks

1. **Run full test suite:**
   ```bash
   npm test
   ```

2. **Run lint:**
   ```bash
   npm run lint
   node .claude/skills/nick-q/scripts/spec-lint.cjs
   ```

3. **Fix any issues**

4. **Assumption 検証（仮定を置いた場合のみ）:**

   仮定を置いて実装した場合、[DEFERRED] が解消されたら検証を実施:

   | タイミング | アクション |
   |-----------|----------|
   | [DEFERRED] 解消時 | 仮定と実際の決定を比較 |
   | PR レビュー時 | Assumption Log を確認 |
   | テスト実行時 | 仮定に基づくテストケースを特定 |

   **仮定が間違っていた場合:**
   ```
   仮定と決定が不一致
       ↓
   影響範囲を特定（Assumption Log から）
       ↓
   修正タスクを作成
       ↓
   tasks.md に追加
       ↓
   実装修正 → テスト → PR 更新
   ```

   **リバート判断基準:**

   | 影響度 | アクション |
   |-------|----------|
   | 軽微（1-2ファイル） | インプレース修正 |
   | 中程度（3-5ファイル） | 修正タスク作成 |
   | 重大（6+ファイル or アーキテクチャ変更） | 新規 Feature/Fix として対応 |

---

## Implement ↔ Feedback Cycle

テスト失敗時のサイクル処理。

```
Step 3 完了（タスク実装）
    │
    ▼
Step 4: テスト実行
    │
    ├─ 全テスト PASS ────────────────────────→ Step 5 へ（サイクル終了）
    │
    ▼ テスト FAIL
    │
失敗の分類
    │
    ├─ 実装バグ ──────────→ コード修正 → Step 3 へ戻る（サイクル +1）
    │
    ├─ テスト不備 ────────→ テスト修正 → Step 4 再実行
    │
    ├─ Spec 不備 ─────────→ feedback.md → clarify.md → Multi-Review
    │                       → Spec 修正後、Step 3 へ戻る（サイクル +1）
    │
    └─ 環境/設定問題 ─────→ 設定修正 → Step 4 再実行
```

### Spec 不備時の詳細フロー

```
Spec 不備を検出
    │
    ▼
Step A: feedback.md を実行
    │
    ├─ 1. 問題の特定と記録
    ├─ 2. [HUMAN_CHECKPOINT] でユーザー承認を得る
    └─ 3. Spec の Implementation Notes に記録
    │
    ▼
Step B: clarify.md を実行（必要な場合）
    │
    ├─ 1. [NEEDS CLARIFICATION] 項目を解消
    └─ 2. Spec を更新
    │
    ▼
Step C: review.md（Multi-Review）を再実行
    │
    ├─ 1. 更新した Spec を 3 観点でレビュー
    ├─ 2. SPEC GATE を再通過
    └─ 3. [HUMAN_CHECKPOINT] で承認
    │
    ▼
implement.md Step 3 へ戻る
    └─ サイクルカウント +1
```

**重要:** feedback → clarify → Multi-Review の順序を守ること。直接 implement に戻らないこと。

### サイクル終了条件

| 条件 | 結果 |
|------|------|
| 全テスト PASS | ✓ サイクル終了 → Step 5 へ |
| ユーザーが「テストなしで続行」を選択 | ✓ サイクル終了（[HUMAN_CHECKPOINT]） |

> **Note:** サイクル回数に上限はありません。Spec に問題がなくなるまで続けてください。

### サイクル回数のトラッキング（将来機能）

> **Note:** 以下のコマンドは将来機能として設計されており、現時点では未実装です。サイクル回数は AI が会話内で手動追跡してください。

```bash
# [FUTURE] これらのコマンドは未実装
# サイクル開始時（Step 3 へ戻る時）
# node .claude/skills/nick-q/scripts/state.cjs branch --increment-cycle

# サイクル回数確認
# node .claude/skills/nick-q/scripts/state.cjs branch --get-cycle

# 完了時にリセット
# node .claude/skills/nick-q/scripts/state.cjs branch --reset-cycle
```

**警告の目安（手動確認）:**
- サイクル 5回以上: ⚠️ Spec に問題がないか確認を促す
- サイクル 10回以上: ⚠️ Spec の Clarify が必要な可能性を示唆

これらは警告のみで、サイクルを停止することはありません。問題が解決するまで続行してください。

---

### Step 5: Summary

Display:
```
=== 実装完了 ===

Feature: {Feature名}
Tasks: {completed}/{total} 完了

Test Results:
- Passed: {N}
- Failed: {N}
- Skipped: {N}

Feedback recorded: {Y/N}

次のステップ: pr ワークフロー で PR 作成
```

### Step 6: Update State

```bash
node .claude/skills/nick-q/scripts/state.cjs branch --set-step implement --set-task-progress {total}/{total}
```

---

## [DEFERRED] 解消の優先順位

複数の [DEFERRED] がある場合、以下の順で解消:

1. **ブロッキング**: 実装を完全にブロックするもの
2. **依存関係の上流**: 他の [DEFERRED] が依存しているもの
3. **影響範囲が広い**: 多くの Feature/Screen に影響するもの
4. **解消が容易**: すぐに回答が得られるもの

---

## Self-Check

- [ ] Spec, Plan, Tasks を読み込んだか
- [ ] **tasks.md の各タスクを TodoWrite に登録したか**
- [ ] **[DEFERRED] チェックを実施したか（Step 3.2.5）**
- [ ] テストを先に書いたか（fail-first）
- [ ] 全タスクを実装したか
- [ ] **各タスク完了時に TodoWrite で completed にしたか**
- [ ] テストが全て pass したか
- [ ] lint を実行したか
- [ ] Feedback が必要な場合、人間に確認したか
- [ ] **仮定を置いた場合、Assumption Log に記録したか**

---

## Next Steps

**[HUMAN_CHECKPOINT]** 実装結果とテスト結果を確認してから次のステップに進んでください。

| Condition | Workflow | Description |
|-----------|----------|-------------|
| UI 機能の場合（推奨） | test-scenario | Test Scenario 作成 → E2E テスト |
| API のみ / テスト不要の場合 | pr | PR 作成 |
| Spec へのフィードバックがある場合 | feedback | Spec へのフィードバック記録 |
