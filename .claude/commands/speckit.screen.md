---
description: Create Screen Spec (UI design, screen list, transitions). Use after Domain Spec.
handoffs:
  - label: Clarify Screen Design
    agent: speckit.clarify
    prompt: Clarify the Screen Spec
    send: true
  - label: Add Feature
    agent: speckit.add
    prompt: Add a new feature based on screen design
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**Screen Spec 作成コマンド** - システム全体の画面構成を設計します。

このコマンドで作成するもの:
- 全画面一覧 (Screen Index)
- 画面遷移図 (Mermaid)
- 画面 ↔ Feature ↔ API ↔ Master 対応表
- 各画面の概要とワイヤーフレーム

**Use this when:** Domain Spec が完成し、UI設計を開始する時
**Use `/speckit.design` first if:** Domain Spec がまだない場合
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.add` で Feature 追加

---

## Prerequisites

- Vision Spec が存在すること（推奨）
- Domain Spec が存在すること（推奨）

---

## Steps

### Step 1: Quick Input Collection

#### 1.1 入力ファイルの読み込み

**まず `.specify/input/screen.md` を読み込む。**

```bash
cat .specify/input/screen.md
```

#### 1.2 入力方式の判定

以下の優先順位で入力を判定:

1. **入力ファイルにユーザー記入がある場合**
   - `.specify/input/screen.md` の各項目に記入がある
   - → その内容を使用して Step 1.4 へ

2. **$ARGUMENTS に十分な情報がある場合**
   - 画面名のリストや説明が含まれる
   - → その内容を使用して Step 1.4 へ

3. **どちらも不十分な場合**
   - → Step 1.3 で入力ファイルの記入を促す

#### 1.3 入力ファイルの記入を促す

```
入力が不足しています。

以下のいずれかの方法で情報を提供してください:

Option A: 入力ファイルを編集（推奨）
  1. `.specify/input/screen.md` をエディタで開く
  2. テンプレートを埋める（画面リスト、参考画像など）
  3. `/speckit.screen` を再実行

Option B: チャットで情報を提供
  以下を教えてください:
  - 必要な画面のリスト
  - 画面遷移の概要
  - 参考にしたい画像があればパスまたはURL
```

#### 1.4 参考画像の処理

**入力に参考画像がある場合：**

1. **ローカルファイルパスの場合**
   - Read ツールで画像を読み込み、分析する
   - 画像から画面レイアウト、コンポーネント、配色などを抽出

2. **外部URLの場合**
   - URL を Screen Spec の「Reference Images」セクションに記録
   - 可能であれば WebFetch で取得を試みる

3. **画像分析結果の活用**
   - ワイヤーフレーム生成の参考にする
   - デザイントークンの提案に反映

---

### Step 2: Check Prerequisites

1. **Check Vision Spec exists**:
   - Look for `.specify/specs/vision/spec.md`
   - If not found: Warning (続行可能)

2. **Check Domain Spec exists**:
   - Look for `.specify/specs/domain/spec.md`
   - If not found: Warning (続行可能だが M-*/API-* 参照ができない)

3. **Read existing specs**:
   - Vision: ユーザージャーニーを抽出
   - Domain: M-*, API-*, Feature Index を抽出

---

### Step 3: Analyze and Design

1. **ユーザージャーニーから画面を導出**:
   - Vision の各 Journey に必要な画面を特定
   - ユーザー入力の画面リストと統合

2. **Domain との対応付け**:
   - 各画面が使用する M-* を特定
   - 各画面が呼び出す API-* を特定
   - 既存 Feature との関連を特定

3. **画面遷移の設計**:
   - Entry Point（最初にアクセスする画面）
   - Main Flow（主要な遷移パス）
   - Alternative Flow（代替パス）

---

### Step 4: Create Screen Spec

1. **Scaffold Screen spec**:
   ```bash
   node .specify/scripts/scaffold-spec.js --kind screen --id S-SCREEN-001 --title "[Project Name] Screens" --vision S-VISION-001 --domain S-DOMAIN-001
   ```

2. **Fill Screen spec sections**:
   - Section 2 (Screen Index): 全画面一覧と対応表
     - **Status を `Planned` に設定**（未実装の新規画面）
     - 既存実装済み画面は `Implemented`
   - Section 2.1 (Modification Log): 変更予定がある場合に記録
   - Section 3 (Screen Transition): Mermaid 図 + 遷移マトリクス
   - Section 4 (Screen Details): 各画面の詳細
     - Purpose, Entry/Exit Points, Primary Actions
     - Related Elements (Feature, API, Master)
     - Layout Overview (ASCII ワイヤーフレーム)
     - Reference Images (入力からコピー)
     - States (Default, Loading, Empty, Error)
   - Section 5 (Shared Components): 共通コンポーネント
   - Section 6-7 (Design Tokens, Responsive): デザイン基準

3. **Set Status (Spec-First approach)**:
   - 新規画面: `Planned`（ワイヤーフレームは計画状態）
   - Feature 実装・PR マージ後に `Implemented` に更新

4. **Mark unclear items as `[NEEDS CLARIFICATION]`**

---

### Step 5: Process Reference Images

参考画像がある場合、以下を実行:

1. **画像を分析** (Read ツール使用)
2. **分析結果を反映**:
   - レイアウトパターンをワイヤーフレームに反映
   - 色やスペーシングをデザイントークンに反映
3. **Reference Images セクションに記録**:
   ```markdown
   | Image ID | Description | Path/URL | Related Screen |
   |----------|-------------|----------|----------------|
   | IMG-001 | ダッシュボード参考 | .specify/images/ref-01.png | SCR-002 |
   ```

---

### Step 6: Run Lint

```bash
node .specify/scripts/spec-lint.js
```

---

### Step 7: Record Original Input & Reset

入力ファイル（`.specify/input/screen.md`）から入力があった場合:

1. **Spec の末尾に「Original Input」セクションを追加**

2. **入力ファイルをリセット**:
   ```bash
   node .specify/scripts/reset-input.js screen
   ```

---

### Step 8: Summary & Clarify 推奨

#### 8.1 Spec Summary 表示

```
=== Screen Spec 作成完了 ===

