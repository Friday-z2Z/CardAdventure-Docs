# 首批卡牌清单（MVP 卡牌说明）

> 新增内容。给出第一阶段可直接配置的卡牌内容清单，数值为原型基线（来源：总规格书 2.3、3.3、9.6），须实测调整。配套道具见 `04_Items.md`。

## 0. 平衡方案（已冻结：方案一）

原总规格书 9.6 示例（软泥怪 HP8/ATK3）与初始属性（玩家 Attack 1、Defense 0）推演不可打：打 8 血敌人需 8 回合，期间挨约 21 点伤害。经比较两个方案，**冻结采用方案一**：

- ✅ **方案一（采纳）**：玩家初始属性不变（Attack 1），早期敌人 HP 2～5、ATK 1～2，随关卡与装备逐步提高。
- ❌ 方案二（弃）：玩家初始 Attack 提至 3——会连锁破坏食物消耗节奏与装备成长空间，弃用。

完整数值基线见 `09_BalanceBaseline.md`。下表所有敌人卡均按方案一取值。

## 1. 敌人卡

| ID | 名称 | HP | ATK | DEF | 奖励 | 稀有度 | 说明文案 |
|---|---|---|---|---|---|---|---|
| enemy_rat_01 | 穴居鼠 | 2 | 1 | 0 | 金币1 | common | 窃取补给的小兽，虽然弱小却总挡在必经之路上 |
| enemy_slime_01 | 软泥怪 | 3 | 1 | 0 | 金币2 | common | 缓慢蠕动的黏液生物，击破后留下少量战利品 |
| enemy_bat_01 | 洞穴蝙蝠 | 2 | 2 | 0 | 金币2 | common | 动作迅捷，威胁不小，适合优先处理 |
| enemy_goblin_01 | 哥布林斥候 | 4 | 2 | 0 | 金币3 食物1 | uncommon | 携带补给的掠夺者，击败后可补充口粮 |
| enemy_skeleton_01 | 骸骨兵 | 5 | 2 | 1 | 金币4 | uncommon | 骨架坚硬，防御力使你的攻击减少 1 点 |

## 2. 资源卡

| ID | 名称 | 效果 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| res_gold_pouch | 鼓胀钱袋 | 金币 +3～5 | common | 旅人遗落的钱袋，拾取时发出悦耳的碰撞声 |
| res_food_cache | 补给包 | 食物 +2～3 | common | 干粮与清水，是继续探索的底气 |
| res_treasure | 尘封宝箱 | 金币 +5～8 | uncommon | 积灰的旧木箱，锁扣早已锈蚀 |

## 3. 恢复卡

| ID | 名称 | 效果 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| heal_herb | 疗伤草药 | 恢复 6 HP | common | 咀嚼苦涩的草叶，伤口渐渐止血 |
| heal_salve | 治疗药剂 | 恢复 12 HP | uncommon | 玻璃瓶中的琥珀色药液，气息温和 |
| cleanse_herb | 清净草 | 解除中毒 | uncommon | 清凉气息驱散体内毒素 |

## 4. 装备卡

| ID | 名称 | 槽位 | 效果 | 稀有度 | 说明文案 |
|---|---|---|---|---|---|
| eq_rusty_sword | 砍钝的短剑 | 武器 | 攻击 +1 | common | 刃口已钝，但握在手里仍然让人安心 |
| eq_leather_armor | 旧皮甲 | 护甲 | 防御 +1 | common | 磨损的皮甲，替你挡下不少伤害 |
| eq_wolf_fang | 狼牙吊坠 | 饰品 | 击败敌人后额外 +1 金币 | uncommon | 狼牙微微发烫，仿佛渴望着狩猎 |

## 5. 陷阱卡

| ID | 名称 | 效果 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| trap_spikes | 尖刺陷阱 | 受到 4 点伤害（可被护盾/防御减免） | common | 脚下的石板突然弹起一排尖刺 |
| trap_gas | 毒气陷阱 | 中毒 2 层 | common | 绿色雾气从裂缝中渗出 |

## 6. 事件卡

