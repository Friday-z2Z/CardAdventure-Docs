# 音频规范

> 补全章节。此前音频只有资源目录里的文件夹名（03_UI/00_UiSpec.md 第 7 节）。本文定义 BGM 场景映射、SFX 清单与音量体系。

## 1. BGM 场景映射

| 场景 | 曲目 | 说明 |
|---|---|---|
| MainMenu / LevelSelect | bgm_menu | 轻快奇幻，循环 |
| 普通关卡 | bgm_explore | 中性探索氛围，循环 |
| 首领战 | bgm_boss | 紧张主题，入场切换，可分段对应 BossPhase（14_EliteBoss.md） |
| 通关结算 | bgm_victory | 短乐句，不循环 |
| 失败结算 | bgm_defeat | 短乐句，不循环 |

规则：BGM 全循环复用（音频内存预算 ≤8MB，05_Performance.md）；场景切换淡入淡出 ≤0.5s，不打断 ActionQueue。

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

规则：SFX 由 SoundSystem 监听事件播放（04_EventCatalog.md 解耦示例），业务代码不直接调用播放；同一结算批次内同名事件触发做去重合并（≤2 次）。

## 3. 音量体系与设置

- 三层音量：BGM / SFX / 全局，默认 0.8 / 0.9 / 1.0，范围 0～1。
- 设置面板三个滑杆存 `SettingsData`（10_CodingStandards.md 第 4 节），经 IAudioService 生效。
- 切后台自动暂停 BGM（微信生命周期），回前台恢复；静音状态跨关保留。

## 4. 资源要求

- 命名遵守 00_UiSpec.md 第 7 节（`bgm_*.mp3`、`sfx_*.wav`，AssetValidator 检查）。
- 加载失败的音效静默跳过，不阻塞流程（05_Performance.md 规则 3）。
- 立项时确认音频素材商用授权，与字体授权一并归档（12_Delivery_Risk.md 第 1 节 D）。
