# Issue Workflow

既存の GitHub Issue から開発を開始するワークフロー。
Issue を選択し、Feature（機能追加）または Fix（バグ修正）を判定して適切なワークフローへ引き継ぐ。

## Prerequisites

- GitHub リポジトリに Issue が存在すること

## Use Cases

- design ワークフロー で作成された Feature Issues
- 人が手動で作成した Issues
- Foundation Issue (S-FOUNDATION-001)

---

## Todo Template

```
TodoWrite:
  todos:
    - content: "Step 1: Issue 一覧取得・選択"
      status: "pending"
      activeForm: "Fetching and selecting Issue"
    - content: "Step 2: Issue 種別判定"
      status: "pending"
      activeForm: "Determining Issue type"
    - content: "Step 3: ブランチ作成"
      status: "pending"
      activeForm: "Creating branch"
    - content: "Step 4: 適切なワークフローへ引き継ぎ"
      status: "pending"
      activeForm: "Handing off to workflow"
```

---

## Steps

### Step 1: Fetch and Display Issues

```bash
gh issue list --state open --json number,title,labels --limit 20
```

Display:
```
=== Open Issues ===

#1  [Foundation] S-FOUNDATION-001: 基盤実装
#2  [Feature] S-AUTH-001: ユーザー認証
#3  [Feature] S-DASH-001: ダッシュボード
#4  [Bug] ログイン時にエラー

番号を選択してください:
```

ユーザーが Issue 番号を選択したら、詳細を取得：

```bash
gh issue view {issue_num} --json number,title,body,labels
```

### Step 2: Determine Issue Type

Issue のラベルまたはタイトルから種別を判定：

| 判定条件 | 種別 | ワークフロー |
|---------|------|-------------|
| `bug` ラベル or `[Bug]` タイトル | Fix | fix.md |
| `feature` ラベル or `[Feature]` タイトル | Feature | add.md |
| `[Foundation]` タイトル | Feature | add.md |
| その他 | 不明 | ユーザーに確認 |

**不明な場合:**
```
この Issue は Feature（機能追加）ですか？ Fix（バグ修正）ですか？
```

### Step 3: Setup Branch

**Feature の場合:**
```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type feature --slug {slug} --issue {issue_num}
```

**Fix の場合:**
```bash
node .claude/skills/spec-mesh/scripts/branch.cjs --type fix --slug {slug} --issue {issue_num}
```

### Step 4: Handoff to Workflow

**Feature の場合:**
```
Issue #{issue_num} を Feature として開始します。
ブランチ: feature/{issue_num}-{slug}

→ add ワークフロー の Step 5（コードベース分析）から続行
```

Read tool で `.claude/skills/spec-mesh-entry/workflows/add.md` を読み込み、Step 5 以降を実行。
（Step 1-4 は issue ワークフローで完了済み）

**Fix の場合:**
```
Issue #{issue_num} を Fix として開始します。
ブランチ: fix/{issue_num}-{slug}

→ fix ワークフロー の Step 4（原因調査）から続行
```

Read tool で `.claude/skills/spec-mesh-entry/workflows/fix.md` を読み込み、Step 4 以降を実行。
（Step 1-3 は issue ワークフローで完了済み）

---

## Summary

```
=== Issue ワークフロー完了 ===

Issue: #{issue_num} - {title}
種別: {Feature | Fix}
Branch: {feature|fix}/{issue_num}-{slug}

→ {add | fix} ワークフロー へ引き継ぎ
```

---

## Self-Check

- [ ] gh issue list で Issues を取得したか
- [ ] ユーザーに Issue 選択を求めたか
- [ ] Issue 種別（Feature/Fix）を判定したか
- [ ] branch.cjs でブランチを作成したか
- [ ] 適切なワークフロー（add/fix）へ引き継いだか

---

## Next Steps

| 種別 | Workflow | 開始ステップ |
|------|----------|-------------|
| Feature | add.md | Step 5: コードベース分析 |
| Fix | fix.md | Step 4: 原因調査 |
