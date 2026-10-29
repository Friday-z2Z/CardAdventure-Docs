# 卡牌系统设计

> 来源：总规格书第三章。本文定义卡牌分类、统一数据结构与各类卡的处理规则。

## 1. 卡牌分类（10 类）

敌人、资源、恢复、装备、道具、事件、陷阱、机关、出口、特殊机制。

**卡牌类型只用于分类与表现，不直接决定全部行为。** 例如敌人卡统一走战斗处理器，但每个敌人的机制由效果配置表现。

## 2. 统一数据结构

```ts
interface CardDefinition {
  id: string;
  name: string;
  type: CardType;              // enemy | resource | healing | equipment | item | event | trap | mechanism | exit | special
  rarity: CardRarity;          // common | uncommon | rare | epic | legendary
  description: string;
  iconKey: string;
  baseValue?: number;
  effects: EffectDefinition[]; // 见 ../02_Development/03_ActionQueue.md
  tags: string[];
  targetRule: TargetRule;
  actionCost: ActionCostDefinition;
  unlockLevel: number;
  enabled: boolean;
}
```

效果、目标、成本和稀有度拆成独立类型，禁止无限扩展的万能字段。所有卡牌进入 06_DataBalance.md 的数据流水线（Loader → Validator → Registry → Factory）。

### 配套类型（MVP 编码前定稿）

```ts
type CardType = "enemy" | "resource" | "healing" | "equipment" | "item"
              | "event" | "trap" | "mechanism" | "exit" | "special";

type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

type EffectType = "damage" | "heal" | "resource" | "status" | "flag"
                | "spawnCard" | "transformStack";

type TargetRule =
  | "self"              // 玩家自身
  | "enemy_current"     // 当前交战敌人
  | "enemy_all"         // 场上全部敌人（如有多敌关）
  | "stack_top:<side>"  // 某一侧卡牌堆顶层（transformStack 类）
  | `flag:${string}`;   // 机关/出口条件标记

interface ActionCostDefinition {
  food: number;         // 本次操作的 Food 消耗，0 = 不消耗
  exempt: boolean;      // true = 免除本次全局食物消耗（特殊卡）
}

interface ConditionRule {
  flag?: string;                    // 需要 runFlag 已激活
  minResource?: { food?: number; gold?: number };
  statusAbsent?: string;            // 需要不存在某状态（如非疲劳）
}
```

`EffectDefinition` 的完整定义见 `../02_Development/03_ActionQueue.md`（含 trigger/priority/cancelable）。

## 3. 各类卡处理规则

### A. 敌人卡

字段：EnemyId、HP、Attack、Defense、SpecialEffects、RewardGold、RewardFood、RewardItem、DifficultyTier。

处理：玩家选卡 → 计算有效伤害 → 存活则反击 → 死亡发放奖励 → 处理死亡/击杀/连击触发 → 检查玩家死亡。

伤害公式（原型）：

```text
玩家对敌人伤害 = max(1, 玩家攻击力 + 技能加成 - 敌人防御力)
敌人对玩家伤害 = max(0, 敌人攻击力 - 玩家防御力)
```

护盾优先抵消伤害。同死判定顺序：先处理本次攻击 → 判定敌人死亡 → 已死不反击 → 存活才反击 → 最后统一检查玩家状态（ActionQueue 中由 priority 保证，见 03_ActionQueue.md 第 4 节）。

### B. 资源卡

字段：ResourceType、Amount、MinAmount、MaxAmount、BonusConditions。流程：检查上限 → 增加资源 → 触发获取效果 → 刷新 UI → 移除卡牌。**不能直接改 UI 数字，必须先改状态再通知 UI。**

### C. 恢复卡

字段：HealAmount、CleanseEffects、RemovePoison、RemoveBurn、OptionalShield。

```text
最终生命值 = min(MaxHP, 当前生命值 + 恢复量)
```

超上限部分不保留，除非特殊卡明确允许临时上限变化。

### D. 装备卡

槽位：武器（攻击）、护甲（防御）、饰品（特殊触发）、消耗型装备。

```ts
interface EquipmentDefinition {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: CardRarity;
  passiveEffects: EffectDefinition[];
  description: string;
}
```

规则：相同槽位只能装一件；替换时先移除旧属性再应用新属性；属性不重复累计；存档只存装备 ID，派生属性由装备系统重算。装备**不入背包**（Inventory 只存道具）——局内临时资源，关末消失（11_Resources.md §3；展示位见 03_UI/03_Screens.md 2.1 装备槽）。

派生属性公式：`有效攻击 = 基础 Attack + Σ(武器与饰品攻击类加成)`，防御同理；饰品被动（如 eq_wolf_fang 的击杀加金）通过 EffectDefinition 的 `trigger` 字段声明触发点，不改奖励系统代码。战斗中公式的套用位置见 10_Battle.md 第 4 节。

### E. 道具卡

提供一次性或有限次数效果，通过卡牌/商店/奖励获得。使用规则见 `04_Items.md`。

### F. 事件卡

神秘商人、宝箱、祭坛、休息点、赌局、随机事件。必须走统一事件处理器；**事件选项由配置定义，不允许在 UI 点击回调中写资源修改逻辑。**选项提交并入队结算：结算成功即有效卡牌操作，计入连击（+1，05_Combo.md 规则）；弹窗内取消不计。

### G. 陷阱卡

固定伤害、按比例伤害、中毒、灼烧、扣食物、耗金币、触发机关。陷阱效果应允许护盾、防御、免疫、解除状态等机制交互（`cancelable: true`）。

### H. 机关卡

开锁门、激活传送点、解除封锁、关闭陷阱、触发隐藏奖励。通过 `runFlags` 记录激活状态（见 01_GameState.md）。

### I. 出口卡

接触出口 → 检查通关条件 → 满足进结算；不满足提示缺什么。可能条件：击败指定敌人、收集钥匙、激活机关、获得目标物品、支付金币。基础关卡可直接寻找出口。出口判定是**只读检查，不进 ActionQueue**：不消耗食物、不计连击、不触发演出锁（13_Exit.md 第 2 节）。

### J. 特殊机制卡

改变堆顺序、复制卡牌、封锁一侧、交换顶层、修改本关规则/消耗。必须经规则引擎处理，禁止任意修改其他系统内部状态。
