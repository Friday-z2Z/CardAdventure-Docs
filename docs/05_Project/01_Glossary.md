# 术语表（Glossary）

> 用途：统一跨文档口径。**同一概念只允许一个中文名 + 一个代码名**；新术语先登记本表，再写进正文。
> 命名：中文名用于文档与文案讨论，代码名用于 TS 结构与配置字段。

## 1. 玩法

| 术语 | 代码名 | 释义 | 出处 |
|---|---|---|---|
| 卡牌堆 | `StackRuntime` / stack | 5×5 矩阵盘上占一格的一叠卡，索引 0 = 顶层 | 06_Levels.md §3、01_GameState.md §2 |
| 堆深 | `depth` | 一堆的初始卡牌数，按阶段三档取值 | 06_Levels.md §3.1.1 |
| 顶层卡 | `cards[0]` / top card | 当前可操作的唯一一张，处理后出栈 | 01_GameState.md §2 |
| 亮牌 | `reveal: "lit"` | 顶牌公开可见（名称/数值） | 06_Levels.md §3 |
| 暗牌 | `reveal: "dark"` | 顶牌只显示剩余张数角标，点击即执行 | 00_UiSpec.md §3 |
| 部分亮 | mixed reveal | 同一关内亮堆与暗堆混合 | 06_Levels.md §3.1 |
| 三档制 | depth tiers | 浅/中/深三档堆深，同关混合并受配比约束 | 06_Levels.md §3.1.1 |
| 驻留 | resident | 敌人未死时留在堆顶、封锁该堆的状态 | 10_Battle.md §2 |
| 封锁 | locked | 驻留导致的该堆不可操作，其余堆不受影响 | 10_Battle.md §2 |
| 有效操作 | valid action | 通过校验并成功结算的卡牌操作，食物扣除与连击计数的唯一触发源 | 01_CoreLoop.md §4、05_Combo.md §4 |
| 两段式确认 | Focus → Confirm | 亮牌第一次点击展开信息、第二次点击提交 | 00_UiSpec.md §3 |
| 出口规则 | `ExitRule` | none/flag/kill/collect/pay 五型，多条件为 AND | 13_Exit.md §1 |
| 结算批次 | priority batch | 一次操作内按 priority 10～80 串行执行的效果批次 | 03_ActionQueue.md §4 |
| 连击 | `combo` / tier | 连续有效操作计数，2/3/5/8 为奖励档 | 05_Combo.md §3 |
| 准备档口 | preparation | LevelInit 内、点战斗按钮前的采购与配装阶段 | 03_Screens.md 2.1 |
| 携带制 | carry model（模型 B） | 局内只能使用已携带道具与本关新获得道具 | 04_Items.md §3 |
| 背包组合 | preset / combo | 预存的一套携带方案，多套可切换 | 04_MetaProgression.md §8 |
| 图鉴 | codex | 按卡牌类型分 Tab 的首见收集页 | 04_MetaProgression.md §5 |
| 成长树 | meta tree | 单干线性升级的永久加成节点表 | 04_MetaProgression.md §8 |

## 2. 经济

| 术语 | 代码名 | 释义 | 出处 |
|---|---|---|---|
| 局内金币 | `player.gold` / run gold | 本关临时货币，失败没收，不进钱包 | 11_Resources.md §3 |
| 钱包金币 | `walletGold` | 跨局永久货币，商店唯一支付手段 | 11_Resources.md §3 |
| 钻石 | `diamond` | 长线货币，只来自矿点与成就，只买永久成长 | 04_MetaProgression.md §2 |
| 矿点关 | `tags: ["diamond_mine"]` | 重复通关可产钻石的指定关卡 | 04_MetaProgression.md §2 |
| 每日刷矿上限 | `mineDailyLimit` | 每日计钻石产出的通关次数上限，基线 10 | 04_MetaProgression.md §2 |
| 转存 | transfer | 胜利结算把局内金币按系数写入钱包 | 12_Rewards.md §2 |
| 转存系数 | `replayTransferRatio` | 转存乘数，基线 1.0，下调即重玩收益递减 | 12_Rewards.md §2 |
| 首通幂等 | `completedLevels` | 已通关集合，首通奖励以此判定，不额外记账 | 12_Rewards.md §3 |
| 成就幂等 | `claimedAchievements` | 已领成就 id 集合（有界） | 04_MetaProgression.md §7 |
| 本局幂等 | `rewardedKeys` | 本局已发奖励集合，随快照持久化 | 12_Rewards.md §3 |
| 阶段系数 | shop stage multiplier | 商店价格随阶段上调的乘数（1.0/1.3/1.6/2.0） | 16_Shop.md §3 |
| 只买不卖 | buy-only | 商店不出售玩家道具换金币 | 16_Shop.md §1 |