| ID | 名称 | 效果（选项配置） | 稀有度 | 说明文案 |
|---|---|---|---|---|
| evt_campfire | 熄灭的营地 | 二选一：恢复 4 HP / 获得 2 食物 | common | 余烬未冷，先歇歇脚还是带走干粮？ |
| evt_shrine | 古老祭坛 | 献祭 2 食物 → 恢复 8 HP | uncommon | 石像注视着你，等待一份供奉 |
| evt_cursed_chest | 诅咒宝箱 | 二选一：开启 → 金币 +8 且中毒 2 层 / 不动它 | common | 锁扣缠着发黑的布条，箱里的金币亮得刺眼 |
| evt_merchant | 流浪商人 | 用金币购买道具或食物（价格表配置；单次交易事件，走 EventChoice 弹窗——消耗**局内金币**，是局内唯一购买途径；货架式商店自阶段二起在主界面/通关结算页开放，16_Shop.md）。含本卡的关初始金币仍为 0，可达性由堆序保障：商人槽位前必有金源卡，LevelValidator 模拟核查（06_Levels.md §3.1）；打开即视为已触发，完成一次交易或直接关闭后移除事件卡（不可重复开启） | uncommon | 兜帽下的商人摊开了他的货物 |

### evt_merchant 货单（V1 定稿）

| 道具 | 基价（局内金币） | 可达阶段 | 备注 |
|---|---|---|---|
| `ration` | 3 | 全阶段 | 最低价，LevelValidator 金源门槛按此模拟 |
| `potion_small` | 4 | 全阶段 | 恢复 8 HP |
| `poison_cure` | 3 | 全阶段 | 解毒 |
| `shield_scroll` | 5 | 全阶段 | +8 护盾 |
| `bomb` | 6 | 全阶段 | 商店不售，商人与奖励是主要来源 |
| `potion_large` | 8 | 阶段二起 | 恢复 18 HP |

规则：

1. **每次 3 格**，从货池无放回抽 3 种；权重 common 70 / uncommon 30。阶段一可售 5 种（`potion_small` / `ration` / `poison_cure` / `shield_scroll` 为 common，`bomb` 计 uncommon），`potion_large` 阶段二起加入。
2. 价格 = 基价 × 阶段系数（1.0 / 1.2 / 1.4 / 1.6 / 1.8）**向下取整**；系数低于钱包商店，因为局内金币是一次性资源。
3. 只收**局内金币**；不足回 `NOT_ENOUGH_GOLD` 并留在弹窗，不扣款。
4. 交易一次即关闭并移除事件卡（不可重复开启，D-116）；未购买直接关闭也移除。
5. LevelValidator 模拟"到达商人时局内金币 ≥ 3"（最低价），不达标打回配置。

### 特殊机制卡最小验证（V1 只做 1 张）

| id | 名称 | 类型 | 稀有度 | 效果 | 引入阶段 |
|---|---|---|---|---|---|
| `spec_reverse_stack` | 倒流的沙漏 | special | rare | **反转本堆剩余卡牌顺序**（顶层↔底层），本卡移除；堆深不变 | 四 |

- 说明文案："沙子往上走。原本排在最后的，忽然到了眼前。"
- **不需要目标选择**：`transformStack` 省略 `targetStackId` 即作用本堆，因此不新增状态机状态、不扩展 `ItemTargeting`——这是选它做最小验证卡的原因。
- 交互：亮牌两段式 / 暗牌直接执行均照常；翻出即结算，不吃额外食物（正常计 1 点行动食物）。
- CardValidator：`transformStack` 作用于本堆时要求剩余 ≥2 张（1 张时无意义，配置阶段拦截）；**本卡**只允许 `op: "reverse"`（其余自堆操作保留给首领/其他系统，03_ActionQueue.md §3）。
- 实现验证点（B2）：ActionQueue 执行 `transformStack` → `stack_updated` 事件 → UI 重排顶部卡；用例见 11_Testing.md §5。

## 7. 机关卡与出口卡

| ID | 名称 | 效果 | 说明文案 |
|---|---|---|---|
| mech_lever | 生锈拉杆 | 激活 runFlag `door_opened` | 拉杆发出刺耳摩擦声，远处传来石门开启的轰鸣 |
| mech_lock_door | 上锁的石门 | 消耗 key 道具开启，激活 runFlag `door_unlocked` | 门上的锁孔积满灰尘，正等着一把对的钥匙 |
| exit_door | 刻纹石门 | 满足条件后通关 | 门后的光越来越亮，继续前进，或者离开这里 |

## 8. 配置要求

