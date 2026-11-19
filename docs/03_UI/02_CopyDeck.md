# 游戏内文案总表（Copy Deck）

> 补全章节。所有直接展示给玩家的文本集中在此，是唯一的文案来源——UI 不允许硬编码文案字符串。卡牌 23 张的说明文案见 01_GameDesign/07_CardCatalog.md，本文覆盖其余全部元素。文案走数据流水线，由 LocalizationValidator 校验非空（06_DataBalance.md 第 2 节）。

## 1. 道具介绍文案（对应 04_Items.md 全量 32 件）

展示位置：道具栏长按 / Tooltip 面板（效果数值由 UI 按配置自动拼接，不写入文案）。

| ID | 名称 | 介绍文案 |
|---|---|---|
| potion_small | 小型药剂 | 一小瓶温热的红色药水，喝下去，伤口就悄悄合上了。 |
| potion_large | 大型药剂 | 旅行者珍藏的大瓶药剂，浓稠而甘甜，再重的伤也能慢慢抚平。 |
| bomb | 爆破炸弹 | 自己攒的小玩意儿，点着了"砰"的一声，再硬的家伙也会退让几分。 |
| shield_scroll | 护盾卷轴 | 展开卷轴，古老的咒语绕着周身，轻轻织出一面看不见的盾。 |
| ration | 应急口粮 | 压缩干肉与硬面饼，算不上美味，却足够陪你走完下一段路。 |
| poison_cure | 解毒药剂 | 微苦的灰绿色汤剂，咕嘟一口，身体里的不适便慢慢退去了。 |
| smoke_bomb | 烟雾弹 | 轻轻一摔，白雾便漫开来。趁大家看不清，正好喘口气、想想下一步。 |
| gold_magnet | 聚财符 | 黄铜铸的小符，据说会像磁石一样，把散落的金币轻轻引到你身边。 |
| key | 古旧钥匙 | 一把沉甸甸的黄铜钥匙，齿痕早已磨损——它一定开过某扇重要的门。 |
| luck_charm | 幸运护符 | 兔脚与四叶草编成的挂坠。下一份好运，就藏在下一件战利品里。 |
| item_torch | 火把 | 一小截松脂火把，举起来，黑暗会退后两步。 |
| item_food_bundle | 干粮袋 | 塞得满满的一袋，背起来沉，心里却踏实。 |
| item_antidote_plus | 强效解毒剂 | 苦得让人皱眉，但喝下去，血色会慢慢回来。 |
| item_shield_greater | 强化护盾卷轴 | 更厚的咒文，展开时连风都被挡在外面。 |
| item_bomb_large | 大型炸弹 | 抱在怀里都得小心，它比看上去重得多。 |
| item_elixir | 琥珀药剂 | 琥珀色的药液里，有一点微光。 |
| item_torch_plus | 强化火把 | 火苗更亮，照得见更深的角落。 |
| item_phoenix_feather | 不死鸟之羽 | 温热的羽毛。它记得怎样从灰里回来。 |
| item_timeglass | 碎沙漏 | 沙漏裂了，倒流的沙够你喘过这一口气。 |
| item_void_tonic | 星盐药剂 | 咸得像星盐，喝完却意外地清醒。 |
| item_iron_skin | 铁皮药剂 | 喝下去，皮肤像蒙了一层旧铁，动作也稳了。 |
| item_fire_flask | 燃烧瓶 | 瓶口塞着浸油的布。扔出去之前，记得先松手。 |
| item_war_drum | 战鼓 | 鼓面破了个洞，敲起来却还是让人心里发烫。 |
| item_iron_will | 铁片护符 | 一块磨得发亮的铁片。握着它，脚步会轻一点。 |
| item_void_bomb | 陨星炸弹 | 里面装着陨星的碎屑，炸开时没有声音。 |
| item_second_wind | 回魂香 | 一缕很细的烟。闻过之后，身上的沉重会散掉。 |
| item_trail_mix | 行军干粮 | 混着坚果和硬面包。嚼得太急，会呛得咳血。 |
| item_pass_token | 通行令 | 一枚旧铜牌，边缘磨得发亮。有些门认它，不认人。 |
| item_blood_rage | 血怒药剂 | 喝下去，伤口发烫，手心也跟着发烫。 |
| item_guard_tonic | 护盾药剂 | 味道很涩，喝完却觉得肩上的重量轻了些。 |
| item_vigor_root | 巨木根 | 咬起来像木头，但咽下去之后，胸口会慢慢热起来。 |
| item_eternal_ember | 永恒火种 | 一小簇不肯熄灭的火。它记得你倒下的地方。 |

