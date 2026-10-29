# 500 关卡系统

> 来源：总规格书第六章。本文定义难度阶段、关卡数据结构、生产方式与可解性验证。

## 1. 难度构成

难度不靠单一数值膨胀，由以下维度组合：敌人组合、卡牌堆排列、资源压力、陷阱密度、特殊规则、机关目标、道具获取、卡牌可选择性、玩家当前状态、关卡长度、精英与首领机制。

## 2. 五阶段规划

| 阶段 | 关卡 | 目标 | 引入内容 |
|---|---|---|---|
| 一 | 1～20 | 教学与基础 | **matrix5 5×5 矩阵盘（2～3 堆少堆盘）**（§3.1）、普通敌人、基础资源、恢复卡、出口、基础道具、简单事件；前 5 关强引导 |
| 二 | 21～80 | 策略意识 | **矩阵盘堆数上调（4～6 堆）**、敌人组合、防御、中毒、陷阱、**主界面/准备档口商店开放购买**（16_Shop.md）、**顶牌亮/暗混合（部分亮）**（参考 Card of Darkness，§3.1）、资源交换、基础连击 |
| 三 | 81～180 | 机制组合 | **matrix5 5×5 矩阵盘**（堆散布占格、空格环境 UI，§3.1）、精英敌人、机关、锁门、多阶段事件、状态组合、高阶装备、复杂出口条件 |
| 四 | 181～320 | 策略深度 | 特殊堆规则、强化敌人、机关链、稀缺资源、多目标、组合型首领 |
| 五 | 321～500 | 高阶挑战 | 机制组合关、主题首领、高风险高收益、资源限制、多阶段首领战 |

设计红线：每关一个可识别的核心策略点；首领机制必须有提示与应对；不允许纯随机导致的必败；不把未解锁道具作隐性必需。

## 3. 关卡数据结构

```ts
interface LevelDefinition {
  id: number;
  name: string;
  themeId: string;                 // 主题见第 2 节阶段划分
  difficultyTier: number;          // 1～5，对应五阶段
  startingState: LevelStartingState;
  cardPoolIds: string[];
  stackLayout: "matrix5";                    // 布局全阶段统一 5×5 矩阵盘（2026-10 用户修订；字段保留以便未来扩展）
  stacks: StackConfig[];                     // 2～20 个堆（随阶段递进，§3.1 基线），每堆必填 cell
  objective: LevelObjective;
  exitRules: ExitRule[];           // 结构见 13_Exit.md 第 1 节
  rewardConfig: RewardConfig;      // 结构见 12_Rewards.md 第 2 节
  // shopConfig 已停用（2026-10 修订）：商店移至主界面/结算页，局内无货架商店（16_Shop.md §1）
  tutorialId?: string;             // 引导脚本关联（15_Tutorial.md），仅教学关配置
  bossConfig?: BossPhase[];        // 首领关专用（14_EliteBoss.md 第 2 节）
  generationSeed?: number;
  tags: string[];
  enabled: boolean;
}

interface LevelStartingState {
  hp: number; maxHp: number; food: number; gold: number; shield: number;
  attack: number; defense: number;   // 缺省继承 09_BalanceBaseline.md 第 2 节
  carryOverInventory?: boolean;      // true = 保留上一关道具库存（11_Resources.md 第 3 节例外）
  startingItems?: { itemId: string; quantity: number }[];  // 开局固定道具（教学关用）
}

interface StackConfig {
  cell: [number, number];            // 5×5 盘中坐标 [row, col]（0～4），不得重叠（全阶段 matrix5，2026-10）
  depth: number;                     // 堆深（卡数），按阶段递进（§3.1 基线），各堆可不同
  reveal?: "lit" | "dark";           // 顶牌可见度（默认 lit）：lit=顶牌亮明；dark=顶牌暗置，只显示"剩余张数"角标（参考 Card of Darkness 红色数字徽章）；下层恒为暗牌。同关各堆可混合——如 4 堆两 lit 两 dark = "部分亮"（2026-10 用户定义）
  composition: { cardPoolId: string; weight: number }[];  // 权重抽卡
  fixedCards?: { index: number; cardId: string }[];       // 固定关的钉死卡位（教学/首领用）
}

interface LevelObjective {
  type: "reachExit" | "killAll" | "surviveTurns";
  target?: string | number;          // 按 type 语义取值
  displayText: string;               // 关卡信息区目标文案（LocalizationValidator 检查）
}
```

