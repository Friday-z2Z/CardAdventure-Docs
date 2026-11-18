# 数据规范、验证器与版本管理

> 新增章节（采纳评审建议六、七、十五、十八），并具体化总规格书 9.6、9.7、14 章。

## 1. 配置文件公共字段

所有 JSON 配置（卡牌、道具、敌人、关卡、数值表）必须包含：

```json
{
  "id": "enemy_slime_01",
  "type": "enemy",
  "version": 1,
  "createdAt": "2026-10-28",
  "updatedAt": "2026-10-28",
  "author": "design",
  "...": "各类型专有字段"
}
```

- `id`：小写英文 + 下划线，全局唯一（总规格书 9.4）。
- `version`：配置结构版本，供 Validator 校验与后续迁移。
- 缺公共字段视为非法配置，直接校验失败。

## 2. 验证器清单

开发期启动与 CI 必须运行全部验证器（对应总规格书 6.5 静态验证、12.3 自动化）：

| 验证器 | 检查内容 |
|---|---|
| CardValidator | 引用的效果/目标/成本定义存在；baseValue 范围合法；tags 有效；效果 `type` / `params` / `trigger` 必须在 03_ActionQueue.md §3 的词汇表与参数表内（未登记即失败）；`legendary` 仅允许固定来源（首领钉位/成就）且必须带唯一词条，**不得出现在随机卡池**（03_Cards.md §2） |
| EnemyValidator | HP > 0、攻击 ≥ 0、奖励字段非负；特殊效果可解析 |
| ItemValidator | 效果定义存在；maxStack ≥ 1；unlockLevel ≤ 500；`legendary` 仅允许固定来源（成就），不得进商店池与随机奖励池；price 落在该稀有度区间（5～8 / 8～12 / 12～20 / 20～30，传奇无价格） |
| LevelValidator | 出口存在；卡牌 ID 有效；道具已解锁或不作隐性必需；通关条件可满足；matrix5 占格/堆数 ≤20；depth 三档归属、浅堆占比 ≥40%、梯度 ≥1.5 且差 ≥3；`composition` 权重 >0、`fixedCards.index < depth` 且不重复；每堆尾部 `max(2, ceil(depth×0.3))` 张属于 `highValuePool`；DIFF 落阶段目标带（06_Levels.md §3.1.2）；evt_merchant 金源可达；开局构筑白名单不含进度类道具（key 等，04_MetaProgression.md §8）；两端模拟（零/满解锁）均可解（06_Levels.md §5.1）；全关装备卡 ≥1（阶段三起 ≥2）且同槽位 ≤1 |
| ConfigValidator | 公共字段齐全；id 唯一；无重复资源引用；覆盖未单设验证器的配置（shop_offers / sign_rewards / tutorial_steps / copy），校验引用 id 存在、CopyDeck key 已登记、数值范围合法 |
| AssetValidator | 配置引用的图片/音频文件存在且命名合规（总规格书 8.8） |
| LocalizationValidator | 名称、描述字段非空；无未翻译占位符 |

规则：校验失败必须阻断启动（开发期）或阻断构建（CI）；禁止跳过。AI 生成批量关卡时，Validator 是第一道关卡（总规格书 16.2、16.4）。

> Cocos 工程下配置文件位于 `assets/resources/data/`（经 resources.load 进入本流水线）；Balance 导出脚本直接写入该目录，随构建进包或热更（04_Platform/03_Packaging.md 第 3 节）。

## 3. 数值管理与 Balance 表导出

禁止直接修改 500 个 JSON 调平衡（总规格书 14.1）。流程：

```text
balance.xlsx（或 balance.ts 表）
  ↓ 导出脚本（npm run export:balance）
  ↓ JSON 配置（含公共字段）
  ↓ Validator
  ↓ 运行时
```

