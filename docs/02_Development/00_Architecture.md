# 系统架构

> 来源：总规格书 7.1～7.3、9.2、9.3，并新增数据流水线与平台接口层规范。本文是程序开发的架构总纲。

## 1. 核心系统闭环

**关卡生成 → 卡牌探索 → 风险决策 → 资源变化 → 道具使用 → 战斗与事件 → 出口解锁 → 关卡结算 → 奖励成长 → 下一关。**

每个系统必须有输入、处理规则和输出：

| 系统 | 输入 | 处理 | 输出 |
|---|---|---|---|
| 关卡系统 | 关卡配置、种子 | 加载布局与目标 | 可玩关卡 |
| 卡牌系统 | 玩家选择 | 检查与处理卡牌 | 卡牌状态变化 |
| 战斗系统 | 双方属性、效果 | 伤害和战斗结算 | 生命及战斗结果 |
| 资源系统 | 收益和消耗事件 | 资源增减与上限检查 | 新资源状态 |
| 道具系统 | 道具使用请求 | 条件验证与效果执行 | 道具效果和库存变化 |
| 状态系统 | 状态添加或移除 | 持续时间与触发结算 | 当前状态列表 |
| 连击系统 | 有效操作事件 | 判断连击条件 | 连击奖励 |
| 出口系统 | 当前目标状态 | 检查通关条件 | 是否允许离开 |
| 奖励系统 | 关卡结果 | 奖励结算 | 新资源或解锁 |
| 存档系统 | 状态变化 | 保存和恢复 | 持久化进度 |
| UI 系统 | 状态变更事件 | 展示变化 | 玩家反馈 |

## 2. 依赖方向（必须遵守，禁止反向）

```text
UI
 ↓
GameController
 ↓
StateMachine / ActionQueue          ← 见 02_StateMachine.md / 03_ActionQueue.md
 ↓
ActionResolver
 ↓
EffectResolver
 ↓
GameState / BattleSystem / ResourceSystem / StatusSystem
 ↓
EventBus（状态提交后广播）
 ↓
UI Refresh / Animation / Sound / Analytics
```

- 游戏状态由统一的 GameState 模块持有（见 01_GameState.md）。
- 各业务系统不得相互引用内部变量，跨系统行为通过明确的服务接口或效果执行接口实现。
- 监听 EventBus 的系统不得直接修改核心状态，只能发起新的动作请求。

## 3. 核心模块职责

| 模块 | 职责 | 不允许负责 |
|---|---|---|
| GameState | 保存当前游戏状态 | 绘制 UI、动画、加载图片、处理点击 |
| StateMachine | 管理游戏运行状态与转移 | 结算效果 |
| ActionQueue | 串行执行动作与效果 | 判断合法性 |
| ActionResolver | 判断操作是否合法 | 修改状态 |
| EffectResolver | 统一执行效果 | 直接操作 UI |
| BattleSystem | 战斗规则、伤害计算、敌人行动 | 修改库存 |
| LevelSystem | 加载关卡、生成布局、检查目标 | 结算战斗 |
| ItemSystem | 道具使用、库存、目标校验 | 直接扣 UI 血条 |
| SaveSystem | 保存、读取、迁移、验证存档 | 修改游戏规则 |
| UI 层 | 展示、输入、反馈 | 战斗公式、道具规则、通关判断 |

## 4. 数据流水线（配置驱动）

所有配置数据（卡牌、道具、敌人、关卡、数值）必须经过同一条流水线：

```text
JSON 配置文件
  ↓ Loader（统一加载、去重、版本标记）
  ↓ Validator（CardValidator / ItemValidator / EnemyValidator / LevelValidator，见 06_DataBalance.md）
  ↓ Registry（按 id 注册，运行期只读）
  ↓ Factory（按定义创建运行时实例）
  ↓ 游戏对象
```

规则：

1. 运行期配置只读，任何系统不得改写 Registry 中的定义。
2. 新增一个普通敌人/卡牌/道具，原则上不修改任何系统代码，只新增配置。
3. 只有全新机制才需要开发新的效果处理逻辑。
4. 校验失败的配置必须阻断启动（开发期）或使用安全回退（线上），不允许带病运行。

## 5. 平台接口层（禁止散落调用 wx.* 与引擎单例）

平台 API（wx.*）与引擎全局能力必须经 `services/` 层封装为接口，业务代码禁止直接调用 `wx.xxx`；UI 层允许使用 `cc.*` 组件能力，但涉及平台的能力仍走 services：

