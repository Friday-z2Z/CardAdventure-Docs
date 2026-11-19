# 运营与发布

> 补齐上线后的运维规范：版本通道、热更、灰度回滚、监控告警、存档校验。发布物清单见 12_Delivery_Risk.md 第 1 节 E。

## 1. 版本通道与发布流程

```text
develop → 体验版（内测二维码）→ 提审 → 审核版 → 全量发布
```

- 每次提审附：变更说明、已知问题（12_Delivery_Risk.md 第 1 节 E 模板）。
- 发布前跑完 11_Testing.md 第五层发布验收 + 05_Performance.md 预算校验。
- 提审避开周末与节假日（审核排队），预留 1～3 天缓冲（08_Roadmap.md 排期含此缓冲）。

## 2. 回滚

- 微信支持**线上版本回退一级**：发现问题 → 后台一键回退上一版本（秒级生效）→ 修复后重新提审。
- 回滚预案每年演练一次；回滚不回滚存档（存档向下兼容由迁移链保证，06_DataBalance.md 第 5 节）。
- 配置层回滚更快：CDN 配置指回上一版本号（第 3 节），秒级生效，优先于整包回退。

## 3. 远程配置与紧急开关

| 开关 | 用途 | 生效 |
|---|---|---|
| ad_placement_on/off | 紧急关停某广告点位（如审核期） | 下次版本握手 |
| balance_hotfix | 数值紧急下调（某关通关率暴跌） | 同上，走 Validator 校验 |
| stage_unlock | 关卡阶段逐阶段放量（500 关不一次全开） | 同上 |
| maintenance_notice | 公告与维护提示 | 同上 |

全部开关只影响配置层（03_Packaging.md 第 3 节），不改代码；改动记录进变更日志（09_Workflow.md 第 1 节第 12 步）。

### 3.1 版本更新策略（TBD-17，最小方案）

| 场景 | 行为 |
|---|---|
| 有新版本 | 启动时用平台 `UpdateManager` 检查；`onUpdateReady` 弹一次 ConfirmPopup「新版本已就绪，重启后生效」，**不阻断**当前游玩 |
| 低于 `minVersion`（配置下发） | 主界面顶部常驻提示条「有新版本，建议更新」，游戏可正常玩 |
| 低于 `hardMinVersion`（仅严重漏洞/合规问题启用） | 阻断进入关卡，只允许看公告与更新指引；开关受 `maintenance_notice` 通道控制 |
| 更新失败 | 静默重试一次，失败保留当前版本继续玩，记 `error_caught` |

版本比较用三段 semver；`minVersion` / `hardMinVersion` 进远程配置（03_Packaging.md §3），不发版即可调。禁止在没有 `hardMinVersion` 理由的情况下阻断玩家进入游戏。

## 4. 监控与告警

| 信号 | 采集 | 告警阈值 |
|---|---|---|
| JS 错误 | error-handler → error_caught 埋点 + 微信运维中心 | 错误率 > 1% 会话 |
| 启动/进关耗时 | perf_checkpoint | 超 05_Performance.md 预算 2 倍的会话 > 5% |
| 关卡卡点 | level_fail / boss_phase | 某关通关率环比跌 > 15 个百分点 |
| 广告异常 | ad_watched.completed 率 | completed 率 < 50% |
| 热更失败 | 配置校验失败计数 | 单日 > 100 次 |

告警走云开发定时任务 + 订阅消息/邮件通知负责人；阈值调整记变更日志。

### 4.1 云开发集合与清理（TBD-19 设计定稿）

| 项 | 规则 |
|---|---|
| 榜单集合 | `global_rank`：`_id = openid`，`clearedCount` / `level` / `nickname` / `updatedAt`；索引 `(clearedCount desc, updatedAt asc)` |
| 云存档集合 | `player_saves`：`_id = openid`，`save` / `updatedAt` / `lastSyncedAt` / `deviceId` / `checksum` / `schemaVersion`；`save_history`：每账号最近 5 版，30 天清理 |
| 云函数 | `syncPull` / `syncPush` / `syncStatus`：身份只取 `getWXContext().OPENID`，客户端不直连数据库；`syncPush` 用 `updatedAt` 条件写防并发丢写 |
| 云同步告警 | 同步失败率 >5%（15 分钟窗口）、冲突率 >2% 会话、单档 >200KB，任一超限写入监控并通知 |
| 榜单写入 | 仅云函数 `rankUpdate` 写，校验 `clearedCount` 单调不减且 ≤500；客户端只读查询 |
| 榜单读取 | 全服前 50 名 + 本人名次（`count(clearedCount > 本人)+1`），V1 不翻页 |
| 定时任务 | 每日 00:05 聚合 T-1 的 06_Analytics 指标；全服榜无按日清理任务 |
| 告警 | 写入失败率 >5%（15 分钟窗口）、日读取量 >免费额度 70%、单日新增 > 日均 3 倍 |
| 降级 | 云开发不可用时榜单显示"暂时无法加载"、同步提示"稍后重试"并后台补推；**本地存档照常读写，主线玩法不中断** |

免费额度按当期官方口径核对，项目上线前实测一次写入/读取量并记入本节。

## 5. 存档完整性（防篡改与损坏）

1. 写档时对 payload 计算校验和（HMAC，密钥混淆存放），存档体 + 校验和一起写。
2. 读档校验失败 → 按 10_CodingStandards.md 回退策略：先试上一份备份档 → 再试兜底新档；**永不覆盖唯一有效档**。
3. 校验和防手改（普通玩家级），不做加密对抗专业破解——单机无支付闭环，风险可接受；上内购后升级为服务端校验钻石/付费记录。
4. 存档写失败（磁盘满/权限）→ 内存保留 + 下次启动重写，UI 提示（CopyDeck save_written 事件）。

## 6. 用户反馈闭环

- 设置页"问题反馈"→ 拉起客服会话（微信客服），附自动携带的版本/关卡/种子摘要（脱敏）。
- 高频反馈项回流到 06_Levels.md 难度复审与 CopyDeck 文案修订。
