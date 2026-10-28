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
  leftStack: StackRuntime;
  rightStack: StackRuntime;
  levelId: number;
  levelSeed: number;          // 关卡随机种子，存档必须保存
  runFlags: Record<string, boolean | number>;
  killedEnemyIds: string[];   // 本局击杀记录（kill 型出口条件用，13_Exit.md 第 3 节）
  turn: number;
  combo: number;
  statusEffects: StatusEffectInstance[];
}
```

运行时实例由 Factory 根据关卡配置创建（见 00_Architecture.md 第 4 节数据流水线）。

## 3. 变更规则

1. 只有 EffectResolver（及其调用的各 System）可以变更 GameState。
2. 每次变更完成后发布对应事件（见 04_EventCatalog.md），UI 只通过事件刷新。
3. 每次变更后必须满足 02_Player.md 第 1 节的状态不变式。
4. 所有随机行为使用统一随机数模块（种子驱动），禁止在状态变更路径上使用无记录随机。

## 4. 快照与序列化

- 快照必须完整到可重建整局：`levelSeed + 玩家状态 + 双方卡牌堆 + 状态效果 + runFlags + killedEnemyIds + turn/combo`。
- 派生属性（装备加成后的攻击力等）不入快照，读取时由装备系统重算（总规格书 3.3-D）。
- 存档结构、版本迁移与损坏回退策略见 10_CodingStandards.md 第 4 节，SaveSystem 负责执行。
