# 变更日志（Changelog）

> 规则：每次提交批次（含纯文档）追加一行；**不删除历史行**。版本号对应 `06_DataBalance.md` §5 的工程版本，文档阶段统一记 `docs`。
> 详细决策见 `00_DecisionLog.md`，未决项见 `02_TbdRegister.md`。

## 2026-11-17

| 批次 | 类型 | 变更摘要 | 影响文件 |
|---|---|---|---|
| docs-r1 | 勘误 | 修正文档间冲突：文档计数、步骤编号、伤害公式权威、缩略尺寸 140、掉落错峰公式、hp_up 数值、事件数、道具可售数、CopyDeck 章节与重复 key | README、00_Index、01_CoreLoop、02_Player、03_Cards、06_Levels、08_Roadmap、11_Resources、16_Shop、00_UiSpec、02_CopyDeck、03_Screens、02_StateMachine、16_Shop、04_MetaProgression |
| docs-r2 | 结构 | 补齐编码阻塞项：GameState/Stack/Card/Enemy 运行时、Action 结构、事件选项 schema、SaveData/RunSnapshot、随机子流、数值真源、npm 脚本契约、i18n 与目录 | 01_GameState、03_ActionQueue、03_Cards、10_CodingStandards、06_DataBalance、00_Architecture、04_MetaProgression、06_Levels |
| docs-r3 | 数值 | 补状态效果基线、奖励倍率与取整口径、DIFF 口径与模拟器规格、抽卡算法、多敌同场 | 02_Player、09_BalanceBaseline、12_Rewards、06_Levels、10_Battle |
| docs-r4 | 平台 | 包体限额与瘦身预案、头像昵称能力、榜单 KV 与防刷、埋点来源、错误码补登、对象池上限 | 00_Compliance、02_Leaderboard、03_Packaging、06_Analytics、10_CodingStandards、05_Performance |
| docs-r5 | 维护 | 新增决策记录/术语表/TBD 登记表；新增交叉引用校验脚本；A7 关闭 | 05_Project/*、scripts/check-doc-refs.mjs、00_Index、README、AGENTS |
| docs-r6 | 一致性 | 冻结项审计：出口判定、少堆布局、道具击杀连击、浅堆取整、商店阶段限定、钱袋文案；B 组 12 条执行细则 | 13_Exit、00_UiSpec、05_Combo、06_Levels、16_Shop、02_CopyDeck、10_CodingStandards、02_StateMachine、10_Battle |
| docs-r7 | 拍板 | 连击封顶 8、同堆同卡上限、D 因子改路径深度、树价表述与 `diamondEarnedTotal`、满栈规则、分享 `shareDaily` | 05_Combo、09_BalanceBaseline、06_Levels、04_MetaProgression、16_Shop、17_SignIn、05_Share |
| docs-r8 | 结构 | `EnemyDefinition`、`EffectDefinition` 参数与 `consume`、净收入带、surviveTurns、复活语义、limits、分享文案、关卡生产手册 | 03_Cards、03_ActionQueue、09_BalanceBaseline、06_Levels、13_Exit、01_Monetization、02_CopyDeck、05_Share、18_LevelProduction |
| docs-r9 | 数据/工程 | 敌人卡 `enemyId`、数值区间、JSON 与 Balance 合并边界、`cardIds` 重命名、services 接口签名、护盾/状态时长/疲劳口径、结算页互斥、BagMode、组件常量、版本与 CI 基线、存档体积上限 | 03_Cards、03_ActionQueue、06_DataBalance、00_Architecture、11_Resources、02_Player、13_Exit、04_EventCatalog、03_Screens、10_CodingStandards |

| docs-r10 | 流程 | TBD 表重构：拆待办/外部依赖/已定三区，补依赖与关闭判据；关闭 9 项、合并 4 组、截止调整 4 项 | 05_Project/02_TbdRegister、14_EliteBoss、07_CardCatalog、04_MetaProgression、12_Delivery_Risk、08_Roadmap、00_Index |

| docs-r11 | 内容 | TBD-01/03/04 定稿：商人货单、特殊机制最小卡、首个首领；TBD-06 完成批次计划与阶段一 20 关清单 | 07_CardCatalog、03_ActionQueue、03_Screens、14_EliteBoss、02_CopyDeck、18_LevelProduction、06_Levels、11_Testing |

| docs-r12 | 运行期 | 字体方案、画质三档、主包预算表、更新策略、云开发集合/清理/告警、经济与平衡离线校准口径、复活验收 | 00_UiSpec、05_Performance、10_CodingStandards、03_Packaging、07_Ops_Release、16_Shop、01_Monetization、06_Levels、12_Delivery_Risk、11_Testing |

| docs-r13 | 玩法 | A/B/C 组优化：装备词条与饰品跨关、深堆价值梯度、Boss 盘面机制、食物惩罚软化、连击阈值、火把侦察、换开局、节奏规则、HUD 渐进披露、诅咒宝箱；D 组登记 TBD-32/33 | 03_Cards、06_Levels、14_EliteBoss、05_Combo、01_CoreLoop、11_Resources、09_BalanceBaseline、04_Items、16_Shop、07_CardCatalog、15_Tutorial、03_Screens、02_CopyDeck、10_CodingStandards、02_StateMachine、06_DataBalance、18_LevelProduction |

| docs-r14 | 文档 | 03_Cards 新增"首批 23 张卡牌清单"结构索引（数值与文案仍以 07 为准） | 03_Cards、00_Index |

| docs-r15 | 内容 | 全旅程卡池 66 张（新增 43 张逐张效果与 threat）与道具全量 20 件；商店货池与计数同步 | 03_Cards、07_CardCatalog、09_BalanceBaseline、04_Items、16_Shop、04_MetaProgression、02_CopyDeck、00_Index |

| docs-r16 | 工程 | TBD-34 定稿：8 项扩展写入 `EffectDefinition`（buff / interval / consume.slot / spawnCard.source）与 trigger 词表（on_enemy_attack / on_player_died）；拆为 TBD-34（M-D）与 TBD-34b（阶段四前），明确不阻塞 MVP | 03_ActionQueue、03_Cards、11_Testing、02_TbdRegister、00_DecisionLog、00_Index |

| docs-r17 | 文案 | 补齐阶段二～五 43 张卡说明文案（07 §10～§13）与 5 个新首领 announce（CopyDeck §10）；TBD-06 输入齐备 | 07_CardCatalog、02_CopyDeck、02_TbdRegister、00_DecisionLog |

| docs-r18 | 文案 | 修正导出契约：`export:copy` 输入扩为 CopyDeck + 07 卡牌表 + 04_Items 名称列，卡牌 key 规则补齐 | 02_CopyDeck、06_DataBalance、00_DecisionLog |

| docs-r19 | 平衡 | 装备词条数改 common 1 / uncommon 2 / rare 2（rare 允许强化版词条）；5 件 rare 各补第二条词条 | 03_Cards、11_Testing、00_DecisionLog |

| docs-r20 | 关卡 | 新增装备进池配额：全关 ≥1（阶段三起 ≥2）、同槽 ≤1、钉位计入；Validator 与生成器规格同步 | 06_Levels、18_LevelProduction、06_DataBalance、11_Testing、00_DecisionLog |

| docs-r21 | 文案 | 登记阶段一 20 关关卡名与目标文案（40 条 key），关卡样例与模板改用 `key:copy_level_XXXX_*` | 02_CopyDeck、06_Levels、18_LevelProduction、11_Testing、00_DecisionLog |

| docs-r22 | 内容 | 装备 8→14、道具 20→26、阶段五敌人 +2 与事件 +1（卡池 66→75）；新增 18 §12 内容预算表与脚本密度校验 | 03_Cards、07_CardCatalog、09_BalanceBaseline、04_Items、16_Shop、04_MetaProgression、02_CopyDeck、18_LevelProduction、11_Testing、scripts/check-doc-refs、00_DecisionLog |

| docs-r23 | 内容 | 补 4 精英、3 陷阱、2 事件（卡池 75→84）；预算表加精英/陷阱列，脚本密度检查同步 | 03_Cards、07_CardCatalog、09_BalanceBaseline、18_LevelProduction、scripts/check-doc-refs、00_DecisionLog |

| docs-r24 | 内容 | 道具 26→31（规则型/风险型 5 件）、装备 14→16（匕首/法杖）、词条 +乘胜；卡池 84→86 | 03_Cards、04_Items、07_CardCatalog、09_BalanceBaseline、16_Shop、04_MetaProgression、02_CopyDeck、00_DecisionLog |

| docs-r25 | 平衡 | 3 件 rare 降 uncommon（战鼓/铁片护符/强化火把），补 uncommon 价格区间 8～12；可售分布 5/11/9/2；登记 TBD-35 | 04_Items、16_Shop、09_BalanceBaseline、02_TbdRegister、00_DecisionLog |

| docs-r26 | 平衡 | 稀有度语义定稿：legendary 预留禁配、非装备卡 rarity 仅展示、epic 入店 1% 并补价格带、奖励权重 60/30/9/1 | 03_Cards、16_Shop、09_BalanceBaseline、06_DataBalance、11_Testing、02_TbdRegister、00_DecisionLog |

| docs-r27 | 内容 | 传奇启用（固定来源）：终末之刃（level_0500 钉位）、永恒火种（ach_clear_500）；卡池 87、道具 32；传奇不入店/随机池 | 03_Cards、04_Items、07_CardCatalog、09_BalanceBaseline、16_Shop、04_MetaProgression、18_LevelProduction、02_CopyDeck、06_DataBalance、11_Testing、00_DecisionLog |

| docs-r28 | 修正 | 火种来源从通关 500 关改为通关 320 关，形态改为一次性消耗品；500 关成就只发钻石 | 04_Items、04_MetaProgression、11_Testing、00_DecisionLog |

| docs-r29 | 修正 | 终末之刃钉位扩为 480/500 两关（新增传说试炼固定关）；500 关成就改为只发图鉴记录与称号，不发钻石与道具 | 03_Cards、18_LevelProduction、04_MetaProgression、11_Testing、00_DecisionLog |

| docs-r30 | 关卡 | 补 level_0480 完整设计（展示关、钉位与平衡口径）；成就表改为数值 0 并新增 Balance `achievements` sheet | 18_LevelProduction、02_CopyDeck、04_MetaProgression、06_DataBalance、11_Testing、00_DecisionLog |

| docs-r31 | 文案 | 命名审计：27 个卡牌/道具改为具体名词（如影号手/丧钟巨像/回音石碑/铁片护符），文案同步；修正阶段表标题计数 | 03_Cards、07_CardCatalog、04_Items、02_CopyDeck、16_Shop、18_LevelProduction、00_DecisionLog |

| docs-r32 | 经济 | 商店刷新改为固定 5 金币/次（取消 2/4/8 递增）；Balance `shop.refreshCost` 与测试同步 | 16_Shop、09_BalanceBaseline、06_DataBalance、11_Testing、00_DecisionLog |

| docs-r33 | 经济 | 商店货架固定 5 件/次，刷新概率按 5 槽重算；Balance `shop.slotCount` 与测试同步 | 16_Shop、09_BalanceBaseline、06_DataBalance、11_Testing、00_DecisionLog |

| docs-r34 | 审计 | 删除重复的关卡目标 key、脚本新增 key 唯一检查；明确永恒火种 useType=instant | 02_CopyDeck、scripts/check-doc-refs、04_Items、00_DecisionLog |

## 待发布

| 目标版本 | 计划内容 |
|---|---|
| v0.1（M-B） | 工程初始化、纯逻辑核心、最小规则集、matrix5 演示屏 |
| v0.2（M-C） | 道具、状态、连击、存档闭环 |