## 2. 状态效果文案（对应 02_Player.md 第 2 节）

展示位置：状态角标点击/长按 Tooltip。

| id | 名称 | 玩家可见说明 |
|---|---|---|
| poison | 中毒 | 每次行动结束后，不适会轻轻袭来；层数越高，感觉越明显。 |
| burn | 灼烧 | 每次行动结束后火苗发烫。它不太讲道理，治疗也没法安抚它。 |
| weakness | 虚弱 | 手臂有些发沉，攻击力降低了一点。 |
| vulnerable | 易伤 | 此刻格外经不起磕碰，受到的伤害会增加一半。 |
| shielded | 护盾 | 一层温柔的守护，会先替你挡下即将到来的伤害。 |
| regeneration | 再生 | 每次行动结束后，伤口都悄悄愈合一点。 |
| exhausted | 疲劳 | 脚步发沉，一部分卡牌暂时用不了了。 |

## 3. 稀有度名称与配色（对应 00_UiSpec.md 卡牌视觉）

| 稀有度 | 玩家名称 | 颜色 |
|---|---|---|
| common | 普通 | ColorMuted |
| uncommon | 优良 | ColorSuccess |
| rare | 稀有 | ColorMagic |
| epic | 史诗 | ColorEpic（**新增设计变量** #9B6FD4，按 00_UiSpec 第 1 节规则登记后使用） |
| legendary | 传说 | ColorPrimary |

展示位置：卡牌稀有度装饰条 + 图鉴/掉落提示。

## 4. 错误码 → 玩家提示文案（对应 10_CodingStandards.md 第 3 节）

| 错误码 | Toast 文案 |
|---|---|
| INVALID_TARGET | 这个目标不能这么用。 |
| NOT_ENOUGH_FOOD | 食物不足。 |
| NOT_ENOUGH_GOLD | 金币不够。 |
| NOT_ENOUGH_DIAMOND | 钻石还不够，先去闯几关吧。 |
| ITEM_NOT_FOUND | 没有这个道具。 |
| ITEM_COOLDOWN | 还没准备好，稍等片刻。 |
| ITEM_TARGET_INVALID | 目标已经失效了。 |
| INVALID_CARRY_ITEM | 这个道具不能带进关卡。 |
| SLOT_DUPLICATED | 同一件道具只能带一份。 |
| BAG_CAPACITY_EXCEEDED | 携带位不够了，先卸下一件。 |
| CARD_NOT_ACTIONABLE | 这张卡现在不能用。 |
| ITEM_STACK_FULL | 这件道具带满了，先用掉一件吧。 |
| CARD_NOT_ACTIONABLE（驻留封锁变体，key: `copy_err_card_not_actionable_locked`） | 先解决这只敌人，才能翻看后面的卡。 |
| EXIT_CONDITION_UNMET | 还不能离开：{缺口明细列表}。 |
| LEVEL_ALREADY_COMPLETED | 这一关已经通关啦，去看看后面吧。 |
| SAVE_DATA_INVALID | 存档出了点问题，已为你回到安全状态。 |
| NETWORK_UNAVAILABLE | 网络不太顺畅，先继续冒险吧。 |
| CONFIG_UPDATE_FAILED | 配置更新失败，已使用本地版本。 |
| CLOUD_SYNC_FAILED | 云端同步暂时失败，进度已保存在本地。 |
| CLOUD_SAVE_INVALID | 云端存档校验未通过，已保留本地进度。 |
| AD_NOT_READY | 广告还没准备好，稍后再试试。 |
| STORAGE_WRITE_FAILED | 进度暂时没法保存，会自动重试。 |

## 5. 系统固定文案

