# CardAdventure-Docs

《卡牌奇旅》——微信小游戏（竖屏 Roguelike 卡牌）项目文档库。

**项目状态：** 设计文档体系已完成（40 份），代码工程未开始。技术栈：Cocos Creator 3.8.x LTS + TypeScript，构建目标微信小游戏，个人开发 + AI 辅助。

## 文档结构（40 份）

```text
docs/
├── 00_Index.md          从这里开始：索引 + 原总规格书章节映射
├── 01_GameDesign/ (17)  策划侧：总览/核心循环/玩家/卡牌/道具/连击/关卡/
│                        卡牌图鉴/路线图/数值基线/战斗/资源/奖励/出口/精英首领/引导/商店
├── 02_Development/ (11) 程序侧：架构/状态机/动作队列/事件/性能/数据验证/
│                        工作流/编码规范/测试/交付风险（07、08 编号预留）
├── 03_UI/ (3)           视觉规范、音频规范、游戏内文案总表（Copy Deck）
└── 04_Platform/ (8)     合规、商业化、排行榜、分包 CDN、永久成长、分享、埋点、运营发布
```

> 原 `设计说明.md`（总规格书 V1.0）已全部提炼进 `docs/` 并删除，文内"总规格书 X.Y"均为历史出处标注。

## 从哪里开始

| 你是谁 | 入口 |
|---|---|
| AI 助手（CodeBuddy 等） | **先读根目录 `AGENTS.md`**，再按其指引读 docs |
| 策划 | `docs/00_Index.md` 阅读顺序 → `01_GameDesign/` |
| 程序 | `docs/00_Index.md` 阅读顺序 → `02_Development/`，工程初始化见 `00_Architecture.md` 第 7 节 |
| 美术/素材 | `03_UI/00_UiSpec.md`（含 itch.io 素材二次加工规范） |

开工第一件事：主体注册与备案/软著（`docs/04_Platform/00_Compliance.md`，周期最长）。

## 快速约定

- 技术路线：Cocos Creator + TypeScript（构建目标：微信小游戏）
- 平衡方案：方案一（玩家初始属性不动，早期敌人 HP 2～5 / ATK 1～2）——见 `docs/01_GameDesign/09_BalanceBaseline.md`
- 结算：所有效果走 ActionQueue 串行执行；UI 不改规则
- 引擎隔离：`core / game / systems` 禁止 `import "cc"`；平台能力只走 `services/`
- 数值调整：只改 Balance 表导出，不直接改 JSON
- 玩家可见文案：只出自 `docs/03_UI/02_CopyDeck.md` 与卡牌清单，UI 禁止硬编码
- 商业化：激励视频为主、不卖数值、内购冻结——见 `docs/04_Platform/01_Monetization.md`
