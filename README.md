# SSD-Template

**Spec-Driven Development Framework for AI-Assisted Projects**

つよつよAIエンジニアニックの最強SDDフレームワーク
AI コーディングアシスタント（Claude Code など）と人間の協業による仕様駆動開発フレームワークです。

---

## Features

- **4層 Spec 構造** - Vision → Screen/Domain → Feature の階層的な仕様管理
- **17+ ワークフロー** - `/spec-mesh *` による一貫したワークフロー
- **Clarify ループ** - 曖昧さを排除する対話的な仕様策定
- **状態管理** - プロジェクトとブランチの状態追跡
- **警告ベースアプローチ** - 強制ブロックせず人間の判断を尊重

---

## Quick Start

```bash
# 1. GitHub CLI 認証
gh auth login

# 2. 状態初期化
node .claude/skills/spec-mesh/scripts/state.cjs init

# 3. 新規プロジェクト開始
/spec-mesh vision あなたのプロジェクト説明
```

---

## Documentation

詳細なドキュメントは [docs/](docs/) を参照してください：

| Page                                                  | Description                       |
| ----------------------------------------------------- | --------------------------------- |
| [Home](docs/Home.md)                                  | ドキュメントホーム                |
| [Getting Started](docs/Getting-Started.md)            | インストールと最初のステップ      |
| [Core Concepts](docs/Core-Concepts.md)                | 3層構造、Clarify ループ、状態管理 |
| [Workflow: New Project](docs/Workflow-New-Project.md) | 新規プロジェクト立ち上げフロー    |
| [Workflow: Add Feature](docs/Workflow-Add-Feature.md) | 機能追加・バグ修正フロー          |
| [Workflows Reference](docs/Workflows-Reference.md)    | 全ワークフローのリファレンス      |
| [Templates Reference](docs/Templates-Reference.md)    | Spec テンプレートの説明           |
| [Scripts Reference](docs/Scripts-Reference.md)        | Node.js スクリプトの使用方法      |
| [Troubleshooting](docs/Troubleshooting.md)            | よくある問題と解決方法            |

---

## Workflow Overview

### Project Initialization

| Workflow            | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `/spec-mesh vision` | Vision Spec 作成（目的 + ジャーニー + Screen Hints） |
| `/spec-mesh design` | **Screen + Domain Spec 同時作成** + Feature Issues   |

### Development Entry Points

| Workflow                     | Purpose                      |
| ---------------------------- | ---------------------------- |
| `/spec-mesh issue`           | 既存 Issue から開発開始      |
| `/spec-mesh add`             | 新機能追加（Issue 自動作成） |
| `/spec-mesh fix`             | バグ修正（Issue 自動作成）   |
| `/spec-mesh featureproposal` | AI に Feature を提案させる   |
| `/spec-mesh change`          | Vision/Domain Spec 変更      |

### Development Flow

| Workflow               | Purpose      |
| ---------------------- | ------------ |
| `/spec-mesh plan`      | 実装計画作成 |
| `/spec-mesh tasks`     | タスク分割   |
| `/spec-mesh implement` | 実装         |
| `/spec-mesh pr`        | PR 作成      |

### Utilities

| Workflow               | Purpose                  |
| ---------------------- | ------------------------ |
| `/spec-mesh clarify`   | 曖昧点の解消             |
| `/spec-mesh lint`      | Spec 整合性チェック      |
| `/spec-mesh analyze`   | 実装と Spec の整合性分析 |
| `/spec-mesh checklist` | 品質チェックリスト生成   |

---

## Typical Workflow

```
New Project:
  /spec-mesh vision → /spec-mesh design → /spec-mesh issue → plan → tasks → implement → pr

Add Feature:
  /spec-mesh add → plan → tasks → implement → pr

Fix Bug:
  /spec-mesh fix → implement → pr
```

---

## Code Quality Tools

このテンプレートには、コード品質を自動で維持するためのツール群が組み込まれています。

### セットアップ

```bash
npm install
```

### npm scripts

| コマンド                | 説明                                         |
| ----------------------- | -------------------------------------------- |
| `npm run lint`          | ESLint によるコードチェック                  |
| `npm run lint:fix`      | ESLint 自動修正                              |
| `npm run typecheck`     | TypeScript 型チェック                        |
| `npm run format`        | Prettier によるフォーマット                  |
| `npm run deps:circular` | 循環依存の検出（madge）                      |
| `npm run deps:check`    | 依存関係ルールチェック（dependency-cruiser） |
| `npm run unused`        | 未使用コード・依存の検出（knip）             |
| `npm run quality`       | 全チェック一括実行                           |

