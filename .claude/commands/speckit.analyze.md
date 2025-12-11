---
description: Analyze implementation against Spec/Overview. Run before PR for peace of mind.
---

## Purpose

PR作成前の「安心確認」として、実装が Spec/Overview の要件を満たしているか総合的に分析します。

**ユーティリティコマンド** - いつでも単独実行可能。

## What This Checks

### 1. Spec要件の充足確認
- 各 UC (Use Case) が実装されているか
- 各 FR (Functional Requirement) が満たされているか
- 各 SC (Success Criteria) がテストでカバーされているか
- Edge Cases が考慮されているか

### 2. Overview との整合性
- 使用している M-* (マスタ) が Overview に定義されているか
- 使用している API-* が Overview に定義されているか
- Overview の NFR (Non-Functional Requirements) に違反していないか
- 他の Feature との依存関係に問題がないか

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

1) **Load context**:
   - Feature Spec + Overview Spec
   - Plan + Tasks
   - 実装済みコード
   - テストコード

2) **Use Serena** to explore:
   - 実装されたファイル/クラス/関数
   - テストファイル
   - 既存コードとの関係

3) **Cross-reference analysis**:
   - Spec の各 UC/FR/SC と実装を照合
   - Overview のマスタ/API定義と実際の使用を照合
   - Plan の設計方針と実装を照合

4) **Generate report**:
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
     - API-AUTH-LOGOUT を使用していますが Overview に未定義です

   📊 カバレッジ:
     - UC: 3/3 (100%)
     - FR: 7/8 (87.5%)
     - SC: 4/5 (80%)
   ```

5) **Provide recommendations**:
   - 問題がある場合: 修正提案
   - 問題がない場合: PR作成の推奨

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
    Overviewとの整合性確認中...

    === 分析結果 ===

    ✅ 充足している要件:
      - UC-001: ログイン処理 → src/auth/login.ts:45
      - UC-002: ログアウト処理 → src/auth/logout.ts:12
      - FR-001〜FR-005: 全て実装済み
      - SC-001, SC-002: テストあり

    ⚠️ 要確認:
      - FR-006: パスワードリセット → 実装はありますがテストが不足
      - Edge Case: 無効トークン → 異常系テストを追加推奨

    ✅ Overview整合性:
      - M-USER, M-SESSION: 正しく参照
      - API-AUTH-LOGIN, API-AUTH-LOGOUT: 正しく参照

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
