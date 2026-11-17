# 决策记录（Decision Log）

> 用途：集中登记所有已冻结与已拍板的决策，替代散落在各文档正文里的"2026-10 修订""用户拍板"。
> 规则：**新决策先在此登记，再改正文**；推翻旧决策时保留原行、状态改为"已废止（被 D-xxx 取代）"，不删行。
> 状态：`冻结` = 不可改，改动需新决策；`基线` = 数值/口径已定但待实测校准；`暂缓` = V1 明确不做。

## 1. 项目级

| ID | 日期 | 决策 | 状态 | 来源 |
|---|---|---|---|---|
| D-001 | 2026-10 | 技术栈 Cocos Creator 3.8.x LTS + TypeScript 严格模式，构建微信小游戏 | 冻结 | 00_GameOverview.md §5、08_Roadmap.md §2 |
| D-002 | 2026-10 | 平衡方案一：玩家初始属性不动（Attack 1），早期敌人 HP 2～5 / ATK 1～2 | 冻结 | 09_BalanceBaseline.md §1 |
| D-003 | 2026-10 | 竖屏、500 关、个人开发 + AI 辅助 | 冻结 | 00_GameOverview.md §1 |
| D-004 | 2026-10 | 主体注册（个体户/企业）、备案、软著为第 0 周并行启动项 | 冻结 | 00_Compliance.md §1、08_Roadmap.md §4 |
| D-005 | 2026-10 | 商业化以激励视频为主，内购冻结，永不卖数值 | 冻结 | 01_Monetization.md §1 |
| D-006 | 2026-10 | 云存档 V1 不做（本地备份链 + HMAC 兜底） | 暂缓 | 12_Delivery_Risk.md §3.1 |
| D-007 | 2026-10 | 低端机降级开关延后到里程碑 B 预算冻结时设计 | 暂缓 | 12_Delivery_Risk.md §3.1 |

## 2. 玩法规则

| ID | 日期 | 决策 | 状态 | 来源 |
|---|---|---|---|---|
| D-010 | 2026-10 | 全阶段统一 matrix5 5×5 矩阵盘，堆数 2～20 随阶段递进（dual/row3 废弃） | 冻结 | 06_Levels.md §3.1 |
| D-011 | 2026-10 | 堆深三档制混合：浅堆 ≥40%、至少 1 深堆、梯度 max≥min×1.5 且差 ≥3 | 冻结 | 06_Levels.md §3.1.1 |
| D-012 | 2026-10 | 难度四维交叉 DIFF 模型（P/D/R/C 加权），阶段目标带管控 | 基线 | 06_Levels.md §3.1.2 |
| D-013 | 2026-10 | 驻留只封锁所在堆，敌人不主动反击，反击只在被攻击批次执行 | 基线 | 10_Battle.md §2 |
| D-014 | 2026-10 | 亮牌两段式（Focus → 确认）、暗牌直接执行、不做伤害预演 | 冻结 | 00_UiSpec.md §3 |
| D-015 | 2026-10 | 连击：道具不触发、奖励不再触发、受伤中断、跨关清零 | 冻结 | 05_Combo.md §4 |
| D-016 | 2026-10 | 道具模型 B 携带制：局内仅"已携带 + 本关获得"可用，仓库只读 | 冻结 | 04_Items.md §3 |
| D-017 | 2026-10 | 出口判定为只读检查，不进 ActionQueue，不耗食物不计连击 | 冻结 | 13_Exit.md §2 |
| D-018 | 2026-11 | 装备不入背包、关末消失；替换入口只有"翻到同槽位新装备"，不可主动卸下 | 冻结 | 03_Cards.md D 节 |
| D-019 | 2026-11 | 堆内抽卡为有放回加权采样；`fixedCards.index 0 = 顶层`，与 `cards[0]` 同口径 | 冻结 | 06_Levels.md §3 |
| D-020 | 2026-11 | 多敌同场用 `instanceId` 区分，`currentEnemyId` = 最近被攻击的存活敌人 | 基线 | 10_Battle.md §7 |
| D-021 | 2026-11 | `shielded` 不写入状态列表，护盾只由 `Shield` 数值体现 | 冻结 | 02_Player.md §2.1 |
| D-022 | 2026-11 | 状态效果数值基线（毒 1/层·3 回合等，见来源表） | 基线 | 02_Player.md §2.2 |

## 3. 经济与长线

