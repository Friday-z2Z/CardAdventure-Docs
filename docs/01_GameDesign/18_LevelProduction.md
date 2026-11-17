# 关卡生产手册（作业指导书）

> 定位：`06_Levels.md` 定义"关卡是什么样"，本文定义"怎么批量生产出来"，是 500 关内容生产的唯一作业口径。
> 版本：V1（2026-11-17），与 `06_Levels.md` §3.1 冻结基线同步；推翻须同步 Validator 与测试用例。

## 1. 单关产出物

| 产出 | 位置 / 形式 |
|---|---|
| 关卡配置 | `assets/resources/data/levels/level_XXXX.json`（公共字段齐全） |
| 生产记录 | 本文 §7 的人工通关记录（固定关必有，随机关抽检） |
| 机制标签 | 关卡 `tags`：`stageN` + `mechanic_*` + 出口类型标记 |
| 校验结果 | `npm run validate` 输出（DIFF 落带、可解性、资源带） |

## 2. 生产流程（七步，禁止跳步）

1. **选题**：确定阶段、DIFF 目标值、核心策略点（一句话能说清"这关在考什么"）。
2. **定机制**：按 §5 矩阵选 1 个主机制（+ 至多 1 个副机制），写入 `tags`。
3. **填参数**：按 §4 参数包取堆数、三档深度配比、暗堆比例、出口类型。
4. **写配置**：套 §3 模板，`composition` 权重总和不需要归一（导出时归一化）。
5. **静态校验**：`npm run validate`——占格/堆数/三档/浅堆比/梯度/DIFF/金源可达全绿。
6. **模拟 + 人工**：Validator 两层模拟（零/满解锁）通过；固定关必须人工通关一次并记录。
7. **入库**：填生产记录，更新关卡索引与 content 进度表。

## 3. 关卡 JSON 模板

```json
{
  "id": "level_0000",
  "type": "level",
  "version": 1,
  "createdAt": "2026-11-17T00:00:00Z",
  "updatedAt": "2026-11-17T00:00:00Z",
  "author": "design",
  "name": "{关卡名}",
  "themeId": "theme1_ember_hollow",
  "difficultyTier": 1,
  "startingState": {
    "hp": 30, "maxHp": 30, "food": 10, "gold": 0, "shield": 0,
    "attack": 1, "defense": 0,
    "carryOverInventory": true,
    "startingItems": []
  },
  "cardIds": ["enemy_rat_01", "res_gold_pouch", "heal_herb", "exit_door"],
  "stackLayout": "matrix5",
  "stacks": [
    {
      "cell": [1, 1],
      "reveal": "lit",
      "depth": 3,
      "composition": [
        { "cardId": "enemy_rat_01", "weight": 3 },
        { "cardId": "res_gold_pouch", "weight": 2 }
      ]
    }
  ],
  "objective": { "type": "reachExit", "displayText": "key:{objective_key}" },
  "exitRules": [{ "type": "none" }],
  "rewardConfig": { "gold": { "min": 5, "max": 10 }, "items": [], "fixed": false },
  "generationSeed": 0,
  "tags": ["stage1", "mechanic_none"],
  "enabled": true
}
```

填写要点：

- `name` 与 `objective.displayText` 一律走 CopyDeck key，**不内联中文**。
- 固定关（教学 1～5、首领关、新机制首关）必须填 `generationSeed` 并钉 `fixedCards`；随机关 `generationSeed` 由进关时生成。
- `exitRules` 与 `objective` 必须自洽：`surviveTurns` 目标要配 `flag: survive_cleared` 的出口规则（06_Levels.md §3）。
- 堆数 ≤3 的关不写 5×5 全盘坐标也合法，`cell` 只用于存档与位置语义（00_UiSpec.md §6）。

## 4. 阶段参数包

| 阶段 | 堆数 | 三档深度（浅/中/深） | DIFF 目标带 | 主机制上限 | 备注 |
|---|---|---|---|---|---|
| 一 1～20 | 2～3 | 3～5 / 6～9 / 10～12 | 10～30（前 5 关 ≤15） | 1 | 每关只教一个规则 |
| 二 21～80 | 4～6 | 4～6 / 7～10 / 11～14 | 25～45 | 1 + 副机制 | 引入暗堆混合、商店 |
| 三 81～180 | 6～10 | 5～8 / 9～12 / 13～16 | 40～60 | 1 + 副机制 | 精英、机关链 |
| 四 181～320 | 8～14 | 6～9 / 10～14 / 15～18 | 55～75 | 1 + 副机制 | 特殊机制卡、多目标 |
| 五 321～500 | 10～20 | 8～11 / 12～16 / 17～20 | 70～95 | 1 + 副机制 | 首领机制组合 |

