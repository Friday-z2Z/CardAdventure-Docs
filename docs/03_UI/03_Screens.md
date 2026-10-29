# 界面清单与导航图

> 本文是 UI 编码的第一输入：全部屏幕/弹窗的完整清单、跳转关系、每个界面的 EventBus 订阅与请求发起。逻辑状态流转以 02_Development/02_StateMachine.md 为准——状态机是程序视角，本文是屏幕视角，两者通过 `state_changed` 事件衔接。新增界面必须先登记到第 4 节常量表再编码。

## 1. 导航图

```text
SCENE_BOOT（Boot + Loading，全屏 LoadingLayer）
  │
  ▼
SCENE_MAIN
  ├── SCREEN_MAIN_MENU
  │     ├─→ POPUP_SETTINGS（模态，02_StateMachine.md 规则 6）
  │     ├─→ POPUP_LEADERBOARD（好友榜 + 日榜 Tab，04_Platform/02_Leaderboard.md）
  │     ├─→ POPUP_SHOP（钱包商店，主界面入口；阶段二开放购买，之前置灰，16_Shop.md）
  │     ├─→ POPUP_BAG（行囊：道具背包，主界面只读）
  │     ├─→ POPUP_CODEX（图鉴 + 成长树 + 星屑）
  │     ├─→ POPUP_SIGN（签到，顶栏图标；阶段二开放，之前置灰，01_GameDesign/17_SignIn.md）
  │     ├─→ POPUP_PROFILE（我的：本地档案 + 统计）
  │     ├─直达─→ LevelInit（主按钮"开始游戏"：无断点时直达下一关，02_StateMachine.md §2）
  │     └─→ POPUP_MESSAGE / POPUP_ERROR（通用）
  │
  └── SCREEN_LEVEL_SELECT ──选中关卡──→ SCENE_BATTLE
                                            │
SCENE_BATTLE（LevelInit → PlayerTurn ⇄ … → LevelResult）
  ├── SCREEN_BATTLE（主战斗界面，全屏）
  │     ├─→ POPUP_BAG（行囊/道具）
  │     ├─→ POPUP_EVENT_CHOICE（篝火二选一 / 神龛献祭 / 流浪商人购买——局内唯一购买例外）
  │     ├─→ POPUP_CONFIRM / POPUP_MESSAGE / POPUP_ERROR（通用）
  │     └─→ POPUP_REWARD（奖励结算展示，reward_granted 触发）
  └── SCREEN_LEVEL_RESULT（结算覆盖屏：下一关 / 重试 / 回菜单 / 广告复活 / 行囊补给→商店）
        ├─→ POPUP_SHOP（通关后即买即入 Inventory，阶段二起）
        └─→ SCENE_BATTLE（下一关 NextLevelInit / 重试）| SCENE_MAIN（回菜单）

引导（15_Tutorial.md）：GuideLayer 输入拦截层，不属于任何界面，挂在 SCENE_BATTLE 与 SCENE_MAIN 之上。
```

跳转规则：

1. 场景切换（SCENE_*）只由 StateMachine 转移触发，UI 只发转移请求（02_StateMachine.md 规则 1）。
2. 弹窗一律经 BasePopup 队列显示（UiSpec §4.1 规则 2），禁止跨场景残留弹窗——场景切换时队列清空。
3. SCREEN_LEVEL_RESULT 是覆盖屏（WindowLayer）而非弹窗：它是状态机正式状态（LevelResult），不参与弹窗队列。

## 2. 界面清单：事件订阅与请求映射

请求通道说明：`事件` = 监听 EventBus（只读刷新）；`请求` = UI 发起、GameController 校验后入队或转状态转移（校验失败回错误码 → POPUP_ERROR / Toast）。请求不新增事件名，复用目录中标注"UI → GameController"的条目或走 UI 请求接口。