| 场景 | 文案 | 展示位置 |
|---|---|---|
| Food = 0 警示 | 干粮见底了：下一步会失去 2 点生命，之后每步 1 点。 | 状态栏常驻（11_Resources.md §4） |
| 失败死因（敌人） | 你被{敌人名}打败了。休息一下，再出发吧。 | 失败结算面板（01_CoreLoop.md 第 5 节） |
| 失败死因（食物） | 肚子空空走了太久。补给好一点，下次会更顺利。 | 同上 |
| 失败死因（状态） | {状态名}让你撑不住了。下次记得先照顾好自己。 | 同上 |
| 商店未开放 | 行商还在路上，通过第 20 关后来找他吧。 | 主界面商店入口置灰点击（准备档口即主界面，16_Shop.md §1） |
| 通关金币入账 | 金币 +{n} 已存入钱袋。 | 通关结算面板（金币转钱包，11_Resources.md 第 3 节；"钱袋"= walletGold，避免与道具背包混淆） |
| 刷新货架确认 | 花 {n} 金币换一批货物？ | 商店刷新二次确认（ConfirmPopup） |
| 我的页统计项 | 通关关数 / 最深关卡 / 钻石 / 图鉴完成度 | 我的页（03_UI/03_Screens.md POPUP_PROFILE） |
| 云端同步·已同步 | 进度已存到云端。 | POPUP_SETTINGS 云端同步行 |
| 云端同步·未同步 | 还没有同步过，进度只在这台设备上。 | POPUP_SETTINGS 云端同步行 |
| 立即同步按钮 | 立即同步 | POPUP_SETTINGS |
| 同步冲突标题 | 两份进度不一样，选一份继续。 | POPUP_SYNC_CONFLICT |
| 同步冲突·云端 | 使用云端（{日期}，第 {n} 关） | POPUP_SYNC_CONFLICT |
| 同步冲突·本地 | 保留本地（{日期}，第 {n} 关） | POPUP_SYNC_CONFLICT |
| 同步冲突提示 | 选中的那份会覆盖另一份，选好后不能撤销。 | POPUP_SYNC_CONFLICT |
| 签到未开放 | 签到将在通过第 20 关后开启。 | 主界面顶栏签到入口置灰点击（17_SignIn.md） |
| 签到标题 | 每日签到 | POPUP_SIGN |
| 签到已领 | 今天已领过啦，明天再来。 | POPUP_SIGN 当日重复点击 |
| 直达下一关副标题 | 第 {n} 关 · {关卡名} | 主界面主按钮"开始游戏"下方小字 |
| 重开本关链接 | 重开本关 | 主界面"继续冒险"态次级链接（02_StateMachine.md 规则 9） |
| 重开本关警告 | 放弃本关当前进度，重新挑战第 {n} 关？ | ConfirmPopup（重开确认） |
| 保存并退出警告 | 进度已记下，回到营地？ | ConfirmPopup（局内保存退出，02_StateMachine.md 规则 10） |
| 震动开关 | 震动 | 设置弹窗（主菜单/局内） |
| 结算中提示 | 正在结算，稍等一下。 | Resolving 态点击卡牌（00_UiSpec.md 点击交互细则） |
| 奖励满栈折算 | 背包已满，已折算为金币。 | RewardPopup（签到/奖励发放，17_SignIn.md §3） |
| 换个开局重试 | 这局的路走不通了，换一副牌重来？ | 连续失败 2 次后的结算页（01_CoreLoop.md §5） |
| 出口缺钥匙（未携带） | 钥匙还在背包里，出发前记得带上。 | 出口判定缺口提示（collect 型，13_Exit.md §1） |

> 本节 key 统一按 `copy_sys_{语义英文}` 生成（如 `copy_sys_food_zero`、`copy_sys_death_enemy`），语义 slug 与场景列的映射表随导出脚本维护，新增条目须同时补 slug。

## 6. 关卡目标与引导文案（key: 前缀引用处）

| key | 文案 | 使用位置 |
|---|---|---|
| key:tut_tap_card | 点开一张牌，看看是什么。 | 引导第 1 关步骤 1（15_Tutorial.md §7） |
| key:tut_confirm_card | 再点一次，出发！ | 引导第 1 关步骤 2 |
| key:tut_watch_resource | 注意资源的变化。 | 引导第 1 关步骤 3 |

**阶段一 20 关名称与目标**（key 规则：`copy_level_XXXX_name` / `copy_level_XXXX_objective`，与 18_LevelProduction.md §10 一一对应）：

