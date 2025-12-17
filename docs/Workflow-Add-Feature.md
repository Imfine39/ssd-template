# Workflow: Add Feature / Fix Bug

既存プロジェクトへの機能追加・バグ修正のワークフローです。

---

## Entry Points

| Scenario | Command | Description |
|----------|---------|-------------|
| 機能追加（自分で決定） | `/speckit.add` | Issue + Feature Spec を作成 |
| 機能追加（AI に提案させる） | `/speckit.featureproposal` | AI が Feature を提案 |
| 既存 Issue から開始 | `/speckit.issue` | Issue を選択して開始 |
| バグ修正 | `/speckit.fix` | Issue + 既存 Spec 更新 |
| Domain 変更 | `/speckit.change` | Vision/Domain Spec を変更 |

---

## 1. Add Feature (`/speckit.add`)

### 用途
自分で決めた機能を追加したい場合。

### コマンド
```
/speckit.add ユーザー認証機能を追加したい
```

### AI の動作

1. **Issue 作成**
   ```bash
   gh issue create --title "[Feature] S-AUTH-001: ユーザー認証" --label feature --label backlog
   ```

2. **Branch 作成**
   ```bash
   node .specify/scripts/branch.cjs --type feature --slug auth --issue <num>
   ```

3. **[Spec-First] Screen Spec 更新**（画面変更がある場合）
   - 新規画面: Screen Index に追加（Status: Planned）
   - 既存画面変更: Modification Log に追加
   - **Feature Spec 作成前に実施**

4. **Feature Spec 作成**
   - Domain 参照の確認
   - Screen 参照（SCR-*）の追加
   - Case 1/2/3 判定（[[Core-Concepts]] 参照）

5. **曖昧点レポート表示**
   → `/speckit.clarify` で 4 問ずつバッチ解消（別コマンド）

6. **Domain Feature Index 更新**

### Human Checkpoint
- [ ] Feature Spec をレビュー・承認

### 次のステップ
```
/speckit.plan → /speckit.tasks → /speckit.implement → /speckit.pr
```

---

## 2. Feature Proposal (`/speckit.featureproposal`)

### 用途
AI に Feature 候補を提案させたい場合。

### コマンド
```
/speckit.featureproposal レポート機能を追加したい
```

### AI の動作

1. **Domain Spec 読み込み**
   - 既存の M-*, API-* を確認

2. **Feature 候補生成**
   ```
   === Feature 提案 ===

   1. S-REPORTS-001: レポート出力
      - 在庫レポート、入出荷レポートの生成
      - 依存: M-INVENTORY, M-SHIPMENTS

   2. S-EXPORT-001: データエクスポート
      - CSV/Excel 形式でのデータ出力
      - 依存: M-PRODUCTS

   どの Feature を採用しますか？
   ```

3. **選択された Feature の Issue 作成**

### 次のステップ
```
/speckit.issue で作成された Issue を選択
```

---

## 3. Start from Issue (`/speckit.issue`)

### 用途
既存の Issue（他で作成されたもの）から開発を開始。

### コマンド
```
/speckit.issue
```

### AI の動作

1. **Issue 一覧表示**
   ```
   === 開いている Feature Issues ===

   #12 [backlog] S-REPORTS-001: レポート出力
   #13 [backlog] S-EXPORT-001: データエクスポート

   どの Issue から始めますか？
   ```

2. **Branch 作成**（まだない場合）

3. **Feature Spec 作成**
   - Domain 参照チェック
   → `/speckit.clarify` で曖昧点を解消（別コマンド）

4. **Feature Index 更新**

### 次のステップ
```
/speckit.plan → /speckit.tasks → /speckit.implement → /speckit.pr
```

---

## 4. Fix Bug (`/speckit.fix`)

### 用途
バグを修正する場合。

### コマンド
```
/speckit.fix ログイン時にエラーが発生する
```

### AI の動作

1. **Issue 作成**
   ```bash
   gh issue create --title "[Bug] ログインエラー" --label bug
   ```

2. **Branch 作成**
   ```bash
   node .specify/scripts/branch.cjs --type fix --slug login-error --issue <num>
   ```

3. **既存 Spec 特定**
   - 関連する Feature Spec を探す
   - Changelog セクションに記録

4. **曖昧点レポート表示**
   → `/speckit.clarify` で解消（別コマンド）
   - 再現手順
   - 期待される動作
   - 修正方針

### 次のステップ
```
/speckit.plan (オプション) → /speckit.implement → /speckit.pr
```

---

## 5. Domain Change (`/speckit.change`)

### 用途
Vision または Domain Spec の変更が必要な場合。

### トリガー
- 既存 M-* の構造変更が必要
- 既存 API-* のインターフェース変更が必要
- ビジネスルールの変更が必要

### コマンド
```
/speckit.change M-PRODUCT に新しいフィールドを追加したい
```

### AI の動作

1. **現在のブランチを suspend**（Feature 作業中の場合）
   ```bash
   node .specify/scripts/state.cjs suspend --reason "Domain change required" --related <issue>
   ```

2. **Spec 変更 Issue 作成**
   ```bash
   gh issue create --title "[Spec Change] M-PRODUCT フィールド追加" --label spec-change
   ```

3. **Spec 変更 Branch 作成**
   ```bash
   node .specify/scripts/branch.cjs --type spec-change --slug product-field --issue <num>
   ```

4. **Domain Spec 更新**
   - 影響分析（依存する Feature を特定）
   → `/speckit.clarify` で曖昧点を解消（別コマンド）
   - Changelog 更新

5. **PR 作成 & マージ**

6. **元のブランチを resume**
   ```bash
   node .specify/scripts/state.cjs resume
   ```

---

## Development Flow (Common)

Feature Spec 承認後の共通フロー：

```
/speckit.plan
    ↓
Human: Plan レビュー・承認
    ↓
/speckit.tasks
    ↓
/speckit.implement
    ↓
/speckit.pr
    ↓
Human: PR レビュー・マージ
```

### `/speckit.plan`
- 技術選定
- ディレクトリ構造
- 実装方針
- Constitution チェック

### `/speckit.tasks`
- UC ベースでタスク分割
- 各タスクに見積もり
- 依存関係の整理

### `/speckit.implement`
- タスクを順番に実装
- テスト作成
- フィードバック記録（`/speckit.feedback`）

### `/speckit.pr`
- `spec-lint` 自動実行
- Issue 自動リンク
- PR テンプレート適用

### Post-Merge: Screen Spec 更新 [Spec-First]
PR マージ後に Screen Spec の Status を更新：
```bash
# main ブランチに切り替え後
# Screen Index / Modification Log の Status を Implemented に更新
git add .specify/specs/screen/spec.md
git commit -m "chore: Update Screen Spec Status to Implemented"
git push
```

---

## M-*/API-* Handling

Feature Spec 作成時の分岐：

| Case | Situation | Action |
|------|-----------|--------|
| **Case 1** | 既存の M-*/API-* で足りる | 参照を追加して続行 |
| **Case 2** | 新規 M-*/API-* が必要 | Domain Spec に追加して続行 |
| **Case 3** | 既存 M-*/API-* の変更が必要 | `/speckit.change` で先に変更 |

### Case 3 の例

```
Feature 作成中...
AI: M-PRODUCT に新しいフィールドが必要です。
    既存の M-PRODUCT を変更する必要があります（Case 3）。
    `/speckit.change` で Domain 変更を先に完了させますか？