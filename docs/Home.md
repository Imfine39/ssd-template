# SSD-Template Documentation

**Spec-Driven Development Framework for AI-Assisted Projects**

SSD-Template は、AI コーディングアシスタント（Claude Code など）と人間の協業による仕様駆動開発を支援するフレームワークです。

---

## Quick Links

| 目的                 | ページ                   |
| -------------------- | ------------------------ |
| 初めての方           | [[Getting-Started]]      |
| 新規プロジェクト開始 | [[Workflow-New-Project]] |
| 機能追加・バグ修正   | [[Workflow-Add-Feature]] |
| ワークフロー一覧     | [[Workflows-Reference]]   |

---

## What is SSD-Template?

SSD-Template は以下を提供します：

1. **3層 Spec 構造** - Vision → Domain → Feature の階層的な仕様管理
2. **17+ のワークフロー** - `/spec-mesh *` による一貫したワークフロー
3. **状態管理** - プロジェクトとブランチの状態追跡
4. **Clarify ループ** - 曖昧さを排除する対話的な仕様策定

---

## Documentation Structure

### Getting Started

- [[Getting-Started]] - インストールと最初のステップ

### Core Concepts

- [[Core-Concepts]] - 3層構造、Clarify ループ、状態管理の解説

### Workflows

- [[Workflow-New-Project]] - 新規プロジェクト立ち上げフロー
- [[Workflow-Add-Feature]] - 機能追加・バグ修正フロー

### Reference

- [[Workflows-Reference]] - 全ワークフローの詳細リファレンス
- [[Templates-Reference]] - Spec テンプレートの説明
- [[Scripts-Reference]] - Node.js スクリプトの使用方法

### Troubleshooting

- [[Troubleshooting]] - よくある問題と解決方法

---

## Key Principles

SSD-Template は [Engineering Constitution](.claude/skills/spec-mesh/constitution.md) に基づいています：

1. **Spec-First** - すべての非トリビアルな変更は仕様から始まる
2. **Traceability** - Issue → Spec → Plan → Tasks → Code → PR の追跡可能性
3. **Human-in-the-Loop** - 重要な決定点で人間が確認・承認
4. **Warning-Based** - 強制ブロックせず、人間の判断を尊重

---

## Workflow Categories

### Project Initialization (2)

| Workflow            | Purpose                               |
| ------------------- | ------------------------------------- |
| `/spec-mesh vision` | Vision Spec 作成（目的 + ジャーニー） |
| `/spec-mesh design` | Feature 提案 + Domain Spec 作成       |

### Development Entry Points (5)

| Workflow                     | Purpose                      |
| ---------------------------- | ---------------------------- |
| `/spec-mesh issue`           | 既存 Issue から開発開始      |
| `/spec-mesh add`             | 新機能追加（Issue 自動作成） |
| `/spec-mesh fix`             | バグ修正（Issue 自動作成）   |
| `/spec-mesh featureproposal` | AI に Feature を提案させる   |
| `/spec-mesh change`          | Vision/Domain Spec 変更      |

### Development Flow (5)

| Workflow               | Purpose        |
| ---------------------- | -------------- |
| `/spec-mesh spec`      | Spec 作成/更新 |
| `/spec-mesh plan`      | 実装計画作成   |
| `/spec-mesh tasks`     | タスク分割     |
| `/spec-mesh implement` | 実装           |
| `/spec-mesh pr`        | PR 作成        |

### Utilities (5)

| Workflow               | Purpose                     |
| ---------------------- | --------------------------- |
| `/spec-mesh clarify`   | 曖昧点の解消                |
| `/spec-mesh lint`      | Spec 整合性チェック         |
| `/spec-mesh analyze`   | 実装と Spec の整合性分析    |
| `/spec-mesh checklist` | 品質チェックリスト生成      |
| `/spec-mesh feedback`  | Spec へのフィードバック記録 |

---

## Version

- Framework Version: 1.0.0
- Constitution Version: 1.5.0
- Last Updated: 2025-12-22