| ID | 日期 | 决策 | 状态 | 来源 |
|---|---|---|---|---|
| D-030 | 2026-10 | 金币双层制：局内金币临时、失败没收；胜利转存钱包；进关不携带钱包 | 冻结 | 11_Resources.md §3 |
| D-031 | 2026-11 | 转存系数 `replayTransferRatio`，基线 1.0，首通与重玩同系数，下调即收益递减 | 基线 | 12_Rewards.md §2 |
| D-032 | 2026-11 | 广告双倍作用于转存金额，幂等键加 `:ad_double` 后缀 | 冻结 | 12_Rewards.md §2 |
| D-033 | 2026-10 | 商店移出局内：主界面 + 准备档口双入口，阶段二（过第 20 关）开放 | 冻结 | 16_Shop.md §1 |
| D-034 | 2026-10 | 商店只买不卖 | 冻结 | 16_Shop.md §1 |
| D-035 | 2026-10 | 钻石只出自矿点关（可刷）+ 成就，每日刷矿上限 10 次，矿点幂等豁免 | 冻结 | 04_MetaProgression.md §2 |
| D-036 | 2026-10 | 钻石 sink = 成长树 352 + 背包组合 240；图鉴进阶与主题外观不做 | 冻结 | 04_MetaProgression.md §8、§9 |
| D-037 | 2026-10 | 签到 7 日循环、断签顺延不清零、阶段二开放、不发钻石 | 冻结 | 17_SignIn.md §2、§3 |
| D-038 | 2026-10 | 商店阶段价格系数 1.0 / 1.3 / 1.6 / 2.0 | 基线 | 16_Shop.md §3 |
| D-039 | 2026-10 | 分享只做主动分享，每日奖励 ≤1 次，不做强制分享 | 冻结 | 05_Share.md §3 |

## 4. 工程与数据

| ID | 日期 | 决策 | 状态 | 来源 |
|---|---|---|---|---|
| D-050 | 2026-10 | 引擎隔离：`core / game / systems` 禁 `import "cc"` | 冻结 | 00_Architecture.md §6 |
| D-051 | 2026-10 | 平台能力只经 `services/` 接口，业务层禁散落 `wx.*` | 冻结 | 00_Architecture.md §5 |
| D-052 | 2026-10 | 结算批次固定 priority 10/20/30/40/50/60/70/80 | 冻结 | 03_ActionQueue.md §4 |
| D-053 | 2026-10 | 只有 `Resolving` 期间可变更 GameState；只有 StateMachine 可转移状态 | 冻结 | 02_StateMachine.md §3 |
| D-054 | 2026-10 | 存档三段式（主档 + A/B 备份）+ 迁移链，禁止删档 | 冻结 | 10_CodingStandards.md §4 |
| D-055 | 2026-11 | 数值唯一真源 = `balance/balance.xlsx`；JSON 为导出物；docs 表只读 | 冻结 | 06_DataBalance.md §3 |
| D-056 | 2026-11 | 随机分四子流 `level / reward / shop / meta`，禁止跨流共享序列 | 冻结 | 06_DataBalance.md §4 |
| D-057 | 2026-11 | 存档结构 `SaveData / ProgressData / RunSnapshot / SettingsData` 定稿 | 冻结 | 10_CodingStandards.md §4 |
| D-058 | 2026-11 | `Action` 结构定稿，`actionId` 参与 `rewardKey` 并随快照回滚 | 冻结 | 03_ActionQueue.md §3 |
| D-059 | 2026-11 | 事件选项 `EventOptionDefinition` 定稿，提交才入队 | 冻结 | 03_Cards.md §2 |
| D-060 | 2026-11 | 永久加成注入顺序固定，关卡可用 `overrideMeta` 关闭叠加 | 冻结 | 04_MetaProgression.md §3 |
| D-061 | 2026-11 | 包体口径：主包 ≤4MB、合计 ≤20MB，超限按四步瘦身预案 | 冻结 | 03_Packaging.md §1 |
| D-062 | 2026-11 | 头像昵称用 `chooseAvatar` + `nickname` 填写能力 | 冻结 | 00_Compliance.md §2 |

## 5. 文档与流程

| ID | 日期 | 决策 | 状态 | 来源 |
|---|---|---|---|---|
| D-070 | 2026-10 | 登记制：新事件/错误码/文案/界面/素材先登记再编码 | 冻结 | AGENTS.md、04_EventCatalog.md §3 |
| D-071 | 2026-11 | 文案唯一来源 CopyDeck：key 由 id 推导，`export:copy` 生成 JSON，Validator 反向覆盖校验 | 冻结 | 02_CopyDeck.md §8 |
| D-072 | 2026-11 | 文档交叉引用校验脚本化（A7），取代人工核对 | 冻结 | 00_Index.md、09_Workflow.md §4 |

## 6. 补充规则（2026-11-17 一致性补丁）

