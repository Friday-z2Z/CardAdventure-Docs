# AI 编码上下文（CodeBuddy / 其他 AI 助手必读）

本项目：《卡牌奇旅》微信小游戏，Cocos Creator 3.8.x + TypeScript，个人开发。

## 会话开始必须先读

1. `docs/00_Index.md` —— 文档索引与阅读顺序
2. `docs/02_Development/00_Architecture.md` —— 依赖方向与引擎隔离
3. `docs/02_Development/10_CodingStandards.md` —— 编码硬规范

## 最关键约束（违反即返工）

1. **引擎隔离**：`assets/scripts/core|game|systems` 禁止 `import "cc"`；引擎能力只在 `ui/` 与 `services/`。
2. **禁止散落调用 `wx.*`**：平台能力一律走 `services/` 的接口（IStorageService、IAdService、ILeaderboardService 等）。
3. **UI 不改规则**：UI 只发事件/请求；一切状态变更走 ActionQueue → EffectResolver。
4. **数值不硬编码**：只改 Balance 表后导出；配置 JSON 带 id/type/version/createdAt/updatedAt/author 公共字段。
5. **文案不出现在组件里**：玩家可见文本只来自 `docs/03_UI/02_CopyDeck.md`（key 取值）。
6. **事件先登记**：新增 EventBus 事件先登记 `docs/02_Development/04_EventCatalog.md`。
7. **每个任务输出**：影响系统 / 风险 / 回滚方案 + 新增测试（模板见 `docs/02_Development/09_Workflow.md` 第 4 节）。
8. **未经确认不得**：改技术栈、重构整个项目、删系统、改核心规则、改存档结构、批量生成未审核关卡、改设计令牌、引入未知依赖。

## 常用命令

- `npm test` —— 单测/集成（Node，不依赖引擎）
- `npm run validate` —— 全部配置验证器
- `npm run export:balance` —— Balance 表 → JSON
- `npm run check:licenses` —— itch.io 素材许可证核对

## 完成定义

代码能编译 ≠ 完成。必须有对应测试、登记事件/文案/错误码、更新相关文档，并跑 `npm test` 与 `npm run validate` 全绿。
