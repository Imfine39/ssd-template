# SpecKit Workflow Review

このドキュメントは、SSD-Template のワークフロー全体をレビューした結果、
発見された齟齬（不整合）とブラッシュアップポイントをまとめたものです。

レビュー日: 2025-12-15

---

## 1. 齟齬・不整合

### 1.1 ID 命名規則の不統一

**問題**: 各ドキュメントで ID 形式の説明が異なる

| ドキュメント | Spec ID 例 | UC ID 例 |
|-------------|-----------|----------|
| constitution.md | `S-001` | `UC-001` |
| feature-spec-template.md | `S-[XXX]-001` | `UC-[XXX]-001` |
| scaffold-spec.cjs 使用例 | `S-SALES-001` | - |
| CLAUDE.md | `S-XXX-001` | - |

**推奨**: ID ガイドを1箇所で定義し、すべてのドキュメントから参照する

---

### 1.2 Status 定義の不整合

**問題**: ドキュメントごとに異なる Status 定義が存在

| ドキュメント | Status 値 |
|-------------|-----------|
| constitution.md | Draft, In Review, Approved, Implementing, Completed, Deprecated, Superseded |
| screen-spec-template.md | Planned, Implemented |
| repo-state.cjson | none, scaffold, draft, clarified, approved |

**影響**:
- spec-lint.cjs は constitution.md の Status をチェック
- Screen Spec の2状態は独自定義
- 状態管理スクリプトは別の値セットを使用

**推奨**: Status の層を明確化
- Spec Status: Draft → In Review → Approved → Implementing → Completed
- Screen Status: Planned → Implemented（実装状態のみ）
- Repo State: spec 作成の進捗を追跡（別概念）

---

### 1.3 Spec 階層構造の不一致

**問題**: constitution.md と CLAUDE.md で階層数が異なる

| ドキュメント | 階層 |
|-------------|------|
| constitution.md | 3層: Vision → Domain → Feature |
| CLAUDE.md | 4層: Vision → Domain → Screen → Feature |

**影響**: constitution.md に Screen Spec への言及がほとんどない

**推奨**: constitution.md を更新し、4層構造を正式に定義

---

### 1.4 Feature Dependencies セクションの欠落

**問題**:
- parallel-development.md では Feature Spec に「3.2 Feature Dependencies」セクションを記載
- しかし feature-spec-template.md には該当セクションがない

```markdown
# parallel-development.md の例:
### 3.2 Feature Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| S-AUTH-001 | Hard | User authentication must be implemented first |
```

**推奨**: feature-spec-template.md に Feature Dependencies セクションを追加

---

### 1.5 spec-lint.cjs と Screen Index テーブルの大文字小文字

**問題**:
- spec-lint.cjs は `| SCREEN ID | NAME |` を検索（大文字）
- screen-spec-template.md は `| Screen ID | Name |` を定義（混合ケース）

**影響**: lint が Screen Index を検出できない可能性

**推奨**: どちらかに統一（テンプレートを大文字に、または lint を case-insensitive に）

---

### 1.6 repo-state.cjson に Screen Spec が含まれていない

**問題**: Vision と Domain の状態は追跡されるが、Screen Spec の状態は追跡されていない

```json
// 現状
"specs": {
  "vision": { ... },
  "domain": { ... }
  // screen がない
}
```

**推奨**: Screen Spec の状態追跡を追加

---

### 1.7 Feature Index の Owner カラム

**問題**:
- parallel-development.md の例では `Owner` カラムがある
- domain-spec-template.md の Feature Index には `Owner` カラムがない

**推奨**: 必要であれば domain-spec-template.md に追加、不要であれば Guide から削除

---

### 1.8 Quick Input の design フェーズ対応

**状況**: `/speckit.design` は Screen + Domain Spec を同時に作成するが、対応する quickinput がない

| コマンド | Quick Input |
|---------|-------------|
| /speckit.vision | quickinput-vision.md（統合: Part A/B/C） |
| /speckit.add | quickinput-add.md |
| /speckit.fix | quickinput-fix.md |
| /speckit.design | なし（Vision Spec の Screen Hints から取得） |

