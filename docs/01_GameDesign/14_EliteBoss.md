# 精英与首领详设

> 补全章节。06_Levels.md 与 09_BalanceBaseline.md 只给了数值倍率，本文定义精英/首领的构成规则、机制模板与设计红线。

## 1. 精英敌人（阶段三起）

| 项 | 规则 |
|---|---|
| 构成 | 普通敌人定义 ×数值倍率 1.5～2 + **恰好一个**特殊机制（03_Cards.md 效果配置实现） |
| 标记 | 配置 `elite: true`；UI 卡牌加金色角标（ColorPrimary） |
| 奖励 | 普通奖励 ×2 或道具 ×1（09_BalanceBaseline.md 第 5 节） |
| 可解性 | 特殊机制必须有对应交互手段，由 LevelValidator 模拟确认 |

首批精英机制池（均用现有 EffectType 可表达）：

1. **再生**：每回合未受击恢复 2 HP（trigger: on_turn_end）。
2. **反击强化**：玩家未一击造成 ≥5 伤害时，反击 +1。
3. **荆棘**：玩家攻击时自受 1 点伤害（cancelable 走护盾路径）。
4. **召唤**：HP 首次 ≤50% 时 spawnCard 一只基础敌人入堆顶。

## 2. 首领（固定关专属）

| 项 | 规则 |
|---|---|
| 分布 | 阶段三起每阶段末 1～2 个；组合型（阶段四）、主题多阶段（阶段五） |
| 生产 | **只能固定关**，人工设计 + 人工通关验证记录（06_Levels.md 第 5 节） |
| 数值 | 09_BalanceBaseline.md 第 4 节阶段五行；数值封顶，难度靠机制 |
| 结构 | 首领战使用独立卡牌堆配置（leftStackConfig/rightStackConfig），堆内容由关卡配置固定序列 |

### 多阶段机制模板

```ts
interface BossPhase {
  hpThreshold: number;            // HP 低于该百分比切换下一阶段（如 0.5）
  modifiers: EffectDefinition[];  // 本阶段生效的被动（trigger 声明触发点）
  announce: string;               // 切换时向玩家公示的提示文案（必须配置）
}
```

- 阶段切换是 priority 30 的 flag 型效果；切换时清空本阶段遗留 tick，并发 `boss_phase_changed` 事件（登记进 04_EventCatalog.md）。
- 每阶段 modifiers ≤ 2 个；单个首领 modifiers 池 ≤ 6 个（防机制堆叠不可读）。

### 设计红线（06_Levels.md 第 2 节的具体化）

1. **提示**：入场面板列出首领全部阶段与关键机制；每次机制生效前有 1 个行动的预告演出。
2. **应对**：每个机制至少存在一条不依赖特定稀有道具的解法（LevelValidator 用基础策略集验证）。
3. **无必败**：纯随机不可导致必然死亡；失败必须可归因于玩家决策。
4. **复现**：首领关种子固定，同种子同布局同行为（06_DataBalance.md 第 4 节随机数规范）。
