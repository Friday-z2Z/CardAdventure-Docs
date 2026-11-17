# GameState 规范

> 来源：总规格书 9.3、9.9。本文定义 GameState 的职责、结构与序列化要求。

## 1. 职责边界

GameState 是**唯一**的游戏状态持有者。

它负责：

- 保存当前局的所有状态（玩家属性、资源、卡牌堆、状态效果、RunFlags、Turn、Combo）。
- 提供状态的读取与受控变更接口（供 EffectResolver 调用）。
- 提供状态快照（用于存档与回滚）。

它**不负责**：

- 绘制 UI。
- 播放动画。
- 加载图片。
- 处理点击事件。
- 判断操作合法性（ActionResolver 的职责）。
- 执行效果（EffectResolver 的职责）。

## 2. 结构概要

```ts
interface GameState {
  player: PlayerState;        // 见 ../01_GameDesign/02_Player.md
  stacks: StackRuntime[];     // 2～20 堆（全阶段 matrix5，06_Levels.md §3.1）
  enemies: EnemyRuntime[];    // 本局敌人实例（驻留/多敌同场/首领），见下
  currentEnemyId?: string;    // 当前交战敌人 instanceId（10_Battle.md §2）
  levelId: number;
  levelSeed: number;          // 关卡随机种子，存档必须保存
  runFlags: Record<string, boolean | number>;
  killedEnemyIds: string[];   // 本局击杀记录（kill 型出口条件用，13_Exit.md 第 3 节）
  turn: number;
  combo: number;
  statusEffects: StatusEffectInstance[];   // 仅玩家；敌方状态在 enemies[].statuses
  equipped: { weapon?: string; armor?: string; trinket?: string };  // 装备槽只存 ID（03_Cards.md D 节），派生属性重算
  rewardedKeys: string[];     // 本局已发奖励幂等集合（12_Rewards.md §3 第 4 条，随快照持久化）
}

interface StackRuntime {
  stackId: string;            // 稳定 id，形如 "s_r1c1"（由 cell 派生），事件载荷与存档用
  cell: [number, number];     // 5×5 坐标 [row, col]（0～4）
  reveal: "lit" | "dark";
  depth: number;              // 初始堆深（= 关卡配置 depth，用于统计与校验）
  cards: CardRuntime[];       // 剩余序列，**索引 0 = 顶层**（下一个被处理）
  resolvedCount: number;      // 已处理张数（= depth − cards.length）
}

interface CardRuntime {
  cardId: string;             // 指向 CardDefinition.id
  faceUp: boolean;            // 是否已对玩家揭示（dark 堆顶牌翻开后置 true）
}

interface EnemyRuntime {
  instanceId: string;         // 本局唯一（形如 "e_<stackId>_<n>"），多敌同场靠它区分
  enemyId: string;            // 指向 EnemyDefinition.id
  stackId: string;            // 驻留所在堆（驻留即封锁该堆，10_Battle.md §2）
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  statuses: StatusEffectInstance[];  // 与玩家同一结构（02_Player.md §2.1）
  flags: Record<string, number>;     // skip_counter / 阶段切换标记等数值型临时标记
  phase: number;                     // 首领阶段索引，非首领恒 0
  alive: boolean;
}
```

约定（编码硬约束）：

1. `stackId` 由 cell 派生且整局稳定；`cards[0]` 恒为顶层，处理完即 `shift`，`fixedCards.index` 与 `cards` 下标同口径（0 = 顶层，见 06_Levels.md §3）。
2. 已移除卡牌不留在 `cards` 中（断点只需剩余序列）；历史由埋点 `card_played` 与 `resolvedCount` 还原。
3. 敌方状态与玩家共用 `StatusEffectInstance`，但分属两个容器；`vulnerable` 的乘数作用于**受击方**（10_Battle.md §4）。
4. 运行时实例由 Factory 根据关卡配置创建（见 00_Architecture.md 第 4 节数据流水线）。

## 3. 变更规则

1. 只有 EffectResolver（及其调用的各 System）可以变更 GameState。
2. 每次变更完成后发布对应事件（见 04_EventCatalog.md），UI 只通过事件刷新。
3. 每次变更后必须满足 02_Player.md 第 1 节的状态不变式。
4. 所有随机行为使用统一随机数模块（种子驱动），禁止在状态变更路径上使用无记录随机。

## 4. 快照与序列化

- 快照必须完整到可重建整局：`levelSeed + 玩家状态 + 全部卡牌堆（StackRuntime：cell/depth/reveal/剩余 cards 序列/已处理张数）+ 敌人实例（EnemyRuntime：hp/attack/defense/statuses/flags/phase）+ currentEnemyId + 装备槽 ID + 玩家状态效果 + runFlags + killedEnemyIds + turn/combo + 本局 rewardedKeys + actionSeq`（结构见 10_CodingStandards.md §4 `RunSnapshot`）。暗牌对快照透明。
- 派生属性（装备加成后的攻击力等）不入快照，读取时由装备系统重算（总规格书 3.3-D）。
- 存档结构、版本迁移与损坏回退策略见 10_CodingStandards.md 第 4 节，SaveSystem 负责执行。