Spec: .specify/specs/screen/spec.md

概要:
- 画面数: [N] 画面
- 共通コンポーネント: [N] 個
- 参考画像: [N] 枚

Screen Index:
| Screen ID | Name | Related Feature |
|-----------|------|-----------------|
| SCR-001 | [名前] | S-XXX-001 |
| ...

画面遷移:
[Mermaid 図のプレビューまたは説明]
```

#### 8.2 曖昧点レポート

```
=== 曖昧点 ===

[NEEDS CLARIFICATION] マーク: [N] 箇所

- Section 4: SCR-003 のレイアウトが未定義
- Section 6: カラースキームが未定義
- Section 7: モバイル対応の要否が未定義

推奨: `/speckit.clarify` で曖昧点を解消してください。
```

#### 8.3 次のステップ提示

```
次のステップ:

1. [推奨] `/speckit.clarify` - 曖昧点を解消
2. `/speckit.add` - Feature 追加（画面設計を基に）
3. `/speckit.issue` - 既存 Issue から開発開始

Clarify をスキップすると、実装中の手戻りリスクが高まります。
```

---

### Step 9: Update State

```bash
node .specify/scripts/state.js repo --set-phase design
```

---

## Output

- Screen spec: `.specify/specs/screen/spec.md`
- Screen Index (画面一覧)
- Screen Transition (画面遷移図)
- 曖昧点レポート
- Next step recommendation: `/speckit.clarify`

---

## Human Checkpoints

1. 入力ファイルを埋める（または情報を提供）
2. 参考画像の確認（提供された場合）
3. Screen Spec のレビュー
4. → `/speckit.clarify` で曖昧点を解消

---

## Example

### Example A: Quick Input から画像参照あり

```
Human: /speckit.screen

AI: `.specify/input/screen.md` を読み込みます...

    入力ファイルから情報を取得しました:
    - 画面リスト: ログイン、ダッシュボード、商品一覧、商品詳細、設定
    - 参考画像:
      - .specify/images/dashboard-ref.png
      - .specify/images/product-list-sketch.jpg

    参考画像を分析中...

    dashboard-ref.png:
    - レイアウト: 左サイドバー + メインコンテンツ
    - コンポーネント: カード、グラフ、テーブル
    - カラー: 青系 (#1a73e8)

    product-list-sketch.jpg:
    - レイアウト: グリッド表示
    - 機能: 検索バー、フィルター、ページネーション

    Vision/Domain Spec を確認中...
    - Vision Journeys: 3 つ
    - Domain M-*: M-PRODUCT, M-USER, M-ORDER
    - Domain API-*: 8 APIs

    Screen Spec を作成中...

    === Screen Spec 作成完了 ===

    Spec: .specify/specs/screen/spec.md

    概要:
    - 画面数: 5 画面
    - 共通コンポーネント: 3 個
    - 参考画像: 2 枚

    Screen Index:
    | Screen ID | Name | Journey | Feature | APIs |
    |-----------|------|---------|---------|------|
    | SCR-001 | ログイン | J-1 | S-AUTH-001 | API-AUTH-* |
    | SCR-002 | ダッシュボード | J-1,J-2,J-3 | S-DASH-001 | API-SUMMARY-* |
    | SCR-003 | 商品一覧 | J-2 | S-PRODUCT-001 | API-PRODUCT-LIST |
    | SCR-004 | 商品詳細 | J-2 | S-PRODUCT-001 | API-PRODUCT-DETAIL |
    | SCR-005 | 設定 | J-1 | S-SETTINGS-001 | API-USER-* |

    === 曖昧点 ===

    [NEEDS CLARIFICATION] マーク: 3 箇所

    - Section 4: SCR-005 設定画面の詳細が未定義
    - Section 6: カラースキームの確定
    - Section 7: レスポンシブ対応の範囲

    入力ファイルをリセットしました。

    次のステップ:
    1. [推奨] `/speckit.clarify` - 曖昧点を解消
    2. `/speckit.add` - Feature 追加
```

### Example B: チャットから直接

```
Human: /speckit.screen ログイン、ホーム、検索結果、詳細の4画面が必要

AI: `.specify/input/screen.md` を読み込みます...
    入力ファイルは空のため、$ARGUMENTS を確認します。

    4画面を特定しました:
    - ログイン
    - ホーム
    - 検索結果
    - 詳細

    追加で確認させてください:
    - 参考にしたい画像やデザインはありますか？
    - レスポンシブ対応は必要ですか？