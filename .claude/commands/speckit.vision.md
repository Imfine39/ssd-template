---
description: Create Vision Spec (Purpose + Journeys). First step for new projects.
handoffs:
  - label: Clarify Vision
    agent: speckit.clarify
    prompt: Clarify the Vision Spec
    send: true
  - label: Skip to Design
    agent: speckit.design
    prompt: Create Domain Spec with technical details
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Purpose

**First step** for new projects. Creates Vision Spec that defines:

- Why we're building this system
- Who will use it and what problems it solves
- Main user journeys (high-level)
- Project scope
- **Screen Hints** (画面イメージ、デザイン希望 - `/speckit.design` で活用)

**This command focuses on:** Spec 作成のみ。Clarify は別コマンドで実行。

**Use this when:** Starting a new project, before any technical design.
**Next steps:** `/speckit.clarify` で曖昧点を解消 → `/speckit.design` で Screen + Domain 同時作成

**Unified Quick Input:**
入力ファイル `.specify/input/vision-input.md` は統合版で、以下の3パートを含む:

- **Part A**: ビジョン（必須）- 基本情報、課題、ユーザー、やりたいこと
- **Part B**: 画面イメージ（任意だが推奨）- 画面リスト、遷移、主な要素
- **Part C**: デザイン希望（任意）- スタイル、レスポンシブ、参考画像

## Prerequisites

- None (this is the starting point)

---

## Critical Instructions

**IMPORTANT - MUST READ:**

1. **DO NOT use Example content** - The Example section below is for reference ONLY. NEVER output example data (「社内在庫管理システム」「倉庫担当者」「経理担当者」etc.) as actual results.

2. **MUST use tools** - You MUST actually:
   - Use the **Read tool** to read `.specify/input/vision-input.md`
   - Use the **Bash tool** to run scaffold scripts
   - Use the **Write/Edit tool** to create/modify spec files

3. **Real data only** - All output must come from:
   - User's input file (`.specify/input/vision-input.md`)
   - User's $ARGUMENTS
   - User's chat responses

---

## Execution Protocol (MUST FOLLOW)

**Before starting:**

1. Use **TodoWrite** to create todos for all main Steps:
   - "Step 1: Quick Input Collection"
   - "Step 2: Vision Spec 生成"
   - "Step 3: Vision Summary & Clarify 推奨"
   - "Step 4: Record Original Input"
   - "Step 5: Update State"

**During execution:**

2. Before each Step: Mark the corresponding todo as `in_progress`
3. After each Step:
   - Run the **Self-Check** at the end of that Step
   - Only if Self-Check passes: Mark todo as `completed`
   - Output: `✓ Step N 完了: [1-line summary]`

**Rules:**

- **DO NOT** skip any Step
- **DO NOT** mark a Step as completed before its Self-Check passes
- If a Self-Check fails: Fix the issue before proceeding

---

## Steps

### Step 1: Quick Input Collection

**Goal:** 構造化された入力を収集し、AI が的確な Vision を生成できるようにする。

#### 1.1 入力ファイルの読み込み

**【必須】Read ツールで `.specify/input/vision-input.md` を読み込むこと。**

```
Use the Read tool to read: .specify/input/vision-input.md
```

**DO NOT skip this step. DO NOT assume the file content.**

#### 1.2 入力方式の判定

以下の優先順位で入力を判定:

1. **入力ファイルにユーザー記入がある場合**
   - `.specify/input/vision-input.md` の各項目（プロジェクト名、課題など）に記入がある
   - → その内容を使用して Step 1.4 へ

2. **$ARGUMENTS に十分な情報がある場合**
   - プロジェクト名、課題、やりたいことが含まれる
   - → その内容を使用して Step 1.4 へ

3. **どちらも不十分な場合**
   - → Step 1.3 で入力ファイルの記入を促す

**入力ファイルが「記入済み」かの判定:**

- 「プロジェクト名」が空でない
- 「やりたいこと」に1つ以上の項目がある
- → 両方満たせば「記入済み」と判定

#### 1.3 入力ファイルの記入を促す

```
入力が不足しています。

以下のいずれかの方法で情報を提供してください:

Option A: 入力ファイルを編集（推奨）
  1. `.specify/input/vision-input.md` をエディタで開く
  2. テンプレートを埋める
  3. `/speckit.vision` を再実行

Option B: チャットで情報を提供
  プロジェクトの概要を教えてください:
  - 何を作りたいか
  - なぜ必要か
  - 誰が使うか
  - 主な機能（3-5個）
```

**入力ファイルの編集を待つか、チャットでの入力を受け付ける。**

