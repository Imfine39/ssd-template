# Spec-Driven Development Template

※ ニックの最強テンプレートにつき乱用注意！
（使いすぎるとニックがそっと眉をひそめるとかひそめないとか…）

仕様駆動開発（Spec-Driven Development）、テスト駆動開発（TDD）、および GitHub ガバナンスを実践するための 組織最強テンプレートリポジトリです。
AI も人間も、このルールの上で平和に開発できます。
## 概要

このテンプレートは、AI コーディングアシスタント（Claude Code など）と人間の開発者が協働して、品質の高いソフトウェアを開発するための基盤を提供します。

### 主な特徴

- **Spec-First**: すべての機能開発は仕様書（spec.md）から始まる
- **Test-First**: テストを先に書いてから実装する TDD サイクル
- **GitHub 統合**: Issue → Spec → Plan → Tasks → 実装 → PR の明確なワークフロー
- **AI ガバナンス**: AI が従うべき憲法（Constitution）による行動規範

## ディレクトリ構成

```
.
├── .claude/
│   └── commands/           # Claude Code スラッシュコマンド
│       ├── speckit.specify.md    # 仕様作成
│       ├── speckit.plan.md       # 計画作成
│       ├── speckit.tasks.md      # タスク作成
│       ├── speckit.implement.md  # 実装実行
│       ├── speckit.clarify.md    # 仕様の曖昧点確認
│       ├── speckit.checklist.md  # チェックリスト生成
│       ├── speckit.analyze.md    # 整合性分析
│       ├── speckit.constitution.md # 憲法更新
│       └── speckit.taskstoissues.md # タスク→Issue変換
├── .specify/
│   ├── memory/
│   │   └── constitution.md       # Engineering Constitution（憲法）
│   ├── templates/                # 各種テンプレート
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   ├── checklist-template.md
│   │   └── agent-file-template.md
│   └── scripts/                  # ユーティリティスクリプト
└── CLAUDE.md                     # AI 向け開発ガイド
```

## 使い方

### 1. テンプレートからリポジトリを作成

GitHub の「Use this template」ボタンを使用するか、リポジトリをクローンして新しいプロジェクトを開始してください。

### 2. 憲法のカスタマイズ

`.specify/memory/constitution.md` を組織のニーズに合わせて調整します。

```bash
# Claude Code で憲法を更新
/speckit.constitution
```

### 3. 開発ワークフロー

1. **Issue 作成**: GitHub Issue で要求を記述
2. **仕様作成**: `/speckit.specify` で spec.md を生成
3. **計画作成**: `/speckit.plan` で plan.md を生成
4. **タスク作成**: `/speckit.tasks` で tasks.md を生成
5. **実装**: `/speckit.implement` でタスクを実行

## Spec Kit コマンド一覧

| コマンド | 説明 |
|---------|------|
| `/speckit.specify` | 仕様書（spec.md）を作成・更新 |
| `/speckit.plan` | 実装計画（plan.md）を作成 |
| `/speckit.tasks` | タスクリスト（tasks.md）を作成 |
| `/speckit.implement` | タスクを順次実行 |
| `/speckit.clarify` | 仕様の曖昧点を特定・解決 |
| `/speckit.checklist` | カスタムチェックリストを生成 |
| `/speckit.analyze` | spec/plan/tasks 間の整合性を分析 |
| `/speckit.constitution` | 憲法を作成・更新 |
| `/speckit.taskstoissues` | タスクを GitHub Issue に変換 |

## AI エージェントの行動原則

Claude Code などの AI エージェントは、以下の原則に従います：

1. **憲法最優先**: `.specify/memory/constitution.md` の原則を遵守
2. **推測禁止**: 仕様が曖昧な場合は Issue を起票してエスカレーション
3. **小さな差分**: Spec ID / Issue 単位で小さな PR を作成
4. **テスト優先**: テストが RED になることを確認してから実装

詳細は `CLAUDE.md` を参照してください。

## ブランチ戦略

- `main` への直接 push は禁止
- 作業ブランチの命名規則：
  - `spec/<issue>-<desc>` - 仕様変更
  - `feature/<issue>-<desc>` - 新機能
  - `fix/<issue>-<desc>` - バグ修正
  - `hotfix/<issue>-<desc>` - 緊急修正

## 必要要件

- [Claude Code](https://claude.com/claude-code) または互換 AI コーディングアシスタント
- Git
- GitHub アカウント

## 推奨 MCP サーバー

| MCP | 用途 | 必須度 |
|-----|------|--------|
| serene | プロジェクト探索・ファイル編集 | 必須 |
| context7 | ライブラリドキュメント検索 | 必須 |
| playwright | E2E テスト自動化 | 推奨 |

## ライセンス

このテンプレートは組織内での使用を想定しています。
