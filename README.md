# CardAdventure-Docs

《卡牌奇旅》——微信小游戏（竖屏 Roguelike 卡牌）项目文档库。

## 文档结构

- `docs/00_Index.md` — **从这里开始**：文档索引 + 原总规格书章节映射表
- `docs/01_GameDesign/` — 策划侧：总览、核心循环、玩家状态、卡牌系统、首批卡牌清单、道具、连击、500 关、路线图、数值基线（平衡方案已冻结）
- `docs/02_Development/` — 程序侧：架构、状态机、动作队列、事件目录、性能预算、数据与验证、代码规范、测试、工作流、交付与风险
- `docs/03_UI/` — UI 视觉规范、音频规范、游戏内文案总表（Copy Deck）
- `docs/04_Platform/` — 平台与运营（8 份）：合规上架、商业化、排行榜、分包与 CDN、永久成长、分享、埋点字典、运营发布

> 原 `设计说明.md`（总规格书 V1.0）已全部提炼进 `docs/` 并删除。

## 快速约定

- 技术路线：Cocos Creator + TypeScript（构建目标：微信小游戏）
- 平衡方案：方案一（玩家初始属性不动，早期敌人 HP 2～5 / ATK 1～2）——见 `docs/01_GameDesign/09_BalanceBaseline.md`
- 结算：所有效果走 ActionQueue 串行执行；UI 不改规则
- 数值调整：只改 Balance 表导出，不直接改 JSON
- 玩家可见文案：只出自 `docs/03_UI/02_CopyDeck.md` 与卡牌清单，UI 禁止硬编码
- 商业化：激励视频为主、不卖数值——见 `docs/04_Platform/01_Monetization.md`
