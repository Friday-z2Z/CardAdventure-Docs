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
  rarity: CardRarity;          // common | uncommon | rare | epic | legendary（V1 禁止 legendary）
  description: string;
  iconKey: string;
  enemyId?: string;            // 仅 type === "enemy"：指向 EnemyDefinition.id
  baseValue?: number;
  effects: EffectDefinition[]; // 见 ../02_Development/03_ActionQueue.md
  tags: string[];
  targetRule: TargetRule;
  actionCost: ActionCostDefinition;
  options?: EventOptionDefinition[];  // 仅 type === "event" 使用，≥1 且 id 唯一
  unlockLevel: number;
  enabled: boolean;
}
```

效果、目标、成本和稀有度拆成独立类型，禁止无限扩展的万能字段。所有卡牌进入 06_DataBalance.md 的数据流水线（Loader → Validator → Registry → Factory）。

**稀有度语义（2026-11-18 定）**：

- `legendary` **V1 启用，但只允许固定来源**：不进入商店货池、不进入随机奖励权重池；只能通过"通关成就 / 首领关钉位"获得，配置时必须登记来源（`CardValidator` / `ItemValidator` 检查）。
- **非装备卡**的稀有度仅用于**卡面展示、图鉴配色与奖励权重**，不影响数值、掉率系数或战斗表现；稀有度 ≠ 强度，强度由 `threat` 与数值列决定。
- **装备**的稀有度唯一影响词条数量（`03_Cards.md` §3-D：common 1 / uncommon 2 / rare 2 / epic 3）。
- **道具**的稀有度影响商店抽取权重、价格区间与图鉴展示（`16_Shop.md` §2～§3、`09_BalanceBaseline.md` §5）；**传奇道具不入店、不进随机奖励池**，只能由成就等固定来源发放。

### 配套类型（MVP 编码前定稿）

```ts
type CardType = "enemy" | "resource" | "healing" | "equipment" | "item"
              | "event" | "trap" | "mechanism" | "exit" | "special";

type CardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

type EffectType = "damage" | "heal" | "resource" | "status" | "flag"
                | "spawnCard" | "transformStack" | "reveal" | "buff";

type TargetRule =
  | "self"              // 玩家自身
  | "enemy_current"     // 当前交战敌人
  | "enemy_all"         // 场上全部敌人（如有多敌关）
  | "stack_top:<stackId>"  // 指定堆（stackId/cell 定位）顶层（transformStack 类）
  | `flag:${string}`;   // 机关/出口条件标记

interface ActionCostDefinition {
  food: number;         // 本次操作的 Food 消耗，0 = 不消耗
  exempt: boolean;      // true = 免除本次全局食物消耗（特殊卡）；同时也免 exhausted 的成本加成
}

interface ConditionRule {
  flag?: string;                    // 需要 runFlag 已激活
  minResource?: { food?: number; gold?: number };
  shieldAtLeast?: number;           // 玩家当前护盾 ≥ N（灰烬幽魂等条件伤害用）
  statusAbsent?: string;            // 需要不存在某状态（如非疲劳）
}

