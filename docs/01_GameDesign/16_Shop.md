# 商店系统详设（阶段二）

> 补全章节。06_Levels.md 阶段二引入商店；evt_merchant（MVP 事件卡）只是单次交易，不是商店系统。本文定义正式商店。

## 1. 定位

- 商店是金币的**主消耗口**与道具的第二获取途径（04_Items.md 经济闭环）。
- 入口形态：商店事件卡（evt_merchant 的升级版）与商店关（固定关，阶段二起）。
- MVP 不做商店；阶段二实现时，购买统一走支付 Action（与 13_Exit.md pay 型同路径），不复用 EventChoice 的购买分支。

## 2. 库存与刷新

| 项 | 规则 |
|---|---|
| 库存生成 | 按关卡配置 `shopConfig.poolIds` 从道具池抽 4～6 件；走统一随机（种子驱动，同种子同货架，06_DataBalance.md 第 4 节） |
| 稀有度权重 | 阶段二 common 70% / uncommon 25% / rare 5%，随阶段偏移（Balance 表） |
| 刷新 | 手动刷新付费（金币，价格递增 2/4/8…）；每关商店最多刷新 3 次 |
| 库存锁定 | 商店关内库存固定，不随行动变化 |

## 3. 价格与支付

- 价格 = 道具基价 × 阶段系数（Balance 表）；区间约束见 09_BalanceBaseline.md 第 5 节（common 5～8 / rare 12～20）。
- 支付流程：选择商品 → 校验金币（不足回 `NOT_ENOUGH_GOLD`）→ 扣金 Action → `item_gained` → 入 Inventory。
- **只买不卖**（原型冻结）：出售旧道具引入背包管理复杂度且拉低道具决策价值；若后续开放须先补背包容量设计。

## 4. 与其他系统的边界

| 事项 | 归属 |
|---|---|
| 支付校验与错误码 | 10_CodingStandards.md 第 3 节 |
| 道具入库与上限 | ItemSystem（maxStack 检查，04_Items.md） |
| UI（货架、价格签、刷新按钮） | 03_UI 组件库 Modal 复用 |
| 商店关可解性 | LevelValidator 检查"关键道具可在商店获取"与金币预算（12_Rewards.md 第 4 节） |
