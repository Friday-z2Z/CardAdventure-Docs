# 事件总线与事件目录

> 新增章节（采纳评审建议三的"解耦"部分）。EventBus 在总规格书 7.3/9.2 已有位置，本文补齐使用规则与事件目录。AI 编码新增事件必须先登记到目录。

## 1. 使用规则

1. **状态类事件只广播"已提交"的状态变化**。先完成 GameState 变更，再发布事件；禁止先发事件再改状态。输入请求类事件（目录中标"UI → GameController"的 `card_selected` 等）是同一总线上的例外：它们不承载状态变更，由 GameController 校验后转成 Action 入队，校验失败回错误码。
2. 监听器不得直接修改核心状态。若需要反应式变更（如成就奖励），必须构造新的 Action 走 ActionQueue。
3. 事件载荷是不可变快照，监听器不得改写载荷。
4. 同一事件允许多个监听者；监听者之间互不感知（解耦目标）。
5. 事件名使用 `snake_case`，必须先登记到下表再编码。
6. UI、音效、统计都是普通监听者，无特权。

### 解耦示例（评审建议）

玩家杀死敌人时，`BattleSystem` 不直接加金币、不放音效：

```text
enemy_died（BattleSystem 发布）
  → RewardSystem 监听 → 构造发奖 Action
  → ComboSystem 监听 → 连击判定
  → SoundSystem 监听 → 播放音效
  → UISystem 监听 → 演出
  → AnalyticsSystem 监听 → 埋点
```

后续新增每日任务、成就、排行榜，只需新增监听者，不改 BattleSystem。

## 2. 事件目录（V1 基线）

| 事件 | 载荷 | 发布者 | 典型监听者 |
|---|---|---|---|
| state_changed | from, to | StateMachine | UI（输入锁/界面切换） |
| card_selected | side, cardId | UI → GameController | 卡牌系统 |
| card_resolved | cardId, result | EffectResolver | UI、连击、统计 |
| stack_updated | side, remaining, topCard | 卡牌系统 | UI |
| enemy_damaged | enemyId, amount, overkill | 战斗系统 | UI、统计 |
| enemy_died | enemyId, rewards | 战斗系统 | 奖励、连击、音效、UI、统计 |
| player_damaged | amount, source | 战斗/状态系统 | UI、统计 |
| player_died | cause | 状态系统 | UI、统计、存档 |
| hp_changed | value, delta | 资源系统 | UI |
| food_changed | value, delta, reason | 资源系统 | UI、统计 |
| gold_changed | value, delta, reason | 资源系统 | UI、统计 |
| shield_changed | value, delta | 资源系统 | UI |
| status_applied / status_removed | effectId, stacks | 状态系统 | UI、音效 |
| item_used | itemId, target | 道具系统 | UI、统计 |
| item_gained | itemId, quantity | 奖励系统 | UI、存档 |
| combo_updated | combo, tier | 连击系统 | UI、音效 |
| mechanism_activated | flagKey | 机关系统 | 出口系统、UI |
| boss_phase_changed | bossId, phase, announce | 战斗系统 | UI、音效、BGM |
| exit_unlocked | exitId | 出口系统 | UI |
| level_completed | levelId, stats | 出口系统 | 奖励、存档、统计 |
| level_failed | levelId, cause | 状态系统 | 存档、统计 |
| reward_granted | rewardId, items | 奖励系统 | UI、存档 |
| save_written | ok, version | SaveSystem | UI（提示）、错误上报 |

## 3. 维护要求

- 新增事件必须：登记目录 → 定义载荷类型 → 单测覆盖发布/监听。
- 删除或改名事件必须同步更新本表（总规格书 10.1 第 11 步"更新文档"）。
- 代码审查检查项：是否存在未登记事件、监听器内直接改状态（总规格书 10.3）。
