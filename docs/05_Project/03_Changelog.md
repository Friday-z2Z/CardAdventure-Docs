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

## 待发布

| 目标版本 | 计划内容 |
|---|---|
| v0.1（M-B） | 工程初始化、纯逻辑核心、最小规则集、matrix5 演示屏 |
| v0.2（M-C） | 道具、状态、连击、存档闭环 |