- 全局平衡参数（初始属性、消耗、连击阈值、各阶段难度参数）只在 Balance 表中维护一份。
- **Balance 字段登记（V1，2026-10 增补）**：
  - 玩家初始属性与全局消耗（09_BalanceBaseline.md §2～3）；连击阈值与奖励（§6）
  - 关卡生成：depth 三档表、堆数配方、浅堆配比下限、梯度规则（06_Levels.md §3.1.1）
  - **difficultyWeights**：DIFF 四因子权重 `{ stack: 0.20, depth: 0.30, reveal: 0.20, cardThreat: 0.30 }` + 阶段 DIFF 目标带 + 首领上浮 +10 + 教学上限 15（06_Levels.md §3.1.2）
  - **threat**：每卡威胁值（敌人 f(ATK,HP)、陷阱定值、恢复/资源为负值），随卡牌登记录入
  - 商店价格与阶段系数（16_Shop.md）；签到奖励表（17_SignIn.md）；钱包经济监控阈值（16_Shop.md §5）
  - 钻石矿点：矿点产出表（1/2/3/5/8 按阶段）与**每日刷矿上限 `mineDailyLimit`**（基线 10 次/日，04_MetaProgression.md §2）
  - **状态效果数值**：poison / burn / weakness / vulnerable / regeneration / exhausted 的每层效果、时长与叠加方式（02_Player.md §2.2）
  - 装备加成、道具效果数值、敌人数值：随卡/敌人登记逐项录入 Balance

**数值唯一真源**：

- `balance/balance.xlsx` 是唯一可编辑源（sheet：player / costs / limits / enemies / cards / items / status / combo / difficulty / shop / merchant / achievements / sign / mine / rewards；`threat` 是 enemies 与 cards 的列，不单设 sheet）。
- `assets/resources/data/**` 的 JSON 是导出产物，**禁止手改**；`docs/` 内的数值表（07_CardCatalog、09_BalanceBaseline、02_Player §2.2）是**只读展示副本**——改值只改 Balance 后重新导出，并同步刷新展示表。

**结构与数值的合并边界**（B1 导出脚本按此实现）：手写 JSON 只写**结构与引用**（`cardIds`、`composition[].cardId`、`effects`、`tags`、`cell` 等），数值字段（hp/attack/defense/baseValue/price/threat/maxStack…）一律由 `export:balance` 注入；模板中数值留空即表示待注入，Validator 不视为错误。

**Balance 工作簿结构（`export:balance` 输入契约）**：

| sheet | 主键 | 关键列（列名 = 代码字段） |
|---|---|---|
| player | field | value（maxHp / food / attack / defense / shield / gold） |
| costs | key | value（foodPerAction / foodEmptyPenaltyFirst / foodEmptyPenalty） |
| limits | key | value（foodCap / shieldCap / goldCap / vulnerableMultiplier / comboMaxTier） |
| status | id | hpPerStack / healPerTurn / attackDelta / duration / stackMode |
| enemies | enemyId | hp / attack / defense / rewardGold / rewardFood / threat / elite |
| cards | cardId | rarity / baseValue / threat / actionCostFood / enabled |
| items | itemId | rarity / maxStack / cooldown / price / useType / overflowGoldRate |
| combo | tier | gold / food / itemChance |
| difficulty | key | stackWeight / depthWeight / revealWeight / threatWeight / bandStage1～5 / bossBonus / teachCap |
| shop | key | basePrice / stageMultiplier / refreshCost / slotCount / rareWeight / epicWeight / dailyFreeRefresh |
| merchant | itemId | basePrice / weight / minStage |
| sign | day | rewardType / rewardId / amount |
| mine | stage | diamondPerClear / dailyLimit |
| rewards | key | replayTransferRatio / adDoubleMultiplier / rareChanceCap |
| achievements | id | diamond / itemId / itemQty / trigger；diamond = 0 表示仅记录（图鉴/称号），itemId 留空表示无道具 |

- 列名必须与 TS 字段一致；留空 = 取代码默认值；新增行必须带公共字段（version/updatedAt/author）；导出脚本对未知列报错、对缺列告警。

**npm 脚本契约（B1 验收口径）**：