- DIFF 的 D 因子按**目标路径深度**计算（06_Levels.md §3.1.2），不是全盘总量。
- 首领关 DIFF 允许上浮 10；矿点关优先取该阶段代表性关卡（`tags` 加 `diamond_mine`）。

## 5. 机制组合矩阵（V1 草案）

| 机制标签 | 一 | 二 | 三 | 四 | 五 |
|---|---|---|---|---|---|
| `mechanic_dark`（暗堆） | — | 引入 | 强化 | 强化 | 主力 |
| `mechanic_mechanism`（机关/锁门） | — | 引入 | 机关链 | 强化 | 主力 |
| `mechanic_multi_enemy`（多敌同场） | — | — | 引入 | 强化 | 主力 |
| `mechanic_status`（毒/灼烧） | — | 引入 | 组合 | 强化 | 主力 |
| `mechanic_trap_dense`（陷阱密度） | 少量 | 引入 | 强化 | 强化 | 主力 |
| `mechanic_resource_pressure`（资源压力） | — | 引入 | 强化 | 主力 | 主力 |
| `mechanic_exit_complex`（复杂出口） | — | — | 引入 | 强化 | 主力 |
| `mechanic_merchant`（流浪商人） | — | 引入 | 强化 | 常规 | 常规 |

投放规则：

1. 每关 **1 主机制 + 至多 1 副机制**；同一阶段内不得连续 3 关使用同一主机制。
2. 新机制首关（21/81/181/321）必须是固定关，配引导提示与 `tutorialId`。
3. 机制与卡池必须同时给：引入 `mechanic_status` 的关，`cardIds` 至少含 1 张对应状态卡与 1 张应对卡。
4. 首领关按 `14_EliteBoss.md` 的 `BossPhase` 模板，主机制写在 `bossConfig.modifiers` 里，不重复占用堆机制。

## 6. 生产检查清单（20 项，入库前逐条打勾）

**配置合法性**

1. 公共字段齐全（id/type/version/createdAt/updatedAt/author）。
2. `id` 为 `level_XXXX` 且四位数补零、全局唯一。
3. 所有 `cardIds` / `composition.cardId` 在卡池中存在且已解锁。
4. `cell` 在 0～4 内且不重叠。
5. 堆数 ≤20，堆数符合阶段参数包。
6. 每堆 `depth` 归属三档之一，浅堆 ≥⌈N×0.4⌉，至少 1 深堆，梯度 max ≥ min×1.5 且差 ≥3。
7. `fixedCards.index < depth` 且不重复；固定关 `generationSeed` 非 0。
8. `weight` 全 >0；单堆同卡上限可满足（06_Levels.md §3）。
9. `objective` 与 `exitRules` 自洽（flag 名、击杀 id、收集物、支付额）。
10. `displayText` 为 CopyDeck key 且文案已登记。

**难度与可解性**

11. DIFF 落在阶段目标带内（教学关 ≤15，首领关 ≤带上浮 10）。
12. 零解锁端模拟可解；满解锁端模拟可解（06_Levels.md §5.1）。
13. 无"无合法操作且未通关"死锁策略。
14. 局内金币净收入落在 09_BalanceBaseline.md §5 净收入带 ±30%。
15. 暗堆不排除高威胁卡，但整体威胁值符合 C 因子。

**内容与体验**

16. 本关核心策略点能用一句话写进生产记录。
17. 有 `evt_merchant` 的关，商人前必有金源卡（LevelValidator 模拟通过）。
18. 需要特定道具的关，提供可验证的获取路径，不构成隐性必需。
19. 关卡名、目标文案、机制标签均已登记，主题词与 `themeId` 一致。
20. 固定关已留存人工通关记录（§7），随机关已抽检 ≥5%。

## 7. 人工通关记录格式

| 关卡 | 种子 | 策略 | 剩余 HP | 剩余 Food | 回合 | 验证人 | 日期 |
|---|---|---|---|---|---|---|---|
| level_0003 | 30003 | 先浅堆侦察→中堆配平→深堆取出口 | 18 | 2 | 14 | 本人 | 2026-11-17 |

- 固定关（教学/首领/新机制首关）**每关必有一条**；随机关按阶段抽检 5%。
- 记录随关卡 JSON 一并入库，作为交付材料（12_Delivery_Risk.md §1 C）。

## 8. 命名与版本约定

- 文件名 `level_0001.json` 起，四位补零，不允许跳号占位。
- `tags` 统一前缀：`stage1`～`stage5`、`mechanic_*`、`flag_exit` / `kill_exit` / `collect_exit` / `pay_exit`、`diamond_mine`。
- 改数值只改 Balance 后重新导出；改结构走 `version` 递增与存档迁移评估（10_CodingStandards.md §4）。
