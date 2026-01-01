# E2E Workflow

Chrome 拡張を使用して E2E テストを実行する。

## Flow Position

```
implement → test-scenario → [e2e] → pr
```

**タイミング:** test-scenario 完了後、PR 作成前
**対象:** UI を含む Feature（Test Scenario Spec 必須）

---

## Purpose

- Test Scenario Spec に基づいて実際のブラウザ操作でテスト
- スクリーンショットと GIF で証跡を記録
- テスト結果を Test Scenario Spec に反映

---

## Prerequisites

- Test Scenario Spec が存在すること
- アプリケーションが起動していること（ローカル or ステージング）
- Chrome ブラウザが利用可能であること

---

## Todo Template

**IMPORTANT:** ワークフロー開始時に、以下の Todo を TodoWrite tool で作成すること。

```
TodoWrite:
  todos:
    - content: "Step 1: Test Scenario Spec 読み込み"
      status: "pending"
      activeForm: "Loading Test Scenario Spec"
    - content: "Step 2: ブラウザセッションセットアップ"
      status: "pending"
      activeForm: "Setting up browser session"
    - content: "Step 3: Test Cases 実行"
      status: "pending"
      activeForm: "Executing Test Cases"
    - content: "Step 4: Journey Test 実行"
      status: "pending"
      activeForm: "Executing Journey Tests"
    - content: "Step 5: クリーンアップ"
      status: "pending"
      activeForm: "Cleaning up"
    - content: "Step 6: Test Scenario Spec 更新"
      status: "pending"
      activeForm: "Updating Test Scenario Spec"
    - content: "Step 7: サマリー提示"
      status: "pending"
      activeForm: "Presenting summary"
```

---

## Steps

### Step 1: Load Test Scenario Spec

1. **Test Scenario Spec を読み込み:**
   ```
   Read tool: .specify/specs/features/{feature}/test-scenarios.md
   ```

2. **抽出する情報:**
   - Test Environment URL
   - Test Data (静的データ)
   - Test Cases (TC-*, TC-N*, TC-J*)
   - 各テストケースの Steps と Expected Results

3. **Screen Spec を読み込み（要素特定用）:**
   ```
   Read tool: .specify/specs/overview/screen/spec.md
   ```

### Step 2: Setup Browser Session

1. **ブラウザ接続:**
   ```
   mcp__claude-in-chrome__tabs_context_mcp
   ```

2. **新規タブ作成:**
   ```
   mcp__claude-in-chrome__tabs_create_mcp
   ```

3. **アプリに遷移:**
   ```
   mcp__claude-in-chrome__navigate
   - url: {test_environment_url}
   - tabId: {created_tab_id}
   ```

4. **GIF 記録開始:**
   ```
   mcp__claude-in-chrome__gif_creator
   - action: start_recording
   - tabId: {tab_id}
   ```

5. **初期状態のスクリーンショット:**
   ```
   mcp__claude-in-chrome__computer
   - action: screenshot
   - tabId: {tab_id}
   ```

### Step 3: Execute Test Cases

各テストケースに対して以下を実行：

#### 3.1 Preconditions Setup

テストケースの Preconditions を満たす状態にする：
- 必要な画面に遷移
- ログイン状態の確認/設定
- 必要なデータの存在確認

#### 3.2 Execute Steps

**Step 実行パターン:**

| Action | Tool | Example |
|--------|------|---------|
| 遷移 | navigate | `/login` に遷移 |
| 要素検索 | find | 「ログインボタン」を検索 |
| テキスト入力 | form_input | メールアドレス欄に入力 |
| クリック | computer (left_click) | ボタンをクリック |
| 状態確認 | read_page | 画面要素を確認 |
| テキスト取得 | get_page_text | ページ内容を取得 |
| スクリーンショット | computer (screenshot) | 証跡を記録 |

**実行例:**
```
Step: メールアドレス欄に `{valid_email}` を入力

1. find: "メールアドレス入力欄"
   → ref_id を取得

2. form_input:
   - ref: {ref_id}
   - value: test@example.com
   - tabId: {tab_id}

3. computer (screenshot):
   → 入力後の状態を記録
```

#### 3.3 Verify Expected Results

Expected Results を検証：

```
Expected: ダッシュボードに遷移する

1. read_page:
   - tabId: {tab_id}
   → 現在の画面要素を取得

2. 検証:
   - URL が /dashboard を含むか
   - 期待する要素が存在するか
   - エラーメッセージがないか

3. 結果判定:
   - すべて満たす → Pass
   - 一部不一致 → Fail（詳細を記録）
```

#### 3.4 Record Result

```markdown
| TC ID | Result | Evidence |
|-------|--------|----------|
| TC-001 | ✅ Pass | screenshot_tc001.png |
| TC-002 | ❌ Fail | screenshot_tc002_fail.png |
```

