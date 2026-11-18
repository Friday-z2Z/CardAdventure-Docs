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
| D-018 | 2026-11 | 装备不入背包、关末消失；替换入口只有"翻到同槽位新装备"，不可主动卸下 | **部分废止**（"全部关末消失"被 D-144 取代：饰品跨关） | 03_Cards.md D 节 |
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
| D-091 | 连击档位封顶 8（超过累计不奖励）；中断仅认 HP 实际减少的直接伤害 | **部分废止**（中断阈值被 D-148 取代：≥3 伤害；封顶 8 仍有效） | 05_Combo.md §3～§4 |
| D-092 | 同堆同卡上限 `max(2, ceil(depth/类型数))`，`fixedCards` 豁免，跨堆不设限 | 冻结 | 06_Levels.md §3 |
| D-093 | DIFF 的 D 因子改为**目标路径深度**（出口/机关钉位堆），全盘总量不计难度 | 冻结 | 06_Levels.md §3.1.1～§3.1.2 |
| D-094 | 树价格表述改"近似 ×1.5～1.6"；新增 `diamondEarnedTotal` 记收集成就值 | 冻结 | 04_MetaProgression.md §2、§4、§8 |
| D-095 | 满栈：商店阻止购买（`ITEM_STACK_FULL`）；签到/奖励折算钱包金币（`overflowGoldRate` 默认 1.0） | 冻结 | 16_Shop.md §3、17_SignIn.md §3 |
| D-096 | 分享奖励保留，补 `shareDaily`；落地校验 `levelId <= unlockedLevel` | 冻结 | 05_Share.md §2～§3 |
| D-097 | 复审项"2 堆浅堆比"关闭：取整规则 ⌈N×0.4⌉ 已覆盖，无需额外豁免 | 冻结 | 06_Levels.md §3.1.1 |

## 8. 结构补全（2026-11-17 第二轮审计）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-098 | `EnemyDefinition` 定稿（含 `skillBonus` / `effects` / `threat` / 奖励字段） | 冻结 | 03_Cards.md §2 |
| D-099 | `EffectDefinition` 补 `params` 与 `consume`：七类效果的参数 schema 定稿 | 冻结 | 03_ActionQueue.md §3 |
| D-100 | 减免与取消分层：`blockedByShield`/`ignoreDefense` 管数值，`cancelable` 管免疫/取消 | 冻结 | 03_ActionQueue.md §3 |
| D-101 | 每关局内金币净收入带基线：8～14 / 15～25 / 25～40 / 40～60 / 60～90（±30%） | 基线 | 09_BalanceBaseline.md §5 |
| D-102 | `surviveTurns` 撑满 N 回合只解锁出口、不直接通关 | 冻结 | 06_Levels.md §3、13_Exit.md §1 |
| D-103 | 复活为原地续战、不回滚（致死行动已结算），仅恢复 50% HP 与清 Combo | 冻结 | 01_Monetization.md §5 |
| D-104 | 资源上限与易伤倍率进 Balance `limits`（99/30/99999/1.5/8），不再散落正文 | 冻结 | 06_DataBalance.md §3、11_Resources.md §1 |
| D-105 | 分享图 600×480（5:4，24px 安全边，≤200KB）；分享文案 key 登记 CopyDeck §9 | 冻结 | 05_Share.md §4、02_CopyDeck.md §9 |
| D-106 | 新增 `18_LevelProduction.md`：关卡 JSON 模板、阶段参数包、机制组合矩阵（草案）、20 项检查清单 | 冻结 | 18_LevelProduction.md |