#### 1.4 入力の解析

ユーザーの入力（$ARGUMENTS または Quick Input 回答）から以下を抽出:

**Part A (ビジョン) → Vision Spec メイン部分:**

| 項目           | 抽出先                             |
| -------------- | ---------------------------------- |
| プロジェクト名 | Vision Spec タイトル               |
| 課題/問題      | Section 1 (System Purpose)         |
| ユーザー       | Section 2 (Target Users)           |
| やりたいこと   | Section 3 (User Journeys) の原材料 |
| やらないこと   | Section 4 (Scope - Out of Scope)   |
| 制約           | Section 6 (Constraints)            |

**Part B (画面イメージ) → Vision Spec Section 5 (Screen Hints):**

| 項目             | 抽出先                           |
| ---------------- | -------------------------------- |
| 主要画面リスト   | Section 5.1 (Screen List)        |
| 画面遷移         | Section 5.2 (Screen Transitions) |
| 各画面の主な要素 | Section 5.1 (Key Elements 列)    |

**Part C (デザイン希望) → Vision Spec Section 5.3 (Design Preferences):**

| 項目             | 抽出先                       |
| ---------------- | ---------------------------- |
| デザインスタイル | Section 5.3 Style            |
| レスポンシブ対応 | Section 5.3 Responsive       |
| 参考画像         | Section 5.3 Reference Images |

#### Self-Check (white running Step 1)

- [ ] Read tool で `.specify/input/vision-input.md` を実際に読み込んだか
- [ ] Example の値（社内在庫管理システム等）を使用していないか
- [ ] プロジェクト名が実際のユーザー入力から取得されているか
- [ ] 入力が不十分な場合、ユーザーに確認を求めたか

---

### Step 2: Vision Spec 生成

#### 2.1 Scaffold 実行

**【必須】Bash ツールで以下のコマンドを実行すること。**

```bash
node .specify/scripts/scaffold-spec.cjs --kind vision --id S-VISION-001 --title "[プロジェクト名]"
```

**[プロジェクト名] は Step 1 で取得したユーザー入力から取得すること。Example の値を使用しないこと。**

#### 2.2 セクション埋め込み

Quick Input の内容を各セクションに展開:

**Section 1 (System Purpose):**

- Problem statement: 「現状の問題」から
- Vision statement: 「一言で説明」+ 「なぜ解決したいか」から
- Success definition: 推定（`[NEEDS CLARIFICATION]` でマーク）

**Section 2 (Target Users):**

- Primary users: 「主なユーザー」から
- Goals: 「達成したいこと」から

**Section 3 (User Journeys):**

- 「やりたいこと」の各項目を Journey に変換
- 各 Journey に Actor, Goal, Key Steps を付与
- 不明点は `[NEEDS CLARIFICATION]` でマーク

**Section 4 (Scope):**

- In-scope: Journey から導出
- Out-of-scope: 「やらないこと」から
- Future considerations: 推定

**Section 5 (Screen Hints) - Part B/C から:**

- Screen List: 「主要画面リスト」「各画面の主な要素」から
- Screen Transitions: 「画面遷移」から
- Design Preferences: 「デザインスタイル」「レスポンシブ」「参考画像」から
- **空の場合**: テーブルを空のまま残す（`/speckit.design` で入力を促す）

**Section 6 (Constraints):**

- 「制約」から展開

**Section 7 (Risks):**

- 推定（`[NEEDS CLARIFICATION]` でマーク）

#### 2.3 曖昧点のマーキング

以下の項目を `[NEEDS CLARIFICATION]` でマーク:

- 不明確なユーザー定義
- Journey の詳細が不足している箇所
- Success definition が推定のみの場合
- Constraints が空の場合
- Risks が推定のみの場合

#### Self-Check (Step 2)

- [ ] Bash tool で scaffold-spec.cjs を実際に実行したか
- [ ] Write/Edit tool で spec ファイルを実際に作成/編集したか
- [ ] Example の値を使用せず、Step 1 で取得した実データを使用したか
- [ ] 曖昧な箇所に `[NEEDS CLARIFICATION]` マークを付けたか
- [ ] `.specify/specs/vision/spec.md` が存在するか

---

### Step 3: Vision Summary & Clarify 推奨

#### 3.1 Vision Summary 表示

