# 资源系统详设

> 补全章节。集中定义 HP / Food / Gold / Shield / Turn / Combo 六个数值的获取、消耗、上限与溢出规则。初始值与区间见 09_BalanceBaseline.md。

## 1. 四资源规则表

| 资源 | 获取途径 | 消耗途径 | 上限 | 溢出处理 | 归零后果 |
|---|---|---|---|---|---|
| HP | 恢复卡、治疗道具、regeneration 状态、事件 | 敌人攻击、陷阱、食物不足惩罚、状态 tick（毒/灼烧） | MaxHP（30 起步） | 超出部分**不保留**（03_Cards.md C 节） | =0 立即失败（01_CoreLoop.md 第 5 节） |
| Food | 资源卡、敌人掉落、ration 道具、事件 | 每次有效卡牌操作 -1、陷阱、事件献祭 | 99（显示上限，超出截断） | 截断 | **不禁止操作**：每次有效操作额外 -2 HP（01_CoreLoop.md 第 4 节） |
| Gold | 资源卡、敌人奖励、连击、通关、事件 | 商店购买、evt_shrine 类献祭、扣金币陷阱 | 99999（显示上限） | 截断 | 无法支付 → 错误码 `NOT_ENOUGH_GOLD`，禁止负数 |
| Shield | shield_scroll 道具、恢复卡 OptionalShield、部分装备 | 抵消敌方伤害（10_Battle.md 第 4 节顺序） | 30（硬上限） | 截断 | 无后果（无护盾即无抵消） |

通用约束：四资源结算全部走资源系统（ResourceSystem），任何系统不得绕过；每次变更后发布对应 `*_changed` 事件（04_EventCatalog.md）并复核状态不变式（02_Player.md 第 1 节）。

## 2. Turn 与 Combo

| 字段 | 定义 |
|---|---|
| Turn | 每次玩家有效行动完成后 +1；驱动状态 duration 递减与限时触发；不跨关（10_Battle.md 第 3 节） |
| Combo | 连击计数与奖励见 05_Combo.md；道具不触发、受伤中断、跨关清零 |

## 3. 跨关规则

- 关卡胜利结束时：本关临时资源**不带入下一关**，下一关从 LevelStartingState 重建（关卡可配置携带例外，见 06_Levels.md 第 3 节）。
- 道具库存（Inventory）与永久成长**跨关保留**，区别于临时资源。
- 失败重试：全部临时资源重置（01_CoreLoop.md 第 5 节）。

## 4. UI 呈现约定

- 顶部状态栏固定显示 HP / Food / Gold / Shield 四项（01_CoreLoop.md 第 2 节布局）。
- 每次变更必须有 FloatingNumber 或数字滚动反馈，禁止静默变化。
- Food = 0 时状态栏 Food 图标转 ColorDanger 并常驻提示"探索将损耗生命"。