## 9. 第三轮优化（2026-11-17）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-107 | 敌人卡只保留 `enemyId` 指向，数值与机制全部读 `EnemyDefinition` | 冻结 | 03_Cards.md §2、A 节 |
| D-108 | 效果支持 `valueRange`（与 `value` 互斥），随机走 `level` 子流 | 冻结 | 03_ActionQueue.md §3 |
| D-109 | JSON 只写结构与引用，数值由 `export:balance` 注入；缺数值不视为错误 | 冻结 | 06_DataBalance.md §3 |
| D-110 | 字段更名：`cardPoolIds` → `cardIds`、`composition[].cardPoolId` → `cardId` | 冻结 | 06_Levels.md §3 |
| D-111 | 8 个 services 接口给出最小方法集（B1 按此出空实现） | 冻结 | 00_Architecture.md §5 |
| D-112 | `weakness` 只在阶段二起投放（阶段一攻击 1 会被 max(1) 保底吞掉） | 冻结 | 02_Player.md §2.2 |
| D-113 | Shield 不随回合衰减，关卡结束清零；上限 `limits.shieldCap` | 冻结 | 11_Resources.md §1 |
| D-114 | 状态 `duration`：施加当回合不递减，priority 50 tick 后 −1 | 冻结 | 02_Player.md §2.1 |
| D-115 | `exempt` 卡免食物成本，同时免 `exhausted` 加成 | 冻结 | 03_Cards.md §2 |
| D-116 | `evt_merchant` 打开即触发，交易或关闭后移除，不可重复开启 | 冻结 | 07_CardCatalog.md §6 |
| D-117 | `difficultyWeights` 的 `pile` 统一为 `stack` | 冻结 | 06_DataBalance.md §3 |
| D-118 | 结算页不弹 RewardPopup；`POPUP_BAG` 增 `BagMode`；dark 出口卡翻开只读检查后转 lit；`player_damaged.source` 五值枚举 | 冻结 | 03_Screens.md、02_CopyDeck.md §5、13_Exit.md §2、04_EventCatalog.md |
| D-119 | 广告点位枚举、存档单档 ≤200KB、模拟器加"道具辅助"策略、组件常量表、版本/CI 基线、变更日志 | 冻结 | 01_Monetization.md §5、10_CodingStandards.md §4、06_Levels.md §5.1、03_Screens.md §4、00_Architecture.md §7、05_Project/03_Changelog.md |

## 10. TBD 清理（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-120 | 精英机制首批取「再生 + 荆棘」，另两个留阶段四 | 冻结 | 14_EliteBoss.md §1 |
| D-121 | 敌人状态卡基线：毒 2 层、灼烧 2 层 | 基线 | 09_BalanceBaseline.md §4 |
| D-122 | 图鉴新增成就改"完成度 %"口径，MVP 23 张成就保留 | 冻结 | 04_MetaProgression.md §7 |
| D-123 | 日榜前 50 名、V1 不翻页 | 冻结 | 02_Leaderboard.md §1 |
| D-124 | 无障碍 V1 只保底线，细则留 V2 | 冻结 | 12_Delivery_Risk.md §3.1 |
| D-125 | 转场复用 UiSpec §5.1 时长上限，不另立规范 | 冻结 | 00_UiSpec.md §5.1 |
| D-126 | 多语言 / 每日关 / 云存档 V1 不做，归档保留扩展位 | 暂缓 | 06_Levels.md §3.1、10_CodingStandards.md §4 |
| D-127 | 合并：TBD-08→12、09→10、20→11；19 缩为"额度与告警实测" | 冻结 | 02_TbdRegister.md §1 |
| D-128 | 截止调整：TBD-01→M-C；13→M-D（M-B 只做探针）；15→M-D 设计/M-F 实测；04/06 与卡池冻结拆分 | 冻结 | 02_TbdRegister.md §1 |
| D-129 | 主体/备案/软著改挂"外部依赖"，按周期倒排最晚启动日（软著 T-4 个月） | 冻结 | 02_TbdRegister.md §2 |
| D-130 | 特殊机制卡降级为「交换顶层」1 张最小验证，整类留阶段四 | 冻结 | 07_CardCatalog.md §9 |
| D-131 | 强制更新最小方案：低于最低版本提示，不阻断已下载内容 | 冻结 | 12_Delivery_Risk.md §3.1 |