## 3. 工程

| 术语 | 代码名 | 释义 | 出处 |
|---|---|---|---|
| 游戏状态 | `GameState` | 唯一状态持有者，只有 EffectResolver 可改 | 01_GameState.md §1 |
| 操作校验器 | `ActionResolver` | 判断请求合法性并生成 Action，不改状态 | 00_Architecture.md §3 |
| 效果执行器 | `EffectResolver` | 按 priority 落地效果，不操作 UI | 00_Architecture.md §3 |
| 动作队列 | `ActionQueue` | 串行消费 Action，执行前存快照、异常回滚 | 03_ActionQueue.md §2 |
| 动作 | `Action` | 入队对象：actionId/type/sourceId/effects/cost/origin | 03_ActionQueue.md §3 |
| 效果定义 | `EffectDefinition` | 配置化效果：type/target/value/priority/trigger 等 | 03_ActionQueue.md §3 |
| 本局标记 | `runFlags` | 机关/出口条件用的键值标记 | 01_GameState.md §2 |
| 断点快照 | `RunSnapshot` | 可重建整局的完整状态，落 `progress.run` | 10_CodingStandards.md §4 |
| 随机子流 | stream（level/reward/shop/meta） | 互不干扰的确定性随机序列 | 06_DataBalance.md §4 |
| 数值真源 | Balance 表 | `balance/balance.xlsx`，JSON 只是导出物 | 06_DataBalance.md §3 |
| 验证器 | Validator | Card/Enemy/Item/Level/Config/Asset/Localization 七类 | 06_DataBalance.md §2 |
| 难度分 | DIFF | 堆数/深度/暗牌/威胁四因子加权，0～100 | 06_Levels.md §3.1.2 |
| 威胁值 | `threat` | 单卡难度贡献，敌人 f(ATK,HP)，恢复/资源为负 | 09_BalanceBaseline.md §8 |
| 兜底版本 | fallback config | 包内保留的上次审核通过配置，热更失败时启用 | 03_Packaging.md §3 |
| 热更 | config hot update | 启动握手后增量替换 Registry 的配置更新 | 03_Packaging.md §3 |
| 对象池 | pool | 飘字/卡牌视图等禁止直接 new/销毁 | 05_Performance.md §3 |

## 4. 平台

| 术语 | 代码名 | 释义 | 出处 |
|---|---|---|---|
| 主域 | main context | 游戏主体逻辑与渲染 | 02_Leaderboard.md §2 |
| 子域 | openDataContext | 开放数据域，原生 canvas 渲染榜单 | 02_Leaderboard.md §2 |
| 共享画布 | `sharedCanvas` | 子域绘制结果，主域逐帧贴为纹理 | 02_Leaderboard.md §2 |
| 好友榜 KV | `KVDataList` | `level` / `daily` 两个键，字段设计一次到位 | 02_Leaderboard.md §1 |
| 主包 | main package | ≤4MB，含引擎、代码、场景与首关资源 | 03_Packaging.md §1 |
| 分包 | bundle（stage1～5） | 按关卡阶段切换的资源包，合计 ≤20MB | 03_Packaging.md §1 |
| 远程资源 | CDN bundle | 大图/音频走 CDN，不计包体 | 03_Packaging.md §2 |
| 广告点位 | `placement` | 业务只声明点位字符串，频控在 `IAdService` | 01_Monetization.md §5 |
| 隐私授权 | `wx.requirePrivacyAuthorize` | 进榜单/分享前的授权流程，拒绝则降级 | 00_Compliance.md §2 |