| 界面 | 订阅事件 | 发起请求 |
|---|---|---|
| LoadingView | state_changed（Boot/Loading 进度） | — |
| SCREEN_MAIN_MENU | state_changed、save_written、wallet_gold_changed | 转移：继续冒险（恢复快照）/ 开始游戏（直达下一关 LevelInit）/ 选择关卡（LevelSelect）；打开设置 / 排行榜 / 商店 / 行囊 / 图鉴 / 我的 / 签到 |
| SCREEN_LEVEL_SELECT | state_changed | 转移：选中关卡（关卡配置缺失置灰，02_StateMachine.md） |
| SCREEN_BATTLE | stack_updated、hp/food/gold/shield_changed、status_applied/removed、combo_updated、card_resolved、enemy_damaged/enemy_died、player_damaged/player_died、item_used/item_gained、mechanism_activated、boss_phase_changed、exit_unlocked、level_completed/failed | card_selected；道具使用（targeted → ItemTargeting）；事件选项提交；转移请求 |
| POPUP_BAG | item_gained、item_used | 道具使用请求 |
| POPUP_EVENT_CHOICE | state_changed（EventChoice 进入/退出） | 事件选项 + 支付确认（失败留弹窗报错误码） |
| POPUP_REWARD | reward_granted | —（纯展示） |
| SCREEN_LEVEL_RESULT | level_completed/failed、reward_granted、save_written、wallet_gold_changed | 转移：下一关 / 重试 / 回菜单；广告复活（每关 1 次，01_Monetization.md）；行囊补给 → 打开 POPUP_SHOP |
| POPUP_SETTINGS | save_written | 设置变更 → SaveData.settings 持久化 |
| POPUP_LEADERBOARD | —（主动拉取，主子域 postMessage） | 打开时向子域发 friend/day 请求 |
| POPUP_SHOP | wallet_gold_changed、item_gained | 购买请求（校验钱包 → 扣款 → 入 Inventory → 写档，16_Shop.md §3）；刷新请求 |
| POPUP_PROFILE | —（打开时读取本地统计与 MetaProgressData） | 微信头像昵称授权获取（拒绝授权显示默认剪影） |
| 通用弹窗 ×5（Message/Confirm/Loading/Reward/Error） | — | —（由调用方传参驱动） |

通用约定：

1. 所有订阅随界面关闭自动注销（BaseView 职责，UiSpec §4.1）。
2. 订阅回调只刷新显示；需要变更状态一律发起请求，禁止回调内改状态（04_EventCatalog.md 规则 2）。
3. 音效、飘字、埋点由 SoundSystem / FloatingNumber / Analytics 作为独立监听者自行响应，不写进界面订阅。

### 2.1 关键界面内容区（V1）

**SCREEN_MAIN_MENU（主界面）**——三段式布局（顶栏信息 / 中部主操作 / 底部入口排）：

- **顶栏**（全局 WalletBar 组件，进 UiSpec 组件库）：
  - 左：头像 + 昵称 = **"我的"入口**（POPUP_PROFILE，未授权显示默认剪影）。
  - 右：钱包胶囊——钱包金币 + 星屑并排，变化滚动反馈（wallet_gold_changed）；点击各货币弹说明气泡（教学货币规则）。**局内金币不出现在主界面**（双层制，11_Resources.md §3）。
  - 签到图标（日历样式）挂顶栏右端：当日未签显示红点；**阶段二开放，MVP 置灰**（17_SignIn.md）。
- **中部主操作（动态单主按钮：标签绑定玩家身份，行为绑定断点状态，两态永不并存）**：
  - 新玩家（progress 初始空档：无通关记录且无断点）：主按钮"**开始游戏**" → 直达第 1 关。
  - 老玩家（progress 非初始空档，含第 1 关中途退出产生断点者）："**继续冒险**"（标签终身不变）→ 有断点恢复最近 PlayerTurn 快照（02_StateMachine.md 规则 5）；无断点直达下一个未通关关卡。
  - "重开本关"次级链接：仅老玩家**有断点**态显示（在"选择关卡"链接旁）——修复断点死局：卡在打不过的局面时可丢弃断点重新挑战；点击 → ConfirmPopup 警告（将放弃本关进度）→ 确认后丢弃断点并 LevelInit 重新生成同关（随机关换新种子，02_StateMachine.md 规则 9）。
  - 按钮下方小字"第 {n} 关 · {关卡名}"始终显示当前目标关。
  - "**选择关卡**"细字链接常驻主按钮下方 → SCREEN_LEVEL_SELECT（重玩旧关 / 主动选关）。
  - 首启引导：GuideLayer 仅指向主按钮，一步即走。