## 11. 内容定稿（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-132 | 商人货单：6 件货、基价 3～8、阶段系数 1.0/1.2/1.4/1.6/1.8、每次 3 格无放回、门槛 3 金币 | 基线 | 07_CardCatalog.md §6 |
| D-133 | 特殊机制卡最小验证：`spec_reverse_stack`（反转本堆）；`transformStack.targetStackId` 可省略 = 本堆 | 冻结 | 07_CardCatalog.md §6、03_ActionQueue.md §3 |
| D-134 | 首个首领 `boss_drowned_warden`：HP18/ATK3/DEF2，阶段一荆棘、阶段二再生，文案入 CopyDeck §10 | 基线 | 14_EliteBoss.md §2 |
| D-135 | 500 关按 22 批生产；阶段一 20 关逐关清单与生成器抽样规格定稿 | 冻结 | 18_LevelProduction.md §9～§11 |
| D-136 | 图鉴 Tab 补「特殊机制」，与 CardType 全集对齐 | 冻结 | 03_Screens.md §2.1 |

## 12. 运行期方案（2026-11-18，TBD-10～19 收口）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-137 | 字体：正文系统字体 + 标题思源宋体子集（OFL，≤600KB，CDN，失败回退系统）；不采购商业中文字体 | 冻结 | 00_UiSpec.md §2 |
| D-138 | 画质三档（高/中/低）+ 自动降档（10s 均值跌破阈值）+ 手动覆盖，存 `SettingsData.quality` | 冻结 | 05_Performance.md §4 |
| D-139 | 主包预算分配表（引擎 1.6 / 代码 0.4 / 字体 0.5 / UI 0.6 / 首 5 关 0.5 / 音频 0.15 / 缓冲 0.25 = 4.0MB），单项超限告警、总量超限构建失败 | 基线 | 03_Packaging.md §1 |
| D-140 | 更新策略：有新版本只提示不阻断；仅 `hardMinVersion` 可阻断进关 | 冻结 | 07_Ops_Release.md §3.1 |
| D-141 | 云开发：`daily_score` 集合 + 索引、云函数写入校验、日榜前 50、90 天清理、三类告警 | 冻结 | 07_Ops_Release.md §4.1 |
| D-142 | 经济离线校准：每阶段 1000 局"钱够就买"策略，判据为钱包增速 ≤ 难度增速且购买率 ≥10% | 基线 | 16_Shop.md §5 |
| D-143 | 平衡离线校准：1000 局模拟 + 阈值 15% + 每阶段抽 5 关试玩；复活"愿意再试"≥7/10 | 基线 | 06_Levels.md §6、01_Monetization.md §2 |

## 13. 玩法优化（2026-11-18，A/B/C 组）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-144 | 装备词条：common 1 / uncommon 2 / ~~rare 3~~；**饰品跨关保留 1 件**（`ProgressData.equippedTrinket`），武器护甲仍关末消失 | **部分废止**（词条数被 D-164 改为 rare 2；跨关部分仍有效） | 03_Cards.md D 节、11_Resources.md §3 |
| D-145 | 深堆价值梯度：每堆尾部 `max(2, ceil(depth×0.3))` 张必须来自 `highValuePool` | 冻结 | 06_Levels.md §3 |
| D-146 | 首领机制池新增"盘面干扰"；沉水守卫 P2 改为再生 + 潮涌（每 3 回合 shuffle 一堆，提前 1 回合预告） | 基线 | 14_EliteBoss.md §1～§2 |
| D-147 | 食物不足惩罚：首次 −2 HP、之后每次 −1 HP（原为每次 −2） | 基线 | 01_CoreLoop.md §4、09_BalanceBaseline.md §3 |
| D-148 | 连击中断改为"单次受到 ≥3 伤害"，1～2 点小伤害不中断 | 基线 | 05_Combo.md §4 |
| D-149 | 新增侦察道具"火把"（`item_torch`，rare）：查看指定暗堆顶 2 张，新增 `reveal` 效果类型 | 冻结 | 03_Cards.md §2、04_Items.md §4、03_ActionQueue.md §3 |
| D-150 | 连续失败 2 次显示"换个开局重试"：随机关换种子、固定关保持原种子 | 冻结 | 01_CoreLoop.md §5、02_StateMachine.md §2 |
| D-151 | 内容节奏：每 3 关 1 个新元素，中间 2 关复习 | 冻结 | 18_LevelProduction.md §5 |
| D-152 | HUD 渐进披露：前 5 关逐关点亮，跳过引导则一次性全显 | 冻结 | 15_Tutorial.md §3、03_Screens.md §2.1 |
| D-153 | 新增赌性事件卡"诅咒宝箱"（+8 金币、中毒 2 层，可放弃） | 基线 | 07_CardCatalog.md §6 |
| D-154 | 每日种子挑战、失败复盘登记为 TBD-32 / TBD-33（V1.1 与上线后） | 暂缓 | 02_TbdRegister.md §1 |

