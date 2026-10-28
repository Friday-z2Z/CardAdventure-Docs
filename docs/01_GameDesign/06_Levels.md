# 500 关卡系统

> 来源：总规格书第六章。本文定义难度阶段、关卡数据结构、生产方式与可解性验证。

## 1. 难度构成

难度不靠单一数值膨胀，由以下维度组合：敌人组合、卡牌堆排列、资源压力、陷阱密度、特殊规则、机关目标、道具获取、卡牌可选择性、玩家当前状态、关卡长度、精英与首领机制。

## 2. 五阶段规划

| 阶段 | 关卡 | 目标 | 引入内容 |
|---|---|---|---|
| 一 | 1～20 | 教学与基础 | 普通敌人、基础资源、恢复卡、出口、基础道具、简单事件；前 5 关强引导 |
| 二 | 21～80 | 策略意识 | 敌人组合、防御、中毒、陷阱、商店、资源交换、基础连击 |
| 三 | 81～180 | 机制组合 | 精英敌人、机关、锁门、多阶段事件、状态组合、高阶装备、复杂出口条件 |
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
  leftStackConfig: StackConfig;
  rightStackConfig: StackConfig;
  objective: LevelObjective;
  exitRules: ExitRule[];           // 结构见 13_Exit.md 第 1 节
  rewardConfig: RewardConfig;      // 结构见 12_Rewards.md 第 2 节
  shopConfig?: ShopConfig;         // 商店关专用（16_Shop.md 第 2 节），普通关缺省
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
  depth: number;                     // 堆深（卡数），阶段一 8～12，逐阶段递增
  composition: { cardPoolId: string; weight: number }[];  // 权重抽卡
  fixedCards?: { index: number; cardId: string }[];       // 固定关的钉死卡位（教学/首领用）
}

interface LevelObjective {
  type: "reachExit" | "killAll" | "surviveTurns";
  target?: string | number;          // 按 type 语义取值
  displayText: string;               // 关卡信息区目标文案（LocalizationValidator 检查）
}
```

`ExitRule` 见 13_Exit.md；`RewardConfig` 见 12_Rewards.md；`BossPhase` 见 14_EliteBoss.md。`themeId` 取值与五阶段主题命名在内容生产启动前定稿（阶段一～五各一组主题词）。

生产版本必须明确：固定关与随机关的区分、是否允许重复挑战、失败是否保留部分进度、每日/活动关卡、种子是否保存、配置版本管理（对应 06_DataBalance.md 的 version 字段与存档迁移）。

## 4. 生产方式

**人工设计核心关卡 + 规则化组合 + 自动验证。**

- 固定关卡：教学、关键机制、首领战、剧情节点、特殊挑战。必须可复现。
- 规则生成关卡：中后期常规关、资源压力关、敌人组合关、随机事件关。生成器必须用可复现种子。

生成流程：读模板 → 读难度参数 → 选卡牌池 → 生成组合 → 生成双侧卡牌堆 → 检查出口条件 → 检查资源/道具获取路径 → 模拟测试 → 检查不可解状态 → 保存 → 输出报告。

## 5. 可解性验证（三层）

1. **静态验证**：出口存在、卡牌 ID 有效、道具解锁合规、数值范围、无无效引用、无不可能条件（LevelValidator，见 06_DataBalance.md）。
2. **规则模拟**：用规则引擎跑模拟玩家，检查强制死亡、无限循环、无法操作、出口不可达。
3. **策略采样**：多种策略（优先杀低血敌/拿食物/回血/高收益/拆陷阱/随机合法）测试。

注意：模拟通过 ≠ 绝对可解。固定关卡必须留存至少一条人工验证的通关路径（记录格式：关卡 ID / 种子 / 策略 / 剩余资源 / 验证人 / 日期）。

## 6. 难度指标

每关记录：通关率、剩余生命、剩余食物、道具使用数、行动次数、失败次数、放弃率、卡牌选择分布。用数据调难度，不凭主观。线上指标由埋点字典自动产出（`../04_Platform/06_Analytics.md`，事件映射 04_EventCatalog.md）；无线上统计时，至少做内部自动模拟 + 人工试玩记录。
