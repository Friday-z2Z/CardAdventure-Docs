# 代码规范与存档规范

> 来源：总规格书 9.1（技术路线已在 00_GameOverview.md 冻结为方案 B：Cocos Creator + TypeScript）。本文是编码阶段的硬性规范。

## 1. 命名规范

- 类名 PascalCase；函数/变量 camelCase；常量 UPPER_SNAKE_CASE；类型与接口 PascalCase；配置 ID 小写英文+下划线。

```ts
class BattleSystem {}
function calculateDamage(): number { return 0; }
const MAX_LEVEL_COUNT = 500;
interface PlayerState {}
```

禁止 `doThing()`、`temp1`、`data2` 之类无业务含义命名（局部小作用域临时变量除外）。

## 2. 类型与模块规则（十条禁令）

1. 开启 TypeScript 严格类型检查。
2. 避免滥用 `any`。
3. 不把所有系统写进一个巨大控制器。
4. 不允许卡牌数据与业务代码大量重复。
5. 不通过修改全局变量实现跨模块通信。
6. 不在 UI 点击回调中直接结算战斗。
7. 不把关卡数值散落在多个文件（统一走 Balance 表，见 06_DataBalance.md）。
8. 不忽略异常和错误返回。
9. 不在业务模块散布无记录随机数（统一随机模块，种子驱动）。
10. 不为赶进度复制整段逻辑只改数字。

## 3. 错误处理规范

所有重要操作返回明确结果：

```ts
type ActionResult =
  | { ok: true }
  | { ok: false; code: string; message?: string };
```

标准错误码：

| 类别 | 错误码 |
|---|---|
| 玩法类 | `INVALID_TARGET`、`NOT_ENOUGH_FOOD`、`NOT_ENOUGH_GOLD`、`NOT_ENOUGH_DIAMOND`、`ITEM_NOT_FOUND`、`ITEM_COOLDOWN`、`ITEM_TARGET_INVALID`、`CARD_NOT_ACTIONABLE`、`INVALID_CARRY_ITEM`（携带白名单外/进度类道具）、`SLOT_DUPLICATED`（组合内重复道具）、`BAG_CAPACITY_EXCEEDED`（超出携带槽位）、`ITEM_STACK_FULL`（仓库堆叠已满，购买被阻止）、`EXIT_CONDITION_UNMET`、`LEVEL_ALREADY_COMPLETED`、`SAVE_DATA_INVALID` |
| 平台/网络类 | `NETWORK_UNAVAILABLE`（无网络）、`CONFIG_UPDATE_FAILED`（配置热更失败，已回退兜底，03_Packaging.md §3）、`CLOUD_SYNC_FAILED`（云同步/全服榜提交失败）、`CLOUD_SAVE_INVALID`（云端存档校验失败，不覆盖本地）、`AD_NOT_READY`（广告未填充或拉取失败）、`STORAGE_WRITE_FAILED`（存档写失败，转本地暂存重试） |

登记制度（与事件、文案同等的先登记再编码）：

1. **新增错误码必须先登记到上表**，并在 02_CopyDeck.md 第 4 节取得对应文案 key；无文案的错误码不允许返回给 UI。
2. 平台类错误码的展示策略允许"静默 + 埋点"（如登录失败后台重试），但必须在本表备注展示策略；完全静默的情形不设错误码（如字体加载失败回退 sans-serif）。
3. 代码审查检查项：返回了未登记错误码，或错误码无文案映射。

UI 按错误码展示统一提示；不能出现点击后没有任何反馈的情况。

## 4. 存档规范

存档至少包含：存档版本、当前解锁关卡、已完成关卡、玩家永久成长数据、永久解锁内容、当前挑战状态（若支持断点续玩）、设置选项、钱包金币（walletGold，跨局货币，11_Resources.md §3 金币双层制）、签到数据（signData，阶段二，01_GameDesign/17_SignIn.md）、矿点每日计数（mineDaily：日期 + 当日已刷次数，04_MetaProgression.md §2）、背包组合（MetaProgression.combos，04_MetaProgression.md §8）。

断点续玩还需保存：当前 HP/Food/Gold、装备与道具、全部卡牌堆（2～20，随关卡布局；matrix5 含占格坐标）、状态效果、当前回合、关卡随机种子、关卡进度标记。