| 接口 | 封装内容 |
|---|---|
| IStorageService | 存档读写（wx.setStorage 等） |
| ILeaderboardService | 排行榜、开放数据域通信（postMessage、sharedCanvas） |
| IAdService | 激励视频、Banner（点位定义见 04_Platform/01_Monetization.md） |
| IPaymentService | 内购/虚拟支付（预留，需版号后启用，01_Monetization.md 第 4 节） |
| IShareService | 分享、拉新（05_Share.md） |
| IAudioService | BGM / SFX 播放与音量 |
| IPlatformService | 震动（vibrate）、剪贴板等杂项平台能力 |
| IAssetService | 资源加载、分包加载、CDN 资源 |

好处：平台 API 变更时只改一处；测试环境可注入 mock 实现；未来跨平台无需重写业务。

## 6. 代码目录（Cocos Creator 工程）

```text
card-adventure/                  Creator 项目根（Dashboard 打开）
├── package.json / settings/ / profiles/   项目与构建配置
├── assets/
│   ├── scenes/                  Boot / MainMenu / Battle（关卡复用 Battle 场景动态生成）
│   ├── scripts/                 全部 TypeScript 业务代码
│   │   ├── app/                 bootstrap、app-config、app-lifecycle
│   │   ├── core/                event-bus、random、logger、error-handler、constants
│   │   ├── game/                game-controller、game-state、action-resolver、
│   │   │                        effect-resolver、turn-manager、game-result
│   │   ├── systems/             battle / card / item / resource / status /
│   │   │                        combo / level / reward / save 九大系统
│   │   ├── ui/                  base/（BaseView/BasePopup/Toast 视图基类，见 03_UI/00_UiSpec.md 4.1）、
│   │                        components/（组件库）、screens/、dialogs/、animations/
│   │   └── services/            analytics、audio、asset、storage、leaderboard、
│   │                            ad、share —— 平台与引擎能力只在这里出现
│   ├── resources/               动态加载资源（resources.load）
│   │   └── data/                cards/、items/、enemies/、levels/、balance/、copy/（JSON 配置）
│   ├── bundles/                 Asset Bundle：stage2～stage5（对应微信分包）、boss 演出
│   ├── art/                     images/、icons/、ui/（随包素材，itch.io 加工后入库）
│   ├── audio/                   bgm/、sfx/
│   └── fonts/                   云端字体的本地回退字体
├── openDataContext/             开放数据域子域（原生 canvas，02_Leaderboard.md）
├── tests/                       单测/集成（Node 运行，不进 assets）
├── scripts/                     export:balance / validate / check:licenses
└── build/                       构建产物（构建面板输出，指向微信开发者工具）
```

### 引擎隔离规则（硬约束）

- `scripts/core`、`scripts/game`、`scripts/systems` **禁止 `import "cc"`**——纯 TypeScript 逻辑，`tests/` 里在 Node 直接跑（11_Testing.md 第一、二层）。
- 引擎能力（节点、动画、音频、输入）只出现在 `scripts/ui` 与 `scripts/services`。
- 由此业务架构不绑引擎：未来迁移引擎只重写 ui/services 两层。

目录可随 Creator 版本微调，但职责边界、依赖方向与引擎隔离不可破坏。

## 7. 工程初始化清单（开发环境冻结项）

| 工具 | 版本策略 | 用途 |
|---|---|---|
| Cocos Creator | 3.8.x LTS（锁定小版本） | 引擎与编辑器，构建面板直出微信小游戏 |
| Node.js | LTS（≥20） | 跑 scripts 与测试 |
| TypeScript | 严格模式（10_CodingStandards.md 禁令 1） | 全部代码 |
| 测试框架 | Vitest | tests/ 第一、二层测试（Node 跑，靠引擎隔离） |
| Lint / 格式化 | ESLint + Prettier | 禁令自动化；CI 前置 |
| 微信开发者工具 | 最新稳定版 | 打开 build/ 产物、真机预览、提审 |
| npm scripts | test / validate / export:balance / check:licenses | 数据流水线与 CI |

初始化顺序：主体注册（00_Compliance.md）→ Creator 建工程 → 按第 6 节建目录骨架 → services 接口空实现 → 第一个可构建的微信包 → tests+lint 跑通 → 之后才写业务。