- 每张卡按 `CardDefinition` 配置（见 `03_Cards.md`），公共字段见 `../02_Development/06_DataBalance.md` 第 1 节。
- 效果全部走 `EffectDefinition`（priority/cancelable 等），例如陷阱卡的伤害 `cancelable: true`。
- 本清单对应 MVP 的 10～20 关（总规格书第一阶段），每关从本池按主题选取，不要求全部同场出现。
- 数值调整必须改 Balance 表后导出（`../02_Development/06_DataBalance.md` 第 3 节），不直接改 JSON。

## 9. 卡牌扩展规划（V1 → 全旅程 500 关，待生产）

23 张 MVP 卡覆盖阶段一；全旅程按五阶段扩展至 **87 张**（新增 64 张，逐张效果见 `03_Cards.md` §5）。本表是内容生产的勾销清单——**落卡时逐张补全：数值 + 威胁值（09_BalanceBaseline §8）+ 图鉴 + CopyDeck 文案 + 联动三检查**。

| 类型 | 现有 | 需补 | 新增机制方向 | 引入阶段 |
|---|---|---|---|---|
| 敌人（普通） | 5 | +14 | 毒系、高防、强攻、灼烧、状态组合、主题敌 | 二 4 / 三 3 / 四 3 / 五 4 |
| 敌人（精英） | 0 | +6 | 14_EliteBoss 机制池选型落卡 | 三 2 / 四 2 / 五 2 |
| **首领** | 0 | +6 | 6 个已定稿：数值 + 阶段 modifier + announce（14_EliteBoss.md §2、CopyDeck §10） | 三末起 |
| 资源 | 3 | +2 | 稀缺资源 | 四 |
| 恢复 | 3 | +2 | 净化灼烧、高阶大回复 | 三 |
| 装备 | 3 | +14 | 高阶装备 | 二 2 / 三 4 / 四 5 / 五 3 |
| 陷阱 | 2 | +6 | 扣食物、耗金币、强陷阱（G 节已列） | 二 1 / 三 2 / 四 2 / 五 1 |
| 事件 | 4 | +6 | 资源交换、多阶段事件 ×2、多目标事件 | 二 1 / 三 1 / 四 2 / 五 2 |
| 机关 | 2 | +4 | 机关链 ×2、特殊堆联动、双 flag | 三 / 四 |
| **特殊机制** | **0** | +4 | **已定稿**：倒流沙漏 / 复写沙漏 / 铅封锁 / 乱序沙漏（03_Cards.md §5） | 四 |
| 出口 | 1 | 0 | 复杂出口走 ExitRule 配置，不需新卡 | — |
| **合计** | **23** | **64** | 全旅程 87 张 | — |

**命名规范（2026-11-18 定）**：卡牌与道具名称采用「**材质 / 形态 + 具体物件或生物**」（如 银刃 / 熔火指环 / 守墓石像 / 铁片护符 / 干粮袋），**禁止纯抽象概念型命名**（如「虚空××」「终末××」）。本轮已将阶段四、五及部分道具的 27 个名称改为具体名词，**ID 不变**；玩家可见文案同步改写，避免名称与描述脱节。

**落卡三联动检查**（每张必过）：① threat 值录入 Balance；② 图鉴 Tab 自动扩展（类型 Tab 登记制）；③ CopyDeck 文案 key 登记。

**硬约束**：新卡必须带来新决策（状态组合/机关联动/堆操作），禁止纯数值放大（09_BalanceBaseline §4）；道具卡（type: item）维持不做。

**前置设计决策**：① 商人货单**已定**（见 §6 `evt_merchant` 货单）；② 精英机制**已定**（再生 + 荆棘，14_EliteBoss.md §1）；③ 特殊机制卡最小验证**已定**（`spec_reverse_stack`，见 §6），整类扩张留到阶段四。

**说明文案**：§1～§7 为阶段一 23 张的完整文案；§10～§13 为阶段二～五 43 张的文案。数值与效果以 `03_Cards.md` §5 与 Balance 为准，本节只登记玩家可见文本。

## 10. 阶段二卡牌文案（8 张，孢林深处）

