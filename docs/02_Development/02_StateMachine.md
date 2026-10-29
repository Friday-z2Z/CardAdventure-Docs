# 游戏运行状态机

> 新增章节（采纳评审建议）。总规格书 2.1 的线性流程是玩家视角；本文是程序视角的正式状态机定义。AI 编码必须按本文实现状态流转。

## 1. 状态总览

```text
Boot → Loading → MainMenu → LevelSelect → LevelInit
  MainMenu → LevelInit（直达：主按钮"开始游戏"无断点时直进下一关，03_UI/03_Screens.md 2.1）
  → PlayerTurn ⇄ ItemTargeting / EventChoice
  → Resolving → CheckResult
  → PlayerTurn（继续） | LevelVictory | LevelDefeat
  → LevelResult → NextLevelInit / MainMenu
```

## 2. 状态定义表

| 状态 | 允许操作 | 禁止操作 | 进入条件 | 退出条件 | 异常与超时处理 |
|---|---|---|---|---|---|
| Boot | 引擎初始化 | 任何玩家输入 | 应用启动 | 初始化完成 | 初始化失败 → 显示错误页并可重试 |
| Loading | 显示进度 | 操作 | Boot 完成 / 切换场景 | 必需资源就绪 | 资源加载失败 → 回退占位资源，记录错误 |
| MainMenu | 点按钮 | 操作卡牌 | Loading 完成 | 进入关卡选择/设置 | — |
| LevelSelect | 选关、查看存档 | 操作 | MainMenu 点击 | 选中关卡 | 关卡配置缺失 → 置灰该关 |
| LevelInit | 读配置、生成布局、创建 GameState | 玩家决策 | LevelSelect 选中关卡 / MainMenu 主按钮直达（新玩家→第 1 关；老玩家→断点恢复或下一未通关关，见 03_UI/03_Screens.md 2.1） | 布局与状态就绪 | 配置/种子无效 → 报错回菜单 |
| PlayerTurn | 点顶层卡、点道具、查看信息 | 重复点击已锁定卡 | LevelInit 或 CheckResult 通过 | 请求入队成功 | 输入锁：结算中点击排队或忽略并提示 |
| ItemTargeting | 选目标、取消 | 操作卡牌堆 | 使用 targeted 道具 | 目标合法提交 / 取消 | 目标失效（如敌人已死）→ 提示并回到 PlayerTurn |
| EventChoice | 选事件选项、确认支付 | 操作卡牌堆 | 事件卡/商店触发弹窗（evt_campfire 二选一、evt_shrine 献祭、evt_merchant 购买等） | 选项校验通过并入队 / 关闭弹窗 | 支付失败（金币/食物不足）→ 错误码提示，留在弹窗 |
| Resolving | 观看演出 | 任何影响结算的输入 | ActionQueue 开始执行 | 队列清空 | 结算异常 → 记录日志、回滚到队列起点快照 |
| CheckResult | — | 玩家输入 | 队列清空 | 判定完成 | — |
| LevelVictory / LevelDefeat | 确认 | 操作 | CheckResult 判定 | 进入 LevelResult | — |
| LevelResult | 查看结算、下一关/重试/回菜单；失败时可看广告复活（每关 1 次，01_Monetization.md） | 操作 | 胜利或失败确认 | 场景切换（复活 → 回 PlayerTurn） | 存档失败 → 本地暂存并重试；广告不可用 → 复活按钮置灰 |
| NextLevelInit | — | — | 通关确认进入下一关 | 进入 LevelInit | 同 LevelInit |

## 3. 转移规则（硬性约束）

1. **只有 StateMachine 可以执行状态转移**。UI 只能发出"转移请求"，GameController 负责校验并执行。
2. 只有 `Resolving` 状态期间允许规则引擎变更 GameState；`PlayerTurn` 期间状态只读。
3. 每个状态必须声明上述六个要素（允许/禁止/进入/退出/异常），新增状态必须先补表再编码。
4. 状态转移时发布对应事件（`state_changed`），UI 据此切换输入锁与界面。
5. 玩家在结算过程中退出（边界用例 16，见 11_Testing.md）：依赖存档快照恢复到最近的 `PlayerTurn`，不重建中途结算。
6. 设置面板（POPUP_SETTINGS）在 `MainMenu` 与 `Battle` 均可模态打开，不单列状态；局内态含"保存并退出"（存断点 → 转移 MainMenu，2026-10 修订，03_UI/03_Screens.md 2.1）。设置变更经 SaveData.settings 持久化（10_CodingStandards.md 第 4 节）。
7. "跳过行动"机制不在 MVP 范围；若后续引入，必须先在本表新增状态并定义其与食物/连击的关系。
8. 启动阶段（Boot/Loading）的阶段划分、并行任务与超时降级以 04_Platform/03_Packaging.md 第 4 节为权威，本表只定义状态语义。
9. **重开本关（修复断点死局）**：主界面在"继续冒险"（有断点）态提供"重开本关"次级入口——经 ConfirmPopup 二次确认后**丢弃当前断点快照**，对同一关执行 LevelInit 重新生成（固定关用原 generationSeed；随机关生成**新种子**，旧进度作废）。该转移复用 MainMenu → LevelInit 直达路径，不新增状态。
10. **局内手动退出**：PlayerTurn / ItemTargeting / EventChoice 态可经系统入口"保存并退出"→ 写断点快照 → 转移 MainMenu（与杀进程/切后台的自动断点同路径，11_Testing.md 用例 16）；Resolving 态入口排队至队列清空后生效，不允许在结算中途转移。

## 4. 与总规格书的对应

- 2.1 的 14 步流程映射：步骤 6～7 = PlayerTurn；步骤 8～9 = Resolving；步骤 10 = CheckResult；步骤 11 = 更新后回到 PlayerTurn。
- 8.6 的"操作锁或队列"由 `Resolving` 状态 + ActionQueue 共同实现。
