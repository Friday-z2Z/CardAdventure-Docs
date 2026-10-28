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

标准错误码：`INVALID_TARGET`、`NOT_ENOUGH_FOOD`、`NOT_ENOUGH_GOLD`、`NOT_ENOUGH_STARDUST`、`ITEM_NOT_FOUND`、`ITEM_COOLDOWN`、`ITEM_TARGET_INVALID`、`CARD_NOT_ACTIONABLE`、`EXIT_CONDITION_UNMET`、`LEVEL_ALREADY_COMPLETED`、`SAVE_DATA_INVALID`。

UI 按错误码展示统一提示；不能出现点击后没有任何反馈的情况。

## 4. 存档规范

存档至少包含：存档版本、当前解锁关卡、已完成关卡、玩家永久成长数据、永久解锁内容、当前挑战状态（若支持断点续玩）、设置选项。

断点续玩还需保存：当前 HP/Food/Gold、装备与道具、左右卡牌堆、状态效果、当前回合、关卡随机种子、关卡进度标记。

```ts
interface SaveData {
  version: number;            // 存档结构版本，迁移链依据
  updatedAt: number;
  progress: ProgressData;     // 解锁关卡、已完成关卡、永久成长、永久解锁、断点挑战状态、引导完成标记（tutorialDoneSteps，15_Tutorial.md）
  settings: SettingsData;     // 音量、静音、语言等用户设置
}
```

规则：

- 读取旧存档必须做版本检查与迁移（迁移链见 06_DataBalance.md 第 5 节），禁止删档。
- 存档损坏时提供安全回退，不能覆盖唯一有效存档。
- 存档读写一律走 `IStorageService`（00_Architecture.md 第 5 节），不直接调 `wx.*`。
- 派生属性不入档，读取时重算（03_Cards.md 装备规则）。
