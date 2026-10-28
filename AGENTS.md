# AI 编码上下文（CodeBuddy / 其他 AI 助手必读）

本项目：《卡牌奇旅》微信小游戏。技术栈：**Cocos Creator 3.8.x LTS + TypeScript（严格模式）**，个人开发，构建目标微信小游戏。

## 会话开始必须先读（按序）

1. `docs/00_Index.md` —— 文档索引与阅读顺序
2. `docs/02_Development/00_Architecture.md` —— 依赖方向、引擎隔离、工程初始化
3. `docs/02_Development/10_CodingStandards.md` —— 编码硬规范（命名/十条禁令/错误码/存档）

## 任务 → 文档速查

| 任务类型 | 先读 |
|---|---|
| 写战斗/卡牌逻辑 | `01_GameDesign/03_Cards.md` + `02_Development/03_ActionQueue.md` + `10_Battle.md` |
| 写 UI/弹窗/飘字 | `03_UI/00_UiSpec.md` + `02_CopyDeck.md`（文案只从这里取） |
| 写道具/商店 | `01_GameDesign/04_Items.md`、`16_Shop.md` |
| 写/改状态效果 | `01_GameDesign/02_Player.md` |
| 生成/改关卡 | `01_GameDesign/06_Levels.md` + `07_CardCatalog.md`（卡池）+ `09_BalanceBaseline.md`（数值锚点） |
| 存档相关 | `02_Development/10_CodingStandards.md` 第 4 节 + `01_GameState.md` |
| 新增事件/错误码/文案 | 先登记：`04_EventCatalog.md` / `10_CodingStandards.md` 第 3 节 / `02_CopyDeck.md` |
| 平台能力（广告/分享/榜单/存档） | `04_Platform/` 对应文档 + `00_Architecture.md` 第 5 节 |

## 代码放哪（目录速查）

- 纯逻辑（禁 `import "cc"`）：`assets/scripts/core | game | systems`
- 引擎相关：`assets/scripts/ui`（视图）、`assets/scripts/services`（平台与引擎能力）
- 配置 JSON：`assets/resources/data/`；测试：`tests/`；脚本：`scripts/`
- 完整树：`docs/02_Development/00_Architecture.md` 第 6 节

## 最关键约束（违反即返工）

1. **引擎隔离**：`assets/scripts/core|game|systems` 禁止 `import "cc"`；引擎能力只在 `ui/` 与 `services/`。
2. **禁止散落调用 `wx.*`**：平台能力一律走 `services/` 的接口（IStorageService、IAdService、ILeaderboardService 等）。
3. **UI 不改规则**：UI 只发事件/请求；一切状态变更走 ActionQueue → EffectResolver。
4. **数值不硬编码**：只改 Balance 表后导出；配置 JSON 带 id/type/version/createdAt/updatedAt/author 公共字段。
5. **文案不出现在组件里**：玩家可见文本只来自 `docs/03_UI/02_CopyDeck.md`（key 取值）。
6. **先登记再编码**：新事件（04_EventCatalog）、新错误码（10_CodingStandards 第 3 节）、新文案（02_CopyDeck）、新素材含许可证（00_Compliance 第 4 节）必须先登记对应文档。
7. **随机必须走种子**：影响结果的随机一律走统一随机模块（core/random）。
8. **每个任务输出**：改动说明 + 影响系统 / 风险 / 回滚方案 + 新增测试（模板见 `docs/02_Development/09_Workflow.md` 第 4 节）。
9. **未经确认不得**：改技术栈、重构整个项目、删系统、改核心规则、改存档结构、批量生成未审核关卡、改设计令牌、引入未知依赖。

## 权限边界

- **允许伴随性登记**：任务涉及的 EventCatalog / 错误码表 / CopyDeck / 索引更新。
- **不得擅改规范**：冻结决策（平衡方案一、技术栈、里程碑、性能预算、商业化边界）与设计文档正文，未经用户确认不得修改。
- **规则有歧义或文档间冲突时，停下提问**，不得自行解释后继续。
- 不主动 `git commit`；提交信息遵循 `09_Workflow.md` 第 2 节。

## 常用命令

`npm test`（单测/集成，Node 不依赖引擎）、`npm run validate`（全部配置验证器）、`npm run export:balance`（Balance 表 → JSON）、`npm run check:licenses`（itch.io 素材许可证核对）

> 注意：工程初始化（`00_Architecture.md` 第 7 节）完成前这些脚本尚不存在；初始化任务按该节清单执行，不要臆造脚本内容。

## 完成定义

代码能编译 ≠ 完成。每个任务必须交付：改动说明 + 影响系统 / 风险 / 回滚方案 + 新增测试，且 `npm test` 与 `npm run validate` 全绿、相关登记已同步。AI 完成后仍需人工检查（09_Workflow.md 第 4 节）。