`ExitRule` 见 13_Exit.md；`RewardConfig` 见 12_Rewards.md；`BossPhase` 见 14_EliteBoss.md。

### 3.1 关卡生产决策（已登记基线）

> 本节为关卡生产的冻结基线（补登于开工前）。内容生产启动前可整体推翻并更新本表，推翻须同步受影响的测试用例。

| 待定项 | 决策 |
|---|---|
| themeId 取值 | 五阶段各一值：`theme1_ember_hollow`（余烬洞窟）、`theme2_spore_depths`（孢林深处）、`theme3_drowned_crypt`（沉水墓窖）、`theme4_ashen_spire`（灰烬尖塔）、`theme5_starless_void`（无星虚空）。主题词同时约束该阶段美术与文案选词 |
| 固定关范围 | 教学关 1～5、每阶段首领关（20/80/180/320/500）、新机制引入首关（21/81/181/321）；固定关 `generationSeed` 必填，必须留存人工通关路径（第 5 节）；其余为随机关 |
| 重复挑战 | 允许重玩已通关卡；重玩只保留局内收益，**不重发首通固定奖励**（幂等键拦截，12_Rewards.md §3）；`LEVEL_ALREADY_COMPLETED` 错误码用于重复领首通奖励的提示场景 |
| 失败进度保留 | 不保留关卡内状态（HP/堆/RunFlags 回到进关前快照，**含局内赚取金币**）；保留永久成长、钻石、钱包金币、图鉴进度；失败不额外扣资源（休闲向红线） |
| 金币双层制 | 局内金币为临时资源；**胜利结算时全额转存钱包**（walletGold，ProgressData），失败没收；进关不携带钱包金币（局内/钱包经济隔离，11_Resources.md §3）；evt_merchant 用局内金币，主界面/准备档口商店用钱包金币 |
| 关卡初始金币 | **所有关卡恒为 0，无例外**（09_BalanceBaseline.md 第 2 节基线；钻石"Gold 起始 +5"永久加成是唯一非零来源）。有 evt_merchant 的关，可达性由堆序保障：composition 保证商人槽位前有金源卡，LevelValidator 模拟"到达商人时金币 ≥ 最低价"，不达标打回配置；确需开局资金的关用 fixedCards 固定金源卡（如 res_gold_pouch 钉在 index 0～1），禁止用起始金币等隐晦数值向玩家剧透关卡内容——想让玩家知道的事用明确界面语言（目标区标签）说 |
| 堆布局与可见度（2026-10 修订，参考 Card of Darkness） | **布局全阶段统一 5×5 矩阵盘**（`matrix5`，2026-10 用户修订：dual/row3 布局废弃）：堆散布占格，每堆卡数可不同；空格不承载可交互卡牌：**默认留白**（地面/水纹纹理），装饰性环境元素（火把、石棺、状态指示灯等）稀疏点缀——建议 ≤ 空格数 1/3，禁止填满。堆数随阶段递进：一 2～3 堆 8～12 深 / 二 4～6 堆 10～14 / 三 6～10 堆 12～16 / 四 8～14 堆 14～18 / 五 10～20 堆 16～20；**上限 20 堆**。渲染自适应：堆数 ≤3 时卡放大至 300×300，≥4 堆用 140×140 缩略（icon+数值+角标，详情走 Tooltip）。**每堆 depth 采用三档制混合**（浅/中/深，§3.1.1）：总量计入 DIFF 的 D 因子，分布（梯度/浅堆配比）塑造路线结构并由硬规则约束，分布不单独计分（校准期可预留并入）。顶牌可见度 `reveal` 每堆 lit/dark（默认 lit），同关混合 = "部分亮"，dark 堆顶牌只显示剩余张数角标；下层恒暗牌。结算内核（食物/连击/出口/ActionQueue）不随堆数变化，Validator 按 N 堆通用（堆占格不重叠、坐标 0～4、出口/机关/金源可达） |
| 每日/活动关卡 | MVP 不做；配置结构预留 `daily: boolean` 扩展位（加入时须补 Validator 规则与存档字段，走登记流程） |
| 种子保存 | 随机关进关时生成种子并写入存档（断点续玩复现）；通关后种子随结算记录进难度指标（第 6 节）。**复盘三要素**：种子（管随机的部分：堆序列/奖励掷骰）+ 关卡配置（管确定的部分：cell/depth/reveal/卡池均为静态 JSON 不经随机）+ 操作流水（埋点 card_played）= 逐张完整复盘；Validator 可全知模拟（读穿 dark 堆）验证可解性 |
| 钻石矿点 | 每阶段固定 2 个矿点关（阶段一 10/20、二 40/80、三 120/180、四 240/320、五 400/500），配置 `tags: ["diamond_mine"]` + Balance 产出表（1/2/3/5/8 按阶段）；**重复通关每次都产出**（幂等豁免，04_MetaProgression.md §2），鼓励刷取；矿点关优先选该阶段代表性关卡 |
| 配置版本管理 | 沿用 06_DataBalance.md 公共字段（version）与存档迁移链，本文不另立 |

