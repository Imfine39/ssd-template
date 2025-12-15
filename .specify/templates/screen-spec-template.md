# Screen Specification: [PROJECT_NAME]

Spec Type: Screen
Spec ID: S-SCREEN-001
Created: [DATE]
Status: [Draft | In Review | Approved | Implementing | Completed]
Author: [OWNER]
Related Vision: S-VISION-001
Related Domain: S-DOMAIN-001

---

## 1. Screen Overview

### 1.1 Purpose

このドキュメントはシステム全体の画面構成を定義します。

- 全画面の一覧と目的
- 画面遷移フロー
- 画面 ↔ Feature ↔ API ↔ Master の対応関係

### 1.2 Design Principles

- [デザイン原則 1]
- [デザイン原則 2]

---

## 2. Screen Index

全画面の一覧。Feature、API、Master との対応を管理。

| Screen ID | Name | Journey | Feature ID | APIs | Masters | Status |
|-----------|------|---------|------------|------|---------|--------|
| SCR-001 | [画面名] | J-1 | S-XXX-001 | API-XXX-* | M-XXX | Planned |
| SCR-002 | [画面名] | J-1,J-2 | S-YYY-001 | API-YYY-* | M-YYY | Planned |

**Status values:**
- `Planned` - 仕様定義済み、未実装
- `Implemented` - 実装完了、本番稼働中

**Update Policy (Spec-First):**
- 新規画面は Feature Spec 作成前に Screen Spec に追加（Status: Planned）
- 画面変更も Feature Spec 作成前に Screen Spec を更新（Status: Planned + Modification Log）
- 実装・PR マージ後に Status を Implemented に更新

### 2.1 Modification Log

既存画面への変更予定を記録。Feature 実装前に Screen Spec を更新し、PR マージ後に Status を更新。

| Screen ID | Modification | Feature ID | Status | Issue |
|-----------|-------------|------------|--------|-------|
| SCR-001 | [変更内容] | S-XXX-001 | Planned | #XX |

**Modification Status:**
- `Planned` - 変更予定、Feature Spec 作成済み、未実装
- `Implemented` - 変更実装完了、ワイヤーフレーム更新済み

---

## 3. Screen Transition

### 3.1 Main Flow (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> SCR-001: アクセス
    SCR-001 --> SCR-002: ログイン成功
    SCR-001 --> SCR-001: ログイン失敗
    SCR-002 --> SCR-003: メニュー選択
    SCR-003 --> SCR-004: 詳細表示
    SCR-004 --> SCR-003: 戻る
```

### 3.2 Transition Matrix

| From \ To | SCR-001 | SCR-002 | SCR-003 | SCR-004 |
|-----------|---------|---------|---------|---------|
| SCR-001 | - | ログイン | - | - |
| SCR-002 | ログアウト | - | メニュー | - |
| SCR-003 | - | 戻る | - | 選択 |
| SCR-004 | - | - | 戻る | - |

---

## 4. Screen Details

### SCR-001: [画面名]

**Purpose:** [この画面で何をするか]

**Entry Points:**
- [どこからこの画面に来るか]

**Exit Points:**
- [この画面からどこに行けるか]

**Primary Actions:**
- [主要アクション 1]
- [主要アクション 2]

**Related Elements:**
| Type | ID | Usage |
|------|-----|-------|
| Feature | S-XXX-001 | [この Feature で実装] |
| API | API-XXX-ACTION | [このAPIを呼び出し] |
| Master | M-XXX | [このデータを表示/編集] |

**Layout Overview:**
```
┌─────────────────────────────────────────┐
│  Header / Navigation                     │
├─────────────────────────────────────────┤
│                                         │
│  Main Content Area                      │
│                                         │
│  ┌─────────┐  ┌─────────┐              │
│  │ Element │  │ Element │              │
│  └─────────┘  └─────────┘              │
│                                         │
├─────────────────────────────────────────┤
│  Footer / Actions                        │
└─────────────────────────────────────────┘
```

**Reference Images:**
- [参考画像パスまたはURL]

**States:**
| State | Description | Visual |
|-------|-------------|--------|
| Default | 初期表示 | [説明] |
| Loading | 読み込み中 | [説明] |
| Empty | データなし | [説明] |
| Error | エラー発生 | [説明] |

---

### SCR-002: [画面名]

**Purpose:** [この画面で何をするか]

**Entry Points:**
- [どこからこの画面に来るか]

**Exit Points:**
- [この画面からどこに行けるか]

**Primary Actions:**
- [主要アクション]

**Related Elements:**
| Type | ID | Usage |
|------|-----|-------|
| Feature | S-XXX-001 | [説明] |
| API | API-XXX-ACTION | [説明] |
| Master | M-XXX | [説明] |

**Layout Overview:**
```
[ASCII ワイヤーフレーム]
```

**Reference Images:**
- [参考画像パスまたはURL]

---

## 5. Shared Components

複数画面で共通使用するUIコンポーネント。

### COMP-001: [コンポーネント名]

**Purpose:** [何のためのコンポーネントか]

**Used In:** SCR-001, SCR-002, SCR-003

**Layout:**
```
┌─────────────────────┐
│  Component Layout   │
└─────────────────────┘
```

**Props/Inputs:**
| Prop | Type | Description |
|------|------|-------------|
| [prop] | [type] | [説明] |

---

## 6. Design Tokens

### 6.1 Colors

| Token | Value | Usage |
|-------|-------|-------|
| primary | [#XXXXXX] | [用途] |
| secondary | [#XXXXXX] | [用途] |
| error | [#XXXXXX] | [用途] |

### 6.2 Typography

| Token | Value | Usage |
|-------|-------|-------|
| heading-1 | [size/weight] | [用途] |
| body | [size/weight] | [用途] |

### 6.3 Spacing

| Token | Value | Usage |
|-------|-------|-------|
| space-sm | [Xpx] | [用途] |
| space-md | [Xpx] | [用途] |

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | [変更点] |
| Tablet | 768px - 1024px | [変更点] |
| Desktop | > 1024px | [変更点] |

---

## 8. Accessibility Requirements

- [ ] キーボードナビゲーション対応
- [ ] スクリーンリーダー対応 (ARIA)
- [ ] カラーコントラスト比 4.5:1 以上
- [ ] フォーカス状態の可視化

---

## 9. Open Questions

- [ ] [画面設計に関する未解決の質問]

---

## 10. Clarifications

| Date | Question | Answer | Impact |
|------|----------|--------|--------|
| [DATE] | [質問] | [回答] | [影響を受けた画面] |

---

## 11. Reference Images

参考にした画像やスクリーンショットのリンク集。

| Image ID | Description | Path/URL | Related Screen |
|----------|-------------|----------|----------------|
| IMG-001 | [説明] | [パス or URL] | SCR-001 |
| IMG-002 | [説明] | [パス or URL] | SCR-002 |

---

## 12. Original Input

ユーザーが提供した元の入力。

```
[ORIGINAL_INPUT_CONTENT]
```

---

## 13. Changelog

| Date | Change Type | Description | Issue |
|------|-------------|-------------|-------|
| [DATE] | Created | Initial screen specification | #XXX |

Change types: Created, Updated, Screen Added, Screen Removed, Transition Changed

