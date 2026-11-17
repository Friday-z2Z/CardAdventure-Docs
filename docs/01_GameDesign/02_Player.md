# 玩家状态与状态效果

> 来源：总规格书 2.3、5.2。本文定义玩家状态字段、初始值（已补全一致性）与状态效果系统。

## 1. 玩家状态字段

| 状态 | 说明 | 主要用途 | 初始值 |
|---|---|---|---|
| HP | 当前生命值 | 判断生存和失败 | = MaxHP |
| MaxHP | 最大生命值 | 限制恢复上限 | 30 |
| Food | 食物资源 | 探索消耗与续航 | 10 |
| Gold | 金币（**局内临时资源**，双层制见 11_Resources.md §3：胜利全额转存 walletGold / 失败没收） | 局内购买、奖励及交易 | 0 |
| Shield | 护盾值 | 抵消符合规则的伤害 | 0 |
| Attack | 攻击力 | 战斗伤害 | 1 |
| Defense | 防御力 | 降低符合规则的伤害 | 0 |
| Turn | 当前行动次数 | 行动消耗和触发条件 | 0 |
| Combo | 连击计数 | 连续行动奖励 | 0 |
| StatusEffects | 状态效果列表 | 中毒、灼烧等 | [] |
| Inventory | 道具库存 | 可使用道具 | [] |
| RunFlags | 本局特殊标记 | 开门、机关条件 | {} |
| LevelId | 关卡编号 | 加载与进度保存 | 由存档决定 |

以上为原型起始值，不代表最终平衡，必须通过实测调整。

### 状态不变式（任何结算后必须成立）

- `0 ≤ HP ≤ MaxHP`
- `Food ≥ 0`、`Gold ≥ 0`、`Shield ≥ 0`
- `ProgressData.walletGold ≥ 0`（跨局货币，对局内只读；胜利转存/失败没收，11_Resources.md §3）
- `Inventory` 中每项 `quantity > 0`，数量为 0 的道具立即移除
- 同一状态效果 id 在 `StatusEffects` 中至多一条（叠加走 `stacks`）

违反不变式属于严重缺陷，需在单元测试中覆盖（见总规格书 12.2）。

## 2. 状态效果系统

### 首批状态

玩家可见的状态说明文案见 `../03_UI/02_CopyDeck.md` 第 2 节。

| id | 名称 | 机制要点 |
|---|---|---|
| poison | 中毒 | 行动结束后按 stacks 扣血 |
| burn | 灼烧 | 行动结束后扣血，不可被治疗清除 |
| weakness | 虚弱 | 本回合内玩家攻击力降低 |
| vulnerable | 易伤 | 受到的伤害增加 |
| shielded | 护盾 | 由 Shield 数值体现，优先抵消伤害 |
| regeneration | 持续恢复 | 行动结束后恢复生命 |
| exhausted | 疲劳 | 行动成本增加或无法使用部分卡牌 |

### 统一结构

```ts
interface StatusEffectInstance {
  id: string;
  duration: number;
  stacks: number;
  sourceId?: string;
}
```

### 每种状态必须定义

- 触发时间。
- 持续时间。
- 叠加方式。
- 解除方式。
- 是否可免疫。
- 是否跨关卡（默认全部不跨关卡）。
- 在玩家行动前还是后结算。

### 统一结算时间节点

1. 操作前检查。
2. 行动成本结算。
3. 卡牌主要效果。
4. 敌人反击。
5. 行动结束状态效果。
6. 连击及被动效果。
7. 胜负判断。
8. UI 更新。

若某种状态需要特殊时间点，必须通过配置明确指定，不允许在业务代码中散落硬编码。

### 2.1 宿主规则（玩家 / 敌人）

状态效果有两个宿主：玩家 `GameState.statusEffects` 与敌人 `EnemyRuntime.statuses`（02_Development/01_GameState.md §2），**同一 `StatusEffectInstance` 结构、同一 tick 路径**：

- tick 由状态系统在 priority 50 统一结算（03_ActionQueue.md §4），先玩家后敌人，顺序固定。
- `vulnerable` 属于**受击方**：玩家攻击敌人时读敌人的 vulnerable（×1.5），敌人攻击玩家时读玩家的（10_Battle.md §4）。
- `shielded` **不写入状态列表**——护盾由 `Shield` 数值体现（11_Resources.md §1），避免与"同 id 至多一条"不变式冗余冲突。
- 同名效果重复施加：`stacks` 按 §2.2 的叠加方式处理，`duration` 统一取 `max(旧, 新)`（不累加时长，防无限续）。

### 2.2 数值基线（Balance `status` 页维护，待实测校准）

| id | 触发时点 | 每层效果 | 默认时长 | 叠加方式 |
|---|---|---|---|---|
| poison | 行动结束（priority 50） | −1 HP / 层 | 3 回合 | add |
| burn | 行动结束 | −2 HP / 层；治疗不可清除 | 2 回合 | add |
| weakness | 攻击结算时 | 攻击 −1 | 1 回合 | replace（取高） |
| vulnerable | 受击结算时 | 受到伤害 ×1.5 | 1 回合 | replace |
| regeneration | 行动结束 | +2 HP（不超 MaxHP） | 3 回合 | add |
| exhausted | 成本结算（priority 20） | 本次操作食物成本 +1 | 2 回合 | replace |
