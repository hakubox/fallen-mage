/*:
 * @target MZ
 * @plugindesc 白箱任务系统
 * @author hakubox
 *
 * @help
 * ============================================================================
 *                Hakubox Simple Quest System (v1.0)
 * ============================================================================
 * 这是一个专为 RPG Maker MZ 设计的轻量级但功能强大的任务系统。
 * 它会在地图上直接显示任务 HUD 面板，支持任务分类、进度追踪、自动监控等功能。
 *
 * 核心逻辑：
 * 1. 在【插件参数】中配置好“任务分组”和“任务数据库”。
 * 2. 在游戏事件中通过【插件指令】来发放任务、更新进度。
 *
 * ============================================================================
 * 【一、快速上手：创建第一个任务】
 * ============================================================================
 *
 * 1. 设置分组 (Category):
 *    打开插件参数 ➔ categoryList (任务分组配置)。
 *    默认已有 "main" (主线) 和 "sub" (支线)。您可以修改或添加，记住ID即可。
 *
 * 2. 创建任务 (Quest Template):
 *    打开 questTemplates (任务数据库)，添加一项：
 *    - 任务ID: kill_slime (唯一标识符，切勿重复)
 *    - 任务标题: 讨伐史莱姆 ({current}/{max})
 *    - 所属分组: main (填入上面设置的分组ID)
 *    - 最大进度值: 10
 *    - 初始描述: 村长让你去村外清理10只史莱姆。
 *    - 简短奖励预览: 500G
 *
 * 3. 游戏中发放任务:
 *    创建一事件（如村长），使用插件指令 ➔ 接受任务，参数填入 kill_slime。
 *
 * 4. 增加进度:
 *    在史莱姆的战斗事件或死亡公共事件中，使用插件指令 ➔ 增加进度：
 *    - 任务ID: kill_slime
 *    - 增加量: 1
 *    *注：当进度达到10/10时，任务状态会自动变为“已达标(待提交)”。*
 *
 * 5. 完成任务:
 *    回到村长事件，设置条件判断（脚本）：SimpleQuest.isSuccess("kill_slime")。
 *    使用插件指令 ➔ 强制改状态 ➔ 完成(归档消失)，并给予玩家金币。
 *
 * ============================================================================
 * 【二、颜色配置详解】
 * ============================================================================
 * 本插件所有涉及颜色的参数（如标题颜色、背景色、字体颜色等）均支持以下格式：
 *
 * 1. 系统色号 (System Color)
 *    - 格式：纯数字 (如 0, 16, 23)
 *    - 说明：对应 RPG Maker 系统图片 (Window.png) 右下角的色块索引。
 *    - 常用：0=白, 6=黄, 18=红, 23=蓝。
 *
 * 2. 十六进制颜色 (Hex Color)
 *    - 格式：#RRGGBB (如 #FFFFFF, #FF0000)
 *    - 说明：标准的网页颜色格式，不支持透明度。
 *
 * 3. RGBA 颜色 (推荐用于背景/透明效果)
 *    - 格式：rgba(红, 绿, 蓝, 透明度)
 *    - 示例：rgba(0, 0, 0, 0.5) 代表半透明黑色。
 *    - 说明：透明度范围是 0.0 (全透) ~ 1.0 (不透)。
 *
 * 应用场景：
 * - HUD背景色推荐使用 rgba(0,0,0,0.6) 以实现半透明黑底。
 * - 任务标题推荐使用 系统色号 以保持游戏风格统一。
 * - 失败任务颜色推荐使用 #888888 (灰色) 或系统色号 8。
 *
 * ============================================================================
 * 【三、文本占位符与格式化】
 * ============================================================================
 * 在“任务标题”和“任务描述”中，你可以使用以下代码动态显示数值：
 *
 *   {current}  ➔ 当前进度值 (如 3)
 *   {max}      ➔ 最大进度值 (如 10)
 *   {percent}  ➔ 当前百分比 (如 30)
 *   {remain}   ➔ 剩余所需数量 (如 7)
 *
 * 示例写法：
 * - 搜集草药： "寻找药草 ({current}/{max})" ➔ 显示 "寻找药草 (2/5)"
 * - 探索度：   "地图探索度 {percent}%"       ➔ 显示 "地图探索度 45%"
 *
 * ============================================================================
 * 【四、脚本指令手册 (Script Calls)】
 * ============================================================================
 * 在“条件分歧 ➔ 脚本”中使用，用于控制复杂的任务逻辑。
 * 所有的函数都位于全局对象 SimpleQuest 下。
 *
 * ----------------------------------------------------------------------------
 * 1. 状态判断 (支持多任务 & 列表判断)
 * ----------------------------------------------------------------------------
 * 这些函数用于检查任务当前的实时状态。
 * ★特点：只检测【未归档(未完成)】的任务。如果任务已完成，均返回 false。
 *
 * 【通用参数说明】
 *   excludeHidden (Boolean): 
 *     true  ➔ 仅检查可见任务。如果任务接了但因为 condition 被隐藏，视为不符合。
 *     false ➔ 检查所有任务 (推荐默认用这个)。
 *   ...ids (String/Array): 
 *     可以传入一个ID字符串，也可以传入多个ID，或者直接传入ID数组。
 *
 * 
 * A. 判断【进行中】(Active) - 任务已接取，且未达标，未失败，未归档。
 *    // 单个判断
 *    SimpleQuest.everyActive(false, "kill_slime")
 *    
 *    // [全满足] 必须任务A和任务B都在进行中，才返回 true
 *    SimpleQuest.everyActive(false, "quest_A", "quest_B")
 *    
 *    // [任一满足] 只要任务A或任务B有一个在进行中，就返回 true
 *    SimpleQuest.someActive(false, "quest_A", "quest_B")
 *
 * 
 * B. 判断【已达标待提交】(Success) - 进度已满，尚未提交归档。
 *    // 典型场景：玩家找NPC交任务，判断是否满足提交条件
 *    SimpleQuest.everySuccess(false, "kill_slime")
 *
 * 
 * C. 判断【已失败】(Fail) - 任务失败且未归档。
 *    SimpleQuest.everyFail(false, "protect_npc")
 *
 *
 * ----------------------------------------------------------------------------
 * 2. 历史与数据查询 (包含已归档任务)
 * ----------------------------------------------------------------------------
 * 这些函数会查询所有数据，包括【已完成/已归档】的任务。
 *
 * A. 判断是否曾经接取过
 *    // 无论现在是进行中、失败还是已完成，只要接取过就返回 true
 *    // 场景：用于判断“是否认识某人”或“是否触发过某剧情”
 *    SimpleQuest.hasHistory("meet_princess")
 *
 * B. 获取累计接取次数
 *    // 返回数字。如果没接过返回 0。
 *    SimpleQuest.countHistory("daily_quest_01")
 *
 * C. 判断【特定任务外的全清】(高级反向查询)
 *    // 场景：除了主线(main_quest)以外，其他的(支线/隐藏)任务全都做完归档了吗？
 *    // 返回 true 表示全都做完了(除了 main_quest)。
 *    // 后面的1,2代表排除掉成功和失败的任务，true代表排除掉隐藏的任务
 *    SimpleQuest.isAllCompletedExcept(["main_quest"], [1,2], true)
 *
 *    // 场景：判断是否所有接过的任务都已彻底完成/归档？(不排除任何任务)
 *    SimpleQuest.isAllCompletedExcept()
 *
 * ----------------------------------------------------------------------------
 * 3. 进度与描述操作 (高级用法)
 * ----------------------------------------------------------------------------
 * 虽然通常推荐用插件指令，但脚本也可以直接操作。
 *
 * A. 强制完成/归档任务
 *    // 参数: (任务ID, 是否归档, 强制执行?)
 *    // 将任务彻底移出列表，标记为完成。
 *    SimpleQuest.setLatestCompleted("kill_slime", true)
 *
 * B. 修改任务进度
 *    // 直接设为 5
 *    SimpleQuest.setLatestProgress("kill_slime", 5)
 *    // 增加 1
 *    SimpleQuest.addLatestProgress("kill_slime", 1)
 *
 * C. 动态修改描述
 *    SimpleQuest.updateLatestDesc("kill_slime", "史莱姆王出现了！快击败它！")
 *
 * ============================================================================
 * 【五、高级功能：自动监控代码 (Automated Quests)】
 * ============================================================================
 * 在任务模板的“自动监控代码”栏填入 JS 代码，即无需手动调用“增加进度”指令。
 * 系统每 15 帧会自动运行一次该代码。
 *
 * 【重要规则】
 * 1. 代码环境中有变量 item 可用，指向当前任务实例。
 * 2. 必须使用 return 返回结果。
 *
 * 【三种返回模式】
 * A. 返回数字 (0, 1, 5...)
 *    ➔ 系统会自动将任务进度更新为该数字。
 *    ➔ *适用场景：搜集物品、持有金币、变量值同步。*
 *    示例 (持有5个药水)：
 *    return $gameParty.numItems($dataItems[1]);
 *
 * B. 返回 true
 *    ➔ 系统直接判定任务为“已达标(待提交)”。
 *    ➔ *适用场景：到达某地图、开关打开、等级达到。*
 *    示例 (开关10号打开即完成)：
 *    return $gameSwitches.value(10);
 *
 * C. 返回 false
 *    ➔ 系统直接判定任务为“失败”。
 *    ➔ *适用场景：限时任务超时、关键NPC死亡。*
 *    示例 (变量20倒计时归零则失败)：
 *    return $gameVariables.value(20) <= 0;
 *
 * ============================================================================
 * 【六、常见问题 (FAQ)】
 * ============================================================================
 * Q: 任务完成了，但列表里还在？
 * A: 任务进度满（如10/10）后状态是“已达标”，此时玩家通常需要找NPC对话“交任务”。
 *    交任务时请使用指令“强制改状态 ➔ 完成(归档消失)”，任务才会从HUD移除。
 *
 * Q: 怎么做“对话即完成”的简单任务？
 * A: 将“最大进度值”设为 1。接取任务后，对话结束时直接用指令“设置进度 ➔ 1”，
 *    或者直接用指令“强制改状态 ➔ 成功(待提交)”。
 *
 * Q: HUD 把地图名遮住了怎么办？
 * A: 插件默认开启了“地图名遮挡优化”。当左上角显示地图名时，任务栏会自动变透明。
 *    您也可以在参数 hudY 中增加数值，让任务栏位置下移。
 * 
 * Q: 如何彻底隐藏任务栏（例如在看剧情时）？
 * A: 配置参数中的 全局显示开关ID。在剧情开始前关闭该开关，结束后打开即可。
 *
 * ============================================================================
 * 
 * @param ==== 核心数据配置 ====
 *
 * @param categoryList
 * @text 1. 任务分组配置
 * @type struct<Category>[]
 * @desc 定义任务的分组标签（如：主线、支线、委托）。
 * @default ["{\"id\":\"main\",\"name\":\"◆ 主线剧情\",\"color\":\"6\",\"priority\":\"1\"}","{\"id\":\"sub\",\"name\":\"◆ 支线任务\",\"color\":\"0\",\"priority\":\"2\"}"]
 *
 * @param questTemplates
 * @text 2. 任务数据库
 * @type struct<QuestTemplate>[]
 * @desc 在这里录入所有的任务详情。
 * @default []
 *
 * @param ==== HUD 布局与外观 ====
 *
 * @param hudX
 * @text HUD X坐标
 * @type number
 * @default 10
 *
 * @param hudY
 * @text HUD Y坐标
 * @type number
 * @default 10
 *
 * @param hudWidth
 * @text HUD 总宽度
 * @type number
 * @default 320
 *
 * @param itemPadding
 * @text 内容内边距
 * @desc 文字距离背景边缘的距离。
 * @type number
 * @default 8
 *
 * @param sectionSpacing
 * @text 分组间距
 * @desc “主线”组和“支线”组之间的垂直距离。
 * @type number
 * @default 24
 *
 * @param showListBackground
 * @text 显示背景黑底
 * @type boolean
 * @default true
 * 
 * @param listBackgroundColor
 * @text 背景颜色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default rgba(0,0,0,0.5)
 *
 * @param borderRadius
 * @text 背景圆角
 * @type number
 * @default 8
 *
 * @param headerBackgroundColor
 * @text 分组标题背景色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default rgba(0,0,0,0.6)
 *
 * @param ==== 文字样式 ====
 * 
 * @param fontSizeGroup
 * @text 字体大小: 分组标题
 * @type number
 * @default 16
 * 
 * @param fontSizeTitle
 * @text 字体大小: 任务标题
 * @type number
 * @default 15
 * 
 * @param fontSizeDesc
 * @text 字体大小: 任务描述
 * @type number
 * @default 13
 * 
 * @param fontSizeReward
 * @text 字体大小: 奖励文本
 * @type number
 * @default 14
 * 
 * @param fontColorDesc
 * @text 字体颜色: 任务描述
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。推荐使用rgba以降低不透明度，区分层级。
 * @type string
 * @default rgba(220,220,220,0.9)
 * 
 * @param fontColorReward
 * @text 字体颜色: 奖励文本
 * @type number
 * @desc 输入系统色号(如 0~31)。
 * @default 0
 *
 * @param fontOutlineWidth
 * @text 描边宽度
 * @type number
 * @default 3
 * 
 * @param fontOutlineColor
 * @text 描边/阴影颜色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default #000000
 *
 * @param fontShadowDistance
 * @text 阴影距离
 * @desc 0为不显示阴影。
 * @type number
 * @default 1
 *
 * @param ==== 状态文本配置 ====
 *
 * @param textRunning
 * @text [进行中] 前缀文本
 * @type string
 * @default 【进行中】
 *
 * @param colorRunning
 * @text [进行中] 颜色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default 0
 *
 * @param textSuccess
 * @text [已完成] 前缀文本
 * @desc 任务目标达成，但在提交之前的状态。
 * @type string
 * @default 【已达标】
 *
 * @param colorSuccess
 * @text [已完成] 颜色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default 3
 *
 * @param textFail
 * @text [失败] 前缀文本
 * @type string
 * @default 【已失败】
 *
 * @param colorFail
 * @text [失败] 颜色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default 10
 *
 * @param ==== 交互与动画 ====
 *
 * @param visibleSwitchId
 * @text 全局显示开关ID
 * @desc 指定一个开关。开=允许显示，关=隐藏。设为0则始终允许显示。
 * @type switch
 * @default 0
 * 
 * @param hiddenOpacity
 * @text 地图名遮挡时透明度
 * @desc 任务栏自动变半透明的透明度（0~255）
 * @type number
 * @min 0
 * @max 255
 * @default 50
 * 
 * @param enableMapNameOpacity
 * @text 地图名遮挡优化
 * @desc 当左上角显示地图名时，任务栏自动变半透明。
 * @type boolean
 * @default true
 * 
 * @param enableMouseOpacity
 * @text 鼠标/玩家悬停优化
 * @desc 当鼠标或玩家在任务栏区域时，自动变半透明。
 * @type boolean
 * @default true
 *
 * @param ==== 游戏逻辑限制 ====
 *
 * @param maxRunningQuests
 * @text 最大同时接取数
 * @desc 玩家同时能进行的任务上限。-1为不限制。
 * @type number
 * @min -1
 * @default -1
 *
 * @param ==== 默认音效设置 ====
 * @desc 若任务单独配置了音效，则优先使用单独的，否则使用这里的默认值。
 *
 * @param seAccept
 * @text 任务接取时
 * @type file
 * @dir audio/se/
 *
 * @param seSuccess
 * @text 达成目标时
 * @type file
 * @dir audio/se/
 *
 * @param seFail
 * @text 任务失败时
 * @type file
 * @dir audio/se/
 *
 * @command AddQuest
 * @text ➔ 接受任务
 * @desc 根据任务ID领取一个新任务。
 * @arg templateId
 * @text 任务ID
 * @desc 对应“任务库”中配置的ID。
 * @type string
 *
 * @command AddProgress
 * @text ➔ 增加进度
 * @desc 增加指定任务的进度值（如杀怪数+1）。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg value
 * @text 增加量
 * @type number
 * @min 1
 * @default 1
 * 
 * @command SetProgress
 * @text ➔ 设置进度
 * @desc 直接设置进度为某数值。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg value
 * @text 目标数值
 * @type number
 * @min 0
 * @default 0
 *
 * @command SetStatus
 * @text ➔ 强制改状态
 * @desc 强制修改任务状态（通常用于剧情杀或直接完成）。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg status
 * @text 新状态
 * @type select
 * @option 成功(待提交)
 * @value success
 * @option 失败
 * @value fail
 * @option 进行中
 * @value active
 * @default success
 * 
 * @command SetCompleted
 * @text ➔ 设置归档状态
 * @desc 将任务标记为“已归档/已完成”，使其从任务列表(HUD)中移除，但仍可通过脚本查询。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg completed
 * @text 是否归档
 * @desc 取消归档的话若未达标则重新显示
 * @type boolean
 * @on 归档隐藏
 * @off 取消归档
 * @default true
 * @arg force
 * @text 是否强制
 * @type boolean
 * @default true
 *
 * @command UpdateDesc
 * @text ➔ 更新描述
 * @desc 修改任务描述文本（例如：任务进入第二阶段，提示变了）。
 * @arg templateId
 * @text 任务ID
 * @type string
 * @arg desc
 * @text 新的描述
 * @type multiline_string
 * 
 * @command ShowHud
 * @text ➔ 显示任务栏
 * @desc 开启任务栏显示。注意：如果配置了“全局显示开关ID”且该开关是关闭状态，此指令无效。
 * 
 * @command HideHud
 * @text ➔ 隐藏任务栏
 * @desc 强制关闭任务栏显示。
 */

