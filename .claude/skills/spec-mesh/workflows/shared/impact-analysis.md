# Impact Analysis（影響分析）共通コンポーネント

他の仕様に影響を与える可能性がある変更を行う前に、影響範囲を特定し、適切な対応を判断するための共通手順。

---

## 呼び出し元ワークフロー

このコンポーネントは以下のワークフローから呼び出される：

| Tier | ワークフロー | 呼び出しタイミング | 必須/推奨 |
|------|-------------|-------------------|-----------|
| 1 | change.md | Step 2: 影響分析 | **必須** |
| 1 | clarify.md | 曖昧点解消前 | **必須** |
| 1 | feedback.md | フィードバック記録前 | **必須** |
| 2 | pr.md | Post-Merge Actions 前 | 必須 |
| 2 | project-setup.md | Domain/Screen 作成前 | 推奨 |
| 3 | feature.md | Spec-First で既存 Spec 更新時 | 推奨 |
| 3 | fix.md | Screen 変更が必要な場合 | 推奨 |
| 3 | implement.md | Feedback 記録時 | 推奨 |
| 3 | SKILL.md Entry (quick) | Impact Guard 判定時 | 推奨 |

---

## 分析モード

変更の種類に応じて適切なモードを選択：

| モード | 用途 | チェック範囲 |
|--------|------|-------------|
| **FULL** | Spec 直接変更（change, clarify） | 全チェック実施 |
| **STANDARD** | 新規 Spec 作成（add, issue, fix） | 参照整合性 + Matrix |
| **LIGHT** | 軽微な変更（quick, implement） | 参照存在チェックのみ |

---

## FULL モード（完全分析）

### Step 1: 変更対象の特定

```
変更対象:
- Spec: {spec_id} ({spec_path})
- 変更内容: {change_description}
- 変更される要素:
  - [ ] Master: {M-*}
  - [ ] API: {API-*}
  - [ ] Screen: {SCR-*}
  - [ ] Use Case: {UC-*}
  - [ ] Functional Requirement: {FR-*}
```

### Step 2: 上流影響分析（Upstream）

変更対象を参照している Spec を特定：

```bash
# 1. Feature Spec からの参照
Grep tool: pattern="{変更対象ID}" path=".specify/specs/features"

# 2. Test Scenario からの参照
Grep tool: pattern="{変更対象ID}" path=".specify/specs/features" glob="**/test-scenario.md"

# 3. Plan/Tasks からの参照
Grep tool: pattern="{変更対象ID}" path=".specify/specs" glob="**/plan.md"
Grep tool: pattern="{変更対象ID}" path=".specify/specs" glob="**/tasks.md"
```

**出力:**
```
=== 上流影響（この変更の影響を受ける Spec） ===

| 参照元 Spec | 参照箇所 | 影響度 |
|-------------|---------|--------|
| S-AUTH-001 | UC-AUTH-001 で M-USER を使用 | HIGH |
| S-ORDERS-001 | FR-ORDERS-003 で API-USER-DETAIL を呼び出し | MEDIUM |
| TS-AUTH-001 | TC-001 で M-USER の検証 | HIGH |
```

### Step 3: 下流影響分析（Downstream）

変更対象が依存している Spec を特定：

```bash
# 変更対象 Spec を読み込み、参照している ID を抽出
Read tool: {spec_path}

# 参照している M-*, API-*, SCR-* を特定
```

**出力:**
```
=== 下流影響（この Spec が依存している要素） ===

| 依存先 | 定義元 | 変更による影響 |
|--------|-------|---------------|
| M-CLIENT | Domain Spec | 変更なし |
| API-ORDER-LIST | Domain Spec | 変更なし |
| SCR-003 | Screen Spec | 変更なし |
```

### Step 4: Matrix 整合性チェック

```bash
# Matrix を読み込み
Read tool: .specify/specs/overview/matrix/cross-reference.json

# 変更対象が Matrix でどう参照されているか確認
```

**出力:**
```
=== Matrix 参照状況 ===

screens:
  SCR-001: uses {変更対象} ← 影響あり
  SCR-003: uses {変更対象} ← 影響あり

features:
  S-AUTH-001: uses {変更対象} ← 影響あり

permissions:
  {変更対象}: [admin, user] ← 権限定義あり
```

### Step 5: 影響度判定

| 判定 | 条件 | 対応 |
|------|------|------|
| **CRITICAL** | 3つ以上の Feature が影響を受ける | [HUMAN_CHECKPOINT] 必須、change.md で慎重に対応 |
| **HIGH** | 1-2つの Feature が影響を受ける | 影響を受ける Spec も同時に更新必須 |
| **MEDIUM** | Matrix のみ影響、Feature への影響なし | Matrix 更新で対応可 |
| **LOW** | 参照なし | そのまま続行可 |