| id | 名称 | 类型 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| enemy_sporeling_01 | 孢子幼体 | enemy | common | 它蹦一下，空气里就多一层呛人的粉尘。 |
| enemy_myconid_01 | 菌人 | enemy | uncommon | 菌伞下没有脸，只有一圈安静的眼睛。倒下时，孢子散了一地。 |
| enemy_cave_spider_01 | 洞穴蛛 | enemy | uncommon | 它在暗处织了很久的网，你是第一个撞上来的。 |
| enemy_moss_hound_01 | 苔藓猎犬 | enemy | uncommon | 苔藓盖住了旧伤。被惊动时，它比看上去快得多。 |
| trap_spore_cloud | 孢子云 | trap | uncommon | 一片浮在空中的粉雾，看着像雾，吸进去像火。 |
| evt_mushroom_ring | 蘑菇圈 | event | common | 蘑菇围成一个圆。圈里放着半块干粮和一小捧清水。 |
| eq_hunting_bow | 猎弓 | equipment | uncommon | 弓身是旧木，弦却换过新的。拉满时，它比看上去更安静。 |
| eq_moss_cloak | 苔甲 | equipment | uncommon | 苔藓长在甲片上，湿冷，却把第一下冲击吃掉了。 |

## 11. 阶段三卡牌文案（17 张，沉水墓窖）

| id | 名称 | 类型 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| enemy_drowned_01 | 溺亡者 | enemy | common | 水从它身上一直滴下来，脚步却比水声更轻。 |
| enemy_grave_warden_01 | 守墓石像 | enemy | uncommon | 它守了很久，久到自己也成了墓碑的一部分。 |
| enemy_bone_archer_01 | 骨弓手 | enemy | uncommon | 弓弦早该朽了，可它抬手的动作依旧稳。 |
| elite_spore_matriarch | 孢子母体 | enemy | rare | 整片菌毯都连着它。你踩下的每一步，它都知道。 |
| elite_drowned_knight | 溺亡骑士 | enemy | rare | 盔甲里灌满了水，剑却举得很直。 |
| boss_drowned_warden | 沉水守卫 | enemy | epic | 它抬起湿透的手臂，苔藓下露出旧伤。 |
| heal_big_salve | 高级治疗药剂 | healing | rare | 瓶口封着蜡，蜡上印着一枚看不清的家徽。 |
| heal_spring | 涌泉 | healing | uncommon | 石缝里渗出的水，凉的，带着一点铁锈味，伤口却慢慢合上了。 |
| eq_silver_blade | 银刃 | equipment | rare | 刃口映不出人影。握久了，手心会发凉。 |
| eq_scale_mail | 鳞甲 | equipment | rare | 鳞片一片压着一片，像把某种古老的东西穿在了身上。 |
| eq_grave_ring | 墓环 | equipment | rare | 指环内侧刻着一个名字。戴上之后，击杀时会听见很轻的一声叹息。 |
| eq_assassin_dagger | 刺客匕首 | equipment | rare | 短，轻，藏在袖子里。得手之后，它还愿意再来一次。 |
| trap_water_pit | 深水池 | trap | common | 水面平得像镜子。踩空的瞬间，背包轻了一半。 |
| trap_cursed_seal | 黑符石 | trap | uncommon | 黑符石上的字你不认识，可它认识你。 |
| evt_drowned_altar | 沉水祭坛 | event | uncommon | 祭坛上摆着三枚旧金币。放进去，水声会停一会儿。 |
| mech_gate_chain | 双联铁闸 | mechanism | uncommon | 双联铁闸由两根链条牵着，拉下一根，另一根会响。 |
| mech_water_valve | 水阀 | mechanism | common | 锈死的阀门。用力拧，能听见很深的地方有水流走了。 |

## 12. 阶段四卡牌文案（24 张，灰烬尖塔）