**結論**: **Quick Input 不要**。`/speckit.design` は Vision Spec の Screen Hints セクションから画面情報を取得し、Screen + Domain Spec を同時に作成する。追加の入力は不要。

---

### 1.9 Foundation Issue の概念が未定義

**問題**:
- CLAUDE.md で「S-FOUNDATION-001」「Foundation Issue」に言及
- しかし constitution.md やテンプレートには定義がない

**推奨**: Foundation の概念をドキュメント化
- Foundation とは何か（基盤機能: 認証、DB、基本構造）
- なぜ最初に実装するか
- Foundation Feature Spec の書き方

---

## 2. ブラッシュアップポイント

### 2.1 [高] ID 命名規則ガイドの作成

すべての ID 形式を1箇所で定義するガイドを作成:

```markdown
# ID Naming Guide

## Spec IDs
- Vision: S-VISION-001
- Domain: S-DOMAIN-001
- Screen: S-SCREEN-001
- Feature: S-{AREA}-{NNN} (例: S-AUTH-001, S-ORDERS-001)

## Use Case IDs
- UC-{AREA}-{NNN} (例: UC-AUTH-001)

## Master Data IDs
- M-{NAME} (例: M-USER, M-ORDER)

## API Contract IDs
- API-{RESOURCE}-{ACTION} (例: API-USER-CREATE, API-ORDER-LIST)

## Business Rule IDs
- BR-{NNN}: ビジネスルール
- VR-{NNN}: 検証ルール
- CR-{NNN}: 計算ルール

## Screen IDs
- SCR-{NNN} (例: SCR-001)
```

---

### 2.2 [高] constitution.md の Screen Spec 追加

Section VIII に Screen Spec を追加:

```markdown
## VIII. Specification Structure and Domain Model

Specifications are organized in a **four-tier structure**:

- **Vision spec** (project purpose and journeys)
- **Domain spec** (shared masters, APIs, business rules)
- **Screen spec** (screen list, transitions, wireframes)
- **Feature specs** (one per feature slice)

### Screen spec:
- Defines all screens in the system (SCR-*)
- Defines screen transitions and flows
- Serves as the single source of truth for UI design
- Uses simplified status: Planned → Implemented
- Feature specs MUST reference screens by SCR-* ID
- Screen updates MUST precede Feature Spec creation (Spec-First)
```

---

### 2.3 [高] Tasks Template の Spec-First 対応

tasks-template.md に Screen Spec 更新タスクを追加:

```markdown
## 2. Phase 0: Alignment and Setup

- `[T-000] [P0] Confirm target spec(s) and plan are approved`
- `[T-001] [P0] Confirm branch and Issue linkage`
- `[T-002] [P0] Read Domain spec and Feature spec; list dependencies`
- `[T-002.5] [P0] [Spec-First] Verify Screen Spec is updated for affected screens`
- `[T-003] [P0] Use Serena to map relevant directories/files`
...

## 8. Phase 5: PR Preparation and Review

- `[T-050] [P1] Prepare PR: link Issues, reference Spec IDs, summarize changes`
...
- `[T-055] [P1] [Post-merge] Update Screen Spec Status to Implemented`
```

---

### 2.4 [中] Feature Spec Template に Feature Dependencies 追加

Section 2 に追加:

```markdown
## 2. Domain Dependencies

### 2.1 Master Data Dependencies
...

### 2.2 API Dependencies
...

### 2.3 Business Rules Dependencies
...

### 2.4 Feature Dependencies

| Feature ID | Type | Description |
|------------|------|-------------|
| S-XXX-001 | Hard/Soft | [Why this feature depends on another] |

**Dependency types:**
- **Hard**: Cannot implement until dependency is completed
- **Soft**: Can proceed independently, integration requires dependency
```

---

### 2.5 [中] Error Recovery Guide に Screen Spec セクション追加

