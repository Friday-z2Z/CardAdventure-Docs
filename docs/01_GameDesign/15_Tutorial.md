# 新手引导系统详设

> 补全章节。06_Levels.md 只写了"前 5 关强引导"，本文定义引导系统的架构原则、脚本与实现约束。

## 1. 架构原则（硬约束）

1. **引导与规则解耦**：引导系统是 EventBus 的普通监听者 + 一个覆盖层（遮罩 + 高亮 + 提示框），**不修改任何规则代码、不写在 UI 回调里**（10_CodingStandards.md 禁令 6）。
2. 引导步骤是配置数据（`tutorial_steps` 配置，走数据流水线与 LocalizationValidator）。
3. 引导只在特定关卡触发（关卡配置 `tutorialId`），不影响其他关卡的逻辑路径。
4. 引导期间规则引擎照常运转——引导只做"视觉引导 + 输入拦截"，不做隐藏结算。

## 2. 输入拦截机制

- 引导激活时，引导层拦截 PlayerTurn 的点击：不符合当前步骤的交互点显示"灰遮罩 + 原因气泡"，符合的放行为正常 ActionResolver 请求。
- 拦截层在 UI 之上、规则之下——被拦截的点击不产生 Action。
- 引导步骤的推进条件 = 监听特定事件（如 `stack_updated` / `hp_changed`），不轮询。

## 3. 前 5 关脚本

| 关 | 引导目标 | 步骤要点 |
|---|---|---|
| 1 | 基本操作 | 高亮矩阵盘 lit 堆顶牌 → **两段式教学**：第一次点击 Focus 看详情（Tooltip）、再次点击确认执行（00_UiSpec.md 点击交互细则）→ 观看结算与资源变化 |
| 2 | 敌人与驻留 | 打一只 enemy_rat_01 → 讲解驻留封锁（10_Battle.md 第 2 节）→ 必须清掉才能继续 |
| 3 | 食物压力 | 讲解每操作 -1 食物；故意让玩家经历一次 Food=0 惩罚提示 |
| 4 | 道具 | 关卡内固定给 1 个 potion_small → 讲解道具栏与使用流程（04_Items.md） |
| 5 | 出口与条件 | 讲解出口卡与条件缺口提示（13_Exit.md 第 2 节）→ 完成首次通关 |

第 6 关起不再有强制引导；第 6～20 关按"每关学一个规则"自然引入（06_Levels.md 阶段一）。

## 4. 存档与跳过

- 引导完成标记存 `progress.tutorialDoneSteps: string[]`（10_CodingStandards.md 第 4 节），重进不再触发已完成步骤。
- 步骤可跳过：每步提供"跳过引导"入口，跳过即整段标记完成，不强制看完。
- 设置面板提供"重看教学"（重进第 1 关，不重置关卡进度）。

## 5. 验收

- 首次安装新档：不点跳过的情况下，5 关内无任何需要教程外的隐性知识。
- 引导期间快速连点、切后台恢复不产生重复 Action（11_Testing.md 第四层）。

## 6. 新系统首见一次性提示（2026-10 补）

新机制首次出现时显示一次性气泡提示（GuideLayer 渲染，点击任意处关闭，永不再现）。状态存 `progress.firstSeenHints: string[]`（登记表如下，新增提示点先登记）：

| 提示点 id | 触发时机 | 文案要点 |
|---|---|---|
| hint_dark_stack | 首个含 dark 堆的关（阶段二起） | "角标是张数——翻开前，谁也不知道是什么。" |
| hint_equip_slot | 首件装备卡入槽 | "装备直接生效，不占背包；本关结束消失。" |
| hint_event_popup | 首张事件牌弹窗 | "选择由你定，后果也是。" |
| hint_wallet_deposit | 首次胜利结算 | "金币已存入背包，回营地可以采购补给。" |
| hint_shop_open | 通过第 20 关（商店开放） | "行商到了！用背包里的金币换补给。" |
| hint_carry | 首次进关且背包有道具 | "背包里的道具要在出发前携带，局内才能使用。" |
| hint_sign_open | 通过第 20 关（签到开放） | "每天来领一份旅途补给。" |
| hint_multi_stack | 盘面堆数首次 ≥6（阶段三） | "墓室越来越深，选好路线再动手。" |

## 7. 引导步骤配置结构（tutorial_steps）

引导步骤是配置数据（走数据流水线与 LocalizationValidator，§1 原则 2），结构如下：

```ts
interface TutorialStep {
  id: string;               // 如 "t1_focus"
  levelId: number;          // 所属关
  order: number;            // 步骤序号
  triggerEvent: string;     // 进入本步的监听事件（如 "state_changed:PlayerTurn"）
  highlightTarget: string;  // 高亮目标：UIConst 引用或节点路径（如 "SCREEN_BATTLE/stacks[0]/topCard"）
  textKey: string;          // 提示文案（02_CopyDeck.md key）
  advanceEvent: string;     // 推进条件事件（如 "stack_updated"）
  advanceCondition?: string;// 附加条件表达式（如 "combo >= 1"，缺省为事件即推进）
  allowSkip: boolean;       // 是否可跳过（§4）
}
```

第 1 关样例（三步，文件 `assets/resources/data/tutorial/tutorial_steps.json`，含公共字段）：

```json
{ "id": "tut_level1", "type": "tutorial", "version": 1, "createdAt": "2026-10-29", "updatedAt": "2026-10-29", "author": "design",
  "steps": [
    { "id": "t1_focus", "levelId": 1, "order": 1, "triggerEvent": "state_changed:PlayerTurn",
      "highlightTarget": "SCREEN_BATTLE/stacks/topCard", "textKey": "key:tut_tap_card",
      "advanceEvent": "card_selected", "allowSkip": true },
    { "id": "t1_confirm", "levelId": 1, "order": 2, "triggerEvent": "card_selected",
      "highlightTarget": "SCREEN_BATTLE/stacks/topCard", "textKey": "key:tut_confirm_card",
      "advanceEvent": "card_resolved", "allowSkip": true },
    { "id": "t1_resource", "levelId": 1, "order": 3, "triggerEvent": "card_resolved",
      "highlightTarget": "SCREEN_BATTLE/statusBar", "textKey": "key:tut_watch_resource",
      "advanceEvent": "stack_updated", "allowSkip": true }
  ]
}
```

推进条件=监听事件不轮询（§2）；文案 key 全部登记 02_CopyDeck.md。