## 14. 全量卡池与道具（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-155 | 全旅程卡池 **66 张** = 阶段一 23 + 扩展 43（二 6 / 三 16 / 四 16 / 五 5）；首领数值按该阶段普通上限 ×1.5 | 基线 | 03_Cards.md §4～§5、07_CardCatalog.md §9 |
| D-156 | 道具全量 **20 件**（一 11 / 二 3 / 三 3 / 四 2 / 五 1）；商店可售 17、可携带 19 | 基线 | 04_Items.md §4、16_Shop.md §2 |
| D-157 | 07 §9 数量修正为 +43 / 66 张；阶段二～五说明文案随 TBD-06 登记，未登记不得进配置 | 冻结 | 07_CardCatalog.md §9 |
| D-158 | 扩展卡所需 8 项效果/触发能力（TBD-34）：先登记 `03_ActionQueue.md` §3 词汇表并实现，扩展卡才允许进配置 | 冻结 | 03_Cards.md §5.1 |

## 15. TBD-34 扩展契约（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-159 | 扩展卡 8 项能力定稿并写入词汇表（buff / on_enemy_attack / shieldAtLeast / interval / consume.slot / lockedUntilTurn / spawnCard.source / on_player_died）；**不阻塞 MVP**，分 M-D（5 项）与阶段四前（3 项）两批实现 | 冻结 | 03_ActionQueue.md §3、03_Cards.md §5.1 |
| D-160 | TBD-34 拆分：TBD-34 前 5 项（M-D）、TBD-34b 后 3 项（阶段四前），MVP/B2 不做扩展实现 | 冻结 | 02_TbdRegister.md §1 |

## 16. 文案与首领预告（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-161 | 43 张扩展卡的玩家可见说明文案登记入 07 §10～§13（与 03 §5 结构一一对应） | 冻结 | 07_CardCatalog.md §10～§13 |
| D-162 | 5 个新首领的 `announce` 文案登记（enter / phase2 各 1），命名规则 `boss_{id}_enter` 与 `boss_{id}_phaseN` | 冻结 | 02_CopyDeck.md §10 |

## 17. 文案导出输入（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-163 | `export:copy` 输入扩为三处：CopyDeck（道具/状态/错误码/系统/分享/首领）+ 07 卡牌表（名称与说明）+ 04_Items 名称列；key 规则 `copy_{cardId}_name` / `copy_{cardId}_desc` | 冻结 | 02_CopyDeck.md §8、06_DataBalance.md §3 |

## 18. 装备词条修订（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-164 | 装备词条数改为 **common 1 / uncommon 2 / rare 2**；rare 用强化版词条（如坚壁 −2）而非堆数量。5 件 rare 补齐第二条：银刃 +猎金、鳞甲 +守势、墓环 +回春、烬火剑 +猎金、守望披风 +守势 | 冻结 | 03_Cards.md §3-D、§5 |

## 19. 装备进池配额（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-165 | 全关卡池装备卡 **≥1 张**（阶段三起 ≥2 张），同一槽位 ≤1；钉位装备计入配额；Validator 与生成器规格同步校验 | 冻结 | 06_Levels.md §3、18_LevelProduction.md §11 |

