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
| 玩法类 | `INVALID_TARGET`、`NOT_ENOUGH_FOOD`、`NOT_ENOUGH_GOLD`、`NOT_ENOUGH_STARDUST`、`ITEM_NOT_FOUND`、`ITEM_COOLDOWN`、`ITEM_TARGET_INVALID`、`CARD_NOT_ACTIONABLE`、`EXIT_CONDITION_UNMET`、`LEVEL_ALREADY_COMPLETED`、`SAVE_DATA_INVALID` |
| 平台/网络类 | `NETWORK_UNAVAILABLE`（无网络）、`CONFIG_UPDATE_FAILED`（配置热更失败，已回退兜底，03_Packaging.md §3）、`CLOUD_SYNC_FAILED`（云开发/日榜提交失败）、`AD_NOT_READY`（广告未填充或拉取失败）、`STORAGE_WRITE_FAILED`（存档写失败，转本地暂存重试） |

登记制度（与事件、文案同等的先登记再编码）：

1. **新增错误码必须先登记到上表**，并在 02_CopyDeck.md 第 4 节取得对应文案 key；无文案的错误码不允许返回给 UI。
2. 平台类错误码的展示策略允许"静默 + 埋点"（如登录失败后台重试），但必须在本表备注展示策略；完全静默的情形不设错误码（如字体加载失败回退 sans-serif）。
3. 代码审查检查项：返回了未登记错误码，或错误码无文案映射。

UI 按错误码展示统一提示；不能出现点击后没有任何反馈的情况。

## 4. 存档规范

存档至少包含：存档版本、当前解锁关卡、已完成关卡、玩家永久成长数据、永久解锁内容、当前挑战状态（若支持断点续玩）、设置选项、钱包金币（walletGold，跨局货币，11_Resources.md §3 金币双层制）、签到数据（signData，阶段二，01_GameDesign/17_SignIn.md）。

断点续玩还需保存：当前 HP/Food/Gold、装备与道具、全部卡牌堆（2～20，随关卡布局；matrix5 含占格坐标）、状态效果、当前回合、关卡随机种子、关卡进度标记。

```ts
interface SaveData {
  version: number;            // 存档结构版本，迁移链依据
  updatedAt: number;
  progress: ProgressData;     // 解锁关卡、已完成关卡、永久成长、永久解锁、断点挑战状态、引导完成标记（tutorialDoneSteps，15_Tutorial.md）、钱包金币（walletGold，跨局）
  settings: SettingsData;     // 音量、静音、语言、震动开关等用户设置（震动经 IPlatformService，00_Architecture.md 第 5 节）
}
```

规则：

- 读取旧存档必须做版本检查与迁移（迁移链见 06_DataBalance.md 第 5 节），禁止删档。
- 存档损坏时提供安全回退，不能覆盖唯一有效存档。
- 存档读写一律走 `IStorageService`（00_Architecture.md 第 5 节），不直接调 `wx.*`。
- 派生属性不入档，读取时重算（03_Cards.md 装备规则）。

### 4.1 存储 key 表（新增 key 先登记）

| key | 内容 |
|---|---|
| `save_main` | 主档（SaveData 全量） |
| `save_backup_a` / `save_backup_b` | 备份档 ×2，写主档前轮换转存（A→B→A），防写坏唯一档 |
| `cache_cfg_version` | 配置热更本地版本号（清单与 JSON 缓存由引擎 CDN 缓存管理，03_Packaging.md §3） |

写入策略：

1. **先备份后主写**：每次写档序列为 转存主档→backup 轮换位 → 写主档；两步失败均发 `save_written {ok:false}`，按 STORAGE_WRITE_FAILED 处理（本地暂存 + 重试，02_StateMachine.md LevelResult 行）。
2. **写入时机**：关卡结算、进关/退出关卡、设置变更、断点续玩快照；同秒内多次变更节流合并（10s 窗口），退出前强制落盘。
3. key 命名一律 `snake_case`、`save_`/`cache_` 前缀区分用途；删除或改名 key 必须同步迁移逻辑。

迁移规范：

1. 迁移函数以注册表维护：`MIGRATIONS: Record<number, (data) => data>`，键为源版本号，逐级链式执行到当前版本（06_DataBalance.md 第 5 节）。
2. 每个迁移函数必须有单测：构造旧版本样例档 → 执行迁移 → 断言新结构与不变式；样例档随版本追加存入 `tests/fixtures/saves/`。
3. 迁移过程禁止抛异常吞档：单级失败回退到备份档读取流程。
