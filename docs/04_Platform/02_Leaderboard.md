# 排行榜与开放数据域

> 补全 08_Roadmap 决策表"排行榜走开放数据域"项。项目代码已有日榜/好友榜实践，本文将其固化为规范，避免主子域的坑被重新踩一遍。

## 1. 榜单体系

| 榜 | 数据来源 | 实现层 |
|---|---|---|
| 好友榜（关卡进度） | 开放数据域 wx.getFriendCloudStorage | 子域（openDataContext）渲染 |
| 日榜（全服每日最高关） | 云开发（微信云）数据库，无自建后端 | 主域直查 + 子域渲染 |

- 上报数据集：wx.setUserCloudStorage 写 KVDataList：key "level" 存当前最高关，key "daily" 存 yyyymmdd|最高关——开放数据域只能读这些 KV，字段设计一次到位。
- 好友榜按进度总值排序；日榜按当日重置。

## 2. 主域与子域架构（硬约束）

```text
主域 ILeaderboardService
  ↓ postMessage {type:"open"|"close"|"font"|"refresh", ...}   （主子域唯一通道）
子域 openDataContext（独立 Canvas，原生 2D）
  ↓ 子域自己的 canvas.requestAnimationFrame 保活渲染
sharedCanvas
  ↓ 主域每帧把 sharedCanvas 刷为 Sprite 的动态纹理（Cocos：SpriteFrame + texture.update）
```

> Cocos 集成要点：子域仍是原生 canvas（openDataContext 不用 Creator UI 渲染）；主域侧建一个常驻 Sprite，每帧从 sharedCanvas 上传纹理，锚点与安全区对齐。构建面板勾选"开放数据域"并配置子域代码目录。

已知约束与既有对策（踩过的坑，编码前必读）：

1. **字体必须主域下发**：子域拿不到主域注册的字体族。主域 wx.loadFont 注册云端字体后 postMessage {type:"font", family} 同步；子域缓存族名，收到 'sans-serif' 不覆盖，全部文字按 "字号px 字体族" 拼接渲染，取不到族名自动回退系统字体，绝不空白。
2. **子域不能读主域状态**：榜单所需数据（名次、本人标记、mock 数据）全部经 postMessage 传入。
3. **透明底**：子域画布透明，露出主域面板底色；文字色用 ColorInk 系，样式与主域日榜完全一致。
4. **名次配色**：前三金（ColorPrimary）/银/铜，本人行金色高亮，行高固定（历史实现 rowH=34，头像圆 r13/16）。
5. **关闭即停帧**：close 后子域停止 rAF，主域停止 drawImage，不留常驻开销。

## 3. 流程与时序

1. 主菜单点击"排行榜" → ILeaderboardService.open() → postMessage open。
2. 字体就绪即同步一次（游戏启动字体加载完成后）；若字体晚于开榜，再次 postMessage font 覆盖。
3. 拉取好友数据 → 子域渲染 → 主域每帧贴图；用户滚动经 postMessage 传 scroll。
4. 关闭 → postMessage close → 主域移除 sharedCanvas 贴图。

## 4. 云开发（日榜）

- 集合 daily_score：openid、date、level、updatedAt；openid 由云函数侧取（客户端不伪造）。
- 提交时机：level_completed 事件（04_EventCatalog.md）后异步提交，失败静默重试一次，不阻塞结算。
- 免费额度内预估够用；超限再评估按量付费。

## 5. 合规联动

- 进入排行榜前触发隐私授权（00_Compliance.md 第 2 节）；拒绝则隐藏入口。
- 榜单仅展示微信昵称与头像（平台提供），不新增收集项。

## 6. 验收

- 榜单在无字体/无网络/无好友数据三种降级下均正常显示（占位文案见 CopyDeck 第 5 节）。
- 主域 60fps 下贴图无掉帧；关闭后无残留绘制。