| 脚本 | 输入 | 输出 / 退出码 |
|---|---|---|
| `npm run export:balance` | `balance/balance.xlsx` | 写 `assets/resources/data/{cards,items,enemies,balance}/`；成功后自动跑 validate；失败非 0 退出 |
| `npm run validate` | `assets/resources/data/**` 与 CopyDeck 导出物 | 逐条 `[Validator] <file>: <message>`，`--json` 出机器可读；全通过 0，否则 1 |
| `npm run export:copy` | `02_CopyDeck.md` + `07_CardCatalog.md` 卡牌表 + `04_Items.md` 名称列 | 写 `assets/resources/data/copy/copy_zh-CN.json`（扁平 key→text + 公共字段，见 02_CopyDeck.md §8） |
| `npm run check:licenses` | `manifest.json` + `licenses.csv` | 每个资源必须有已审计 license 记录；缺失即 1 |
| `npm test` | `tests/**` | Vitest，Node 环境，不依赖引擎 |

- 每次导出自动跑验证器 + 受影响关卡模拟（总规格书 14.3）。
- 数值修改必须记录变更原因和影响范围（提交信息或变更日志）。

## 4. 随机数规范（含子流分割）

所有影响关卡结果的随机必须走统一随机模块（总规格书 9.7）：种子驱动、可固定、可复现、可记录。配置流水线中不产生随机，随机只发生在运行时 Factory 与生成器。

**API（`core/random`，纯 TypeScript，禁 import "cc"）**：

```ts
type RandomStream = "level" | "reward" | "shop" | "meta";
function createRandom(seed: number, stream: RandomStream): Random;
interface Random {
  next(): number;              // [0,1)
  int(min: number, max: number): number;   // 闭区间
  pick<T>(list: readonly T[]): T;
  weightedPick<T>(list: readonly { item: T; weight: number }[]): T;
  fork(tag: string): Random;   // 由当前流派生独立子流（新增随机点时用）
}
```

**子流登记（V1）**：

| 子流 | 用途 | 种子派生 |
|---|---|---|
| level | 堆内抽卡、布局生成 | `hash(levelSeed, "level")` |
| reward | 击杀/通关/宝箱奖励掷骰 | `hash(levelSeed, "reward")` |
| shop | 货架生成、每日刷新 | `hash(saveDate + deepestStage, "shop")` |
| meta | 签到/活动等非对局随机 | `hash(dateString + uid, "meta")` |

规则：

1. **禁止跨流共享序列**：任一系统新增随机调用不得改变其他流的输出；否则"同种子同结果"与逐张复盘失效（06_Levels.md §3.1 复盘三要素）。
2. 新增随机点必须声明所属 stream 并在此表登记用途；未登记 = 代码审查不通过。
3. 演出类随机（粒子抖动等）一律不入上述流，不得影响逻辑结果。
4. **hash 算法固定**：统一 FNV-1a 32bit，输入 `${seed}:${stream}:${salt}`；实现只放 `core/random`，禁止各系统自写（算法不一致会直接破坏跨版本复现）。
5. **商店种子**：`salt = date|deepestStage|refreshCount`——付费刷新递增 `refreshCount` 即换货架；同日同阶段同次数结果一致。
6. **meta 流不依赖 uid**（单机无账号）：`salt = date|configVersion`。

## 5. 工程版本规范

| 版本 | 里程碑 | 对应总规格书 |
|---|---|---|
| v0.1 | Prototype：核心规则可跑一局 | 里程碑 B |
| v0.2 | Playable：道具/状态/存档闭环 | 里程碑 C |
| v0.3 | MVP：10～20 关可体验 | 里程碑 D |
| v0.5 | Content：500 关配置完成 | 里程碑 E |
| v0.8 | RC：测试与优化完成 | 12.4 质量门槛 |
| v1.0 | 正式发布 | 15.2 验收清单 |

规则：

- 版本号写入存档与配置 `version` 字段，保证"配置版本 ↔ 工程版本 ↔ 存档版本"可对账（总规格书 9.9）。
- 版本升级涉及存档结构变化时，必须提供迁移链（Migration1 → Migration2 → …），禁止删档。