### 3.1.1 depth 三档制混合（2026-10 用户修订）

同关各堆的卡数不是同一个数，而是从**三档深度**里取值混合——"浅的 3 张、深的 10 张"就是合法组合。

**各阶段深度档位表**：

| 阶段 | 浅档 | 中档 | 深档 |
|---|---|---|---|
| 一（1～20） | 3～5 | 6～9 | 10～12 |
| 二（21～80） | 4～6 | 7～10 | 11～14 |
| 三（81～180） | 5～8 | 9～12 | 13～16 |
| 四（181～320） | 6～9 | 10～14 | 15～18 |
| 五（321～500） | 8～11 | 12～16 | 17～20 |

**配比与角色规则**：

1. **浅档堆 ≥ 40%**（matrix5 关）：开局有"快牌"可吃，盘面随进程塌缩，玩家注意力自然聚焦到深堆。
2. **至少 1 个深档堆**：主机制堆（钉出口/机关）取深档——高投入高回报的路线目标。
3. dark 侦察堆取浅档："剩余张数 3"角标本身就是诱饵，浅暗堆才是有效的赌注。
4. 其余堆取中档填充。
5. **梯度硬规则**（保留）：同关最深 ≥ 最浅 × 1.5 且 max − min ≥ 3，Validator 强制核查，禁止清一色 depth。
6. **分布与难度的关系**：depth 总量计入 DIFF 的 D 因子；分布（梯度/浅堆配比）不单独计分，塑造路线结构与体验节奏（浅堆便宜侦察、深堆昂贵目标）；若校准期实测通关率与分布强相关，可将梯度并入 D 因子（预留）。
7. **dark 堆不排除高威胁卡**（2026-10 用户拍板）：陷阱/精英等可进暗堆 composition——"部分亮"的赌性完整保留，翻暗堆的风险由 DIFF 的 R 因子定价；Validator 不做暗堆威胁排除核查（此前预留项关闭）。

**Validator 核查项**：各堆 depth 归属档位、浅堆占比、梯度达标、总行动量（全盘 depth 之和）与食物供给匹配。

**混合示例**（阶段一 matrix5 少堆盘，三堆）：浅堆 3 张（侦察诱饵）+ 中堆 8 张（配平）+ 深堆 10 张（钉出口，主堆）→ 梯度 10 ≥ 3×1.5 ✓、差 7 ≥ 3 ✓；玩家食物撑 ~12 次操作，三堆共 21 张——**必然翻不完，选哪堆先啃就是关卡的核心决策**。