interface EventOptionDefinition {   // 事件卡选项（CardDefinition.options）
  id: string;                       // 事件内唯一
  textKey: string;                  // CopyDeck key（02_CopyDeck.md §8）
  cost?: { food?: number; gold?: number; itemId?: string; quantity?: number };
  condition?: ConditionRule;        // 不满足 → 选项置灰并提示，不允许静默失败
  effects: EffectDefinition[];      // 选中后的效果，走 ActionQueue
  successFlag?: string;             // 结算成功写入的 runFlag（如祭坛/机关联动）
}
```

事件选项约束：

- 提交才生成 `event_option` Action（03_ActionQueue.md §3）；取消不入队、不计连击（05_Combo.md §4）。
- 支付类选项先校验成本再入队，不足回 `NOT_ENOUGH_GOLD` / `NOT_ENOUGH_FOOD`，留在弹窗。
- CardValidator 检查：`type === "event"` 时 `options` 非空、id 唯一、`textKey` 已登记、`effects` 可解析（06_DataBalance.md §2）。

### 敌人定义（EnemyDefinition）

```ts
interface EnemyDefinition {
  id: string;                     // enemy_xxx
  name: string;
  hp: number;
  attack: number;
  defense: number;
  skillBonus?: number;            // 敌方技能加成，进 10_Battle.md §4 公式，缺省 0
  elite?: boolean;                // 精英标记（14_EliteBoss.md §1）
  boss?: boolean;
  rewardGold?: { min: number; max: number };
  rewardFood?: number;
  rewardItem?: { itemId: string; chance: number }[];
  effects?: EffectDefinition[];   // 特殊机制（再生/荆棘/召唤），用 trigger 声明触发点
  threat: number;                 // 09_BalanceBaseline.md §8
  tags: string[];
  unlockLevel: number;
  enabled: boolean;
}
```

- 敌人是**配置实体**，同时被敌人卡（`type: "enemy"`）与 `spawnCard` 效果引用；公共字段（id/type/version/createdAt/updatedAt/author）见 06_DataBalance.md §1。
- 数值落在 Balance `enemies` sheet，本结构只描述字段；`threat` 必填，供 DIFF 的 C 因子使用。

`EffectDefinition` 的完整定义见 `../02_Development/03_ActionQueue.md`（含 trigger/priority/cancelable 与参数 schema）。

## 3. 各类卡处理规则

### A. 敌人卡

字段：卡面只保留 `enemyId`（指向 EnemyDefinition）与名称/稀有度/图标；HP、Attack、Defense、奖励、特殊机制（SpecialEffects）一律读 `EnemyDefinition`，不在卡上重复配置。

处理：玩家选卡 → 计算有效伤害 → 存活则反击 → 死亡发放奖励 → 处理死亡/击杀/连击触发 → 检查玩家死亡。

伤害公式（原型，**完整版与落地顺序以 10_Battle.md 第 4 节为权威**，本节只给摘要）：

```text
玩家有效攻击 = max(1, 攻击力(含装备) + 技能加成 - weakness 减攻)
玩家对敌人伤害 = max(1, 玩家有效攻击 - 敌人防御力) × (受击方 vulnerable ? 1.5 : 1)
敌人有效攻击 = 敌人攻击力 + 敌人技能加成
敌人对玩家伤害 = max(0, 敌人有效攻击 - 玩家防御力(含装备))
```

护盾优先抵消伤害，落地顺序恒为"先算减免 → 再抵护盾 → 最后扣血"。同死判定顺序：先处理本次攻击 → 判定敌人死亡 → 已死不反击 → 存活才反击 → 最后统一检查玩家状态（ActionQueue 中由 priority 保证，见 03_ActionQueue.md 第 4 节）。

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

规则：相同槽位只能装一件；替换时先移除旧属性再应用新属性；属性不重复累计；存档只存装备 ID，派生属性由装备系统重算。**替换入口只有一个**——翻到同槽位新装备卡时自动替换；装备槽点击只弹 Tooltip，不支持主动卸下或空手切换（避免把"换装"变成无成本操作）。

**词条（affix）规则（2026-11-18 修订）**：装备被动按稀有度给词条数——**common 1 条、uncommon 2 条、rare 2 条、epic 3 条、legendary 3 条 + 1 条唯一词条**；rare 不靠数量堆叠，而是允许**强化版词条**（如「坚壁」在 rare 上为首次受击 −2）。全部走 `passiveEffects`（`trigger` 声明触发点），不新增系统。首批词条池：

| 词条 | 效果 | 可用槽位 |
|---|---|---|
| 攻势 | 攻击 +1 | 武器 / 饰品 |
| 守势 | 防御 +1 | 护甲 / 饰品 |
| 猎金 | 击杀 +1 金币（`on_enemy_died`） | 武器 / 饰品 |
| 坚壁 | 每关首次受击 −1 伤害（`on_player_damaged`，cancelable） | 护甲 |
| 破竹 | 对满血敌人 +1 伤害（`on_card_resolved`） | 武器 |
| 回春 | 每 3 回合回复 1 HP（`on_turn_end`） | 饰品 |
| 反震 | 受击时对攻击者造成 1 伤害（`on_player_damaged` → `enemy_current`） | 护甲 / 饰品 |
| 坚韧 | 本关 MaxHP +2（`buff`，到期复原） | 护甲 / 饰品 |
| 乘胜 | 击杀后本回合攻击 +1（`on_enemy_died`，`buff` 1 回合） | 武器 / 饰品 |
| 终末（唯一） | 击杀后回复 2 HP（`on_enemy_died`）；**唯一词条，仅 legendary 可用** | 武器 / 饰品 |

现有三件装备按新规则补齐：`eq_rusty_sword`（攻势）、`eq_leather_armor`（守势）、`eq_wolf_fang`（猎金 + 破竹，uncommon 2 条）。

**跨关规则（修订，取代"全部关末消失"）**：武器与护甲仍是局内临时资源、关末消失；**饰品跨关保留 1 件**，存 `ProgressData.equippedTrinket`，进关自动装备，通关与失败都不丢；拾到新饰品时替换并**丢弃旧饰品**（无返还）。装备**不入背包**（Inventory 只存道具）——局内临时资源，关末消失（11_Resources.md §3；展示位见 03_UI/03_Screens.md 2.1 装备槽）。

派生属性公式：`有效攻击 = 基础 Attack + Σ(武器与饰品攻击类加成)`，防御同理；饰品被动（如 eq_wolf_fang 的击杀加金）通过 EffectDefinition 的 `trigger` 字段声明触发点，不改奖励系统代码。战斗中公式的套用位置见 10_Battle.md 第 4 节。

### E. 道具卡

提供一次性或有限次数效果，通过卡牌/商店/奖励获得。使用规则见 `04_Items.md`。

### F. 事件卡

神秘商人、宝箱、祭坛、休息点、赌局、随机事件。必须走统一事件处理器；**事件选项由配置定义，不允许在 UI 点击回调中写资源修改逻辑。**选项提交并入队结算：结算成功即有效卡牌操作，计入连击（+1，05_Combo.md 规则）；弹窗内取消不计。**取消后事件卡保留在堆顶**（可再次点开），不消耗食物、不入队，也不视为一次操作。

### G. 陷阱卡

固定伤害、按比例伤害、中毒、灼烧、扣食物、耗金币、触发机关。陷阱效果应允许护盾、防御、免疫、解除状态等机制交互（`cancelable: true`）。

### H. 机关卡

开锁门、激活传送点、解除封锁、关闭陷阱、触发隐藏奖励。通过 `runFlags` 记录激活状态（见 01_GameState.md）。

### I. 出口卡

接触出口 → 检查通关条件 → 满足进结算；不满足提示缺什么。可能条件：击败指定敌人、收集钥匙、激活机关、获得目标物品、支付金币。基础关卡可直接寻找出口。出口判定是**只读检查，不进 ActionQueue**：不消耗食物、不计连击、不触发演出锁（13_Exit.md 第 2 节）。

### J. 特殊机制卡

改变堆顺序、复制卡牌、封锁单堆、交换顶层、修改本关规则/消耗。必须经规则引擎处理，禁止任意修改其他系统内部状态。

## 4. 首批卡牌清单（23 张）

> 本表是**结构索引**：id / 名称 / 类型 / 稀有度用于配置与图鉴核对；**数值与玩家可见说明以 `07_CardCatalog.md` 为准**，改数值只走 Balance、改文案只走 07 与 CopyDeck，本表随卡池增删同步更新。

**通用规则（表中省略，统一按此执行）**：

- **敌人卡**：结算后若存活 → 驻留并封锁该堆，并在 priority 40 反击一次；同死判定见 §3-A（先判定敌人死亡，已死不反击）。
- **伤害**：先减免 → 再抵护盾 → 最后扣血（10_Battle.md §4）；陷阱默认挡盾不穿甲。
- **状态**：默认数值见 02_Player.md §2.2（毒 1 HP/层·3 回合、灼烧 2 HP/层·2 回合、易伤 ×1.5、再生 +2/回合）。
- **资源与治疗**：一律走 ResourceSystem，超上限截断、治疗溢出丢弃，变更必发对应 `*_changed` 事件。
- **装备**：同槽替换、旧件直接丢弃；词条触发点见 §3-D 词条表。
- **事件**：选项提交才入队并计连击，取消不入队、不计连击、保留卡牌。
- **结算**：全部效果入 ActionQueue 按 priority 分批，UI 只做表现，不参与判定。

| id | 名称 | 类型 | 稀有度 | 效果明细（基线） | 引入 |
|---|---|---|---|---|---|
| `enemy_rat_01` | 穴居鼠 | enemy | common | HP 2 / ATK 1 / DEF 0；击杀奖励金币 1 | 一 |
| `enemy_slime_01` | 软泥怪 | enemy | common | HP 3 / ATK 1 / DEF 0；击杀奖励金币 2 | 一 |
| `enemy_bat_01` | 洞穴蝙蝠 | enemy | common | HP 2 / ATK 2 / DEF 0；击杀奖励金币 2 | 一 |
| `enemy_goblin_01` | 哥布林斥候 | enemy | uncommon | HP 4 / ATK 2 / DEF 0；击杀奖励金币 3 + 食物 1 | 一 |
| `enemy_skeleton_01` | 骸骨兵 | enemy | uncommon | HP 5 / ATK 2 / DEF 1；击杀奖励金币 4 | 一 |
| `res_gold_pouch` | 鼓胀钱袋 | resource | common | 金币 +3～5（`valueRange`，超 `goldCap` 截断） | 一 |
| `res_food_cache` | 补给包 | resource | common | 食物 +2～3（超 `foodCap` 截断） | 一 |
| `res_treasure` | 尘封宝箱 | resource | uncommon | 金币 +5～8 | 一 |
| `heal_herb` | 疗伤草药 | healing | common | 恢复 6 HP（不超 MaxHP，溢出丢弃） | 一 |
| `heal_salve` | 治疗药剂 | healing | uncommon | 恢复 12 HP（同上） | 一 |
| `cleanse_herb` | 清净草 | healing | uncommon | 解除 `poison`；对 `burn` 无效（灼烧治疗不可清除） | 一 |
| `eq_rusty_sword` | 砍钝的短剑 | equipment | common | 武器槽；攻击 +1（词条「攻势」）；替换旧武器不返还 | 一 |
| `eq_leather_armor` | 旧皮甲 | equipment | common | 护甲槽；防御 +1（词条「守势」） | 一 |
| `eq_wolf_fang` | 狼牙吊坠 | equipment | uncommon | 饰品槽；击杀 +1 金币（「猎金」，`on_enemy_died`）+ 对满血敌人 +1 伤害（「破竹」，`on_card_resolved`）；**跨关保留** | 一 |
| `trap_spikes` | 尖刺陷阱 | trap | common | 4 点伤害：`ignoreDefense=false`（受防御减免）、`blockedByShield=true`（盾先抵）、`cancelable` | 一 |
| `trap_gas` | 毒气陷阱 | trap | common | 施加 `poison` 2 层（每层每回合 −1 HP，持续 3 回合，priority 50 结算） | 一 |
| `evt_campfire` | 熄灭的营地 | event | common | 选项 A：恢复 4 HP；选项 B：食物 +2；提交才入队，取消保留卡 | 一 |
| `evt_cursed_chest` | 诅咒宝箱 | event | common | 选项 A：金币 +8 并施加 `poison` 2 层；选项 B：放弃（无效果） | 一 |
| `evt_shrine` | 古老祭坛 | event | uncommon | 支付 2 食物 → 恢复 8 HP；食物不足回 `NOT_ENOUGH_FOOD` 并留在弹窗 | 一 |
| `evt_merchant` | 流浪商人 | event | uncommon | 3 格货单（6 种货、基价 3～8、阶段系数 1.0～1.8）；只收局内金币；交易或关闭后移除 | 一 |
| `mech_lever` | 生锈拉杆 | mechanism | common | 写 `runFlags.door_opened = true`；不消耗道具 | 一 |
| `mech_lock_door` | 上锁的石门 | mechanism | uncommon | 消耗 `key` ×1 → 写 `runFlags.door_unlocked = true`；无钥匙时置灰并提示缺口 | 一 |
| `exit_door` | 刻纹石门 | exit | common | 读关卡 `ExitRule`：满足 → `level_completed`；不满足 → Toast 列缺口（只读，不耗食物、不计连击） | 一 |

**统计**：敌人 5 / 资源 3 / 恢复 3 / 装备 3 / 陷阱 2 / 事件 4 / 机关 2 / 出口 1 = **23 张**，全部属于阶段一 MVP 卡池。

> 已设计但**未计入** MVP 23 张：`spec_reverse_stack`（倒流的沙漏，special / rare，阶段四引入，效果与校验规则见 `07_CardCatalog.md` §6「特殊机制卡最小验证」）。

## 5. 全旅程扩展卡池（64 张，阶段二～五）

> 与 §4 合计 **87 张**。威胁值（threat）统一按 `ATK + HP×0.25 + DEF×0.5` 计算，导出时写入 Balance；道具/事件/机关卡 threat 为 0 或负值。说明文案随内容生产逐张登记（TBD-06），本表先冻结结构、数值与效果。

### 阶段二（8 张，theme2_spore_depths）

| id | 名称 | 类型 | 稀有度 | 效果明细（基线） |
|---|---|---|---|---|
| `enemy_sporeling_01` | 孢子幼体 | enemy | common | HP 4 / ATK 2 / DEF 0；+2 金币；命中后玩家中毒 1 层 |
| `enemy_myconid_01` | 菌人 | enemy | uncommon | HP 5 / ATK 2 / DEF 1；+3 金币；死亡时玩家中毒 1 层 |
| `enemy_cave_spider_01` | 洞穴蛛 | enemy | uncommon | HP 6 / ATK 2 / DEF 0；+3 金币；命中后虚弱 1 回合 |
| `enemy_moss_hound_01` | 苔藓猎犬 | enemy | uncommon | HP 7 / ATK 3 / DEF 0；+4 金币；首次受击后攻击 +1 |
| `trap_spore_cloud` | 孢子云 | trap | uncommon | 中毒 2 层 + 虚弱 1 回合（状态类，不受护盾抵消、`cancelable`） |
| `evt_mushroom_ring` | 蘑菇圈 | event | common | 二选一：食物 +4 / 恢复 6 HP |
| `eq_hunting_bow` | 猎弓 | equipment | uncommon | 武器：攻击 +1（词条：破竹 + 猎金） |
| `eq_moss_cloak` | 苔甲 | equipment | uncommon | 护甲：防御 +1（词条：坚壁 + 守势） |

### 阶段三（17 张，theme3_drowned_crypt）

| id | 名称 | 类型 | 稀有度 | 效果明细（基线） |
|---|---|---|---|---|
| `enemy_drowned_01` | 溺亡者 | enemy | common | HP 8 / ATK 3 / DEF 1；+4 金币 |
| `enemy_grave_warden_01` | 守墓石像 | enemy | uncommon | HP 10 / ATK 2 / DEF 2；+5 金币；每 3 回合回复 1 HP |
| `enemy_bone_archer_01` | 骨弓手 | enemy | uncommon | HP 7 / ATK 4 / DEF 0；+4 金币 |
| `elite_spore_matriarch` | 孢子母体 | enemy（精英） | rare | HP 14 / ATK 3 / DEF 1；+8 金币或道具 ×1；再生 2/回合 |
| `elite_drowned_knight` | 溺亡骑士 | enemy（精英） | rare | HP 16 / ATK 4 / DEF 2；+10 金币；荆棘 1 |
| `boss_drowned_warden` | 沉水守卫 | enemy（首领） | epic | HP 18 / ATK 3 / DEF 2；P1 荆棘、P2 再生 + 潮涌（14_EliteBoss.md §2） |
| `heal_big_salve` | 高级治疗药剂 | healing | rare | 恢复 18 HP |
| `heal_spring` | 涌泉 | healing | uncommon | 恢复 15 HP 并解除中毒 |
| `eq_silver_blade` | 银刃 | equipment | rare | 武器：攻击 +2（词条：破竹 + 猎金） |
| `eq_scale_mail` | 鳞甲 | equipment | rare | 护甲：防御 +2（词条：坚壁 + 守势） |
| `eq_grave_ring` | 墓环 | equipment | rare | 饰品：击杀回复 1 HP（词条：回春 + 猎金） |
| `eq_assassin_dagger` | 刺客匕首 | equipment | rare | 武器：攻击 +1（词条：乘胜 + 猎金） |
| `trap_water_pit` | 深水池 | trap | common | 失去 2 食物（资源损失，不受护盾/防御影响） |
| `trap_cursed_seal` | 黑符石 | trap | uncommon | 2 点伤害 + 易伤 1 回合 |
| `evt_drowned_altar` | 沉水祭坛 | event | uncommon | 支付 3 金币 → 恢复 8 HP；可离开 |
| `mech_gate_chain` | 双联铁闸 | mechanism | uncommon | 写 `runFlags.gate_a`；与 `gate_b` 同为 AND 出口条件 |
| `mech_water_valve` | 水阀 | mechanism | common | 写 `runFlags.water_drained`（供出口/事件条件） |

### 阶段四（24 张，theme4_ashen_spire）

| id | 名称 | 类型 | 稀有度 | 效果明细（基线） |
|---|---|---|---|---|
| `enemy_ash_wraith_01` | 灰烬幽魂 | enemy | uncommon | HP 9 / ATK 4 / DEF 1；+5 金币；玩家有护盾时伤害 +1 |
| `enemy_cinder_knight_01` | 烬火骑士 | enemy | rare | HP 12 / ATK 4 / DEF 2；+6 金币 |
| `enemy_flame_priest_01` | 焰祭司 | enemy | rare | HP 10 / ATK 3 / DEF 1；+6 金币；每 3 回合回复 2 HP |
| `boss_ashen_colossus` | 灰烬巨像 | enemy（首领） | epic | HP 24 / ATK 5 / DEF 3；P1 荆棘、P2 召唤（HP ≤50% 召唤 1 敌） |
| `boss_cinder_witch` | 烬火女巫 | enemy（首领） | epic | HP 22 / ATK 6 / DEF 1；P1 再生、P2 盘面干扰（每 3 回合 shuffle 一堆） |
| `res_soul_ember` | 余烬灯 | resource | uncommon | 金币 +10～15 |
| `res_star_shard` | 星屑 | resource | rare | 食物 +4～5 且金币 +3～5 |
| `eq_ember_sword` | 烬火剑 | equipment | rare | 武器：攻击 +3（词条：破竹 + 猎金） |
| `eq_warden_cloak` | 守望披风 | equipment | rare | 护甲：防御 +2（词条：坚壁（强化：首次受击 −2）+ 守势） |
| `eq_molten_ring` | 熔火指环 | equipment | rare | 饰品：受击时对攻击者造成 1 伤害（词条：回春 + 猎金） |
| `eq_slag_armor` | 熔渣甲 | equipment | rare | 护甲：防御 +2（词条：反震 + 坚韧） |
| `eq_ember_staff` | 烬火法杖 | equipment | rare | 武器：攻击 +1（词条：破竹 + 乘胜） |
| `evt_forge` | 灰烬锻炉 | event | rare | 献祭本关 1 件装备 → 本关攻击 +2 |
| `mech_seal_switch` | 封印开关 | mechanism | uncommon | 消耗 `key` ×1 → 写 `runFlags.seal_broken` |
| `mech_mirror` | 镜像机关 | mechanism | uncommon | 写 `runFlags.mirror_on`（与 `seal_broken` 组成双 flag 出口） |
| `spec_reverse_stack` | 倒流的沙漏 | special | rare | 反转本堆剩余顺序 |
| `spec_copy_top` | 复写沙漏 | special | rare | 复制本堆顶层卡插入堆顶（本堆上限 +1） |
| `spec_lock_stack` | 铅封锁 | special | rare | 随机封锁一堆 3 回合（该堆不可操作） |
| `spec_scramble_all` | 乱序沙漏 | special | epic | 打乱全部堆的剩余顺序 |
| `elite_slag_warden` | 熔渣守卫 | enemy（精英） | rare | HP 20 / ATK 4 / DEF 3；+12 金币；荆棘 1 |
| `elite_cinder_deacon` | 烬火执事 | enemy（精英） | rare | HP 18 / ATK 5 / DEF 2；+12 金币；再生 2/回合 |
| `trap_ash_mine` | 灰烬地雷 | trap | uncommon | 5 点伤害（受防御减免、盾先抵） |
| `trap_ember_storm` | 火星喷口 | trap | rare | 2 点伤害 + 灼烧 2 层 |
| `evt_ash_pact` | 灰烬契约 | event | rare | 支付 3 HP → 本关攻击 +2（`buff`） |

### 阶段五（15 张，theme5_starless_void）

| id | 名称 | 类型 | 稀有度 | 效果明细（基线） |
|---|---|---|---|---|
| `enemy_void_shade_01` | 影缚蝠 | enemy | rare | HP 14 / ATK 5 / DEF 1；+7 金币；命中后易伤 1 回合 |
| `enemy_star_eater_01` | 星蚀甲虫 | enemy | epic | HP 18 / ATK 6 / DEF 2；+9 金币 |
| `enemy_star_crawler_01` | 星骸蜥 | enemy | rare | HP 16 / ATK 4 / DEF 3；+8 金币；命中后虚弱 1 回合 |
| `enemy_lightless_priest_01` | 灰袍祭司 | enemy | epic | HP 15 / ATK 5 / DEF 1；+8 金币；每 3 回合回复 2 HP |
| `eq_starfall_blade` | 陨铁剑 | equipment | epic | 武器：攻击 +4（词条：破竹 + 猎金 + 攻势） |
| `eq_starless_pendant` | 黑曜坠饰 | equipment | epic | 饰品：受击时对攻击者造成 1 伤害（词条：坚韧 + 回春 + 守势） |
| `eq_worlds_end_blade` | 终末之刃 | equipment | legendary | 武器：攻击 +4（词条：破竹 + 猎金 + 攻势；唯一：终末——击杀回复 2 HP）；**仅 level_0480 / level_0500 两关钉位产出** |
| `evt_silent_bell` | 哑钟 | event | rare | 二选一：恢复 6 HP / 金币 +3 |
| `elite_star_shard_lord` | 星甲巨卫 | enemy（精英） | epic | HP 24 / ATK 6 / DEF 3；+16 金币或道具 ×1；HP ≤50% 召唤星骸蜥 |
| `elite_lightless_bishop` | 黑纱主教 | enemy（精英） | epic | HP 22 / ATK 6 / DEF 2；+16 金币；每 3 回合 shuffle 一堆 |
| `trap_void_rift` | 地裂口 | trap | rare | 失去 3 食物 + 虚弱 1 回合（不受护盾） |
| `evt_void_echo` | 回音石碑 | event | rare | 二选一：本关 MaxHP +3（`buff`）/ 金币 +5 |
| `boss_starless_king` | 断冠王 | enemy（首领） | epic | HP 36 / ATK 6 / DEF 3；P1 荆棘、P2 再生 + 召唤 |
| `boss_void_herald` | 影号手 | enemy（首领） | epic | HP 32 / ATK 7 / DEF 2；P1 盘面干扰、P2 荆棘 |
| `boss_final_echo` | 丧钟巨像 | enemy（首领） | epic | HP 40 / ATK 8 / DEF 3；P1 召唤、P2 再生 + 荆棘 |

**首领数值口径**：首领 HP 按"该阶段普通敌人上限 ×1.5"取值（三 18 / 四 22～24 / 五 32～40），允许超出普通带宽；难度仍以机制为主（14_EliteBoss.md §2）。

### 5.1 扩展卡所需的效果能力（设计已定，实现待排期）

8 项**均不阻塞 MVP / B2**：阶段一 23 张卡只用现有词汇，扩展卡从阶段二内容起才需要。因此 B2 只做框架，扩展分两批落地（TBD-34）：

| 能力 | 影响卡 | 扩展定义（已冻结） | 里程碑 |
|---|---|---|---|
| 命中触发 | 孢子幼体 / 洞穴蛛 / 影缚蝠 | trigger `on_enemy_attack`（反击命中后结算） | M-D |
| 属性临时修正 | 苔藓猎犬 / 灰烬锻炉 | 效果 `buff{stat, delta, duration}`，到期复原 | M-D |
| 条件伤害 | 灰烬幽魂 | `ConditionRule.shieldAtLeast` | M-D |
| 周期触发 | 守墓石像 / 焰祭司 | `EffectDefinition.interval`（缺省 1） | M-D |
| 献祭装备 | 灰烬锻炉 | `consume.slot`（与 `itemId` 二选一） | M-D |
| 堆锁定时长 | 铅封锁 | `StackRuntime.lockedUntilTurn`（到期自动解锁） | 阶段四前 |
| 复制顶层 | 复写沙漏 | `spawnCard.source: "top"`（忽略 cardId，允许临时 +1） | 阶段四前 |
| 死亡触发 | 不死鸟之羽 | trigger `on_player_died` + `flags.revived` 每关一次 | 阶段四前 |

> `03_ActionQueue.md` §3 已写入上述类型、参数表与 trigger 词表；实现时只需按签名落地，不得再改语义。未登记的新 type / trigger 视为违规（登记制）。