### Claude Hooks による自動チェック

`.claude/settings.local.json` に設定されたフックにより、Claude Code がファイルを編集するたびに自動で Lint が実行されます。

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --silent -- --max-warnings 0"
          }
        ]
      }
    ]
  }
}
```

### 依存関係ルール（dependency-cruiser）

`.dependency-cruiser.cjs` で以下のルールを強制:

- **no-circular**: 循環依存の禁止
- **no-orphans**: 孤立ファイル（未参照）の警告
- **no-deprecated-npm**: 非推奨パッケージの禁止
- **no-dev-deps-in-src**: 本番コードでの devDependencies 使用禁止
- **no-ui-to-data-layer**: UI 層から DB/API 層への直接アクセス禁止

### 未使用コード検出（knip）

`knip.json` で設定。以下を検出:

- 未使用のファイル
- 未使用の依存関係（npm パッケージ）
- 未使用のエクスポート

### CI ワークフロー

`.github/workflows/code-quality.yml` で PR 時に自動チェック:

1. **lint**: ESLint + TypeScript + Prettier
2. **dependencies**: 循環依存 + dependency-cruiser + knip

---

## Prerequisites

- Git
- Node.js 20+ (LTS)
- GitHub CLI (`gh`)
- AI Assistant (Claude Code, Cursor, etc.)

### Recommended MCP Servers (Claude Code)

| MCP        | Purpose                        |
| ---------- | ------------------------------ |
| serena     | プロジェクト探索・ファイル編集 |
| context7   | ライブラリドキュメント検索     |
| playwright | E2E テスト自動化               |

---

## Directory Structure

```
.
├── .claude/
│   ├── skills/
│   │   └── spec-mesh/         # spec-mesh Skill
│   │       ├── SKILL.md       # Skill 定義
│   │       ├── constitution.md # Engineering Constitution
│   │       ├── workflows/     # ワークフロー (17+)
│   │       ├── templates/     # Spec テンプレート
│   │       ├── guides/        # ガイドドキュメント
│   │       └── scripts/       # Node.js スクリプト
│   ├── agents/                # Agent 定義 (3)
│   └── settings.local.json    # Hooks 設定（Lint 自動実行）
├── .github/
│   └── workflows/
│       ├── spec-lint.yml      # Spec 整合性チェック CI
│       └── code-quality.yml   # コード品質チェック CI
├── .specify/
│   ├── memory/                # 状態記憶（リダイレクト）
│   ├── input/                 # Quick Input ファイル（ユーザー入力用）
│   ├── specs/                 # 仕様書（自動生成）
│   └── state/                 # 状態ファイル
├── src/                       # ソースコード
├── docs/                      # ドキュメント
├── .dependency-cruiser.cjs    # 依存関係ルール設定
├── eslint.config.js           # ESLint 設定（Flat Config）
├── knip.json                  # 未使用コード検出設定
├── tsconfig.json              # TypeScript 設定
├── package.json               # npm scripts & 依存関係
└── CLAUDE.md                  # AI エージェント用ガイド
```

---

## Key Files

| File                                      | Purpose                                                |
| ----------------------------------------- | ------------------------------------------------------ |
| `CLAUDE.md`                               | AI エージェントの行動指針                              |
| `.claude/skills/spec-mesh/constitution.md`| Engineering Constitution（最上位ルール）               |
| `.claude/settings.local.json`             | Hooks 設定（SessionStart + Lint 自動実行）             |
| `.specify/input/*.md`                     | Quick Input ファイル（ワークフロー実行前にユーザーが記入） |
| `.dependency-cruiser.cjs`                 | 依存関係ルール（循環依存禁止など）                     |
| `eslint.config.js`                        | ESLint Flat Config（TypeScript 対応）                  |
| `knip.json`                               | 未使用コード・依存検出設定                             |
| `tsconfig.json`                           | TypeScript strict 設定                                 |

---

## License

このテンプレートは組織内での利用を前提としています。
使う時はニックへの感謝と見つけたFBをお願いします。