### 3.1.2 难度交叉模型（2026-10 用户修订）

**一关的难度 = 堆数 × 深浅 × 暗亮 × 卡池 四维交叉**，不是单一维度的带宽。四维可互相交换：`4 堆·全暗·全深·强敌` 与 `12 堆·全亮·浅中·温和` 可以等难——这是 500 关配置不重复的生成空间。

**难度分 DIFF（0～100，Baseline 权重，Balance 表可调）**：

```text
DIFF = 100 × ( 0.20×P + 0.30×D + 0.20×R + 0.30×C )

P 堆数因子 = 堆数 / 20（上限归一）
D 深度因子 = 行动力缺口：totalDepth / (食物可支撑操作数 × 1.5)，clamp 0～1
R 暗牌因子 = dark 堆数占比（信息不确定性）
C 卡池威胁因子 = Σ(weight × threat) / Σweight 归一化
   threat 由 Balance 定义：敌人 f(ATK, HP)、陷阱定值、恢复/资源卡为负值（减压）
```

| 用途 | 规则 |
|---|---|
| 阶段目标区间 | 每阶段给定 DIFF 目标带（阶段一 10～30 / 二 25～45 / 三 40～60 / 四 55～75 / 五 70～95，基线值），LevelValidator 核算 DIFF 落带才放行；首领关允许上浮 10 |
| 等价交换 | 同带内自由混维——生成器按"先定 DIFF 目标，再随机分配四维"产出多样化关卡 |
| 校准闭环 | 预测 DIFF vs 实际通关率（06_Analytics 难度指标）偏差 > 15% 触发权重复审（09_BalanceBaseline.md §7 流程） |
| 教学约束 | 前 5 关 DIFF ≤ 15（强引导关不允许高难混合） |
| 两端模拟 | 零解锁 / 满解锁（含赛前采购）两端 DIFF 与可解性双核查（04_MetaProgression.md §3） |

旧"阶段带宽"降级为**生成器的默认起点**（非硬约束）：堆数/堆深档位表（§3.1.1）给出常规配方，交叉模型允许在 DIFF 落带前提下越档混搭。

### 3.2 完整样例（level_0003，LevelValidator 测试夹具）

存放位置：`assets/resources/data/levels/level_0003.json`；测试夹具副本存 `tests/fixtures/levels/`。样例为阶段一 flag 型出口关（机关开门），公共字段见 06_DataBalance.md 第 1 节。