```ts
interface SaveData {
  version: number;            // 存档结构版本，迁移链依据（当前 1）
  updatedAt: number;          // 本地最后修改时间（毫秒）
  lastSyncedAt: number;       // 最后一次成功云端同步时的 updatedAt；0 = 从未同步
  progress: ProgressData;
  settings: SettingsData;
}

interface ProgressData {
  unlockedLevel: number;      // 已解锁的最大关卡 id（1 起）
  completedLevels: number[];  // 已通关关卡 id
  deepestStage: number;       // 最深通关阶段 1～5（进度门判定，04_MetaProgression.md §8）
  walletGold: number;         // 跨局钱包金币（11_Resources.md §3）
  meta: MetaProgressData;     // diamond / collection / unlocked / combos（04_MetaProgression.md §4）
  run: RunSnapshot | null;    // 断点续玩快照，null = 无断点
  claimedAchievements: string[]; // 成就一次性奖励（有界，04_MetaProgression.md §7）；首通幂等由 completedLevels 判定
  tutorialDoneSteps: string[];// 引导完成标记（15_Tutorial.md §4）
  firstSeenHints: string[];   // 首见一次性提示 id（15_Tutorial.md §6）
  signData: { claimedDay: number; lastSignDate: string };  // 阶段二（17_SignIn.md §4）
  mineDaily: { date: string; used: number };               // 矿点每日计数（04_MetaProgression.md §2）
  shopDaily: { date: string; freeRefreshUsed: boolean };   // 商店每日免费刷新（16_Shop.md §2）
  shareDaily: { date: string; rewarded: boolean };         // 分享奖励每日一次（05_Share.md §3）
  equippedTrinket?: string;                                // 跨关保留的饰品 ID（03_Cards.md D 节）
  failStreak: { levelId: number; count: number };           // 连续失败计数，用于"换个开局"提示（01_CoreLoop.md §5）
}

interface RunSnapshot {       // = GameState 完整快照（01_GameState.md §4），断点续玩与异常回滚共用
  levelId: number;
  levelSeed: number;
  turn: number;
  combo: number;
  player: PlayerState;
  stacks: StackRuntime[];
  enemies: EnemyRuntime[];
  currentEnemyId?: string;
  equipped: { weapon?: string; armor?: string; trinket?: string };
  statusEffects: StatusEffectInstance[];
  runFlags: Record<string, boolean | number>;
  killedEnemyIds: string[];
  rewardedKeys: string[];     // 本局已发奖励幂等集合，必须随快照落盘（12_Rewards.md §3 第 4 条）
  actionSeq: number;          // 最近 actionId，恢复后继续自增
  savedAt: number;
}

interface SettingsData {
  bgmVolume: number;          // 0～1，默认 0.8（01_AudioSpec.md §3）
  sfxVolume: number;          // 0～1，默认 0.9
  masterVolume: number;       // 0～1，默认 1.0
  muted: boolean;
  vibration: boolean;         // 经 IPlatformService 生效
  quality: "auto" | "high" | "medium" | "low";  // 画质档位，默认 auto（05_Performance.md §4）
  language: "zh-CN";          // V1 单语，字段预留（12_Delivery_Risk.md §3.1）
  cloudSyncEnabled: boolean;  // 云端同步开关，默认 true（隐私拒绝时置 false）
  deviceId: string;           // 本机生成的 uuid，首次启动写入并持久化；仅用于冲突提示
}
```

规则：

- 读取旧存档必须做版本检查与迁移（迁移链见 06_DataBalance.md 第 5 节），禁止删档。
- 存档损坏时提供安全回退，不能覆盖唯一有效存档。
- 存档读写一律走 `IStorageService`（00_Architecture.md 第 5 节），不直接调 `wx.*`。
- 派生属性不入档，读取时重算（03_Cards.md 装备规则）。
- `unlockedLevel` 是进度唯一真源；`deepestStage` 每次通关时由 `unlockedLevel` 推导写入，禁止独立更新（防两字段漂移）。
- `claimedAchievements` 只存成就 id（有界，8 条 + 活动）；首通幂等由 `completedLevels` 判定，矿点不记账——避免幂等集合无限增长。

### 4.1 存储 key 表（新增 key 先登记）

