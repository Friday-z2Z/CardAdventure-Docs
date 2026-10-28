# 埋点事件字典（Analytics）

> 补全 06_Levels.md 第 6 节"埋点规范待补"。事件由 AnalyticsSystem 监听 EventBus（04_EventCatalog.md）自动生成，业务代码零埋点成本；UI/交互类事件手动打点。全部经 IAnalyticsService 上报。

## 1. 公共参数（每条事件必带）

| 字段 | 说明 |
|---|---|
| ts | 客户端时间戳 |
| v | 工程版本（06_DataBalance.md 版本规范） |
| lv | 当前关卡 id（对局外事件为 0） |
| seed | 关卡种子 |
| turn | 当前行动次数 |
| hp / food / gold | 事件瞬间资源快照 |

## 2. 事件字典（V1）

| 事件 | 触发（来源） | 专有字段 | 用途 |
|---|---|---|---|
| app_launch | Boot 完成 | cold | 启动量、冷/热启动比 |
| level_start | LevelInit 完成 | stage | 关卡漏斗起点 |
| level_complete | level_completed | turnsUsed, itemsUsed, hpLeft, foodLeft, goldEarned | 通关率、平均剩余资源 |
| level_fail | level_failed | cause(enemy/food/status/quit), enemyId | 失败原因分布、放弃率 |
| card_played | card_resolved | cardId, side | 卡牌选择分布 |
| item_used | item_used | itemId, target | 道具使用频率 |
| combo_reached | combo_updated | tier | 连击达成分布 |
| boss_phase | boss_phase_changed | bossId, phase | 首领阶段卡点 |
| shop_buy / shop_refresh | 16_Shop 支付/刷新 | itemId, price | 经济回收率 |
| ad_watched | 01_Monetization 点位 | placement, completed | 广告转化率 |
| share_sent / share_opened | 05_Share | scene | 裂变漏斗 |
| tutorial_step | 15_Tutorial 步骤推进 | stepId, skipped | 引导流失点 |
| error_caught | error-handler 捕获 | code, module | 线上质量监控（07_Ops_Release.md） |
| perf_checkpoint | 性能采样 | key, ms | 性能预算监控（05_Performance.md） |

用途列对应 06_Levels.md 第 6 节八项难度指标。

## 3. 上报规则

1. **隐私前置**：用户未同意隐私协议前只入本地队列不上报（00_Compliance.md 第 2 节）；同意后补报（带原 ts）。
2. 批量上报：本地队列满 20 条或切后台时 flush；失败静默丢弃（统计允许有损）。
3. 不上报个人信息：无昵称、无头像、无 openid 明文（服务端聚合时由云函数侧匿名化）。
4. 新增事件必须先登记本表（与 04_EventCatalog.md 维护规则同款），AI 生成关卡/活动时同步补埋点。

## 4. 消费侧

- 每日自动出 06_Levels.md 第 6 节八项难度指标报表（云开发定时任务聚合）。
- level_fail.cause 与 boss_phase 是平衡复审的触发器（09_BalanceBaseline.md 第 7 节第 3 条）。
