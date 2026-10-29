# 动作队列与效果流水线

> 新增章节（采纳评审建议三、四）。定义玩家操作到效果呈现的串行执行语义。AI 编码最易在此写乱，本文是权威依据。

## 1. 为什么需要 ActionQueue

一次玩家操作（例如使用炸弹）会级联出多个结果：造成伤害 → 敌人死亡 → 掉落金币 → 连击更新 → 开门条件达成 → 多段动画。这些结果**必须按序逐条执行**，不能同步一次算完：

- 否则动画重叠、飘字乱序、连击判定错位。
- 否则死亡判定与奖励发放的先后不可控（总规格书 3.3-A 的同死判定会失效）。

## 2. 动作生命周期

```text
玩家输入
  ↓ ActionResolver 校验（不合法 → 返回错误码，错误码表见 10_CodingStandards.md 第 3 节）
  ↓ 生成动作（Action）并入队
  ↓ StateMachine 进入 Resolving
  ↓ ActionQueue 逐条出队：
      执行效果 → GameState 变更 → 发布事件 → 播放对应动画/飘字
      本条动画完成（或到达 skip 阈值：队列累计演出 > 2500ms 后直接终态，数值见 03_UI/00_UiSpec.md 5.1）→ 下一条
  ↓ 队列清空 → StateMachine 进入 CheckResult
```

规则：

1. 队列执行期间新的玩家输入不产生新动作（状态机输入锁），或按设计入"下一回合缓冲"。
2. 执行前保存 GameState 快照，执行异常时回滚到快照并记录日志（总规格书 9.8）。
3. 连续快速操作由队列天然串行，杜绝重复结算（总规格书 8.6）。
4. **食物成本只跟卡牌操作走**：道具使用默认不消耗食物；仅当道具/卡牌配置了 `actionCost` 时才入队成本动作（与 01_CoreLoop.md 第 4 节"有效卡牌操作消耗食物"对齐）。

## 3. 效果定义（Effect Pipeline 配置）

每个效果是可配置的数据对象，不再只是代码分支：

```ts
interface EffectDefinition {
  type: EffectType;        // damage | heal | resource | status | flag | spawnCard | ...
  target: TargetRule;
  value?: number;
  condition?: ConditionRule;   // 执行前置条件
  trigger?: string;            // 被动触发点（如 "on_enemy_died"）；缺省为主动效果，随动作立即执行
  priority: number;            // 同一结算批次内的执行顺序，小者先
  delay?: number;              // 演出延迟（不影响逻辑，只影响动画排程）
  cancelable: boolean;         // 是否可被免疫/护盾/烟雾弹类效果取消
  repeat?: number;             // 重复次数（如灼烧 tick）
  stack?: "replace" | "add" | "max";  // 与已有同类效果叠加方式
}
```

规则：

1. 效果永远由 EffectResolver 按 `priority` 排序执行，禁止在卡牌处理器里手写执行顺序。
2. `cancelable: true` 的效果必须先经过免疫/护盾判定（总规格书 3.3-G）。
3. 连击奖励类效果 `priority` 设为最低，且**连击奖励本身不再触发连击**（总规格书 5.1）。
4. `trigger` 触发点词汇表（V1 基线，新增须先登记）：`on_card_resolved`（卡牌结算后）、`on_enemy_died`（敌人死亡）、`on_enemy_damaged`、`on_player_damaged`、`on_turn_end`（玩家行动结束）、`on_hp_threshold`（自身 HP 跨阈值，首领/召唤用）。被动效果由 EffectResolver 在对应事件提交后统一触发，不监听 EventBus。

## 4. 标准结算批次顺序

对齐总规格书 5.2 的八个时间节点，同一批次内按 priority 从小到大：

| priority | 内容 |
|---|---|
| 10 | 操作前状态检查（如 exhausted 禁止行动） |
| 20 | 行动成本结算（食物扣除） |
| 30 | 卡牌主效果（伤害/恢复/资源等） |
| 40 | 敌人反击（若敌人存活） |
| 50 | 行动结束状态效果（中毒/灼烧/再生 tick） |
| 60 | 连击与被动效果 |
| 70 | 胜负判断 |
| 80 | UI 更新事件 |

## 5. 示例：使用炸弹击杀敌人

```text
入队动作：
1. [20] 扣除食物 1          → food_changed 事件 → 数字动画（该步仅当操作配置了 actionCost；道具默认无此步）
2. [30] 对敌人造成 10 伤害   → enemy_damaged 事件 → 飘字 + 抖动
3. [30] 敌人死亡判定         → enemy_died 事件 → 死亡演出
4. [40] 敌人已死，跳过反击   （无事件）
5. [60] 连击判定            → 本例为道具操作，不计数（05_Combo.md 第 4 节：道具不触发连击）；若是卡牌击杀则 combo_updated
6. [30] 发放奖励金币         → gold_changed 事件 → 飘字
7. [70] 玩家存活检查
8. [80] 卡牌堆更新           → stack_updated 事件 → 顶层卡翻面
```

注意：编号是叙事顺序，**实际执行按 priority 排序**（30 批次先于 60/70/80），上表第 5～6 步在真实队列中会调换。

每步独立、可测试、可复现（种子驱动），也便于逐条单测（总规格书 12.1）。