| key | 文案 | 使用位置 |
|---|---|---|
| key:copy_level_0001_name | 洞口的微光 | level_0001 关卡名 |
| key:copy_level_0001_objective | 翻开卡牌，找到刻纹石门。 | level_0001 目标区（reachExit） |
| key:copy_level_0002_name | 鼠影 | level_0002 关卡名 |
| key:copy_level_0002_objective | 清掉挡路的穴居鼠，再往前走。 | level_0002 目标区（reachExit） |
| key:copy_level_0003_name | 见底的干粮 | level_0003 关卡名 |
| key:copy_level_0003_objective | 食物不多，找到出口就好。 | level_0003 目标区（reachExit） |
| key:copy_level_0004_name | 一小瓶药水 | level_0004 关卡名 |
| key:copy_level_0004_objective | 带上一瓶药水，别急着喝。 | level_0004 目标区（reachExit） |
| key:copy_level_0005_name | 刻纹石门 | level_0005 关卡名 |
| key:copy_level_0005_objective | 拉动拉杆，打开石门。 | level_0005 目标区（flag） |
| key:copy_level_0006_name | 余烬里的钱袋 | level_0006 关卡名 |
| key:copy_level_0006_objective | 搜刮钱袋，再决定去留。 | level_0006 目标区（reachExit） |
| key:copy_level_0007_name | 岔路 | level_0007 关卡名 |
| key:copy_level_0007_objective | 选一条路，走到尽头。 | level_0007 目标区（reachExit） |
| key:copy_level_0008_name | 蝙蝠窝 | level_0008 关卡名 |
| key:copy_level_0008_objective | 别被拖进消耗战。 | level_0008 目标区（reachExit） |
| key:copy_level_0009_name | 尖刺回廊 | level_0009 关卡名 |
| key:copy_level_0009_objective | 绕过尖刺，或者硬扛过去。 | level_0009 目标区（reachExit） |
| key:copy_level_0010_name | 矿脉微光 | level_0010 关卡名 |
| key:copy_level_0010_objective | 深堆尽头有钻石，量力而行。 | level_0010 目标区（reachExit，矿点） |
| key:copy_level_0011_name | 疲惫的脚步 | level_0011 关卡名 |
| key:copy_level_0011_objective | 每一步都要算清食物。 | level_0011 目标区（reachExit） |
| key:copy_level_0012_name | 哥布林的补给 | level_0012 关卡名 |
| key:copy_level_0012_objective | 用一场战斗，换几天口粮。 | level_0012 目标区（reachExit） |
| key:copy_level_0013_name | 愈合的草叶 | level_0013 关卡名 |
| key:copy_level_0013_objective | 把治疗留到最需要的时候。 | level_0013 目标区（reachExit） |
| key:copy_level_0014_name | 骸骨的防线 | level_0014 关卡名 |
| key:copy_level_0014_objective | 击穿防线，抵达出口。 | level_0014 目标区（reachExit） |
| key:copy_level_0015_name | 篝火前的选择 | level_0015 关卡名 |
| key:copy_level_0015_objective | 做一个选择，然后继续。 | level_0015 目标区（reachExit） |
| key:copy_level_0016_name | 钥匙与门 | level_0016 关卡名 |
| key:copy_level_0016_objective | 带上钥匙，走到石门前。 | level_0016 目标区（collect） |
| key:copy_level_0017_name | 越过封锁 | level_0017 关卡名 |
| key:copy_level_0017_objective | 绕开封锁的堆，或者清掉它。 | level_0017 目标区（reachExit） |
| key:copy_level_0018_name | 谨慎的贪心 | level_0018 关卡名 |
| key:copy_level_0018_objective | 想清楚什么时候收手。 | level_0018 目标区（reachExit） |
| key:copy_level_0019_name | 洞口在望 | level_0019 关卡名 |
| key:copy_level_0019_objective | 带着剩下的资源离开。 | level_0019 目标区（reachExit） |
| key:copy_level_0020_name | 守门人的试炼 | level_0020 关卡名 |
| key:copy_level_0020_objective | 击败守门人，带走矿石。 | level_0020 目标区（kill，矿点） |
| key:copy_level_0480_name | 无声的加冕 | level_0480 关卡名（传说试炼） |
| key:copy_level_0480_objective | 击败黑纱主教与它的随从，取走终末之刃。 | level_0480 目标区（killAll，传说试炼） |

## 7. 成长树节点文案（04_MetaProgression.md §8）

