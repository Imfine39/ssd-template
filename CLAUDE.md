# CLAUDE Development Guide

このリポジトリで開発を行う AI コーディングアシスタントの行動指針です。

---

## 1. 優先順位

1. **Engineering Constitution** (`.claude/skills/spec-mesh/constitution.md`) が最優先ルール
2. その次に Vision / Domain / Screen / Feature の各 Spec
3. 仕様に矛盾・不足があれば推測せず `/spec-mesh clarify` でエスカレーション

---

## 2. 環境とツール

### 必須ツール

| ツール | 用途 |
|--------|------|
| Git | バージョン管理 |
| GitHub CLI (`gh`) | GitHub 操作 |
| Node.js | ランタイム |
| npm/pnpm | パッケージ管理 |

### コード品質ツール

```bash
npm run lint          # ESLint
npm run format        # Prettier
npm run typecheck     # TypeScript
npm run quality       # 全チェック一括
```

**初回セットアップ:** `npm install`

---

## 3. Spec-Mesh Skills

すべての仕様駆動開発（SSD）ワークフローは `/spec-mesh` Skill で実行します。

### 呼び出し方

**重要:** 最初から args 付きで呼び出してください。

```
/spec-mesh vision      # Vision Spec 作成
/spec-mesh design      # Screen + Domain + Matrix 作成
/spec-mesh add         # 新機能追加
/spec-mesh fix         # バグ修正
/spec-mesh clarify     # 曖昧点解消
/spec-mesh plan        # 実装計画作成
/spec-mesh implement   # 実装実行
/spec-mesh pr          # PR 作成
```

### 品質管理フロー

```
Spec 作成 → Multi-Review (3観点並列) → Lint → [HUMAN_CHECKPOINT]
                  ↓
            問題あり → Clarify (ユーザー対話)
```

### コマンド一覧

**プロジェクト初期化**
| コマンド | 用途 |
|----------|------|
| `/spec-mesh vision` | Vision Spec 作成 |
| `/spec-mesh design` | Screen + Domain + Matrix 作成 |

**開発エントリーポイント**
| コマンド | 用途 |
|----------|------|
| `/spec-mesh issue` | 既存 Issue から開発開始 |
| `/spec-mesh add` | 新機能追加 |
| `/spec-mesh fix` | バグ修正 |
| `/spec-mesh change` | Spec 変更（Vision/Domain/Screen） |
| `/spec-mesh featureproposal` | Feature 提案 |

**開発フロー**
| コマンド | 用途 |
|----------|------|
| `/spec-mesh plan` | 実装計画作成 |
| `/spec-mesh tasks` | タスク分割 |
| `/spec-mesh implement` | 実装実行 |
| `/spec-mesh pr` | PR 作成 |

**品質管理**
| コマンド | 用途 |
|----------|------|
| `/spec-mesh review` | Multi-Review（3観点並列） |
| `/spec-mesh clarify` | 曖昧点解消（4問バッチ） |
| `/spec-mesh lint` | 整合性チェック |
| `/spec-mesh analyze` | 実装 vs Spec 分析 |
| `/spec-mesh checklist` | 品質スコア測定 |
| `/spec-mesh feedback` | フィードバック記録 |

### 典型的なワークフロー

**新規プロジェクト:**
```
/spec-mesh vision → (Multi-Review自動) → clarify → design → (Multi-Review自動) → clarify
→ /spec-mesh issue (Foundation) → plan → tasks → implement → pr
```

**機能追加:**
```
/spec-mesh add → (Multi-Review自動) → clarify → plan → tasks → implement → pr
```

**バグ修正:**
```
/spec-mesh fix → (Multi-Review自動) → plan → tasks → implement → pr
```

---

## 4. Git ワークフロー

### ブランチ命名

| タイプ | パターン |
|--------|----------|
| Spec変更 | `spec/<issue>-<slug>` |
| 機能追加 | `feature/<issue>-<slug>` |
| バグ修正 | `fix/<issue>-<slug>` |
| 緊急対応 | `hotfix/<issue>-<slug>` |

### ルール

- `main` への直接 push 禁止
- 常に Issue 連動ブランチで作業
- PR 作成は `/spec-mesh pr` を使用

---

## 5. 状態管理

```bash
node .claude/skills/spec-mesh/scripts/state.cjs query --all    # 全状態確認
node .claude/skills/spec-mesh/scripts/state.cjs init           # 初期化
```

セッション開始時に自動で状態がコンテキストに読み込まれます。

---

## 6. 参考資料

### Constitution
- [constitution.md](.claude/skills/spec-mesh/constitution.md) - Engineering Constitution

### Skill ガイド
- [id-naming.md](.claude/skills/spec-mesh/guides/id-naming.md) - ID命名規則
- [parallel-development.md](.claude/skills/spec-mesh/guides/parallel-development.md) - 並行開発ガイド
- [error-recovery.md](.claude/skills/spec-mesh/guides/error-recovery.md) - エラー回復ガイド

### テンプレート
- `.claude/skills/spec-mesh/templates/` - 各種Specテンプレート

---

## 7. 重要な原則

1. **Spec-First**: 画面変更は Screen Spec 更新後に Feature Spec
2. **Multi-Review 必須**: Spec 作成後は必ず 3観点レビューを実行
3. **推測禁止**: 不明点は `/spec-mesh clarify` で解消
4. **小さな変更**: レビューしやすい差分を心がける
5. **テスト必須**: 仕様に沿った挙動を保証

詳細は [Engineering Constitution](.claude/skills/spec-mesh/constitution.md) を参照してください。