## 20. 关卡文案（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-166 | 阶段一 20 关登记关卡名与目标文案，key 规则 `copy_level_XXXX_name` / `copy_level_XXXX_objective`；样例与模板同步替换 `key:` 引用 | 冻结 | 02_CopyDeck.md §6、06_Levels.md §3、18_LevelProduction.md §10 |

## 21. 内容密度补足（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-167 | 装备补至 14 件（阶段二 +2、四 +2、五 +2）；新增词条「反震」「坚韧」，epic 装备 3 条词条 | 基线 | 03_Cards.md §3-D、§5 |
| D-168 | 道具补至 26 件（阶段三 +1、四 +3、五 +2）；商店可售 22、可携带 25 | 基线 | 04_Items.md §4、16_Shop.md §2 |
| D-169 | 阶段五补 2 个普通敌人 + 1 个事件，普通敌人达 4 种；全卡池 66 → 75 张 | 基线 | 03_Cards.md §5、07_CardCatalog.md §9 |
| D-170 | 新增「阶段内容预算」表（18 §12）并纳入 `check-doc-refs.mjs` 校验；生产清单加第 21 条 | 冻结 | 18_LevelProduction.md §12、scripts/check-doc-refs.mjs |

## 22. 精英/陷阱补足（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-171 | 精英 +4：阶段四熔渣守卫、烬火执事；阶段五星甲巨卫、黑纱主教 | 基线 | 03_Cards.md §5 |
| D-172 | 陷阱 +3（灰烬地雷、火星喷口、地裂口）、事件 +2（灰烬契约、回音石碑）；卡池 75 → 84 | 基线 | 03_Cards.md §5、07_CardCatalog.md §9 |
| D-173 | 阶段内容预算增加「精英」「陷阱」两列（合计下限 6 / 8），脚本密度检查同步 | 冻结 | 18_LevelProduction.md §12、scripts/check-doc-refs.mjs |

## 23. 内容差异化（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-174 | 道具 26 → 31：新增通行令（flag 出口）、血怒药剂（攻 +2 换中毒）、行军干粮（食物换血）、护盾药剂（防御 buff）、巨木根（MaxHP buff）——全部用现有效果词汇，不新增类型 | 基线 | 04_Items.md §4 |
| D-175 | 装备 14 → 16：刺客匕首（乘胜 + 猎金）、烬火法杖（破竹 + 乘胜）；新增词条「乘胜」；卡池 84 → 86 | 基线 | 03_Cards.md §3-D、§5 |

## 24. 商店稀有度重排（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-176 | 战鼓、铁片护符、强化火把由 rare 降为 uncommon；价格区间补 uncommon 8～12；可售满池分布定为 common 5 / uncommon 11 / rare 9 / epic 2，单件 rare ≈0.56%/槽；M-C 按 TBD-35 复核 | **部分废止**（权重与单件概率被 D-177 取代：rare 4% / epic 1%） | 04_Items.md §4、16_Shop.md §2～§3、09_BalanceBaseline.md §5 |