- **底部入口排**（图标 + 短标签，五项）：
  | 入口 | 去向 | 备注 |
  |---|---|---|
  | 商店 | POPUP_SHOP | 阶段二前置灰 + 未开放文案 |
  | 行囊 | POPUP_BAG | 道具背包：主界面**只读**网格（"在冒险中使用"角标），局内同一弹窗可选目标使用 |
  | 图鉴 | POPUP_CODEX | 图鉴 + 成长树 + 星屑（原"旅人的行囊"更名，04_MetaProgression.md §5）；有可解锁项时红点 |
  | 排行榜 | POPUP_LEADERBOARD | 好友榜 + 日榜 |
  | 设置 | POPUP_SETTINGS | 模态弹窗（02_StateMachine.md 规则 6）；含音量 / 隐私政策 / 版本 |
- **脚注**：版本号 + 隐私政策文字链（00_Compliance.md）。
- **红点策略克制**：仅行囊（有可解锁项）、图鉴（有可解锁项）、签到（当日未签）允许红点。
- **公告挂载点预留**：进主界面后按弹窗队列依次弹（阶段二运营用，07_Ops_Release.md），一次一个。

**SCREEN_LEVEL_SELECT（选关）**：

- 关卡列表按阶段分页（themeId 分组）；已通关标记（可重玩）、当前解锁进度、未解锁置灰。
- "继续冒险"不在本页（已提升至主界面主按钮，见上）；本页只负责主动选关/重玩，选中 → 转移请求。

**SCREEN_BATTLE（局内）**：

- **顶部（经济组 + 系统入口）**：钱包金币（局内）+ Turn 计数 + **系统入口 ⚙**（见下）；变化必出飘字/滚动（11_Resources.md §4）。
- **目标区（LevelHeader 单行）**：关卡目标文案 + 出口条件缺口进度。
- **核心区**：**全阶段 5×5 矩阵盘**（堆散布占格、空格默认留白 + 装饰稀疏点缀 ≤1/3，06_Levels.md §3.1）——堆数 ≤3 时卡放大 300×300，≥4 堆单元格缩 140（只渲染 icon+数值+角标）；露边 ≥12px；顶牌可见度按堆配置 lit/dark，同关可混合（"部分亮"：如 4 堆两亮两暗）；dark 堆顶牌为深色底 + 剩余张数角标（参考 Card of Darkness 红色数字徽章）；Focus/Disabled 反馈（UiSpec §3）。
- **底部（生存组 + 行动组）**：
  - 生存组：**HP / Food / Shield**（贴近行动区，死亡压力可视化；Food=0 转危险色常驻警示，变化必出飘字/滚动）+ **装备槽 3 格**（武器/护甲/饰品 icon，点击 Tooltip 显示效果；旁挂 ATK/DEF 当前数值徽章）——装备卡翻开即入槽，**不入背包**，关卡结束消失（局内临时资源，11_Resources.md §3）。
  - 道具栏：快捷道具按钮 + 行囊入口（POPUP_BAG）；targeted 道具进 ItemTargeting。
  - 连击指示（当前连击数 + 下一档预览）；**状态效果条**（我方/敌人图标 + 层数角标）。
- **系统入口 ⚙**（02_StateMachine.md 规则 6 修订：设置弹窗 MainMenu 与 Battle 均可模态打开）：POPUP_SETTINGS 局内态含——继续冒险（关闭弹窗）、**保存并退出**（存断点 → 转移 MainMenu，二次确认）、音乐开关、音效开关、震动开关、**问题反馈**（跳微信客服，07_Ops_Release.md §6）；Resolving 结算中打开时排队至队列清空。
- 演出层：飘字、Boss 阶段横幅（boss_phase_changed.announce）、机关激活反馈。
- **局内禁止出现**：货架商店（购买仅限 evt_merchant 事件卡，16_Shop.md §1）、暂停机制（无 Pause 状态；系统入口不阻断 ActionQueue）。

**SCREEN_LEVEL_RESULT（结算覆盖屏）字段清单**：

| 分区 | 内容 |
|---|---|
| 标题区 | 胜利 / 失败（失败含死因文案，02_CopyDeck.md §5） |
| 收益区 | **金币 → 钱包转存明细**（"金币 +N 已存入行囊"）、星屑获得（仅首通）、道具掉落列表（icon×数量） |
| 统计区 | 击杀数、行动次数（Turn）、用时、剩余 HP/Food |
| 按钮组 | 下一关（主按钮）/ 重试 / 回菜单 / 广告复活（每关 1 次，不可用置灰）/ 行囊补给 → POPUP_SHOP（阶段二） |
| 幂等 | 收益确认后一次性写档，重复打开不重发（12_Rewards.md §3）；金币转钱包发 wallet_gold_changed |
| 动画 | 分步呈现：转钱包 → 星屑 → 掉落；受 skip 规则约束（00_UiSpec.md §5.1） |

