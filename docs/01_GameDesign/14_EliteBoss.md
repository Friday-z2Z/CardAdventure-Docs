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
5. **盘面干扰**：每 3 回合对随机一堆执行 `transformStack`（`shuffle` 或 `swapTop`），或封锁一堆——让走位参与解题（2026-11-18 新增，与 matrix5 盘面联动）。

**首批选型（2026-11-18 定）**：取「再生」+「荆棘」——两者零新增结构、与护盾/治疗互动强；「反击强化」「召唤」留作阶段四扩展。

## 2. 首领（固定关专属）

| 项 | 规则 |
|---|---|
| 分布 | 阶段三起每阶段末 1～2 个；组合型（阶段四）、主题多阶段（阶段五） |
| 生产 | **只能固定关**，人工设计 + 人工通关验证记录（06_Levels.md 第 5 节） |
| 数值 | 09_BalanceBaseline.md 第 4 节阶段五行；数值封顶，难度靠机制 |
| 结构 | 首领战使用 matrix5 盘内钉位：`stacks[].cell` 指定占格 + `fixedCards` 固定序列（06_Levels.md §3），堆内容由关卡配置写死 |

### 多阶段机制模板

```ts
interface BossPhase {
  hpThreshold: number;            // 进入该阶段的 HP 百分比下限；entry[0] 固定 1.0 = 初始阶段
  modifiers: EffectDefinition[];  // 本阶段生效的被动（trigger 声明触发点）
  announce: string;               // 切换时向玩家公示的提示文案（必须配置）
}
```

- 阶段切换是 priority 30 的 flag 型效果；切换时清空本阶段遗留 tick，并发 `boss_phase_changed` 事件（登记进 04_EventCatalog.md）。
- 每阶段 modifiers ≤ 2 个；单个首领 modifiers 池 ≤ 6 个（防机制堆叠不可读）。

### 首个首领样例：沉水守卫（`boss_drowned_warden`）

| 项 | 值 |
|---|---|
| 关卡 | `level_0180`（阶段三末，固定关，`generationSeed` 必填） |
| 数值 | HP **18** / ATK **3** / DEF **2**（阶段三 baseline 上浮，基线待实测；落 Balance `enemies`，`boss: true`） |
| 阶段 1（100%～50%） | **荆棘**：玩家每次攻击自受 1 点伤害（`cancelable`，走护盾） |
| 阶段 2（≤50%） | **再生 + 潮涌**：回合末回 2 HP；每 3 回合打乱随机一堆顺序（`transformStack.shuffle`，提前 1 回合预告） |
| announce | P1 `boss_drowned_warden_enter`、P2 `boss_drowned_warden_phase2`、潮涌预告 `boss_drowned_warden_surge`（CopyDeck §10） |
| 反制 | 护盾/减伤抵消荆棘；炸弹打单次大伤害减少触发次数；再生需连续输出压过回血；潮涌会打乱堆序，关键出口堆优先处理或留火把侦察 |
| 配置形态 | `bossConfig: [{ hpThreshold: 1.0, modifiers: [荆棘], announce: key1 }, { hpThreshold: 0.5, modifiers: [再生, 潮涌], announce: key2 }]`，`entry[0]` 为初始阶段 |
| 提示要求 | 入场横幅列出两阶段与关键机制；P2 切换前 1 个行动给预告演出（设计红线 1） |

设计意图：阶段一惩罚"多段小伤害"（高频攻击），阶段二惩罚"输出断档"——两个阶段分别用护盾与爆发解题，避免单一最优打法。

### 设计红线（06_Levels.md 第 2 节的具体化）

1. **提示**：入场面板列出首领全部阶段与关键机制；每次机制生效前有 1 个行动的预告演出。
2. **应对**：每个机制至少存在一条不依赖特定稀有道具的解法（LevelValidator 用基础策略集验证）。
3. **无必败**：纯随机不可导致必然死亡；失败必须可归因于玩家决策。
4. **复现**：首领关种子固定，同种子同布局同行为（06_DataBalance.md 第 4 节随机数规范）。
