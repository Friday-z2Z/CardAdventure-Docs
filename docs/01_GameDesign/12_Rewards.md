# 奖励系统详设

> 补全章节。定义奖励的来源、结构、结算时机与重复发放防护。数值区间见 09_BalanceBaseline.md 第 5 节。

## 1. 奖励来源分类

| 来源 | 触发事件 | 结算位置 |
|---|---|---|
| 击杀敌人 | `enemy_died` | RewardSystem 监听 → 构造发奖 Action |
| 资源卡/事件 | 卡牌效果内 resource 类型效果 | EffectResolver priority 30 |
| 连击达成 | `combo_updated`（tier 变化） | 连击奖励 Action（priority 最低，不再触发连击） |
| 关卡通关 | `level_completed` | 结算面板：固定奖励（rewardConfig）+ 表现结算 |
| 精英/首领 | 同击杀，奖励配置在敌人定义 | 倍率见 13_EliteBoss.md |
| 永久成长加成 | 任意发奖动作 | 计算在 RewardSystem 内，不改来源配置 |

## 2. rewardConfig 结构

```ts
interface RewardConfig {
  gold?: { min: number; max: number };      // 区间内按种子随机（可复现）
  food?: { min: number; max: number };
  items?: { itemId: string; quantity: number; chance: number }[];  // chance 0~1
  fixed?: boolean;                           // true = 必发全部；false = 按 chance 掷
}
```

- 区间随机必须走统一随机模块（种子驱动），同种子同结果（06_DataBalance.md 第 4 节）。
- 道具奖励 chance 与稀有度约束由 ItemValidator / LevelValidator 检查（06_DataBalance.md 第 2 节）。

## 3. 结算时机与幂等（重复发放防护）

1. 奖励永远是**一个 Action**，在 ActionQueue 内执行，不在监听器里直接改资源（04_EventCatalog.md 规则 2）。
2. **幂等键**：每个发奖 Action 携带 `rewardKey = levelId + levelSeed + turn + 序号`；RewardSystem 维护本局已发集合，重复 key 直接丢弃——覆盖"恢复存档后重复发奖"边界用例（11_Testing.md 用例 17）。
3. 关卡通关奖励只发一次：以 `level_completed` 事件为准，结算面板确认后才写入存档（SaveSystem），写档失败不重复弹奖（02_StateMachine.md LevelResult 异常处理）。

## 4. 防通胀约束

- 全部奖励区间集中于 Balance 表（09_BalanceBaseline.md 第 5 节），禁止散落。
- 每关金币净收入（奖励 − 消耗）由 LevelValidator 模拟核查不越出该阶段预算带 ±30%。
- 稀有道具掉率之和每关 ≤ 配置上限（LevelValidator 检查）。
