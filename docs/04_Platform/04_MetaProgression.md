# 永久成长系统（Meta Progression）详设

> 补全 08_Roadmap 决策表"永久成长系统需要，具体设计待补"项。目标：给单机 500 关提供长线目标，但不破坏关卡公平性。

## 1. 三条成长线

| 线 | 内容 | 动力来源 |
|---|---|---|
| 图鉴收集 | 全部卡牌/道具/敌人的图鉴页（首见解锁），22 张 MVP 卡起步，随 500 关扩展 | 收集欲；图鉴页展示 CopyDeck 文案与稀有度配色 |
| 开局构筑 | 用星屑解锁"开局携带"：初始道具（最多 1 件）、初始食物 +1～3 | 关卡策略差异化 |
| 微量加成 | 永久小加成树：初始 MaxHP +2/级（≤3 级）、Shield 初始 +1（1 级）、Gold 起始 +5（1 级） | 数值成长感，但幅度受控 |

## 2. 货币：星屑

- **获取**：首次通关每关 +N（按 difficultyTier 1/2/3/5/8）；重复通关不给（防刷）；成就一次性发放（如"无伤通过首领关"）。
- **消耗**：第 1 节解锁项，价格随等级递增（Balance 表维护）。
- **不产出、不回收**：星屑不进对局、不可交易、不可购买（商业化红线，01_Monetization.md 第 1 节）。

## 3. 平衡约束（硬性）

1. 全部永久加成**可被 LevelValidator 感知**：模拟按"零解锁 / 满解锁"两端跑，任何关卡在两端都必须可解（06_DataBalance.md LevelValidator）。
2. 加成上限冻结：MaxHP 加成 ≤ +6、Food ≤ +3、Gold ≤ +5——改动须走 09_BalanceBaseline.md 第 7 节数值变更流程。
3. 加成在 LevelStartingState 生成时一次性注入（06_Levels.md 第 3 节），对局中不再二次生效。

## 4. 存档字段

```ts
interface MetaProgressData {
  stardust: number;                     // 星屑余额
  collection: string[];                 // 已首见的元素 id（图鉴）
  unlocked: { key: string; level: number }[];  // 解锁项与等级
}
```

- 挂在 ProgressData 下（10_CodingStandards.md 第 4 节），随存档迁移链升级。
- 图鉴首见发生在对局内（`card_resolved` / `item_gained` 时标记），结算时合并入档，防中途退出丢失（11_Testing.md 用例 16 同策略）。

## 5. UI 与文案

- 入口：主菜单"旅人的行囊"（图鉴 + 成长树 + 星屑余额）。
- 文案登记进 CopyDeck 第 5 节同表管理；图鉴复用卡牌说明文案（07_CardCatalog.md）。
- 解锁确认走 Modal 组件，星屑不足回 `NOT_ENOUGH_GOLD` 类错误码（新增 `NOT_ENOUGH_STARDUST`，登记进 10_CodingStandards.md 第 3 节）。

## 6. 验收

- 零解锁玩家可通全部 500 关（LevelValidator 两端模拟）。
- 星屑发放幂等（同 12_Rewards.md 幂等键机制），重复通关/重复领成就不重复发放。