```json
{
  "id": "level_0003",
  "type": "level",
  "version": 1,
  "createdAt": "2026-10-29T00:00:00Z",
  "updatedAt": "2026-10-29T00:00:00Z",
  "author": "design",
  "name": "拉杆与石门",
  "themeId": "theme1_ember_hollow",
  "difficultyTier": 1,
  "startingState": {
    "hp": 30, "maxHp": 30, "food": 10, "gold": 0, "shield": 0,
    "attack": 1, "defense": 0,
    "carryOverInventory": true,
    "startingItems": []
  },
  "cardPoolIds": [
    "enemy_rat_01", "enemy_slime_01", "enemy_bat_01",
    "res_gold_pouch", "res_food_cache",
    "heal_herb", "trap_spikes", "evt_campfire",
    "mech_lever", "exit_door"
  ],
  "stackLayout": "matrix5",
  "stacks": [
    {
      "cell": [1, 1],
      "reveal": "lit",
      "depth": 3,
      "composition": [
        { "cardPoolId": "enemy_rat_01", "weight": 3 },
        { "cardPoolId": "enemy_slime_01", "weight": 3 },
        { "cardPoolId": "res_gold_pouch", "weight": 2 },
        { "cardPoolId": "res_food_cache", "weight": 1 },
        { "cardPoolId": "heal_herb", "weight": 1 }
      ]
    },
    {
      "cell": [1, 3],
      "reveal": "lit",
      "depth": 8,
      "composition": [
        { "cardPoolId": "enemy_rat_01", "weight": 2 },
        { "cardPoolId": "res_food_cache", "weight": 1 },
        { "cardPoolId": "heal_herb", "weight": 1 },
        { "cardPoolId": "trap_spikes", "weight": 1 },
        { "cardPoolId": "res_gold_pouch", "weight": 1 }
      ]
    },
    {
      "cell": [3, 2],
      "reveal": "lit",
      "depth": 10,
      "composition": [
        { "cardPoolId": "enemy_bat_01", "weight": 3 },
        { "cardPoolId": "trap_spikes", "weight": 2 },
        { "cardPoolId": "res_gold_pouch", "weight": 2 },
        { "cardPoolId": "evt_campfire", "weight": 1 },
        { "cardPoolId": "mech_lever", "weight": 1 },
        { "cardPoolId": "exit_door", "weight": 1 }
      ],
      "fixedCards": [
        { "index": 4, "cardId": "mech_lever" },
        { "index": 9, "cardId": "exit_door" }
      ]
    }
  ],
  "objective": {
    "type": "reachExit",
    "displayText": "key:level_0003_objective"
  },
  "exitRules": [
    { "type": "flag", "flagKey": "door_opened" }
  ],
  "rewardConfig": {
    "gold": { "min": 5, "max": 10 },
    "items": [
      { "itemId": "potion_small", "quantity": 1, "chance": 0.3 }
    ],
    "fixed": false
  },
  "generationSeed": 30003,
  "tags": ["stage1", "mechanic_lever", "flag_exit"],
  "enabled": true
}
```

样例说明：

1. `objective.displayText` 走 CopyDeck key（`key:` 前缀），玩家可见文案不内联（编码硬规范 5）。
2. 拉杆（index 4）在出口（index 9）之前，保证 flag 型出口可达（13_Exit.md §4 机关配合）；三堆 depth 3/8/10 为 §3.1.1 三档混合示例（浅 3 / 中 8 / 深 10，深档堆钉出口）。
3. 起始数值取 09_BalanceBaseline.md 第 2 节基线；奖励区间取第 5 节通关奖励带。
4. 本样例随 06_DataBalance.md 的 LevelValidator 一同进入 `npm run validate` 校验范围。

## 4. 生产方式

**人工设计核心关卡 + 规则化组合 + 自动验证。**

- 固定关卡：教学、关键机制、首领战、剧情节点、特殊挑战。必须可复现。
- 规则生成关卡：中后期常规关、资源压力关、敌人组合关、随机事件关。生成器必须用可复现种子。

生成流程：读模板 → 读难度参数 → 选卡牌池 → 生成组合 → 生成 matrix5 盘面堆布局（占格+depth 三档+亮暗）→ 检查出口条件 → 检查资源/道具获取路径 → 模拟测试 → 检查不可解状态 → 保存 → 输出报告。

## 5. 可解性验证（三层）

1. **静态验证**：出口存在、卡牌 ID 有效、道具解锁合规、数值范围、无无效引用、无不可能条件（LevelValidator，见 06_DataBalance.md）。
2. **规则模拟**：用规则引擎跑模拟玩家，检查强制死亡、无限循环、无法操作、出口不可达。
3. **策略采样**：多种策略（优先杀低血敌/拿食物/回血/高收益/拆陷阱/随机合法）测试。

注意：模拟通过 ≠ 绝对可解。固定关卡必须留存至少一条人工验证的通关路径（记录格式：关卡 ID / 种子 / 策略 / 剩余资源 / 验证人 / 日期）。

## 6. 难度指标

每关记录：通关率、剩余生命、剩余食物、道具使用数、行动次数、失败次数、放弃率、卡牌选择分布。用数据调难度，不凭主观。线上指标由埋点字典自动产出（`../04_Platform/06_Analytics.md`，事件映射 04_EventCatalog.md）；无线上统计时，至少做内部自动模拟 + 人工试玩记录。
