# 分包与远程资源细则

> 具体化 05_Performance.md 的资源策略与"500 关进不了主包"问题。数字上限以微信当期文档为准，构建脚本按当期限额自动校验。

## 1. 包体结构（Cocos Creator 构建面板配置）

| 包 | 内容 | 预算 |
|---|---|---|
| 主包 | 引擎运行时、全部代码（assets/scripts）、场景、主菜单/UI 骨架图、字体、核心音效、阶段一前 20 关资源（resources/ 内） | ≤ 4MB（微信硬限制，构建面板查看体积统计） |
| Asset Bundle（stage2～stage5） | 每关卡阶段（06_Levels.md 五阶段）一个 bundle：该阶段关卡配置 JSON + 专属图片；构建时配置为**微信分包** | 每包按当期单包限额 |
| Asset Bundle（远程） | 大体积非代码资源：全量卡面高清图、BGM、首领演出素材；构建为**远程 bundle** 走 CDN | 不受分包限制，运行时加载 |
| 开放数据子域 | openDataContext（构建面板单独配置，02_Leaderboard.md） | 单独限额 |

规则：

1. 分包按**关卡阶段**切，进关前检查目标阶段 bundle 是否已加载（assetManager.loadBundle），未加载则走 Loading（状态机 LevelInit 前置）。
2. 已下载 bundle 本地缓存；缓存超限时 LRU 清理最久未玩阶段（保留最近游玩的两个阶段）。
3. 阶段一（1～20 关）资源放 resources/ 进主包，保证新玩家首玩零分包等待。
4. game.json / 分包声明由 Creator 构建面板自动生成，不手工维护。

## 2. 远程资源管线

```text
构建期：AssetValidator 生成资源清单 manifest.json（路径 + md5 + size + 包属 + license 来源，00_Compliance.md 第 4 节）
运行期：IAssetService.load(key)
  ├─ resources/ 内 → resources.load 直接用
  ├─ bundle 内 → assetManager.loadBundle + load（bundle 随分包或远程）
  └─ 远程大图/音频 → assetManager.loadRemote(CDN) → 校验 md5 → 引擎缓存 → 用
失败 → 回退占位图/静音（05_Performance.md 规则 3）+ 上报（06_Analytics.md）
```

- CDN 域名必须在小程序后台配置 request/downloadFile 合法域名。
- 图片走 CDN 而非分包的条件：单文件 > 100KB，或该阶段内仅首领关使用。

## 3. 配置热更

- 关卡/卡牌/Balance JSON **不打包**，构建时上传 CDN，包内只带一份兜底版本（上次审核通过的）。
- 启动时版本握手：GET config/version → 与本地比对 → 增量拉取 → 校验 → 经数据流水线（06_DataBalance.md）热替换 Registry。
- 热更配置同样过全部 Validator；失败回退兜底版本并告警（07_Ops_Release.md 第 3 节）。
- 兜底：无网络/CDN 故障时用包内版本可完整游玩已下载内容。

## 4. 启动时序（对齐性能预算）

```text
Boot → 拉 config/version（并行）→ Loading 主包资源 → MainMenu 可交互
     → 后台静默预热：用户所在阶段的分包
     → 进关前：拉取该关缺失的 CDN 资源（预算 1.5s 内，05_Performance.md）
```

## 5. 验收

- 主包体积、单分包体积由构建脚本强制校验，超限构建失败（CI）。
- 断网冷启动可玩阶段一；清缓存后弱网（3G 模拟）进关耗时超过预算 1.5s 的 2 倍即报警。
- 热更配置回滚演练一次（07_Ops_Release.md 第 2 节）。
