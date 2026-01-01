# AI SIer 改訂 アクションプラン

**作成日:** 2026-01-01
**目的:** 今後の作業順序を明確化

---

## 実行順序

```
┌─────────────────────────────────────────────────────────┐
│ Phase 1: AI SIer 改訂の実施                              │
│ (implementation-plan-detailed.md の Phase 0-8)          │
│                                                         │
│ 主な作業:                                               │
│ - QA ドキュメント方式の導入                             │
│ - AI SIer 提案機能の追加                                │
│ - project-setup ワークフロー作成                        │
│ - 旧ファイル削除（_vision-interview 等）                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 2: 既存問題の修正                                  │
│ (findings-report.md + improvement-proposals.md)         │
│                                                         │
│ Priority 1 (Critical): 8件                              │
│ - pr.cjs Shell Injection                                │
│ - spec-lint.cjs 重複チェック                            │
│ - パス参照問題                                          │
│                                                         │
│ Priority 2 (Major): 10件                                │
│ - コード重複解消                                        │
│ - Status 定義統一                                       │
│ - Todo Template 追加                                    │
│                                                         │
│ Priority 3 (Minor): 8件                                 │
│ - 日英混在解消                                          │
│ - ID 形式正式化                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Phase 3: 徹底調査                                        │
│ (design-verification-and-investigation-plan.md)         │
│                                                         │
│ 30 Agent による網羅的調査:                               │
│ - A: 構造検証 (10 Agent)                                │
│ - B: ワークフロー動作検証 (10 Agent)                    │
│ - C: QA 方式検証 (5 Agent)                              │
│ - D: 回帰テスト (5 Agent)                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 完了: 品質保証済みの AI SIer システム                    │
└─────────────────────────────────────────────────────────┘
```

---

## ドキュメント整理

### 残すもの（参照用）

| ファイル | 用途 |
|----------|------|
| `ACTION-PLAN.md` | **これ** - 今後の作業順序 |
| `implementation-plan-detailed.md` | Phase 1 の詳細手順 |
| `findings-report.md` | Phase 2 の問題一覧 |
| `improvement-proposals.md` | Phase 2 の修正方法 |
| `design-verification-and-investigation-plan.md` | Phase 3 の調査計画 |

### 参考資料（必要時に参照）

| ファイル | 内容 |
|----------|------|
| `ai-sier-qa.md` | 設計 FAQ |
| `input-interview-improvement-plan.md` | 設計思想の詳細 |

### 削除候補（改訂完了後）

| ファイル | 理由 |
|----------|------|
| `workflow-diagram.md` | 古い |
| `terminology-audit.md` | 統合済み |
| `legacy-cleanup.md` | 完了済み |
| `migration-*.md` | 完了済み |
| `post-migration-*.md` | 統合済み |

---

## 次のアクション

**今すぐ実行:**
```
「Phase 1 を開始して」
```

これで implementation-plan-detailed.md の Phase 0 から順次実行します。

---

## 備考

- 各 Phase 完了後にチェックリストで確認
- 問題発見時は即座に修正（後回しにしない）
- Phase 3 の調査で問題が見つかれば追加修正