## 25. 稀有度语义（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-177 | `legendary` 预留但 V1 禁止配置（Card/Item Validator 拦截）；非装备卡 rarity 仅用于展示/图鉴/奖励权重，不影响数值；epic 入店 1%（rare 5%→4%）并补价格带 20～30；奖励稀有度权重 60/30/9/1 | **部分废止**（legendary 启用，禁配条款被 D-178 取代） | 03_Cards.md §2、16_Shop.md §2～§3、09_BalanceBaseline.md §5 |
| D-178 | **传奇启用**（固定来源制）：`eq_worlds_end_blade` 终末之刃（legendary 武器，仅 level_0500 钉位）；`item_eternal_ember` 永恒火种（legendary 被动，`ach_clear_500` 发放）；legendary 3 条词条 + 1 条唯一词条，不入商店与随机池，无价格带 | **部分废止**（火种被 D-179、终末之刃钉位被 D-180 取代） | 03_Cards.md §2～§3、04_Items.md §4、04_MetaProgression.md §7、18_LevelProduction.md §9 |
| D-179 | 火种改为**一次性消耗品**（使用后本关首次致死复活 50%，触发即消耗），来源改为 `ach_stage4_clear`（通关 320）；`ach_clear_500` 只发钻石与图鉴记录——通关后再发消耗品无使用场景 | **部分废止**（500 关成就的钻石被 D-180 取消） | 04_Items.md §4、04_MetaProgression.md §7 |
| D-180 | 终末之刃钉位扩为 `level_0480`（传说试炼）与 `level_0500` 两关；`ach_clear_500` 只发图鉴记录与称号，不发道具与钻石——通关后无使用/消费场景 | 冻结 | 03_Cards.md §5、18_LevelProduction.md §9、04_MetaProgression.md §7 |

## 26. level_0480 与成就导出（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-181 | `level_0480` 定为阶段五"传说试炼"展示关：12 堆 / 4 dark / 4 敌 killAll / 2 陷阱 / Food 12 / DIFF 78；终末之刃钉位 index 8（12 食物可及），压力放在食物与陷阱而非敌人血量 | 基线 | 18_LevelProduction.md §13 |
| D-182 | 成就奖励数值化：`ach_clear_500.diamond = 0` 表示仅记录（非占位符）；Balance 新增 `achievements` sheet（`diamond / itemId / itemQty / trigger`） | 冻结 | 04_MetaProgression.md §7、06_DataBalance.md §3 |

## 27. 命名规范（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-183 | 卡牌与道具名称统一为「材质 / 形态 + 具体物件或生物」，禁止纯抽象概念型命名；27 个名称重命名（ID 不变），玩家可见文案同步改写 | 冻结 | 07_CardCatalog.md §9 |
| D-184 | 修正 03 §5 / 07 §10～§13 的阶段标题计数为 8 / 17 / 24 / 15，与 87 张卡池一致 | 冻结 | 03_Cards.md §5、07_CardCatalog.md §10～§13 |

## 28. 商店刷新定价（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-185 | 商店刷新由递增 2/4/8… 改为**固定 5 钱包金币/次**（Balance `shop.refreshCost`，不递增）；每日首次免费、广告再免 1 次保持不变；`refreshCount` 仍递增以换货架 | 冻结 | 16_Shop.md §2、09_BalanceBaseline.md §5 |

## 29. 商店货架数量（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-186 | 商店货架由 4～6 件改为**固定 5 件/次**（Balance `shop.slotCount`）；单件 rare/epic 出现概率按 5 槽重算为约 2.2% / 2.5% | 冻结 | 16_Shop.md §2、09_BalanceBaseline.md §5 |

## 30. 全量审计补丁（2026-11-18）

| ID | 决策 | 状态 | 来源 |
|---|---|---|---|
| D-187 | CopyDeck §6 重复的 `key:copy_level_0003_objective` 删除，保留阶段一 20 关表中的唯一条目；`check-doc-refs.mjs` 新增 CopyDeck key 唯一检查 | 冻结 | 02_CopyDeck.md §6、scripts/check-doc-refs.mjs |
| D-188 | `item_eternal_ember.useType = "instant"`（使用后写入本关致死免疫标记并消耗），不是 passive | 冻结 | 04_Items.md §4 |

## 31. 维护方式

1. 新增决策：取当前最大编号 +1 顺延（按 00x 项目 / 01x～02x 玩法 / 03x 经济 / 05x 工程 / 07x 文档 分段，跨段不保证连续），先登记后改正文。
2. 推翻决策：原行状态改"已废止（被 D-xxx 取代）"，新行写新结论与原因。
3. 基线类决策在实测后升级为"冻结"或调整为新基线，并在来源文档同步数值。
4. 每次登记后运行 `node scripts/check-doc-refs.mjs`，确保引用未断。
