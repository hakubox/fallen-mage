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
 * 在“条件分歧 ➔ 脚本”中使用，用于判断任务流程。
 * 假设你的任务ID是 quest_01。
 *
 * 1. 判断任务是否正在进行
 *    SimpleQuest.isActive("quest_01")
 *    ➔ 返回 true (任务在列表中) / false (未接或已归档)
 *
 * 2. 判断是否已达标 (可以交任务了)
 *    const q = $gameSystem.getLatestInstance("quest_01");
 *    q && q.status === 1
 *    *(注：status 0=进行中, 1=已达标, 2=失败, 3=已归档)*
 *
 * 3. 判断是否曾经接取过 (无论现在是否已完成)
 *    SimpleQuest.hasHistory("quest_01")
 *    ➔ 常用于“一次性任务”判断，如果不希望玩家重复接取。
 *
 * 4. 获取任务完成/领取过几次
 *    SimpleQuest.countHistory("quest_01")
 *    ➔ 返回数字。
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
 * @option 完成(归档消失)
 * @value complete
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
 * @param group1
 * @text ==== 基础信息 ====
 * 
 * @param id
 * @text 任务ID (必填)
 * @parent group1
 * @desc 唯一标识符，脚本和插件指令调用时使用。
 * @type string
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
 *
 * @param r
 * @text 编辑器备注
 * @desc 仅用于在插件列表里方便看，不影响游戏。
 * @type string
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

    const CONFIG = {
        x: Number(PARAMS['hudX'] || 10),
        y: Number(PARAMS['hudY'] || 10),
        width: Number(PARAMS['hudWidth'] || 320),
        maxRunningQuests: Number(PARAMS['maxRunningQuests'] || 5),
        itemPadding: Number(PARAMS['itemPadding'] || 8),
        sectionSpacing: Number(PARAMS['sectionSpacing'] || 24),
        
        showBg: PARAMS['showListBackground'] === 'true',
        bgColor: parseColor(PARAMS['listBackgroundColor'] || 'rgba(0,0,0,0.5)'),
        headerBgColor: parseColor(PARAMS['headerBackgroundColor'] || 'rgba(0,0,0,0.6)'),
        borderRadius: Number(PARAMS['borderRadius'] || 8),
        
        outlineWidth: Number(PARAMS['fontOutlineWidth'] || 3),
        shadowDist: Number(PARAMS['fontShadowDistance'] || 1),
        outlineColor: parseColor(PARAMS['fontOutlineColor'] || '#000000'),
        visibleSwitchId: Number(PARAMS['visibleSwitchId'] || 0),
        hiddenOpacity: Number(PARAMS['hiddenOpacity'] || 50),

        fontSizeGroup: Number(PARAMS['fontSizeGroup'] || 16),
        fontSizeTitle: Number(PARAMS['fontSizeTitle'] || 15),
        fontSizeReward: Number(PARAMS['fontSizeReward'] || 14),
        colorReward: parseColor(PARAMS['fontColorReward'] || 0), // 这里复用parseColor处理颜色
        fontSizeDesc: Number(PARAMS['fontSizeDesc'] || 13),
        fontColorDesc: parseColor(PARAMS['fontColorDesc'] || 'rgba(220, 220, 220, 0.9)'),

        globalSe: {
            accept: PARAMS['seAccept'],
            success: PARAMS['seSuccess'],
            fail: PARAMS['seFail']
        },

        statusText: {
            0: { text: PARAMS['textRunning'], color: parseColor(PARAMS['colorRunning']) },
            1: { text: PARAMS['textSuccess'], color: parseColor(PARAMS['colorSuccess']) },
            2: { text: PARAMS['textFail'],    color: parseColor(PARAMS['colorFail']) },
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
        FAIL: 2,
        COMPLETE: 3
    };

    // ======================================================================
    // 1. 全局管理器 (Window Context) & Utilities
    // ======================================================================

    window.SimpleQuest = {
        
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

            if ((status === Q_STATUS.SUCCESS || status === Q_STATUS.COMPLETE) && instance.progress < instance.maxProgress) {
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
                else if (status === Q_STATUS.COMPLETE) {
                    reserveCommonEvent(template.ceComplete);
                    this._evalCode(template.onComplete, instance);
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

            if (instance.status === Q_STATUS.FAIL || instance.status === Q_STATUS.COMPLETE) return;

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
         * 判断任务是否处在“进行中”状态 (进行中 或 成功待提交)
         * @param {string} templateId 
         * @returns {boolean}
         */
        isActive(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            // getLatestInstance 会忽略 COMPLETE 的，但我们需要明确 RUNNING 或 SUCCESS
            if (instance && (instance.status === Q_STATUS.RUNNING)) {
                return true;
            }
            return false;
        },
        /**
         * 判断任务是否处在“成功”状态
         * @param {string} templateId 
         * @returns {boolean}
         */
        isSuccess(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            // getLatestInstance 会忽略 COMPLETE 的，但我们需要明确 RUNNING 或 SUCCESS
            if (instance && (instance.status === Q_STATUS.SUCCESS)) {
                return true;
            }
            return false;
        },
        /**
         * 判断任务是否处在“失败”状态
         * @param {string} templateId 
         * @returns {boolean}
         */
        isFail(templateId) {
            const instance = $gameSystem.getLatestInstance(templateId);
            // getLatestInstance 会忽略 COMPLETE 的，但我们需要明确 RUNNING 或 SUCCESS
            if (instance && (instance.status === Q_STATUS.FAIL)) {
                return true;
            }
            return false;
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
            const allQuests = $gameSystem.getAllQuests(); // 访问原始数组
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
        for (const instance of this._questInstances) {
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

    Game_System.prototype.getAllQuests = function () {
        return this._questInstances;
    };

    Game_System.prototype.getQuestByUuid = function (uuid) {
        for (let i = 0; i < this._questInstances.length; i++) {
            if (this._questInstances[i].uuid === uuid) return this._questInstances[i];
        }
        return null;
    };

    Game_System.prototype.getLatestInstance = function (templateId) {
        for (let i = this._questInstances.length - 1; i >= 0; i--) {
            if (this._questInstances[i].templateId === templateId) {
                if (this._questInstances[i].status !== Q_STATUS.COMPLETE) {
                    return this._questInstances[i];
                }
            }
        }
        return null;
    };

    // 该方法仅获取“应该在HUD中显示”的数据，不负责过滤Condition
    // Condition过滤转移到 HUD update 中动态处理
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
            
            // 已归档不显示
            if (q.status === Q_STATUS.COMPLETE) continue;

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

            for (const q of quests) {
                if (q.status === 3) continue; // COMPLETE
                
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
                    if (tpl && tpl.conditionFunc) {
                        try { return tpl.conditionFunc.call(window); } 
                        catch (e) { return true; }
                    }
                    return true;
                });

                if (visibleItems.length === 0) continue;

                const groupStartY = currentTempY;
                
                let groupHeight = 32; 
                for (const item of visibleItems) {
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
                    CONFIG.bgColor
                );
            }

            // --- 第三阶段：绘制内容 ---
            const dx = CONFIG.x + CONFIG.itemPadding;
            const dw = CONFIG.width - CONFIG.itemPadding * 2;

            for (const layout of layoutInfo) {
                let dy = layout.y;

                this.drawGroupTitle(layout.groupMeta, CONFIG.x, dy, CONFIG.width);
                dy += 32;

                for (const item of layout.items) {
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
                this.drawRoundedRect(hx, y, hw, 28, 4, CONFIG.headerBgColor);
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
        drawTaskItem(instance, x, y, width, dryRun = false) {
            let cy = y;
            const statusConf = CONFIG.statusText[instance.status] || { text: "", color: 0 };
            const isFailed = (instance.status === 2); // 状态2为失败
            
            const displayTitle = this.processText(instance.title, instance);
            const rewardText = CONFIG.templates[instance.templateId].rewardText;

            // 1. 绘制状态前缀
            this.bitmap.fontSize = CONFIG.fontSizeTitle;
            this.bitmap.outlineWidth = CONFIG.outlineWidth;
            this.bitmap.outlineColor = CONFIG.outlineColor; // 使用配置颜色

            const statusText = statusConf.text;
            const statusWidth = this.bitmap.measureTextWidth(statusText);
            
            if (!dryRun) {
                this.bitmap.textColor = statusConf.color;
                this.bitmap.drawText(statusText, x, cy, width, 24, "left");
            }

            // 2. 准备绘制标题 (换行修复逻辑)
            const titleFirstLineX = x + statusWidth; 
            const titleMaxW = width - statusWidth; 
            
            this.bitmap.textColor = isFailed ? parseColor(8) : ColorManager.normalColor();

            // 构建行数组：第一行跟在前缀后，后续行顶格
            const fullTitleLines = [];
            let remainingText = displayTitle;
            
            // 计算第一行
            let firstLineText = "";
            let i = 0;
            while (i < remainingText.length) {
                if (this.bitmap.measureTextWidth(firstLineText + remainingText[i]) <= titleMaxW) {
                    firstLineText += remainingText[i];
                    i++;
                } else {
                    break;
                }
            }
            fullTitleLines.push(firstLineText);
            remainingText = remainingText.substring(i);

            // 如果还有剩余，按完整宽度切分
            if (remainingText.length > 0) {
                const otherLines = this.wrapText(remainingText, width);
                fullTitleLines.push(...otherLines);
            }

            // 3. 绘制标题循环
            for (let i = 0; i < fullTitleLines.length; i++) {
                const lineStr = fullTitleLines[i];
                const drawX = (i === 0) ? titleFirstLineX : x; 
                const drawW = (i === 0) ? titleMaxW : width;

                if (!dryRun) {
                    this.bitmap.drawText(lineStr, drawX, cy, drawW, 24, "left");

                    // --- 失败状态画删除线 ---
                    if (isFailed) {
                        const lineWidth = this.bitmap.measureTextWidth(lineStr);
                        const ctx = this.bitmap.context;
                        ctx.save();
                        ctx.strokeStyle = this.bitmap.textColor; // 线条颜色同文字
                        ctx.lineWidth = 2;
                        // 清除阴影防止线条太粗
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
                        this.bitmap.textColor = CONFIG.colorReward;
                        this.bitmap.drawText(rewardText, x, cy + 2, width, 24, "right");
                        this.bitmap.fontSize = CONFIG.fontSizeTitle;
                    }
                }
                cy += 24; 
            }

            // 4. 绘制描述
            if (instance.desc) {
                this.bitmap.fontSize = CONFIG.fontSizeDesc;
                this.bitmap.textColor = CONFIG.fontColorDesc;
                
                const processDesc = this.processText(instance.desc, instance);
                const descLines = processDesc.split('\n');
                
                for (let l = 0; l < descLines.length; l++) {
                    const rawLine = descLines[l];
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

        wrapText(text, maxWidth) {
            if (!text) return [];
            const words = text.split(""); 
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = this.bitmap.measureTextWidth(currentLine + word);
                if (width < maxWidth) {
                    currentLine += word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
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
        if (args.status === 'success') s = 1;
        else if (args.status === 'fail') s = 2;
        else if (args.status === 'complete') s = 3;

        window.SimpleQuest.setLatestStatus(args.templateId, s);
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

})();