# 签到系统详设（阶段二）

> 2026-10 新增（用户决策）。定位：留存功能，实现成本低、早上早受益，但按用户排期**阶段二（通过第 20 关）开放**；MVP 期间主界面顶栏入口展示但置灰（与商店同口径，16_Shop.md）。

## 1. 入口与形态

- **入口**：主界面顶栏右端日历图标（不占底部入口排——签到是"每日路过点一下"）；当日未签显示红点。
- **弹窗**：POPUP_SIGN（BasePopup 子类），7 日循环横排日历，当日格高亮，已领格置灰打勾。
- **领取结果**：复用 RewardPopup 展示（UiSpec §4.1 首批基础弹窗）。

## 2. 签到规则

| 规则 | 内容 |
|---|---|
| 周期 | 7 日一循环，第 7 日领完回到第 1 日 |
| 断签 | **顺延不清零**（休闲向红线）：今天没来，明天接着领下一天，不做补签（V1 不做） |
| 计日 | 自然日（本地时区），以 `lastSignDate` 判定 |
| 防刷 | V1 接受客户端时间风险（单机无服务器校验，损失有限）；若后续上云开发日榜可加服务端时间核对 |
| 每日一次 | 已签当日再点弹"今天已领过啦" |

## 3. 奖励（V1 基线，走配置）

**只发钱包金币 + 消耗品道具，不发钻石**——钻石产出渠道是登记制（首次通关 + 成就，04_MetaProgression.md §2），签到不稀释其稀缺性。

| 天数 | 奖励 |
|---|---|
| 1 | 钱包金币 ×20 |
| 2 | potion_small ×1 |
| 3 | 钱包金币 ×30 |
| 4 | ration ×2 |
| 5 | shield_scroll ×1 |
| 6 | 钱包金币 ×50 |
| 7 | potion_large ×1 |

- 奖励表走配置 JSON（`assets/resources/data/sign/sign_rewards.json`，公共字段见 06_DataBalance.md 第 1 节），调整不改代码。
- 发放路径：校验今日未领 → 发钱包金币（`wallet_gold_changed`）与道具（`item_gained` 入 Inventory）→ RewardPopup → 写档；不经 ActionQueue（非局内，同商店口径）。

## 4. 存档与埋点

- 存档：`ProgressData.signData = { claimedDay: 1~7, lastSignDate: string }`（cycleDay 由 claimedDay 隐含，第 7 日领完归 1）；随存档迁移链升级（10_CodingStandards.md 第 4 节）。
- 埋点：`sign_open`（打开弹窗）、`sign_claim`（领取，专有字段 day）——登记进 06_Analytics.md 事件字典。
