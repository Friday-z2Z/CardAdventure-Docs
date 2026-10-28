# 道具系统

> 来源：总规格书第四章。本文定义道具数据结构、使用流程与首批道具。

## 1. 系统目标

道具是风险管理工具，不是奖励图标。必须做到：

1. 获得后有明确的使用理由。
2. 与卡牌、战斗、资源规则互动。
3. 玩家在"立即获益"与"保留资源"之间必须取舍。

## 2. 数据结构

定义与库存分离：定义描述道具是什么，库存记录玩家有多少。

```ts
interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  useType: "instant" | "targeted" | "passive";
  maxStack: number;
  cooldown?: number;
  targetRule: TargetRule;
  effects: EffectDefinition[];   // 同卡牌效果流水线
  unlockLevel: number;
  enabled: boolean;
}

interface ItemInstance {
  itemId: string;
  quantity: number;
  charges?: number;
}
```

## 3. 使用流程（统一）

1. 玩家点击道具。
2. 检查道具存在。
3. 检查数量、冷却、使用条件。
4. 需要目标 → 进入目标选择状态（状态机 `ItemTargeting`，见 02_StateMachine.md）。
5. 玩家选目标 → 系统二次验证合法性。
6. 执行效果（走 ActionQueue）。
7. 效果成功提交后扣除数量（失败不扣）。
8. 结算触发效果 → 更新状态与 UI → 检查终止条件 → 保存进度。

**扣除时机统一：效果成功提交后才扣；消耗即生效的特殊道具须在配置中单独注明。**

## 4. 首批道具（MVP）

| ID | 名称 | 效果 | 使用场景 | 稀有度 |
|---|---|---|---|---|
| potion_small | 小型药剂 | 恢复 8 HP | 低生命值 | common |
| potion_large | 大型药剂 | 恢复 18 HP | 高风险战斗后 | uncommon |
| bomb | 爆破炸弹 | 对目标敌人造成 10 伤害 | 快速削弱敌人 | uncommon |
| shield_scroll | 护盾卷轴 | 获得 8 护盾 | 应对高伤害敌人 | uncommon |
| ration | 应急口粮 | 恢复 5 食物 | 食物不足 | common |
| poison_cure | 解毒药剂 | 解除中毒 | 中毒时 | common |
| smoke_bomb | 烟雾弹 | 当前敌人跳过反击一次 | 应对强敌 | rare |
| gold_magnet | 聚财符 | 本关后续金币奖励 +25% | 金币收益策略 | rare |
| key | 古旧钥匙 | 开启对应锁门 | 机关或出口条件 | uncommon |
| luck_charm | 幸运护符 | 本关一次奖励提升 | 奖励策略 | rare |

注意：数值非最终平衡结论；道具必须有明确稀有度、获取途径和解锁关卡；不能一种道具解决所有问题；高级道具必须稀缺；效果必须走效果引擎。**玩家可见的道具介绍文案见 `../03_UI/02_CopyDeck.md` 第 1 节。**

被动类道具（gold_magnet、luck_charm）的生效点与具体倍率由 Balance 表配置：在奖励发放动作（ActionQueue priority 30）中结算，效果通过 `trigger` 字段声明被动触发点（03_ActionQueue.md 第 3 节），不修改奖励系统代码。luck_charm 的"一次提升"幅度在 Balance 表中定义为固定值（原型 +50%，只对下一次奖励生效）。

## 5. 经济闭环

**来源**：普通卡牌奖励、精英敌人、宝箱、商店、关卡结算、特殊任务、永久解锁。

**消耗场景**：高风险战斗、资源不足、状态解除、特殊机关、关卡目标、关键战斗。

**平衡原则**：

- 普通道具经常获得、经常使用。
- 稀有道具创造重要决策。
- 不允许玩家必须持有某稀有道具才能过普通关卡；关卡必须考虑"没有该道具"的情况。
- 关卡若需特定道具，必须提供可验证的获取路径（关卡验证器检查，见 06_DataBalance.md 第 2 节 ItemValidator / LevelValidator）。
