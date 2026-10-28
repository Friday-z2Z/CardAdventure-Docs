# 出口与通关系统详设

> 补全章节。出口卡的定义在 03_Cards.md I 节，本文补齐通关条件的配置结构、判定流程与失败提示。

## 1. 通关条件类型（ExitRule）

```ts
interface ExitRule {
  type: "none" | "flag" | "kill" | "collect" | "pay";
  flagKey?: string;
  enemyId?: string;
  itemId?: string;
  quantity?: number;
  gold?: number;
}
```

- `none`：基础关，到达出口即通关（MVP 前期主体）。
- `flag` 型：需激活的 runFlag（如 door_opened / door_unlocked）。
- `kill` 型：需击败的指定敌人（enemyId）。
- `collect` 型：需持有指定物品与数量（itemId / quantity）。
- `pay` 型：到达出口需支付的金币（gold）。
- 多条规则同时配置时为 **AND** 关系（全部满足）。
- 条件由 LevelValidator 静态核查可满足性（06_DataBalance.md 第 2 节）。

## 2. 判定流程

```text
玩家选中出口卡（出口卡位于堆顶层可操作时）
  ↓ 出口系统读 ExitRule[] 逐条核对 GameState（runFlags / 击杀记录 / Inventory / Gold）
  ├─ 全部满足 → level_completed 事件 → LevelVictory → 结算（12_Rewards.md）
  └─ 有缺口 → 不通关，Toast 列出缺口（如"还差：钥匙 ×1"），出口卡保持可操作
```

- 判定是**只读检查**，不进 Resolving；缺口提示走错误码 `EXIT_CONDITION_UNMET` + 缺口明细。
- pay 型支付成功后金币扣除走 ActionQueue，与商店共用支付路径（15_Shop.md）。
- 出口不可达 / 出口不存在的关卡配置直接被 LevelValidator 拦截，不进运行时。

## 3. 击杀记录

- "击败指定敌人"需要本局击杀记录：GameState 增加 `killedEnemyIds: string[]`（随快照保存，01_GameState.md 第 4 节）。
- 只记 id 不记次数；首领类要求用 kill 型 + 固定关实现。

## 4. 与机关的配合

- 机关卡激活 runFlag（mech_lever / mech_lock_door，07_CardCatalog.md）→ flag 型出口条件。
- 机关激活即发 `mechanism_activated` 事件，出口系统作为监听者刷新自身条件状态。