> 均为已冻结决策的**执行细则补充**，不改变原结论；逐条可溯到来源章节。

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-073 | 出口卡单击即检查（不走两段式）；`collect` 只查局内可用道具；`pay` 走 `exit_pay` 动作 | 冻结 | 13_Exit.md §1～§2 |
| D-074 | 少堆（≤3）改用固定大位布局、不按 5×5 网格渲染；多堆才走网格缩略 | 冻结 | 00_UiSpec.md §6 |
| D-075 | 道具造成的击杀不计入连击 | 冻结 | 05_Combo.md §2 |
| D-076 | 浅堆占比按 ⌈堆数×0.4⌉ 向上取整（2 堆至少 1 浅） | 冻结 | 06_Levels.md §3.1.1 |
| D-077 | 事件选项取消后事件卡保留堆顶，不耗食物不入队 | 冻结 | 03_Cards.md F 节 |
| D-078 | 同名状态重复施加时 `duration` 取 max，不累加 | 冻结 | 02_Player.md §2.1 |
| D-079 | dark 堆翻开即转 lit；多堆驻留时各自封锁所在堆 | 冻结 | 10_Battle.md §2 |
| D-080 | 商店购买只入仓库、不校验携带容量，放置时才报容量错误 | 冻结 | 16_Shop.md §3 |
| D-081 | 重开本关通关计入矿点次数；失败/中途退出/放弃不计 | 冻结 | 04_MetaProgression.md §2 |
| D-082 | 金币入账文案统一为"已存入钱袋"（钱包 ≠ 道具背包） | 冻结 | 02_CopyDeck.md §5 |
| D-083 | 同一 priority 内按 effects 数组顺序稳定排序；condition/target 执行时求值 | 冻结 | 03_ActionQueue.md §3 |
| D-084 | 准备档口返回主菜单不写断点，断点自 PlayerTurn 起生成 | 冻结 | 02_StateMachine.md §2 |
| D-085 | 存档节流窗口遇 onHide/退出立即 flush；备份按 updatedAt 取最新可用 | 冻结 | 10_CodingStandards.md §4.1 |
| D-086 | Balance 工作簿 sheet 与列 schema 冻结（导出脚本输入契约） | 冻结 | 06_DataBalance.md §3 |
| D-087 | hash 固定 FNV-1a 32；商店种子含 refreshCount；meta 流不依赖 uid | 冻结 | 06_DataBalance.md §4 |
| D-088 | 存档字段调整：`claimedRewardKeys` → `claimedAchievements`；`deepestStage` 由 `unlockedLevel` 推导 | 冻结 | 10_CodingStandards.md §4 |
| D-089 | `overrideMeta` 作用于整组起始资源；`start_food` 累计四舍五入（1/1/2/2/3/3） | 冻结 | 04_MetaProgression.md §3、§8 |
| D-090 | 头像不写档，仅当次会话展示，重启回默认剪影 | 冻结 | 03_Screens.md §2 |

## 7. 拍板结论（2026-11-17，TBD-27～31 关闭）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-091 | 连击档位封顶 8（超过累计不奖励）；中断仅认 HP 实际减少的直接伤害 | 冻结 | 05_Combo.md §3～§4 |
| D-092 | 同堆同卡上限 `max(2, ceil(depth/类型数))`，`fixedCards` 豁免，跨堆不设限 | 冻结 | 06_Levels.md §3 |
| D-093 | DIFF 的 D 因子改为**目标路径深度**（出口/机关钉位堆），全盘总量不计难度 | 冻结 | 06_Levels.md §3.1.1～§3.1.2 |
| D-094 | 树价格表述改"近似 ×1.5～1.6"；新增 `diamondEarnedTotal` 记收集成就值 | 冻结 | 04_MetaProgression.md §2、§4、§8 |
| D-095 | 满栈：商店阻止购买（`ITEM_STACK_FULL`）；签到/奖励折算钱包金币（`overflowGoldRate` 默认 1.0） | 冻结 | 16_Shop.md §3、17_SignIn.md §3 |
| D-096 | 分享奖励保留，补 `shareDaily`；落地校验 `levelId <= unlockedLevel` | 冻结 | 05_Share.md §2～§3 |
| D-097 | 复审项"2 堆浅堆比"关闭：取整规则 ⌈N×0.4⌉ 已覆盖，无需额外豁免 | 冻结 | 06_Levels.md §3.1.1 |

## 8. 维护方式

1. 新增决策：按域编号顺延（0xx 项目 / 1xx 玩法 / 3xx 经济 / 5xx 工程 / 7xx 文档），先登记后改正文。
2. 推翻决策：原行状态改"已废止（被 D-xxx 取代）"，新行写新结论与原因。
3. 基线类决策在实测后升级为"冻结"或调整为新基线，并在来源文档同步数值。
4. 每次登记后运行 `node scripts/check-doc-refs.mjs`，确保引用未断。
