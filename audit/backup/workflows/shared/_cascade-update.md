# Cascade Update（関連 Spec 同期更新）共通コンポーネント

CLARIFY GATE 通過後に実行。Feature/Fix Spec で定義された変更を Domain/Screen/Matrix に反映。

---

## Purpose

1. **Feature/Fix Spec と Domain/Screen Spec の整合性を保証**
2. **Matrix の参照関係を最新に保つ**
3. **全 Spec の一貫性を担保**

---

## 呼び出し元ワークフロー

| ワークフロー | トリガー | 更新対象 |
|-------------|---------|---------|
| add.md | Feature Spec 確定後 | Domain, Screen, Matrix |
| fix.md | Fix Spec 確定後 | Screen, Matrix |
| change.md | Spec 変更確定後 | 関連する全 Spec |

---

## 前提条件

- CLARIFY GATE: PASSED または PASSED_WITH_DEFERRED
- Impact Analysis 完了済み

---

## Steps

### Step 1: 更新対象の特定

#### 1.1 Pending Additions の抽出

Feature Spec Section 2.5 (Pending Additions) から追加予定の要素を抽出：

```
Read tool: {feature_spec_path}
→ Section 2.5 Pending Additions を確認
```

**抽出する情報:**
| 種類 | 識別 | 追加先 |
|------|------|--------|
| M-* | 新規マスタ | Domain Spec Section 3.1 |
| API-* | 新規 API | Domain Spec Section 4 |
| BR-* | ビジネスルール | Domain Spec Section 5 |

#### 1.2 Impact Analysis 結果の確認

```
確認項目:
- [ ] Pending Additions に新規要素があるか
- [ ] SCR-* の変更（Modification Log）が必要か
- [ ] Matrix 参照の更新が必要か
```

### Step 2: Pending Additions を Domain Spec に反映

**Pending Additions がある場合に実行。**

#### 2.1 Domain Spec への追加

```markdown
Edit tool: .specify/specs/overview/domain/spec.md

# Feature Index に追加:
| {feature_id} | {機能名} | {API-IDs} | In Progress |

# 適切なセクションに定義を追加:
## API-XXX-001: {API名}
- Endpoint: ...
- Method: ...
```

#### 2.2 Feature Spec Section 2.5 のステータス更新

Domain Spec に追加した要素の Status を更新：

```markdown
Edit tool: {feature_spec_path}

# Section 2.5 の該当行を更新:
| API-{AREA}-001 | API | {説明} | Added | {今日の日付} |

# Status: Pending → Added
```

**ステータス遷移:**
```
Pending (Feature Spec で仮定義)
    ↓ Domain Spec に追加
Added (Domain Spec で正式定義)
    ↓ Matrix 検証完了
Verified (相互参照が検証済み)
```

### Step 3: Screen Spec 更新（必要な場合）

**SCR-* の変更がある場合:**

```markdown
Edit tool: .specify/specs/overview/screen/spec.md

# Modification Log に追加:
| {SCR-ID} | {変更内容} | {Feature/Fix ID} | Planned |
```

### Step 4: Matrix 更新

```bash
node .claude/skills/spec-mesh/scripts/matrix-ops.cjs validate
```

エラーがある場合は cross-reference.json を更新。

### Step 5: 整合性検証

```bash
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 6: [DEFERRED] 項目の波及（PASSED_WITH_DEFERRED の場合）

**[DEFERRED] 項目がある場合の波及ルール:**

#### 伝播の判定

| 親 Spec | 子 Spec | 伝播するか | 方法 |
|---------|---------|-----------|------|
| Vision | Domain/Screen | 条件付き | 関連セクションのみ |
| Domain | Feature | 条件付き | 該当 API/Master のみ |
| Screen | Feature | 条件付き | 該当 Screen のみ |

#### 伝播方法

1. **自動伝播しない**: 子 Spec に [DEFERRED] を自動追加しない
2. **参照注記を追加**:
   ```markdown
   > ⚠️ This section depends on [DEFERRED] item in {parent_spec}:
   > - {Parent Spec} Section {N}: [DEFERRED: {理由}]
   ```
3. **Matrix には登録しない**: [DEFERRED] 項目は Matrix の関連に含めない
4. **確定後に更新**: [DEFERRED] 解消後、参照注記を削除し正式な内容に置換

#### 伝播の例

```
Feature Spec に [DEFERRED: 認証方式未確定]
    ↓
Domain Spec の API セクションに参照注記を追加
    ↓
Matrix には登録しない（確定後に登録）
    ↓
Feature の [DEFERRED] 解消後
    ↓
Domain の参照注記を削除、正式な API 定義に更新
    ↓
Matrix を更新
```

---

## Output

```
=== Cascade Update 完了 ===

Pending Additions 処理:
- 処理件数: {N} 件
- M-*: {count} 件 Added
- API-*: {count} 件 Added
- 未処理: 0 件

Domain Spec: {更新件数} 件
Screen Spec: {更新件数} 件
Matrix: {UPDATED | NO CHANGE}

整合性検証: PASSED
```

**警告: 未処理の Pending Additions がある場合:**
```
WARNING: {N} 件の Pending 項目が未処理です。

未処理項目:
- {ID}: {理由}

[HUMAN_CHECKPOINT] 続行前に確認が必要です。
```

---

## State Tracking

Cascade Update 完了後、更新履歴を記録する：

```bash
# 更新記録の追加
node .claude/skills/spec-mesh/scripts/state.cjs repo \
  --add-cascade "{trigger_spec_id}" "{affected_spec_ids}" "{description}"

# 例: Feature Spec から Domain/Screen への波及
node .claude/skills/spec-mesh/scripts/state.cjs repo \
  --add-cascade "F-AUTH-001" "domain,SCR-001,SCR-002" "認証機能追加による更新"

# 記録の確認
node .claude/skills/spec-mesh/scripts/state.cjs repo --list-cascade
```

**パラメータ:**
| パラメータ | 説明 | 例 |
|-----------|------|-----|
| trigger | 更新を引き起こした Spec ID | `F-AUTH-001`, `FIX-001` |
| affected | 影響を受けた Spec (カンマ区切り) | `domain,SCR-001,SCR-002` |
| description | 更新の説明（任意） | `認証機能追加による更新` |

---

## 呼び出し方

```markdown
### Step N: Cascade Update

> **参照:** [shared/_cascade-update.md](shared/_cascade-update.md)

Impact Analysis で特定された変更を関連 Spec に反映。
完了後は `--add-cascade` で更新履歴を記録。
```