| key | 文案 | 使用位置 |
|---|---|---|
| tree_start_food_name / _desc | 干粮袋 / 开局食物 +0.5（每级，累计取整） | 成长树节点 |
| tree_bag_capacity_name / _desc | 背包扩容 / 解锁额外携带槽位（最多 5 槽，随等级解锁） | 成长树节点 |
| combo_purchase_name / _desc | 背包组合 / 保存多套开局组合，一键切换（第 2～4 套各 80 钻石；非成长树节点，入口在背包组合面板） | 背包组合购买 |
| depart_confirm_button | 开始游戏 | 主界面准备态主按钮（03_UI/03_Screens.md §2.1） |
| depart_edit_title | 出发准备 | 主界面背包编辑标题 |
| depart_edit_slot_hint | 点槽位更换道具 | 主界面背包槽位提示 |
| tree_hp_up_name / _desc | 强健体魄 / 初始生命上限 +1（每级，满 6 级共 +6） | 成长树节点 |
| tree_shield_up_name / _desc | 老练防御 / 开局护盾 +1 | 成长树节点 |
| tree_gold_up_name / _desc | 盘缠 / 开局金币 +3，第 2 级再 +2（共 +5） | 成长树节点 |
| tree_max_hint | 已达最高等级。 | 成长树节点满级 |
| mine_daily_used | 今天矿点的钻石已领完，明天再来。 | 矿点关超次通关结算（04_MetaProgression.md §2） |
| mine_daily_left | 今日剩余刷矿次数：{n} | 矿点关入口/结算面板 |
| 通关标题 | 出口的光越来越亮…… | 胜利结算面板 |
| 商店按钮 | 购买 {价格}／刷新 {价格} | 商店面板（16_Shop.md） |
| 教学跳过 | 跳过引导 | 引导覆盖层（15_Tutorial.md） |
| 加载失败回退 | 资源还在路上，稍后再试 | LoadingView（05_Performance.md 规则 3） |
| 排行榜空数据 | 还没有可展示的排名，先去闯关吧 | 全服榜空态（02_Leaderboard.md §4） |
| 排行榜加载中 | 正在集结旅人的足迹…… | 榜单加载态 |
| 背包入口 | 背包 | 主菜单独立入口（道具中心，03_UI/03_Screens.md 2.1） |
| 成长树入口 | 成长树 | 主菜单独立入口（成长中心，03_UI/03_Screens.md 2.1） |
| 图鉴入口 | 图鉴 | 主菜单独立入口（收集中心） |
| 钻石不足 | 钻石还不够，先去闯几关吧。 | 解锁确认 Modal（错误码 NOT_ENOUGH_DIAMOND） |
| 图鉴未解锁 | ？（首次遇见后揭晓） | 图鉴占位 |
| 复活按钮（看广告） | 看一段影像，从倒下的地方继续 | 失败结算面板（01_Monetization.md 第 2 节） |
| 复活放弃 | 就此作罢 | 同上，与复活按钮并列 |
| 结算双倍（看广告） | 看一段影像，金币 ×2 | 通关结算面板 |
| 商店免费刷新（看广告） | 看一段影像，免费刷新 | 商店面板（16_Shop.md） |
| 存档保存提示 | 旅程已记下 | Toast（save_written，07_Ops_Release.md 第 5 节） |
| 素材致谢入口 | 素材与致谢 | 设置 → 关于（00_Compliance.md 第 4 节署名要求） |

## 8. 文案管理规则

1. **key 生成规则**：`copy_{元素id}_{字段}`（如 `copy_potion_small_desc`、`copy_err_not_enough_gold`）。§1～§4 表已有 id 列（道具 id / 状态 id / 稀有度 / 错误码），**key 由规则自动推导，表内不重复列 key**；§6、§7 已是 key 直接引用，保持 `key:` 前缀写法。
2. **导出流水线**：`npm run export:copy` 解析三类输入并合并 → 生成 `assets/resources/data/copy/copy_zh-CN.json`（扁平 `{ key: text }`，外层带 06_DataBalance.md §1 公共字段）：
   - **本文**：§1 道具、§2 状态、§4 错误码、§5 系统、§6 关卡与引导、§9 分享、§10 首领（key 由 id 规则推导或表内显式 key）；
   - **07_CardCatalog.md**：卡牌表（§1～§7、§10～§13）的"名称 + 说明文案"→ `copy_{cardId}_name` / `copy_{cardId}_desc`；
   - **04_Items.md** §4：道具"名称"列（介绍文案仍以 §1 为准）。
   三处均为编辑源，导出物只读、禁止手改；同一 id 在多地重复时以本文 §1 为准。