| id | 名称 | 类型 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| enemy_ash_wraith_01 | 灰烬幽魂 | enemy | uncommon | 它由没烧尽的东西组成。靠近时，护盾会先发出声音。 |
| enemy_cinder_knight_01 | 烬火骑士 | enemy | rare | 铠甲缝隙里透出橘红的光，每走一步都落下火星。 |
| enemy_flame_priest_01 | 焰祭司 | enemy | rare | 它把手按在胸口，火就旺一分。 |
| boss_ashen_colossus | 灰烬巨像 | enemy | epic | 灰堆成的高塔动了动，抖落一身火星。 |
| boss_cinder_witch | 烬火女巫 | enemy | epic | 炉火后面，有人慢慢搅动一锅什么。 |
| res_soul_ember | 余烬灯 | resource | uncommon | 一小团不烫手的火。靠近时，能听见很轻的说话声。 |
| res_star_shard | 星屑 | resource | rare | 碎掉的星光落在掌心里，一半是暖的，一半能吃。 |
| eq_ember_sword | 烬火剑 | equipment | rare | 剑身始终是温的。挥出去时，会带起一小片灰。 |
| eq_warden_cloak | 守望披风 | equipment | rare | 披上它，第一下打击总像是打在别处。 |
| eq_molten_ring | 熔火指环 | equipment | rare | 指环内侧还是烫的。挨打时，它会替你还一下。 |
| eq_slag_armor | 熔渣甲 | equipment | rare | 甲片间嵌着冷却的熔渣，沉，但站得稳。 |
| eq_ember_staff | 烬火法杖 | equipment | rare | 杖头那点火不灭，杀过一个，就亮一分。 |
| evt_forge | 灰烬锻炉 | event | rare | 炉膛还热着。把一件装备放进去，它会记住你的手。 |
| mech_seal_switch | 封印开关 | mechanism | uncommon | 钥匙转动的声音很轻，封条却整片剥落。 |
| mech_mirror | 镜像机关 | mechanism | uncommon | 两面镜子对着照，照出的门上没有把手。 |
| elite_slag_warden | 熔渣守卫 | enemy（精英） | rare | 它由冷却的熔渣堆成，走一步，掉一层壳。 |
| elite_cinder_deacon | 烬火执事 | enemy（精英） | rare | 它捧着一点火，像捧着什么不能灭的东西。 |
| trap_ash_mine | 灰烬地雷 | trap | uncommon | 灰下面埋着一点余温。踩上去之前，没人会注意。 |
| trap_ember_storm | 火星喷口 | trap | rare | 风卷起火星，落在哪，哪就开始发烫。 |
| evt_ash_pact | 灰烬契约 | event | rare | 炉灰上按着一只手印。它要的，是你的一点血。 |
| spec_reverse_stack | 倒流的沙漏 | special | rare | 沙子往上走。原本排在最后的，忽然到了眼前。 |
| spec_copy_top | 复写沙漏 | special | rare | 它照着最近的那张牌，抄了一份，放在你手边。 |
| spec_lock_stack | 铅封锁 | special | rare | 铅封落下，有一堆牌暂时不属于你了。 |
| spec_scramble_all | 乱序沙漏 | special | epic | 沙漏翻过来，所有堆的顺序都被重新洗过。 |

## 13. 阶段五卡牌文案（15 张，无星虚空）

| id | 名称 | 类型 | 稀有度 | 说明文案 |
|---|---|---|---|---|
| enemy_void_shade_01 | 影缚蝠 | enemy | rare | 它缠住人的影子，黑得连光都绕开。 |
| enemy_star_eater_01 | 星蚀甲虫 | enemy | epic | 甲壳张开时，头顶的星光被咬掉一块。 |
| enemy_star_crawler_01 | 星骸蜥 | enemy | rare | 它用碎掉的星光拼出四肢，爬过的地方一片黯淡。 |
| enemy_lightless_priest_01 | 灰袍祭司 | enemy | epic | 黑纱主教低头祷告，黑纱下漫出冷雾。 |
| eq_starfall_blade | 陨铁剑 | equipment | epic | 剑脊上嵌着一点冷光，像是从很高的地方掉下来的。 |
| eq_starless_pendant | 黑曜坠饰 | equipment | epic | 吊坠里没有星，只有一小块什么都不反射的黑。 |
| eq_worlds_end_blade | 终末之刃 | equipment | legendary | 剑身上没有纹路，只有一道很细的白光。握住它时，聒噪的世界安静了一瞬。 |
| evt_silent_bell | 哑钟 | event | rare | 哑钟晃着，没有声音，只等你做决定。 |
| elite_star_shard_lord | 星甲巨卫 | enemy（精英） | epic | 星甲巨卫把碎星一片片按回铠甲，走路像一座移动的城墙。 |
| elite_lightless_bishop | 黑纱主教 | enemy（精英） | epic | 它的祷词没有声音，可四周的光正在一点点退开。 |
| trap_void_rift | 地裂口 | trap | rare | 地上的裂口深不见底，靠近时背包会变轻。 |
| evt_void_echo | 回音石碑 | event | rare | 石碑会重复你说的话，只是每次都改掉结尾。 |
| boss_starless_king | 断冠王 | enemy | epic | 断冠歪戴在头上，王座后没有影子。 |
| boss_void_herald | 影号手 | enemy | epic | 号角没有声音，影子先到了，主人最后才到。 |
| boss_final_echo | 丧钟巨像 | enemy | epic | 巨像胸口的钟不响，只把脚步声吞进去，再送回来。 |