```markdown
## X. Screen Spec Errors

### X.1 Screen Spec Not Updated Before Feature Spec (Spec-First Violation)

**Symptoms**: Feature Spec references SCR-* that doesn't exist in Screen Spec

**Recovery steps**:
1. **Pause Feature work** - Do not proceed with implementation
2. **Update Screen Spec** - Add the missing screen(s) to Screen Index
3. **Update Modification Log** if modifying existing screen
4. **Continue with Feature Spec** after Screen Spec is updated

### X.2 Screen Status Not Updated After PR Merge

**Symptoms**: Screen Status is still "Planned" after feature is deployed

**Recovery steps**:
1. **Update Screen Spec** - Change Status to "Implemented"
2. **Commit the change** - "chore: Update Screen Spec Status to Implemented"
```

---

### 2.6 [中] repo-state.cjson の Screen Spec 追加

state.cjs を更新して Screen Spec 状態を追跡:

```json
"specs": {
  "vision": { ... },
  "domain": { ... },
  "screen": {
    "path": ".specify/specs/screen/spec.md",
    "status": "none",
    "lastModified": null,
    "screenCount": 0
  }
}
```

---

### 2.7 [低] Plan Template に Screen Spec 参照追加

plan-template.md のヘッダーに追加:

```markdown
Plan ID: [PLAN-ID]
Related Spec(s): [S-001, UC-003, etc.]
Related Domain Spec: [S-DOMAIN-001]
Related Screen Spec: [S-SCREEN-001]  # 追加
Related Screens: [SCR-001, SCR-002]  # 追加
Branch: [feature/<issue>-<short-description>]
```

---

### 2.8 [低] spec-lint.cjs の改善

1. Screen Index テーブルの検出を case-insensitive に
2. Screen Spec の Modification Log 検証を追加
3. Spec-First 違反の検出（Feature が未定義の SCR-* を参照）

---

### 2.9 [低] Foundation 概念のドキュメント化

新規ガイド `.specify/guides/foundation.md` を作成:

```markdown
# Foundation Feature Guide

## Foundation とは

Foundation は、他のすべての Feature が依存する基盤機能です。

典型的な Foundation 機能:
- 認証・認可（Authentication/Authorization）
- データベース構造（Core Models）
- 基本的な UI 構造（Layout, Navigation）
- 共通ユーティリティ

## なぜ Foundation を最初に実装するか

1. 他の Feature が依存するため
2. 早期にアーキテクチャ決定を確定
3. 開発環境を整備

## S-FOUNDATION-001 の作り方

1. `/speckit.design` で Feature 候補を生成
2. Foundation 候補を選択
3. S-FOUNDATION-001 Issue が自動作成される
4. `/speckit.issue` で S-FOUNDATION-001 を選択
5. Foundation Feature Spec を作成
```

---

## 3. 優先順位付き実施計画

| 優先度 | 項目 | 作業内容 | 影響範囲 | 状態 |
|--------|------|----------|----------|------|
| 高 | 2.1 | ID 命名規則ガイド作成 | 新規ファイル | **完了** |
| 高 | 2.2 | constitution.md 更新 | constitution.md | **完了** |
| 高 | 2.3 | Tasks Template 更新 | tasks-template.md | **完了** |
| 中 | 2.4 | Feature Spec Template 更新 | feature-spec-template.md | **完了** |
| 中 | 2.5 | Error Recovery Guide 更新 | error-recovery.md | **完了** |
| 中 | 2.6 | state.cjs / repo-state.cjson 更新 | スクリプト | **完了** |
| 低 | 2.7 | Plan Template 更新 | plan-template.md | **完了** |
| 低 | 2.8 | spec-lint.cjs 改善 | スクリプト | **完了** |
| 低 | 2.9 | Foundation Guide 作成 | 新規ファイル | **完了** |
| 低 | 1.5 | Screen Index 大文字統一 | スクリプト修正で対応 | **完了** |
| 低 | 1.7 | Feature Index Owner カラム | domain-spec-template.md | 任意 |
| - | 1.8 | quickinput-design.md | - | **不要**（Vision から派生） |

---

## 4. まとめ

全体として、ワークフローは **よく設計されており、実用的** です。

主な改善点:
1. **Screen Spec の位置付け強化** - constitution.md への追加が最重要
2. **ID 命名規則の統一** - 混乱を防ぐため1箇所で定義
3. **Spec-First の徹底** - Tasks/Plan Template での明示

これらの改善により、ワークフローの一貫性と使いやすさが向上します。
