# 商店系统详设（2026-11 修订：仅主界面商店）

> 商店入口**只在主界面**（准备档口即主界面），阶段二（21 关起）开放购买；局内禁设货架买卖。点“开始游戏”后商店入口消失，中间出现战斗网格并掉落卡堆。evt_merchant 事件卡是局内唯一购买途径（单次交易，不属于商店系统）。

## 1. 定位与入口

- 商店是钱包金币（walletGold）的**主消耗口**与道具的第二获取途径（04_Items.md 经济闭环）。
- 入口形态（双入口，同一商店弹窗 POPUP_SHOP）：
  1. **主界面商店**：常驻入口，主界面钱包栏旁。
  2. **准备档口即主界面**：主界面就是准备态（采购 + 配装 + 选关），**不设第二个商店入口**；点“开始游戏”后商店入口立即消失，进入战斗场景（03_UI/03_Screens.md §2.1）。
- **开放时机**：阶段二（通过第 20 关）起开放购买；阶段一主界面商店入口置灰，点击提示未开放文案（02_CopyDeck.md §5）；战斗场景与结算页无商店入口。
- **局内禁设商店**：关卡内无货架商店（原"商店关"形态废弃，`shopConfig` 字段停用，06_Levels.md §3）；evt_merchant（流浪商人事件卡）是局内唯一购买例外——单次交易、走 EventChoice 弹窗、消耗**局内金币**（11_Resources.md §3 金币双层制）。
- **只买不卖**（维持冻结）：不出售道具换金币；若后续开放须先补背包容量设计。
- 货币边界：商店只收钱包金币，只卖消耗品（药水/护盾/口粮类）；钻石只用于永久成长（04_MetaProgression.md §2），两线不互通。
- 购买统一走校验 → 扣钱包 → `item_gained` 入 Inventory 路径；`NOT_ENOUGH_GOLD` 不足拦截，禁止负数。

## 2. 库存与刷新

| 项 | 规则 |
|---|---|
| 货池 | 基础池 `potion_small / potion_large / shield_scroll / ration / poison_cure`，随玩家最深通关阶段扩展（阶段系数表登记 Balance 表）；走统一随机（种子驱动，同日同货架） |
| 货架数量 | **固定 5 件/次**（Balance `shop.slotCount`） |
| 稀有度权重 | common 70% / uncommon 25% / rare 4% / epic 1%，随阶段偏移（Balance `shop.epicWeight`） |
| 刷新 | **固定 5 钱包金币/次**（Balance `shop.refreshCost`，**不递增**）；每日免费刷新 1 次（自然日重置，日期随存档记录）；看广告可再免 1 次（01_Monetization.md） |

**扩展池（逐阶段解锁，2026-10 定稿）**：

| 解锁进度 | 新增道具 |
|---|---|
| 阶段二（通过第 20 关） | item_food_bundle 干粮袋、item_trail_mix 行军干粮、item_antidote_plus 强效解毒剂、item_shield_greater 强化护盾卷轴 |
| 阶段三（通过第 80 关） | smoke_bomb 烟雾弹、item_torch 火把、item_torch_plus 强化火把、item_iron_skin 铁皮药剂、item_pass_token 通行令、item_blood_rage 血怒药剂 |
| 阶段四（通过第 180 关） | gold_magnet 聚财符、luck_charm 幸运护符、item_phoenix_feather 不死鸟之羽、item_timeglass 碎沙漏、item_fire_flask 燃烧瓶、item_war_drum 战鼓、item_iron_will 铁片护符、item_guard_tonic 护盾药剂 |
| 阶段五（通过第 320 关） | item_elixir 琥珀药剂、item_void_tonic 星盐药剂、item_second_wind 回魂香、item_vigor_root 巨木根（rare/epic） |
| **永不入店** | bomb / item_bomb_large / item_void_bomb（仅局内商人/奖励产出，避免"买炸弹秒精英"）、key（进度类道具）、**所有 legendary**（固定来源：成就/首领钉位） |

道具池共 32 种（04_Items.md §4），**可售 27 种** = 基础池 5 种 + 扩展池 22 种（按阶段解锁，见上表）；排除 key（进度类）、三枚炸弹（bomb / item_bomb_large / item_void_bomb）与传说 `item_eternal_ember`。rare/epic 权重槽位由扩展池道具承接。

