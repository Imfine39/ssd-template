# SSD-Template

**Spec-Driven Development Framework for AI-Assisted Projects**


ニックの最強SDDフレームワーク
AI コーディングアシスタント（Claude Code など）と人間の協業による仕様駆動開発フレームワークです。

---

## Features

- **3層 Spec 構造** - Vision → Domain → Feature の階層的な仕様管理
- **17+ コマンド** - `/speckit.*` による一貫したワークフロー
- **Clarify ループ** - 曖昧さを排除する対話的な仕様策定
- **状態管理** - プロジェクトとブランチの状態追跡
- **警告ベースアプローチ** - 強制ブロックせず人間の判断を尊重

---

## Quick Start

```bash
# 1. GitHub CLI 認証
gh auth login

# 2. 状態初期化
node .specify/scripts/state.js init

# 3. 新規プロジェクト開始
/speckit.vision あなたのプロジェクト説明
```

---

## Documentation

詳細なドキュメントは [docs/](docs/) を参照してください：

| Page | Description |
|------|-------------|
| [Home](docs/Home.md) | ドキュメントホーム |
| [Getting Started](docs/Getting-Started.md) | インストールと最初のステップ |
| [Core Concepts](docs/Core-Concepts.md) | 3層構造、Clarify ループ、状態管理 |
| [Workflow: New Project](docs/Workflow-New-Project.md) | 新規プロジェクト立ち上げフロー |
| [Workflow: Add Feature](docs/Workflow-Add-Feature.md) | 機能追加・バグ修正フロー |
| [Commands Reference](docs/Commands-Reference.md) | 全コマンドのリファレンス |
| [Templates Reference](docs/Templates-Reference.md) | Spec テンプレートの説明 |
| [Scripts Reference](docs/Scripts-Reference.md) | Node.js スクリプトの使用方法 |
| [Troubleshooting](docs/Troubleshooting.md) | よくある問題と解決方法 |

---

## Command Overview

### Project Initialization
| Command | Purpose |
|---------|---------|
| `/speckit.vision` | Vision Spec 作成（目的 + ジャーニー） |
| `/speckit.design` | Feature 提案 + Domain Spec 作成 |
| `/speckit.screen` | Screen Spec 作成（画面一覧 + 遷移図 + ワイヤーフレーム） |

### Development Entry Points
| Command | Purpose |
|---------|---------|
| `/speckit.issue` | 既存 Issue から開発開始 |
| `/speckit.add` | 新機能追加（Issue 自動作成） |
| `/speckit.fix` | バグ修正（Issue 自動作成） |
| `/speckit.featureproposal` | AI に Feature を提案させる |
| `/speckit.change` | Vision/Domain Spec 変更 |

### Development Flow
| Command | Purpose |
|---------|---------|
| `/speckit.plan` | 実装計画作成 |
| `/speckit.tasks` | タスク分割 |
| `/speckit.implement` | 実装 |
| `/speckit.pr` | PR 作成 |

### Utilities
| Command | Purpose |
|---------|---------|
| `/speckit.clarify` | 曖昧点の解消 |
| `/speckit.lint` | Spec 整合性チェック |
| `/speckit.analyze` | 実装と Spec の整合性分析 |
| `/speckit.checklist` | 品質チェックリスト生成 |

---

## Typical Workflow

```
New Project:
  /speckit.vision → /speckit.design → /speckit.screen → /speckit.issue → plan → tasks → implement → pr

Add Feature:
  /speckit.add → plan → tasks → implement → pr

Fix Bug:
  /speckit.fix → implement → pr
```

---

## Prerequisites

- Git
- Node.js (LTS)
- GitHub CLI (`gh`)
- AI Assistant (Claude Code, Cursor, etc.)

### Recommended MCP Servers (Claude Code)

| MCP | Purpose |
|-----|---------|
| serena | プロジェクト探索・ファイル編集 |
| context7 | ライブラリドキュメント検索 |
| playwright | E2E テスト自動化 |

---

## Directory Structure

```
.
├── .claude/
│   ├── commands/           # speckit.* コマンド (17+)
│   └── settings.local.json # Hooks 設定
├── .specify/
│   ├── memory/constitution.md   # Engineering Constitution
│   ├── input/              # Quick Input ファイル（ユーザー入力用）
│   ├── templates/          # Spec + Quick Input テンプレート (9)
│   ├── scripts/            # Node.js スクリプト (7)
│   ├── specs/              # 仕様書（自動生成）
│   └── state/              # 状態ファイル
├── docs/                   # ドキュメント
└── CLAUDE.md               # AI エージェント用ガイド
```

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI エージェントの行動指針 |
| `.specify/memory/constitution.md` | Engineering Constitution（最上位ルール） |
| `.claude/settings.local.json` | Hooks 設定（SessionStart で状態自動読込） |
| `.specify/input/*.md` | Quick Input ファイル（コマンド実行前にユーザーが記入） |

---

## License

このテンプレートは組織内での利用を前提としています。
使う時はニックへの感謝と見つけたFBをお願いします。
