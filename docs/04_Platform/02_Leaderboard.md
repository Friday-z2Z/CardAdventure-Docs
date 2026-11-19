# 全服排行榜（通关数榜）

> 2026-11-18 重设：V1 **只有一张全服榜**，按累计通关关卡数降序；原「好友榜 + 日榜 + 开放数据域」方案整体废弃。榜单数据来自云开发，界面由**主域**直接渲染，不再有子域 / sharedCanvas / postMessage 通道。

## 1. 榜单规则

| 项 | 规则 |
|---|---|
| 唯一榜单 | 全服通关数榜，名次按 `clearedCount` 降序；同数按 `updatedAt` 升序（先达成者靠前） |
| `clearedCount` | = `ProgressData.completedLevels.length`（服务端从 `player_saves` 读取并同步写入），**不是**当前解锁关；零通关玩家也可上榜（显示 0） |
| 展示范围 | 前 **50 名** + 本人名次；V1 不翻页、不分页、不按日/周重置 |
| 身份与展示 | `openid` 只在云函数内部作为主键；展示用昵称/头像来自用户主动填写的 `POPUP_PROFILE`，未填写显示“旅人 + 默认剪影”，不暴露 openid |
| 提交时机 | `level_completed` 后异步调用云函数 `rankUpdate`；失败静默重试 1 次，不阻塞结算 |
| 防作弊 | 服务端校验 `clearedCount` 单调不减且 ≤ 配置总关数 500；回退值直接丢弃并记 `error_caught` |

**取消项**：好友榜、日榜、`daily_score` 集合、`wx.setUserCloudStorage` / `wx.getFriendCloudStorage`、`yyyymmdd|最高关` 的 `daily` 字段、开放数据域子域与 postMessage 字体下发、90 天日榜清理任务。这些不再出现在实现与文档中。

## 2. 云集合与云函数

| 项 | 规则 |
|---|---|
| 集合 | **`global_rank`**：`_id = openid`，字段 `clearedCount` / `level` / `nickname` / `updatedAt`；索引 `(clearedCount desc, updatedAt asc)` |
| 写入 | 仅云函数 `rankUpdate` 可写；`openid` 从 `cloud.getWXContext().OPENID` 取，客户端不能传 |
| 查询 | 云函数 `rankTop` 返回 `{ rows: Top50[], self: { rank, clearedCount } }`；主域渲染，客户端不直连数据库 |
| 清理 | 无日榜清理需求；离职/注销账号按平台流程处理，V1 不设 TTL |
| 额度 | 写入量 = 通关事件数（远低于日榜提交频次）；上线前按当期官方口径实测一次 |

## 3. 主域流程

1. 主界面点“排行榜” → 隐私授权（未授权不显示入口，00_Compliance.md §2）→ `ILeaderboardService.fetch()`。
2. 云函数返回前 50 与本人名次 → UI 在主域用普通 Cocos 组件渲染，复用统一列表与空态。
3. 关闭直接销毁列表；无子域贴图、无 rAF 常驻、无字体跨域同步问题。

## 4. 降级与空态

| 场景 | 行为 |
|---|---|
| 无网络 / 云函数失败 | 展示上次缓存榜单（若有）并标“暂时无法更新”；无缓存则展示空态文案（CopyDeck §5） |
| 无玩家数据 | 前 50 未满时只显示已有条目，不补假数据 |
| 未填写昵称 | 显示“旅人”与默认剪影，不阻断上榜 |

## 5. 验收

- 排序正确：通关数多者在前；同数按达成时间升序；本人名次 = `count(clearedCount > 自己) + 1`。
- 防回退：云函数拒绝 `clearedCount` 变小或 >500 的写入。
- 无残留：全文无好友榜、日榜、`daily_score`、开放数据域、sharedCanvas、postMessage 排行榜引用。
- 主域 60fps 下列表滚动无掉帧；无子域常驻绘制。

## 6. 合规联动

进入排行榜前触发 `wx.requirePrivacyAuthorize`；隐私后台只声明“openid + 通关数 + 用户主动填写的昵称头像用于全服榜展示”。拒绝授权时隐藏入口，不影响主线玩法与本地/云存档。