/*~struct~Category:
 * @param id
 * @text 类型ID
 * @desc 英文ID，用于在任务配置中关联。如 main, sub
 * @type string
 *
 * @param name
 * @text 显示名称
 * @desc HUD上显示的标题文字。
 * @type string
 *
 * @param color
 * @text 标题颜色
 * @desc 系统色号"0-31" 或 Hex颜色"#FFFFFF" 或RGB/RGBA颜色"rgb(0,0,0,0)"。
 * @type string
 * @default 0
 *
 * @param priority
 * @text 排序优先级
 * @desc 数字越小越靠前显示。
 * @type number
 * @default 1
 */

/*~struct~QuestTemplate:
 * 
 * @param id
 * @text 任务ID (必填)
 * @desc 唯一标识符，脚本和插件指令调用时使用。
 * @type string
 *
 * @param r
 * @text 编辑器备注
 * @desc 仅用于在插件列表里方便看，不影响游戏。
 * @type string
 * 
 * 
 * @param group1
 * @text ==== 基础信息 ====
 * 
 * @param title
 * @text 任务标题
 * @parent group1
 * @type string
 * @desc 支持 {current}/{max}。
 *
 * @param typeId
 * @text 所属分组
 * @parent group1
 * @desc 填写分组配置里的ID (如 main)。
 * @type string
 * @default main
 * 
 * @param desc
 * @text 初始描述
 * @parent group1
 * @type multiline_string
 * @desc 任务下方的详细说明。支持 {current} {max}。
 *
 * @param rewardText
 * @text 简短奖励预览
 * @parent group1
 * @desc 显示在标题右侧的短文本（如：500G）。
 * @type string
 *
 * @param group2
 * @text ==== 进度与逻辑 ====
 *
 * @param maxProgress
 * @text 最大进度值
 * @parent group2
 * @type number
 * @min 1
 * @default 1
 * @desc 如杀10只怪填10。若只是对话任务填1。
 * 
 * @param maxRepeat
 * @text 最大可领取次数
 * @parent group2
 * @desc -1为无限。1为一次性任务，默认为单次任务。
 * @type number
 * @min -1
 * @default 1
 *
 * @param condition
 * @text 显示条件 (JS)
 * @parent group2
 * @type string
 * @desc 即使接了任务，也可以通过此条件临时隐藏它。返回true显示，false隐藏。为空则始终显示。
 * @default 
 *
 * @param monitorCode
 * @text 自动监控代码 (JS)
 * @parent group2
 * @type multiline_string
 * @desc 返回进度数值或true/false。详见插件说明。
 *
 * @param group3
 * @text ==== 事件与脚本 ====
 *
 * @param ceAccept
 * @text 公共事件: 任务接取时
 * @parent group3
 * @type common_event
 * @default 0
 * 
 * @param ceSuccess
 * @text 公共事件: 达标时
 * @parent group3
 * @type common_event
 * @default 0
 * 
 * @param ceComplete
 * @text 公共事件: 完成时
 * @parent group3
 * @desc 提交交付任务后触发。
 * @type common_event
 * @default 0
 *
 * @param ceFail
 * @text 公共事件: 失败时
 * @parent group3
 * @type common_event
 * @default 0
 *
 * @param onAccept
 * @text JS脚本: 任务接取时
 * @parent group3
 * @type multiline_string
 * 
 * @param onSuccess
 * @text JS脚本: 达标时
 * @parent group3
 * @type multiline_string
 * 
 * @param onComplete
 * @text JS脚本: 完成时
 * @parent group3
 * @type multiline_string
 *
 * @param group4
 * @text ==== 自定义音效 ====
 * 
 * @param seAccept
 * @text 音效: 任务接取时
 * @parent group4
 * @type file
 * @dir audio/se/
 * 
 * @param seSuccess
 * @text 音效: 达标时
 * @parent group4
 * @type file
 * @dir audio/se/
 * 
 * @param seFail
 * @text 音效: 失败时
 * @parent group4
 * @type file
 * @dir audio/se/
 */