**Fail の場合:**
- 期待値と実際の差分を記録
- スクリーンショットを保存
- 必要に応じてコンソールログを確認:
  ```
  mcp__claude-in-chrome__read_console_messages
  - tabId: {tab_id}
  - onlyErrors: true
  ```

### Step 4: Journey Test Execution

Journey Test (TC-J*) は連続したフローとして実行：

1. **フロー全体を GIF 記録**
2. **各ステップで状態確認**
3. **最終状態のスクリーンショット**

```
TC-J01: リード案件登録から受注移行

Recording: journey_tc_j01.gif

Step 1: ダッシュボード → リード一覧
  Screenshot: step1.png
  Status: OK

Step 2: 新規作成ボタンクリック
  Screenshot: step2.png
  Status: OK

...

Final: 受注案件詳細画面
  Screenshot: final.png
  Status: OK

Result: ✅ Pass
```

### Step 5: Cleanup

1. **GIF 記録停止:**
   ```
   mcp__claude-in-chrome__gif_creator
   - action: stop_recording
   - tabId: {tab_id}
   ```

2. **GIF エクスポート:**
   ```
   mcp__claude-in-chrome__gif_creator
   - action: export
   - tabId: {tab_id}
   - filename: e2e_test_{feature}_{date}.gif
   - download: true
   ```

### Step 6: Update Test Scenario Spec

Test Scenario Spec の Execution Log と Results を更新：

```markdown
## 6. Test Execution Log

| Date | Executor | Environment | TC IDs | Pass | Fail | Skip |
|------|----------|-------------|--------|------|------|------|
| 2025-12-23 | AI | localhost:3000 | TC-001~TC-J01 | 8 | 2 | 1 |

## 7. Detailed Results

### Latest Execution: 2025-12-23

| TC ID | Result | Duration | Evidence |
|-------|--------|----------|----------|
| TC-001 | ✅ Pass | 5s | [screenshot] |
| TC-002 | ❌ Fail | 3s | [screenshot] |
```

### Step 7: Summary

```
=== E2E テスト完了 ===

Feature: {Feature Name}
Environment: {URL}
Date: {execution_date}

Results:
- Total: {total} cases
- ✅ Pass: {pass_count}
- ❌ Fail: {fail_count}
- ⏭️ Skip: {skip_count}

Coverage:
- AC: {covered}/{total} ({percentage}%)

Evidence:
- Screenshots: {count} files
- Journey GIF: {filename}

=== Failed Tests ===
{If any failures}
- TC-002: {failure reason}
  Expected: {expected}
  Actual: {actual}

=== Recommendations ===
{Based on results}
- 失敗したテストの原因調査
- または Spec の更新が必要
```

---

## Self-Check

- [ ] **TodoWrite で全ステップを登録したか**
- [ ] Test Scenario Spec を読み込んだか
- [ ] ブラウザセッションをセットアップしたか
- [ ] GIF 記録を開始したか
- [ ] 各テストケースを実行したか
- [ ] 結果を記録したか
- [ ] GIF をエクスポートしたか
- [ ] Test Scenario Spec を更新したか
- [ ] **TodoWrite で全ステップを completed にしたか**

---

## Troubleshooting

### ブラウザ接続エラー

```
tabs_context_mcp でエラーが発生した場合:
1. Chrome が起動しているか確認
2. Claude in Chrome 拡張がインストールされているか確認
3. 拡張が有効になっているか確認
```

### 要素が見つからない

```
find でマッチしない場合:
1. read_page で現在の要素一覧を確認
2. 別の検索クエリを試す
3. ページ読み込み完了を待つ (computer wait)
```

### テスト失敗時

```
1. スクリーンショットで状態確認
2. read_console_messages でエラーログ確認
3. read_network_requests で API エラー確認
4. 必要に応じて手動で再現確認
```

---

## Next Steps

**[HUMAN_CHECKPOINT]** E2E テスト結果を確認してから次のステップに進んでください。

| Condition | Workflow | Description |
|-----------|----------|-------------|
| 全テストパスの場合 | pr | PR 作成 |
| 一部失敗の場合 | e2e | 実装修正後に再テスト |
| Spec に問題がある場合 | change | Spec 更新 |

---

## Tool Reference

| Tool | Purpose |
|------|---------|
| tabs_context_mcp | ブラウザ接続確認 |
| tabs_create_mcp | 新規タブ作成 |
| navigate | URL 遷移 |
| find | 要素検索（自然言語） |
| read_page | 要素一覧取得 |
| form_input | フォーム入力 |
| computer | クリック、スクリーンショット等 |
| get_page_text | テキスト取得 |
| gif_creator | GIF 記録 |
| read_console_messages | コンソールログ |
| read_network_requests | ネットワーク確認 |