## 3. 界面 ↔ 状态机对照

| 状态机状态 | 对应屏幕表现 |
|---|---|
| Boot / Loading | LoadingLayer 全屏遮罩 |
| MainMenu | SCREEN_MAIN_MENU |
| LevelSelect | SCREEN_LEVEL_SELECT |
| LevelInit / NextLevelInit | SCENE_BATTLE + LoadingLayer |
| PlayerTurn ⇄ ItemTargeting / EventChoice / Resolving / CheckResult | SCREEN_BATTLE 内输入锁切换（state_changed 驱动），EventChoice 另弹 POPUP_EVENT_CHOICE |
| LevelVictory / LevelDefeat → LevelResult | SCREEN_LEVEL_RESULT 覆盖屏 |
| 设置 | 不单列状态（02_StateMachine.md 规则 6），POPUP_SETTINGS |

## 4. UI 常量登记表（UIConst）

常量名一律 SCREAMING_SNAKE_CASE；值为类注册名 / prefab 路径。**新增界面/弹窗/层必须先在此登记**（与事件、错误码、文案同等的登记制度）。

### 场景（SceneConst，三场景，00_Architecture.md §6）

| 常量 | 值 |
|---|---|
| SCENE_BOOT | boot |
| SCENE_MAIN | main |
| SCENE_BATTLE | battle |

### 层（LayerConst，UiSpec §4.1 六层，值即节点名）

| 常量 | 值 |
|---|---|
| LAYER_SCENE | SceneLayer |
| LAYER_WINDOW | WindowLayer |
| LAYER_POPUP | PopupLayer |
| LAYER_TOAST | ToastLayer |
| LAYER_GUIDE | GuideLayer |
| LAYER_LOADING | LoadingLayer |

### 全屏界面（ScreenConst，挂 LAYER_WINDOW）

| 常量 | 值 | 挂载场景 |
|---|---|---|
| SCREEN_MAIN_MENU | main_menu | SCENE_MAIN |
| SCREEN_LEVEL_SELECT | level_select | SCENE_MAIN |
| SCREEN_BATTLE | battle | SCENE_BATTLE |
| SCREEN_LEVEL_RESULT | level_result | SCENE_BATTLE |

### 弹窗（PopupConst，挂 LAYER_POPUP，经队列）

| 常量 | 值 | 基类预设 |
|---|---|---|
| POPUP_MESSAGE | message | MessagePopup |
| POPUP_CONFIRM | confirm | ConfirmPopup |
| POPUP_LOADING | loading | LoadingPopup |
| POPUP_REWARD | reward | RewardPopup |
| POPUP_ERROR | error | ErrorPopup |
| POPUP_SETTINGS | settings | BasePopup |
| POPUP_BAG | bag | BasePopup |
| POPUP_EVENT_CHOICE | event_choice | BasePopup |
| POPUP_SHOP | shop | BasePopup（主界面 + 结算页双入口；阶段二开放购买、MVP 置灰，16_Shop.md） |
| POPUP_BAG | bag | BasePopup（行囊：主界面只读 / 局内可选目标使用） |
| POPUP_SIGN | sign | BasePopup（7 日循环签到，阶段二开放、MVP 置灰，01_GameDesign/17_SignIn.md） |
| POPUP_LEADERBOARD | leaderboard | BasePopup（02_Leaderboard.md） |
| POPUP_PROFILE | profile | BasePopup（我的：微信头像昵称授权 + 本地统计） |
| POPUP_CODEX | codex | BasePopup（图鉴：收集 + 成长树 + 星屑，原"旅人的行囊"更名，04_MetaProgression.md §5） |

## 5. 维护要求

- 新增屏幕/弹窗：登记第 4 节常量表 → 补第 2 节订阅/请求映射 → BaseView/BasePopup 子类 + 注册 → 单测覆盖订阅注销。
- 删除或改名同步更新本表与 02_StateMachine.md 对照（第 3 节）。
- 代码审查检查项：是否存在未登记界面名/弹窗名（对应 10_CodingStandards.md 审查清单）。
