# 音频规范

> 补全章节。此前音频只有资源目录里的文件夹名（03_UI/00_UiSpec.md 第 7 节）。本文定义 BGM 场景映射、SFX 清单与音量体系。

## 1. BGM 场景映射

| 场景 | 曲目 | 说明 |
|---|---|---|
| MainMenu / LevelSelect | bgm_menu | 轻快奇幻，循环 |
| 普通关卡（含**准备档口**） | bgm_explore | 中性探索氛围，循环；准备档口沿用本曲不切换 |
| 首领战 | bgm_boss | 紧张主题，入场切换；多段规则见第 1.1 节 |
| 通关结算 | bgm_victory | 短乐句，不循环 |
| 失败结算 | bgm_defeat | 短乐句，不循环 |

规则：BGM 全循环复用（音频内存预算 ≤8MB，05_Performance.md）；场景切换淡入淡出 ≤0.5s，不打断 ActionQueue。

### 1.1 首领多段 BGM 规则

1. 采用**单曲内分段**而非换曲：`bgm_boss` 内按 BossPhase 划分段落（`bgm_boss` 主段 + 每阶段变奏段），阶段切换只做段内衔接（淡入淡出 ≤0.5s），不触发加载。
2. 段落由 `boss_phase_changed` 事件驱动（SoundSystem 监听），段落映射关系登记在 Balance 表（`bossBgmSegments`），禁止硬编码。
3. 段落必须支持任意起点循环（无缝 loop 点在音频加工时定桩）；回退段（玩家被击败前不换 defeat 曲，结算才切）。

### 2.1 SFX 并发与打断策略

1. **同路数上限**：SFX 同时最多 6 路（微信小音频实例上限内取保守值），超出时按优先级淘汰最老一路。
2. **优先级**：player_died / level_completed / level_failed > enemy_died > player_damaged > 其余；低优先级被淘汰不发补偿。
3. **同批次去重**（沿用 §2 规则）：同一结算批次同名事件合并 ≤2 次；不同名 SFX 同帧触发按 priority 顺序起播，起播间隔最小 30ms（防瞬响爆音）。
4. **不打断**：SFX 互不打断、也不打断 BGM；仅 `stopAll`（切场景/进 Resolving 长演出）可终止，由 IAudioService 统一提供。

## 2. SFX 清单（V1 基线）

| 事件（04_EventCatalog.md） | 音效文件 |
|---|---|
| card_selected | sfx_card_select.wav |
| enemy_damaged | sfx_enemy_hit.wav |
| enemy_died | sfx_enemy_die.wav |
| player_damaged | sfx_player_hurt.wav |
| hp_changed（恢复） | sfx_heal.wav |
| gold_changed / food_changed | sfx_coin.wav / sfx_food.wav |
| shield_changed | sfx_shield.wav |
| item_used | sfx_item_use.wav |
| combo_updated（tier 达成） | sfx_combo.wav |
| mechanism_activated | sfx_mechanism.wav |
| level_completed / level_failed | sfx_victory.wav / sfx_defeat.wav |
| 按钮通用 | sfx_button.wav |
| wallet_gold_changed（转存/购买/签到发钱） | sfx_coin.wav（复用） |
| sign_claim（签到领取） | sfx_reward.wav |
| 装备入槽（装备卡翻开） | sfx_equip.wav |
| 暗牌翻开（dark 堆执行） | sfx_card_flip.wav（与亮牌选择音区分） |
| 卡牌堆掉落入格（战斗开始） | sfx_stack_drop.wav |

规则：SFX 由 SoundSystem 监听事件播放（04_EventCatalog.md 解耦示例），业务代码不直接调用播放；同一结算批次内同名事件触发做去重合并（≤2 次）。

## 3. 音量体系与设置

- 三层音量：BGM / SFX / 全局，默认 0.8 / 0.9 / 1.0，范围 0～1。
- 设置面板三个滑杆存 `SettingsData`（10_CodingStandards.md 第 4 节），经 IAudioService 生效。
- 切后台自动暂停 BGM（微信生命周期），回前台恢复；静音状态跨关保留。

## 4. 资源要求

- 命名遵守 00_UiSpec.md 第 7 节（`bgm_*.mp3`、`sfx_*.wav`，AssetValidator 检查）。
- 加载失败的音效静默跳过，不阻塞流程（05_Performance.md 规则 3）。
- 立项时确认音频素材商用授权，与字体授权一并归档（12_Delivery_Risk.md 第 1 节 D）。