| key | 内容 |
|---|---|
| `save_main` | 主档（SaveData 全量） |
| `save_backup_a` / `save_backup_b` | 备份档 ×2，写主档前轮换转存（A→B→A），防写坏唯一档 |
| `cache_cfg_version` | 配置热更本地版本号（清单与 JSON 缓存由引擎 CDN 缓存管理，03_Packaging.md §3） |

写入策略：

1. **先备份后主写**：每次写档序列为 转存主档→backup 轮换位 → 写主档；两步失败均发 `save_written {ok:false}`，按 STORAGE_WRITE_FAILED 处理（本地暂存 + 重试，02_StateMachine.md LevelResult 行）。
2. **写入时机**：关卡结算、进关/退出关卡、设置变更、断点续玩快照；同秒内多次变更节流合并（10s 窗口），退出前强制落盘。窗口内触发 `onHide`/进程退出时立即强制 flush 并重置窗口，不允许把未落盘变更留在内存。
3. key 命名一律 `snake_case`、`save_`/`cache_` 前缀区分用途；删除或改名 key 必须同步迁移逻辑。
4. **备份读取顺序**：主档校验失败 → 取 `save_backup_a` / `save_backup_b` 中 `updatedAt` 较新且校验通过的一份 → 两份都失败才空档启动 + `SAVE_DATA_INVALID`；任何情况下不覆盖仍可读的备份。
5. **体积上限**：单档软上限 **200KB**（阶段五 400 张卡约 24KB，×3 份备份仍充裕）；超限时优先裁剪非必要字段（`killedEnemyIds`、`firstSeenHints` 去重后压缩、历史统计），不得裁 `run` 与 `meta`。写档后记录体积，超过 150KB 打点告警。

### 4.2 云端同步（腾讯微信云开发，2026-11-18 新增）

**定位**：本地存档仍是玩法唯一真源，云端是**跨设备镜像**；离线可完整游玩，云端失败不阻断。同一微信账号通过云函数上下文 `OPENID` 识别，无需自建账号。

**数据契约**：

| 项 | 规则 |
|---|---|
| 集合 | `player_saves`：`_id = openid`，字段 `save`(SaveData) / `updatedAt` / `lastSyncedAt` / `deviceId` / `checksum` / `schemaVersion`；`save_history` 保留最近 5 版，30 天清理 |
| 写入方 | **只有云函数**可写；客户端不直接访问数据库，身份由云函数从 `getWXContext().OPENID` 取，不信任客户端传 uid |
| 校验 | `checksum = FNV1a32(JSON.stringify(save))`（与 `core/random` 同一算法、独立 salt）；不一致回 `CLOUD_SAVE_INVALID`，不覆盖本地 |
| 条件写 | `push(save, expectedUpdatedAt)` 带条件更新：云端 `updatedAt ≠ expected` 即拒绝，防并发丢写 |
| 触发时机 | 启动（隐私同意后）、关卡结算、设置变更、断点写入后（30s 节流）；设置页"立即同步"；`onHide` 尽力推送一次 |
| 失败处理 | 最多重试 3 次（指数退避），仍失败保留本地并在 `lastSyncedAt` 不变；下次启动按 `updatedAt > lastSyncedAt` 自动补推 |
| 冲突判定 | 本地与云端都在 `lastSyncedAt` 之后变化 → 不自动合并，弹 `POPUP_SYNC_CONFLICT` 让玩家选"使用云端 / 保留本地覆盖云端" |
| 版本迁移 | 云端同样走 `MIGRATIONS` 链；云端版本高于客户端时提示更新，不强行降级读取 |

**开关**：`SettingsData.cloudSyncEnabled` 默认 true；隐私弹窗拒绝后置 false，仅本地存档。`deviceId` 只用于冲突提示与日志，不作为身份。

迁移规范：

1. 迁移函数以注册表维护：`MIGRATIONS: Record<number, (data) => data>`，键为源版本号，逐级链式执行到当前版本（06_DataBalance.md 第 5 节）。
2. 每个迁移函数必须有单测：构造旧版本样例档 → 执行迁移 → 断言新结构与不变式；样例档随版本追加存入 `tests/fixtures/saves/`。
3. 迁移过程禁止抛异常吞档：单级失败回退到备份档读取流程。
