---
description: Analyze implementation against Spec/Domain. Run before PR for peace of mind.
---

## Purpose

PR作成前の「安心確認」として、実装が Spec/Domain の要件を満たしているか総合的に分析します。

**ユーティリティコマンド** - いつでも単独実行可能。

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Load context"
   - "Step 2: Explore codebase"
   - "Step 3: Cross-reference analysis"
   - "Step 4: Generate report"
   - "Step 5: Provide recommendations"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

## What This Checks

### 1. Spec要件の充足確認

- 各 UC (Use Case) が実装されているか
- 各 FR (Functional Requirement) が満たされているか
- 各 SC (Success Criteria) がテストでカバーされているか
- Edge Cases が考慮されているか

### 2. Domain との整合性

- 使用している M-\* (マスタ) が Domain に定義されているか
- 使用している API-\* が Domain に定義されているか
- Domain の NFR (Non-Functional Requirements) に違反していないか
- 他の Feature との依存関係に問題がないか

### 2.5. Screen との整合性

- Feature Spec で参照している SCR-\* が Screen Spec に定義されているか
- 実装した画面コンポーネントが Screen Spec のワイヤーフレームに準拠しているか
- Screen Spec の Status が適切か（Planned → 実装済みなら Implemented に更新必要）
- 画面遷移が Screen Spec の遷移図に従っているか

### 2.6. Cross-Reference Matrix との整合性

Matrix が存在する場合（`.specify/matrix/cross-reference.json`）:

- Feature が Matrix に登録されているか
- Matrix 内の screens/masters/apis 参照が正しいか
- 新規追加した M-\*/API-\*/SCR-\* が Matrix に反映されているか
- Permissions が正しく設定されているか（ロールベースアクセス）

### 3. コードベース分析

- 新規追加コードが既存パターンに従っているか
- 命名規則の一貫性
- セキュリティ上の懸念点
- パフォーマンス上の懸念点

### 4. テストカバレッジ

- UC ごとにテストが存在するか
- 正常系・異常系の両方がカバーされているか
- Spec由来のテストと実装の対応

## Steps

1. **Load context**:
   - Feature Spec + Domain Spec + Screen Spec
   - Cross-Reference Matrix（存在する場合）
   - Plan + Tasks
   - 実装済みコード
   - テストコード

#### Self-Check (Step 1)

- [ ] Feature Spec を Read ツールで読み込んだか
- [ ] Domain Spec を Read ツールで読み込んだか
- [ ] Screen Spec を Read ツールで読み込んだか（存在する場合）
- [ ] Matrix を Read ツールで読み込んだか（存在する場合）

2. **Use Serena** to explore:
   - 実装されたファイル/クラス/関数
   - テストファイル
   - 既存コードとの関係

#### Self-Check (Step 2)

- [ ] 実装されたファイルを特定したか
- [ ] テストファイルを特定したか

3. **Cross-reference analysis**:
   - Spec の各 UC/FR/SC と実装を照合
   - Domain のマスタ/API定義と実際の使用を照合
   - Screen Spec の SCR-\* 参照と画面実装を照合
   - Matrix の対応関係と実装を照合
   - Plan の設計方針と実装を照合

#### Self-Check (Step 3)

- [ ] UC/FR/SC と実装の照合を行ったか
- [ ] Domain との整合性を確認したか
- [ ] Screen との整合性を確認したか
- [ ] Matrix との整合性を確認したか

4. **Generate report**:

   ```
   === 分析結果 ===

   ✅ 充足している要件:
     - UC-001: ログイン処理 → src/auth/login.ts
     - FR-001: JWT生成 → src/auth/token.ts
     - SC-001: ログイン成功テスト → tests/auth/login.test.ts

   ⚠️ 要確認:
     - FR-003: Rate limiting → 実装が見つかりません
     - Edge Case: 同時ログイン制限 → テストが不足

   ❌ 問題:
     - API-AUTH-LOGOUT を使用していますが Domain に未定義です

   📊 カバレッジ:
     - UC: 3/3 (100%)
     - FR: 7/8 (87.5%)
     - SC: 4/5 (80%)
   ```

#### Self-Check (Step 4)

- [ ] 充足している要件を一覧表示したか
- [ ] 要確認項目を一覧表示したか
- [ ] 問題点を一覧表示したか
- [ ] カバレッジサマリーを表示したか

5. **Provide recommendations**:
   - 問題がある場合: 修正提案
   - 問題がない場合: PR作成の推奨

#### Self-Check (Step 5)

- [ ] 推奨アクションを提示したか
- [ ] 次のステップ（/speckit.pr 等）を提示したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

## Output

- 要件充足レポート
- 整合性チェック結果
- カバレッジサマリー
- 推奨アクション

## When to Use

- `/speckit.pr` の前に不安がある時
- 大きな Feature を実装した後
- 複数人で並行開発している時
- レビュー前の自己チェック

## Example

```
人間: /speckit.analyze

AI: Feature S-AUTH-001 の分析を開始します...

    コードベースを探索中...
    Specとの照合中...
    Domainとの整合性確認中...

    === 分析結果 ===

    ✅ 充足している要件:
      - UC-001: ログイン処理 → src/auth/login.ts:45
      - UC-002: ログアウト処理 → src/auth/logout.ts:12
      - FR-001〜FR-005: 全て実装済み
      - SC-001, SC-002: テストあり

    ⚠️ 要確認:
      - FR-006: パスワードリセット → 実装はありますがテストが不足
      - Edge Case: 無効トークン → 異常系テストを追加推奨

    ✅ Domain整合性:
      - M-USER, M-SESSION: 正しく参照
      - API-AUTH-LOGIN, API-AUTH-LOGOUT: 正しく参照

    ✅ Screen整合性:
      - SCR-001 (ログイン画面): 実装済み → src/pages/Login.tsx
      - SCR-002 (ダッシュボード): 実装済み → src/pages/Dashboard.tsx
      - ⚠️ Screen Spec Status 更新推奨: SCR-001, SCR-002 を Implemented に

    ✅ Matrix整合性:
      - Feature S-AUTH-001: Matrix に登録済み
      - screens/masters/apis 参照: 正しい

    📊 カバレッジ:
      - UC: 2/2 (100%)
      - FR: 6/6 (100%)
      - SC: 2/3 (66.7%)

    💡 推奨:
      - FR-006 のテストを追加してから PR 作成を推奨
      - または、テスト追加を別 Issue として PR 可能

人間: テスト追加は別Issueにして、今回はPRしよう

AI: 了解しました。/speckit.pr を実行します...
```