**出力:**
```
=== 影響分析結果 ===

影響度: {CRITICAL|HIGH|MEDIUM|LOW}

サマリー:
- 上流影響: {N} 件
- 下流依存: {N} 件
- Matrix 参照: {N} 箇所

必要なアクション:
1. {action_1}
2. {action_2}

[HUMAN_CHECKPOINT] {if CRITICAL}
この変更は複数の Feature に影響を与えます。
続行する場合は、影響を受けるすべての Spec を同時に更新する必要があります。
```

---

## STANDARD モード（標準分析）

新規 Spec 作成時の参照整合性チェック。

### Step 1: 参照する ID の妥当性確認

```bash
# 新規 Spec で参照している ID が存在するか確認

# Domain Spec で M-*, API-* が定義されているか
Grep tool: pattern="{M-*}" path=".specify/specs/overview/domain"
Grep tool: pattern="{API-*}" path=".specify/specs/overview/domain"

# Screen Spec で SCR-* が定義されているか
Grep tool: pattern="{SCR-*}" path=".specify/specs/overview/screen"
```

### Step 2: ID 重複チェック

```bash
# 新規 ID が既存と重複していないか
node .claude/skills/spec-mesh/scripts/spec-lint.cjs
```

### Step 3: Matrix 更新要否

```
Matrix 更新が必要な場合:
- 新規 Screen を追加した場合
- 新規 Feature を追加した場合
- 既存要素間の関連を追加した場合

→ validate-matrix.cjs で検証
```

**出力:**
```
=== 参照整合性チェック ===

参照している ID:
- [x] M-USER: Domain で定義済み
- [x] API-USER-CREATE: Domain で定義済み
- [x] SCR-001: Screen で定義済み
- [ ] SCR-005: ⚠️ 未定義 → Screen Spec に追加必要

ID 重複: なし

Matrix 更新: 必要（新規 Feature 追加のため）
```

---

## LIGHT モード（軽量分析）

quick タイプや軽微な変更用の簡易チェック。

### Step 1: 参照存在チェック

```bash
# 変更対象が Spec で参照されているか
Grep tool: pattern="{identifier}" path=".specify/specs"

# 変更対象が Matrix で参照されているか
Grep tool: pattern="{identifier}" path=".specify/specs/overview/matrix"
```

### Step 2: 判定

| 結果 | 対応 |
|------|------|
| 参照なし | ✓ PASS - そのまま続行 |
| Spec で参照あり | ✗ BLOCK - change.md へ |
| Matrix のみ参照 | ⚠️ WARNING - 確認後続行可 |

**出力:**
```
=== LIGHT 影響チェック ===

変更対象: {identifier}

- Spec 参照: {NONE|FOUND}
- Matrix 参照: {NONE|FOUND}

判定: {PASS|BLOCK|WARNING}
```

---

## 呼び出し方

各ワークフローから以下のように呼び出す：

```markdown
### Step N: 影響分析

[shared/impact-analysis.md](shared/impact-analysis.md) を {FULL|STANDARD|LIGHT} モードで実行。

影響度が CRITICAL の場合:
→ [HUMAN_CHECKPOINT] で承認を得てから続行

影響度が HIGH の場合:
→ 影響を受ける Spec のリストを提示し、同時更新を計画
```

---

## 自動化オプション

### スクリプトによる事前チェック

```bash
# 将来的に自動化する場合のインターフェース案
node .claude/skills/spec-mesh/scripts/impact-check.cjs \
  --target "{変更対象ID}" \
  --mode {full|standard|light} \
  --output json
```

**出力形式:**
```json
{
  "target": "M-USER",
  "mode": "full",
  "severity": "HIGH",
  "upstream": [
    { "spec": "S-AUTH-001", "reference": "UC-AUTH-001", "impact": "high" }
  ],
  "downstream": [],
  "matrix": {
    "screens": ["SCR-001", "SCR-003"],
    "features": ["S-AUTH-001"]
  },
  "actions": [
    "Update S-AUTH-001 to reflect M-USER changes",
    "Update Matrix screen mappings"
  ]
}
```

---

## Self-Check（呼び出し元で確認）

- [ ] 適切なモード（FULL/STANDARD/LIGHT）を選択したか
- [ ] 上流影響（参照元）を特定したか
- [ ] 下流依存（参照先）を確認したか
- [ ] Matrix 整合性をチェックしたか
- [ ] 影響度に応じた対応を決定したか
- [ ] CRITICAL の場合、[HUMAN_CHECKPOINT] を設けたか