3. **取值**：文案不写死在组件里，经 `core/i18n` 模块按 key 取值；未命中 key 时开发期显示 key 本身（便于发现漏配），线上显示兜底文案。
4. **覆盖校验**：LocalizationValidator 反向核查——卡牌/道具/敌人/状态/错误码/关卡 `objective.displayText` 引用的每个 id 都能生成对应 key 且文案非空；新增配置未登记文案 = 校验失败。
5. **变体 key**：同一错误码的语境变体必须用独立 key（如驻留封锁变体 `copy_err_card_not_actionable_locked`），禁止同一 key 存两套文案。
6. 每条文案必须标注展示位置（上表"展示位置"列），新增 UI 必须先在此登记再编码。
7. 数值不进文案：介绍文案不含具体数字，效果数值由 UI 按配置实时拼接，避免改 Balance 表后文案失真。
8. 语气基准：奇幻故事书旁白感、短句、对玩家说话，**整体温和宽厚**——不用威胁性、暴力性措辞，不渲染疼痛与损失；失败与警示类文案一律带"鼓励再来"的余味；同类元素句式对齐（道具多为"物品 + 一句用途暗示"）。

## 9. 分享文案（05_Share.md §1、§4 引用）

| key | 文案 | 使用位置 |
|---|---|---|
| copy_share_clear_title | 我在第 {n} 关，{enemy} 倒在脚下 | 通关晒图分享标题（≤20 字） |
| copy_share_codex_title | 我的图鉴已点亮 {n}/{total} | 图鉴收集分享标题 |
| copy_share_rank_title | 我在第 {n} 关，来超越我 | 排行榜挑战分享标题 |
| copy_share_button | 分享战绩 | 结算面板按钮 |
| copy_share_landing_new | 他从第 {n} 关出发，你们从同一条路开始 | 落地页（新玩家） |
| copy_share_landing_back | 他停在第 {n} 关，等你接上 | 落地页（老玩家） |

> 标题模板不得出现"必须""否则""分享才能"等诱导话术（05_Share.md §3）；数值占位符由运行时按当前进度填充，文案本身不含具体数字。

## 10. 首领文案（14_EliteBoss.md §2 样例）

| key | 文案 | 使用位置 |
|---|---|---|
| boss_drowned_warden_name | 沉水守卫 | 首领卡面与入场横幅标题 |
| boss_drowned_warden_enter | 守卫抬起湿透的手臂，苔藓下露出旧伤。 | P1 入场横幅 |
| boss_drowned_warden_phase2 | 水声倒灌，它开始把伤口长回去。 | P2 阶段切换横幅 |
| boss_drowned_warden_surge | 水流扯动了脚下的牌堆。 | 潮涌机制预告（1 回合后打乱随机一堆） |
| boss_ashen_colossus_enter | 灰堆成的高塔动了动，抖落一身火星。 | P1 入场横幅 |
| boss_ashen_colossus_phase2 | 它裂开的地方透出更亮的光，像还有东西没烧完。 | P2 阶段切换横幅 |
| boss_cinder_witch_enter | 炉火后面，有人慢慢搅动一锅什么。 | P1 入场横幅 |
| boss_cinder_witch_phase2 | 她把手伸进火里，火焰顺着袖子爬上来。 | P2 阶段切换横幅 |
| boss_starless_king_enter | 断冠歪戴在头上，王座后没有影子。 | P1 入场横幅 |
| boss_starless_king_phase2 | 穹顶压低了，断冠的裂口里透出一点冷光。 | P2 阶段切换横幅 |
| boss_void_herald_enter | 号角没有声音，影子先到了。 | P1 入场横幅 |
| boss_void_herald_phase2 | 号声倒着吹，影子开始重复你的脚步。 | P2 阶段切换横幅 |
| boss_final_echo_enter | 巨像胸口的钟不响，只把脚步声吞进去，再送回来。 | P1 入场横幅 |
| boss_final_echo_phase2 | 送回来的脚步声，比你自己的脚步更近了一点。 | P2 阶段切换横幅 |

> 后续首领按同一命名规则 `boss_{id}_{enter|phaseN}` 登记；新增首领必须先在本节补文案再进配置（LocalizationValidator 校验）。