(() => {
    const PLUGIN_NAME = "Hakubox_SimpleQuest";
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);

    // ======================================================================
    // 0. 工具函数与配置解析
    // ======================================================================

    function parseStructList(jsonStr) {
        if (!jsonStr) return [];
        try {
            const list = JSON.parse(jsonStr);
            const result = [];
            for (let i = 0; i < list.length; i++) {
                result.push(JSON.parse(list[i]));
            }
            return result;
        } catch (e) {
            console.error(PLUGIN_NAME + ": JSON Parse Error", e);
            return [];
        }
    }

    /** 通用颜色解析器 */
    function parseColor(input) {
        if (!input) return "#000000";
        input = String(input).trim();
        
        // 如果是纯数字，视为系统色号
        if (/^\d+$/.test(input)) {
            if (ColorManager._windowskin) {
                return ColorManager.textColor(Number(input));
            } else {
                return "#000000";
            }
        }
        // 否则视为CSS颜色 (#... / rgb...)
        return input;
    }

    /** 辅助执行公共事件 */
    function reserveCommonEvent(commonEventId) {
        if (commonEventId > 0) {
            $gameTemp.reserveCommonEvent(commonEventId);
        }
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function playSe(filename) {
        if (filename) {
            AudioManager.playSe({ name: filename, volume: 90, pitch: 100, pan: 0 });
        }
    }

    let CONFIG = {
        x: Number(PARAMS['hudX'] || 10),
        y: Number(PARAMS['hudY'] || 10),
        width: Number(PARAMS['hudWidth'] || 320),
        maxRunningQuests: Number(PARAMS['maxRunningQuests'] || 5),
        itemPadding: Number(PARAMS['itemPadding'] || 8),
        sectionSpacing: Number(PARAMS['sectionSpacing'] || 24),
        
        showBg: PARAMS['showListBackground'] === 'true',
        bgColor: PARAMS['listBackgroundColor'] || 'rgba(0,0,0,0.5)',
        headerBgColor: PARAMS['headerBackgroundColor'] || 'rgba(0,0,0,0.6)',
        borderRadius: Number(PARAMS['borderRadius'] || 8),
        
        outlineWidth: Number(PARAMS['fontOutlineWidth'] || 3),
        shadowDist: Number(PARAMS['fontShadowDistance'] || 1),
        outlineColor: PARAMS['fontOutlineColor'] || '#000000',
        visibleSwitchId: Number(PARAMS['visibleSwitchId'] || 0),
        hiddenOpacity: Number(PARAMS['hiddenOpacity'] || 50),

        fontSizeGroup: Number(PARAMS['fontSizeGroup'] || 16),
        fontSizeTitle: Number(PARAMS['fontSizeTitle'] || 15),
        fontSizeReward: Number(PARAMS['fontSizeReward'] || 14),
        colorReward: PARAMS['fontColorReward'] || 0,
        fontSizeDesc: Number(PARAMS['fontSizeDesc'] || 13),
        fontColorDesc: PARAMS['fontColorDesc'] || 'rgba(220, 220, 220, 0.9)',

        enableMapNameOpacity: PARAMS['enableMapNameOpacity'] === 'true',
        enableMouseOpacity: PARAMS['enableMouseOpacity'] === 'true',

        globalSe: {
            accept: PARAMS['seAccept'],
            success: PARAMS['seSuccess'],
            fail: PARAMS['seFail']
        },

        statusText: {
            0: { text: PARAMS['textRunning'], color: PARAMS['colorRunning'] },
            1: { text: PARAMS['textSuccess'], color: PARAMS['colorSuccess'] },
            2: { text: PARAMS['textFail'],    color: PARAMS['colorFail'] },
        },
        categories: parseStructList(PARAMS['categoryList']).sort((a, b) => Number(a.priority) - Number(b.priority)),
        templates: {}
    };

    // 构建任务 Map
    const tempArr = parseStructList(PARAMS['questTemplates']);
    for (let i = 0; i < tempArr.length; i++) {
        const t = tempArr[i];
        let _desc = t.desc || '';
        
        let _condFunc = null;
        if (t.condition && t.condition.trim() !== "") {
            try {
                _condFunc = new Function("return (" + t.condition + ");");
            } catch (e) {
                console.error("SimpleQuest: Condition Parse Error for " + t.id, e);
            }
        }

        CONFIG.templates[t.id] = {
            id: t.id,
            typeId: t.typeId,
            title: t.title,
            maxProgress: Number(t.maxProgress || 1),
            maxRepeat: parseInt(t.maxRepeat || -1), // 新增：最大重复次数
            conditionFunc: _condFunc,
            desc: _desc || "",
            rewardText: t.rewardText,
            
            seAccept: t.seAccept || CONFIG.globalSe.accept,
            seSuccess: t.seSuccess || CONFIG.globalSe.success,
            seFail: t.seFail || CONFIG.globalSe.fail,
            
            ceAccept: Number(t.ceAccept || 0),
            ceSuccess: Number(t.ceSuccess || 0),
            ceFail: Number(t.ceFail || 0),
            ceComplete: Number(t.ceComplete || 0),

            onAccept: t.onAccept || "",
            onSuccess: t.onSuccess || "",
            onFail: t.onFail || "",
            onComplete: t.onComplete || "",
            monitorCode: t.monitorCode || ""
        };
    }

    const Q_STATUS = {
        RUNNING: 0,
        SUCCESS: 1, 
        FAIL: 2
    };

    // ======================================================================
    // 1. 全局管理器 (Window Context) & Utilities
    // ======================================================================

    window.SimpleQuest = {
        showHud() {
            $gameSystem._questHudVisible = true;
            // 强制刷新一次HUD以确保状态同步
            if ($gameSystem.requestHudRefresh) {
                $gameSystem.requestHudRefresh();
            }
        },
        hideHud() {
            $gameSystem._questHudVisible = false;
            if ($gameSystem.requestHudRefresh) {
                $gameSystem.requestHudRefresh();
            }
        },
        // --- 核心操作 ---

        addQuest(templateId) {
            const template = CONFIG.templates[templateId];
            if (!template) {
                console.warn(PLUGIN_NAME + ": Template not found: " + templateId);
                return null;
            }

            // 1. 检查单一任务的领取次数限制
            if (template.maxRepeat !== -1) {
                const historyCount = this.countHistory(templateId);
                // 注意：这里用 >= 是因为 countHistory 包含当前正在进行的
                // 如果是“只允许做1次”，此时historyCount如果已经是1(比如正在做)，就不让做了？
                // 逻辑应该是：允许接取的前提是 (历史总数 < 上限)。
                // 因为接取时，countHistory 还没有+1 (实例还没加进去)。
                if (historyCount >= template.maxRepeat) {
                    console.log(PLUGIN_NAME + ": Quest template limit reached for " + templateId);
                    return null;
                }
            }

            // 2. 检查全局正在进行的任务数量限制
            if (CONFIG.maxRunningQuests !== -1) {
                const runningCount = $gameSystem.countRunningQuests();
                if (runningCount >= CONFIG.maxRunningQuests) {
                    console.log(PLUGIN_NAME + ": Global Active Quest limit reached.");
                    return null;
                }
            }

            const uuid = generateUUID();

            const instance = {
                uuid: uuid,
                templateId: templateId,
                typeId: template.typeId,
                title: template.title,
                desc: template.desc,
                status: Q_STATUS.RUNNING,
                isCompleted: false,
                progress: 0, 
                maxProgress: template.maxProgress, 
                timestamp: Date.now()
            };

            $gameSystem.addQuestInstance(instance);
            playSe(template.seAccept);
            reserveCommonEvent(template.ceAccept);
            this._evalCode(template.onAccept, instance);
            
            return uuid;
        },

        setStatusByUuid(uuid, status) {
            const instance = $gameSystem.getQuestByUuid(uuid);
            if (!instance) return;
            if (instance.status === status) return;

            instance.status = status;

            if ((status === Q_STATUS.SUCCESS) && instance.progress < instance.maxProgress) {
                instance.progress = instance.maxProgress;
            }

            const template = CONFIG.templates[instance.templateId];
            
            if (status === Q_STATUS.SUCCESS) playSe(template.seSuccess);
            else if (status === Q_STATUS.FAIL) playSe(template.seFail);

            $gameSystem.requestHudRefresh();

            if (template) {
                if (status === Q_STATUS.SUCCESS) {
                    reserveCommonEvent(template.ceSuccess);
                    this._evalCode(template.onSuccess, instance);
                } 
                else if (status === Q_STATUS.FAIL) {
                    reserveCommonEvent(template.ceFail);
                    this._evalCode(template.onFail, instance);
                }
            }
        },

        setLatestStatus(templateId, status) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                this.setStatusByUuid(instance.uuid, status);
            } else {
                console.warn("No active instance found for template: " + templateId);
            }
        },

        setLatestProgress(templateId, value) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (!instance) return;

            if (instance.status === Q_STATUS.FAIL) return;

            let newVal = value;
            if (newVal < 0) newVal = 0;
            if (newVal > instance.maxProgress) newVal = instance.maxProgress;

            instance.progress = newVal;

            if (instance.progress >= instance.maxProgress && instance.status === Q_STATUS.RUNNING) {
                this.setStatusByUuid(instance.uuid, Q_STATUS.SUCCESS);
            } else {
                $gameSystem.requestHudRefresh(); 
            }
        },

        // 新增：安全归档逻辑
        // 只有当任务处于 Success 或 Fail 时，或者 force=true 时，才允许归档
        setLatestCompleted(templateId, isCompleted, force = false) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (!instance) return;
            // 安全检查：如果任务还在 Running 且非强制，不允许直接归档，防止任务逻辑断层
            if (instance.status === 0 && isCompleted && !force) {
                console.warn(`SimpleQuest: 试图归档一个正在进行中的任务 ${templateId}，操作已被拦截。建议先 SetStatus 为 Success/Fail，或在指令中勾选‘强制’。`);
                return;
            }
            instance.isCompleted = !!isCompleted;
            $gameSystem.requestHudRefresh();
            
            // 归档时触发完成事件
            if (isCompleted) {
                const template = CONFIG.templates[instance.templateId];
                if (template) {
                    reserveCommonEvent(template.ceComplete);
                    this._evalCode(template.onComplete, instance);
                }
            }
        },

        addLatestProgress(templateId, amount) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                this.setLatestProgress(templateId, instance.progress + amount);
            }
        },

        updateLatestDesc(templateId, newDesc) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                instance.desc = newDesc;
                $gameSystem.requestHudRefresh();
            }
        },

        removeLatest(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            if (instance) {
                $gameSystem.removeQuestInstance(instance.uuid);
            }
        },

        refresh() {
            $gameSystem.requestHudRefresh();
        },

        // --- 查询 API (Utility Functions) ---

        /**
         * 统一检查状态
         * @param {string|Array} ids - 任务ID
         * @param {Function} checkFn - 针对单个实例的检查回调 (返回true/false)
         * @param {boolean} excludeHidden - 是否排除被条件隐藏的任务
         */
        _checkBatch(ids, checkFn, excludeHidden) {
            const list = Array.isArray(ids) ? ids : [ids];
            
            // AND 逻辑：必须所有任务都满足
            for (const id of list) {
                const instance = $gameSystem.getLatestInstance(id);
                if (!instance) return false; // 没接这个任务，直接false
                // 1. 基础状态检查
                if (!checkFn(instance)) return false;
                // 2. 隐藏条件检查
                if (excludeHidden) {
                    const tpl = CONFIG.templates[id];
                    if (tpl && tpl.conditionFunc) {
                        try {
                            if (!tpl.conditionFunc.call(window)) return false;
                        } catch (e) {
                            // 报错默认视为显示
                        }
                    }
                }
            }
            return true;
        },

        /**
         * 内部通用迭代器：处理参数并根据 mode 执行 every 或 some
         * @param {boolean} modeEvery - true=every(全满足), false=some(任一满足)
         * @param {number} targetStatus - 0=Running, 1=Success, 2=Fail
         * @param {boolean} excludeHidden - 是否排除被条件隐藏的任务
         * @param {Array} args - 传入的任务ID列表
         */
        _checkIterate(modeEvery, targetStatus, excludeHidden, args) {
            // 1. 参数归一化：将参数展开并拍平，处理用户传入数组或散参的情况
            // 例如用户传 (true, "A", "B") 或 (true, ["A", "B"]) 都能处理
            let ids = [];
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (Array.isArray(arg)) ids.push(...arg);
                else ids.push(arg);
            }
            
            // 如果没传任何ID，Every默认为true(空集全真)，Some默认为false。
            // 但在业务逻辑中，没传ID通常视为“无匹配”，这里统一返回 false 防止逻辑漏洞。
            if (ids.length === 0) return false;
            // 定义单项检查逻辑
            const checkItem = (id) => {
                const _id = '' + (id || '');
                const instance = $gameSystem.getLatestInstance(_id);
                
                // 条件1：实例必须存在
                if (!instance) return false;
                // 条件2：必须未归档 (用户需求：不包含已完成任务)
                if (instance.isCompleted) return false;
                // 条件3：状态必须匹配
                if (instance.status !== targetStatus) return false;
                // 条件4：(可选) 排除隐藏的任务
                if (excludeHidden) {
                    const tpl = CONFIG.templates[_id];
                    if (tpl && tpl.conditionFunc) {
                        try {
                            const isVisible = tpl.conditionFunc.call(window);
                            if (!isVisible) return false;
                        } catch (e) {
                            return true; // 报错默认视为显示
                        }
                    }
                }
                return true;
            };
            // 2. 执行逻辑
            if (modeEvery) {
                return ids.every(checkItem);
            } else {
                return ids.some(checkItem);
            }
        },

        // --- 1.Active (进行中: Status 0, 未完成) ---
        /** [全满足] 所有传入的任务都必须正在进行中（且未隐藏/未完成）*/
        everyActive(excludeHidden, ...templateIds) {
            return this._checkIterate(true, Q_STATUS.RUNNING, excludeHidden, templateIds);
        },
        /** [任一满足] 传入的任务中只要有一个正在进行中 */
        someActive(excludeHidden, ...templateIds) {
            return this._checkIterate(false, Q_STATUS.RUNNING, excludeHidden, templateIds);
        },
        // --- 2.Success (已达标: Status 1, 未完成) ---
        /** [全满足] 所有传入的任务都处于“已达标待提交”状态 */
        everySuccess(excludeHidden, ...templateIds) {
            return this._checkIterate(true, Q_STATUS.SUCCESS, excludeHidden, templateIds);
        },
        /** [任一满足] 传入的任务中只要有一个处于“已达标待提交”状态 */
        someSuccess(excludeHidden, ...templateIds) {
            return this._checkIterate(false, Q_STATUS.SUCCESS, excludeHidden, templateIds);
        },
        // --- 3.Fail (失败: Status 2, 未完成) ---
        /** [全满足] 所有传入的任务都处于“失败”状态（且未归档） */
        everyFail(excludeHidden, ...templateIds) {
            // 失败任务通常不建议隐藏，但保持参数一致性
            return this._checkIterate(true, Q_STATUS.FAIL, excludeHidden, templateIds);
        },
        /** [任一满足] 传入的任务中只要有一个处于“失败”状态 */
        someFail(excludeHidden, ...templateIds) {
            return this._checkIterate(false, Q_STATUS.FAIL, excludeHidden, templateIds);
        },
        /**
         * [高级查询] 判断是否所有已接过的任务都已归档(Completed)，排除指定的一组ID。
         * 
         * 逻辑：
         * 1. 遍历系统里所有接过的任务实例。
         * 2. 如果任务ID在排除列表(exceptIds)中，跳过不检查（无论它是进行中还是完成）。
         * 3. 如果任务ID不在排除列表中，它必须是 isCompleted=true。
         * 4. 只要发现一个“非排除且未完成”的任务，立即返回 false。
         * 
         * @param {Array<string>} exceptIds 排除检查的任务ID列表 (例如 ["main_1", "main_2"])
         * @param {Array<string>} status 排除检查的状态列表 (例如 [0, 1])
         * @param {boolean} [exceptHidden=true] 是否排除隐藏任务
         * @returns {boolean}
         */
        isAllCompletedExcept(exceptIds = [], status = [], exceptHidden = true) {
            const allQuests = $gameSystem.getAllQuests(!exceptHidden);
            if (!allQuests || allQuests.length === 0) return true; // 如果一个任务都没接过，视为满足

            // 归一化排除列表，确保是数组
            const ignoreList = Array.isArray(exceptIds) ? exceptIds : [exceptIds];
            const ignoreStatusList = Array.isArray(status) ? status : [status];

            for (let i = 0; i < allQuests.length; i++) {
                const q = allQuests[i];
                // 如果这个任务在排除名单里，直接跳过，不管是进行中还是失败，都不影响结果
                if (ignoreList.includes(q.templateId)) continue;
                if (ignoreStatusList.includes(q.status)) continue;

                // 如果不在排除名单里，它必须是已归档状态
                // 只有 isCompleted=true 才算过关
                if (!q.isCompleted) {
                    return false;
                }
            }

            return true;
        },

        /**
         * 判断任务是否正在进行 (Status 0)
         * @param {string|string[]} templateId 任务模板
         * @param {boolean} [excludeHidden=false] 是否排除隐藏项
         * @returns {boolean}
         */
        isActive(templateId, excludeHidden = false) {
            return this._checkStatus(templateId, Q_STATUS.RUNNING, excludeHidden);
        },
        /**
         * 判断任务是否已成功 (Status 1)
         * @param {string|string[]} templateId 任务模板
         * @param {boolean} [excludeHidden=false] 是否排除隐藏项
         * @returns {boolean}
         */
        isSuccess(templateId, excludeHidden = false) {
            return this._checkStatus(templateId, Q_STATUS.SUCCESS, excludeHidden);
        },
        /**
         * 判断任务是否已失败 (Status 2)
         * @param {string|string[]} templateId 任务模板
         * @param {boolean} [excludeHidden=false] 是否排除隐藏项
         * @returns {boolean}
         */
        isFail(templateId, excludeHidden = false) {
            return this._checkStatus(templateId, Q_STATUS.FAIL, excludeHidden);
        },

        /**
         * 判断玩家是否曾经有关于这个任务的记录 (无论现在是什么状态)
         * @param {string} templateId 
         * @returns {boolean}
         */
        hasHistory(templateId) {
            return this.countHistory(templateId) > 0;
        },

        /**
         * 获取该任务被领取的总次数 (包含正在进行、完成、失败的所有历史)
         * @param {string} templateId 
         * @returns {number}
         */
        countHistory(templateId) {
            let count = 0;
            const allQuests = $gameSystem.getAllQuests();
            if (!allQuests) return 0;
            
            for (let i = 0; i < allQuests.length; i++) {
                if (allQuests[i].templateId === templateId) {
                    count++;
                }
            }
            return count;
        },

        // --- 内部 helper ---

        _evalCode(code, questInstance) {
            if (!code || code.trim() === "") return;
            const quest = questInstance; 
            try {
                eval(code);
            } catch (e) {
                console.error("SimpleQuest Script Error:", e);
            }
        }
    };

    // ======================================================================
    // 2. 存档数据扩展 (Game_System)
    // ======================================================================

    // 缓存容器，不要存入存档(prototype里定义即可)，或者在initialize里定义为不可枚举
    // 这里我们选择在运行时动态生成
    const _monitorFuncCache = {};
    function getMonitorFunc(templateId) {
        if (_monitorFuncCache[templateId]) return _monitorFuncCache[templateId];
        
        const tpl = CONFIG.templates[templateId];
        if (!tpl || !tpl.monitorCode) return null;
        try {
            // new Function 构建函数
            const f = new Function("quest", "return " + tpl.monitorCode); // 此时 monitorCode 应该是一个表达式或函数体
            // 如果用户写的是 "return 1", 则 new Function 变成 function(quest){ return 1 }
            // 如果用户忘记写 return，如 "$gameParty.gold()", 我们最好容错一下，或者明确告之用户必须写 return
            // 建议：直接 new Function("return (" + code + ")"); 不太好，因为多行代码可能包含逻辑。
            // 采用 new Function("quest", code); 用户必须写 return。
            const func = new Function("quest", tpl.monitorCode);
            _monitorFuncCache[templateId] = func;
            return func;
        } catch (e) {
            console.error("SimpleQuest: Monitor Code Error in " + templateId, e);
            return null;
        }
    }

    const _Game_System_update = Game_System.prototype.update;
    Game_System.prototype.update = function() {
        _Game_System_update.call(this);
        this.updateQuestMonitor(); // 注入每帧检测
    };
    
    Game_System.prototype.updateQuestMonitor = function() {
        // 每15帧执行一次，降低性能消耗
        if (Graphics.frameCount % 15 !== 0) return;
        if (!this._questInstances) return;
        for (let i = 0; i < this._questInstances.length; i++) {
            const instance = this._questInstances[i];
            // 只监控正在进行中的任务
            if (instance.status !== 0) continue; 
            const func = getMonitorFunc(instance.templateId);
            if (!func) continue;
            try {
                // 执行监控函数，把当前任务实例传进去，方便获取 itemsNeeded 等自定义数据
                const result = func.call(window, instance);
                // 逻辑分支
                if (result === true) {
                    // 完成
                    window.SimpleQuest.setStatusByUuid(instance.uuid, 1); // 1 = SUCCESS
                } else if (result === false) {
                    // 失败
                    window.SimpleQuest.setStatusByUuid(instance.uuid, 2); // 2 = FAIL
                } else if (typeof result === 'number') {
                    // 更新进度
                    const newProgress = Math.floor(result);
                    if (newProgress !== instance.progress) {
                        // 利用现有API更新，它会自动处理 "进度满了变完成"
                        window.SimpleQuest.setLatestProgress(instance.templateId, newProgress);
                    }
                }
            } catch (e) {
                console.warn("Monitor Runtime Error: " + instance.templateId, e);
            }
        }
    };

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._questInstances = []; 
        this._questHudVisible = true;
        this._questHudDirty = true;
    };

    Game_System.prototype.addQuestInstance = function (instance) {
        this._questInstances.push(instance);
        this.requestHudRefresh();
    };

    Game_System.prototype.removeQuestInstance = function (uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) {
                this._questInstances.splice(i, 1);
                this.requestHudRefresh();
                return;
            }
        }
    };

    Game_System.prototype.countRunningQuests = function () {
        let count = 0;
        for (let i = 0; i < this._questInstances.length; i++) {
            const q = this._questInstances[i];
            if (q.status === Q_STATUS.RUNNING || q.status === Q_STATUS.SUCCESS) {
                count++;
            }
        }
        return count;
    };

    Game_System.prototype.getAllQuests = function (includeHidden = true) {
        // 如果需要获取隐藏任务（默认），直接返回所有
        if (includeHidden) {
            return this._questInstances;
        }
        // 否则进行过滤：筛除掉那些 conditionFunc 返回 false 的任务
        return this._questInstances.filter(q => {
            const tpl = CONFIG.templates[q.templateId];
            // 如果模板不存在，默认视为存在的
            if (!tpl) return true;
            // 如果没有配置条件，默认是显示的
            if (!tpl.conditionFunc) return true;
            
            try {
                // 执行条件函数，返回 truthy 则保留，falsy 则过滤
                return tpl.conditionFunc.call(window);
            } catch (e) {
                // 如果条件执行报错，为了安全起见默认视为可见
                return true;
            }
        });
    };

    Game_System.prototype.getQuestByUuid = function (uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) return this._questInstances[i];
        }
        return null;
    };

    // 获取最新的实例（无论是否完成，只要是最后接的一个）
    // 修改原因：现在允许查询已归档(Completed)的任务，所以不能这里过滤
    Game_System.prototype.getLatestInstance = function (templateId) {
        // 因为是push进去的，所以倒序找就是最新的
        for (let i = this._questInstances.length - 1; i >= 0; i--) {
            if (this._questInstances[i].templateId === templateId) {
                return this._questInstances[i];
            }
        }
        return null;
    };

    // HUD 数据获取逻辑：过滤掉 hidden 的 和 isCompleted 的
    Game_System.prototype.getHudData = function () {
        const groups = {};
        for (let i = 0; i < CONFIG.categories.length; i++) {
            groups[CONFIG.categories[i].id] = {
                meta: CONFIG.categories[i],
                items: []
            };
        }
        for (let i = 0; i < this._questInstances.length; i++) {
            const q = this._questInstances[i];
            
            // 核心修改：如果已归档(Completed)，则不在HUD显示
            if (q.isCompleted) continue;
            if (groups[q.typeId]) {
                groups[q.typeId].items.push(q);
            } else {
                if (!groups['_other']) groups['_other'] = { meta: { name: "其他", color: 0 }, items: [] };
                groups['_other'].items.push(q);
            }
        }
        return groups;
    };

    Game_System.prototype.requestHudRefresh = function () {
        this._questHudDirty = true;
    };

    // ======================================================================
    // 3. 核心显示组件 (Sprite_QuestHUD)
    // ======================================================================
    class Sprite_QuestHUD extends Sprite {
        constructor() {
            super();
            this.createBitmap();
            this._checkTimer = 0;
            this._lastVisibleState = ""; 
            this._targetOpacity = 255; // 目标不透明度
        }

        createBitmap() {
            this.bitmap = new Bitmap(Graphics.width, Graphics.height);
        }

        update() {
            super.update();
            
            // 1. 处理基础可见性 (事件中隐藏 / 战斗中隐藏 / 开关控制)
            this.updateVisibility();

            // 如果已经隐藏，就不跑后面的逻辑了
            if (!this.visible) return;

            // 2. 处理鼠标/玩家接触后的透明度渐变
            this.updateOpacityInteraction();

            // 3. 动态条件检测 (每30帧一次)
            this._checkTimer++;
            if (this._checkTimer >= 15) {
                this._checkTimer = 0;
                this.checkVisibilityCondition();
            }

            if ($gameSystem._questHudDirty) {
                this.refresh();
                $gameSystem._questHudDirty = false;
            }
        }

        updateVisibility() {
            // 新增：开关控制 (优先级最高，如果开关关闭，直接隐藏)
            if (CONFIG.visibleSwitchId && !$gameSwitches.value(CONFIG.visibleSwitchId)) {
                this.visible = false;
                return;
            }

            // 基本逻辑：系统允许 && 非事件流 && 非战斗
            this.visible = $gameSystem._questHudVisible && !$gameMap.isEventRunning() && !$gameParty.inBattle();
        }

        // 新增：检测玩家或鼠标是否并在区域内
        updateOpacityInteraction() {
            const hudX = CONFIG.x;
            const hudY = CONFIG.y;
            const hudW = CONFIG.width;
            const hudH = this._contentHeight || 600;
            let shouldFade = false;
            // 1. 判断鼠标 (受开关控制)
            if (CONFIG.enableMouseOpacity) {
                const pX = $gamePlayer.screenX();
                const pY = $gamePlayer.screenY();
                const playerIn = pX > hudX && pX < hudX + hudW && pY > hudY && pY < hudY + hudH;
                
                if (playerIn) shouldFade = true;
            }

            // 2. 判断玩家
            if (!shouldFade) {
                const mX = TouchInput.x;
                const mY = TouchInput.y;
                const mouseIn = mX > hudX && mX < hudX + hudW && mY > hudY && mY < hudY + hudH;
                if (mouseIn) shouldFade = true;
            }

            // 3. 判断地图名 (受开关控制)
            if (!shouldFade && CONFIG.enableMapNameOpacity) {
                if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._mapNameWindow) {
                    const mapW = SceneManager._scene._mapNameWindow;
                    if (mapW.openness > 0 && mapW.contentsOpacity > 0) {
                        shouldFade = true;
                    }
                }
            }

            this._targetOpacity = shouldFade ? CONFIG.hiddenOpacity : 255;
            // 渐变处理 (保持原样)
            if (this.opacity > this._targetOpacity) {
                this.opacity -= 40;
                if (this.opacity < this._targetOpacity) this.opacity = this._targetOpacity;
            } else if (this.opacity < this._targetOpacity) {
                this.opacity += 40;
                if (this.opacity > this._targetOpacity) this.opacity = this._targetOpacity;
            }
        }

        checkVisibilityCondition() {
            const quests = $gameSystem._questInstances;
            let currentVisibleState = "";
            for (let i = 0; i < quests.length; i++) {
                const q = quests[i];
                if (q.isCompleted) continue; // COMPLETE
                
                const tpl = CONFIG.templates[q.templateId];
                let isVisible = true;

                if (tpl && tpl.conditionFunc) {
                    try {
                        isVisible = tpl.conditionFunc.call(window);
                    } catch (e) {
                        isVisible = true; 
                    }
                }
                
                currentVisibleState += q.uuid + ":" + (isVisible ? "1" : "0") + "|";
            }

            if (this._lastVisibleState !== currentVisibleState) {
                this._lastVisibleState = currentVisibleState;
                $gameSystem.requestHudRefresh(); 
            }
        }

        refresh() {
            this.bitmap.clear();

            // 新增：应用全局描边/阴影颜色配置
            this.bitmap.outlineColor = CONFIG.outlineColor;
            
            if (CONFIG.shadowDist > 0) {
                this.bitmap.context.shadowColor = CONFIG.outlineColor; // 使用配置的颜色作为阴影色
                this.bitmap.context.shadowBlur = 4;
                this.bitmap.context.shadowOffsetX = CONFIG.shadowDist;
                this.bitmap.context.shadowOffsetY = CONFIG.shadowDist;
            }

            const dataGroups = $gameSystem.getHudData();
            const sortedKeys = CONFIG.categories.map(c => c.id);
            if (dataGroups['_other']) sortedKeys.push('_other');

            const layoutInfo = [];
            let nonEmptyGroups = 0;
            
            // --- 第一阶段：计算布局和总高度 ---
            let currentTempY = CONFIG.y + CONFIG.itemPadding;

            for (let i = 0; i < sortedKeys.length; i++) {
                const key = sortedKeys[i];
                const group = dataGroups[key];
                if (!group || group.items.length === 0) continue;

                const visibleItems = group.items.filter(q => {
                    const tpl = CONFIG.templates[q.templateId];
                    if (tpl) {
                        if (tpl.conditionFunc) {
                            try { return tpl.conditionFunc.call(window); } 
                            catch (e) { return true; }
                        }
                    }
                    return true;
                });

                if (visibleItems.length === 0) continue;

                const groupStartY = currentTempY;
                
                let groupHeight = 32;
                for (let i = 0; i < visibleItems.length; i++) {
                    const item = visibleItems[i];
                    const h = this.drawTaskItem(item, 0, 0, CONFIG.width - CONFIG.itemPadding * 2, true);
                    groupHeight += h + CONFIG.itemPadding;
                }

                layoutInfo.push({
                    groupMeta: group.meta,
                    items: visibleItems,
                    y: groupStartY,
                    h: groupHeight
                });
                
                nonEmptyGroups++;
                currentTempY += groupHeight + CONFIG.sectionSpacing;
            }
            
            // 记录真实内容高度，供鼠标检测使用
            this._contentHeight = currentTempY - CONFIG.y;

            if (nonEmptyGroups === 0) {
                this._contentHeight = 0;
                return;
            }

            const totalContentHeight = currentTempY - CONFIG.sectionSpacing + CONFIG.itemPadding;

            // --- 第二阶段：绘制背景 (含修改1：渐变背景) ---
            if (CONFIG.showBg) {
                this.drawRoundedRect(
                    CONFIG.x, 
                    CONFIG.y, 
                    CONFIG.width, 
                    totalContentHeight - CONFIG.y, 
                    CONFIG.borderRadius, 
                    parseColor(CONFIG.bgColor)
                );
            }

            // --- 第三阶段：绘制内容 ---
            const dx = CONFIG.x + CONFIG.itemPadding;
            const dw = CONFIG.width - CONFIG.itemPadding * 2;

            for (let i = 0; i < layoutInfo.length; i++) {
                const layout = layoutInfo[i];
                let dy = layout.y;

                this.drawGroupTitle(layout.groupMeta, CONFIG.x, dy, CONFIG.width);
                dy += 32;

                for (let o = 0; o < layout.items.length; o++) {
                    const item = layout.items[o];
                    const itemH = this.drawTaskItem(item, dx, dy, dw, false);
                    dy += itemH + CONFIG.itemPadding;
                }
            }
        }

        // 修改1: 背景渐变实现
        drawRoundedRect(x, y, w, h, r, color) {
            const ctx = this.bitmap.context;
            ctx.save();
            ctx.beginPath();
            
            // 绘制圆角路径
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            // --- 修改开始：创建渐变填充 ---
            // 创建从左(x)到右(x+w)的线性渐变
            const gradient = ctx.createLinearGradient(x, y, x + w, y);
            
            // 起始点：使用设定颜色
            gradient.addColorStop(0, color);
            
            // 稍微靠右的位置保持一定可见度，防止文字看不清
            gradient.addColorStop(0.3, color); 
            // 终点：完全透明
            // 注意：这里简单处理为透明。如果color是rgba格式，最好提取rgb值，
            // 但为了兼容性，设为完全透明的任意颜色即可，Canvas会自动处理过渡。
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            // --- 修改结束 ---
            ctx.shadowColor = "transparent";
            ctx.fill();
            ctx.restore();
        }

        drawGroupTitle(meta, x, y, fullWidth) {
            if (CONFIG.headerBgColor) {
                const hx = x + 4;
                const hw = fullWidth - 8;
                this.drawRoundedRect(hx, y, hw, 28, 4, parseColor(CONFIG.headerBgColor));
            }

            this.bitmap.fontBold = true;
            this.bitmap.fontSize = CONFIG.fontSizeGroup;
            this.bitmap.outlineWidth = CONFIG.outlineWidth;
            this.bitmap.textColor = parseColor(meta.color);
            
            if (CONFIG.shadowDist > 0) {
                this.bitmap.context.shadowColor = "rgba(0,0,0,0.8)";
            }
            
            this.bitmap.drawText(meta.name, x + 12, y + 2, fullWidth - 24, 24, "left");
            this.bitmap.fontBold = false;
        }

        processText(text, instance) {
            if (!text) return "";
            return text.replace(/{current}/g, instance.progress)
                       .replace(/{max}/g, instance.maxProgress)
                       .replace(/{remain}/g, instance.maxProgress - instance.progress)
                       .replace(/{percent}/g, Math.floor(instance.progress / instance.maxProgress * 100));
        }

        // 修改2 & 3: 标题换行修复 & 失败删除线
        // 修改：增强版绘制逻辑，支持英文按单词换行
        drawTaskItem(instance, x, y, width, dryRun = false) {
            const isEnglish = (typeof TranslateUtils !== 'undefined' && TranslateUtils.currentLanguage === "en-US");
            let cy = y;
            const statusConf = CONFIG.statusText[instance.status] || { text: "", color: 0 };
            const isFailed = (instance.status === 2); // 状态2为失败
            
            // 处理文本中的占位符
            let displayTitle = this.processText(instance.title, instance);
            if (typeof TranslateUtils !== 'undefined') {
                displayTitle = TranslateUtils.getText(displayTitle);
            }
            
            const rewardText = CONFIG.templates[instance.templateId].rewardText;

            // 1. 绘制状态前缀
            this.bitmap.fontSize = CONFIG.fontSizeTitle;
            this.bitmap.outlineWidth = CONFIG.outlineWidth;
            this.bitmap.outlineColor = parseColor(CONFIG.outlineColor);

            let statusText = statusConf.text;
            if (typeof TranslateUtils !== 'undefined') {
                statusText = TranslateUtils.getText(statusText);
            }
            
            const statusWidth = this.bitmap.measureTextWidth(statusText);
            
            if (!dryRun) {
                this.bitmap.textColor = parseColor(statusConf.color);
                this.bitmap.drawText(statusText, x, cy, width, 24, "left");
            }

            // 2. 准备绘制标题 (换行修复逻辑)
            const titleFirstLineX = x + statusWidth; 
            const titleMaxW_First = width - statusWidth; 
            const titleMaxW_Other = width;
            
            this.bitmap.textColor = isFailed ? parseColor(8) : ColorManager.normalColor();

            // --- 新的核心逻辑：标题换行计算 ---
            const fullTitleLines = [];
            
            if (isEnglish) {
                // === 英文逻辑：按单词处理 ===
                const words = displayTitle.split(" ");
                let currentLine = "";
                let isFirstLine = true;
                
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    // 尝试将单词加入当前行（注意空格）
                    const testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
                    const testWidth = this.bitmap.measureTextWidth(testLine);
                    const limitWidth = isFirstLine ? titleMaxW_First : titleMaxW_Other;

                    if (testWidth <= limitWidth) {
                        currentLine = testLine;
                    } else {
                        // 如果单个单词本身就比一行还宽，那就没办法了，只能强制换行或者切断，这里选择推到下一行
                        // 如果当前行不为空，先保存当前行，新单词放下一行
                        if (currentLine.length > 0) {
                            fullTitleLines.push(currentLine);
                            currentLine = word;
                            isFirstLine = false;
                        } else {
                            // 极端情况：单词太长且当前行是空的，直接塞进去（或者可以考虑拆字符，但这很少见）
                            fullTitleLines.push(word);
                            currentLine = "";
                            isFirstLine = false;
                        }
                    }
                }
                if (currentLine.length > 0) {
                    fullTitleLines.push(currentLine);
                }

            } else {
                // === 中文/默认逻辑：按字符处理 ===
                let remainingText = displayTitle;
                
                // 第一行特殊处理（因为有前缀）
                let firstLineText = "";
                let i = 0;
                while (i < remainingText.length) {
                    // 预判加一个字符后的宽度
                    if (this.bitmap.measureTextWidth(firstLineText + remainingText[i]) <= titleMaxW_First) {
                        firstLineText += remainingText[i];
                        i++;
                    } else {
                        break;
                    }
                }
                fullTitleLines.push(firstLineText);
                remainingText = remainingText.substring(i);

                // 后续行调用 wrapText 处理
                if (remainingText.length > 0) {
                    const otherLines = this.wrapText(remainingText, titleMaxW_Other);
                    fullTitleLines.push(...otherLines);
                }
            }

            // 3. 绘制标题循环
            for (let i = 0; i < fullTitleLines.length; i++) {
                const lineStr = fullTitleLines[i];
                // 如果是第一行，X坐标要避让前缀，如果是后续行，顶格(x)
                const drawX = (i === 0) ? titleFirstLineX : x; 
                const drawW = (i === 0) ? titleMaxW_First : titleMaxW_Other;

                if (!dryRun) {
                    this.bitmap.drawText(lineStr, drawX, cy, drawW, 24, "left");

                    // --- 失败状态画删除线 ---
                    if (isFailed) {
                        const lineWidth = this.bitmap.measureTextWidth(lineStr);
                        const ctx = this.bitmap.context;
                        ctx.save();
                        ctx.strokeStyle = this.bitmap.textColor;
                        ctx.lineWidth = 2;
                        ctx.shadowColor = "transparent"; 
                        ctx.beginPath();
                        const lineY = cy + 12; 
                        ctx.moveTo(drawX, lineY);
                        ctx.lineTo(drawX + lineWidth, lineY);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
                
                // 绘制奖励文本 (只在最后一行)
                if (i === fullTitleLines.length - 1 && rewardText) {
                    if (!dryRun) {
                        this.bitmap.fontSize = CONFIG.fontSizeReward;
                        this.bitmap.textColor = parseColor(CONFIG.colorReward);
                        this.bitmap.drawText(rewardText, x, cy + 2, width, 24, "right");
                        this.bitmap.fontSize = CONFIG.fontSizeTitle;
                    }
                }
                cy += 24; 
            }

            // 4. 绘制描述
            if (instance.desc) {
                this.bitmap.fontSize = CONFIG.fontSizeDesc;
                this.bitmap.textColor = parseColor(CONFIG.fontColorDesc);
                
                let processDesc = this.processText(instance.desc, instance);
                if (typeof TranslateUtils !== 'undefined') {
                    processDesc = TranslateUtils.getText(processDesc);
                }

                const descLines = processDesc.split('\n');
                
                for (let l = 0; l < descLines.length; l++) {
                    const rawLine = descLines[l];
                    // 调用修改后的 wrapText
                    const wrappedDescLines = this.wrapText(rawLine, width - 10);
                    
                    for (let wl = 0; wl < wrappedDescLines.length; wl++) {
                        if (!dryRun) {
                            this.bitmap.drawText(wrappedDescLines[wl], x + 10, cy, width - 10, 20, "left");
                        }
                        cy += 20;
                    }
                }
            }

            return cy - y; 
        }

        // 修改：通用换行函数，根据语言判断切割方式
        wrapText(text, maxWidth) {
            if (!text) return [];
            const isEnglish = (typeof TranslateUtils !== 'undefined' && TranslateUtils.currentLanguage === "en-US");

            let lines = [];

            if (isEnglish) {
                // === 英文：空格切割 ===
                const words = text.split(" ");
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    // 尝试 adding space + word
                    const testLine = currentLine + " " + word;
                    const width = this.bitmap.measureTextWidth(testLine);
                    
                    if (width < maxWidth) {
                        currentLine = testLine;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);

            } else {
                // === 中文/其他：字符切割 (原逻辑) ===
                const chars = text.split(""); 
                let currentLine = chars[0];

                for (let i = 1; i < chars.length; i++) {
                    const char = chars[i];
                    const width = this.bitmap.measureTextWidth(currentLine + char);
                    if (width < maxWidth) {
                        currentLine += char;
                    } else {
                        lines.push(currentLine);
                        currentLine = char;
                    }
                }
                lines.push(currentLine);
            }
            
            return lines;
        }
    }

    // ======================================================================
    // 4. 挂载与场景恢复 (Integration)
    // ======================================================================

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createQuestHud();
    };

    Spriteset_Map.prototype.createQuestHud = function () {
        if (this._questHud) return;
        this._questHud = new Sprite_QuestHUD();
        this.addChild(this._questHud);
        $gameSystem.requestHudRefresh();
    };

    // ======================================================================
    // 5. 插件指令注册
    // ======================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "AddQuest", args => {
        window.SimpleQuest.addQuest(args.templateId);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetStatus", args => {
        let s = 0;
        if (args.status === 'success') {
            s = 1;
        } else if (args.status === 'fail') {
            s = 2;
        } else if (args.status === 'active') {
            s = 0;
        }
        window.SimpleQuest.setLatestStatus(args.templateId, s);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetCompleted", args => {
        const isCompleted = args.completed === 'true';
        const force = args.force === 'true';
        window.SimpleQuest.setLatestCompleted(args.templateId, isCompleted, force);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "AddProgress", args => {
        const val = Number(args.value || 1);
        window.SimpleQuest.addLatestProgress(args.templateId, val);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetProgress", args => {
        const val = Number(args.value || 0);
        window.SimpleQuest.setLatestProgress(args.templateId, val);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "UpdateDesc", args => {
        window.SimpleQuest.updateLatestDesc(args.templateId, args.desc);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ShowHud", args => {
        window.SimpleQuest.showHud();
    });

    PluginManager.registerCommand(PLUGIN_NAME, "HideHud", args => {
        window.SimpleQuest.hideHud();
    });

})();