```
=== Vision Spec 作成完了 ===

Purpose: [簡潔な説明]

Target Users:
- [User 1]: [Goal]
- [User 2]: [Goal]

Main Journeys:
1. [Journey 1]: [概要]
2. [Journey 2]: [概要]
3. [Journey 3]: [概要]

Scope:
- In: [主要な含まれるもの]
- Out: [主要な除外されるもの]

Screen Hints: [N] 画面定義済み / [空の場合: なし（/speckit.design で入力を促します）]

Spec: .specify/specs/vision/spec.md
```

#### 3.2 曖昧点レポート

```
=== 曖昧点 ===

[NEEDS CLARIFICATION] マーク: [N] 箇所

- Section 1: Success definition が未定義
- Section 3: Journey 2 の詳細が不足
- Section 6: Risks が推定のみ

推奨: `/speckit.clarify` で曖昧点を解消してください。
```

#### 3.3 次のステップ提示

```
次のステップ:

1. [推奨] `/speckit.clarify` - 曖昧点を解消（バッチ質問で効率的に）
2. `/speckit.design` - Screen Spec + Domain Spec を同時作成

Clarify をスキップすると、後工程での手戻りリスクが高まります。

Note: Screen Hints が入力されていない場合、/speckit.design で画面情報の入力を促します。
```

#### Self-Check (Step 3)

- [ ] Vision Summary を実際に出力したか
- [ ] 曖昧点レポートを出力したか（`[NEEDS CLARIFICATION]` の数を報告）
- [ ] 次のステップを提示したか（`/speckit.clarify` 推奨）

---

### Step 4: Record Original Input

入力ファイル（`.specify/input/vision-input.md`）から入力があった場合:

1. **Spec の末尾に「Original Input」セクションを追加**:

   ```markdown
   ---

   ## Original Input

   > 以下は `/speckit.vision` 実行時に `.specify/input/vision-input.md` から取得した元の入力です。

   [入力ファイルの内容をそのまま引用]
   ```

2. **入力ファイルをリセット**:
   ```bash
   node .specify/scripts/reset-input.cjs vision
   ```

**Note:** チャットからの入力の場合は、Clarifications セクションに記録される。

#### Self-Check (Step 4)

- [ ] 入力ファイルから入力があった場合、Original Input セクションを追加したか
- [ ] 入力ファイルのリセット（reset-input.cjs）を実行したか（入力ファイル使用時のみ）

---

### Step 5: Update State

```bash
node .specify/scripts/state.cjs repo --set-vision-status draft --set-phase vision
```

**Note:** Vision status は `draft`。Clarify 完了後に `clarified`、承認後に `approved` に更新される。

#### Self-Check (Step 5)

- [ ] state.cjs コマンドを実行して状態を更新したか
- [ ] 全ての Step が完了し、todo を全て `completed` にマークしたか

---

## Output

- Vision spec: `.specify/specs/vision/spec.md`
  - Section 1-4: Core Vision (Purpose, Users, Journeys, Scope)
  - Section 5: Screen Hints (画面情報、デザイン希望 - `/speckit.design` で使用)
  - Section 6-12: Constraints, Risks, Open Questions, etc.
- 曖昧点レポート
- Next step recommendation: `/speckit.clarify` → `/speckit.design`

---

## Human Checkpoints

1. Quick Input Template を埋める（または情報を提供）
2. Vision Summary を確認
3. → `/speckit.clarify` で曖昧点を解消

---

## Example

> ⚠️ **WARNING: REFERENCE ONLY**
>
> The following examples are for understanding the workflow ONLY.
> **DO NOT copy or output these example values** (社内在庫管理システム, 倉庫担当者, 経理担当者, etc.).
> Always use ACTUAL user input from `.specify/input/vision-input.md` or $ARGUMENTS.

### Example A: 入力ファイルから読み込み

```
Human: /speckit.vision

AI: `.specify/input/vision-input.md` を読み込みます...

    入力ファイルから情報を取得しました:
    - プロジェクト名: 社内在庫管理システム
    - 課題: Excelでの管理が非効率
    - ユーザー: 倉庫担当者、経理担当者
    - やりたいこと: 在庫一覧、入出庫管理、棚卸し

    Vision Spec を生成中...

    === Vision Spec 作成完了 ===
    ...（以下省略）

    入力ファイルをリセットしました。
```

### Example B: チャットから入力

```
Human: /speckit.vision 社内の在庫管理システム。現在はExcelで管理していて非効率。

AI: `.specify/input/vision-input.md` を読み込みます...
    入力ファイルは空のため、$ARGUMENTS を確認します。

    情報を解析中...

    追加で確認させてください:
    - **主なユーザー**: [未入力]
    - **達成したいこと**: [未入力]
    - **やりたいこと**: [未入力]

    上記を教えてください。
```