**可售稀有度分布（满池，2026-11-18）**：common 5 / uncommon 11 / rare 9 / epic 2 / **legendary 0（不入店）**；单件 rare 出现概率 ≈4% ÷ 9 ≈ **0.44%/槽**，单件 epic ≈1% ÷ 2 = **0.5%/槽**（固定 5 槽刷新：rare 约 2.2%，epic 约 2.5%）。战鼓、铁片护符、强化火把已由 rare 降为 uncommon，避免 rare 被稀释；M-C 实测后再按 TBD-35 调整。

## 3. 价格与支付

- 价格 = 道具基价 × 阶段系数（Balance 表）；区间约束见 09_BalanceBaseline.md §5（common 5～8 / uncommon 8～12 / rare 12～20 / epic 20～30）。
- **阶段系数表（V1 基线）**：阶段二 1.0 / 三 1.3 / 四 1.6 / 五 2.0——随玩家推进商店同步涨价，保证"金币越多东西越贵"的 sink 曲线（common 基价 5～8 → 阶段五实际 10～16，rare 24～40）。系数为基线值，校准期按钱包存量监控调整（§5）。
- 支付流程：选择商品 → 校验钱包金币（不足回 `NOT_ENOUGH_GOLD`）→ 扣钱包 → `wallet_gold_changed` 事件 → `item_gained` → 入 Inventory → 写档。
- **购买只入仓库，不校验携带容量**（容量只约束"带进关卡"这一步）；主界面购物后需在背包编辑态放入槽位；槽位已满时购买不回滚，只在放置时报 `BAG_CAPACITY_EXCEEDED`。
- **仓库堆叠已满时阻止购买**：回 `ITEM_STACK_FULL` 并提示先用掉一件，不做折价回收（避免折价损失与刷取空间）。
- 主界面购买不经 ActionQueue（非局内结算），由商店服务直接执行上述流程并落档；失败分支回错误码提示。

## 4. 与其他系统的边界

| 事项 | 归属 |
|---|---|
| 支付校验与错误码 | 10_CodingStandards.md 第 3 节 |
| 道具入库与上限 | ItemSystem（maxStack 检查，04_Items.md） |
| UI（货架、价格签、刷新按钮） | 03_UI 组件库 Modal 复用；入口与订阅映射见 03_UI/03_Screens.md |
| 货池扩展与预算核查 | LevelValidator 模拟含"赛前采购"路径：零钱包/满钱包两端均可通关（对齐 04_MetaProgression.md §3 两端模拟法） |
| 每日免费刷新重置 | 自然日 + 存档记录日期，随存档迁移链升级 |

## 5. 经济监控预案（上线后启动）

| 监控指标 | 数据源 | 预警阈值 | 预案 |
|---|---|---|---|
| 钱包存量增速 | 结算埋点聚合（walletGold 日增量） | 连续 7 日增速 > 关卡难度增速 | 上调商店阶段系数（Balance 表） |
| 重玩收益占比 | level_complete 事件中重玩局占比 × goldEarned | > 40% | 下调 `replayTransferRatio`（如 0.5，Balance 层系数，不改规则；12_Rewards.md §2） |
| 商店购买率 | shop_buy / 结算曝光比 | < 10%（商店形同虚设） | 下调价格系数或扩充货池 |
| 断点放弃率 | level_fail.cause=quit 占比 | 突增 | 复查对应关卡可解性（09_BalanceBaseline.md §7 复审触发器） |

数据产出依赖 06_Analytics.md 每日指标报表（云开发定时任务）；单机无统计期间用内部模拟替代。

**离线校准口径（TBD-10，上线前先跑）**：Validator 每阶段模拟 1000 局，采用"钱够就买消耗品"策略，统计①每关钱包净增量、②商店购买率、③钱包存量曲线。判据：钱包增速 ≤ 该阶段关卡难度增速（以 DIFF 均值代理）、购买率 ≥10%；任一项不达标 → 调阶段系数（±0.1 为一档）后重跑。校准记录表：日期 / 阶段 / 样本 / 三项指标 / 改动 / 结论，随 Balance 变更归档。
